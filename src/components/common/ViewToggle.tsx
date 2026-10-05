import { LayoutGrid, List } from 'lucide-react'
import type { ViewMode } from '@/store/slices/userPreferencesSlice'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inventory-view-toggle" role="group" aria-label="View mode">
      <button
        type="button"
        className={value === 'list' ? 'active' : undefined}
        onClick={() => onChange('list')}
        aria-label="Switch to list view"
        aria-pressed={value === 'list'}
        title="List view"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        className={value === 'grid' ? 'active' : undefined}
        onClick={() => onChange('grid')}
        aria-label="Switch to grid view"
        aria-pressed={value === 'grid'}
        title="Grid view"
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  )
}
