import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { GemOwnership, GemStatus, GemStockType } from '@/types/gem'

export const ALL = 'all' as const
export type FilterValue<T> = T | typeof ALL

interface InventoryFiltersState {
  search: string
  stockType: FilterValue<GemStockType>
  ownership: FilterValue<GemOwnership>
  status: FilterValue<GemStatus>
}

const initialState: InventoryFiltersState = {
  search: '',
  stockType: ALL,
  ownership: ALL,
  status: ALL,
}

const inventoryFiltersSlice = createSlice({
  name: 'inventoryFilters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setStockType(state, action: PayloadAction<FilterValue<GemStockType>>) {
      state.stockType = action.payload
    },
    setOwnership(state, action: PayloadAction<FilterValue<GemOwnership>>) {
      state.ownership = action.payload
    },
    setStatus(state, action: PayloadAction<FilterValue<GemStatus>>) {
      state.status = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setSearch, setStockType, setOwnership, setStatus, resetFilters } =
  inventoryFiltersSlice.actions
export default inventoryFiltersSlice.reducer
