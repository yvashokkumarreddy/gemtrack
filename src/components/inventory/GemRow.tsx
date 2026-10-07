import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GemActions } from '@/components/inventory/GemActions'
import type { GemColumn, GemColumnKey } from '@/constants/gemColumns'
import { OWNERSHIP_LABELS, STATUS_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { ROUTES } from '@/constants/routes'
import type { GemItem } from '@/types/gem'
import { formatCurrency } from '@/utils/currency'

interface GemRowProps {
  item: GemItem
  columns: readonly GemColumn[] // only the columns the user has switched on
  canWrite: boolean
  mode?: 'active' | 'archived'
}

export function GemRow({ item, columns, canWrite, mode = 'active' }: GemRowProps) {
  const cells: Record<GemColumnKey, ReactNode> = {
    sku: <Link to={ROUTES.inventory.gems.detail(item.id)}>{item.sku}</Link>,
    name: item.name,
    stockType: STOCK_TYPE_LABELS[item.stockType],
    carats: item.caratWeight,
    color: item.color,
    clarity: item.clarity,
    ownership: OWNERSHIP_LABELS[item.ownership],
    cut: item.cut,
    price: formatCurrency(item.price),
    status: <span className={`status-badge status-badge--${item.status}`}>{STATUS_LABELS[item.status]}</span>,
  }

  return (
    <tr>
      {columns.map((column) => (
        <td key={column.key} className={column.align === 'right' ? 'text-right' : undefined}>
          {cells[column.key]}
        </td>
      ))}
      <td>
        <GemActions item={item} canWrite={canWrite} mode={mode} />
      </td>
    </tr>
  )
}
