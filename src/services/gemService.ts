import { apiUrls } from '@/constants/apiUrls'
import { api } from '@/lib/api'
import type { CreateGemInput, GemItem, GemListParams, Paginated, UpdateGemInput } from '@/types/gem'

// Pages that show their own error state pass suppressErrorToast, so the
// user doesn't get the same error twice.
export async function getGems(params: GemListParams, signal?: AbortSignal): Promise<Paginated<GemItem>> {
  const { data } = await api.get<Paginated<GemItem> | GemItem[]>(apiUrls.gems.list, {
    params,
    signal,
    suppressErrorToast: true,
  })

  // The local json-server mock (db.json) ignores unknown query params and
  // always returns the full filtered array, not the paginated envelope a
  // real backend sends. Normalize it here so the rest of the app only ever
  // deals with the Paginated<T> shape.
  if (Array.isArray(data)) {
    const total = data.length
    const start = (params.page - 1) * params.limit
    return {
      data: data.slice(start, start + params.limit),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    }
  }

  return data
}

export async function getGem(id: string, signal?: AbortSignal): Promise<GemItem> {
  const { data } = await api.get<GemItem>(apiUrls.gems.detail(id), { signal, suppressErrorToast: true })
  return data
}

export async function createGem(input: CreateGemInput): Promise<GemItem> {
  const { data } = await api.post<GemItem>(apiUrls.gems.list, input)
  return data
}

// The backend accepts PATCH (partial update), not PUT.
export async function updateGem(id: string, input: UpdateGemInput): Promise<GemItem> {
  const { data } = await api.patch<GemItem>(apiUrls.gems.detail(id), input)
  return data
}

export async function deleteGem(id: string): Promise<void> {
  await api.delete(apiUrls.gems.detail(id))
}
