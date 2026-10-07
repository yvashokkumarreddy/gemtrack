import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ViewMode = 'list' | 'grid'

interface UserPreferencesState {
  viewMode: ViewMode
}

// Persisted to localStorage (see store/index.ts)
const initialState: UserPreferencesState = { viewMode: 'list' }

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload
    },
  },
})

export const { setViewMode } = userPreferencesSlice.actions
export default userPreferencesSlice.reducer
