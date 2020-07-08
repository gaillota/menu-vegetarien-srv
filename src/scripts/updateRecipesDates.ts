import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export async function updateRecipesDates(): Promise<void> {
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
        createdAtTimestamp: new Date(hit.createdAt).getTime() / 1000,
      }))
    })
    .then(async () => {
      await recipesIndex.saveObjects(hits).wait()
    })
}
