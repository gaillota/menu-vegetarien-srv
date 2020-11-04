import * as request from 'request-promise'

import { parseRecipesList, parseRecipesListLight } from '../parsers/recipes'
import { baseUrl } from '../constants'
import { PaginationResult, PaginationResultLight } from '../types'
import parsePagesNumber from '../parsers/pages'

function buildUrl({ page }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`
}

export async function getRecipesSlugs({ page = 1 } = {}): Promise<
  PaginationResult<string>
> {
  const url = buildUrl({ page })
  const result = await request.get(url)
  const { data, pagesCount } = parseRecipesList(result)

  return {
    data,
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
  }
}

export async function getRecipesSlugsLight({ page = 1 } = {}): Promise<
  PaginationResultLight<string>
> {
  const url = buildUrl({ page })
  const result = await request.get(url)
  const { data } = parseRecipesListLight(result)

  return {
    data,
    page
  }
}

export async function getPagesNumber(): Promise<
  number
> {
  const url = buildUrl({ page: 1 })
  const result = await request.get(url)
  const nbPages = parsePagesNumber(result)

  return nbPages
}
