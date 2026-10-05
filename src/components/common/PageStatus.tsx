interface PageLoaderProps {
  label?: string
}

export function PageLoader({ label = 'Loading...' }: PageLoaderProps) {
  return (
    <p className="page-status" role="status">
      {label}
    </p>
  )
}

interface PageErrorProps {
  message: string
  onRetry?: () => void
}

export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="page-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
