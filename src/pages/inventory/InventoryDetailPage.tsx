import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ownershipLabel, stockTypeLabel } from '@/constants/gemLabels'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { getGem } from '@/services/gemService'
import type { GemItem } from '@/types/gem'
import { hasPermission } from '@/utils/auth'

const BASE_PATH = '/inventory/gems'

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<GemItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let ignore = false

    const fetchGem = async () => {
      try {
        const gem = await getGem(id)
        if (!ignore) setItem(gem)
      } catch (err) {
        if (!ignore) setError('Failed to fetch gem')
        console.error('Error fetching gem:', err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchGem()
    return () => {
      ignore = true
    }
  }, [id])

  if (!id) return <p>Invalid gem id</p>
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!item) return <p>Gem not found</p>

  return (
    <div>
      <Link to={BASE_PATH}>Back to list</Link>
      <h1>{item.name}</h1>
      <p>SKU: {item.sku}</p>
      <p>Stock Type: {stockTypeLabel(item.stockType)}</p>
      <p>Carat Weight: {item.caratWeight}</p>
      <p>Color: {item.color}</p>
      <p>Clarity: {item.clarity}</p>
      <p>Ownership: {ownershipLabel(item.ownership)}</p>
      <p>Cut: {item.cut}</p>
      <p>Cost: ${item.cost.toFixed(2)}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <p>Status: {item.status}</p>
      {hasPermission(MODULES.INVENTORY, PERMISSION.WRITE) && (
        <p>
          <Link to={`/inventory/${item.id}/edit`}>Edit this gem</Link>
        </p>
      )}
    </div>
  )
}