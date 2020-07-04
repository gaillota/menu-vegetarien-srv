import { baseUrl } from '../constants';
import { Index, Recipe } from '../types';
import * as request from 'request-promise';
import parseRecipe from '../parsers/recipe';
import * as signale from 'signale';
import * as chalk from 'chalk';
import { saveObjects } from '../algolia';

export function buildUrl(slug: string): string {
  return `${baseUrl}/recettes/${slug}`
}

export async function getRecipe(slug: string): Promise<Recipe> {
  signale.await(chalk`Fetching recipe {yellow ${slug}}...`)

  const url = buildUrl(slug)
  const html = await request.get(url)

  signale.await(chalk`Parsing recipe {yellow ${slug}}...`)

  const recipe = parseRecipe(html)
  recipe.slug = slug

  return recipe
}

export async function indexRecipe(recipe: Recipe): Promise<void> {
  await saveObjects(Index.Recipes, [ { ...recipe, objectID: recipe.slug } ])
}