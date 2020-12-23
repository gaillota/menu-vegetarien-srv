import * as cheerio from 'cheerio'
import { dateRegex, recipeSlugRegex } from '../constants'
import { WeeklyMenu } from '../types'
import { cleanString } from '../utils'

function getSections($) {
  return $('div.elementor-inner > div.elementor-section-wrap > section')
}

// div.elementor-widget-wrap > div.elementor-widget-divider
// div.elementor-widget-wrap > section.elementor-section > div.elementor-container > div.elementor-row > 3 * div.elementor-column

function isDailyMenu($row, $html): boolean {
  return $row.find($html('div.elementor-element.elementor-col-33')).length === 3
}

function getMeals($row, $html) {
  return $row.find($html('div.elementor-element.elementor-col-33'))
}

function getMealTitle($meal): string {
  return cleanString(
    $meal
      .find('div.elementor-widget-wrap > div.elementor-widget-text-editor a')
      .text(),
  )
}

function getMealSlug($meal): string {
  const $link = $meal.find(
    'div.elementor-widget-wrap > div.elementor-widget-text-editor a',
  )
  const url = $link.attr('href')
  const [, slug] = recipeSlugRegex.exec(url) || []

  return slug
}

function getMealPhotoUrl($meal): string {
  return $meal
    .find('div.elementor-widget-wrap > div.elementor-widget-image img')
    .attr('src')
}

function getMealUrl($meal): string {
  const $link = $meal.find(
    'div.elementor-widget-wrap > div.elementor-widget-text-editor a',
  )

  return $link.attr('href')
}

function parseMenu(html: string): WeeklyMenu {
  const $html = cheerio.load(html)
  const title = cleanString($html('div.blog-main > h1').text())
  const description = cleanString(
    $html('div.elementor-text-editor p').eq(1).text(),
  )
  const photoUrl = $html(
    'div.blog-main > div.blog-rightsidebar-img > img',
  ).attr('src')
  const [date] = dateRegex.exec(title.toLowerCase()) || []
  const $sections = getSections($html)
  const dailyMenus = []

  $sections.each((_, element) => {
    const $row = $html(element)

    if (isDailyMenu($row, $html)) {
      const $meals = getMeals($row, $html)
      const menu = []

      $meals.each((_, element) => {
        const $meal = $html(element)
        const title = getMealTitle($meal)
        const slug = getMealSlug($meal)
        const photoUrl = getMealPhotoUrl($meal)
        const url = getMealUrl($meal)
        const recipe = {
          title,
          slug,
          photoUrl,
          url,
        }

        // an apple a day keeps the doctor away
        if (!recipe.title) {
          const $link = $meal.find('div.elementor-text-editor > div')
          recipe.title = $link.text()
        }

        menu.push(recipe)
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
    dateTimestamp: null,
  }
}

export default parseMenu
