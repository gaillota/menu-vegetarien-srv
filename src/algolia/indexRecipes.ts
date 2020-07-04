import { Recipe } from '../types';
import { recipeIndex } from './indices';

export async function indexRecipes(recipes: Array<Recipe>): Promise<void> {
  if (recipes.length <= 0) {
    return;
  }

  console.info(`Algolia: Indexing ${recipes.length} new recipes`);

  await recipeIndex.saveObjects(recipes, {
    autoGenerateObjectIDIfNotExist: true
  });
}
