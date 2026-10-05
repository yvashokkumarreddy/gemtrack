import { Columns3 } from 'lucide-react'
import { DEFAULT_GEM_COLUMNS, GEM_COLUMNS } from '@/constants/gemColumns'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetGemColumns, toggleGemColumn } from '@/store/slices/tablePreferencesSlice'

// Which table columns are shown. Saved in localStorage via redux-persist.
export function GemColumnMenu() {
  const dispatch = useAppDispatch()
  const saved = useAppSelector((state) => state.tablePreferences.gemColumns)

  return (
    <details className="column-menu">
      <summary className="inventory-toolbar__icon-btn">
        <Columns3 size={16} />
        Columns
      </summary>
      <div className="column-menu__panel">
        {GEM_COLUMNS.map((column) => (
          <label key={column.key} className="column-menu__item">
            <input
              type="checkbox"
              checked={column.locked || (saved[column.key] ?? DEFAULT_GEM_COLUMNS[column.key])}
              disabled={column.locked}
              onChange={() => dispatch(toggleGemColumn(column.key))}
            />
            {column.label}
          </label>
        ))}
        <button type="button" className="column-menu__reset" onClick={() => dispatch(resetGemColumns())}>
          Reset columns
        </button>
      </div>
    </details>
  )
}
