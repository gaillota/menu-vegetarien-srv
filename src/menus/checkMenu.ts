import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Menu } from '../types'

const signale = new Signale({ scope: 'menu-parser' })

const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const dishesLabels = ['Starter', 'Dish', 'Dessert']

export function checkMenu(menu: Menu): void {
  if (!menu.slug) {
    signale.fatal(
      chalk`Menu {yellow ${JSON.stringify(menu)}}: {red no slug}`,
    )
    throw new Error(`Menu ${menu.slug}: no slug`)
  }

  if (!menu.title) {
    signale.fatal(
      chalk`Menu {yellow ${menu.slug}}: {red no title}`,
    )
    throw new Error(`Menu ${menu.slug}: no title`)
  }

  if (!menu.date) {
    signale.fatal(
      chalk`Menu {yellow ${menu.slug}}: {red no date}`,
    )
    throw new Error(`Menu ${menu.slug}: no date`)
  }

  if (!menu.description) {
    signale.warn(
      chalk`Menu {yellow ${menu.slug}}: {red no description}`,
    )
  }

  if (!menu.photoUrl) {
    signale.fatal(
      chalk`Menu {yellow ${menu.slug}}: {red no photo}`,
    )
    throw new Error(`Menu ${menu.slug}: no photo`)
  }

  if (!menu.dailyMenus) {
    signale.fatal(
      chalk`Menu {yellow ${menu.slug}}: {red no dailyMenus}`,
    )
    throw new Error(`Menu ${menu.slug}: no dailyMenus`)
  }

  if (menu.dailyMenus.length < 5) {
    signale.fatal(
      chalk`Menu {yellow ${menu.slug}}: {red less than 5 dailyMenus}`,
    )
    throw new Error(`Menu ${menu.slug}: less than 5 dailyMenus`)
  }

  menu.dailyMenus.forEach((courses, i) => {
    const dayLabel = daysLabels[i] || `Day ${i + 1}`

    if (!courses) {
      signale.fatal(
        chalk`Menu {yellow ${menu.slug}}: {red missing ${dayLabel} menu}`,
      )
      throw new Error(`Menu ${menu.slug}: missing ${dayLabel} menu`)
    }

    if (courses.length < 3) {
      signale.fatal(
        chalk`Menu {yellow ${menu.slug}}: {red missing dish in ${dayLabel} menu}`,
      )
      throw new Error(`Menu ${menu.slug}: missing dish in ${dayLabel} menu`)
    }

    courses.forEach((dish, i) => {
      const dishLabel = dishesLabels[i] || `Dish ${i + 1}`

      if (!dish.slug) {
        signale.fatal(
          chalk`Menu {yellow ${menu.slug}} -> {blue ${dayLabel}} -> {green ${dishLabel}}: {red no slug}`,
        )
        throw new Error(`Menu ${menu.slug} -> ${dayLabel} -> ${dishLabel}: no slug`)
      }

      if (!dish.title) {
        signale.fatal(
          chalk`Menu {yellow ${menu.slug}} -> {blue ${dayLabel}} -> {green ${dish.slug} (${dishLabel})}: {red no name}`,
        )
        throw new Error(`Menu ${menu.slug} -> ${dayLabel} -> ${dishLabel}: no name`)
      }

      if (!dish.photoUrl) {
        signale.fatal(
          chalk`Menu {yellow ${menu.slug}} -> {blue ${dayLabel}} -> {green ${dish.slug} (${dishLabel})}: {red no photo}`,
        )
        throw new Error(`Menu ${menu.slug} -> ${dayLabel} -> ${dishLabel}: no photo`)
      }
    })
  })
}
