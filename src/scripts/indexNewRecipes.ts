import { getRecipesSlugs } from '../recipes/getRecipesSlugs'
import { sendToRecipeParser } from '../workers/recipeParser'
import { isRecipeAlreadyIndexed } from '../recipes/utils'

export const description = 'parses and indexes all new recipes'

export async function main(): Promise<void> {
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
