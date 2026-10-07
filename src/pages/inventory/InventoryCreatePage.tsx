import { useNavigate } from 'react-router-dom'
import type { DefaultValues } from 'react-hook-form'
import { PageHeader } from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { GemWizard } from '@/pages/inventory/GemWizard'
import { useCreateGem } from '@/queries/useGems'
import type { GemFormValues } from '@/schemas/gem'
import './inventory.css'

const EMPTY_GEM: DefaultValues<GemFormValues> = {
  sku: '',
  name: '',
  stockType: 'single',
  ownership: 'owned',
  color: '',
  clarity: '',
  cut: '',
  status: 'in_stock',
}

export function InventoryCreatePage() {
  const navigate = useNavigate()
  const createGem = useCreateGem()

  return (
    <div className="gem-edit">
      <PageHeader title="Add gem" backTo={ROUTES.inventory.gems.list} backLabel="Back to list" />
      <GemWizard
        defaultValues={EMPTY_GEM}
        submitLabel="Create gem"
        cancelTo={ROUTES.inventory.gems.list}
        onSubmit={async (values) => {
          const gem = await createGem.mutateAsync(values)
          void navigate(ROUTES.inventory.gems.detail(gem.id), { replace: true })
        }}
      />
    </div>
  )
}
