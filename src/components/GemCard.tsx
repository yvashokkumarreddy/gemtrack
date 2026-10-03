import { Link } from 'react-router-dom'
import { GemActions } from '@/components/GemActions'
import { ownershipLabel, STATUS_LABELS, stockTypeLabel } from '@/constants/gemLabels'
import type { GemItem } from '@/types/gem'

interface GemCardProps {
  item: GemItem
  basePath: string
  canWrite: boolean
  onDeleted: (id: string) => void
}

export function GemCard({ item, basePath, canWrite, onDeleted }: GemCardProps) {
  return (
    <div className="gem-card">
      <div className="gem-card__header">
        <Link to={`${basePath}/${item.id}`} className="gem-card__sku">
          {item.sku}
        </Link>
        <span className={`status-badge status-badge--${item.status}`}>{STATUS_LABELS[item.status]}</span>
      </div>

      <h3 className="gem-card__name">{item.name}</h3>

      <dl className="gem-card__details">
        <div>
          <dt>Stock Type</dt>
          <dd>{stockTypeLabel(item.stockType)}</dd>
        </div>
        <div>
          <dt>Ownership</dt>
          <dd>{ownershipLabel(item.ownership)}</dd>
        </div>
        <div>
          <dt>Carat Weight</dt>
          <dd>{item.caratWeight}</dd>
        </div>
        <div>
          <dt>Color / Clarity</dt>
          <dd>
            {item.color} / {item.clarity}
          </dd>
        </div>
        <div>
          <dt>Cut</dt>
          <dd>{item.cut}</dd>
        </div>
      </dl>

      <div className="gem-card__footer">
        <span className="gem-card__price">${item.price.toLocaleString()}</span>
        <GemActions item={item} basePath={basePath} canWrite={canWrite} onDeleted={onDeleted} />
      </div>
    </div>
  )
}
