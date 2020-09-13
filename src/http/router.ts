import * as Router from '@koa/router'
import { Context } from 'koa'
import { main as indexNewRecipes } from '../scripts/indexNewRecipes'
import { main as indexNewMenus } from '../scripts/indexNewMenus'

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

export default router
