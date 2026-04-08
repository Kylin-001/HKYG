import { get, post, put, del } from './request'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface ApiAdapterConfig {
  useMock: boolean
  mockModule: Record<string, any>
  realApiFn: (...args: any[]) => Promise<any>
}

const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK !== 'false'

function isMockEnabled(): boolean {
  return ENABLE_MOCK
}

export function adaptResponse<T>(response: any): ApiResponse<T> {
  if (response && typeof response === 'object') {
    if ('code' in response && 'data' in response) {
      return response as ApiResponse<T>
    }

    if ('data' in response) {
      return {
        code: 0,
        message: 'success',
        data: response.data as T,
        timestamp: Date.now(),
      }
    }

    return {
      code: 0,
      message: 'success',
      data: response as T,
      timestamp: Date.now(),
    }
  }

  return {
    code: 0,
    message: 'success',
    data: response as T,
    timestamp: Date.now(),
  }
}

export function adaptPaginatedResponse<T>(
  list: T[],
  total?: number,
  page?: number,
  pageSize?: number
): PaginatedResponse<T> {
  return {
    list,
    total: total ?? list.length,
    page: page ?? 1,
    pageSize: pageSize ?? list.length,
    totalPages: pageSize ? Math.ceil((total ?? list.length) / pageSize) : 1,
  }
}

export async function apiCall<T = any>(
  mockData: (() => T) | T,
  realApiCall: () => Promise<T>,
  options?: { forceReal?: boolean; forceMock?: boolean }
): Promise<T> {
  const useMock = options?.forceMock || (isMockEnabled() && !options?.forceReal)

  if (useMock) {
    if (typeof mockData === 'function') {
      return (mockData as () => T)()
    }
    return mockData
  }

  try {
    const result = await realApiCall()
    return result
  } catch (error) {
    if (!options?.forceReal && isMockEnabled()) {
      console.warn('[API] Real API failed, falling back to mock:', error)
      if (typeof mockData === 'function') {
        return (mockData as () => T)()
      }
      return mockData
    }
    throw error
  }
}

export function createApiEndpoint<T = any>(
  mockHandler: (...args: any[]) => T | Promise<T>,
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
) {
  return async (...args: any[]): Promise<T> => {
    if (isMockEnabled()) {
      return mockHandler(...args)
    }

    switch (method) {
      case 'GET':
        return get<T>(url)
      case 'POST':
        return post<T>(url, args[0])
      case 'PUT':
        return put<T>(url, args[0])
      case 'DELETE':
        return del<T>(url)
      default:
        return get<T>(url)
    }
  }
}

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 15000
  }

  getBaseUrl(): string {
    return this.baseUrl
  }

  isUsingMock(): boolean {
    return isMockEnabled()
  }

  getFullUrl(path: string): string {
    if (path.startsWith('http')) return path
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  async request<T = any>(
    method: string,
    path: string,
    data?: any,
    config?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = this.getFullUrl(path)

    let response: any
    switch (method.toUpperCase()) {
      case 'GET':
        response = await get<T>(url, { params: data, ...config })
        break
      case 'POST':
        response = await post<T>(url, data, config)
        break
      case 'PUT':
        response = await put<T>(url, data, config)
        break
      case 'DELETE':
        response = await del<T>(url, config)
        break
      default:
        throw new Error(`Unsupported HTTP method: ${method}`)
    }

    return adaptResponse<T>(response)
  }

  wrapWithFallback<T>(
    realCall: () => Promise<ApiResponse<T>>,
    fallbackData: T | (() => T)
  ): Promise<ApiResponse<T>> {
    if (isMockEnabled()) {
      const data = typeof fallbackData === 'function' ? (fallbackData as () => T)() : fallbackData
      return Promise.resolve(adaptResponse(data))
    }

    return realCall().catch((error) => {
      if (isMockEnabled()) {
        const data = typeof fallbackData === 'function' ? (fallbackData as () => T)() : fallbackData
        console.warn('[ApiClient] Fallback to mock data due to error:', error)
        return Promise.resolve(adaptResponse(data))
      }
      throw error
    })
  }
}

export const apiClient = new ApiClient()

export default {
  isMockEnabled,
  adaptResponse,
  adaptPaginatedResponse,
  apiCall,
  createApiEndpoint,
  apiClient,
}
