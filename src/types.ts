export interface Ingredient {
  quantity?: number
  label: string
}

export interface Recipe {
  title: string
  slug: string
  description: string
  photoUrl: string
  preparationTime: number
  cookingTime: number
  servings: number
  ingredients: Array<Ingredient>
  otherIngredients: Array<Ingredient>
  instructions: Array<string>
  createdAt: string
  createdAtTimestamp: number
}

export interface WeeklyMenu {
  title: string
  slug: string
  description: string
  photoUrl: string
  url?: string
  date: string
  dateTimestamp: number
  dailyMenus: Array<Array<Recipe>>
}

export interface PaginationResult<T> {
  page: number
  pagesCount?: number
  hasMore: boolean
  data: Array<T>
}

export interface PaginationResultLight<T> {
  page: number
  data: Array<T>
}

export type ParsingResult<T> = Pick<PaginationResult<T>, 'data' | 'pagesCount'>

export enum Queue {
  RecipeFilterer = 'recipe-filterer',
  RecipeParser = 'recipe-parser',
  RecipeIndexer = 'recipe-indexer',
  MenuParser = 'menu-parser',
  MenuIndexer = 'menu-indexer',
}

export enum Index {
  Recipes = 'recipes',
  Menus = 'menus',
}
