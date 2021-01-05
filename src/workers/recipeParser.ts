import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToRecipeIndexer } from './recipeIndexer'
import { getRecipe } from '../recipes/getRecipe'
import { checkRecipe } from '../recipes/checkRecipe'
import { sendNotification } from './apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'

export const queue = Queue.RecipeParser

export async function sendToRecipeParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const recipe = await getRecipe(slug)

  try {
    checkRecipe(recipe)
    await sendToRecipeIndexer(recipe)
  } catch (e) {
    // Send notification to owner device
    await sendNotification({
      devicesIds: [OWNER_DEVICE_ID],
      notification: {
        title: 'Failed to parse recipe',
        body: e.message,
      },
    })
  }
}
