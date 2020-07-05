import * as request from 'request-promise'

import parseMenu from '../parsers/menu'
import { WeeklyMenu } from '../types'

async function getMenu({ url }): Promise<WeeklyMenu> {
  const result = await request.get(url)
  const menu = parseMenu(result)

  return {
    url,
    ...menu,
  }
}

export default getMenu
