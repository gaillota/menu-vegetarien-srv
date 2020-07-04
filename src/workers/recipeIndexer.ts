import getRecipe from '../resolvers/getRecipe'
import { indexRecipes } from '../algolia/indexRecipes'
import { pushKey } from "../redis";

export async function recipeIndexer({ slug, url }): Promise<void> {
  const recipe = await getRecipe({ url })
  await indexRecipes([recipe])
  await pushKey(slug)
}
