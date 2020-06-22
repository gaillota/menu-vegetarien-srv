import * as request from 'request-promise';

import { baseUrl } from '../constants';
import parseRecipesList from "../parsers/weeklyMenus";

function getPath({ page }) {
  const path = '/menu-vegetarien-semaine';

  if (page > 1) {
    return `${path}/page/${page}`;
  }

  return path;
}

function getUrl({ page }) {
  const path = getPath({ page });
  return `${baseUrl}${path}`;
}

async function getWeeklyMenus({ page }) {
  const url = getUrl({ page });
  const result = await request.get(url);
  const { menus, pagesCount } = parseRecipesList(result);

  return {
    page,
    pagesCount,
    hasMore: !!pagesCount && Number(pagesCount) > page,
    data: menus,
  };
}

export default getWeeklyMenus;
