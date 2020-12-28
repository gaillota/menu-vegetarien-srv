import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Ingredient, Recipe } from '../types'
import { sendNotification } from '../workers/apnDispatcher'
import { OWNER_DEVICE_ID } from '../env'

const signale = new Signale({ scope: 'recipe-parser' })

function checkIngredients(title: string, ingredients: Ingredient[]): void {
  if (ingredients.length <= 0) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${title}}: {red no ingredients}`,
    )

    throw new Error(`${title}: No ingredients`)
  }

  ingredients.forEach((ingredient, i) => {
    if (!ingredient.label) {
      signale.fatal(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ingredient #${i}}: {red no label}`,
      )
      throw new Error(`${title} - Ingredient #${i}: No label`)
    }

    if (!ingredient.quantity) {
      signale.debug(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ${ingredient.label}}: {red no quantity}`,
      )
    }

    if (!ingredient.unit) {
      signale.debug(
        chalk`Error while parsing recipe {yellow ${title}} -> {blue ${ingredient.label}}: {red no unit}`,
      )
    }
  })
}

function checkFields(recipe: Recipe): void {
  if (!recipe.title) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${recipe.slug}}: {red no title}`,
    )
    throw new Error(`${recipe.slug}: No title`)
  }

  if (!recipe.description) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no description}`,
    )
    throw new Error(`${recipe.title}: No description`)
  }

  if (!recipe.photoUrl) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no photo}`,
    )
    throw new Error(`${recipe.title}: No photo`)
  }

  if (!recipe.preparationTime) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no preparation time}`,
    )
    throw new Error(`${recipe.title}: No preparation time`)
  }

  if (!recipe.cookingTime) {
    signale.debug(
      chalk`Error while parsing recipe {yellow ${recipe.title}}: {red no cooking time}`,
    )
    throw new Error(`${recipe.title}: No cooking time`)
  }

  if (!recipe.servings) {
    signale.fatal(
      chalk`Error while parsing recipe {yellow ${recipe.slug}}: {red no servings}`,
    )
    throw new Error(`${recipe.title}: Missing # servings`)
  }

  checkIngredients(recipe.title, recipe.ingredients)

  if (recipe.otherIngredients?.length > 0) {
    recipe.otherIngredients.forEach((otherIngredient, i) => {
      if (!otherIngredient.title) {
        signale.fatal(
          chalk`Error while parsing recipe {yellow ${recipe.title}} -> {blue otherIngredient #${i}}: {red no title}`,
        )
        throw new Error(`${recipe.title} - Other ingredient #${i}: No title`)
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

export async function checkRecipe(recipe: Recipe): Promise<void> {
  try {
    checkFields(recipe)
  } catch (e) {
    // Send notification to owner device
    await sendNotification({
      devicesIds: [OWNER_DEVICE_ID],
      notification: {
        title: 'Failed to parse recipe',
        body: e.message,
      },
    })
    throw e
  }
}
