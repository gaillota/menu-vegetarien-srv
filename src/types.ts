export interface Recipe {
  title: string
  slug: string
  description: string
  photoUrl: string
  preparationTime: number
  cookingTime: number
  servings: number
  ingredients: Array<string>
  otherIngredients: Array<string>
  instructions: Array<string>
  createdAt: string
}

export interface DailyMenu {
  title: string
  photoUrl: string
  url: string
}

export interface WeeklyMenu {
  title: string
  description: string
  photoUrl: string
  url?: string
  date: string
  dailyMenus: Array<DailyMenu>
}

export interface PaginationResult<T> {
  page: number
  pagesCount?: number
  hasMore: boolean
  data: Array<T>
}

export type ParsingResult<T> = Pick<PaginationResult<T>, 'data' | 'pagesCount'>

export enum Queue {
  RecipeFilterer = 'recipe-filterer',
  RecipeParser = 'recipe-parser',
  RecipeIndexer = 'recipe-indexer',
}

export enum Index {
  Recipes = 'recipes',
}
