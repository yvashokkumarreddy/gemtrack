import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  backTo?: string
  backLabel?: string
  actions?: ReactNode
}

export function PageHeader({ title, backTo, backLabel = 'Back', actions }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        {backTo && (
          <Link to={backTo} className="page-header__back">
            <ArrowLeft size={14} /> {backLabel}
          </Link>
        )}
        <h2 className="page-header__title">{title}</h2>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}
