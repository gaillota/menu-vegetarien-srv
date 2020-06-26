import { Recipe } from '../types';
import { recipeIndex } from './indices';

export async function indexRecipes(recipes: Array<Recipe>): Promise<void> {
  await recipeIndex.saveObjects(recipes, {
    autoGenerateObjectIDIfNotExist: true
  });
}
