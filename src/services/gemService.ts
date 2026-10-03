import { apiUrls } from '@/constants/apiUrls'
import { api } from '@/lib/api'
import type { GemItem, Paginated, UpdateGemInput } from '@/types/gem'

// Temporary: fetches one big page. Week 2 will use real pagination.
export async function getGems(): Promise<GemItem[]> {
  const { data } = await api.get<Paginated<GemItem>>(apiUrls.gems.list, {
    params: { limit: 100 },
  })
  return data.data
}

export async function getGem(id: string): Promise<GemItem> {
  const { data } = await api.get<GemItem>(apiUrls.gems.detail(id))
  return data
}

// The backend accepts PATCH, not PUT, for partial updates.
export async function updateGem(id: string, input: UpdateGemInput): Promise<GemItem> {
  const { data } = await api.patch<GemItem>(apiUrls.gems.detail(id), input)
  return data
}

export async function deleteGem(id: string): Promise<void> {
  await api.delete(apiUrls.gems.detail(id))
}