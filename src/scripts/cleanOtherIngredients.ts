import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export const description =
  'update recipe other ingredients and remove empty array'

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
        otherIngredients:
          hit.otherIngredients &&
          hit.otherIngredients.length === 1 &&
          !hit.otherIngredients[0].quantity
            ? undefined
            : hit.otherIngredients,
      }))
    })
    .then(async () => {
      await recipesIndex.saveObjects(hits).wait()
    })
}
