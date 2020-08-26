// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { program } from 'commander'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'
import { indexNewRecipes } from './scripts/indexNewRecipes'
import { indexNewMenus } from "./scripts/indexNewMenus";
import { updateRecipesDates } from './scripts/updateRecipesDates'
import { updateMenusDates } from "./scripts/updateMenusDates";
import { updateRecipesIngredients } from "./scripts/updateRecipesIngredients";

program
  .command('indexAllRecipes')
  .description('parses and indexes all new recipes')
  .action(async () => {
    await Promise.all([initRabbit(), initRedis(), initAlgolia()])
    await indexNewRecipes()
  })

program
  .command('updateRecipesDates')
  .description(
    'update every recipe object and add a timestamp based on createdAt field',
  )
  .action(async () => {
    await Promise.all([initAlgolia()])
    await updateRecipesDates()
  })

program
  .command('indexNewMenus')
  .description('parses and indexes all new menus and their recipes')
  .action(async () => {
    await Promise.all([initRabbit(), initRedis(), initAlgolia()])
    await indexNewMenus()
  })

program
  .command('updateMenusDates')
  .description(
    'update every menu object and add a timestamp based on date field',
  )
  .action(async () => {
    await Promise.all([initAlgolia()])
    await updateMenusDates()
  })


program
  .command('updateRecipesIngredients')
  .description(
    'update every recipe object and parse each ingredient',
  )
  .action(async () => {
    await Promise.all([initAlgolia()])
    await updateRecipesIngredients()
  })

program.parse(process.argv)
