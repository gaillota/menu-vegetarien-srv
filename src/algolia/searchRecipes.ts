import { recipeIndex } from './indices';
import { Recipe } from '../types';

export async function searchRecipes(query: string): Promise<Array<Recipe>> {
  const { hits } = await recipeIndex.search<Recipe>(query)
  return hits;
}
