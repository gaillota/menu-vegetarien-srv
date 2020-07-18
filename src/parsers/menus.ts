import * as cheerio from 'cheerio'

import { menuSlugRegex, pageLabelRegex } from "../constants";
import { ParsingResult } from '../types'

function parseMenus(html): ParsingResult<string> {
  const $ = cheerio.load(html)

  const slugs = []

  $('div.elementor-posts article').each((_, element) => {
    const $menu = $(element)
    const url = $menu
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href')
    const [, slug] = menuSlugRegex.exec(url) || []

    slugs.push(slug)
  })

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text()
  const [, pagesCountText] =
    pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || []

  return { data: slugs, pagesCount: Number(pagesCountText) }
}

export default parseMenus
