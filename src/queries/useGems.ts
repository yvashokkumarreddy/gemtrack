import { keepPreviousData, skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { cacheTimes } from '@/queries/cacheTimes'
import { queryKeys } from '@/queries/keys'
import { createGem, deleteGem, getGem, getGems, updateGem } from '@/services/gemService'
import type { GemListParams, UpdateGemInput } from '@/types/gem'

export function useGems(params: GemListParams) {
  return useQuery({
    queryKey: queryKeys.gems.list(params),
    queryFn: ({ signal }) => getGems(params, signal),
    staleTime: cacheTimes.gems.list,
    // Keep showing the previous page while the next one loads
    placeholderData: keepPreviousData,
  })
}

export function useGem(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.gems.detail(id ?? ''),
    // skipToken: no id yet, so don't fetch (and TypeScript knows id is a string below)
    queryFn: id ? ({ signal }) => getGem(id, signal) : skipToken,
    staleTime: cacheTimes.gems.detail,
  })
}

export function useCreateGem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGem,
    onSuccess: async (gem) => {
      queryClient.setQueryData(queryKeys.gems.detail(gem.id), gem)
      // Returning the promise keeps the mutation "pending" until lists refresh
      await queryClient.invalidateQueries({ queryKey: queryKeys.gems.lists() })
      toast.success(`${gem.sku} created`)
    },
  })
}

export function useUpdateGem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGemInput }) => updateGem(id, input),
    onSuccess: async (gem) => {
      queryClient.setQueryData(queryKeys.gems.detail(gem.id), gem)
      await queryClient.invalidateQueries({ queryKey: queryKeys.gems.lists() })
      toast.success(`${gem.sku} updated`)
    },
  })
}

export function useDeleteGem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGem,
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.gems.detail(id) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.gems.lists() })
      toast.success('Gem deleted')
    },
  })
}
