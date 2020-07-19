import parseMenu from '../parsers/menu'
import { WeeklyMenu } from '../types'
import { api } from '../api'
import { sendToRecipeFilterer } from '../workers/recipeFilterer'

async function getMenu(slug): Promise<WeeklyMenu> {
  const result = await api(`/${slug}`)
  const menu = parseMenu(result)

  console.log(JSON.stringify(menu, null, 2))

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

  return menu
}

export default getMenu
