import { getUser } from '@/utils/auth'

const formatters = new Map<string, Intl.NumberFormat>()

function getFormatter(currency: string): Intl.NumberFormat {
  let formatter = formatters.get(currency)
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    formatters.set(currency, formatter)
  }
  return formatter
}

// Formats money in the logged-in tenant's currency (it comes from the token)
export function formatCurrency(amount: number, currency = getUser()?.currency ?? 'USD'): string {
  try {
    return getFormatter(currency).format(amount)
  } catch {
    return `${currency} ${amount}` // unknown currency code
  }
}
