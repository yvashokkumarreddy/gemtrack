import { useEffect, useId, useRef, type ReactNode } from 'react'
import './confirm-dialog.css'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Red confirm button, for deletes */
  destructive?: boolean
  /** A third, less-destructive choice between Cancel and Confirm (e.g. "Archive instead") */
  secondaryLabel?: string
  onSecondary?: () => void
  /** While true every button is disabled and the dialog can't be dismissed */
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

// Staging component: a confirmation dialog built on the native <dialog>
// element, which gives us the backdrop, focus trap and Escape key for free.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  secondaryLabel,
  onSecondary,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) {
      dialog.showModal()
      // Start on Cancel, so pressing Enter by accident never confirms a delete
      cancelRef.current?.focus()
    }
  }, [open])

  // Only mounted while open, so a table of 100 rows doesn't hold 100 dialogs
  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape key
        event.preventDefault()
        if (!loading) onClose()
      }}
      onClick={(event) => {
        // A click on the dark backdrop lands on the <dialog> itself
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <div className="confirm-dialog__body">
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        <div className="confirm-dialog__message">{message}</div>

        <div className="confirm-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="confirm-dialog__cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              className="confirm-dialog__cancel"
              onClick={onSecondary}
              disabled={loading}
            >
              {secondaryLabel}
            </button>
          )}
          <button
            type="button"
            className={
              destructive
                ? 'confirm-dialog__confirm confirm-dialog__confirm--danger'
                : 'confirm-dialog__confirm'
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}