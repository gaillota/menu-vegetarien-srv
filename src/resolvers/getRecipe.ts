import * as request from 'request-promise';

import parseRecipe from '../parsers/recipe';
import { Recipe } from '../types';
import { indexRecipes } from '../algolia/indexRecipes';

async function getRecipe({ url }): Promise<Recipe> {
  const result = await request.get(url);
  const recipe = parseRecipe(result, url);
  await indexRecipes([recipe]);

  return recipe;
}

export default getRecipe;
