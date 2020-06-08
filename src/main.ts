import * as cheerio from 'cheerio';
import * as request from 'request-promise';
import { ApolloServer, gql } from 'apollo-server';

const baseUrl = 'https://menu-vegetarien.com';

async function getRecipes({ page = 1 } = {}) {
  const result = await request.get(
    `${baseUrl}/recettes${page > 1 ? `/page/${page}/` : ''}`,
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
      title,
      description,
      photoUrl,
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

async function searchRecipes({ keywords }) {
  const result = await request.get(
    `${baseUrl}/${keywords ? '?s=' + keywords : 'recettes'}`,
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
      title,
      description,
      photoUrl,
      url,
    };

    recipes.push(recipe);
  });

  return recipes;
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    recipes(page: Int): [Recipe]
    recipe(url: String!): Recipe
    searchRecipes(keywords: String!): [Recipe]
  }
`;

const resolvers = {
  Query: {
    recipes: (_, { page }) => getRecipes({ page }),
    recipe: (_, { url }) => getRecipe({ url }),
    searchRecipes: (_, { keywords }) => searchRecipes({ keywords }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
