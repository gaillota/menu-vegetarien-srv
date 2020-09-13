import * as request from 'request-promise'
import { baseUrl } from '../constants'
import parseMenusList from '../parsers/menus'
import { PaginationResult } from '../types'

function getPath({ page }): string {
  const path = '/menu-vegetarien-semaine'

  if (page > 1) {
    return `${path}/page/${page}`
  }

  return path
}

function buildUrl(page): string {
  const path = getPath({ page })
  return `${baseUrl}${path}`
}

async function getMenusSlugs(page: number): Promise<PaginationResult<string>> {
  const url = buildUrl(page)
  const result = await request.get(url)
  const { data, pagesCount } = parseMenusList(result)

  return {
    data,
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
  }
}

export default getMenusSlugs
