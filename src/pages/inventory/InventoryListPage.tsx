import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, RefreshCw, RotateCcw } from 'lucide-react'
import { GemCard } from '@/components/GemCard'
import { GemRow } from '@/components/GemRow'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { OWNERSHIP_LABELS, STATUS_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { getGems } from '@/services/gemService'
import type { GemItem, GemOwnership, GemStatus, GemStockType } from '@/types/gem'
import { hasPermission } from '@/utils/auth'
import './inventory.css'

const ALL = 'all' as const
const PAGE_SIZES = [10, 25, 50, 100] as const
const BASE_PATH = '/inventory'

type ViewMode = 'list' | 'grid'

export function InventoryListPage() {
  const [items, setItems] = useState<GemItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [stockTypeFilter, setStockTypeFilter] = useState<GemStockType | typeof ALL>(ALL)
  const [ownershipFilter, setOwnershipFilter] = useState<GemOwnership | typeof ALL>(ALL)
  const [statusFilter, setStatusFilter] = useState<GemStatus | typeof ALL>(ALL)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const canWrite = hasPermission(MODULES.INVENTORY, PERMISSION.WRITE)

  // Defined and called entirely inside the effect, with an `ignore` guard
  // against a stale response landing after unmount/re-run -- the standard
  // data-fetching-in-an-effect pattern.
  useEffect(() => {
    let ignore = false

    const loadOnMount = async () => {
      try {
        const gems = await getGems()
        if (!ignore) {
          setItems(gems)
          setError(null)
        }
      } catch (err) {
        if (!ignore) setError('Failed to fetch gems')
        console.error('Error fetching gems:', err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void loadOnMount()
    return () => {
      ignore = true
    }
  }, [])

  // User-triggered, not effect-triggered, so setState here is unrestricted.
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const gems = await getGems()
      setItems(gems)
      setError(null)
    } catch (err) {
      setError('Failed to fetch gems')
      console.error('Error fetching gems:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      if (query && !item.sku.toLowerCase().includes(query)) return false
      if (stockTypeFilter !== ALL && item.stockType !== stockTypeFilter) return false
      if (ownershipFilter !== ALL && item.ownership !== ownershipFilter) return false
      if (statusFilter !== ALL && item.status !== statusFilter) return false
      return true
    })
  }, [items, search, stockTypeFilter, ownershipFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

  // Deriving state during render (React's documented pattern for "a list
  // got shorter, clamp the selection") instead of an effect: a filter
  // change, a page-size change, or deleting the last item on a page can
  // all strand `page` past the end.
  const [prevTotalPages, setPrevTotalPages] = useState(totalPages)
  if (totalPages !== prevTotalPages) {
    setPrevTotalPages(totalPages)
    if (page > totalPages) setPage(totalPages)
  }

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, page, pageSize])

  const updateFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch('')
    setStockTypeFilter(ALL)
    setOwnershipFilter(ALL)
    setStatusFilter(ALL)
    setPage(1)
  }

  const handleDeleted = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <>
      <div className="inventory-toolbar">
        <div className="inventory-toolbar__filters">
          <input
            type="search"
            className="inventory-toolbar__search"
            placeholder="Search by Stock ID (SKU)"
            value={search}
            onChange={(event) => updateFilter(setSearch, event.target.value)}
            aria-label="Search by Stock ID"
          />

          <select
            value={stockTypeFilter}
            onChange={(event) =>
              updateFilter(setStockTypeFilter, event.target.value as GemStockType | typeof ALL)
            }
            aria-label="Filter by stock type"
          >
            <option value={ALL}>All Stock Types</option>
            {Object.entries(STOCK_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={ownershipFilter}
            onChange={(event) =>
              updateFilter(setOwnershipFilter, event.target.value as GemOwnership | typeof ALL)
            }
            aria-label="Filter by ownership"
          >
            <option value={ALL}>All Ownership</option>
            {Object.entries(OWNERSHIP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              updateFilter(setStatusFilter, event.target.value as GemStatus | typeof ALL)
            }
            aria-label="Filter by status"
          >
            <option value={ALL}>All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="inventory-toolbar__icon-btn"
            onClick={resetFilters}
            aria-label="Reset filters"
            title="Reset filters"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            className="inventory-toolbar__icon-btn"
            onClick={() => void handleRefresh()}
            aria-label="Refresh list"
            title="Refresh list"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : undefined} />
            
          </button>
        </div>

        <div className="inventory-toolbar__right">
          <div className="inventory-view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={viewMode === 'list' ? 'active' : undefined}
              onClick={() => setViewMode('list')}
              aria-label="Switch to list view"
              aria-pressed={viewMode === 'list'}
              title="List view"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={viewMode === 'grid' ? 'active' : undefined}
              onClick={() => setViewMode('grid')}
              aria-label="Switch to grid view"
              aria-pressed={viewMode === 'grid'}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {canWrite && (
            <button type="button" className="inventory-toolbar__add">
              Add item
            </button>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Stock Type</th>
              <th className="text-right">Carat Weight</th>
              <th>Color</th>
              <th>Clarity</th>
              <th>Ownership</th>
              <th>Cut</th>
              <th className="text-right">Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedItems.map((item) => (
              <GemRow
                key={item.id}
                item={item}
                basePath={BASE_PATH}
                canWrite={canWrite}
                onDeleted={handleDeleted}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="gem-grid">
          {pagedItems.map((item) => (
            <GemCard
              key={item.id}
              item={item}
              basePath={BASE_PATH}
              canWrite={canWrite}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && <p className="inventory-empty">No gems match these filters.</p>}

      {filteredItems.length > 0 && (
        <div className="inventory-pagination">
          <label className="inventory-pagination__size">
            Rows per page
            <select
              value={pageSize}
              onChange={(event) =>
                updateFilter(setPageSize, Number(event.target.value) as (typeof PAGE_SIZES)[number])
              }
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="inventory-pagination__nav">
            <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages} &middot; {filteredItems.length} gems
            </span>
            <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}
