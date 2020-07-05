import * as Router from '@koa/router'
import { Context } from 'koa'
import { indexAllRecipes } from '../scripts/indexAllRecipes'

const router = new Router()

router.get('/index-new-recipes', async (ctx: Context) => {
  await indexAllRecipes()
  ctx.status = 200
  ctx.body = 'Ok'
})

export default router
