import { Signale } from 'signale'
import * as chalk from 'chalk'
import { Ingredient, Recipe } from '../types'

const signale = new Signale({ scope: 'recipe-parser' })

function checkIngredients(
  recipeName: string,
  subRecipeName: string,
  ingredients: Ingredient[],
  throwError: boolean,
): void {
  if (!ingredients || ingredients.length <= 0) {
    const logFn = throwError ? signale.fatal : signale.warn
    logFn(
      chalk`Recipe {yellow ${recipeName}}${
        subRecipeName ? chalk` -> Other ingredient {blue ${subRecipeName}}` : ''
      }: {red no ingredients}`,
    )

    if (throwError) {
      throw new Error(
        `Recipe ${recipeName}${
          subRecipeName ? ` -> Other ingredient ${subRecipeName}` : ''
        }: no ingredients`,
      )
    }

    return
  }

  ingredients.forEach((ingredient, i) => {
    if (!ingredient.label) {
      signale.fatal(
        chalk`Recipe {yellow ${recipeName}}${subRecipeName ? chalk` -> Other ingredient {blue ${subRecipeName}}` : ''} -> Ingredient {blue #${
          i + 1
        }}: {red no label}`,
      )
      throw new Error(`Recipe ${recipeName}${subRecipeName ? chalk` -> Other ingredient ${subRecipeName}` : ''} -> Ingredient #${i + 1}: no label`)
    }

    if (!ingredient.quantity) {
      signale.warn(
        chalk`Recipe {yellow ${recipeName}}${subRecipeName ? chalk` -> Other ingredient {blue ${subRecipeName}}` : ''} -> Ingredient {blue ${ingredient.label}}: {red no quantity}`,
      )
    }

    if (!ingredient.unit) {
      signale.warn(
        chalk`Recipe {yellow ${recipeName}}${subRecipeName ? chalk` -> Other ingredient {blue ${subRecipeName}}` : ''} -> Ingredient {blue ${ingredient.label}}: {red no unit}`,
      )
    }
  })
}

export function checkRecipe(recipe: Recipe): void {
  if (!recipe.title) {
    signale.fatal(chalk`Recipe {yellow ${recipe.slug}}: {red no title}`)
    throw new Error(`Recipe ${recipe.slug}: no title`)
  }

  if (!recipe.description) {
    signale.warn(chalk`Recipe {yellow ${recipe.slug}}: {red no description}`)
  }

  if (!recipe.photoUrl) {
    signale.warn(chalk`Recipe {yellow ${recipe.slug}}: {red no photo}`)
    throw new Error(`Recipe ${recipe.slug}: no photo`)
  }

  if (!recipe.preparationTime) {
    signale.warn(
      chalk`Recipe {yellow ${recipe.slug}}: {red no preparation time}`,
    )
    throw new Error(`Recipe ${recipe.slug}: no preparation time`)
  }

  if (!recipe.cookingTime) {
    signale.warn(chalk`Recipe {yellow ${recipe.slug}}: {red no cooking time}`)
  }

  if (!recipe.servings) {
    signale.fatal(chalk`Recipe {yellow ${recipe.slug}}: {red no servings}`)
    throw new Error(`Recipe ${recipe.slug}: Missing # servings`)
  }

  checkIngredients(
    recipe.slug,
    null,
    recipe.ingredients,
    !recipe.otherIngredients || recipe.otherIngredients.length <= 0,
  )

  if (recipe.otherIngredients?.length > 0) {
    recipe.otherIngredients.forEach((otherIngredient, i) => {
      if (!otherIngredient.title) {
        signale.fatal(
          chalk`Recipe {yellow ${recipe.slug}} -> Other Ingredient {blue #${
            i + 1
          }}: {red no title}`,
        )
        throw new Error(
          `Recipe ${recipe.slug} -> Other ingredient #${i + 1}: no title`,
        )
      }

      checkIngredients(
        recipe.slug,
        otherIngredient.title,
        otherIngredient.ingredients,
        true,
      )
    })
  }

  if (recipe.instructions?.length <= 0) {
    signale.warn(chalk`Recipe {yellow ${recipe.slug}}: {red no instructions}`)
  }

  if (!recipe.createdAt) {
    signale.fatal(chalk`Recipe {yellow ${recipe.slug}}: {red no createdAt date}`)
    throw new Error(`Recipe ${recipe.slug}: no createdAt`)
  }

  if (!recipe.createdAtTimestamp) {
    signale.fatal(
      chalk`Recipe {yellow ${recipe.slug}}: {red no createdAtTimestamp date}`,
    )
    throw new Error(`Recipe ${recipe.slug}: no createdAtTimestamp`)
  }
}
