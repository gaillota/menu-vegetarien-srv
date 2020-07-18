import { hasKey } from "../redis";

export async function isMenuAlreadyIndexed(slug: string): Promise<boolean> {
  return hasKey(slug)
}
