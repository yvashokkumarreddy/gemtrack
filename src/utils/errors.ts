import { isAxiosError } from 'axios'

interface ApiErrorBody {
  message?: string
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'Cannot reach the server. Is the API running?'
    return error.response.data?.message ?? fallback
  }
  return fallback
}