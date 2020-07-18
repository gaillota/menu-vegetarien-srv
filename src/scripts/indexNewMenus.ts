import getMenusSlugs from "../menus/getMenusSlugs";
import { isMenuAlreadyIndexed } from "../menus/utils";
import { sendToMenuParser } from "../workers/menuParser";

export async function indexNewMenus(): Promise<void> {
  let hasMore
  let currentPage = 1

  do {
    const result = await getMenusSlugs({ page: currentPage })

    for (const slug of result.data) {
      if (!(await isMenuAlreadyIndexed(slug))) {
        await sendToMenuParser(slug)
      }
    }

    hasMore = result.hasMore
    currentPage = result.page + 1
  } while (hasMore)
}
