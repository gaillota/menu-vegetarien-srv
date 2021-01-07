import * as jwt from 'jsonwebtoken'
import { User } from '../types'
import { JWT_SECRET } from '../env'

export function getToken(user: User): string {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_TOKEN in env vars')
  }

  return jwt.sign(user, JWT_SECRET)
}

export function getUserFromToken(token: string): User {
  // Decrypt token
  let user = null

  try {
    user = jwt.verify(token, JWT_SECRET)
  } catch (e) {
    // Missing or wrong token
  }

  return user
}
