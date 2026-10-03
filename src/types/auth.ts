import type { ModuleKey } from '@/constants/permissions'

export type PermissionLevel = 0 | 2 | 4
export type Role = 'admin' | 'viewer' | 'guest'

// The payload decoded from the JWT
export interface AuthUser {
  sub: string
  name: string
  role: Role
  tenantId: string
  currency: string
  permissions: Record<ModuleKey, PermissionLevel>
  exp: number // expiry, in seconds since 1970
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}