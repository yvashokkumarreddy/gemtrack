import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useDeleteGem } from '@/queries/useGems'
import type { GemItem } from '@/types/gem'

interface GemActionsProps {
  item: GemItem
  canWrite: boolean
}

export function GemActions({ item, canWrite }: GemActionsProps) {
  // On success the mutation refreshes the lists by itself and shows a toast;
  // on failure the API client shows the error toast. Nothing to wire up here.
  const deleteGem = useDeleteGem()

  const handleDelete = () => {
    if (!window.confirm(`Delete ${item.sku} - ${item.name}? This can't be undone.`)) return
    deleteGem.mutate(item.id)
  }

  return (
    <div className="gem-actions">
      <Link
        to={ROUTES.inventory.gems.detail(item.id)}
        className="gem-actions__btn"
        aria-label="View gem details"
        title="View"
      >
        <Eye size={16} />
      </Link>
      {canWrite && (
        <>
          <Link
            to={ROUTES.inventory.gems.edit(item.id)}
            className="gem-actions__btn"
            aria-label="Edit gem"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            className="gem-actions__btn gem-actions__btn--danger"
            aria-label="Delete gem"
            title="Delete"
            onClick={handleDelete}
            disabled={deleteGem.isPending}
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  )
}
