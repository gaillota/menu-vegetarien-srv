import * as chalk from 'chalk'
import { Signale } from 'signale'
import { sendToQueue } from '../rabbitmq'
import { Queue } from '../types'
import { sendToMenuIndexer } from './menuIndexer'
import getMenu from '../menus/getMenu'

const signale = new Signale({ scope: 'menus' })

export const queue = Queue.MenuParser

export async function sendToMenuParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  let menu

  try {
    menu = await getMenu(slug)
  } catch (e) {
    signale.error(chalk`Error while parsing menu {yellow ${slug}}`)
    signale.error(e)
  }

  if (menu) {
    await sendToMenuIndexer(menu)
  }
}
