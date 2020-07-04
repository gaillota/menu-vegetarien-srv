import { sendToQueue } from "../rabbitmq";
import { Queue } from "../types";
import { parseRecipe } from './recipeParser';
import { getKey } from "../redis";

export const queue = Queue.RecipeFilterer

function isRecipeIndexed(slug: string): boolean {
  return !!getKey(slug);
}

export async function filterRecipe(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  if (!isRecipeIndexed(slug)) {
    await parseRecipe(slug)
  }
}
