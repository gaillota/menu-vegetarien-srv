import getRecipes from '../resolvers/getRecipes';
import { sendToQueue } from "../rabbitmq";
import { Queue } from "../types";

export async function indexAllRecipes(): Promise<void> {
  let hasMore;
  let currentPage = 1;
  const slugs = [];
  do {
    const result = await getRecipes({ page: currentPage });
    slugs.push(...result.data);
    hasMore = result.hasMore;
    currentPage = result.page + 1;
  } while (hasMore);

  await sendToQueue(Queue.RecipeFilterer, slugs)
}
