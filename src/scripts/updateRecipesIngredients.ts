import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import parseIngredient from '../parsers/ingredient'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export async function updateRecipesIngredients(): Promise<void> {
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
        ingredients: parseIngredient(hit.ingredients),
        otherIngredients: parseIngredient(hit.otherIngredients),
      }))
    })
    .then(async () => {
      await recipesIndex.saveObjects(hits).wait()
    })
}
