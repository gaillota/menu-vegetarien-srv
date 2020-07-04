import * as request from "request-promise";

import parseRecipe from "../parsers/recipe";
import { Recipe } from "../types";

async function getRecipe({ url }): Promise<Recipe> {
  const result = await request.get(url);
  return parseRecipe(result, url);
}

export default getRecipe;
