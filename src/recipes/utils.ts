import { hasKey } from "../redis";

export async function isRecipeAlreadyIndexed(slug: string): Promise<boolean> {
  return hasKey(slug)
}
