import { hasKey } from "../redis";

export async function isRecipeIndexed(slug: string): Promise<boolean> {
  return hasKey(slug)
}
