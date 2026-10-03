import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { InventoryDetailPage } from '@/pages/inventory/InventoryDetailPage'
import { InventoryEditPage } from '@/pages/inventory/InventoryEditPage'
import { InventoryListPage } from '@/pages/inventory/InventoryListPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/inventory/gems" replace />} />
        <Route
          path="/inventory/gems"
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.READ}>
              <InventoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/:id"
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.READ}>
              <InventoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/:id/edit"
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.WRITE}>
              <InventoryEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Page not found</p>} />
      </Route>
    </Routes>
  )
}