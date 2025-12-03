import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import logger from './logger'

// 错误日志记录器
class ErrorLogger {
  constructor() {
    this.errorCount = 0
    this.maxErrors = 10 // 限制错误日志数量
    this.errors = []
  }

  logError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message || String(error),
      stack: error.stack,
      context,
    }

    this.errors.unshift(errorInfo)
    this.errors = this.errors.slice(0, this.maxErrors)
    this.errorCount++

    // 使用logger记录错误
    logger.logApiError(error, context)

    // 生产环境可以上报到错误监控系统
    if (process.env.NODE_ENV === 'production') {
      this.reportToMonitoring(errorInfo)
    }

    return errorInfo
  }

  reportToMonitoring(errorInfo) {
    // 这里可以接入Sentry等错误监控服务
    logger.warn('错误上报:', errorInfo)
    // 实际项目中应该调用监控服务的API
  }

  getErrorSummary() {
    return {
      count: this.errorCount,
      recentErrors: this.errors.slice(0, 5),
    }
  }
}

const errorLogger = new ErrorLogger()

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api', // 优先使用环境变量，降级到固定路径
  timeout: 15000, // 默认请求超时时间
})

// 请求缓存对象
const requestCache = new Map()
// 正在进行的请求
const pendingRequests = new Map()

// 生成请求唯一标识
function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 取消重复请求
function cancelPendingRequest(config) {
  const requestKey = generateReqKey(config)
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey)
    cancelToken.cancel(`取消重复请求: ${requestKey}`)
    pendingRequests.delete(requestKey)
  }
}

// 添加到待处理请求
function addPendingRequest(config) {
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

  if (retryConfig._retryCount >= 3) {
    // 重试次数过多，不再重试
    const error = new Error('请求失败次数过多，请稍后再试')
    error.code = 'MAX_RETRY_EXCEEDED'
    return Promise.reject(error)
  }

  retryConfig._retryCount++

  // 使用指数退避策略
  const delay = Math.min(1000 * Math.pow(2, retryConfig._retryCount - 1), 5000)

  return new Promise(resolve => {
    logger.info(`请求重试第${retryConfig._retryCount}次: ${config.url}`)
    setTimeout(() => {
      resolve(service(retryConfig))
    }, delay)
  })
}

// 根据请求类型动态设置超时时间
function setDynamicTimeout(config) {
  // 上传文件等操作设置更长的超时时间
  if (
    config.url.includes('/upload') ||
    (config.method === 'post' && config.data instanceof FormData)
  ) {
    config.timeout = 60000 // 60秒
  } else if (config.url.includes('/download')) {
    config.timeout = 30000 // 30秒
  }
  // 其他请求保持默认超时时间
}

// 检查是否需要缓存
function shouldCache(config) {
  // 只有GET请求才缓存，并且没有明确设置不缓存
  return config.method === 'get' && config.cache !== false
}

// 获取缓存的数据
function getCachedResponse(config) {
  const cacheKey = generateReqKey(config)
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey)
    // 检查缓存是否过期
    if (Date.now() - cached.timestamp < (config.cacheTime || 5 * 60 * 1000)) {
      // 默认缓存5分钟
      logger.debug('使用缓存响应:', config.url)
      return cached.data
    } else {
      // 缓存过期，删除缓存
      requestCache.delete(cacheKey)
    }
  }
  return null
}

// 缓存响应数据
function cacheResponse(config, response) {
  if (shouldCache(config)) {
    const cacheKey = generateReqKey(config)
    requestCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    })
  }
}

// request拦截器
service.interceptors.request.use(
  config => {
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

    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
    }

    return config
  },
  error => {
    logger.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 防抖动的消息提示，避免频繁弹窗
const lastMessage = {}
function debouncedMessage(options, delay = 1000) {
  const message = typeof options === 'string' ? options : options.message
  const now = Date.now()

  // 如果相同的消息在短时间内多次触发，只显示一次
  if (!lastMessage[message] || now - lastMessage[message] > delay) {
    lastMessage[message] = now
    Message(options)
  }
}

// 错误类型映射
const errorTypeMap = {
  400: { type: 'warning', title: '参数错误' },
  401: { type: 'warning', title: '未授权' },
  403: { type: 'warning', title: '权限不足' },
  404: { type: 'info', title: '资源不存在' },
  500: { type: 'error', title: '服务器错误' },
  502: { type: 'error', title: '网关错误' },
  503: { type: 'error', title: '服务不可用' },
  504: { type: 'error', title: '网关超时' },
}

// respone拦截器
service.interceptors.response.use(
  response => {
    // 从待处理请求中移除
    removePendingRequest(response.config)

    // 缓存响应
    cacheResponse(response.config, response)

    // code为非200是抛错 可结合自己业务进行修改
    const res = response.data
    if (res.code !== 200) {
      const errorMessage = res.message || '请求失败'

      // 记录错误日志
      const context = {
        url: response.config.url,
        method: response.config.method,
        statusCode: res.code,
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
    // 从待处理请求中移除
    if (error.config) {
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
    if (
      error.config &&
      !error.config._isRetryRequest &&
      (error.message.includes('timeout') || error.message.includes('Network Error'))
    ) {
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

export default service
