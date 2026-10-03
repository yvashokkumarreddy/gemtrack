import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { deleteGem } from '@/services/gemService'
import type { GemItem } from '@/types/gem'

interface GemActionsProps {
  item: GemItem
  basePath: string
  canWrite: boolean
  onDeleted: (id: string) => void
}

export function GemActions({ item, basePath, canWrite, onDeleted }: GemActionsProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${item.sku} - ${item.name}? This can't be undone.`)) return
    setDeleting(true)
    try {
      await deleteGem(item.id)
      onDeleted(item.id)
    } catch (err) {
      console.error('Error deleting gem:', err)
      window.alert('Failed to delete gem. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="gem-actions">
      <Link to={`${basePath}/${item.id}`} className="gem-actions__btn" aria-label="View gem details" title="View">
        <Eye size={16} />
      </Link>
      {canWrite && (
        <>
          <Link
            to={`${basePath}/${item.id}/edit`}
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
            disabled={deleting}
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  )
}
