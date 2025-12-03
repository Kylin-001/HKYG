/**
 * HTTP请求工具模块 - 重构版本
 * 负责处理所有HTTP请求，集成错误处理、缓存、重试等功能
 */

import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import logger from './logger'

// 导入功能模块
import { createErrorLogger } from '../api/modules/error-logger'
import { createRequestCache } from '../api/modules/request-cache'
import { createRequestDeduplicator } from '../api/modules/request-deduplicator'
import { createRetryManager } from '../api/modules/retry-manager'
import { createTimeoutManager } from '../api/modules/timeout-manager'

// 创建错误日志记录器
const errorLogger = createErrorLogger()

// 创建请求缓存管理
const requestCache = createRequestCache()

// 创建请求去重管理
const requestDeduplicator = createRequestDeduplicator()

// 创建重试管理器
const retryManager = createRetryManager()

// 创建超时管理器
const timeoutManager = createTimeoutManager()

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 15000,
})

// 配置请求拦截器
service.interceptors.request.use(
  config => {
    // 1. 检查缓存
    const cachedResponse = requestCache.get(config)
    if (cachedResponse) {
      logger.debug('🔄 使用缓存响应:', config.url)
      return Promise.resolve(cachedResponse)
    }

    // 2. 取消重复请求
    requestDeduplicator.cancelDuplicate(config)

    // 3. 设置动态超时
    timeoutManager.setTimeout(config)

    // 4. 添加认证token
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }

    // 5. 添加请求标识
    requestDeduplicator.addPending(config)

    // 开发环境记录请求信息
    if (process.env.NODE_ENV === 'development') {
      logger.info('📡 API请求:', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  error => {
    logger.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 配置响应拦截器
service.interceptors.response.use(
  response => {
    // 1. 移除请求标识
    requestDeduplicator.removePending(response.config)

    // 2. 缓存响应（如果需要）
    requestCache.set(response.config, response)

    // 3. 开发环境记录响应信息
    if (process.env.NODE_ENV === 'development') {
      logger.info('📡 API响应:', response.status, response.config.url)
    }

    return response
  },
  async error => {
    // 1. 移除请求标识
    if (error.config) {
      requestDeduplicator.removePending(error.config)
    }

    // 2. 记录错误
    const errorInfo = errorLogger.log(error, {
      config: error.config,
      response: error.response,
    })

    // 2. 处理取消请求
    if (axios.isCancel(error)) {
      logger.info('🚫 请求已取消:', error.message)
      return Promise.reject(error)
    }

    // 4. 处理网络错误
    if (!error.response) {
      Message.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }

    // 5. 处理HTTP错误状态码
    const { status, data } = error.response
    const errorMessage = data?.message || `请求失败 (${status})`

    switch (status) {
      case 401:
        // 未授权，清除token并跳转登录页
        if (!error.config._isRetryRequest) {
          await handleUnauthorized(error)
        }
        break

      case 403:
        Message.warning('没有权限访问该资源')
        break

      case 404:
        Message.warning('请求的资源不存在')
        break

      case 500:
        Message.error('服务器内部错误')
        break

      default:
        Message.error(errorMessage)
    }

    // 6. 尝试重试（仅对特定错误类型）
    if (shouldRetry(error) && error.config) {
      try {
        const retryResponse = await retryManager.retry(error.config)
        return retryResponse
      } catch (retryError) {
        logger.error('❌ 重试失败:', retryError)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * 处理未授权错误
 */
async function handleUnauthorized(error) {
  try {
    await MessageBox.confirm('登录已过期，请重新登录', '提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 清除用户信息并跳转到登录页
    store.dispatch('user/logout')
    window.location.href = '/login'
  } catch (confirmError) {
    logger.info('用户取消重新登录')
  }
}

/**
 * 判断是否应该重试
 */
function shouldRetry(error) {
  if (error.config && error.config._retryCount !== undefined) {
    return false // 已经重试过的请求不再重试
  }

  // 只对特定错误进行重试
  const retryableStatuses = [408, 429, 500, 502, 503, 504]
  return (
    !error.response || // 网络错误
    retryableStatuses.includes(error.response.status) // 服务器错误
  )
}

/**
 * HTTP请求封装
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
export function request(config) {
  return service(config)
}

/**
 * GET请求封装
 * @param {string} url - 请求URL
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
export function get(url, config = {}) {
  return request({
    url,
    method: 'get',
    ...config,
  })
}

/**
 * POST请求封装
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
export function post(url, data = {}, config = {}) {
  return request({
    url,
    method: 'post',
    data,
    ...config,
  })
}

/**
 * PUT请求封装
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
export function put(url, data = {}, config = {}) {
  return request({
    url,
    method: 'put',
    data,
    ...config,
  })
}

/**
 * DELETE请求封装
 * @param {string} url - 请求URL
 * @param {Object} config - 请求配置
 * @returns {Promise} 请求结果
 */
export function del(url, config = {}) {
  return request({
    url,
    method: 'delete',
    ...config,
  })
}

/**
 * 文件上传封装
 * @param {string} url - 请求URL
 * @param {FormData} formData - 表单数据
 * @param {Function} onProgress - 进度回调
 * @returns {Promise} 请求结果
 */
export function upload(url, formData, onProgress) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  })
}

/**
 * 文件下载封装
 * @param {string} url - 请求URL
 * @param {string} filename - 文件名
 * @returns {Promise} 请求结果
 */
export function download(url, filename) {
  return request({
    url,
    method: 'get',
    responseType: 'blob',
  }).then(response => {
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    URL.revokeObjectURL(link.href)
  })
}

/**
 * 批量请求
 * @param {Array} requests - 请求配置数组
 * @returns {Promise} 所有请求结果
 */
export function batch(requests) {
  return Promise.all(requests.map(req => request(req)))
}

/**
 * 获取错误摘要
 */
export function getErrorSummary() {
  return errorLogger.getSummary()
}

/**
 * 清除缓存
 */
export function clearCache() {
  requestCache.clear()
}

/**
 * 取消所有待处理请求
 */
export function cancelAllRequests() {
  requestDeduplicator.cancelAll()
}

// 默认导出
export default service
