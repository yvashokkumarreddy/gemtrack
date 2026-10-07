import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { cacheTimes } from '@/queries/cacheTimes'

function shouldRetry(failureCount: number, error: unknown): boolean {
  // 4xx means the request itself was wrong (not found, no permission...),
  // so asking again can't help. Network and 5xx errors get two more tries.
  if (isAxiosError(error) && error.response && error.response.status < 500) return false
  return failureCount < 2
}

// A factory, so tests can create a fresh client each time
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: cacheTimes.default.staleTime,
        gcTime: cacheTimes.default.gcTime,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  })
}

export const queryClient = createQueryClient()
