require('dotenv').config();
import { program } from 'commander';
import { indexAllRecipes } from './algolia/indexAllRecipes';

program
  .command('indexAllRecipes')
  .description('parses and indexes all recipes')
  .action(async () => {
    try {
      await indexAllRecipes();
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
