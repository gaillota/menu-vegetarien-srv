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
  $('ul.wpurp-recipe-ingredient-container')
    .first()
    .children('li.wpurp-recipe-ingredient')
    .each((_, element) => {
      const $ingredient = $(element);

      ingredients.push($ingredient.text());
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
    instructions,
    createdAt,
  };
}

export default parseRecipe;
