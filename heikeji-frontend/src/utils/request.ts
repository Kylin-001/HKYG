import axios from 'axios'

// 类型定义
type AxiosResponse<T = any> = {
  data: T
  status: number
  statusText: string
  headers: any
  config: any
}
type AxiosError = { message: string; code?: string; response?: AxiosResponse; config?: any }
type InternalAxiosRequestConfig = {
  url?: string
  method?: string
  params?: any
  data?: any
  headers?: any
  cache?: boolean
  cacheTime?: number
  retry?: number
  retryDelay?: number
  _retryCount?: number
  rateLimit?: boolean
  rateLimitKey?: string
  encrypt?: boolean
  encryptFields?: string[]
  decryptResponse?: boolean
}
type AxiosProgressEvent = { loaded: number; total: number; progress?: number }

// 模拟isCancel函数
const isCancel = (error: any): boolean => {
  return error && error.__CANCEL__
}

// 直接使用axios实例

import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import logger from './logger'
import { rateLimiters, RATE_LIMIT_CONFIGS } from './rate-limiter'
import { defaultEncryption, sensitiveDataEncryption } from './encryption'

// 扩展AxiosRequestConfig类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    cache?: boolean
    cacheTime?: number
    retry?: number
    retryDelay?: number
    _retryCount?: number
    rateLimit?: boolean
    rateLimitKey?: string
    encrypt?: boolean
    encryptFields?: string[]
    decryptResponse?: boolean
    url?: string
    method?: string
    params?: Record<string, unknown>
    data?: unknown
    headers?: Record<string, string>
  }
}

// 请求重试配置
const DEFAULT_RETRY = 3
const DEFAULT_RETRY_DELAY = 1000

// API缓存配置
const DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 5分钟
interface CacheItem {
  data: unknown
  timestamp: number
}
const API_CACHE = new Map<string, CacheItem>()

// 生成缓存键
const generateCacheKey = (config: InternalAxiosRequestConfig): string => {
  const { url, method, params, data } = config
  return `${method || 'get'}:${url || ''}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

// 缓存请求数据
const cacheRequest = (config: InternalAxiosRequestConfig, data: unknown): void => {
  const cacheKey = generateCacheKey(config)
  API_CACHE.set(cacheKey, {
    data,
    timestamp: Date.now(),
  })
}

// 获取缓存数据
const getCachedData = (config: InternalAxiosRequestConfig): unknown | null => {
  // 只缓存GET请求
  if (config.method?.toLowerCase() !== 'get') {
    return null
  }

  // 检查是否禁用缓存
  if (config.cache === false) {
    return null
  }

  const cacheKey = generateCacheKey(config)
  const cachedItem = API_CACHE.get(cacheKey)

  if (!cachedItem) {
    return null
  }

  const cacheTime = config.cacheTime || DEFAULT_CACHE_TIME
  const isExpired = Date.now() - cachedItem.timestamp > cacheTime

  if (isExpired) {
    API_CACHE.delete(cacheKey)
    return null
  }

  logger.info('使用缓存数据:', { url: config.url })
  return cachedItem.data
}

// 清理过期缓存
const clearExpiredCache = (): void => {
  const now = Date.now()
  for (const [key, value] of API_CACHE.entries()) {
    if (now - value.timestamp > DEFAULT_CACHE_TIME) {
      API_CACHE.delete(key)
    }
  }
}

// 智能清理过期缓存
let cleanupTimeout: NodeJS.Timeout | null = null
const scheduleExpiredCacheCleanup = (): void => {
  if (cleanupTimeout) {
    clearTimeout(cleanupTimeout)
  }

  // 每10分钟清理一次过期缓存
  cleanupTimeout = setTimeout(
    () => {
      clearExpiredCache()
      scheduleExpiredCacheCleanup()
    },
    10 * 60 * 1000
  )
}

// 定期清理过期缓存
scheduleExpiredCacheCleanup()

// 创建axios实例
const service = (axios as any).create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 速率限制检查
    if (config.rateLimit !== false && import.meta.env.VITE_APP_ENABLE_RATE_LIMITING !== 'false') {
      const rateLimitKey = config.rateLimitKey || config.url || 'default'
      let rateLimiter = rateLimiters.general

      // 根据URL路径选择合适的速率限制器
      if (config.url?.includes('/login')) {
        rateLimiter = rateLimiters.login
      } else if (config.url?.includes('/register')) {
        rateLimiter = rateLimiters.register
      } else if (config.url?.includes('/upload')) {
        rateLimiter = rateLimiters.upload
      } else if (config.url?.includes('/search')) {
        rateLimiter = rateLimiters.search
      } else if (
        config.url?.includes('/user') ||
        config.url?.includes('/order') ||
        config.url?.includes('/payment')
      ) {
        rateLimiter = rateLimiters.sensitive
      }

      // 检查是否超过速率限制
      if (!rateLimiter.isAllowed(rateLimitKey)) {
        const resetTime = rateLimiter.getResetTime(rateLimitKey)
        const waitTime = Math.ceil((resetTime - Date.now()) / 1000)

        const errorMessage = `请求过于频繁，请等待${waitTime}秒后再试`
        ElMessage.error(errorMessage)

        return Promise.reject(new Error(errorMessage))
      }
    }

    // 添加token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }

    // 数据加密
    if (
      config.encrypt &&
      config.data &&
      import.meta.env.VITE_APP_ENABLE_REQUEST_ENCRYPTION !== 'false'
    ) {
      try {
        // 如果指定了加密字段，只加密这些字段
        if (config.encryptFields && config.encryptFields.length > 0) {
          const encryptedData = { ...config.data } as Record<string, unknown>
          config.encryptFields.forEach(field => {
            if (encryptedData[field] && typeof encryptedData[field] === 'string') {
              encryptedData[field] = sensitiveDataEncryption.encrypt(encryptedData[field] as string)
            }
          })
          config.data = encryptedData
        } else {
          // 加密整个数据对象
          config.data = {
            encrypted: true,
            data: defaultEncryption.encryptObject(config.data as Record<string, unknown>),
          }
        }
      } catch (error) {
        logger.error('数据加密失败:', error)
        ElMessage.error('数据加密失败')
        return Promise.reject(error)
      }
    }

    return config
  },
  (error: AxiosError) => {
    logger.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// API响应数据结构
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp?: number
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 标记请求成功（用于速率限制）
    const config = response.config as InternalAxiosRequestConfig
    if (config.rateLimit !== false && import.meta.env.VITE_APP_ENABLE_RATE_LIMITING !== 'false') {
      const rateLimitKey = config.rateLimitKey || config.url || 'default'
      let rateLimiter = rateLimiters.general

      // 根据URL路径选择合适的速率限制器
      if (config.url?.includes('/login')) {
        rateLimiter = rateLimiters.login
      } else if (config.url?.includes('/register')) {
        rateLimiter = rateLimiters.register
      } else if (config.url?.includes('/upload')) {
        rateLimiter = rateLimiters.upload
      } else if (config.url?.includes('/search')) {
        rateLimiter = rateLimiters.search
      } else if (
        config.url?.includes('/user') ||
        config.url?.includes('/order') ||
        config.url?.includes('/payment')
      ) {
        rateLimiter = rateLimiters.sensitive
      }

      rateLimiter.markSuccess(rateLimitKey)
    }

    // 数据解密
    if (
      config.decryptResponse &&
      res.data &&
      import.meta.env.VITE_APP_ENABLE_RESPONSE_DECRYPTION !== 'false'
    ) {
      try {
        // 如果响应数据是加密的
        if (res.data && typeof res.data === 'object' && 'encrypted' in res.data) {
          res.data = defaultEncryption.decryptObject((res.data as any).data)
        }
      } catch (error) {
        logger.error('数据解密失败:', error)
        ElMessage.error('数据解密失败')
        return Promise.reject(error)
      }
    }

    // 状态码不是20000则判断为错误
    if (res.code !== 20000) {
      const errorMessage = res.message || '请求失败'
      logger.error('API请求失败:', {
        url: response.config.url,
        code: res.code,
        message: errorMessage,
      })
      ElMessage.error(errorMessage)

      // 处理特定错误码
      if (res.code === 401) {
        // 未登录或token过期
        const userStore = useUserStore()
        userStore.logoutAction()
        window.location.href = '/login'
      }

      return Promise.reject(new Error(errorMessage))
    } else {
      // 缓存成功的响应数据
      cacheRequest(response.config, res)
      return response
    }
  },
  async (error: AxiosError) => {
    logger.error('响应错误:', error)

    // 标记请求失败（用于速率限制）
    const config = error.config as InternalAxiosRequestConfig
    if (config && config.rateLimit !== false) {
      const rateLimitKey = config.rateLimitKey || config.url || 'default'
      let rateLimiter = rateLimiters.general

      // 根据URL路径选择合适的速率限制器
      if (config.url?.includes('/login')) {
        rateLimiter = rateLimiters.login
      } else if (config.url?.includes('/register')) {
        rateLimiter = rateLimiters.register
      } else if (config.url?.includes('/upload')) {
        rateLimiter = rateLimiters.upload
      } else if (config.url?.includes('/search')) {
        rateLimiter = rateLimiters.search
      } else if (
        config.url?.includes('/user') ||
        config.url?.includes('/order') ||
        config.url?.includes('/payment')
      ) {
        rateLimiter = rateLimiters.sensitive
      }

      rateLimiter.markFailure(rateLimitKey)
    }

    // 如果没有配置，直接返回错误
    if (!config) {
      return Promise.reject(error)
    }

    // 设置重试次数和延迟
    const retryCount = config._retryCount || 0
    const retryDelay = config.retryDelay || DEFAULT_RETRY_DELAY
    const maxRetry = config.retry || DEFAULT_RETRY

    // 检查是否需要重试
    const shouldRetry =
      retryCount < maxRetry &&
      !isCancel(error) &&
      (error.code === 'ECONNABORTED' ||
        !error.response ||
        [500, 502, 503, 504].includes(error.response.status))

    if (shouldRetry) {
      // 增加重试次数
      config._retryCount = retryCount + 1

      // 延迟重试
      await new Promise(resolve => setTimeout(resolve, retryDelay))

      logger.info(`请求重试: ${config.url} (${retryCount + 1}/${maxRetry})`)
      return service(config)
    }

    // 处理不重试的错误
    let errorMessage = '网络错误'
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          const userStore = useUserStore()
          userStore.logoutAction()
          window.location.href = '/login'
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求资源不存在'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = `请求失败: ${status}`
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时'
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = '网络连接失败'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  }
)

// 封装的请求方法
const request = {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.get(url, { params, ...config })
    // 缓存成功的响应数据
    if (response.data.code === 20000) {
      cacheRequest(response.config, response.data)
    }
    return response.data as ApiResponse<T>
  },

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  async post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.post(url, data, config)
    return response.data as ApiResponse<T>
  },

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  async put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.put(url, data, config)
    return response.data as ApiResponse<T>
  },

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  async delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.delete(url, { params, ...config })
    return response.data as ApiResponse<T>
  },

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData FormData对象
   * @param onUploadProgress 上传进度回调
   */
  async upload<T = unknown>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    const response = await service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data as ApiResponse<T>
  },

  /**
   * 下载文件
   * @param url 请求地址
   * @param params 请求参数
   * @param fileName 文件名
   */
  download(url: string, params?: Record<string, unknown>, fileName?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((response: any) => {
        const blob = new Blob([response.data], { type: 'application/octet-stream' })
        const link = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = fileName || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
  },
}

// 导出请求方法和axios实例
export const requestInstance = request
export { service }
export default request
