import { getRecipesSlugs } from '../recipes/getRecipesSlugs'
import { parseRecipe } from "../workers/recipeParser";
import { isRecipeIndexed } from "../recipes/utils";

export async function indexAllRecipes(): Promise<void> {
  let hasMore
  let currentPage = 1

  do {
    const result = await getRecipesSlugs({ page: currentPage })

    for (const slug of result.data) {
      if (!(await isRecipeIndexed(slug))) {
        await parseRecipe(slug)
      }
    }

    hasMore = result.hasMore
    currentPage = result.page + 1
  } while (hasMore)
}
