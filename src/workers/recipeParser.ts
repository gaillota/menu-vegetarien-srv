import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToRecipeIndexer } from './recipeIndexer'
import { getRecipe } from '../recipes/getRecipe'

export const queue = Queue.RecipeParser

export async function sendToRecipeParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const recipe = await getRecipe(slug)
  await sendToRecipeIndexer(recipe)
}
