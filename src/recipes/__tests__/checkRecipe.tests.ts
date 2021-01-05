/* eslint-disable @typescript-eslint/ban-ts-comment */
import { checkRecipe } from '../checkRecipe'

describe('checkRecipe', () => {
  test('when recipe has no title', () => {
    const recipe = {
      slug: 'prout-zer',
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no title`)
  })

  test('when recipe has no photo', () => {
    const recipe = {
      slug: 'prout-lol',
      title: 'Prout lol',
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no photo`)
  })

  test('when recipe has no preparation time', () => {
    const recipe = {
      slug: 'prout-mdr',
      title: 'Prout mdr',
      photoUrl: 'http://prout-mdr',
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no preparation time`)
  })

  test('when recipe has no servings', () => {
    const recipe = {
      slug: 'prout-xd',
      title: 'Prout xd',
      photoUrl: 'http://prout-xd',
      preparationTime: 12,
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: Missing # servings`)
  })

  test('when recipe has no ingredients', () => {
    const recipe = {
      slug: 'prout-gg',
      title: 'Prout gg',
      photoUrl: 'http://prout-gg',
      preparationTime: 12,
      servings: 4,
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no ingredients`)
  })

  test('when recipe has only one ingredient with no label', () => {
    const recipe = {
      slug: 'prout-turfu',
      title: 'Prout turfu',
      photoUrl: 'http://prout-turfu',
      preparationTime: 12,
      servings: 4,
      ingredients: [{}],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug} -> Ingredient #1: no label`)
  })

  test('when recipe has many ingredients including one with no label', () => {
    const recipe = {
      slug: 'prout-lmao',
      title: 'Prout lmao',
      photoUrl: 'http://prout-lmao',
      preparationTime: 12,
      servings: 4,
      ingredients: [
        {
          label: 'tomate',
        },
        {
          label: 'oeufs',
        },
        {},
      ],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug} -> Ingredient #3: no label`)
  })

  test('when recipe has one other ingredient without title', () => {
    const recipe = {
      slug: 'prout-and',
      title: 'Prout and',
      photoUrl: 'http://prout-and',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Tomates' }],
      otherIngredients: [{}],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient #1: no title`,
    )
  })

  test('when recipe has one other ingredients without ingredients', () => {
    const recipe = {
      slug: 'prout-what',
      title: 'Prout what',
      photoUrl: 'http://prout-what',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Tomates' }],
      otherIngredients: [{ title: 'Sauce' }],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient ${recipe.otherIngredients[0].title}: no ingredients`,
    )
  })

  test('when recipe has many other ingredients including one without ingredients', () => {
    const recipe = {
      slug: 'prout-you',
      title: 'Prout you',
      photoUrl: 'http://prout-you',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Tomates' }],
      otherIngredients: [
        {
          title: 'Sauce',
          ingredients: [{ label: 'Citron' }, {}],
        },
      ],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient ${recipe.otherIngredients[0].title} -> Ingredient #2: no label`,
    )
  })

  test('when recipe has no ingredients and one other ingredient with no title', () => {
    const recipe = {
      slug: 'prout-laughing',
      title: 'Prout laughing',
      photoUrl: 'http://prout-laughing',
      preparationTime: 12,
      servings: 4,
      otherIngredients: [{}],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient #1: no title`,
    )
  })

  test('when recipe has no ingredients and one other ingredients including one with no title', () => {
    const recipe = {
      slug: 'prout-boutik',
      title: 'Prout-boutik',
      photoUrl: 'http://prout-boutik',
      preparationTime: 12,
      servings: 4,
      otherIngredients: [{}],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient #1: no title`,
    )
  })

  test('when recipe has no ingredients and one other ingredients with one ingredient with no label', () => {
    const recipe = {
      slug: 'prout-caracas',
      title: 'Prout-caracas',
      photoUrl: 'http://prout-caracas',
      preparationTime: 12,
      servings: 4,
      otherIngredients: [{ title: 'Sauce', ingredients: [{}] }],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient Sauce -> Ingredient #1: no label`,
    )
  })

  test('when recipe has no ingredients and many other ingredients including one with no title', () => {
    const recipe = {
      slug: 'prout-casino',
      title: 'Prout-casino',
      photoUrl: 'http://prout-casino',
      preparationTime: 12,
      servings: 4,
      otherIngredients: [
        { title: 'Sauce', ingredients: [{ label: 'Moutarde' }] },
        {},
      ],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(
      `Recipe ${recipe.slug} -> Other ingredient #2: no title`,
    )
  })

  test('when recipe has no createdAt date', () => {
    const recipe = {
      slug: 'prout-lost',
      title: 'Prout-lost',
      photoUrl: 'http://prout-lost',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Oeufs', quantity: 3 }],
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no createdAt`)
  })

  test('when recipe has no createdAtTimestamp date', () => {
    const recipe = {
      slug: 'prout-lost',
      title: 'Prout-lost',
      photoUrl: 'http://prout-lost',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Oeufs', quantity: 3 }],
      createdAt: new Date().toISOString()
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual(`Recipe ${recipe.slug}: no createdAtTimestamp`)
  })

  test('when recipe has everyting needed', () => {
    const recipe = {
      slug: 'prout-booba',
      title: 'Prout-booba',
      photoUrl: 'http://prout-booba',
      preparationTime: 12,
      servings: 4,
      ingredients: [{ label: 'Oeufs', quantity: 3 }],
      createdAt: new Date(),
      createdAtTimestamp: 12332141,
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toBeNull()
  })

  test('when recipe has no ingredients but multiple other ingredients', () => {
    const recipe = {
      slug: 'prout-final',
      title: 'Prout-final',
      photoUrl: 'http://prout-final',
      preparationTime: 12,
      servings: 4,
      otherIngredients: [
        {
          title: 'Sauce',
          ingredients: [
            { label: 'Moutarde', quantity: 300 },
            { label: 'Oeufs', quantity: 4 },
          ],
        },
        {
          title: 'Boulettes',
          ingredients: [
            { label: 'Oignons', quantity: 1 },
            { label: 'boeufs', quantity: 300, unit: 'mg' },
          ],
        },
      ],
      createdAt: new Date(),
      createdAtTimestamp: 12332141,
    }
    let error = null

    try {
      // @ts-ignore
      checkRecipe(recipe)
    } catch (e) {
      error = e.message
    }

    expect(error).toBeNull()
  })
})
