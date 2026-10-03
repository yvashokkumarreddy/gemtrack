import { useState } from 'react'
import { ChevronDown, Gem, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarRoutes } from '@/routes/sidebarRoutes'
import { hasPermission } from '@/utils/auth'

interface SidebarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function Sidebar({ sidebarCollapsed, onToggleSidebar }: SidebarProps) {
  const location = useLocation()

  // Only remembers groups the user opened or closed by hand.
  // Everything else follows the current URL, so the group that holds the
  // current page is always open, even after back/forward navigation.
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({})

  const toggleGroup = (label: string, currentlyOpen: boolean) => {
    setManualOpen((prev) => ({ ...prev, [label]: !currentlyOpen }))
  }

  const CollapseIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <aside className={sidebarCollapsed ? 'app-sidebar app-sidebar--collapsed' : 'app-sidebar'}>
      <div className="app-sidebar__brand">
        <span className="app-sidebar__brand-mark">
          <Gem size={16} />
        </span>
        {!sidebarCollapsed && <span className="app-sidebar__brand-text">GemTrack</span>}
        <button
          type="button"
          className="app-sidebar__collapse-btn"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleSidebar}
        >
          <CollapseIcon size={16} />
        </button>
      </div>

      <nav>
        <ul className="app-sidebar__list">
          {sidebarRoutes.map((group) => {
            const visibleChildren = group.children.filter((child) =>
              hasPermission(child.module, child.minLevel)
            )
            if (visibleChildren.length === 0) return null

            const containsCurrentPage = visibleChildren.some((child) =>
              location.pathname.startsWith(child.path)
            )
            const GroupIcon = group.icon

            // Collapsed rail: skip the group toggle (no room for the label)
            // and show every child as a centered icon link instead.
            if (sidebarCollapsed) {
              return (
                <li key={group.label} className="app-sidebar__group">
                  <ul className="app-sidebar__sublist app-sidebar__sublist--collapsed">
                    {visibleChildren.map((child) => {
                      const ChildIcon = child.icon
                      return (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            title={child.label}
                            className={({ isActive }) =>
                              isActive
                                ? 'app-sidebar__link app-sidebar__link--active'
                                : 'app-sidebar__link'
                            }
                          >
                            <ChildIcon className="app-sidebar__link-icon" size={18} />
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            }

            const isOpen = manualOpen[group.label] ?? containsCurrentPage

            return (
              <li key={group.label} className="app-sidebar__group">
                <button
                  type="button"
                  className={
                    containsCurrentPage
                      ? 'app-sidebar__group-toggle app-sidebar__group-toggle--active'
                      : 'app-sidebar__group-toggle'
                  }
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(group.label, isOpen)}
                >
                  <GroupIcon className="app-sidebar__group-icon" size={18} />
                  <span className="app-sidebar__group-label">{group.label}</span>
                  <ChevronDown
                    className={
                      isOpen
                        ? 'app-sidebar__chevron app-sidebar__chevron--open'
                        : 'app-sidebar__chevron'
                    }
                    size={16}
                  />
                </button>
                {isOpen && (
                  <ul className="app-sidebar__sublist">
                    {visibleChildren.map((child) => {
                      const ChildIcon = child.icon
                      return (
                        <li key={child.path} className="app-sidebar__subitem">
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              isActive
                                ? 'app-sidebar__link app-sidebar__link--active'
                                : 'app-sidebar__link'
                            }
                          >
                            <ChildIcon className="app-sidebar__link-icon" size={16} />
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
