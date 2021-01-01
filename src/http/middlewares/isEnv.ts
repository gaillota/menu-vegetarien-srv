import { Context, Next } from 'koa'
import { METHOD_NOT_ALLOWED } from 'http-status'
import { ENV } from '../../env'

export function isEnv(envName: string) {
  return async function isEnvMiddleware(
    ctx: Context,
    next: Next,
  ): Promise<void> {
    if (typeof envName !== 'string' || ENV !== envName) {
      ctx.status = METHOD_NOT_ALLOWED
      ctx.body = `Method only allowed in ${envName}`
      return
    }

    await next()
  }
}
