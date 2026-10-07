import { MODULES, type ModuleKey } from '@/constants/permissions'
import type { AuthUser, PermissionLevel } from '@/types/auth'

const TOKEN_KEY = 'ims_token'
const ROLES: readonly string[] = ['admin', 'viewer', 'guest']

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// ---- Reading the token -------------------------------------------------
// NOTE: the browser only *reads* the token to decide what to show. It cannot
// verify the signature, so this is for UX only. The server enforces access.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPermissionLevel(value: unknown): value is PermissionLevel {
  return value === 0 || value === 2 || value === 4
}

// Type guard: checks the shape at runtime, so no `as AuthUser` cast is needed
function isAuthUser(value: unknown): value is AuthUser {
  if (!isRecord(value)) return false
  const { sub, name, role, tenantId, currency, permissions, exp } = value
  return (
    typeof sub === 'string' &&
    typeof name === 'string' &&
    typeof role === 'string' &&
    ROLES.includes(role) &&
    typeof tenantId === 'string' &&
    typeof currency === 'string' &&
    typeof exp === 'number' &&
    isRecord(permissions) &&
    Object.values(permissions).every(isPermissionLevel)
  )
}

function decodeJwtPayload(token: string): unknown {
  const part = token.split('.')[1]
  if (!part) return null
  // JWTs use base64url, atob needs plain base64 with padding
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

function parseToken(token: string): AuthUser | null {
  try {
    const payload = decodeJwtPayload(token)
    return isAuthUser(payload) ? payload : null
  } catch {
    return null
  }
}

// Decode once per token, not on every render
let cache: { token: string; user: AuthUser | null } | null = null

export function getUser(): AuthUser | null {
  const token = getToken()
  if (!token) return null

  if (cache?.token !== token) {
    cache = { token, user: parseToken(token) }
  }

  const user = cache.user
  if (!user || user.exp * 1000 <= Date.now()) return null // bad or expired
  return user
}

export function getPermission(module: ModuleKey): PermissionLevel {
  const permissions = getUser()?.permissions
  if (!permissions) return 0

  const level = permissions[module]
  if (level !== undefined) return level

  // The Archive module is a filtered view over the same gems as Inventory,
  // not a separate business capability yet. Until the backend issues its
  // own `archive` permission, fall back to whatever the user can already
  // do in Inventory, so the module isn't hidden for every existing token.
  if (module === MODULES.ARCHIVE) return permissions[MODULES.INVENTORY] ?? 0

  return 0
}

export function hasPermission(module: ModuleKey, minLevel: PermissionLevel): boolean {
  return getPermission(module) >= minLevel
}