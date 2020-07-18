import { getRecipesSlugs } from '../recipes/getRecipesSlugs'
import { sendToRecipeParser } from "../workers/recipeParser";
import { isRecipeAlreadyIndexed } from "../recipes/utils";

export async function indexNewRecipes(): Promise<void> {
  let hasMore
  let currentPage = 1

  do {
    const result = await getRecipesSlugs({ page: currentPage })

    for (const slug of result.data) {
      if (!(await isRecipeAlreadyIndexed(slug))) {
        await sendToRecipeParser(slug)
      }
    }

    hasMore = result.hasMore
    currentPage = result.page + 1
  } while (hasMore)
}
