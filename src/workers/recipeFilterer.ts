import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToRecipeParser } from './recipeParser'
import { isRecipeAlreadyIndexed } from "../recipes/utils";

export const queue = Queue.RecipeFilterer

export async function sendToRecipeFilterer(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  if (!(await isRecipeAlreadyIndexed(slug))) {
    await sendToRecipeParser(slug)
  }
}
