import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skip the automatic error toast, for pages that show the error themselves. */
    suppressErrorToast?: boolean
  }
}
