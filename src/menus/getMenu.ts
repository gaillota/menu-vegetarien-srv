import * as flow from 'lodash/fp/flow'
import * as get from 'lodash/fp/get'
import parseMenu from '../parsers/menu'
import { WeeklyMenu } from '../types'
import { api } from '../api'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'
import { translateDateString } from './utils'
import { dateToTimestamp } from '../utils'

async function getMenu(slug: string): Promise<WeeklyMenu> {
  const result = await api(`/${slug}`)
  const menu = parseMenu(result)

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

  menu.slug = slug
  menu.dateTimestamp = flow(get('date'), translateDateString, dateToTimestamp)(menu)

  return menu
}

export default getMenu
