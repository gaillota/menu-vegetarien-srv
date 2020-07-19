import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToMenuIndexer } from './menuIndexer'
import getMenu from '../menus/getMenu'

export const queue = Queue.MenuParser

export async function sendToMenuParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const menu = await getMenu(slug)
  await sendToMenuIndexer(menu)
}
