import * as redis from 'redis'

import { REDIS_URL } from '../env'

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

export function setKey(key: string, data: unknown): void {
  if (!client) {
    throw new Error('Call initRedis first')
  }

  client.set(key, data, redis.print)
}

export function getKey(key: string): string {
  if (!client) {
    throw new Error('Call initRedis first')
  }

  return client.get(key, redis.print)
}

export function hasKey(key: string): boolean {
  return !!getKey(key)
}
