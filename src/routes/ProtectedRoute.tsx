import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { ModuleKey } from '@/constants/permissions'
import type { PermissionLevel } from '@/types/auth'
import { getUser, hasPermission } from '@/utils/auth'

interface ProtectedRouteProps {
  module: ModuleKey
  minLevel: PermissionLevel
  children: ReactNode
}

export function ProtectedRoute({ module, minLevel, children }: ProtectedRouteProps) {
  if (!getUser()) return <Navigate to="/login" replace />
  if (!hasPermission(module, minLevel)) return <p>Access denied</p>
  return <>{children}</>
}