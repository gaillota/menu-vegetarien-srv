export function dateToTimestamp(date?: string): number | void {
  if (!date) {
    return
  }

  return new Date(date).getTime() / 1000
}
