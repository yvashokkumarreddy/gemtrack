import { useFormContext } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { OWNERSHIP_LABELS, STOCK_TYPE_LABELS } from '@/constants/gemLabels'
import { GEM_OWNERSHIPS, GEM_STOCK_TYPES } from '@/constants/gemOptions'
import type { GemFormValues } from '@/schemas/gem'

// Step 1. The form object lives in GemWizard; every step reads it from context.
export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GemFormValues>()

  return (
    <>
      <FormField label="SKU" error={errors.sku?.message}>
        <input type="text" {...register('sku')} />
      </FormField>

      <FormField label="Name" error={errors.name?.message}>
        <input type="text" {...register('name')} />
      </FormField>

      <FormField label="Stock type" error={errors.stockType?.message}>
        <select {...register('stockType')}>
          <option value="">Select...</option>
          {GEM_STOCK_TYPES.map((value) => (
            <option key={value} value={value}>
              {STOCK_TYPE_LABELS[value]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Ownership" error={errors.ownership?.message}>
        <select {...register('ownership')}>
          <option value="">Select...</option>
          {GEM_OWNERSHIPS.map((value) => (
            <option key={value} value={value}>
              {OWNERSHIP_LABELS[value]}
            </option>
          ))}
        </select>
      </FormField>
    </>
  )
}
