import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import { queryClient } from '@/lib/queryClient'
import { persistor, store } from '@/store'

// The provider stack, outermost first:
// Redux (client state) > PersistGate (waits for saved preferences to load)
// > React Query (server state) > toasts
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer position="top-right" autoClose={4000} newestOnTop />
          {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  )
}
