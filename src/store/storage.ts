import type { WebStorage } from 'redux-persist'

// A tiny localStorage adapter for redux-persist (avoids the CommonJS import
// quirks of redux-persist/lib/storage under Vite).
export const localStorageAdapter: WebStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}
