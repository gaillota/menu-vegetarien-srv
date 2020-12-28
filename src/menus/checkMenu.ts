import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Menu } from '../types'
import { sendNotification } from "../workers/apnDispatcher";
import { OWNER_DEVICE_ID } from "../env";

const signale = new Signale({ scope: 'menu-parser' })

const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const dishesLabels = ['Starter', 'Dish', 'Dessert']

function checkFields(menu: Menu): void {
  if (!menu.title) {
    signale.fatal(
      chalk`Error while parsing menu {yellow ${menu.slug}}: {red no title}`,
    )
    throw new Error(`${menu.slug}: No title`)
  }

  if (!menu.description) {
    signale.debug(
      chalk`Error while parsing menu {yellow ${menu.title}}: {red no description}`,
    )
  }

  if (!menu.photoUrl) {
    signale.debug(
      chalk`Error while parsing menu {yellow ${menu.title}}: {red no description}`,
    )
  }

  if (menu.dailyMenus.length <= 0) {
    signale.fatal(
      chalk`Error while parsing menu {yellow ${menu.title}}: {red no daily menus}`,
    )
    throw new Error(`${menu.title}: No daily menus`)
  }

  menu.dailyMenus.forEach((dailyMenu, i) => {
    const dayLabel = daysLabels[i]
    if (dailyMenu.length <= 0) {
      signale.fatal(
        chalk`Error while parsing menu {yellow ${menu.title}}: {red missing menu for ${dayLabel}}`,
      )
      throw new Error(`${menu.title}: Missing menu for ${dayLabel}`)
    }

    dailyMenu.forEach((dish, i) => {
      const dishLabel = dishesLabels[i]
      if (!dish.title) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dishLabel}}: {red no name}`,
        )
        throw new Error(`${menu.title} - ${dayLabel} - ${dishLabel}: No name`)
      }

      if (!dish.slug) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no slug}`,
        )
        throw new Error(`${menu.title} - ${dayLabel} - ${dishLabel}: No slug`)
      }

      if (!dish.photoUrl) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no photoUrl}`,
        )
        throw new Error(`${menu.title} - ${dayLabel} - ${dishLabel}: No photo`)
      }
    })
  })
}

export async function checkMenu(menu: Menu): Promise<void> {
  try {
    checkFields(menu)
  } catch (e) {
    // Send notification to owner device
    await sendNotification({
      devicesIds: [OWNER_DEVICE_ID],
      notification: {
        title: 'Failed to parse menu',
        body: e.message,
      },
    })
    throw e
  }
}