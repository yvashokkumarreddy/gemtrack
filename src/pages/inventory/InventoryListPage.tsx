import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageError, PageLoader } from '@/components/common/PageStatus'
import { Pagination } from '@/components/common/Pagination'
import { ViewToggle } from '@/components/common/ViewToggle'
import { GemCard } from '@/components/inventory/GemCard'
import { GemColumnMenu } from '@/components/inventory/GemColumnMenu'
import { GemFilters } from '@/components/inventory/GemFilters'
import { GemTable } from '@/components/inventory/GemTable'
import { visibleGemColumns } from '@/constants/gemColumns'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGems } from '@/queries/useGems'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ALL } from '@/store/slices/inventoryFiltersSlice'
import { setPage, setPageSize } from '@/store/slices/paginationSlice'
import { setViewMode } from '@/store/slices/userPreferencesSlice'
import type { GemListParams } from '@/types/gem'
import { hasPermission } from '@/utils/auth'
import './inventory.css'

export function InventoryListPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Client state (Redux): what the user asked to see
  const filters = useAppSelector((state) => state.inventoryFilters)
  const { page, pageSize } = useAppSelector((state) => state.inventoryPagination)
  const viewMode = useAppSelector((state) => state.userPreferences.viewMode)
  const savedColumns = useAppSelector((state) => state.tablePreferences.gemColumns)

  const canWrite = hasPermission(MODULES.INVENTORY, PERMISSION.WRITE)
  const columns = useMemo(() => visibleGemColumns(savedColumns), [savedColumns])

  // Don't call the API on every keystroke
  const search = useDebouncedValue(filters.search.trim())

  // Server state (React Query): turn that request into API parameters
  const params = useMemo<GemListParams>(
    () => ({
      page,
      limit: pageSize,
      q: search || undefined,
      status: filters.status === ALL ? undefined : filters.status,
      ownership: filters.ownership === ALL ? undefined : filters.ownership,
      stockType: filters.stockType === ALL ? undefined : filters.stockType,
    }),
    [page, pageSize, search, filters.status, filters.ownership, filters.stockType]
  )

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useGems(params)

  // Deleting the last gem on the last page leaves `page` past the end
  const totalPages = data?.totalPages ?? 1
  useEffect(() => {
    if (!isPlaceholderData && page > totalPages) dispatch(setPage(totalPages))
  }, [isPlaceholderData, page, totalPages, dispatch])

  return (
    <>
      <div className="inventory-toolbar">
        <GemFilters refreshing={isFetching} onRefresh={() => void refetch()} />

        <div className="inventory-toolbar__right">
          {viewMode === 'list' && <GemColumnMenu />}
          <ViewToggle value={viewMode} onChange={(mode) => dispatch(setViewMode(mode))} />
          {canWrite && (
            <button
              type="button"
              className="inventory-toolbar__add"
              onClick={() => void navigate(ROUTES.inventory.gems.create)}
            >
              Add item
            </button>
          )}
        </div>
      </div>

      {isError && <PageError message="Failed to load gems." onRetry={() => void refetch()} />}

      {isPending && <PageLoader />}

      {data && (
        <>
          {/* While the next page loads, keep the old rows on screen, slightly faded */}
          <div className={isPlaceholderData ? 'inventory-results inventory-results--stale' : 'inventory-results'}>
            {viewMode === 'list' ? (
              <GemTable items={data.data} columns={columns} canWrite={canWrite} />
            ) : (
              <div className="gem-grid">
                {data.data.map((item) => (
                  <GemCard key={item.id} item={item} canWrite={canWrite} />
                ))}
              </div>
            )}
          </div>

          {data.total === 0 && <p className="inventory-empty">No gems match these filters.</p>}

          {data.total > 0 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={pageSize}
              itemLabel="gems"
              onPageChange={(next) => dispatch(setPage(next))}
              onPageSizeChange={(size) => dispatch(setPageSize(size))}
            />
          )}
        </>
      )}
    </>
  )
}
