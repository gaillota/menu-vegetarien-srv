import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Index, Menu, Queue } from '../types'
import { sendToQueue } from '../rabbitmq'
import { getObjectById, deleteObjectById } from '../algolia'
import { checkMenu } from '../menus/checkMenu'
import { sendToMenuParser } from './menuParser'

export const queue = Queue.MenuChecker
const index = Index.Menus
const signale = new Signale({ scope: Queue.MenuChecker })

export async function sendToMenuChecker(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  const menu = (await getObjectById(index, slug)) as Menu

  try {
    await checkMenu(menu)
  } catch (e) {
    signale.debug(chalk`Found broken menu: {yellow ${slug}}`)
    await deleteObjectById(index, slug)
    signale.await(chalk`Sending menu for re-parsing: {yellow ${slug}}`)
    await sendToMenuParser(slug)
  }
}
