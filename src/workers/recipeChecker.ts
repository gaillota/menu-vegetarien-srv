import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Index, Queue, Recipe } from '../types'
import { sendToQueue } from '../rabbitmq'
import { getObjectById, deleteObjectById } from '../algolia'
import { checkRecipe } from '../recipes/checkRecipe'
import { sendToRecipeParser } from './recipeParser'

export const queue = Queue.RecipeChecker
const index = Index.Recipes
const signale = new Signale({ scope: Queue.RecipeChecker })

export async function sendToRecipeChecker(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const recipe = (await getObjectById(index, slug)) as Recipe

  try {
    await checkRecipe(recipe)
  } catch (e) {
    signale.debug(chalk`Found broken recipe: {yellow ${slug}}`)
    await deleteObjectById(index, slug)
    signale.await(chalk`Sending recipe for re-parsing: {yellow ${slug}}`)
    await sendToRecipeParser(slug)
  }
}
