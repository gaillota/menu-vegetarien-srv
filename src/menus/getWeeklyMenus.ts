import * as request from 'request-promise'

import { baseUrl } from '../constants'
import parseRecipesList from '../parsers/weeklyMenus'
import { PaginationResult, WeeklyMenu } from '../types'

function getPath({ page }): string {
  const path = '/menu-vegetarien-semaine'

  if (page > 1) {
    return `${path}/page/${page}`
  }

  return path
}

function getUrl({ page }): string {
  const path = getPath({ page })
  return `${baseUrl}${path}`
}

async function getWeeklyMenus({ page }): Promise<PaginationResult<WeeklyMenu>> {
  const url = getUrl({ page })
  const result = await request.get(url)
  const { data, pagesCount } = parseRecipesList(result)

  return {
    data,
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
  }
}

export default getWeeklyMenus
