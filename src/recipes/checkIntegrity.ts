import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Ingredient, Recipe } from "../types";

const signale = new Signale({ scope: 'recipe-parser' })

function checkIngredients(title: string, ingredients: Ingredient[]): void {
  if (ingredients.length <= 0) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${title}}: {red no ingredients}`,
    )
    throw new Error('No ingredients in recipe')
  }

  ingredients.forEach((ingredient, i) => {
    if (!ingredient.label) {
      signale.fatal(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ingredient #${i}}: {red no label}`,
      )
      throw new Error('Missing label to ingredient')
    }

    if (!ingredient.quantity) {
      signale.fatal(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ${ingredient.label}}: {red no quantity}`,
      )
    }

    if (!ingredient.unit) {
      signale.fatal(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ${ingredient.label}}: {red no unit}`,
      )
    }
  })
}

export function checkRecipe(recipe: Recipe): void {
  if (!recipe.title) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${recipe.slug}}: {red no title}`,
    )
    throw new Error('Missing title to recipe')
  }

  if (!recipe.description) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no description}`,
    )
  }

  if (!recipe.photoUrl) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no description}`,
    )
  }

  if (!recipe.preparationTime) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no preparation time}`,
    )
  }

  if (!recipe.cookingTime) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no cooking time}`,
    )
  }

  if (!recipe.servings) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${recipe.slug}}: {red no servings}`,
    )
    throw new Error('Missing # servings to recipe')
  }

  checkIngredients(recipe.title, recipe.ingredients)

  if (recipe.otherIngredients?.length > 0) {
    recipe.otherIngredients.forEach((otherIngredient, i) => {
      if (!otherIngredient.title) {
        signale.fatal(
          chalk`Error while parsing recipe {yellow ${recipe.title}} -> {blue otherIngredient #${i}}: {red no title}`,
        )
        throw new Error('Missing title to otherIngredient')
      }

      checkIngredients(otherIngredient.title, otherIngredient.ingredients)
    })
  }

  if (recipe.instructions?.length <= 0) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no instructions}`,
    )
  }

  if (!recipe.createdAt) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no createdAt date}`,
    )
  }

  if (!recipe.createdAt) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no createdAtTimestamp date}`,
    )
  }
}

