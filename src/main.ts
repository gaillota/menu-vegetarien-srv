import * as cheerio from 'cheerio';
import * as request from 'request-promise';

// Paginate recipes
// Get on recipe

const baseUrl = 'https://menu-vegetarien.com/recettes/';

async function getRecipes({ page = 1 } = {}) {
  const result = await request.get(
    `${baseUrl}${page > 1 ? `page/${page}/` : ''}`,
  );
  const $ = cheerio.load(result);

  const recipes = [];

  $('div.elementor-posts article').each((_, element) => {
    const $recipe = $(element);
    const type = $recipe.find('div.elementor-post__badge').text();
    const photoUrl = $recipe
      .find('div.elementor-post__thumbnail img')
      .attr('src');
    const title = $recipe
      .find('div.elementor-post__text > h3.elementor-post__title')
      .text()
      .replace(/\n/g, '')
      .replace(/\t/g, '');
    const description = $recipe
      .find(
        'div.elementor-post__text > div.elementor-post__excerpt p:first-of-type',
      )
      .text();
    const url = $recipe
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href');

    const recipe = {
      type,
      photoUrl,
      title,
      description,
      url,
    };

    recipes.push(recipe);
  });

  return recipes;
}

async function getRecipe({ url }) {
  const result = await request.get(url);
  const $ = cheerio.load(result);

  const title = $('div.blog-main > h1').text();
  const photoUrl = $('div.blog-main > div.blog-rightsidebar-img > img').attr(
    'src',
  );
  const createdAt = $('div.blog-main > div.fancy_categories time').attr(
    'datetime',
  );
  const preparationTime = Number($('span.wpurp-recipe-prep-time').text());
  const cookingTime = Number($('span.wpurp-recipe-cook-time').text());
  const servings = Number($('input.advanced-adjust-recipe-servings').val());
  const ingredients = $('div.wpurp-recipe-ingredients').text();
  const instructions = $('div.wpurp-recipe-instructions').text();

  return {
    title,
    photoUrl,
    createdAt,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
  };
}

getRecipes()
  .then((recipes) =>
    getRecipe({
      url: recipes[0].url,
    }).then(console.log),
  )
  .catch((e) => {
    console.error(`Got error: ${e.message}`);
  });
