import { Index, Queue, Menu } from "../types";
import { sendToQueue } from '../rabbitmq'
import { saveObjects } from '../algolia'
import { setKey } from '../redis'

export const queue = Queue.MenuIndexer

export async function sendToMenuIndexer(menu: Menu): Promise<void> {
  await sendToQueue(queue, menu)
}

export async function work(menu: Menu): Promise<void> {
  await saveObjects(Index.Menus, [{ ...menu, objectID: menu.slug }])
  await setKey(menu.slug, true)
}
