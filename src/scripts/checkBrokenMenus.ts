import algoliasearch from 'algoliasearch'
import { Signale } from 'signale'
import * as chalk from 'chalk'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { checkMenu } from '../menus/checkMenu'
import { sendToMenuParser } from '../workers/menuParser'

const signale = new Signale({ scope: 'algolia[menus]' })
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const menusIndex = client.initIndex('menus')

export const description =
  'check for broken menus, remove and try to re-index them'

export async function main(): Promise<void> {
  const toRemove = []
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
        try {
          checkMenu(menu)
        } catch (e) {
          if (e) {
            signale.debug(chalk`Found broken menu: {yellow ${menu.slug}}`)
            toRemove.push(menu)
          }
        }
      }
    })
    .then(async () => {
      if (toRemove.length > 0) {
        signale.debug(
          chalk`Removing {yellow ${
            toRemove.length
          }} broken menus: ${toRemove
            .map(({ slug }) => chalk`{yellow ${slug}}`)
            .join(', ')}`,
        )

        const objectIDs = toRemove.map(({ objectID }) => objectID)

        await menusIndex.deleteObjects(objectIDs)
      }
    })
    .then(async () => {
      if (toRemove.length > 0) {
        signale.await(
          chalk`Trying to re-index {yellow ${
            toRemove.length
          }} broken menus: ${toRemove
            .map(({ slug }) => chalk`{yellow ${slug}}`)
            .join(', ')}`,
        )

        await Promise.all(toRemove.map(({ slug }) => sendToMenuParser(slug)))
      }
    })
}
