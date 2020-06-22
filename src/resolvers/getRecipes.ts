import * as request from 'request-promise';

import parseRecipesList from '../parsers/recipes';
import { baseUrl } from "../constants";

function getPaginationUrl({ keywords, page }) {
  if (keywords) {
    return `${baseUrl}${page > 1 ? `/page/${page}` : ''}?s=${keywords}`;
  }
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`;
}

async function getRecipes({ keywords = '', page = 1 } = {}) {
  const url = getPaginationUrl({ keywords, page });
  const result = await request.get(url);
  const { recipes, pagesCount } = parseRecipesList(result);

  return {
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
    data: recipes,
  };
}

export default getRecipes;
