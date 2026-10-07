import { GemRow } from '@/components/inventory/GemRow'
import type { GemColumn } from '@/constants/gemColumns'
import type { GemItem } from '@/types/gem'

interface GemTableProps {
  items: GemItem[]
  columns: readonly GemColumn[]
  canWrite: boolean
  mode?: 'active' | 'archived'
}

export function GemTable({ items, columns, canWrite, mode = 'active' }: GemTableProps) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.align === 'right' ? 'text-right' : undefined}>
              {column.label}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <GemRow key={item.id} item={item} columns={columns} canWrite={canWrite} mode={mode} />
        ))}
      </tbody>
    </table>
  )
}
