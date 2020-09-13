import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import * as flow from 'lodash/fp/flow'
import * as get from 'lodash/fp/get'
import { translateDateString } from '../menus/utils'
import { dateToTimestamp } from '../utils'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const index = client.initIndex('menus')

export const description =
  'update every menu object and add a timestamp based on date field'

export async function main(): Promise<void> {
  let hits = []

  return index
    .browseObjects({
      query: '',
      batch: (batch) => {
        hits = hits.concat(batch)
      },
    })
    .then(() => {
      hits = hits.map((hit) => ({
        ...hit,
        dateTimestamp: flow(
          get('date'),
          translateDateString,
          dateToTimestamp,
        )(hit),
      }))
    })
    .then(async () => {
      await index.saveObjects(hits).wait()
    })
}
