/**
 * API 适配器 - 处理前后端数据格式转换
 */

import type { AxiosResponse } from 'axios'

/**
 * 标准 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

/**
 * 分页响应格式
 */
export interface PaginatedResponse<T = any> {
  list: T[]
  total: number
  page: number
  size: number
  pages: number
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * 后端标准响应格式
 */
interface BackendResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 适配后端响应为标准格式
 * @param response 后端响应
 * @returns 标准 API 响应
 */
export function adaptResponse<T>(response: AxiosResponse<BackendResponse<T>>): ApiResponse<T> {
  const { data } = response
  return {
    code: data.code,
    message: data.message,
    data: data.data,
    success: data.code === 0 || data.code === 200,
    timestamp: Date.now()
  }
}

/**
 * 适配分页响应
 * @param response 后端分页响应
 * @returns 标准分页响应
 */
export function adaptPaginatedResponse<T>(
  response: AxiosResponse<BackendResponse<PaginatedResponse<T>>>
): ApiResponse<PaginatedResponse<T>> {
  return adaptResponse(response)
}

/**
 * 构建分页请求参数
 * @param params 分页参数
 * @returns 后端需要的分页参数格式
 */
export function buildPaginationParams(params: PaginationParams = {}): Record<string, any> {
  return {
    pageNum: params.page || 1,
    pageSize: params.size || 10,
    orderBy: params.sort,
    orderType: params.order?.toUpperCase()
  }
}

/**
 * 适配请求参数 - 处理前端参数格式到后端格式
 * @param params 前端参数
 * @returns 后端参数格式
 */
export function adaptRequestParams(params: Record<string, any>): Record<string, any> {
  const adapted: Record<string, any> = {}

  for (const [key, value] of Object.entries(params)) {
    // 跳过 undefined 和 null
    if (value === undefined || value === null) continue

    // 处理日期范围
    if (key.endsWith('Range') && Array.isArray(value)) {
      const prefix = key.replace('Range', '')
      adapted[`${prefix}Start`] = value[0]
      adapted[`${prefix}End`] = value[1]
    }
    // 处理分页参数映射
    else if (key === 'page') {
      adapted.pageNum = value
    }
    else if (key === 'size') {
      adapted.pageSize = value
    }
    // 处理排序参数
    else if (key === 'sort') {
      adapted.orderBy = value
    }
    else if (key === 'order') {
      adapted.orderType = value?.toUpperCase()
    }
    // 其他参数直接传递
    else {
      adapted[key] = value
    }
  }

  return adapted
}

/**
 * 适配表单数据 - 处理文件上传等表单
 * @param data 表单数据对象
 * @returns FormData 对象
 */
export function adaptFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue

    if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item)
        } else {
          formData.append(`${key}[${index}]`, String(item))
        }
      })
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}

/**
 * 适配查询参数 - 处理数组和对象
 * @param params 查询参数
 * @returns URLSearchParams
 */
export function adaptQueryParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)))
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value))
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams
}

/**
 * API 错误适配
 * @param error 错误对象
 * @returns 标准错误格式
 */
export function adaptError(error: any): ApiResponse<null> {
  if (error.response) {
    // 服务器返回的错误
    const { status, data } = error.response
    return {
      code: data?.code || status,
      message: data?.message || `服务器错误 (${status})`,
      data: null,
      success: false,
      timestamp: Date.now()
    }
  } else if (error.request) {
    // 请求发送失败
    return {
      code: -1,
      message: '网络错误，请检查网络连接',
      data: null,
      success: false,
      timestamp: Date.now()
    }
  } else {
    // 其他错误
    return {
      code: -2,
      message: error.message || '未知错误',
      data: null,
      success: false,
      timestamp: Date.now()
    }
  }
}

/**
 * 数据转换器 - 用于特定字段的转换
 */
export const dataTransformers = {
  /**
   * 日期格式化
   */
  date: (value: string | Date | null): string | null => {
    if (!value) return null
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toISOString().split('T')[0]
  },

  /**
   * 日期时间格式化
   */
  datetime: (value: string | Date | null): string | null => {
    if (!value) return null
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toISOString()
  },

  /**
   * 金额格式化（分转元）
   */
  moneyFromCent: (value: number | null): number | null => {
    if (value === null || value === undefined) return null
    return value / 100
  },

  /**
   * 金额格式化（元转分）
   */
  moneyToCent: (value: number | null): number | null => {
    if (value === null || value === undefined) return null
    return Math.round(value * 100)
  },

  /**
   * 布尔值转数字
   */
  boolToNumber: (value: boolean | null): number => {
    return value ? 1 : 0
  },

  /**
   * 数字转布尔值
   */
  numberToBool: (value: number | null): boolean => {
    return value === 1 || value === true
  }
}

// 默认导出
const apiAdapter = {
  adaptResponse,
  adaptPaginatedResponse,
  buildPaginationParams,
  adaptRequestParams,
  adaptFormData,
  adaptQueryParams,
  adaptError,
  dataTransformers
}

export default apiAdapter
