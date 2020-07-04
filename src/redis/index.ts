import * as redis from 'redis'

import { REDIS_URL } from "../env";

const client = redis.createClient({
  url: REDIS_URL
})

client.on('error', function (error) {
  console.error('Redis error:', error)
})

export function setKey(key: string, data: unknown): void {
  client.set(key, data, redis.print)
}

export function getKey(key: string): string {
  return client.get(key, redis.print)
}

export function hasKey(key: string): boolean {
  return !!getKey(key)
}
