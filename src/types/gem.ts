export type GemStatus = 'in_stock' | 'sold' | 'on_memo'

export interface GemItem {
  id: string
  sku: string
  name: string
  caratWeight: number
  color: string
  clarity: string
  cut: string
  cost: number
  price: number
  status: GemStatus
}