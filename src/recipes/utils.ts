import { hasKey } from "../redis";
import { signale } from '../scripts/indexNewRecipes';

export async function isRecipeAlreadyIndexed(slug: string): Promise<boolean> {
  const isAlreadyIndexed = hasKey(slug)
  signale.note(`${slug} is ${isAlreadyIndexed ? 'already' : 'not yet'} indexed`)
  return isAlreadyIndexed
}
