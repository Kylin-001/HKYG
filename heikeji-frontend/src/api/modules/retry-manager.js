/**
 * 重试管理器模块
 * 负责管理API请求的自动重试功能
 */

import axios from 'axios'
import logger from '../../utils/logger'

export function createRetryManager() {
  const defaultConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 基础延迟时间（毫秒）
    maxDelay: 5000, // 最大延迟时间（毫秒）
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  }

  function calculateDelay(attempt, baseDelay, maxDelay) {
    // 指数退避算法，但不超过最大延迟
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)

    // 添加随机抖动，避免同时重试
    const jitter = Math.random() * 0.1 * delay
    return delay + jitter
  }

  function shouldRetry(error, retryConfig) {
    // 如果已经重试过，不再重试
    if (error.config && error.config._retryCount !== undefined) {
      return false
    }

    const config = { ...defaultConfig, ...retryConfig }

    // 检查重试次数
    const retryCount = error.config?._retryCount || 0
    if (retryCount >= config.maxRetries) {
      return false
    }

    // 检查错误类型
    if (!error.response) {
      // 网络错误，可以重试
      return true
    }

    const { status } = error.response
    return config.retryableStatuses.includes(status)
  }

  async function retry(config, retryConfig = {}) {
    const configWithRetry = {
      ...config,
      _retryCount: config._retryCount || 0,
    }

    const finalConfig = { ...defaultConfig, ...retryConfig }
    const currentAttempt = configWithRetry._retryCount + 1

    // 计算延迟时间
    const delay = calculateDelay(currentAttempt, finalConfig.baseDelay, finalConfig.maxDelay)

    logger.info(`🔄 请求重试第${currentAttempt}次: ${config.url}，延迟${Math.round(delay)}ms`)

    // 等待延迟
    await new Promise(resolve => setTimeout(resolve, delay))

    try {
      // 发起重试请求
      const response = await axios(configWithRetry)
      return response
    } catch (retryError) {
      // 如果需要继续重试，递归调用
      if (shouldRetry(retryError, finalConfig)) {
        retryError.config._retryCount = currentAttempt
        return retry(retryError.config, finalConfig)
      } else {
        throw retryError
      }
    }
  }

  function isRetryableError(error) {
    return shouldRetry(error)
  }

  function getRetryConfig(config = {}) {
    return { ...defaultConfig, ...config }
  }

  return {
    retry,
    isRetryableError,
    getRetryConfig,
    defaultConfig,
  }
}
