import { ApolloServer, gql } from 'apollo-server'
import { getKey, setKey } from '../redis'
import { DeviceToken } from '../types'
import { main as indexNewRecipes } from '../scripts/indexNewRecipes'
import { main as indexNewMenus } from '../scripts/indexNewMenus'
import { sendNotification } from '../workers/apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'
import { sendToRecipeParser } from '../workers/recipeParser'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'
import IsEnvDirective from './directives/isEnv'

const typeDefs = gql`
  directive @isEnv(envName: String = "development") on FIELD_DEFINITION

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
    indexNewRecipe(slug: String!): Boolean
    indexNewRecipes: Boolean
    indexNewMenus: Boolean
  }

  type Mutation {
    pushNotification(notification: Notification): Boolean
      @isEnv(envName: "development")
    setDeviceToken(deviceToken: DeviceToken!): Boolean
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
  return new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      isEnv: IsEnvDirective,
    },
  })
}
