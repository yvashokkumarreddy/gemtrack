import { Link } from 'react-router-dom'
import { GemActions } from '@/components/inventory/GemActions'
import { OWNERSHIP_LABELS, STATUS_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { ROUTES } from '@/constants/routes'
import type { GemItem } from '@/types/gem'
import { formatCurrency } from '@/utils/currency'

interface GemCardProps {
  item: GemItem
  canWrite: boolean
  mode?: 'active' | 'archived'
}

export function GemCard({ item, canWrite, mode = 'active' }: GemCardProps) {
  return (
    <div className="gem-card">
      <div className="gem-card__header">
        <Link to={ROUTES.inventory.gems.detail(item.id)} className="gem-card__sku">
          {item.sku}
        </Link>
        <span className={`status-badge status-badge--${item.status}`}>{STATUS_LABELS[item.status]}</span>
      </div>

      <h3 className="gem-card__name">{item.name}</h3>

      <dl className="gem-card__details">
        <div>
          <dt>Stock Type</dt>
          <dd>{STOCK_TYPE_LABELS[item.stockType]}</dd>
        </div>
        <div>
          <dt>Ownership</dt>
          <dd>{OWNERSHIP_LABELS[item.ownership]}</dd>
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
        <span className="gem-card__price">{formatCurrency(item.price)}</span>
        <GemActions item={item} canWrite={canWrite} mode={mode} />
      </div>
    </div>
  )
}
