import * as cheerio from 'cheerio'
import { dateRegex, recipeSlugRegex } from '../constants'
import { WeeklyMenu } from '../types'

const menuIndexes = [2, 4, 7, 9, 11]
const indexToMeal = {
  0: 'starter',
  1: 'dish',
  2: 'dessert',
}

function parseMenu(html): WeeklyMenu {
  const $ = cheerio.load(html)
  const title = $('div.blog-main > h1').text()
  const description = $('div.elementor-text-editor p').eq(1).text()
  const photoUrl = $('div.blog-main > div.blog-rightsidebar-img > img').attr(
    'src',
  )
  const [date] = dateRegex.exec(title.toLowerCase()) || []

  const dailyMenus = []
  $('div.elementor-section-wrap > section').each((index, element) => {
    if (menuIndexes.includes(index)) {
      const $menu = $(element)
      const menu = {}

      $menu.find('div.elementor-col-33').each((index, element) => {
        const $meal = $(element)
        const $link = $meal.find('div.elementor-widget-text-editor a')
        const url = $link.attr('href')
        const [, slug] = recipeSlugRegex.exec(url) || []

        menu[indexToMeal[index]] = {
          slug,
        }
      })

      dailyMenus.push(menu)
    }
  })

  return {
    title,
    description,
    photoUrl,
    date,
    dailyMenus,
    slug: null,
  }
}

export default parseMenu
