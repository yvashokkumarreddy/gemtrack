import { RefreshCw, RotateCcw } from 'lucide-react'
import { OWNERSHIP_LABELS, STATUS_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { GEM_OWNERSHIPS, GEM_STATUSES, GEM_STOCK_TYPES } from '@/constants/gemOptions'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  ALL,
  resetFilters,
  setOwnership,
  setSearch,
  setStatus,
  setStockType,
} from '@/store/slices/inventoryFiltersSlice'

interface GemFiltersProps {
  refreshing: boolean
  onRefresh: () => void
}

// Narrowing helper: turns a <select> string back into a typed filter value
function pick<T extends string>(options: readonly T[], value: string): T | typeof ALL {
  return options.find((option) => option === value) ?? ALL
}

export function GemFilters({ refreshing, onRefresh }: GemFiltersProps) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.inventoryFilters)

  return (
    <div className="inventory-toolbar__filters">
      <input
        type="search"
        className="inventory-toolbar__search"
        placeholder="Search by SKU or name"
        value={filters.search}
        onChange={(event) => dispatch(setSearch(event.target.value))}
        aria-label="Search by SKU or name"
      />

      <select
        value={filters.stockType}
        onChange={(event) => dispatch(setStockType(pick(GEM_STOCK_TYPES, event.target.value)))}
        aria-label="Filter by stock type"
      >
        <option value={ALL}>All Stock Types</option>
        {GEM_STOCK_TYPES.map((value) => (
          <option key={value} value={value}>
            {STOCK_TYPE_LABELS[value]}
          </option>
        ))}
      </select>

      <select
        value={filters.ownership}
        onChange={(event) => dispatch(setOwnership(pick(GEM_OWNERSHIPS, event.target.value)))}
        aria-label="Filter by ownership"
      >
        <option value={ALL}>All Ownership</option>
        {GEM_OWNERSHIPS.map((value) => (
          <option key={value} value={value}>
            {OWNERSHIP_LABELS[value]}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) => dispatch(setStatus(pick(GEM_STATUSES, event.target.value)))}
        aria-label="Filter by status"
      >
        <option value={ALL}>All Statuses</option>
        {GEM_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="inventory-toolbar__icon-btn"
        onClick={() => dispatch(resetFilters())}
        aria-label="Reset filters"
        title="Reset filters"
      >
        <RotateCcw size={16} />
        Reset
      </button>

      <button
        type="button"
        className="inventory-toolbar__icon-btn"
        onClick={onRefresh}
        aria-label="Refresh list"
        title="Refresh list"
        disabled={refreshing}
      >
        <RefreshCw size={16} className={refreshing ? 'spin' : undefined} />
      </button>
    </div>
  )
}
