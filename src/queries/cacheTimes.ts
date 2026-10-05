const SECOND = 1_000
const MINUTE = 60 * SECOND

// How long each kind of data counts as "fresh". While data is fresh, React
// Query serves it from the cache without calling the API again.
export const cacheTimes = {
  default: {
    staleTime: 30 * SECOND,
    gcTime: 5 * MINUTE, // how long unused data stays in memory
  },
  gems: {
    list: 30 * SECOND, // changes often (stock moves)
    detail: 1 * MINUTE,
  },
} as const
