import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageStatus'
import { AppLayout } from '@/components/layout/AppLayout'
import { MODULES, PERMISSION } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
// The most-used page loads up front, so it opens instantly
import { InventoryListPage } from '@/pages/inventory/InventoryListPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { lazyRetry } from '@/utils/lazyRetry'

// Everything else is downloaded the first time it is opened
const LoginPage = lazyRetry(() => import('@/pages/public/LoginPage'), 'LoginPage')
const InventoryDetailPage = lazyRetry(() => import('@/pages/inventory/InventoryDetailPage'), 'InventoryDetailPage')
const InventoryEditPage = lazyRetry(() => import('@/pages/inventory/InventoryEditPage'), 'InventoryEditPage')
const InventoryCreatePage = lazyRetry(() => import('@/pages/inventory/InventoryCreatePage'), 'InventoryCreatePage')

const gems = ROUTES.inventory.gems

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.login}
        element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to={gems.list} replace />} />
        <Route path="/inventory" element={<Navigate to={gems.list} replace />} />
        <Route
          path={gems.list}
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.READ}>
              <InventoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={gems.create}
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.WRITE}>
              <InventoryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${gems.list}/:id`}
          element={
            <ProtectedRoute module={MODULES.INVENTORY} minLevel={PERMISSION.READ}>
              <InventoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${gems.list}/:id/edit`}
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
