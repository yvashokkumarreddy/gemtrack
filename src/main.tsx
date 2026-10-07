import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProviders } from '@/providers/AppProviders'
import { initTheme } from '@/utils/theme'
import './index.css'

initTheme()

// Keep the production console quiet (the build also strips console.log calls)
if (import.meta.env.PROD) {
  console.log = () => {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>,
)
