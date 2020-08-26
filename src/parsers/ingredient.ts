import { Ingredient } from '../types'

const regex = /(\d*,?\d*)?\s?(.*)/

function parseIngredient(text: string): Ingredient {
  if (!text) {
    return null
  }

  const result = regex.exec(text) || []

  const [, quantity, label] = result

  return {
    label,
    quantity: quantity ? Number(quantity.replace(/,/g, '.')) : null,
  }
}

export default parseIngredient
