import { Index, Queue, Recipe } from '../types';
import { sendToQueue } from '../rabbitmq';
import { saveObjects } from '../algolia';

export const queue = Queue.RecipeIndexer

export async function indexRecipe(recipe: Recipe): Promise<void> {
  await sendToQueue(queue, recipe)
}

export async function work(recipe: Recipe): Promise<void> {
  await saveObjects(Index.Recipes, [ { ...recipe, objectID: recipe.slug } ])
}
