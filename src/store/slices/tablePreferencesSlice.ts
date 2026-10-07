import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_GEM_COLUMNS, type GemColumnKey } from '@/constants/gemColumns'

interface TablePreferencesState {
  gemColumns: Partial<Record<GemColumnKey, boolean>>
}

// Persisted to localStorage (see store/index.ts)
const initialState: TablePreferencesState = { gemColumns: DEFAULT_GEM_COLUMNS }

const tablePreferencesSlice = createSlice({
  name: 'tablePreferences',
  initialState,
  reducers: {
    toggleGemColumn(state, action: PayloadAction<GemColumnKey>) {
      const key = action.payload
      state.gemColumns[key] = !(state.gemColumns[key] ?? DEFAULT_GEM_COLUMNS[key])
    },
    resetGemColumns(state) {
      state.gemColumns = DEFAULT_GEM_COLUMNS
    },
  },
})

export const { toggleGemColumn, resetGemColumns } = tablePreferencesSlice.actions
export default tablePreferencesSlice.reducer
