require('dotenv').config();
import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as logger from 'koa-logger';
import * as cors from '@koa/cors';
import { initRabbit } from './rabbitmq';
import * as signale from 'signale';

const app = new Koa()
const router = new Router()

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

Promise.all([initRabbit()])
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      signale.success(`🚀  Server ready at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    signale.error(error)
    signale.error(`Could not init server`)
  })

