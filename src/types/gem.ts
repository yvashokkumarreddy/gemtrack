export type GemStatus = 'in_stock' | 'sold' | 'on_memo'
export type GemOwnership = 'owned' | 'memo_in' | 'partner'
export type GemStockType = 'parcel' | 'single' | 'set' | 'pair'

export interface GemItem {
  id: string
  sku: string
  name: string
  caratWeight: number
  color: string
  clarity: string
  // The backend doesn't store or return these yet -- added here for the
  // UI, so they must stay optional until the API catches up.
  ownership?: GemOwnership
  stockType?: GemStockType
  cut: string
  cost: number
  price: number
  status: GemStatus
}

// Fields the backend's /gems endpoint actually accepts (confirmed against
// its validation errors: no ownership/stockType support yet).
export type EditableGemFields = Pick<
  GemItem,
  'sku' | 'name' | 'caratWeight' | 'color' | 'clarity' | 'cut' | 'cost' | 'price' | 'status'
>

export type CreateGemInput = Omit<GemItem, 'id'>
export type UpdateGemInput = Partial<EditableGemFields>
export type GemListItem = Pick<
  GemItem,
  'id' | 'sku' | 'name' | 'price' | 'status' | 'ownership' | 'stockType'
>

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}