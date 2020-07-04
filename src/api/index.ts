import * as chalk from 'chalk';
import { Signale } from 'signale';
import { baseUrl } from '../constants';
import * as request from 'request-promise';

const signale = new Signale({ scope: 'api' })

export async function api(path: string): Promise<string> {
  signale.await(chalk`Fetching {yellow ${path}}...`)

  return request.get(`${baseUrl}${path}`)
}
