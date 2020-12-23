import { Signale } from 'signale'
import * as chalk from 'chalk'
import { WeeklyMenu } from '../types'

const signale = new Signale({ scope: 'menu-parser' })

const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const dishesLabels = ['Starter', 'Dish', 'Dessert']

export function checkMenu(menu: WeeklyMenu): void {
  if (!menu.title) {
    signale.fatal(
      chalk`Error while parsing menu {yellow ${menu.slug}}: {red no name}`,
    )
    throw new Error('Missing title to menu')
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
    throw new Error('Missing daily menus to menu')
  }

  menu.dailyMenus.forEach((dailyMenu, i) => {
    const dayLabel = daysLabels[i]
    if (dailyMenu.length <= 0) {
      signale.fatal(
        chalk`Error while parsing menu {yellow ${menu.slug}}: {red missing daily menu for ${dayLabel}}`,
      )
      throw new Error('Missing dish in menu')
    }

    dailyMenu.forEach((dish, i) => {
      const dishLabel = dishesLabels[i]
      if (!dish.title) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dishLabel}}: {red no name}`,
        )
        throw new Error('Missing title to dish')
      }

      if (!dish.slug) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no slug}`,
        )
        throw new Error('Missing slug to dish')
      }

      if (!dish.photoUrl) {
        signale.fatal(
          chalk`Error while parsing menu {yellow ${menu.title}} -> {blue ${dayLabel}} -> {green ${dish.title} (${dishLabel})}: {red no photoUrl}`,
        )
        throw new Error('Missing photo url to dish')
      }
    })
  })
}
