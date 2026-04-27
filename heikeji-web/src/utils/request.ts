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
import i18n from '@/locales'
import { mockAPI } from '@/mock'

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
    // 使用 axios 直接请求，避免再次进入响应拦截器的重试逻辑
    return await axios({
      ...originalConfig,
      baseURL: undefined, // 已经在 URL 中
      headers: {
        ...originalConfig.headers,
        // 添加标记，表示这是重试请求
        'X-Retry-Attempt': String(attempt + 1)
      }
    })
  } catch (retryError) {
    return retryWithBackoff(retryError, originalConfig, attempt + 1, retryConfig)
  }
}

// 显示重试状态提示
function showRetryStatus(url: string, currentAttempt: number, maxAttempts: number) {
  const { t } = i18n.global
  ElNotification({
    title: t('request.retrying'),
    message: t('request.retryMessage', { url, current: currentAttempt, max: maxAttempts }),
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
      const { t } = i18n.global
      ElNotification({
        title: t('request.performanceWarning'),
        message: t('request.slowRequest', { url: metrics.url, duration: (metrics.duration / 1000).toFixed(2), threshold: SLOW_REQUEST_THRESHOLD / 1000 }),
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
    const { t } = i18n.global
    ElMessage.success(t('request.networkRestored'))
  })

  window.addEventListener('offline', () => {
    isOnline = false
    logRequest('warn', '网络已断开')
    const { t } = i18n.global
    ElMessage.warning(t('request.networkDisconnected'))
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

    // Token 注入 - 只有当token存在且格式有效时才添加
    if (userStore.token && userStore.token.trim() !== '') {
      // 验证 JWT 格式（应该包含3个部分，用.分隔）
      const tokenParts = userStore.token.split('.')
      if (tokenParts.length === 3 && tokenParts.every(part => part.length > 0)) {
        config.headers.Authorization = `Bearer ${userStore.token}`
      } else {
        console.warn('[Request] 无效的 JWT token 格式，跳过注入')
        // 清除无效 token
        userStore.logout()
      }
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

      const { t } = i18n.global
      ElMessage.warning(t('request.offlineMode'))
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

      // 自动重试机制 - 检查是否已经是重试请求
      const isRetryRequest = config.headers?.['X-Retry-Attempt'] !== undefined
      const shouldRetry = !isRetryRequest && config.retry !== false && (
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
      const { t } = i18n.global
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
          ElMessage.error(t('request.permissionDenied'))
          break

        case 404:
          ElMessage.error(t('request.resourceNotFound'))
          break

        case 422:
          ElMessage.error(response.data?.message || t('error.422'))
          break

        case 429:
          ElMessage.warning(t('request.tooManyRequests'))
          break

        case 500:
        case 502:
        case 503:
        case 504:
          ElNotification({
            title: t('common.error'),
            message: t('request.serverError'),
            type: 'error',
            duration: 5000,
          })
          break

        default:
          ElMessage.error(response.data?.message || t('common.error'))
      }
    } else if (error.code === 'ERR_CANCELED') {
      logRequest('info', '请求已取消', { message: error.message })
    } else {
      const { t } = i18n.global
      if (error.message.includes('timeout')) {
        ElMessage.error(t('request.requestTimeout'))
      } else if (!navigator.onLine) {
        ElMessage.warning(t('request.networkError'))
      } else {
        ElMessage.error(t('request.networkErrorGeneric'))
      }
    }

    return Promise.reject(error)
  }
)

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

// ====== Mock 支持 ======
// const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true' || import.meta.env.DEV
const isMockEnabled = false // 禁用 Mock，使用后端 API 进行联调

async function handleMockRequest<T>(method: string, url: string, data?: any, config?: any): Promise<T> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))

  console.log(`[Mock] ${method} ${url}`, data || '')

  // 用户相关接口
  if (url === '/user/info' || url === '/api/user/info') {
    return mockAPI.user.info() as Promise<T>
  }

  // 登录
  if ((url === '/auth/login' || url === '/api/auth/login') && method === 'POST') {
    return mockAPI.user.login(data) as Promise<T>
  }

  // 注册
  if ((url === '/auth/register' || url === '/api/auth/register') && method === 'POST') {
    return mockAPI.user.register(data) as Promise<T>
  }

  // 退出登录
  if ((url === '/auth/logout' || url === '/api/auth/logout') && method === 'POST') {
    return mockAPI.user.logout() as Promise<T>
  }

  // 二手市场相关接口
  if (url === '/secondhand/items' || url === '/api/secondhand/items') {
    return mockAPI.secondhand.list(config?.params) as Promise<T>
  }

  if (url.match(/\/secondhand\/items\/\d+$/)) {
    const id = url.split('/').pop()
    return mockAPI.secondhand.detail(id!) as Promise<T>
  }

  if (url === '/secondhand/categories' || url === '/api/secondhand/categories') {
    return mockAPI.secondhand.categories() as Promise<T>
  }

  if (url === '/secondhand/my-items' || url === '/api/secondhand/my-items') {
    return mockAPI.secondhand.myItems() as Promise<T>
  }

  if (url === '/secondhand/items' && method === 'POST') {
    return mockAPI.secondhand.publish(data) as Promise<T>
  }

  if (url.match(/\/secondhand\/items\/\d+\/like$/)) {
    return { success: true } as T
  }

  // 社区论坛相关接口
  // 板块列表
  if (url === '/community/boards' || url === '/api/community/boards') {
    return mockAPI.community.boards() as Promise<T>
  }

  // 帖子列表
  if (url === '/community/posts' || url === '/api/community/posts') {
    return mockAPI.community.posts(config?.params) as Promise<T>
  }

  // 帖子详情
  if (url.match(/\/community\/posts\/[^/]+$/)) {
    const id = url.split('/').pop()
    if (!id) throw new Error('Post ID is required')
    return mockAPI.community.postDetail(id) as Promise<T>
  }

  // 创建帖子
  if ((url === '/community/posts' || url === '/api/community/posts') && method === 'POST') {
    return mockAPI.community.createPost(data) as Promise<T>
  }

  // 点赞/取消点赞帖子
  if (url.match(/\/community\/posts\/[^/]+\/like$/)) {
    const id = url.split('/')[3]
    if (!id) throw new Error('Post ID is required')
    if (method === 'POST') {
      return mockAPI.community.likePost(id) as Promise<T>
    } else if (method === 'DELETE') {
      return mockAPI.community.unlikePost(id) as Promise<T>
    }
  }

  // 添加评论
  if (url.match(/\/community\/posts\/[^/]+\/comments$/)) {
    const postId = url.split('/')[3]
    if (!postId) throw new Error('Post ID is required')
    return mockAPI.community.addComment(postId, data?.content, data?.parentId) as Promise<T>
  }

  // 失物招领列表
  if (url === '/community/lost-found' || url === '/api/community/lost-found') {
    return mockAPI.community.lostFoundList(config?.params) as Promise<T>
  }

  // 发布失物招领
  if ((url === '/community/lost-found' || url === '/api/community/lost-found') && method === 'POST') {
    return mockAPI.community.publishLostFound(data) as Promise<T>
  }

  // 社团活动列表
  if (url === '/community/activities' || url === '/api/community/activities') {
    return mockAPI.community.activities(config?.params) as Promise<T>
  }

  // 活动详情
  if (url.match(/\/community\/activities\/[^/]+$/)) {
    const id = url.split('/').pop()
    if (!id) throw new Error('Activity ID is required')
    return mockAPI.community.activityDetail(id) as Promise<T>
  }

  // 参加活动
  if (url.match(/\/community\/activities\/[^/]+\/join$/)) {
    const id = url.split('/')[3]
    if (!id) throw new Error('Activity ID is required')
    return mockAPI.community.joinActivity(id) as Promise<T>
  }

  // 创建活动
  if ((url === '/community/activities' || url === '/api/community/activities') && method === 'POST') {
    return mockAPI.community.createActivity(data) as Promise<T>
  }

  // 学工办理相关接口
  // 待办任务
  if (url === '/student-affairs/pending-tasks' || url === '/api/student-affairs/pending-tasks') {
    return mockAPI.studentAffairs.pendingTasks() as Promise<T>
  }

  // 请假申请
  if (url === '/student-affairs/leaves' || url === '/api/student-affairs/leaves') {
    if (method === 'GET') {
      return mockAPI.studentAffairs.leaveApplications() as Promise<T>
    }
    if (method === 'POST') {
      return mockAPI.studentAffairs.submitLeave(data) as Promise<T>
    }
  }

  if (url.match(/\/student-affairs\/leaves\/[^/]+\/cancel$/)) {
    const id = url.split('/')[2]
    return mockAPI.studentAffairs.cancelLeave(id) as Promise<T>
  }

  // 助学金申请
  if (url === '/student-affairs/aid' || url === '/api/student-affairs/aid') {
    if (method === 'GET') {
      return mockAPI.studentAffairs.aidApplications() as Promise<T>
    }
    if (method === 'POST') {
      return mockAPI.studentAffairs.submitAid(data) as Promise<T>
    }
  }

  // 军训服装
  if (url === '/student-affairs/military' || url === '/api/student-affairs/military') {
    if (method === 'GET') {
      return mockAPI.studentAffairs.militaryOrders() as Promise<T>
    }
    if (method === 'POST') {
      return mockAPI.studentAffairs.submitMilitaryOrder(data) as Promise<T>
    }
  }

  // 校园卡
  if (url === '/student-affairs/campus-card' || url === '/api/student-affairs/campus-card') {
    return mockAPI.studentAffairs.campusCard() as Promise<T>
  }

  if (url === '/student-affairs/campus-card/records' || url === '/api/student-affairs/campus-card/records') {
    return mockAPI.studentAffairs.rechargeRecords() as Promise<T>
  }

  if (url === '/student-affairs/campus-card/recharge' || url === '/api/student-affairs/campus-card/recharge') {
    return mockAPI.studentAffairs.rechargeCard(data?.amount, data?.method) as Promise<T>
  }

  if (url === '/student-affairs/campus-card/report-lost' || url === '/api/student-affairs/campus-card/report-lost') {
    return mockAPI.studentAffairs.reportLost() as Promise<T>
  }

  // 资助政策
  if (url === '/student-affairs/policies' || url === '/api/student-affairs/policies') {
    return mockAPI.studentAffairs.aidPolicies() as Promise<T>
  }

  // ====== 商品相关接口 ======
  // 热门商品
  if (url === '/products/hot' || url === '/api/products/hot') {
    return mockAPI.products.hot() as Promise<T>
  }

  // 商品列表
  if (url === '/product/page' || url === '/api/product/page') {
    return mockAPI.products.list(config?.params) as Promise<T>
  }

  // 商品详情
  if (url.match(/\/products\/\d+$/)) {
    const id = url.split('/').pop()
    return mockAPI.products.detail(id!) as Promise<T>
  }

  // 商品分类
  if (url === '/products/categories' || url === '/api/products/categories') {
    return mockAPI.products.categories() as Promise<T>
  }

  // 搜索商品
  if (url === '/products/search' || url === '/api/products/search') {
    return mockAPI.products.search(config?.params?.keyword, config?.params) as Promise<T>
  }

  // ====== 外卖相关接口 ======
  // 商家列表
  if (url === '/takeout/merchant/active' || url === '/api/takeout/merchant/active') {
    return mockAPI.takeout.merchants(config?.params) as Promise<T>
  }

  // 商家搜索
  if (url === '/takeout/merchant/search' || url === '/api/takeout/merchant/search') {
    return mockAPI.takeout.searchMerchants(config?.params?.keyword) as Promise<T>
  }

  // 商家详情
  if (url.match(/\/takeout\/merchant\/detail\/\d+$/)) {
    const id = url.split('/').pop()
    return mockAPI.takeout.merchantDetail(id!) as Promise<T>
  }

  // 商家商品列表
  if (url.match(/\/takeout\/product\/merchant\/\d+$/)) {
    const merchantId = url.split('/').pop()
    return mockAPI.takeout.merchantProducts(merchantId!) as Promise<T>
  }

  // 推荐商品
  if (url.match(/\/takeout\/product\/recommended\/\d+$/)) {
    const merchantId = url.split('/').pop()
    return mockAPI.takeout.recommendedProducts(merchantId!) as Promise<T>
  }

  // 商品详情
  if (url.match(/\/takeout\/product\/detail\/\d+$/)) {
    const productId = url.split('/').pop()
    return mockAPI.takeout.productDetail(productId!) as Promise<T>
  }

  // ====== 校园服务相关接口 ======
  // 课表查询
  if (url === '/campus/schedule' || url === '/api/campus/schedule') {
    return mockAPI.campus.schedule(config?.params) as Promise<T>
  }

  // 成绩查询
  if (url === '/campus/grades' || url === '/api/campus/grades') {
    return mockAPI.campus.grades(config?.params) as Promise<T>
  }

  // GPA 查询
  if (url === '/campus/gpa' || url === '/api/campus/gpa') {
    return mockAPI.campus.gpa() as Promise<T>
  }

  // 图书馆 - 借阅记录
  if (url === '/campus/library/borrows' || url === '/api/campus/library/borrows') {
    const response = await mockAPI.campus.libraryBorrows() as any
    return response.data as Promise<T>
  }

  // 图书馆 - 座位预约
  if (url === '/campus/library/seats' || url === '/api/campus/library/seats') {
    const response = await mockAPI.campus.librarySeats(config?.params?.floor) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 预约座位
  if (url === '/campus/library/seats/book' || url === '/api/campus/library/seats/book') {
    const response = await mockAPI.campus.reserveSeat(data) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 我的座位预约
  if (url === '/campus/library/my-bookings' || url === '/api/campus/library/my-bookings') {
    const response = await mockAPI.campus.mySeatBookings() as any
    return response.data as Promise<T>
  }

  // 图书馆 - 取消预约
  if (url === '/campus/library/seats/cancel' || url === '/api/campus/library/seats/cancel') {
    const response = await mockAPI.campus.cancelSeatBooking(data?.bookingId) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 签到
  if (url === '/campus/library/seats/checkin' || url === '/api/campus/library/seats/checkin') {
    const response = await mockAPI.campus.checkInSeat(data?.bookingId) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 签退
  if (url === '/campus/library/seats/checkout' || url === '/api/campus/library/seats/checkout') {
    const response = await mockAPI.campus.checkOutSeat(data?.bookingId) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 借阅图书
  if (url === '/campus/library/borrow' || url === '/api/campus/library/borrow') {
    const response = await mockAPI.campus.borrowBook(data) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 归还图书
  if (url === '/campus/library/return' || url === '/api/campus/library/return') {
    const response = await mockAPI.campus.returnBook(data?.borrowId) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 续借图书
  if (url === '/campus/library/renew' || url === '/api/campus/library/renew') {
    const response = await mockAPI.campus.renewBook(data?.borrowId) as any
    return response.data as Promise<T>
  }

  // 图书馆 - 添加收藏
  if (url === '/campus/library/favorites' || url === '/api/campus/library/favorites') {
    if (method === 'POST') {
      const response = await mockAPI.campus.addToFavorites(data?.bookId) as any
      return response.data as Promise<T>
    }
    if (method === 'GET') {
      const response = await mockAPI.campus.myFavorites() as any
      return response.data as Promise<T>
    }
  }

  // 图书馆 - 取消收藏
  if (url === '/campus/library/favorites/remove' || url === '/api/campus/library/favorites/remove') {
    const response = await mockAPI.campus.myFavorites() as any
    return response.data as Promise<T>
  }

  // 图书馆 - 我的借阅
  if (url === '/campus/library/my-borrows' || url === '/api/campus/library/my-borrows') {
    const response = await mockAPI.campus.libraryBorrows() as any
    return response.data as Promise<T>
  }

  // 缴费中心 - 待缴费列表
  if (url === '/campus/payment/pending' || url === '/api/campus/payment/pending') {
    return mockAPI.campus.pendingPayments() as Promise<T>
  }

  // 缴费中心 - 缴费记录
  if (url === '/campus/payment/history' || url === '/api/campus/payment/history') {
    return mockAPI.campus.paymentHistory() as Promise<T>
  }

  // 学工服务 - 奖学金
  if (url === '/student-affairs/scholarships' || url === '/api/student-affairs/scholarships') {
    return mockAPI.campus.scholarships() as Promise<T>
  }

  // 学工服务 - 资助政策
  if (url === '/student-affairs/policies' || url === '/api/student-affairs/policies') {
    return mockAPI.campus.aidPolicies() as Promise<T>
  }

  // 学工服务 - 活动列表
  if (url === '/student-affairs/activities' || url === '/api/student-affairs/activities') {
    return mockAPI.campus.activities() as Promise<T>
  }

  // 学工服务 - 心理咨询预约
  if (url === '/student-affairs/counseling' || url === '/api/student-affairs/counseling') {
    return mockAPI.campus.counseling() as Promise<T>
  }

  // 学工服务 - 就业信息
  if (url === '/student-affairs/careers' || url === '/api/student-affairs/careers') {
    return mockAPI.campus.careers() as Promise<T>
  }

  // 教室查询
  if (url === '/campus/classrooms' || url === '/api/campus/classrooms') {
    const response = await mockAPI.campus.classrooms(config?.params) as any
    return response.data as Promise<T>
  }

  // 教室时间段查询
  if (url.match(/\/campus\/classrooms\/[^/]+\/slots/) || url.match(/\/api\/campus\/classrooms\/[^/]+\/slots/)) {
    const roomId = url.split('/')[3] || url.split('/')[4]
    const date = config?.params?.date || new Date().toISOString().split('T')[0]
    const response = await mockAPI.campus.classroomTimeSlots(roomId, date) as any
    return response.data as Promise<T>
  }

  // 教室预约
  if (url.match(/\/campus\/classrooms\/[^/]+\/book/) || url.match(/\/api\/campus\/classrooms\/[^/]+\/book/)) {
    const roomId = url.split('/')[3] || url.split('/')[4]
    const response = await mockAPI.campus.bookClassroom(roomId, data) as any
    return response.data as Promise<T>
  }

  // 我的教室预约
  if (url === '/campus/classrooms/my-bookings' || url === '/api/campus/classrooms/my-bookings') {
    const response = await mockAPI.campus.myClassroomBookings() as any
    return response.data as Promise<T>
  }

  // 取消教室预约
  if (url === '/campus/classrooms/cancel' || url === '/api/campus/classrooms/cancel') {
    const response = await mockAPI.campus.cancelClassroomBooking(data?.bookingId) as any
    return response.data as Promise<T>
  }

  // 考试安排
  if (url === '/campus/exams' || url === '/api/campus/exams') {
    return mockAPI.campus.exams() as Promise<T>
  }

  // 校车时刻
  if (url === '/campus/bus' || url === '/api/campus/bus') {
    return mockAPI.campus.busSchedule() as Promise<T>
  }

  // 校园卡余额
  if (url === '/campus/card/balance' || url === '/api/campus/card/balance') {
    return mockAPI.campus.cardBalance() as Promise<T>
  }

  // 校园卡消费记录
  if (url === '/campus/card/transactions' || url === '/api/campus/card/transactions') {
    return mockAPI.campus.cardTransactions() as Promise<T>
  }

  // 校园地图数据
  if (url === '/campus/map/data' || url === '/api/campus/map/data') {
    const response = await mockAPI.campus.mapData() as any
    return response.data as Promise<T>
  }

  // 如果没有匹配的mock，抛出错误
  throw new Error(`Mock API not found: ${method} ${url}`)
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
  // 开发环境启用Mock
  if (isMockEnabled) {
    return handleMockRequest<T>('GET', url, undefined, config)
  }
  return service.get(url, config)
}

export function post<T = any>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<T> {
  if (isMockEnabled) {
    return handleMockRequest<T>('POST', url, data, config)
  }
  return service.post(url, data, config)
}

export function put<T = any>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<T> {
  if (isMockEnabled) {
    return handleMockRequest<T>('PUT', url, data, config)
  }
  return service.put(url, data, config)
}

export function del<T = any>(url: string, config?: EnhancedRequestConfig): Promise<T> {
  if (isMockEnabled) {
    return handleMockRequest<T>('DELETE', url, undefined, config)
  }
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
