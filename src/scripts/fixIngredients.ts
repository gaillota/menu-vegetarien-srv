import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { Ingredient } from '../types'
import { sendToRecipeParser } from '../workers/recipeParser'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export const description =
  'update recipe other ingredients and remove empty array'

function hasBrokenIngredient(list: Ingredient[]): boolean {
  return list.some((i) => i.quantity === null)
}

export async function main(): Promise<void> {
  let hits = []

  return recipesIndex
    .browseObjects({
      query: '',
      batch: (batch) => {
        hits = hits.concat(batch)
      },
    })
    .then(async () => {
      for (const recipe of hits) {
        const { slug, ingredients, otherIngredients } = recipe
        if (
          hasBrokenIngredient(ingredients) ||
          hasBrokenIngredient(otherIngredients)
        ) {
          await sendToRecipeParser(slug)
        }
      }
    })
}
