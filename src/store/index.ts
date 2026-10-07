import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import inventoryFiltersReducer from '@/store/slices/inventoryFiltersSlice'
import paginationReducer from '@/store/slices/paginationSlice'
import tablePreferencesReducer from '@/store/slices/tablePreferencesSlice'
import userPreferencesReducer from '@/store/slices/userPreferencesSlice'
import { localStorageAdapter } from '@/store/storage'

const persistConfig = (key: string) => ({
  key: `gemtrack_${key}`,
  version: 1,
  storage: localStorageAdapter,
})

const rootReducer = combineReducers({
  // Not saved: filters and paging reset on reload
  inventoryFilters: inventoryFiltersReducer,
  inventoryPagination: paginationReducer,
  // Saved to localStorage: only the two preference slices
  tablePreferences: persistReducer(persistConfig('tablePreferences'), tablePreferencesReducer),
  userPreferences: persistReducer(persistConfig('userPreferences'), userPreferencesReducer),
})

// A factory, so tests can create a fresh store each time
export function createStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // redux-persist's own actions carry functions, which are not serializable
        serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
      }),
  })
}

export const store = createStore()
export const persistor = persistStore(store)

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
