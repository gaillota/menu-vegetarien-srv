require('dotenv').config()
import { program } from 'commander'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'
import { indexNewRecipes } from './scripts/indexNewRecipes'
import { updateRecipesDates } from './scripts/updateRecipesDates'

program
  .command('indexAllRecipes')
  .description('parses and indexes all recipes')
  .action(async () => {
    await Promise.all([initRabbit(), initRedis(), initAlgolia()])
    await indexNewRecipes()
  })

program
  .command('updateRecipesDates')
  .description(
    'update every recipes record and add a timestamp based on createdAt field',
  )
  .action(async () => {
    await updateRecipesDates()
  })

program.parse(process.argv)
