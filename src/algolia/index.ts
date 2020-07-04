import algoliasearch from 'algoliasearch';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env';
import * as config from './config.json';

import { Signale } from 'signale';
import * as chalk from 'chalk';

const signale = new Signale({ scope: 'algolia' })

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

export const indices: any = {}

export async function initAlgolia(): Promise<void> {
  for (const [ index, settings ] of Object.entries(config.indices)) {
    indices[index] = client.initIndex(index)
    await indices[index].setSettings(settings)
  }
}
