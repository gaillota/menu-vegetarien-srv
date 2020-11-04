import { Signale } from 'signale'
import { getRecipesSlugsLight, getPagesNumber } from '../recipes/getRecipesSlugs'
import { sendToRecipeParser } from '../workers/recipeParser'
import { isRecipeAlreadyIndexed } from '../recipes/utils'
import * as random from 'lodash/random'

export const description = 'parses and indexes all new recipes'

export const signale = new Signale()

export async function main(): Promise<void> {
  const nbPages = getPagesNumber()
  const nbPagesByJob = 10
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage = random(1, nbPages)

    const result = await getRecipesSlugsLight({ page: randomPage })

    for (const slug of result.data) {
      if (!(await isRecipeAlreadyIndexed(slug))) {
        await sendToRecipeParser(slug)
      }
    }
  }
}
