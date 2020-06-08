import * as cheerio from 'cheerio';
import * as request from 'request-promise';
import { ApolloServer, gql } from 'apollo-server';

const baseUrl = 'https://menu-vegetarien.com';

function getPaginationUrl({ keywords, page }) {
  if (keywords) {
    return `${baseUrl}${page > 1 ? `/page/${page}` : ''}?s=${keywords}`;
  }
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ''}`;
}

async function getRecipes({ keywords = '', page = 1 } = {}) {
  const url = getPaginationUrl({ keywords, page });
  const result = await request.get(url);
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
      title,
      description,
      photoUrl,
      url,
    };

    recipes.push(recipe);
  });

  const pageLabelRegex = /Page(\d+)/;
  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers').last().text();
  const [, pagesCount] = pageLabelRegex.exec(pagesCountLabel) || [];

  return {
    page,
    pagesCount,
    hasMore: Number(pagesCount) > page,
    data: recipes,
  };
}

async function getRecipe({ url }) {
  const result = await request.get(url);
  const $ = cheerio.load(result);

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
    url,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
    createdAt,
  };
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Recipe {
    title: String
    description: String
    photoUrl: String
    url: String
    preparationTime: Int
    cookingTime: Int
    servings: Int
    ingredients: [String]
    instructions: [String]
    createAt: String
  }

  type RecipesPaginationResult {
    page: Int!
    pagesCount: Int!
    hasMore: Boolean!
    data: [Recipe]
  }

  type Query {
    recipes(keywords: String, page: Int): RecipesPaginationResult
    recipe(url: String!): Recipe
  }
`;

const resolvers = {
  Query: {
    recipes: (_, { keywords, page }) => getRecipes({ keywords, page }),
    recipe: (_, { url }) => getRecipe({ url }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
