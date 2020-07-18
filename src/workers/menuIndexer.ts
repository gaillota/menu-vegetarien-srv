import { Index, Queue, WeeklyMenu } from "../types";
import { sendToQueue } from '../rabbitmq'
import { saveObjects } from '../algolia'
import { setKey } from '../redis'

export const queue = Queue.MenuIndexer

export async function sendToMenuIndexer(menu: WeeklyMenu): Promise<void> {
  await sendToQueue(queue, menu)
}

export async function work(menu: WeeklyMenu): Promise<void> {
  await saveObjects(Index.Menus, [{ ...menu, objectID: menu.slug }])
  await setKey(menu.slug, true)
}
