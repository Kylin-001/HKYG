import axios from 'axios'
import {
  ElMessage as Message,
  ElMessageBox as MessageBox,
  ElNotification as Notification,
} from 'element-plus'
import store from '../store'
import { getToken } from '@/utils/auth'
import logger from './logger'
// 增强的API拦截器功能将直接在文件中实现，无需导入TypeScript模块

// 配置选项接口
const DEFAULT_CONFIG = {
  // 错误日志配置
  errorLog: {
    maxErrors: 10,
    reportToMonitoring: process.env.NODE_ENV === 'production',
  },
  // 性能监控配置
  performance: {
    enabled: true,
    maxDataPoints: 100,
    slowRequestThreshold: 2000, // 慢请求阈值（毫秒）
  },
  // 缓存配置
  cache: {
    enabled: true,
    defaultCacheTime: 5 * 60 * 1000, // 默认缓存时间（5分钟）
  },
  // 重试配置
  retry: {
    enabled: true,
    maxRetries: 3,
    retryDelay: retryCount => Math.min(1000 * Math.pow(2, retryCount - 1), 5000),
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['Network Error', 'timeout'],
  },
  // 重复请求配置
  duplicateRequest: {
    enabled: true,
    cancelMessage: '取消重复请求',
  },
  // 动态超时配置
  timeout: {
    default: 15000,
    upload: 60000,
    download: 30000,
  },
}

// 错误日志记录器
class ErrorLogger {
  constructor(config) {
    this.config = {
      ...DEFAULT_CONFIG.errorLog,
      ...config,
    }
    this.errorCount = 0
    this.errors = []
  }

  logError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message || String(error),
      stack: error.stack,
      context,
      errorType: this.getErrorType(error),
    }

    this.errors.unshift(errorInfo)
    this.errors = this.errors.slice(0, this.config.maxErrors)
    this.errorCount++

    // 使用logger记录错误
    logger.logApiError(error, context)

    // 生产环境可以上报到错误监控系统
    if (this.config.reportToMonitoring) {
      this.reportToMonitoring(errorInfo)
    }

    return errorInfo
  }

  getErrorType(error) {
    if (error.code === 'REQUEST_CANCELLED') {
      return 'canceled'
    }
    if (error.code === 'MAX_RETRY_EXCEEDED') {
      return 'maxRetryExceeded'
    }
    if (error.response) {
      const { status } = error.response
      if (status >= 400 && status < 500) {
        return 'clientError'
      }
      if (status >= 500) {
        return 'serverError'
      }
    }
    if (error.message && error.message.includes('Network Error')) {
      return 'networkError'
    }
    if (error.message && error.message.includes('timeout')) {
      return 'timeoutError'
    }
    return 'unknownError'
  }

  reportToMonitoring(errorInfo) {
    // 这里可以接入Sentry等错误监控服务
    logger.warn('错误上报:', errorInfo)
    // 实际项目中应该调用监控服务的API
  }

  getErrorSummary() {
    const errorTypes = this.errors.reduce((acc, error) => {
      acc[error.errorType] = (acc[error.errorType] || 0) + 1
      return acc
    }, {})

    return {
      count: this.errorCount,
      recentErrors: this.errors.slice(0, 5),
      errorTypes,
    }
  }
}

const errorLogger = new ErrorLogger()

// 性能监控类
class PerformanceMonitor {
  constructor(config) {
    this.config = {
      ...DEFAULT_CONFIG.performance,
      ...config,
    }
    this.performanceData = []
  }

  recordRequest(config) {
    if (config.monitorPerformance !== false && this.config.enabled) {
      // 默认启用性能监控，除非明确关闭
      config._startTime = performance.now()
      config._performanceId = Math.random().toString(36).substr(2, 9)
    }
  }

  recordResponse(config, response) {
    if (config._startTime && this.config.enabled) {
      const endTime = performance.now()
      const duration = endTime - config._startTime

      const performanceData = {
        id: config._performanceId,
        startTime: config._startTime,
        endTime,
        duration,
        url: config.url || '',
        method: config.method || 'GET',
        status: response.status,
        isSlow: duration > this.config.slowRequestThreshold,
        timestamp: new Date().toISOString(),
      }

      // 添加到性能数据数组
      this.performanceData.unshift(performanceData)
      this.performanceData = this.performanceData.slice(0, this.config.maxDataPoints)

      // 记录API响应时间
      logger.logApiResponseTime(config.url || '', duration, response.status)

      // 如果响应时间过长，记录警告
      if (performanceData.isSlow) {
        logger.warn(`API响应时间过长: ${config.url || ''} - ${duration.toFixed(2)}ms`, {
          method: config.method,
          status: response.status,
          duration: duration.toFixed(2),
          performanceId: config._performanceId,
        })
      }
    }
  }

  recordError(config, error) {
    if (config._startTime && this.config.enabled) {
      const endTime = performance.now()
      const duration = endTime - config._startTime

      logger.error(`API请求失败: ${config.url || ''} - ${duration.toFixed(2)}ms`, {
        method: config.method,
        status: error.response?.status,
        error: error.message,
        duration: duration.toFixed(2),
        performanceId: config._performanceId,
      })
    }
  }

  getPerformanceSummary() {
    if (this.performanceData.length === 0) {
      return {
        average: 0,
        max: 0,
        min: 0,
        count: 0,
        slowCount: 0,
        slowRate: 0,
        successRate: 0,
      }
    }

    const durations = this.performanceData.map(data => data.duration)
    const slowCount = this.performanceData.filter(data => data.isSlow).length
    const successCount = this.performanceData.filter(
      data => data.status >= 200 && data.status < 300
    ).length

    return {
      average: durations.reduce((sum, dur) => sum + dur, 0) / durations.length,
      max: Math.max(...durations),
      min: Math.min(...durations),
      count: durations.length,
      slowCount,
      slowRate: (slowCount / durations.length) * 100,
      successRate: (successCount / durations.length) * 100,
      recentSlowRequests: this.performanceData.filter(data => data.isSlow).slice(0, 5),
    }
  }
}

// 创建性能监控实例
const performanceMonitor = new PerformanceMonitor()

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api', // 优先使用环境变量，降级到固定路径
  timeout: DEFAULT_CONFIG.timeout.default, // 默认请求超时时间
})

// 请求缓存对象
const requestCache = new Map()
// 正在进行的请求
const pendingRequests = new Map()

// 生成请求唯一标识
function generateReqKey(config) {
  const { method, url, params, data } = config
  // 对于FormData，只使用URL和方法作为key，因为数据可能很大
  if (data instanceof FormData) {
    return [method, url].join('&')
  }
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 取消重复请求
function cancelPendingRequest(config) {
  if (!DEFAULT_CONFIG.duplicateRequest.enabled) {
    return
  }

  const requestKey = generateReqKey(config)
  if (pendingRequests.has(requestKey)) {
    const { cancel } = pendingRequests.get(requestKey)
    const cancelMessage = `${DEFAULT_CONFIG.duplicateRequest.cancelMessage}: ${requestKey}`
    cancel(cancelMessage)
    pendingRequests.delete(requestKey)
    logger.debug(cancelMessage)
  }
}

// 添加到待处理请求
function addPendingRequest(config) {
  if (!DEFAULT_CONFIG.duplicateRequest.enabled) {
    return
  }

  const requestKey = generateReqKey(config)
  // 为配置添加取消令牌
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      pendingRequests.set(requestKey, { cancel })
    })
}

// 从待处理请求中移除
function removePendingRequest(config) {
  if (!DEFAULT_CONFIG.duplicateRequest.enabled) {
    return
  }

  const requestKey = generateReqKey(config)
  pendingRequests.delete(requestKey)
}

// 错误重试函数
function retryRequest(config) {
  const retryConfig = {
    ...config,
    _retryCount: config._retryCount || 0,
    _isRetryRequest: true,
  }

  // 检查是否启用重试
  if (!DEFAULT_CONFIG.retry.enabled) {
    const error = new Error('请求失败')
    error.code = 'RETRY_DISABLED'
    return Promise.reject(error)
  }

  // 检查重试次数是否超过限制
  if (retryConfig._retryCount >= DEFAULT_CONFIG.retry.maxRetries) {
    const error = new Error('请求失败次数过多，请稍后再试')
    error.code = 'MAX_RETRY_EXCEEDED'
    return Promise.reject(error)
  }

  retryConfig._retryCount++

  // 使用配置的重试延迟策略
  const delay = DEFAULT_CONFIG.retry.retryDelay(retryConfig._retryCount)

  return new Promise(resolve => {
    logger.info(`请求重试第${retryConfig._retryCount}次: ${config.url}，延迟${delay}ms`)
    setTimeout(() => {
      resolve(service(retryConfig))
    }, delay)
  })
}

// 根据请求类型动态设置超时时间
function setDynamicTimeout(config) {
  // 如果配置了自定义超时时间，优先使用
  if (config.timeout) {
    return
  }

  // 上传文件等操作设置更长的超时时间
  if (
    config.url.includes('/upload') ||
    (config.method === 'post' && config.data instanceof FormData)
  ) {
    config.timeout = DEFAULT_CONFIG.timeout.upload
  } else if (config.url.includes('/download')) {
    config.timeout = DEFAULT_CONFIG.timeout.download
  } else {
    config.timeout = DEFAULT_CONFIG.timeout.default
  }
}

// 检查是否需要缓存
function shouldCache(config) {
  // 只有启用缓存，且是GET请求，并且没有明确设置不缓存，才进行缓存
  return DEFAULT_CONFIG.cache.enabled && config.method === 'get' && config.cache !== false
}

// 获取缓存的数据
function getCachedResponse(config) {
  if (!shouldCache(config)) {
    return null
  }

  const cacheKey = generateReqKey(config)
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey)
    const cacheTime = config.cacheTime || DEFAULT_CONFIG.cache.defaultCacheTime

    // 检查缓存是否过期
    if (Date.now() - cached.timestamp < cacheTime) {
      logger.debug('使用缓存响应:', config.url)
      // 复制缓存数据，避免修改原始缓存
      return JSON.parse(JSON.stringify(cached.data))
    } else {
      // 缓存过期，删除缓存
      requestCache.delete(cacheKey)
      logger.debug('缓存已过期:', config.url)
    }
  }
  return null
}

// 缓存响应数据
function cacheResponse(config, response) {
  if (!shouldCache(config)) {
    return
  }

  const cacheKey = generateReqKey(config)
  requestCache.set(cacheKey, {
    data: response,
    timestamp: Date.now(),
    cacheTime: config.cacheTime || DEFAULT_CONFIG.cache.defaultCacheTime,
  })
  logger.debug('缓存响应:', config.url)
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 性能监控：记录请求开始时间
    performanceMonitor.recordRequest(config)

    // 性能优化：优先尝试使用缓存
    const cachedResponse = getCachedResponse(config)
    if (cachedResponse) {
      return Promise.resolve(cachedResponse)
    }

    // 取消重复请求
    cancelPendingRequest(config)

    // 添加到待处理请求
    addPendingRequest(config)

    // 动态设置超时时间
    setDynamicTimeout(config)

    // 添加请求日志
    logger.logRequest(config)

    // 添加认证令牌
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
    }

    // 添加请求ID，用于追踪
    config.headers['X-Request-ID'] = Math.random().toString(36).substr(2, 9)

    return config
  },
  error => {
    logger.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 防抖动的消息提示，避免频繁弹窗
const messageCache = new Map()
function debouncedMessage(options, delay = 1000) {
  const message = typeof options === 'string' ? options : options.message
  const now = Date.now()

  // 如果相同的消息在短时间内多次触发，只显示一次
  if (!messageCache.has(message) || now - messageCache.get(message) > delay) {
    messageCache.set(message, now)
    Message(options)
  }
}

// 错误类型映射
const errorTypeMap = {
  400: { type: 'warning', title: '参数错误' },
  401: { type: 'warning', title: '未授权' },
  403: { type: 'warning', title: '权限不足' },
  404: { type: 'info', title: '资源不存在' },
  429: { type: 'warning', title: '请求过于频繁' },
  500: { type: 'error', title: '服务器错误' },
  502: { type: 'error', title: '网关错误' },
  503: { type: 'error', title: '服务不可用' },
  504: { type: 'error', title: '网关超时' },
}

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 性能监控：记录请求结束时间，计算性能数据
    performanceMonitor.recordResponse(response.config, response)

    // 从待处理请求中移除
    removePendingRequest(response.config)

    // 缓存响应
    cacheResponse(response.config, response)

    // 添加响应日志
    logger.logResponse(response)

    // code为非200是抛错 可结合自己业务进行修改
    const res = response.data
    if (res.code !== 200) {
      const errorMessage = res.message || '请求失败'

      // 记录错误日志
      const context = {
        url: response.config.url,
        method: response.config.method,
        statusCode: res.code,
        requestId: response.headers['x-request-id'] || response.config.headers['X-Request-ID'],
      }
      errorLogger.logError(new Error(errorMessage), context)

      // 根据错误级别显示不同的提示
      if (res.code === 401) {
        // 确保只弹出一个确认框
        if (!window.logoutConfirming) {
          window.logoutConfirming = true
          MessageBox.confirm('您的登录已过期，是否重新登录？', '登录过期', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false,
            closeOnPressEscape: false,
          })
            .then(() => {
              window.logoutConfirming = false
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
            .catch(() => {
              window.logoutConfirming = false
            })
        }
      } else if (res.code >= 500) {
        // 服务端错误使用通知组件显示详细信息
        Notification({
          title: '服务器错误',
          message: errorMessage,
          type: 'error',
          duration: 5000,
          showClose: true,
        })
      } else {
        // 客户端错误使用消息提示
        debouncedMessage({
          message: errorMessage,
          type: 'error',
          duration: 3000,
        })
      }

      // 创建标准错误对象
      const error = new Error(errorMessage)
      error.code = res.code
      error.data = res
      error.requestId = context.requestId

      return Promise.reject(error)
    } else {
      // 对于成功响应中的警告信息，也可以显示
      if (res.warning) {
        debouncedMessage({
          message: res.warning,
          type: 'warning',
          duration: 3000,
        })
      }
      return response.data
    }
  },
  error => {
    // 性能监控：记录请求失败时的性能数据
    if (error.config) {
      performanceMonitor.recordError(error.config, error)
      // 从待处理请求中移除
      removePendingRequest(error.config)
    }

    // 处理取消请求的错误
    if (axios.isCancel(error)) {
      logger.info('请求已取消:', error.message)
      const cancelError = new Error('请求已取消')
      cancelError.code = 'REQUEST_CANCELLED'
      return Promise.reject(cancelError)
    }

    // 网络错误重试
    const shouldRetry =
      error.config &&
      !error.config._isRetryRequest &&
      DEFAULT_CONFIG.retry.enabled &&
      // 根据状态码重试
      ((error.response &&
        DEFAULT_CONFIG.retry.retryableStatusCodes.includes(error.response.status)) ||
        // 根据错误消息重试
        (error.message &&
          DEFAULT_CONFIG.retry.retryableErrors.some(err => error.message.includes(err))))

    if (shouldRetry) {
      // 显示重试提示
      debouncedMessage({
        message: '网络不稳定，正在尝试重试...',
        type: 'warning',
        duration: 2000,
      })
      return retryRequest(error.config)
    }

    // 统一错误消息处理
    let errorMessage = '请求失败'
    let errorType = 'error'
    const context = {
      url: error.config?.url,
      method: error.config?.method,
      requestId: error.config?.headers['X-Request-ID'],
    }

    if (error.response) {
      const { status } = error.response
      context.status = status

      // 获取错误类型配置
      const typeConfig = errorTypeMap[status] || { type: 'error', title: '请求失败' }
      errorType = typeConfig.type

      switch (status) {
        case 400:
          errorMessage = error.response.data?.message || '请求参数错误'
          // 详细显示参数验证错误
          if (error.response.data?.errors) {
            errorMessage += `<br/>${Object.entries(error.response.data.errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join('<br/>')}`
          }
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 确保只弹出一个确认框
          if (!window.logoutConfirming) {
            window.logoutConfirming = true
            MessageBox.confirm('您的登录已过期，是否重新登录？', '登录过期', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                window.logoutConfirming = false
                store.dispatch('FedLogOut').then(() => {
                  location.reload()
                })
              })
              .catch(() => {
                window.logoutConfirming = false
              })
          }
          break
        case 403:
          errorMessage = '权限不足，无法访问该资源'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage =
            process.env.NODE_ENV === 'development'
              ? error.response.data?.message || '服务器内部错误'
              : '服务器繁忙，请稍后重试'
          break
        case 502:
        case 503:
        case 504:
          errorMessage = `服务暂不可用，请稍后再试（${status}）`
          break
        default:
          errorMessage = error.response.data?.message || `请求失败(${status})`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
      errorType = 'warning'
    } else if (error.code === 'MAX_RETRY_EXCEEDED') {
      errorMessage = '请求多次失败，请检查网络连接或稍后重试'
      errorType = 'warning'
    }

    // 记录错误日志
    errorLogger.logError(error, context)

    // 根据错误类型选择不同的显示方式
    if (errorType === 'error') {
      Notification({
        title: '错误',
        message: errorMessage,
        type: 'error',
        duration: 5000,
      })
    } else {
      debouncedMessage({
        message: errorMessage,
        type: errorType,
        duration: 3000,
        dangerouslyUseHTMLString: errorMessage.includes('<br/>'),
      })
    }

    return Promise.reject(error)
  }
)

// 导出清除缓存的方法
export function clearRequestCache() {
  requestCache.clear()
  return true
}

// 导出清除所有请求的方法
export function clearPendingRequests() {
  pendingRequests.forEach(request => {
    request.cancel('所有请求已取消')
  })
  pendingRequests.clear()
  return true
}

// 组件卸载时清除相关请求的辅助函数
export function useRequestCleanup() {
  return function cleanup() {
    // 这里可以根据组件ID清除相关请求
    // 实际项目中可以扩展为更细粒度的控制
    clearPendingRequests()
    return true
  }
}

// 导出错误日志相关方法
export function getErrorSummary() {
  return errorLogger.getErrorSummary()
}

// 格式化错误信息，方便在UI中展示
export function formatError(error) {
  if (!error) return ''

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.message) {
    return error.message
  }

  return String(error)
}

// 处理表单提交错误
export function handleFormError(error, form) {
  if (!error || !error.response?.data?.errors) {
    return false
  }

  // 如果表单提供了验证方法，设置验证错误
  if (form && form.$setError) {
    const { errors } = error.response.data
    Object.keys(errors).forEach(field => {
      form.$setError(field, errors[field])
    })
    return true
  }

  return false
}

// 性能监控相关导出
export function getPerformanceSummary() {
  return performanceMonitor.getPerformanceSummary()
}

export function clearPerformanceData() {
  performanceMonitor.performanceData = []
  return true
}

export default service
