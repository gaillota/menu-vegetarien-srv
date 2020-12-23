export function dateToTimestamp(date?: string): number | void {
  if (!date) {
    return
  }

  return new Date(date).getTime() / 1000
}

export function cleanString(str: string): string {
  if (typeof str !== 'string') {
    return str
  }

  return str
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}
