import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { getUser } from '@/utils/auth'
import './layout.css'

export function AppLayout() {
  const user = getUser()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Logged-out users never see the shell, they go straight to login
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="app-main">
        <Header user={user} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}