import * as cheerio from 'cheerio'

import { dateRegex, pageLabelRegex } from '../constants'
import { ParsingResult, WeeklyMenu } from '../types'

function parseWeeklyMenus(html): ParsingResult<WeeklyMenu> {
  const $ = cheerio.load(html)

  const menus = []

  $('div.elementor-posts article').each((_, element) => {
    const $menu = $(element)
    const photoUrl = $menu.find('div.elementor-post__thumbnail img').attr('src')
    const title = $menu
      .find('div.elementor-post__text > h3.elementor-post__title')
      .text()
      .replace(/\n/g, '')
      .replace(/\t/g, '')
    const description = $menu
      .find(
        'div.elementor-post__text > div.elementor-post__excerpt p:first-of-type',
      )
      .text()
    const url = $menu
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href')
    const [date] = dateRegex.exec(title.toLowerCase()) || []

    const menu = {
      title,
      description,
      photoUrl,
      url,
      date,
    }

    menus.push(menu)
  })

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text()
  const [, pagesCountText] =
    pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || []

  return { data: menus, pagesCount: Number(pagesCountText) }
}

export default parseWeeklyMenus
