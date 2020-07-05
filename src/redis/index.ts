import * as redis from 'redis'
import * as chalk from 'chalk'
import { Signale } from 'signale'

import { REDIS_URL } from '../env'

const signale = new Signale({ scope: 'redis' })
let client = null

export async function initRedis(): Promise<void> {
  return new Promise((resolve, reject) => {
    client = redis.createClient({
      url: REDIS_URL,
    })

    client.on('ready', () => resolve())
    client.on('error', reject)
  })
}

export function setKey(key: string, data: unknown): Promise<void> {
  if (!client) {
    throw new Error('Call initRedis first')
  }

  signale.await(
    chalk`Saving {yellow "${key}: ${JSON.stringify(data)}"} in datastore...`,
  )

  return new Promise((resolve, reject) => {
    client.set(key, data, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

export function getKey(key: string): Promise<string> {
  if (!client) {
    throw new Error('Call initRedis first')
  }

  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })
}

export async function hasKey(key: string): Promise<boolean> {
  const value = await getKey(key)

  return !!value
}
