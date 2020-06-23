import * as request from 'request-promise';

import parseMenu from '../parsers/menu';

async function getMenu({ url }) {
  const result = await request.get(url);
  const menu = parseMenu(result);

  return {
    url,
    ...menu
  }
}

export default getMenu
