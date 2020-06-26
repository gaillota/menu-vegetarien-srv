require('dotenv').config();
import { ApolloServer, gql } from "apollo-server";

import getRecipes from "./resolvers/getRecipes";
import getRecipe from "./resolvers/getRecipe";
import getWeeklyMenus from "./resolvers/getWeeklyMenus";
import getMenu from "./resolvers/getMenu";
import { PaginationResult, Recipe, WeeklyMenu } from "./types";
import { searchRecipes } from './algolia/searchRecipes';

const typeDefs = gql`
  type Recipe {
    title: String!
    description: String
    photoUrl: String!
    url: String
    preparationTime: Int
    cookingTime: Int
    servings: Int
    ingredients: [String]
    instructions: [String]
    createAt: String
  }

  type DailyMenu {
    starter: Recipe
    dish: Recipe
    dessert: Recipe
  }

  type WeeklyMenu {
    title: String!
    description: String
    photoUrl: String!
    date: String
    url: String
    dailyMenus: [DailyMenu]
  }

  type RecipesPaginationResult {
    page: Int!
    pagesCount: Int
    hasMore: Boolean!
    data: [Recipe]
  }

  type WeeklyMenusPaginationResult {
    page: Int!
    pagesCount: Int
    hasMore: Boolean!
    data: [WeeklyMenu]
  }

  type Query {
    recipes(keywords: String, page: Int): RecipesPaginationResult
    recipe(url: String!): Recipe
    weeklyMenus(page: Int): WeeklyMenusPaginationResult
    weeklyMenu(url: String!): WeeklyMenu
    searchRecipes(query: String!): [Recipe]
  }
`;

const resolvers = {
  Query: {
    recipes: (_, { keywords, page }): Promise<PaginationResult<Recipe>> => getRecipes({ keywords, page }),
    recipe: (_, { url }): Promise<Recipe> => getRecipe({ url }),
    weeklyMenus: (_, { page }): Promise<PaginationResult<WeeklyMenu>> => getWeeklyMenus({ page }),
    weeklyMenu: (_, { url }): Promise<WeeklyMenu> => getMenu({ url }),
    searchRecipes: (_, { query }): Promise<Array<Recipe>> => searchRecipes(query),
  },
};

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

// The `listen` method launches a web server.
server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
