export interface Ingredient {
  quantity?: number
  unit?: string
  label: string
}

export interface OtherIngredient {
  title: string
  ingredients: Array<Ingredient>
}

export interface Recipe {
  title: string
  slug: string
  description?: string
  photoUrl: string
  preparationTime: number
  cookingTime?: number
  servings: number
  ingredients: Array<Ingredient>
  otherIngredients?: Array<OtherIngredient>
  instructions: Array<string>
  createdAt: string
  createdAtTimestamp: number
}

export interface Menu {
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

export type ParsingResult<T> = Pick<PaginationResult<T>, 'data' | 'pagesCount'>

export enum Queue {
  RecipeFilterer = 'recipe-filterer',
  RecipeParser = 'recipe-parser',
  RecipeIndexer = 'recipe-indexer',
  RecipeChecker = 'recipe-checker',
  MenuParser = 'menu-parser',
  MenuIndexer = 'menu-indexer',
  MenuChecker = 'menu-checker',
  ApnDispatcher = 'apn-dispatcher',
}

export enum Index {
  Recipes = 'recipes',
  Menus = 'menus',
}

export enum NotificationType {
  Alert = 'alert',
  Background = 'background',
}

export interface Notification {
  title: string
  body?: string
  expiry?: number
  type?: NotificationType
}

export interface NotificationEmitter {
  devicesIds: string[],
  notification: Notification
}

export interface IntegrityError {
  message?: string
  fatal?: boolean
}
