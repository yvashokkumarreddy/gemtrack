import axios, { isAxiosError } from 'axios'
import { apiUrls } from '@/constants/apiUrls'
import { clearToken, getToken } from '@/utils/auth'

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
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

// 401 anywhere: the session is gone, so go back to login
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== apiUrls.auth.login && // a wrong password is also a 401
      window.location.pathname !== '/login'
    ) {
      clearToken()
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)