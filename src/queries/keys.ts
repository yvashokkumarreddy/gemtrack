import type { GemListParams } from '@/types/gem'

// Every cache key comes from this one factory. Because keys are nested,
// invalidating queryKeys.gems.all refreshes every gem list, detail page and
// count at once, and invalidating lists() refreshes only the lists.
const gemsAll = ['gems'] as const

export const queryKeys = {
  gems: {
    all: gemsAll,
    lists: () => [...gemsAll, 'list'] as const,
    list: (params: GemListParams) => [...gemsAll, 'list', params] as const,
    details: () => [...gemsAll, 'detail'] as const,
    detail: (id: string) => [...gemsAll, 'detail', id] as const,
  },
} as const
