import algoliasearch from 'algoliasearch'
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '../env'
import { parseIngredients } from '../parsers/ingredients'
import { Ingredient } from '../types'

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const recipesIndex = client.initIndex('recipes')

export const description =
  'update every recipe object and parse each ingredient'

// const brokenIngredients = {
//   label:
//     'g chou-fleur,15 ml huile d’olive,250 g tomates cerises coupées en 2,80 g pesto,60 g fromage de chèvre émietté,1 oignon vert émincé',
//   quantity: 500,
// }
function fixIngredients(brokenIngredients: Ingredient): Ingredient[] {
  if (
    typeof brokenIngredients !== 'object' ||
    Array.isArray(brokenIngredients)
  ) {
    return brokenIngredients
  }

  const [firstLabel, ...rest] = brokenIngredients.label.split(',')
  const ingredients = [`${brokenIngredients.quantity}${firstLabel}`, ...rest]

  return parseIngredients(ingredients)
}

export async function main(): Promise<void> {
  let hits = []

  return recipesIndex
    .browseObjects({
      query: '',
      batch: (batch) => {
        hits = hits.concat(batch)
      },
    })
    .then(() => {
      hits = hits.map((hit) => ({
        ...hit,
        ingredients: fixIngredients(hit.ingredients),
        otherIngredients: fixIngredients(hit.otherIngredients),
      }))
    })
    .then(async () => {
      await recipesIndex.saveObjects(hits).wait()
    })
}
