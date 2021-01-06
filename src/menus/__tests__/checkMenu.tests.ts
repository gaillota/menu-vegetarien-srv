/* eslint-disable @typescript-eslint/ban-ts-comment */
import { checkMenu } from '../checkMenu'

describe('checkMenu', () => {
  const date = new Date().toISOString()

  test('when menu is empty', () => {
    const menu = {
      slug: 'menu-0',
    }
    let error = null
    try {
      // @ts-ignore
      checkMenu(menu)
    } catch (e) {
      error = e.message
    }

    expect(error).toEqual('Menu menu-0: no title')
  })

  const data = [
    {
      test: 'when menu has no date',
      result: 'Menu menu-1: no date',
    },
    {
      test: 'when menu has no photo',
      date,
      result: 'Menu menu-2: no photo',
    },
    {
      test: 'when menu has no dailyMenus',
      date,
      photoUrl: 'http://menu',
      result: 'Menu menu-3: no dailyMenus',
    },
    {
      test: 'when menu has empty dailyMenus',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [],
      result: 'Menu menu-4: less than 5 dailyMenus',
    },
    {
      test: 'when menu has less than 5 daily menus',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [[]],
      result: 'Menu menu-5: less than 5 dailyMenus',
    },
    {
      test: 'when menu has first dailyMenu with no courses',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [null, [], [], [], []],
      result: 'Menu menu-6: missing Monday menu',
    },
    {
      test: 'when menu has first dailyMenu with less than 3 courses',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [[{}], [], [], [], []],
      result: 'Menu menu-7: missing dish in Monday menu',
    },
    {
      test: 'when menu has first dailyMenu with first course with no title',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [[{}, {}, {}], [], [], [], []],
      result: 'Menu menu-8 -> Monday -> Starter: no slug',
    },
    {
      test: 'when menu has first dailyMenu with first course with no slug',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [[{ slug: 'soupe-de-pois' }, {}, {}], [], [], [], []],
      result: 'Menu menu-9 -> Monday -> Starter: no name',
    },
    {
      test: 'when menu has first dailyMenu with first course with no photo',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [
        [{ slug: 'soupe-de-pois', title: 'Soupe de pois' }, {}, {}],
        [],
        [],
        [],
        [],
      ],
      result: 'Menu menu-10 -> Monday -> Starter: no photo',
    },
    {
      test: 'when menu has first dailyMenu with second course with no title',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {},
          {},
        ],
        [],
        [],
        [],
        [],
      ],
      result: 'Menu menu-11 -> Monday -> Dish: no slug',
    },
    {
      test: 'when menu has second dailyMenu with less than 3 courses',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [{}],
        [],
        [],
        [],
      ],
      result: 'Menu menu-12: missing dish in Tuesday menu',
    },
    {
      test: 'when menu has second dailyMenu with first course with no title',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [{}, {}, {}],
        [],
        [],
        [],
      ],
      result: 'Menu menu-13 -> Tuesday -> Starter: no slug',
    },
    {
      test: 'when menu has everything needed',
      date,
      photoUrl: 'http://menu',
      dailyMenus: [
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
        [
          {
            title: 'Soupe de pois',
            slug: 'soupe-de-pois',
            photoUrl: 'http://dish',
          },
          {
            title: 'Poisson',
            slug: 'poisson',
            photoUrl: 'http://dish',
          },
          {
            title: 'Yaourt',
            slug: 'yaourt',
            photoUrl: 'http://dish',
          },
        ],
      ],
      result: null,
    },
  ]

  data.forEach(({ test: when, result, ...data }, i) => {
    // eslint-disable-next-line jest/valid-title
    test(when, () => {
      const menu = {
        slug: `menu-${i + 1}`,
        title: `Menu ${i + 1}`,
        ...data,
      }
      let error = null

      try {
        // @ts-ignore
        checkMenu(menu)
      } catch (e) {
        error = e.message
      }

      expect(error).toEqual(result)
    })
  })
})
