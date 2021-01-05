import { Recipe } from '../types'
import parseRecipe from '../parsers/recipe'
import { api } from '../api'
import { dateToTimestamp } from '../utils'

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`)
  const parsedRecipe = parseRecipe(html)
  return {
    ...parsedRecipe,
    slug,
    createdAtTimestamp: dateToTimestamp(parsedRecipe.createdAt),
  }
}
