import { IncomingMessage, ServerResponse } from 'http'
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import { Signale } from 'signale'
import router from './router'

const signale = new Signale({ scope: 'koa' })

export async function initHttp(): Promise<
  (req: IncomingMessage, res: ServerResponse) => void
> {
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
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      signale.fatal(err)
      ctx.body = {
        type: err.message || '',
        original: err,
      }
      ctx.status = err.status || 500
    }
  })
  app.use(bodyParser())
  app.use(logger())
  app.use(router.routes())
  app.use(router.allowedMethods())

  return app.callback()
}
