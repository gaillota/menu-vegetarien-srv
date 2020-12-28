import algoliasearch from 'algoliasearch'
import { Signale } from 'signale'
import * as chalk from 'chalk'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { Menu, Recipe } from '../types'
import * as config from './config.json'

const signale = new Signale({ scope: 'algolia' })

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

export const indices = {}

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

export async function getObjectById(
  index: string,
  id: string,
): Promise<Recipe | Menu | null> {
  signale.await(
    chalk`Getting object {yellow ${id}} from index {yellow ${index}}...`,
  )

  return indices[index].getObject(id)
}

export async function deleteObjectById(
  index: string,
  id: string,
): Promise<void> {
  signale.await(
    chalk`Removing object {yellow ${id}} from index {yellow ${index}}...`,
  )

  return indices[index].deleteObject(id)
}
