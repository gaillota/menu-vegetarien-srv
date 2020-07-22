import { hasKey } from '../redis'

export async function isMenuAlreadyIndexed(slug: string): Promise<boolean> {
  return hasKey(slug)
}

const translatedMonths = [
  ['january', 'janvier'],
  ['february', 'février'],
  ['march', 'mars'],
  ['april', 'avril'],
  ['may', 'mai'],
  ['june', 'juin'],
  ['july', 'juillet'],
  ['august', 'août'],
  ['september', 'septembre'],
  ['october', 'octobre'],
  ['november', 'novembre'],
  ['december', 'décembre'],
]

export function translateDateString(date: string): string {
  let translatedDate = date

  translatedMonths.forEach(([month, translatedMonth]) => {
    if (date.includes(translatedMonth)) {
      translatedDate = date.replace(translatedMonth, month)
    }
  })

  return translatedDate
}
