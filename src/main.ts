import { ApolloServer, gql } from 'apollo-server';

import getRecipes from "./resolvers/getRecipes";
import getRecipe from "./resolvers/getRecipe";

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
    pagesCount: Int
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
