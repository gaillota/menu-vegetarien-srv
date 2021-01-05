import * as cheerio from 'cheerio'
import { dateRegex, recipeSlugRegex } from '../constants'
import { Menu } from '../types'
import { cleanString } from '../utils'

function getDescription($): string {
  let description = $('div.elementor-text-editor p').eq(1).text()

  if (!description) {
    description = $('div.blog-main div.blog-content p').eq(0).text()
  }

  return description
}

function getSections($) {
  return $('div.elementor-inner > div.elementor-section-wrap > section')
}

function isDailyMenu($row, $html): boolean {
  return (
    $row.find($html('div.elementor-element.elementor-col-33')).length === 3 ||
    $row.find($html('article.elementor-post.elementor-grid-item')).length === 3
  )
}

function getMeals($row, $html) {
  const $meals = $row.find($html('div.elementor-element.elementor-col-33'))

  if ($meals.length > 0) {
    return $meals
  }

  return $row.find($html('article.elementor-post.elementor-grid-item'))
}

function getMealTitle($meal): string {
  let title = $meal
    .find('div.elementor-widget-wrap > div.elementor-widget-text-editor a')
    .text()

  if (!title) {
    title = $meal.find('div.elementor-widget-heading a').text()
  }

  if (!title) {
    title = $meal
      .find('div.elementor-post__text > div.elementor-post__title a')
      .text()
  }

  return cleanString(title)
}

function getMealUrl($meal): string {
  let url = $meal.find('div.elementor-image a').attr('href')

  if (!url) {
    url = $meal.find('a.elementor-post__thumbnail__link').attr('href')
  }

  return url
}

function getMealSlug($meal): string {
  const url = getMealUrl($meal)
  const [, slug] = recipeSlugRegex.exec(url) || []

  return slug
}

function getMealPhotoUrl($meal): string {
  let url = $meal
    .find('div.elementor-widget-wrap > div.elementor-widget-image img')
    .attr('src')

  if (!url) {
    url = $meal.find('a.elementor-post__thumbnail__link img').attr('src')
  }

  return url
}

function parseMenu(
  html: string,
): Pick<Menu, 'title' | 'description' | 'photoUrl' | 'date' | 'dailyMenus'> {
  const $html = cheerio.load(html)
  const title = cleanString($html('div.blog-main > h1').text())
  const description = cleanString(getDescription($html))
  const photoUrl = $html(
    'div.blog-main > div.blog-rightsidebar-img > img',
  ).attr('src')
  const [date] = dateRegex.exec(description.toLowerCase()) || []
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
  }
}

export default parseMenu
