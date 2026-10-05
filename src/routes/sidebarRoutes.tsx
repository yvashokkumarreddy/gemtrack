import { Gem, Package, type LucideIcon } from 'lucide-react'
import { MODULES, PERMISSION, type ModuleKey } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import type { PermissionLevel } from '@/types/auth'

export interface SidebarChild {
  label: string
  path: string
  icon: LucideIcon
  module: ModuleKey
  minLevel: PermissionLevel
}

export interface SidebarGroup {
  label: string
  icon: LucideIcon
  children: SidebarChild[]
}

// Every feature of the app is listed here, grouped like CaratLogic's menu.
// To add a page: add a child to a group (and its route in AppRoutes.tsx).
// To add a section: add a new group.
export const sidebarRoutes: SidebarGroup[] = [
  {
    label: 'Inventory',
    icon: Package,
    children: [
      {
        label: 'Gem Inventory',
        path: ROUTES.inventory.gems.list,
        icon: Gem,
        module: MODULES.INVENTORY,
        minLevel: PERMISSION.READ,
      },
    ],
  },
]