export const MODULES = {
  INVENTORY: 'inventory',
  ARCHIVE: 'archive',
} as const

export type ModuleKey = (typeof MODULES)[keyof typeof MODULES]

// 0 = no access, 2 = read, 4 = write (same levels as the backend)
export const PERMISSION = {
  NONE: 0,
  READ: 2,
  WRITE: 4,
} as const