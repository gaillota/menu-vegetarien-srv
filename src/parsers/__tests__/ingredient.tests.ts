import parseIngredient from '../ingredient'

describe('ingredient parser', () => {
  test('is nullable', () => {
    const input = null
    const result = null

    expect(parseIngredient(input)).toEqual(result)
  })

  test('no quantity nor unit, just label', () => {
    const input = 'sel'
    const result = {
      quantity: null,
      label: 'sel',
    }

    expect(parseIngredient(input)).toEqual(result)
  })

  test('no unit, just quantity and label', () => {
    const input = '3 oeufs'
    const result = {
      quantity: 3,
      label: 'oeufs',
    }

    expect(parseIngredient(input)).toEqual(result)
  })

  test('when quantity, unit and label', () => {
    const input = '3 cl de lait'
    const result = {
      quantity: 3,
      label: 'cl de lait',
    }

    expect(parseIngredient(input)).toEqual(result)
  })

  test('when quantity has comma', () => {
    const input = '34,45 cl de lait'
    const result = {
      quantity: 34.45,
      label: 'cl de lait',
    }

    expect(parseIngredient(input)).toEqual(result)
  })

  // when quantity, unit and label, ex: '3 cl de lait'
  // nb: list all units with their multiplier
})
