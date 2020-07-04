import * as cheerio from 'cheerio'

import { Recipe } from '../types'

const TITLE_SELECTOR = 'div.blog-main > h1'
const DESCRIPTION_SELECTOR = 'span.wpurp-recipe-description'
const PHOTO_SELECTOR = 'div.blog-main > div.blog-rightsidebar-img > img'
const CREATED_AT_SELECTOR = 'div.blog-main > div.fancy_categories time'
const PREPARATION_TIME_SELECTOR = 'span.wpurp-recipe-prep-time'
const COOKING_TIME_SELECTOR = 'span.wpurp-recipe-cook-time'
const SERVINGS_SELECTOR = 'input.advanced-adjust-recipe-servings'
const INGREDIENTS_SELECTOR = 'div.wpurp-recipe-ingredients'
const INGREDIENTS_GROUP_SELECTOR = 'div.wpurp-recipe-ingredient-group-container'
const INGREDIENTS_ROW_SELECTOR = 'div.wpurp-rows-row'
const INGREDIENTS_LIST_SELECTOR = 'ul.wpurp-recipe-ingredient-container'
const INGREDIENTS_LIST_ITEM_SELECTOR = 'li.wpurp-recipe-ingredient'
const INSTRUCTIONS_ITEM_SELECTOR =
  'ol.wpurp-recipe-instruction-container li.wpurp-recipe-instruction'
const INSTRUCTIONS_TEXT_SELECTOR = 'span.wpurp-recipe-instruction-text'

function parseRecipe(html): Recipe {
  const $ = cheerio.load(html)
  const title = $(TITLE_SELECTOR).text()
  const description = $(DESCRIPTION_SELECTOR).text()
  const photoUrl = $(PHOTO_SELECTOR).attr('src')
  const createdAt = $(CREATED_AT_SELECTOR).attr('datetime')
  const preparationTime = Number($(PREPARATION_TIME_SELECTOR).first().text())
  const cookingTime = Number($(COOKING_TIME_SELECTOR).first().text())
  const servings = Number($(SERVINGS_SELECTOR).val())

  const ingredients = []
  const otherIngredients = []
  $(INGREDIENTS_SELECTOR)
    .eq(1)
    .find(INGREDIENTS_GROUP_SELECTOR)
    .each((_, element) => {
      const currentIngredients = []
      const $group = $(element)
      const $rows = $group.find(INGREDIENTS_ROW_SELECTOR)
      const title = $rows.first().text().trim()

      $rows
        .children(INGREDIENTS_LIST_SELECTOR)
        .first()
        .children(INGREDIENTS_LIST_ITEM_SELECTOR)
        .each((_, element) => {
          const ingredient = $(element).text()

          currentIngredients.push(ingredient)
        })

      // Main ingredients
      if (!title) {
        ingredients.push(...currentIngredients)
        return
      }

      // Other ingredients
      otherIngredients.push({
        title,
        ingredients: currentIngredients,
      })
    })

  const instructions = []
  $(INSTRUCTIONS_ITEM_SELECTOR).each((_, element) => {
    const $instruction = $(element)
    const text = $instruction.find(INSTRUCTIONS_TEXT_SELECTOR).text()

    instructions.push(text)
  })

  return {
    title,
    slug: null,
    description,
    photoUrl,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    otherIngredients,
    instructions,
    createdAt,
  }
}

export default parseRecipe
