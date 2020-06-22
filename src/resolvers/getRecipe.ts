import * as request from 'request-promise';

import parseRecipe from '../parsers/recipe';

async function getRecipe({ url }) {
  const result = await request.get(url);
  const recipe = parseRecipe(result);

  return {
    url,
    ...recipe,
  };
}

export default getRecipe;
