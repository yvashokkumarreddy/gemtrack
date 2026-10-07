import type { GemOwnership, GemStatus, GemStockType } from '@/constants/gemOptions'

export type { GemOwnership, GemStatus, GemStockType }

export interface GemItem {
  id: string
  sku: string
  name: string
  caratWeight: number
  color: string
  clarity: string
  ownership: GemOwnership
  stockType: GemStockType
  cut: string
  cost: number
  price: number
  status: GemStatus
  archived: boolean
}

export type CreateGemInput = Omit<GemItem, 'id' | 'archived'>
export type UpdateGemInput = Partial<CreateGemInput>
export type GemListItem = Pick<
  GemItem,
  'id' | 'sku' | 'name' | 'price' | 'status' | 'ownership' | 'stockType'
>

// What the list endpoint accepts. The server does the filtering and paging.
export interface GemListParams {
  page: number
  limit: number
  q?: string
  status?: GemStatus
  ownership?: GemOwnership
  stockType?: GemStockType
  sort?: string
  archived?: boolean
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
