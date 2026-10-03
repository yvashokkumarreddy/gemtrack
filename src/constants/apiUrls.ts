// Every API path is built here, so a URL change happens in one place
export const apiUrls = {
  auth: {
    login: '/auth/login',
  },
  gems: {
    list: '/gems',
    detail: (id: string) => `/gems/${id}`,
  },
} as const