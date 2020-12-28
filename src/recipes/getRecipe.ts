import { Recipe } from '../types'
import parseRecipe from '../parsers/recipe'
import { api } from '../api'
import { checkRecipe } from './checkRecipe'
import { dateToTimestamp } from '../utils'

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`)
  const parsedRecipe = parseRecipe(html)
  const recipe: Recipe = {
    ...parsedRecipe,
    slug,
    createdAtTimestamp: dateToTimestamp(parsedRecipe.createdAt)
  }

  await checkRecipe(recipe)

  return recipe
}
