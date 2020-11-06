import * as cheerio from 'cheerio'

import { pageLabelRegex, recipeSlugRegex } from '../constants'
import { PaginationResult } from '../types'

export function parseRecipesList(
  html: string,
): Pick<PaginationResult<string>, 'data' | 'pagesCount'> {
  const $ = cheerio.load(html)

  const slugs = []

  $('div.elementor-posts article').each((_, element) => {
    const $recipe = $(element)
    const url = $recipe
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href')
    const [, slug] = recipeSlugRegex.exec(url) || []

    slugs.push(slug)
  })

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text()
  const [, pagesCountText] =
    pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || []

  return { data: slugs, pagesCount: Number(pagesCountText) }
}

export function parseRecipesListLight(
  html: string,
): Pick<PaginationResult<string>, 'data'> {
  const $ = cheerio.load(html)

  const slugs = []

  $('div.elementor-posts article').each((_, element) => {
    const $recipe = $(element)
    const url = $recipe
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href')
    const [, slug] = recipeSlugRegex.exec(url) || []

    slugs.push(slug)
  })

  return { data: slugs }
}
