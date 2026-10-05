import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import type { PageSize } from '@/constants/pagination'
import {
  resetFilters,
  setOwnership,
  setSearch,
  setStatus,
  setStockType,
} from '@/store/slices/inventoryFiltersSlice'

interface PaginationState {
  page: number
  pageSize: PageSize
}

const initialState: PaginationState = { page: 1, pageSize: 10 }

const paginationSlice = createSlice({
  name: 'inventoryPagination',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setPageSize(state, action: PayloadAction<PageSize>) {
      state.pageSize = action.payload
      state.page = 1
    },
  },
  // Changing any filter starts again from page 1 (this slice listens to the
  // filters slice's actions, so components never have to remember to do it)
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(setSearch, setStockType, setOwnership, setStatus, resetFilters),
      (state) => {
        state.page = 1
      }
    )
  },
})

export const { setPage, setPageSize } = paginationSlice.actions
export default paginationSlice.reducer
