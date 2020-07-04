import getRecipe from '../resolvers/getRecipe'
import { indexRecipes } from '../algolia/indexRecipes'
import { pushData } from "../redis";
import { Queue } from '../types';

export const queue = Queue.RecipeIndexer
export const work = Queue.RecipeIndexer

export async function recipeIndexer({ slug, url }): Promise<void> {
  const recipe = await getRecipe({ url })
  await indexRecipes([recipe])
  await pushData(slug, true)
}
