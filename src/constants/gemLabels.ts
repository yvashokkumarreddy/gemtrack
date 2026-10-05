import type { GemOwnership, GemStatus, GemStockType } from '@/constants/gemOptions'

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
