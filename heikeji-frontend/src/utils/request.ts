import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosProgressEvent,
} from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import logger from './logger'

// 扩展AxiosRequestConfig类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    cache?: boolean
    cacheTime?: number
    retry?: number
    retryDelay?: number
    _retryCount?: number
  }
}

// 请求重试配置
const DEFAULT_RETRY = 3
const DEFAULT_RETRY_DELAY = 1000

// API缓存配置
const DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 5分钟
const API_CACHE = new Map<string, { data: any; timestamp: number }>()

// 生成缓存键
const generateCacheKey = (config: InternalAxiosRequestConfig): string => {
  const { url, method, params, data } = config
  return `${method || 'get'}:${url || ''}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`
}

// 缓存请求数据
const cacheRequest = (config: InternalAxiosRequestConfig, data: any): void => {
  const cacheKey = generateCacheKey(config)
  API_CACHE.set(cacheKey, {
    data,
    timestamp: Date.now(),
  })
}

// 获取缓存数据
const getCachedData = (config: InternalAxiosRequestConfig): any | null => {
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
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }

    return config
  },
  (error: AxiosError) => {
    logger.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// API响应数据结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

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

    const config = error.config as InternalAxiosRequestConfig

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
      !axios.isCancel(error) &&
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

// 导出封装的请求方法
export default {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  async get<T = any>(
    url: string,
    params?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.get<ApiResponse<T>>(url, { params, ...config })
    // 缓存成功的响应数据
    if (response.data.code === 20000) {
      cacheRequest(response.config, response.data)
    }
    return response.data
  },

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  async post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await service.post<ApiResponse<T>>(url, data, config)
    return response.data
  },

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 额外配置
   */
  async put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await service.put<ApiResponse<T>>(url, data, config)
    return response.data
  },

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 额外配置
   */
  async delete<T = any>(
    url: string,
    params?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await service.delete<ApiResponse<T>>(url, { params, ...config })
    return response.data
  },

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData FormData对象
   * @param onUploadProgress 上传进度回调
   */
  async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    const response = await service.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data
  },

  /**
   * 下载文件
   * @param url 请求地址
   * @param params 请求参数
   * @param fileName 文件名
   */
  download(url: string, params?: any, fileName?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then(response => {
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

// 导出axios实例
export { service }
