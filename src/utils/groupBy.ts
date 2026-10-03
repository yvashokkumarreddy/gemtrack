export function groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> {
    return items.reduce((result, item) => {
      const groupKey = item[key] as string
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    }, {} as Record<string, T[]>)
}