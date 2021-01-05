import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Menu } from '../types'

const signale = new Signale({ scope: 'menu-parser' })

const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const dishesLabels = ['Starter', 'Dish', 'Dessert']

export function checkMenu(menu: Menu): void {
  if (!menu.title) {
    signale.fatal(
      chalk`Error while parsing menu {yellow ${menu.slug}}: {red no title}`,
    )
    throw new Error(`${menu.slug}: No title`)
  }

  if (!menu.date) {
    signale.fatal(
      chalk`Error while parsing menu {yellow ${menu.slug}}: {red no date}`,
    )
    throw new Error(`${menu.slug}: No date`)
  }

  if (!menu.description) {
    signale.debug(
      chalk`Error while parsing menu from {yellow ${menu.date}}: {red no description}`,
    )
  }

  if (!menu.photoUrl) {
    signale.debug(
      chalk`Error while parsing menu from {yellow ${menu.date}}: {red no photos}`,
    )
  }

  if (menu.dailyMenus.length <= 0) {
    signale.fatal(
      chalk`Error while parsing menu from {yellow ${menu.date}}: {red no daily menus}`,
    )
    throw new Error(`${menu.date}: No daily menus`)
  }

  menu.dailyMenus.forEach((dailyMenu, i) => {
    const dayLabel = daysLabels[i]
    if (dailyMenu.length <= 0) {
      signale.fatal(
        chalk`Error while parsing menu from {yellow ${menu.date}}: {red missing menu for ${dayLabel}}`,
      )
      throw new Error(`${menu.date}: Missing menu for ${dayLabel}`)
    }

    dailyMenu.forEach((dish, i) => {
      const dishLabel = dishesLabels[i]
      if (!dish.title) {
        signale.fatal(
          chalk`Error while parsing menu from {yellow ${menu.date}} -> {blue ${dayLabel}} -> {green ${dishLabel}}: {red no name}`,
        )
        throw new Error(`${menu.date} - ${dayLabel} - ${dishLabel}: No name`)
      }

      if (!dish.slug) {
        signale.fatal(
          chalk`Error while parsing menu from {yellow ${menu.date}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no slug}`,
        )
        throw new Error(`${menu.date} - ${dayLabel} - ${dishLabel}: No slug`)
      }

      if (!dish.photoUrl) {
        signale.fatal(
          chalk`Error while parsing menu from {yellow ${menu.date}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no photoUrl}`,
        )
        throw new Error(`${menu.date} - ${dayLabel} - ${dishLabel}: No photo`)
      }
    })
  })
}
