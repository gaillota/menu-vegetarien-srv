import { recipeIndex } from './indices';
import { Recipe } from '../types';

export async function searchRecipes(query: string): Promise<Array<Recipe>> {
  const { hits } = await recipeIndex.search<Recipe>(query);

  return hits;
}

export async function searchRecipeById(id: string): Promise<Recipe> {
  const { facetHits } = await recipeIndex.searchForFacetValues('id', id);
  const [recipe] = facetHits;

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return recipe as Recipe;
}
