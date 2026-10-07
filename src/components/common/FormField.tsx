import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      {/* The error is outside the <label>, so the field's name stays "SKU" */}
      <label className="form-field__control">
        <span className="form-field__label">{label}</span>
        {children}
      </label>
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
