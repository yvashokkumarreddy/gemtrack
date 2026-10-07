import { apiUrls } from '@/constants/apiUrls'
import { api } from '@/lib/api'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export async function login(credentials: LoginRequest): Promise<string> {
  // The login page shows "wrong password" itself, so no toast
  const { data } = await api.post<LoginResponse>(apiUrls.auth.login, credentials, {
    suppressErrorToast: true,
  })
  return data.token
}
