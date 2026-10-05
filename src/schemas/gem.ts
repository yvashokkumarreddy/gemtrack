import { z } from 'zod'
import { GEM_OWNERSHIPS, GEM_STATUSES, GEM_STOCK_TYPES } from '@/constants/gemOptions'
import type { GemItem } from '@/types/gem'

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`)

const amount = (label: string) =>
  z.number({ error: `${label} is required` }).min(0, `${label} cannot be negative`)

// One schema per wizard step, so each step is validated on its own...
export const gemBasicSchema = z.object({
  sku: requiredText('SKU'),
  name: requiredText('Name'),
  stockType: z.enum(GEM_STOCK_TYPES, { error: 'Select a stock type' }),
  ownership: z.enum(GEM_OWNERSHIPS, { error: 'Select ownership' }),
})

export const gemDetailsSchema = z.object({
  caratWeight: z
    .number({ error: 'Carat weight is required' })
    .positive('Carat weight must be greater than 0'),
  color: requiredText('Color'),
  clarity: requiredText('Clarity'),
  cut: requiredText('Cut'),
})

export const gemPricingSchema = z.object({
  cost: amount('Cost'),
  price: amount('Price'),
  status: z.enum(GEM_STATUSES, { error: 'Select a status' }),
})

// ...and the full schema is the three combined (used on final submit)
export const gemFormSchema = z.object({
  ...gemBasicSchema.shape,
  ...gemDetailsSchema.shape,
  ...gemPricingSchema.shape,
})

// The form's TypeScript type comes from the schema, so they can't drift apart
export type GemFormValues = z.infer<typeof gemFormSchema>

export function gemToFormValues(gem: GemItem): GemFormValues {
  return {
    sku: gem.sku,
    name: gem.name,
    stockType: gem.stockType,
    ownership: gem.ownership,
    caratWeight: gem.caratWeight,
    color: gem.color,
    clarity: gem.clarity,
    cut: gem.cut,
    cost: gem.cost,
    price: gem.price,
    status: gem.status,
  }
}
