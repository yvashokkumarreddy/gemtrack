import { isAxiosError } from 'axios'
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'

interface ApiFieldError {
  path: string
  message: string
}

interface ApiErrorBody {
  errors?: ApiFieldError[]
}

// The API answers 422 / 409 with { errors: [{ path, message }] }. This shows
// each message next to its field and returns the fields it handled.
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[]
): FieldPath<T>[] {
  if (!isAxiosError<ApiErrorBody>(error)) return []

  const handled: FieldPath<T>[] = []
  for (const item of error.response?.data?.errors ?? []) {
    const field = fields.find((name) => name === item.path)
    if (field) {
      setError(field, { type: 'server', message: item.message })
      handled.push(field)
    }
  }
  return handled
}
