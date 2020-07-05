require('dotenv').config()
import { program } from 'commander'
import { indexAllRecipes } from './scripts/indexAllRecipes'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'

program
  .command('indexAllRecipes')
  .description('parses and indexes all recipes')
  .action(async () => {
    await Promise.all([initRabbit(), initRedis(), initAlgolia()])
    await indexAllRecipes()
  })

program.parse(process.argv)
