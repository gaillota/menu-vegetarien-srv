import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { indexRecipe } from './recipeIndexer'
import { getRecipe } from '../recipes/getRecipe'

export const queue = Queue.RecipeParser

export async function parseRecipe(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const recipe = await getRecipe(slug)
  await indexRecipe(recipe)
}
