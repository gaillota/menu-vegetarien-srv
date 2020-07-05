import { getRecipesSlugs } from '../recipes/getRecipesSlugs'
import { filterRecipe } from '../workers/recipeFilterer'

export async function indexAllRecipes(): Promise<void> {
  let hasMore
  let currentPage = 1

  do {
    const result = await getRecipesSlugs({ page: currentPage })

    for (const slug of result.data) {
      await filterRecipe(slug)
    }

    hasMore = result.hasMore
    currentPage = result.page + 1
  } while (hasMore)
}
