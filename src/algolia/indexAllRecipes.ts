import getRecipes from '../resolvers/getRecipes';
import { indexRecipes } from './indexRecipes';

export async function indexAllRecipes(): Promise<void> {
  let hasMore = true;
  let currentPage = 1;
  while (hasMore) {
    const result = await getRecipes({ page: currentPage });
    hasMore = result.hasMore;
    currentPage++;
    await indexRecipes(result.data);
  }
}
