import { Index, Recipe } from '../types';
import parseRecipe from '../parsers/recipe';
import { saveObjects } from '../algolia';
import { api } from '../api';

export async function getRecipe(slug: string): Promise<Recipe> {
  const html = await api(`/recettes/${slug}`)

  const recipe = parseRecipe(html)
  recipe.slug = slug

  return recipe
}

export async function indexRecipe(recipe: Recipe): Promise<void> {
  await saveObjects(Index.Recipes, [ { ...recipe, objectID: recipe.slug } ])
}
