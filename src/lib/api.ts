import axios, { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { apiUrls } from '@/constants/apiUrls'
import { ROUTES } from '@/constants/routes'
import { endSession } from '@/lib/session'
import { getToken } from '@/utils/auth'
import { getErrorMessage } from '@/utils/errors'

export const api = axios.create({
  // Set per environment in .env.development / .env.dev / .env.snd / .env.prod
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1',
})

// Every request: attach the login token and a request id
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-Request-Id'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error) || axios.isCancel(error)) return Promise.reject(error)

    const status = error.response?.status

    if (status === 401) {
      // Session gone: back to login. (A wrong password on the login form is
      // also a 401, but that page shows it inline.)
      if (error.config?.url !== apiUrls.auth.login && window.location.pathname !== ROUTES.login) {
        endSession()
        window.location.assign(ROUTES.login)
      }
    } else if (status !== 422 && !error.config?.suppressErrorToast) {
      // 422 = field errors, which the form shows next to the fields.
      // toastId = message, so identical errors (e.g. retries) show only once.
      const message = getErrorMessage(error)
      toast.error(message, { toastId: message })
    }

    return Promise.reject(error)
  }
)
