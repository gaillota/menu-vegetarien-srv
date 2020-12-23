import { Ingredient } from '../types'

const quantityRegex = /(\d*,?\d*)?\s?(.*)/
const unitRegex = /(ml|cl|l\s|mg|g\s|kg|càs|càc)?(.*)/

export function parseIngredient(text: string): Ingredient {
  if (!text) {
    return null
  }

  const [, quantity, rest] = quantityRegex.exec(text) || []
  const [, unit, label] = unitRegex.exec(rest) || []

  return {
    label,
    unit,
    quantity: quantity ? Number(quantity.replace(/,/g, '.')) : null,
  }
}

export function parseIngredients(ingredients: string[]): Ingredient[] {
  return ingredients.map(parseIngredient)
}
