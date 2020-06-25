import * as request from 'request-promise';

import parseRecipesList from '../parsers/recipes';
import { baseUrl } from '../constants';
import { PaginationResult, Recipe } from '../types';

function getPaginationUrl({ keywords, page }): string {
  if (keywords) {
    return `${baseUrl}${page > 1 ? `/page/${page}` : ''}?s=${keywords}`;
  }
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`;
}

async function getRecipes({ keywords = '', page = 1 } = {}): Promise<
  PaginationResult<Recipe>
> {
  const url = getPaginationUrl({ keywords, page });
  const result = await request.get(url);
  const { data, pagesCount } = parseRecipesList(result);

  return {
    data,
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
  };
}

export default getRecipes;
