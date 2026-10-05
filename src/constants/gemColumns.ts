export const GEM_COLUMN_KEYS = [
  'sku',
  'name',
  'stockType',
  'caratWeight',
  'color',
  'clarity',
  'ownership',
  'cut',
  'price',
  'status',
] as const

export type GemColumnKey = (typeof GEM_COLUMN_KEYS)[number]

export interface GemColumn {
  key: GemColumnKey
  label: string
  align?: 'right'
  locked?: boolean // cannot be hidden
}

export const GEM_COLUMNS: readonly GemColumn[] = [
  { key: 'sku', label: 'SKU', locked: true },
  { key: 'name', label: 'Name' },
  { key: 'stockType', label: 'Stock Type' },
  { key: 'caratWeight', label: 'Carat Weight', align: 'right' },
  { key: 'color', label: 'Color' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'cut', label: 'Cut' },
  { key: 'price', label: 'Price', align: 'right' },
  { key: 'status', label: 'Status' },
]

export const DEFAULT_GEM_COLUMNS: Record<GemColumnKey, boolean> = {
  sku: true,
  name: true,
  stockType: true,
  caratWeight: true,
  color: true,
  clarity: true,
  ownership: true,
  cut: true,
  price: true,
  status: true,
}

// Saved preferences can be older than the code (a column added later), so
// anything missing falls back to its default instead of silently vanishing.
export function visibleGemColumns(saved: Partial<Record<GemColumnKey, boolean>>): GemColumn[] {
  return GEM_COLUMNS.filter((column) => column.locked || (saved[column.key] ?? DEFAULT_GEM_COLUMNS[column.key]))
}
