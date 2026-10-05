import { useFormContext } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { STATUS_LABELS } from '@/constants/gemLabels'
import { GEM_STATUSES } from '@/constants/gemOptions'
import type { GemFormValues } from '@/schemas/gem'

// Step 3
export function PricingStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GemFormValues>()

  return (
    <>
      <FormField label="Cost" error={errors.cost?.message}>
        <input type="number" step="0.01" {...register('cost', { valueAsNumber: true })} />
      </FormField>

      <FormField label="Price" error={errors.price?.message}>
        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
      </FormField>

      <FormField label="Status" error={errors.status?.message}>
        <select {...register('status')}>
          <option value="">Select...</option>
          {GEM_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </FormField>
    </>
  )
}
