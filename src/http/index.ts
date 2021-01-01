import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import router from './router'

export async function initHttp(): Promise<Koa> {
  const app = new Koa()

  app.use(
    cors({
      origin: '*',
      credentials: true,
      allowHeaders:
        'Authorization, Origin, X-Requested-With, Content-Type, Accept',
      keepHeadersOnError: true,
    }),
  )
  app.use(bodyParser())
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.body = {
        type: err.message || '',
        original: err,
      }
      ctx.status = err.status || 500
    }
  })
  app.use(logger())
  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
