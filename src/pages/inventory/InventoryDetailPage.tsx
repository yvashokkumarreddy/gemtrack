import { isAxiosError } from 'axios'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageError, PageLoader } from '@/components/common/PageStatus'
import { PageHeader } from '@/components/common/PageHeader'
import { OWNERSHIP_LABELS, STATUS_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useGem } from '@/queries/useGems'
import { hasPermission } from '@/utils/auth'
import { formatCurrency } from '@/utils/currency'
import './inventory.css'

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isPending, isError, error, refetch } = useGem(id)

  if (!id) return <PageError message="Invalid gem id" />
  if (isPending) return <PageLoader />
  if (isError) {
    const notFound = isAxiosError(error) && error.response?.status === 404
    return (
      <PageError
        message={notFound ? 'Gem not found' : 'Failed to load gem'}
        onRetry={notFound ? undefined : () => void refetch()}
      />
    )
  }

  const canWrite = hasPermission(MODULES.INVENTORY, PERMISSION.WRITE)

  const details: [string, string | number][] = [
    ['SKU', item.sku],
    ['Stock type', STOCK_TYPE_LABELS[item.stockType]],
    ['Ownership', OWNERSHIP_LABELS[item.ownership]],
    ['Carat weight', item.caratWeight],
    ['Color', item.color],
    ['Clarity', item.clarity],
    ['Cut', item.cut],
    ['Cost', formatCurrency(item.cost)],
    ['Price', formatCurrency(item.price)],
    ['Status', STATUS_LABELS[item.status]],
  ]

  return (
    <>
      <PageHeader
        title={item.name}
        backTo={ROUTES.inventory.gems.list}
        backLabel="Back to list"
        actions={
          canWrite && (
            <Link to={ROUTES.inventory.gems.edit(item.id)} className="detail-edit-link">
              <Pencil size={14} /> Edit
            </Link>
          )
        }
      />

      <dl className="detail-grid">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}
