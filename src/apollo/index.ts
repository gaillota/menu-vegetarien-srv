import { ApolloServer, gql } from 'apollo-server'
import { Signale } from 'signale'
import * as chalk from 'chalk'
import { getKey, setKey } from '../redis'
import { DeviceToken, User } from '../types'
import { main as indexNewRecipes } from '../scripts/indexNewRecipes'
import { main as indexNewMenus } from '../scripts/indexNewMenus'
import { sendNotification } from '../workers/apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'
import { sendToRecipeParser } from '../workers/recipeParser'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'
import { getToken, getUserFromToken } from './utils'
import { IsAuthenticatedDirective } from './directives/isAuthenticated'

const signale = new Signale({ scope: 'apollo' })

const typeDefs = gql`
  directive @isAuthenticated on QUERY | FIELD | FIELD_DEFINITION

  enum NotificationType {
    ALERT
    BACKGROUND
  }

  input Notification {
    title: String!
    body: String
    expiry: Int
    type: NotificationType
  }

  input DeviceToken {
    os: String
    token: String!
  }

  type Query {
    indexNewRecipe(slug: String!): Boolean @isAuthenticated
    indexNewRecipes: Boolean @isAuthenticated
    indexNewMenus: Boolean @isAuthenticated
  }

  type Mutation {
    pushNotification(notification: Notification): Boolean @isAuthenticated
    setDeviceToken(deviceToken: DeviceToken!): Boolean @isAuthenticated
  }
`

const resolvers = {
  Query: {
    indexNewRecipe: async (_, { slug, force }) => {
      if (force) {
        await sendToRecipeParser(slug)
        return true
      }

      await sendToRecipeFilterer(slug)
      return true
    },
    indexNewRecipes: async () => {
      await indexNewRecipes()

      return true
    },
    indexNewMenus: async () => {
      await indexNewMenus()

      return true
    },
  },
  Mutation: {
    pushNotification: async (_, { notification }) => {
      await sendNotification({
        notification,
        devicesIds: [OWNER_DEVICE_ID],
      })

      return true
    },
    setDeviceToken: async (_, { deviceToken }) => {
      const { os, token } = deviceToken
      const tokenString = await getKey(`device.token.${token}`)
      let tokenData: DeviceToken = null

      try {
        tokenData = JSON.parse(tokenString)
      } catch (e) {
        // No token exists
      }

      if (!tokenData || tokenData.token !== token) {
        tokenData = {
          os,
          token,
          createdAt: Date.now(),
        }

        await setKey(
          `device.token.${tokenData.token}`,
          JSON.stringify(tokenData),
        )
        return true
      }

      return false
    },
  },
}

export async function initApollo(): Promise<ApolloServer> {
  const defaultUser: User = {
    id: '1',
  }
  const token = getToken(defaultUser)

  signale.success(chalk`{yellow JWT token} for default user: {green ${token}}`)

  return new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      isAuthenticated: IsAuthenticatedDirective,
    },
    context: ({ req }) => {
      const token = req.headers.authorization || ''
      const user = getUserFromToken(token)

      return { user }
    },
  })
}
