import { queryClient } from '@/lib/queryClient'
import { clearToken, saveToken } from '@/utils/auth'

// Cached API data belongs to one user. Clear it whenever the user changes,
// or the next person to log in could briefly see the previous one's data.
export function startSession(token: string): void {
  queryClient.clear()
  saveToken(token)
}

export function endSession(): void {
  clearToken()
  queryClient.clear()
}
