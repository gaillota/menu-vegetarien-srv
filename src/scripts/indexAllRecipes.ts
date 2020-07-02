import getRecipes from '../resolvers/getRecipes';
import { indexRecipes } from '../algolia/indexRecipes';

export async function indexAllRecipes(): Promise<void> {
  let hasMore;
  let currentPage = 1;
  do {
    const result = await getRecipes({ page: currentPage });
    hasMore = result.hasMore;
    currentPage++;
    await indexRecipes(result.data);
  } while (hasMore)
}
