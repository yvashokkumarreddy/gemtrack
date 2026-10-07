import { useFormContext } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import type { GemFormValues } from '@/schemas/gem'

// Step 2
export function GemDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<GemFormValues>()

  return (
    <>
      <FormField label="Carat weight" error={errors.caratWeight?.message}>
        {/* valueAsNumber: the form gets a number, not the string "1.2" */}
        <input type="number" step="0.01" {...register('caratWeight', { valueAsNumber: true })} />
      </FormField>

      <FormField label="Color" error={errors.color?.message}>
        <input type="text" {...register('color')} />
      </FormField>

      <FormField label="Clarity" error={errors.clarity?.message}>
        <input type="text" {...register('clarity')} />
      </FormField>

      <FormField label="Cut" error={errors.cut?.message}>
        <input type="text" {...register('cut')} />
      </FormField>
    </>
  )
}
