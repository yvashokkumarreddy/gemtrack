import { useState } from 'react'
import { ArchiveRestore, Eye, Pencil, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/design-system-staging/ConfirmDialog'
import {
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/design-system-staging/DropdownMenu'
import { ROUTES } from '@/constants/routes'
import { useArchiveGem, useDeleteGem, useRestoreGem } from '@/queries/useGems'
import type { GemItem } from '@/types/gem'

interface GemActionsProps {
  item: GemItem
  canWrite: boolean
  /** 'archived' renders Restore instead of Edit/Delete, for the Archive module's list */
  mode?: 'active' | 'archived'
}

export function GemActions({ item, canWrite, mode = 'active' }: GemActionsProps) {
  const [confirming, setConfirming] = useState(false)

  // On success each mutation refreshes the lists and shows a toast; on failure
  // the API client shows the error toast. The component only asks and waits.
  const archiveGem = useArchiveGem()
  const deleteGem = useDeleteGem()
  const restoreGem = useRestoreGem()

  const isArchived = mode === 'archived'

  const items: DropdownMenuItem[] = [
    {
      key: 'view',
      label: 'View details',
      icon: <Eye size={16} />,
      to: ROUTES.inventory.gems.detail(item.id),
    },
    {
      key: 'edit',
      label: 'Edit gem',
      icon: <Pencil size={16} />,
      to: ROUTES.inventory.gems.edit(item.id),
      hidden: isArchived || !canWrite,
    },
    isArchived
      ? {
          key: 'restore',
          label: 'Restore',
          icon: <ArchiveRestore size={16} />,
          hidden: !canWrite,
          onSelect: () => setConfirming(true),
        }
      : {
          key: 'delete',
          label: 'Delete',
          icon: <Trash2 size={16} />,
          danger: true,
          hidden: !canWrite,
          onSelect: () => setConfirming(true),
        },
  ]

  const busy = archiveGem.isPending || deleteGem.isPending || restoreGem.isPending

  return (
    <>
      <DropdownMenu label={`Actions for ${item.sku}`} items={items} />

      {isArchived ? (
        <ConfirmDialog
          open={confirming}
          title="Restore gem?"
          message={
            <>
              <strong>
                {item.sku} - {item.name}
              </strong>{' '}
              will move back into the active inventory list.
            </>
          }
          confirmLabel="Restore"
          loading={busy}
          onClose={() => setConfirming(false)}
          onConfirm={() => restoreGem.mutate(item.id, { onSettled: () => setConfirming(false) })}
        />
      ) : (
        <ConfirmDialog
          open={confirming}
          title="Delete gem?"
          message={
            <>
              <strong>
                {item.sku} - {item.name}
              </strong>{' '}
              will be permanently removed and can&apos;t be recovered. If you might need it again, archive it
              instead -- it&apos;ll be hidden from the inventory list but can be restored later.
            </>
          }
          confirmLabel="Delete permanently"
          destructive
          secondaryLabel="Archive instead"
          onSecondary={() => archiveGem.mutate(item.id, { onSettled: () => setConfirming(false) })}
          loading={busy}
          onClose={() => setConfirming(false)}
          onConfirm={() => deleteGem.mutate(item.id, { onSettled: () => setConfirming(false) })}
        />
      )}
    </>
  )
}
