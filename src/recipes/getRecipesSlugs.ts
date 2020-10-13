import * as request from 'request-promise'
import { Signale } from 'signale'

import parseRecipesSlugs from '../parsers/recipes'
import { baseUrl } from '../constants'
import { PaginationResult } from '../types'
import * as chalk from "chalk";

const signale = new Signale({ scope: 'http' })

function buildUrl({ page }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`
}

export async function getRecipesSlugs({ page = 1 } = {}): Promise<
  PaginationResult<string>
> {
  signale.await(
    chalk`Parsing recipes page {yellow #${page}}...`,
  )
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
