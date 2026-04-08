export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginatedResponse<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiError {
  code: number
  message: string
  details?: Record<string, string[]>
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig {
  url: string
  method?: HttpMethod
  data?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  showError?: boolean
  cache?: boolean
  cacheTTL?: number
}
