import { InventoryListPage } from '@/pages/inventory/InventoryListPage'

// The Archive module is the same gem list, filtered server-side to archived
// gems and read-mostly (no create, no edit -- just view and restore).
export function ArchiveListPage() {
  return <InventoryListPage mode="archived" />
}
