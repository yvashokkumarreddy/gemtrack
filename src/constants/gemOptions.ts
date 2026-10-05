// Single source of truth for the allowed values. The TypeScript types, the
// dropdowns and the zod schemas are all derived from these three lists.
export const GEM_STATUSES = ['in_stock', 'sold', 'on_memo'] as const
export const GEM_OWNERSHIPS = ['owned', 'memo_in', 'partner'] as const
export const GEM_STOCK_TYPES = ['parcel', 'single', 'set', 'pair'] as const

export type GemStatus = (typeof GEM_STATUSES)[number]
export type GemOwnership = (typeof GEM_OWNERSHIPS)[number]
export type GemStockType = (typeof GEM_STOCK_TYPES)[number]
