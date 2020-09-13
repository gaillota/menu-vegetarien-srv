import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { parseIngredients } from '../parsers/ingredients'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export const description = 'update recipe ingredients with better parsing'

export async function main(): Promise<void> {
  let hits = []

  return recipesIndex
    .browseObjects({
      query: '',
      batch: (batch) => {
        hits = hits.concat(batch)
      },
    })
    .then(() => {
      hits = hits.map((hit) => ({
        ...hit,
        ingredients: parseIngredients(hit.ingredients),
        otherIngredients: parseIngredients(hit.otherIngredients),
      }))
    })
    .then(async () => {
      await recipesIndex.saveObjects(hits).wait()
    })
}
