import type { GemOwnership, GemStatus, GemStockType } from '@/types/gem'

export const STATUS_LABELS: Record<GemStatus, string> = {
  in_stock: 'In Stock',
  sold: 'Sold',
  on_memo: 'On Memo',
}

export const OWNERSHIP_LABELS: Record<GemOwnership, string> = {
  owned: 'Owned',
  memo_in: 'Memo In',
  partner: 'Partner',
}

export const STOCK_TYPE_LABELS: Record<GemStockType, string> = {
  parcel: 'Parcel',
  single: 'Single',
  set: 'Set',
  pair: 'Pair',
}

// The backend doesn't return ownership/stockType yet, so these fall back
// to a placeholder instead of rendering blank for every row.
export function ownershipLabel(value: GemOwnership | undefined): string {
  return value ? OWNERSHIP_LABELS[value] : '—'
}

export function stockTypeLabel(value: GemStockType | undefined): string {
  return value ? STOCK_TYPE_LABELS[value] : '—'
}
