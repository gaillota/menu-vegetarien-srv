import * as Router from '@koa/router'
import { Context } from 'koa'
import { indexNewRecipes } from '../scripts/indexNewRecipes'

const router = new Router()

router.get('/index-new-recipes', async (ctx: Context) => {
  await indexNewRecipes()
  ctx.status = 200
  ctx.body = 'Ok'
})

export default router
