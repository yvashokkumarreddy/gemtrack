import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { STATUS_LABELS } from '@/constants/gemLabels'
import { getGem, updateGem } from '@/services/gemService'
import type { EditableGemFields, GemStatus } from '@/types/gem'
import './inventory.css'

const BASE_PATH = '/inventory/gems'

export function InventoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<EditableGemFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let ignore = false

    const fetchGem = async () => {
      try {
        const gem = await getGem(id)
        if (!ignore) {
          setForm({
            sku: gem.sku,
            name: gem.name,
            caratWeight: gem.caratWeight,
            color: gem.color,
            clarity: gem.clarity,
            cut: gem.cut,
            cost: gem.cost,
            price: gem.price,
            status: gem.status,
          })
        }
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

  const updateField = <K extends keyof EditableGemFields>(key: K, value: EditableGemFields[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!id || !form) return
    setSaving(true)
    setError(null)
    try {
      await updateGem(id, form)
      navigate(`${BASE_PATH}/${id}`, { replace: true })
    } catch (err) {
      setError('Failed to save changes')
      console.error('Error updating gem:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!id) return <p>Invalid gem id</p>
  if (loading) return <p>Loading...</p>
  if (!form) return <p>{error ?? 'Gem not found'}</p>

  return (
    <div className="gem-edit">
      <Link to={`${BASE_PATH}/${id}`}>Back to details</Link>
      <h1>Edit {form.sku}</h1>

      <form className="gem-edit__form" onSubmit={handleSubmit}>
        <label>
          SKU
          <input
            type="text"
            value={form.sku}
            onChange={(event) => updateField('sku', event.target.value)}
            required
          />
        </label>

        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </label>

        <label>
          Carat Weight
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.caratWeight}
            onChange={(event) => updateField('caratWeight', Number(event.target.value))}
            required
          />
        </label>

        <label>
          Color
          <input
            type="text"
            value={form.color}
            onChange={(event) => updateField('color', event.target.value)}
            required
          />
        </label>

        <label>
          Clarity
          <input
            type="text"
            value={form.clarity}
            onChange={(event) => updateField('clarity', event.target.value)}
            required
          />
        </label>

        <label>
          Cut
          <input
            type="text"
            value={form.cut}
            onChange={(event) => updateField('cut', event.target.value)}
            required
          />
        </label>

        <label>
          Cost
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.cost}
            onChange={(event) => updateField('cost', Number(event.target.value))}
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(event) => updateField('price', Number(event.target.value))}
            required
          />
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(event) => updateField('status', event.target.value as GemStatus)}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="gem-edit__error">{error}</p>}

        <div className="gem-edit__actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <Link to={`${BASE_PATH}/${id}`} className="secondary-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
