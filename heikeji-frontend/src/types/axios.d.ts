/**
 * Axios扩展类型声明
 */

declare module 'axios' {
  interface AxiosRequestConfig {
    monitorPerformance?: boolean
    interceptorConfig?: {
      showLoading?: boolean
      showError?: boolean
      showErrorDetail?: boolean
      showSuccess?: boolean
      successMessage?: string
    }
  }
}
