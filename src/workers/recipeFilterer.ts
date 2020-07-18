import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { parseRecipe } from './recipeParser'
import { isRecipeAlreadyIndexed } from "../recipes/utils";

export const queue = Queue.RecipeFilterer

export async function filterRecipe(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  if (!(await isRecipeAlreadyIndexed(slug))) {
    await parseRecipe(slug)
  }
}
