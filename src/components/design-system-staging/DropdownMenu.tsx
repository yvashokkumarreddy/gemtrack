import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import './dropdown-menu.css'

export interface DropdownMenuItem {
  key: string
  label: string
  icon?: ReactNode
  /** Makes the item a link to another page */
  to?: string
  /** Makes the item a button that runs this */
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
  hidden?: boolean
}

interface DropdownMenuProps {
  /** Accessible name of the trigger button, e.g. "Actions for GEM-001" */
  label: string
  items: DropdownMenuItem[]
}

interface Position {
  right: number
  top?: number
  bottom?: number
}

const ITEM_HEIGHT = 38 // used to decide whether the menu fits below the button
const MENU_GAP = 4

// Staging component: a generic "..." menu. It renders in a portal with fixed
// positioning, so a table's or page's overflow can never clip it.
export function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const visibleItems = items.filter((item) => !item.hidden)
  const isOpen = position !== null

  const close = (returnFocus = false) => {
    setPosition(null)
    if (returnFocus) triggerRef.current?.focus()
  }

  const toggle = () => {
    if (isOpen) return close()
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuHeight = visibleItems.length * ITEM_HEIGHT + 16
    const fitsBelow = rect.bottom + MENU_GAP + menuHeight <= window.innerHeight
    const right = window.innerWidth - rect.right
    setPosition(
      fitsBelow
        ? { right, top: rect.bottom + MENU_GAP }
        : { right, bottom: window.innerHeight - rect.top + MENU_GAP }
    )
  }

  // While open: close on an outside click, on Escape, and when the page
  // scrolls or resizes (the menu is fixed, so it would drift from its button)
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setPosition(null)
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPosition(null)
        triggerRef.current?.focus()
      }
    }
    const onViewportChange = () => setPosition(null)

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true) // capture: any scroll container

    // Keyboard users land on the first item
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus()

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  }, [isOpen])

  // Arrow keys move between items, Tab closes
  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const focusable = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []
    )
    const index = focusable.indexOf(document.activeElement as HTMLElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusable[(index + 1) % focusable.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusable[(index - 1 + focusable.length) % focusable.length]?.focus()
    } else if (event.key === 'Tab') {
      close()
    }
  }

  if (visibleItems.length === 0) return null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-menu__trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={toggle}
      >
        <MoreHorizontal size={18} />
      </button>

      {position &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className="dropdown-menu__panel"
            style={position}
            onKeyDown={onMenuKeyDown}
          >
            {visibleItems.map((item) => {
              const className = item.danger
                ? 'dropdown-menu__item dropdown-menu__item--danger'
                : 'dropdown-menu__item'
              const content = (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              )

              if (item.to) {
                return (
                  <Link key={item.key} to={item.to} role="menuitem" className={className} onClick={() => close()}>
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  className={className}
                  disabled={item.disabled}
                  onClick={() => {
                    close()
                    item.onSelect?.()
                  }}
                >
                  {content}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}