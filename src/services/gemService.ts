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

// A gem that's sold is out of stock, so it moves to the archive on its own --
// no separate "archive this" step needed once it's marked sold.
function isOutOfStock(status: CreateGemInput['status'] | undefined): boolean {
  return status === 'sold'
}

export async function createGem(input: CreateGemInput): Promise<GemItem> {
  const { data } = await api.post<GemItem>(apiUrls.gems.list, {
    ...input,
    archived: isOutOfStock(input.status),
  })
  return data
}

// The backend accepts PATCH (partial update), not PUT.
export async function updateGem(id: string, input: UpdateGemInput): Promise<GemItem> {
  const payload = isOutOfStock(input.status) ? { ...input, archived: true } : input
  const { data } = await api.patch<GemItem>(apiUrls.gems.detail(id), payload)
  return data
}

// Archiving is a soft delete: the gem moves out of the active inventory list
// and into the Archive module, but stays in the database and can be restored.
export async function archiveGem(id: string): Promise<GemItem> {
  const { data } = await api.patch<GemItem>(apiUrls.gems.detail(id), { archived: true })
  return data
}

export async function restoreGem(id: string): Promise<GemItem> {
  const { data } = await api.patch<GemItem>(apiUrls.gems.detail(id), { archived: false })
  return data
}

export async function deleteGem(id: string): Promise<void> {
  await api.delete(apiUrls.gems.detail(id))
}
