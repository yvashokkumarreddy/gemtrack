import { PAGE_SIZES, type PageSize } from '@/constants/pagination'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: PageSize
  itemLabel: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
}

function toPageSize(value: string): PageSize {
  const size = PAGE_SIZES.find((candidate) => String(candidate) === value)
  return size ?? PAGE_SIZES[0]
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="inventory-pagination">
      <label className="inventory-pagination__size">
        Rows per page
        <select value={pageSize} onChange={(event) => onPageSizeChange(toPageSize(event.target.value))}>
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <div className="inventory-pagination__nav">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages} &middot; {total} {itemLabel}
        </span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}
