// 工具类类型定义

// 认证相关类型
export interface AuthUtils {
  getToken: () => string | null
  setToken: (token: string) => void
  removeToken: () => void
  getRefreshToken: () => string | null
  setRefreshToken: (refreshToken: string) => void
  removeRefreshToken: () => void
  getExpireTime: () => number | null
  setExpireTime: (expireTime: number) => void
  removeExpireTime: () => void
  isTokenExpired: () => boolean
  clearAuth: () => void
}

// 日志相关类型
export interface LoggerUtils {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  debug: (...args: any[]) => void
}

// 缓存相关类型
export interface CacheUtils {
  get: <T>(key: string) => T | null
  set: <T>(key: string, value: T, expire?: number) => void
  remove: (key: string) => void
  clear: () => void
  has: (key: string) => boolean
  getSize: () => number
}

// 请求相关类型
export interface RequestUtils {
  get: <T>(url: string, params?: any) => Promise<T>
  post: <T>(url: string, data?: any) => Promise<T>
  put: <T>(url: string, data?: any) => Promise<T>
  remove: <T>(url: string, params?: any) => Promise<T>
  upload: <T>(url: string, data: FormData) => Promise<T>
  download: (url: string, params?: any) => Promise<Blob>
}

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

// 导出模块声明
declare module '@/utils/auth' {
  const auth: AuthUtils
  export default auth
  export const getToken: () => string | null
  export const setToken: (token: string) => void
  export const removeToken: () => void
  export const getRefreshToken: () => string | null
  export const setRefreshToken: (refreshToken: string) => void
  export const removeRefreshToken: () => void
  export const getExpireTime: () => number | null
  export const setExpireTime: (expireTime: number) => void
  export const removeExpireTime: () => void
  export const isTokenExpired: () => boolean
  export const clearAuth: () => void
}

declare module '@/utils/logger' {
  const logger: LoggerUtils
  export default logger
  export const log: (...args: any[]) => void
  export const info: (...args: any[]) => void
  export const warn: (...args: any[]) => void
  export const error: (...args: any[]) => void
  export const debug: (...args: any[]) => void
}

declare module '@/utils/cache' {
  const cache: CacheUtils
  export default cache
  export const get: <T>(key: string) => T | null
  export const set: <T>(key: string, value: T, expire?: number) => void
  export const remove: (key: string) => void
  export const clear: () => void
  export const has: (key: string) => boolean
  export const getSize: () => number
}
