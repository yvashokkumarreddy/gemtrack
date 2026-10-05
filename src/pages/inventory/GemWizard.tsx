import { useState, type ComponentType } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldErrors,
  type FieldPath,
} from 'react-hook-form'
import { Link } from 'react-router-dom'
import { BasicInfoStep } from '@/pages/inventory/gem-steps/BasicInfoStep'
import { GemDetailsStep } from '@/pages/inventory/gem-steps/GemDetailsStep'
import { PricingStep } from '@/pages/inventory/gem-steps/PricingStep'
import {
  gemBasicSchema,
  gemDetailsSchema,
  gemFormSchema,
  gemPricingSchema,
  type GemFormValues,
} from '@/schemas/gem'
import { applyServerFieldErrors } from '@/utils/formErrors'

type GemField = FieldPath<GemFormValues>

interface WizardStep {
  title: string
  fields: GemField[]
  Component: ComponentType
}

// The keys of a step's schema are exactly the form fields that step owns
const fieldsOf = (schema: { shape: Record<string, unknown> }) => Object.keys(schema.shape) as GemField[]

const STEPS: readonly WizardStep[] = [
  { title: 'Basic info', fields: fieldsOf(gemBasicSchema), Component: BasicInfoStep },
  { title: 'Gem details', fields: fieldsOf(gemDetailsSchema), Component: GemDetailsStep },
  { title: 'Pricing & status', fields: fieldsOf(gemPricingSchema), Component: PricingStep },
]

const ALL_FIELDS = STEPS.flatMap((step) => step.fields)

interface GemWizardProps {
  defaultValues: DefaultValues<GemFormValues>
  submitLabel: string
  cancelTo: string
  onSubmit: (values: GemFormValues) => Promise<unknown>
}

// One form shared by "add" and "edit". It is split into steps, and "Next"
// only moves on once the fields of the current step are valid.
export function GemWizard({ defaultValues, submitLabel, cancelTo, onSubmit }: GemWizardProps) {
  const [stepIndex, setStepIndex] = useState(0)

  const form = useForm<GemFormValues>({
    resolver: zodResolver(gemFormSchema),
    defaultValues,
    mode: 'onTouched',
  })
  const {
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting },
  } = form

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1

  const goToStepWith = (field: GemField | undefined) => {
    if (!field) return
    const index = STEPS.findIndex((candidate) => candidate.fields.includes(field))
    if (index >= 0) setStepIndex(index)
  }

  const handleNext = async () => {
    // Validates only this step's fields
    if (await trigger(step.fields)) setStepIndex((index) => index + 1)
  }

  const submit = handleSubmit(
    async (values) => {
      try {
        await onSubmit(values)
      } catch (error) {
        // e.g. "SKU already exists": show it on the field, on the right step
        goToStepWith(applyServerFieldErrors(error, setError, ALL_FIELDS)[0])
      }
    },
    (errors: FieldErrors<GemFormValues>) => {
      goToStepWith(ALL_FIELDS.find((field) => field in errors))
    }
  )

  return (
    <FormProvider {...form}>
      <form
        className="wizard"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          // Enter on a middle step means "Next", not "Save"
          if (isLastStep) void submit()
          else void handleNext()
        }}
      >
        <ol className="wizard__steps">
          {STEPS.map((candidate, index) => (
            <li
              key={candidate.title}
              className={
                index === stepIndex
                  ? 'wizard__step wizard__step--current'
                  : index < stepIndex
                    ? 'wizard__step wizard__step--done'
                    : 'wizard__step'
              }
              aria-current={index === stepIndex ? 'step' : undefined}
            >
              <span className="wizard__step-number">{index + 1}</span>
              {candidate.title}
            </li>
          ))}
        </ol>

        <div className="wizard__body">
          <step.Component />
        </div>

        <div className="wizard__actions">
          <Link to={cancelTo} className="secondary-link">
            Cancel
          </Link>
          <div className="wizard__nav">
            {stepIndex > 0 && (
              <button
                type="button"
                className="inventory-toolbar__icon-btn"
                onClick={() => setStepIndex((index) => index - 1)}
              >
                Back
              </button>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isLastStep ? (isSubmitting ? 'Saving...' : submitLabel) : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
