import { Link } from 'react-router-dom'
import { GemActions } from '@/components/GemActions'
import { ownershipLabel, STATUS_LABELS, stockTypeLabel } from '@/constants/gemLabels'
import type { GemItem } from '@/types/gem'

interface GemRowProps {
  item: GemItem
  basePath: string
  canWrite: boolean
  onDeleted: (id: string) => void
}

export function GemRow({ item, basePath, canWrite, onDeleted }: GemRowProps) {
  return (
    <tr>
      <td>
        <Link to={`${basePath}/${item.id}`}>{item.sku}</Link>
      </td>
      <td>{item.name}</td>
      <td>{stockTypeLabel(item.stockType)}</td>
      <td className="text-right">{item.caratWeight}</td>
      <td>{item.color}</td>
      <td>{item.clarity}</td>
      <td>{ownershipLabel(item.ownership)}</td>
      <td>{item.cut}</td>
      <td className="text-right">${item.price.toLocaleString()}</td>
      <td>
        <span className={`status-badge status-badge--${item.status}`}>
          {STATUS_LABELS[item.status]}
        </span>
      </td>
      <td>
        <GemActions item={item} basePath={basePath} canWrite={canWrite} onDeleted={onDeleted} />
      </td>
    </tr>
  )
}
