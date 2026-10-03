import { useEffect, useRef, useState } from 'react'
import { Bell, LayoutGrid, Moon, ScanLine, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarRoutes } from '@/routes/sidebarRoutes'
import type { AuthUser } from '@/types/auth'
import { clearToken } from '@/utils/auth'
import { getEffectiveTheme, toggleTheme } from '@/utils/theme'

interface HeaderProps {
  user: AuthUser
}

function usePageTitle(): string {
  const location = useLocation()
  for (const group of sidebarRoutes) {
    const child = group.children.find((c) => location.pathname.startsWith(c.path))
    if (child) return child.label
  }
  return 'GemTrack'
}

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate()
  const pageTitle = usePageTitle()
  const [isDark, setIsDark] = useState(() => getEffectiveTheme() === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  const initial = user.name.trim().charAt(0).toUpperCase()

  return (
    <header className="app-header">
      <div className="app-header__left">
        <h1 className="app-header__title">{pageTitle}</h1>
      </div>

      <div className="app-header__actions">
        <button type="button" className="app-header__icon-btn" aria-label="Scan">
          <ScanLine size={18} />
        </button>
        <button type="button" className="app-header__icon-btn" aria-label="Grid view">
          <LayoutGrid size={18} />
        </button>
        <button
          type="button"
          className="app-header__icon-btn"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setIsDark(toggleTheme() === 'dark')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" className="app-header__icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="app-header__badge" />
        </button>
        <div className="app-header__avatar-wrap" ref={menuRef}>
          <button
            type="button"
            className="app-header__avatar"
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="app-header__menu">
              <div className="app-header__menu-user">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
