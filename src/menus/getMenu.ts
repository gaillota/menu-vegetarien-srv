import * as flow from 'lodash/fp/flow'
import * as get from 'lodash/fp/get'
import parseMenu from '../parsers/menu'
import { Menu } from '../types'
import { api } from '../api'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'
import { translateDateString } from './utils'
import { dateToTimestamp } from '../utils'
import { checkMenu } from './checkIntegrity'

async function getMenu(slug: string): Promise<Menu> {
  const result = await api(`/${slug}`)
  const parsedMenu = parseMenu(result)
  const menu: Menu = {
    ...parsedMenu,
    slug,
    dateTimestamp: flow(
      get('date'),
      translateDateString,
      dateToTimestamp,
    )(parsedMenu),
  }

  checkMenu(menu)

  // Send every recipe in parser worker in case not parsed yet
  for (const dailyMenu of parsedMenu.dailyMenus) {
    await Promise.all(
      dailyMenu.map(({ slug }) => {
        if (!slug) {
          return Promise.resolve()
        }

        return sendToRecipeFilterer(slug)
      }),
    )
  }

  return menu
}

export default getMenu
