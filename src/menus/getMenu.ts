import * as flow from 'lodash/fp/flow'
import * as get from 'lodash/fp/get'
import parseMenu from '../parsers/menu'
import { WeeklyMenu } from '../types'
import { api } from '../api'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'
import { translateDateString } from './utils'
import { dateToTimestamp } from '../utils'
import { checkMenu } from "./integrity";

async function getMenu(slug: string): Promise<WeeklyMenu> {
  const result = await api(`/${slug}`)
  const menu = parseMenu(result)
  menu.slug = slug
  menu.dateTimestamp = flow(
    get('date'),
    translateDateString,
    dateToTimestamp,
  )(menu)

  checkMenu(menu)

  // Send every recipe in parser worker in case not parsed yet
  for (const dailyMenu of menu.dailyMenus) {
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
