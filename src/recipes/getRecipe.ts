import { Recipe } from '../types'
import parseRecipe from '../parsers/recipe'
import { api } from '../api'
import { dateToTimestamp } from "../utils";

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`)
  const recipe = parseRecipe(html)
  const createdAtTimestamp = dateToTimestamp(recipe.createdAt)

  recipe.slug = slug
  recipe.createdAtTimestamp = createdAtTimestamp as number

  return recipe
}
