import getMenusSlugs from '../menus/getMenusSlugs'
import { isMenuAlreadyIndexed } from '../menus/utils'
import { sendToMenuParser } from '../workers/menuParser'

export const description = 'parses and indexes all new menus and their recipes'

export async function main(): Promise<void> {
  let hasMore
  let currentPage = 1

  do {
    const result = await getMenusSlugs(currentPage)

    for (const slug of result.data) {
      if (!(await isMenuAlreadyIndexed(slug))) {
        await sendToMenuParser(slug)
      }
    }

    hasMore = result.hasMore
    currentPage = result.page + 1
  } while (hasMore)
}
