/**
 * 错误日志记录器模块
 * 负责记录和管理API请求错误
 */

import logger from '../../utils/logger'

export function createErrorLogger() {
  let errorCount = 0
  const maxErrors = 10
  const errors = []

  function log(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message || String(error),
      stack: error.stack,
      context,
      id: errorCount + 1,
    }

    errors.unshift(errorInfo)
    errors.splice(maxErrors) // 保持最多maxErrors条错误记录
    errorCount++

    // 开发环境输出详细错误信息
    if (process.env.NODE_ENV === 'development') {
      logger.error('❌ API错误记录:', errorInfo)
    }

    // 生产环境可以上报到监控系统
    if (process.env.NODE_ENV === 'production') {
      reportToMonitoring(errorInfo)
    }

    return errorInfo
  }

  function reportToMonitoring(errorInfo) {
    // 这里可以接入Sentry等错误监控服务
    logger.warn('错误上报到监控系统:', errorInfo)
  }

  function getSummary() {
    return {
      count: errorCount,
      recentErrors: errors.slice(0, 5),
    }
  }

  function clear() {
    errors.length = 0
    errorCount = 0
  }

  return {
    log,
    getSummary,
    clear,
  }
}
