import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToMenuIndexer } from './menuIndexer'
import getMenu from '../menus/getMenu'
import { checkMenu } from '../menus/checkMenu'
import { sendToRecipeFilterer } from './recipeFilterer'
import { sendNotification } from './apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'

export const queue = Queue.MenuParser

export async function sendToMenuParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const menu = await getMenu(slug)

  try {
    checkMenu(menu)
  } catch (e) {
    // Send notification to owner device
    await sendNotification({
      devicesIds: [OWNER_DEVICE_ID],
      notification: {
        title: 'Failed to parse menu',
        body: e.message,
      },
    })

    return
  }

  // Send every recipe in parser worker in case not parsed yet
  for (const dailyMenu of menu.dailyMenus) {
    await Promise.all(
      dailyMenu.map(({ slug }) => {
        if (!slug) {
          return Promise.resolve()
        }

        return sendToRecipeFilterer(slug)
      }),
    )
  }
  await sendToMenuIndexer(menu)
}
