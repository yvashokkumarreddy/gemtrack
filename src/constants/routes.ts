// Every page URL is built here, like apiUrls.ts does for the API.
export const ROUTES = {
  login: '/login',
  inventory: {
    gems: {
      list: '/inventory/gems',
      create: '/inventory/gems/new',
      detail: (id: string) => `/inventory/gems/${id}`,
      edit: (id: string) => `/inventory/gems/${id}/edit`,
    },
  },
} as const
