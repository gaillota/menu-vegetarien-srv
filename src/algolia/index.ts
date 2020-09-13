import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import * as config from './config.json'

import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Index, Recipe } from "../types";

const signale = new Signale({ scope: 'algolia' })

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

export const indices = {
  [Index.Recipes]: null,
}

export async function initAlgolia(): Promise<void> {
  for (const [index, settings] of Object.entries(config.indices)) {
    indices[index] = client.initIndex(index)
    await indices[index].setSettings(settings)
  }
}

export async function saveObjects(
  index: string,
  objects: unknown[],
): Promise<void> {
  signale.await(
    chalk`Indexing {yellow ${objects.length}} objects in index {yellow ${index}}...`,
  )

  await indices[index].saveObjects(objects).wait()
}

export async function getObjectById(index: string, id: string): Promise<Recipe> {
  signale.await(
    chalk`Getting object {yellow ${id}} from index {yellow ${index}}...`,
  )

  return indices[index].getObject(id)
}
