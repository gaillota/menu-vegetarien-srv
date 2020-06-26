require('dotenv').config();
import { program } from 'commander';
import { indexAllRecipes } from './algolia/indexAllRecipes';

program
  .command('indexAllRecipes')
  .description('parses and indexes all recipes')
  .action(async () => await indexAllRecipes());

program.parse(process.argv);
