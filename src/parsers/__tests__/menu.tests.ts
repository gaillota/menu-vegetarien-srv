import menuHtml from './menu-old'
import parseMenu from '../menu'

describe('menu parser', () => {
  test('when parsing a menu: title', () => {
    const menu = parseMenu(menuHtml)

    expect(menu.title).toBe('Menu végétarien . Semaine du 30 novembre 2020')
  })

  test('when parsing a menu: description', () => {
    const menu = parseMenu(menuHtml)

    expect(menu.description).toEqual(
      'On commence cette semaine avec des recettes traditionnelles françaises version vegan, le même régal mais plus sain et moins calorique ! Ainsi vous pourrez découvrir de la blanquette et du cassoulet, à tester au plus vite. On continue avec un risotto au potimarron, une salade chaude de patates douces et une pizza légumes d’automne, ricotta. Sans oublier des entrées originales et des desserts savoureux. Bref, cette semaine, on vous chouchoute, on laisse doucement l’hiver arriver dans nos assiettes.',
    )
  })

  test('when parsing a menu: photoUrl', () => {
    const menu = parseMenu(menuHtml)

    expect(menu.photoUrl).toBe(
      'https://menu-vegetarien.com/wp-content/uploads/2020/11/menu-vegetarien-semaine-30-novembre-2020.jpg',
    )
  })

  test('when parsing a menu: date', () => {
    const menu = parseMenu(menuHtml)

    expect(menu.date).toBe('30 novembre 2020')
  })

  test('when parsing a menu: daily menus', () => {
    const menu = parseMenu(menuHtml)

    expect(menu.dailyMenus.length).toBe(5)
    expect(menu.dailyMenus[0]).toEqual([
      {
        title: 'Salade de chou-fleur et pommes',
        slug: 'salade-de-chou-fleur-pommes',
        photoUrl:
          'https://menu-vegetarien.com/wp-content/uploads/2018/01/salade-chou-fleur-pommes.jpg',
        url:
          'https://menu-vegetarien.com/recettes/salade-de-chou-fleur-pommes/',
      },
      {
        title: 'Blanquette vegan',
        slug: 'blanquette-vegan',
        photoUrl:
          'https://menu-vegetarien.com/wp-content/uploads/2020/10/recette-vegetarienne-blanquette-350x134.jpg',
        url: 'https://menu-vegetarien.com/recettes/blanquette-vegan/',
      },
      {
        title: 'Verrine de perles du Japon, coco, mangue et lime',
        slug: 'verrine-perles-japon-coco-mangue',
        photoUrl:
          'https://menu-vegetarien.com/wp-content/uploads/2020/11/recette-vegan-verrine-tapioca-coco-mangue-350x134.jpg',
        url:
          'https://menu-vegetarien.com/recettes/verrine-perles-japon-coco-mangue/',
      },
    ])
  })
})
