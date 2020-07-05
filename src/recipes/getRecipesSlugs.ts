import * as request from 'request-promise'

import parseRecipesSlugs from '../parsers/recipes'
import { baseUrl } from '../constants'
import { PaginationResult } from '../types'

function buildUrl({ page }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`
}

export async function getRecipesSlugs({ page = 1 } = {}): Promise<
  PaginationResult<string>
> {
  const url = buildUrl({ page })
  const result = await request.get(url)
  const { data, pagesCount } = parseRecipesSlugs(result)

  return {
    data,
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
  }
}
