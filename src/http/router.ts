import * as Router from '@koa/router'
import { Context } from 'koa'
import { main as indexNewRecipes } from '../scripts/indexNewRecipes'
import { main as indexNewMenus } from '../scripts/indexNewMenus'
import { Notification } from '../types'
import { sendNotification } from '../workers/apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'
import { validateBody } from './middlewares/validateBody'
import { NotificationSchema } from './schemas/notification'
import { isEnv } from "./middlewares/isEnv";

const router = new Router()

router.get('/index-new-recipes', async (ctx: Context) => {
  await indexNewRecipes()
  ctx.status = 200
  ctx.body = 'Ok'
})

router.get('/index-new-menus', async (ctx: Context) => {
  await indexNewMenus()
  ctx.status = 200
  ctx.body = 'Ok'
})

router.post(
  '/push-notification',
  isEnv('development'),
  validateBody(NotificationSchema),
  async (ctx: Context) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const notification: Notification = ctx.request.body

    await sendNotification({
      notification,
      devicesIds: [OWNER_DEVICE_ID],
    })
  },
)

export default router
