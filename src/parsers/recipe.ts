import * as cheerio from 'cheerio';

import { Recipe } from '../types';

function parseRecipe(html): Recipe {
  const $ = cheerio.load(html);
  const title = $('div.blog-main > h1').text();
  const description = $('span.wpurp-recipe-description').text();
  const photoUrl = $('div.blog-main > div.blog-rightsidebar-img > img').attr(
    'src',
  );
  const createdAt = $('div.blog-main > div.fancy_categories time').attr(
    'datetime',
  );
  const preparationTime = Number(
    $('span.wpurp-recipe-prep-time').first().text(),
  );
  const cookingTime = Number($('span.wpurp-recipe-cook-time').first().text());
  const servings = Number($('input.advanced-adjust-recipe-servings').val());

  const ingredients = [];
  const otherIngredients = [];
  $('div.wpurp-recipe-ingredients')
    .eq(1)
    .find('div.wpurp-recipe-ingredient-group-container')
    .each((i, element) => {
      const currentIngredients = [];
      const $group = $(element);
      const $rows = $group.find('div.wpurp-rows-row');
      const title = $rows.first().text().trim();

      $rows
        .children('ul.wpurp-recipe-ingredient-container')
        .first()
        .children('li.wpurp-recipe-ingredient')
        .each((_, element) => {
          const ingredient = $(element).text();

          currentIngredients.push(ingredient);
        });

      // Main ingredients
      if (!title) {
        ingredients.push(...currentIngredients);
        return;
      }

      // Other ingredients
      otherIngredients.push({
        title,
        ingredients: currentIngredients,
      });
    });

  const instructions = [];
  $('ol.wpurp-recipe-instruction-container li.wpurp-recipe-instruction').each(
    (_, element) => {
      const $instruction = $(element);
      const text = $instruction
        .find('span.wpurp-recipe-instruction-text')
        .text();

      instructions.push(text);
    },
  );

  return {
    title,
    description,
    photoUrl,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    otherIngredients,
    instructions,
    createdAt,
  };
}

export default parseRecipe;
