import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Canceler,
} from 'axios'
import { ElMessage, ElNotification, ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import type { ApiResponse, ApiError } from '@/types/api'

// ====== 类型定义 ======
interface RetryConfig {
  maxRetries: number // 最大重试次数
  initialDelay: number // 初始延迟(ms)
  maxDelay: number // 最大延迟(ms)
  retryCondition: (error: any) => boolean // 重试条件
}

interface RequestMetrics {
  url: string
  method: string
  startTime: number
  duration?: number
  status?: number
  success?: boolean
  retryCount?: number
}

interface PendingRequest {
  key: string
  cancel: Canceler
  abortController?: AbortController
}

// ====== 配置项 ======
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1秒
  maxDelay: 30000, // 30秒
  retryCondition: (error) => {
    // 仅对网络错误和5xx服务器错误进行重试
    if (!error.response && error.code !== 'ERR_CANCELED') return true
    if (error.response?.status >= 500) return true
    return false
  }
}

const SLOW_REQUEST_THRESHOLD = 3000 // 慢请求阈值(3s)

// ====== 实例创建 ======
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ====== 请求去重：相同 URL+method 的并发请求只发一次 ======
const pendingRequests = new Map<string, PendingRequest>()

function generateReqKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

function addPendingRequest(config: InternalAxiosRequestConfig): AbortController {
  const key = generateReqKey(config)
  const abortController = new AbortController()

  if (pendingRequests.has(key)) {
    pendingRequests.get(key)?.cancel('取消重复请求')
    pendingRequests.delete(key)
  }

  config.cancelToken = new axios.CancelToken((cancel) => {
    pendingRequests.set(key, { key, cancel, abortController })
  })

  config.signal = abortController.signal

  return abortController
}

function removePendingRequest(config: InternalAxiosRequestConfig) {
  const key = generateReqKey(config)
  pendingRequests.delete(key)
}

// 取消所有待处理的请求（用于页面切换等场景）
export function cancelAllPendingRequests(reason?: string) {
  pendingRequests.forEach(({ cancel }) => cancel(reason || '页面切换取消'))
  pendingRequests.clear()
}

// ====== Token 刷新锁（防止多个 401 并发触发多次刷新）=====
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

// ====== 请求重试机制 ======
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  // 指数退避算法：delay = min(initial * 2^attempt, maxDelay)
  const delay = Math.min(
    config.initialDelay * Math.pow(2, attempt),
    config.maxDelay
  )
  // 添加随机抖动（±25%），避免多个请求同时重试
  const jitter = delay * (0.75 + Math.random() * 0.5)
  return Math.floor(jitter)
}

async function retryWithBackoff<T>(
  error: any,
  originalConfig: InternalAxiosRequestConfig,
  attempt: number = 0,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<AxiosResponse<T>> {
  if (attempt >= retryConfig.maxRetries || !retryConfig.retryCondition(error)) {
    throw error
  }

  const delay = calculateRetryDelay(attempt, retryConfig)
  const maxAttempts = retryConfig.maxRetries

  // 显示重试状态
  showRetryStatus(originalConfig.url!, attempt + 1, maxAttempts)

  logRequest('warn', `准备第 ${attempt + 1}/${maxAttempts} 次重试`, {
    url: originalConfig.url,
    method: originalConfig.method,
    attempt: attempt + 1,
    delay: `${delay}ms`
  })

  await sleep(delay)

  try {
    return await service(originalConfig)
  } catch (retryError) {
    return retryWithBackoff(retryError, originalConfig, attempt + 1, retryConfig)
  }
}

// 显示重试状态提示
function showRetryStatus(url: string, currentAttempt: number, maxAttempts: number) {
  ElNotification({
    title: '正在重试',
    message: `请求 ${url} 正在重试 (${currentAttempt}/${maxAttempts})...`,
    type: 'info',
    duration: 2000,
    position: 'bottom-right'
  })
}

// ====== 请求日志和监控系统 ======
const requestMetrics: RequestMetrics[] = []

function logRequest(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const isDev = import.meta.env.DEV

  if (isDev) {
    const timestamp = new Date().toLocaleTimeString()
    console[level](`[API ${timestamp}] ${message}`, data || '')
  }

  // 生产环境可以发送到监控系统
  if (!isDev && level === 'error') {
    sendToMonitoring({ level, message, data })
  }
}

function startMetricsTracking(url: string, method: string): RequestMetrics {
  const metrics: RequestMetrics = {
    url,
    method,
    startTime: Date.now(),
  }

  requestMetrics.push(metrics)

  // 保持最近100条记录
  if (requestMetrics.length > 100) {
    requestMetrics.shift()
  }

  return metrics
}

function finishMetricsTracking(metrics: RequestMetrics, status: number, success: boolean, retryCount?: number) {
  metrics.duration = Date.now() - metrics.startTime
  metrics.status = status
  metrics.success = success
  metrics.retryCount = retryCount

  // 慢请求告警
  if (metrics.duration > SLOW_REQUEST_THRESHOLD) {
    logRequest('warn', `慢请求告警: ${metrics.method} ${metrics.url} 耗时 ${metrics.duration}ms`, metrics)

    if (import.meta.env.DEV) {
      ElNotification({
        title: '性能警告',
        message: `请求 ${metrics.url} 耗时 ${(metrics.duration / 1000).toFixed(2)}s，超过${SLOW_REQUEST_THRESHOLD / 1000}s阈值`,
        type: 'warning',
        duration: 4000,
        position: 'bottom-right'
      })
    }
  }

  logRequest('info', `${metrics.method} ${metrics.url} 完成 [${metrics.status}] ${(metrics.duration)}ms`)
}

// 发送到监控系统（生产环境）
function sendToMonitoring(data: { level: string; message: string; data?: any }) {
  // 这里可以实现发送到 Sentry、LogRocket 等
  // 目前仅做控制台记录
  if (import.meta.env.PROD) {
    console.error('[Monitor]', data)
  }
}

// 获取请求统计信息
export function getRequestStats(): {
  totalRequests: number
  successRate: number
  averageDuration: number
  slowRequests: number
  } {
  const total = requestMetrics.length
  const successful = requestMetrics.filter(m => m.success).length
  const avgDuration = total > 0
    ? Math.round(requestMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / total)
    : 0
  const slowRequests = requestMetrics.filter(m => (m.duration || 0) > SLOW_REQUEST_THRESHOLD).length

  return {
    totalRequests: total,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    averageDuration: avgDuration,
    slowRequests
  }
}

// ====== 离线模式支持 ======
let isOnline = navigator.onLine

// 监听网络状态变化
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true
    logRequest('info', '网络已连接')
    handleNetworkRecovery()
    ElMessage.success('网络已恢复连接')
  })

  window.addEventListener('offline', () => {
    isOnline = false
    logRequest('warn', '网络已断开')
    ElMessage.warning('网络连接已断开，部分功能可能不可用')
  })
}

// 网络恢复后的处理
function handleNetworkRecovery() {
  // 可以在这里触发失败队列中的请求重试
  logRequest('info', '开始处理离线期间失败的请求')
}

export function getNetworkStatus(): boolean {
  return isOnline
}

// 缓存存储（用于离线模式）
const cacheStorage = new Map<string, { data: any; timestamp: number; ttl: number }>()

function getFromCache(key: string): any | null {
  const cached = cacheStorage.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > cached.ttl) {
    cacheStorage.delete(key)
    return null
  }

  return cached.data
}

function setCache(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟缓存
  cacheStorage.set(key, { data, timestamp: Date.now(), ttl })
}

// ====== 请求拦截器 ======
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()

    // Token 注入
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // CSRF Token
    const csrfToken = getCookie('XSRF-TOKEN')
    if (csrfToken) {
      config.headers['X-XSRF-Token'] = csrfToken
    }

    // 防缓存时间戳
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    // GET 请求去重（POST 不去重，因为可能有副作用）
    if (config.method === 'get' && config.deduplicate !== false) {
      addPendingRequest(config)
    }

    // 开始性能追踪
    const metrics = startMetricsTracking(config.url || '', config.method || 'GET')
    ;(config as any)._metrics = metrics

    // 离线模式检查
    if (!isOnline && !config.allowOffline) {
      // 尝试从缓存获取数据
      const cacheKey = generateReqKey(config)
      const cachedData = getFromCache(cacheKey)

      if (cachedData) {
        logRequest('info', '使用离线缓存数据', { url: config.url })
        return Promise.reject({
          __offlineCache__: true,
          data: cachedData,
          config
        })
      }

      ElMessage.warning('当前处于离线模式，请检查网络连接')
      return Promise.reject(new Error('网络不可用'))
    }

    // 请求日志
    logRequest('info', `发起请求: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      hasData: !!config.data
    })

    return config
  },
  (error) => {
    removePendingRequest(error.config)
    return Promise.reject(error)
  }
)

// ====== 响应拦截器 ======
service.interceptors.response.use(
  (response: AxiosResponse) => {
    removePendingRequest(response.config)

    const metrics = (response.config as any)?._metrics as RequestMetrics
    if (metrics) {
      finishMetricsTracking(metrics, response.status, true)
    }

    const res = response.data

    // 成功响应缓存（用于离线模式）
    if (isOnline && response.config.method === 'get') {
      const cacheKey = generateReqKey(response.config)
      setCache(cacheKey, res)
    }

    if (res.code === 0 || res.code === 200 || res.success) {
      return res.data ?? res
    }

    // 根据配置决定是否显示错误消息（默认显示）
    const config = response.config as any
    const showError = config?.showError !== false
    if (showError) {
      ElMessage.error(res.message || '请求失败')
    }

    return Promise.reject(new Error(res.message || 'Error'))
  },
  async (error) => {
    const { config, response } = error

    if (config) {
      removePendingRequest(config)

      const metrics = (config as any)?._metrics as RequestMetrics
      if (metrics) {
        finishMetricsTracking(metrics, response?.status || 0, false)
      }

      // 处理离线缓存命中
      if (error.__offlineCache__) {
        return error.data
      }

      // 自动重试机制
      const shouldRetry = config.retry !== false && (
        !response || // 网络错误
        response.status >= 500 // 服务器错误
      )

      if (shouldRetry) {
        try {
          logRequest('info', '触发自动重试机制', { url: config.url })
          const result = await retryWithBackoff(error, config)
          return result
        } catch (retryError) {
          // 重试失败后继续处理错误
          error = retryError
        }
      }
    }

    if (response) {
      switch (response.status) {
        case 401: {
          const userStore = useUserStore()

          if (!config) break

          // Token 过期：尝试刷新
          if (userStore.token && !isRefreshing) {
            isRefreshing = true

            try {
              const newToken = await userStore.refreshToken()
              isRefreshing = false
              onRefreshed(newToken)

              // 用新 token 重试原请求
              config.headers.Authorization = `Bearer ${newToken}`
              return service(config)
            } catch {
              isRefreshing = false
              userStore.logout()
              router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
              return Promise.reject(error)
            }
          } else if (userStore.token && isRefreshing) {
            // 正在刷新中，排队等待
            return new Promise((resolve) => {
              addRefreshSubscriber((newToken: string) => {
                config!.headers.Authorization = `Bearer ${newToken}`
                resolve(service(config!))
              })
            })
          } else {
            // 无 token，直接跳登录
            userStore.logout()
            router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
          }
          break
        }

        case 403:
          ElMessage.error('抱歉，您没有权限执行此操作')
          break

        case 404:
          ElMessage.error('请求的资源不存在')
          break

        case 422:
          ElMessage.error(response.data?.message || '数据验证失败')
          break

        case 429:
          ElMessage.warning('操作太频繁，请稍后再试')
          break

        case 500:
        case 502:
        case 503:
        case 504:
          ElNotification({
            title: '错误',
            message: '服务器开小差了，请稍后重试',
            type: 'error',
            duration: 5000,
          })
          break

        default:
          ElMessage.error(response.data?.message || `请求失败(${response.status})`)
      }
    } else if (error.code === 'ERR_CANCELED') {
      logRequest('info', '请求已取消', { message: error.message })
    } else {
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请检查网络连接')
      } else if (!navigator.onLine) {
        ElMessage.warning('网络连接已断开，请检查网络')
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    }

    return Promise.reject(error)
  }
)

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

// ====== 导出的请求方法 ======

interface EnhancedRequestConfig extends AxiosRequestConfig {
  deduplicate?: boolean // 是否去重（默认GET请求去重）
  retry?: boolean // 是否允许重试（默认true）
  allowOffline?: boolean // 是否允许离线访问（默认false）
  showLoading?: boolean // 是否显示loading
  showError?: boolean // 是否显示错误消息（默认true）
  cache?: boolean // 是否使用缓存
  cacheTTL?: number // 缓存有效期(ms)
}

export function get<T = any>(url: string, config?: EnhancedRequestConfig): Promise<T> {
  return service.get(url, config)
}

export function post<T = any>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

export function put<T = any>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

export function del<T = any>(url: string, config?: EnhancedRequestConfig): Promise<T> {
  return service.delete(url, config)
}

export function upload<T = any>(
  url: string,
  file: File | FormData,
  onProgress?: (progressEvent: ProgressEvent) => void,
  config?: EnhancedRequestConfig
): Promise<T> {
  const formData = file instanceof FormData ? file : new FormData()
  if (!(file instanceof FormData)) {
    formData.append('file', file)
  }

  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  })
}

// 导出工具函数
export default service
