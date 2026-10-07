import { isAxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageError, PageLoader } from '@/components/common/PageStatus'
import { ROUTES } from '@/constants/routes'
import { GemWizard } from '@/pages/inventory/GemWizard'
import { useGem, useUpdateGem } from '@/queries/useGems'
import { gemToFormValues } from '@/schemas/gem'
import './inventory.css'

export function InventoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: gem, isPending, isError, error, refetch } = useGem(id)
  const updateGem = useUpdateGem()

  if (!id) return <PageError message="Invalid gem id" />
  if (isPending) return <PageLoader />
  if (isError) {
    const notFound = isAxiosError(error) && error.response?.status === 404
    return (
      <PageError
        message={notFound ? 'Gem not found' : 'Failed to load gem'}
        onRetry={notFound ? undefined : () => void refetch()}
      />
    )
  }

  const detailPath = ROUTES.inventory.gems.detail(id)

  return (
    <div className="gem-edit">
      <PageHeader title={`Edit ${gem.sku}`} backTo={detailPath} backLabel="Back to details" />
      <GemWizard
        key={gem.id}
        defaultValues={gemToFormValues(gem)}
        submitLabel="Save changes"
        cancelTo={detailPath}
        onSubmit={async (values) => {
          await updateGem.mutateAsync({ id, input: values })
          void navigate(detailPath, { replace: true })
        }}
      />
    </div>
  )
}
