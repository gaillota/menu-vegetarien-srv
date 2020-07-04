export function pushKey(data: string): void {
  console.log(data)
}

export function getKey(key: string): string {
  return key
}

export function hasKey(key: string): boolean {
  return !!getKey(key)
}
