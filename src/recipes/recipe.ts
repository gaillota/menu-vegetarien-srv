import { Recipe } from '../types'
import parseRecipe from '../parsers/recipe'
import { api } from '../api'

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`)
  const recipe = parseRecipe(html)
  recipe.slug = slug

  return recipe
}
