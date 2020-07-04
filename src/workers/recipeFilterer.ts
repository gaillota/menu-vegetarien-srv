import { sendToQueue } from "../rabbitmq";
import { Queue } from "../types";

function hasSlug(slug): boolean {
  return !slug;
}

function isRecipeNotIndexed(slug: string): boolean {
  return !hasSlug(slug);
}

export async function recipeFilterer(slug: string): Promise<void> {
  if (isRecipeNotIndexed(slug)) {
    await sendToQueue(Queue.RecipeIndexer, { slug })
  }
}

export async function addToRecipesQueue(slug): Promise<void> {
  await sendToQueue(Queue.RecipeFilterer, { slug })
}
