import getRecipes from '../resolvers/getRecipes';
import { indexRecipes } from '../algolia/indexRecipes';
import { searchRecipeById } from '../algolia/searchRecipes';

export async function indexNewRecipes(): Promise<void> {
  let hasMore;
  let currentPage = 1;
  let hasAlreadyIndexedRecipe = false;
  do {
    const result = await getRecipes({ page: currentPage });
    for await (const recipe of result.data) {
      const indexedRecipe = await searchRecipeById(recipe.id);
      hasAlreadyIndexedRecipe = !!indexedRecipe;
    }
    hasMore = result.hasMore && !hasAlreadyIndexedRecipe;
    currentPage++;
    await indexRecipes(result.data);
  } while (hasMore);
}
