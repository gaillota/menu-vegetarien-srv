import * as cheerio from 'cheerio'
import { dateRegex, recipeSlugRegex } from '../constants'
import { WeeklyMenu } from '../types'

function getSections($) {
  return $('div.elementor-section-wrap > section')
}

function getRow($html) {
  return $html.find('div.elementor-widget-container').children().first()
}

function isDailyMenu($row, index): boolean {
  return (
    $row.hasClass('elementor-posts-container') || menuIndexes.includes(index)
  )
}

function getMeals($row) {
  return (
    $row.find('article.elementor-post') || $row.find('div.elementor-col-33')
  )
}

function getMealTitle($meal): string {
  let title = $meal
    .find('div.elementor-post__text div.elementor-post__title a')
    .text()
    .trim()

  if (!title) {
    const $link = $meal.find('div.elementor-text-editor a')
    title = $link.text()
  }

  return title
}

function getMealSlug($meal): string {
  const $link = $meal.find('a.elementor-post__thumbnail__link')
  const url = $link.attr('href')
  let [, slug] = recipeSlugRegex.exec(url) || []

  if (!slug) {
    const url = $link.attr('href')
    const [, result] = recipeSlugRegex.exec(url) || []
    slug = result
  }

  return slug
}

function getMealPhotoUrl($meal): string {
  const $link = $meal.find('a.elementor-post__thumbnail__link')
  let photoUrl = $link.find('div.elementor-post__thumbnail img').attr('src')

  if (!photoUrl) {
    photoUrl = $meal.find('div.elementor-widget-image img').attr('src')
  }

  return photoUrl
}

function getMealUrl($meal): string {
  const $link = $meal.find('a.elementor-post__thumbnail__link')
  let url = $link.attr('href')

  if (!url) {
    const $link = $meal.find('div.elementor-text-editor a')
    url = $link.attr('href')
  }

  return url
}

const menuIndexes = [2, 4, 7, 9, 11]

function parseMenu(html: string): WeeklyMenu {
  const $ = cheerio.load(html)
  const title = $('div.blog-main > h1').text()
  const description = $('div.elementor-text-editor p').eq(1).text()
  const photoUrl = $('div.blog-main > div.blog-rightsidebar-img > img').attr(
    'src',
  )
  const [date] = dateRegex.exec(title.toLowerCase()) || []
  const $sections = getSections($)
  const dailyMenus = []

  $sections.each((index, element) => {
    const $section = $(element)
    const $row = getRow($section)

    if (isDailyMenu($row, index)) {
      const $meals = getMeals($row)
      const menu = []

      $meals.each((_, element) => {
        const $meal = $(element)
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
