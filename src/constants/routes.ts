// Every page URL is built here, like apiUrls.ts does for the API.
export const ROUTES = {
  login: '/login',
  inventory: {
    gems: {
      list: '/inventory/gems',
      create: '/inventory/gems/new',
      detail: (id: string) => `/inventory/gems/${id}`,
      edit: (id: string) => `/inventory/gems/${id}/edit`,
      // Deliberately not nested under `/inventory/gems` -- the header's page
      // title match is a startsWith() on the sidebar paths, and a nested path
      // would match the "Gem Inventory" entry first.
      archivelist: '/inventory/archive/gems',
    },
  },
} as const
