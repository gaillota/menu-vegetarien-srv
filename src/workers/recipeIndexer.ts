import { Queue, Recipe } from '../types';
import { sendToQueue } from '../rabbitmq';
import { indexRecipe as indexRecipeAlgolia } from '../recipes/recipe';

export const queue = Queue.RecipeIndexer

export async function indexRecipe(recipe: Recipe): Promise<void> {
  await sendToQueue(queue, recipe)
}

export async function work(recipe: Recipe): Promise<void> {
  await indexRecipeAlgolia(recipe)
}
