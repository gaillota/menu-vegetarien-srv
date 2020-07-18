import parseMenu from '../parsers/menu'
import { Index, WeeklyMenu } from '../types'
import { api } from '../api'
import { getObjectById } from '../algolia'

async function getRecipeFromSlug(slug): Promise<object> | null {
  if (!slug) {
    return null
  }

  try {
    return getObjectById(Index.Menus, slug)
  } catch (e) {
    return null
  }
}

async function getMenu(slug): Promise<WeeklyMenu> {
  const result = await api(`/${slug}`)
  const menu = parseMenu(result)
  const updatedDailyMenus = []

  for (const dailyMenu of menu.dailyMenus) {
    const {
      starter: starterSlug,
      dish: dishSlug,
      dessert: dessertSlug,
    } = dailyMenu

    const starter = await getRecipeFromSlug(starterSlug.slug)
    const dish = await getRecipeFromSlug(dishSlug.slug)
    const dessert = await getRecipeFromSlug(dessertSlug.slug)

    if (!starter || !dish || !dessert) {
      throw new Error(`Missing recipe for menu ${slug}`)
    }

    updatedDailyMenus.push({
      starter,
      dish,
      dessert,
    })
  }

  menu.slug = slug
  menu.dailyMenus = updatedDailyMenus

  return menu
}

export default getMenu
