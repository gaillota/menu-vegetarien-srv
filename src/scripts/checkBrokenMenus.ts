import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { sendToMenuChecker } from '../workers/menuChecker'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const menusIndex = client.initIndex('menus')

export const description =
  'check for broken menus, remove and try to re-index them'

export async function main(): Promise<void> {
  let hits = []

  return menusIndex
    .browseObjects({
      query: '',
      batch: (batch) => {
        hits = hits.concat(batch)
      },
    })
    .then(async () => {
      for (const menu of hits) {
        await sendToMenuChecker(menu.slug)
      }
    })
}
