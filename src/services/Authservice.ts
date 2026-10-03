import { apiUrls } from '@/constants/apiUrls'
import { api } from '@/lib/api'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export async function login(credentials: LoginRequest): Promise<string> {
  const { data } = await api.post<LoginResponse>(apiUrls.auth.login, credentials)
  return data.token
}