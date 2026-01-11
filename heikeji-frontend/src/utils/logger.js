/**
 * 集中化日志记录工具
 * 用于统一处理应用中的日志输出，支持不同的日志级别
 */

// 日志级别枚举
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

// 当前日志级别
let currentLogLevel = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO

/**
 * 设置日志级别
 * @param {number} level - 日志级别
 */
export function setLogLevel(level) {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level
  }
}

/**
 * 输出日志
 * @param {string} level - 日志级别
 * @param {...any} args - 日志参数
 */
function log(level, ...args) {
  if (typeof level !== 'string') {
    // 如果第一个参数不是级别名，将参数前移
    args.unshift(level)
    level = 'INFO'
  }

  const levelUpper = level.toUpperCase()
  if (LOG_LEVELS[levelUpper] === undefined) {
    console.error(`无效的日志级别: ${level}`)
    return
  }

  // 检查是否应该输出该级别的日志
  if (LOG_LEVELS[levelUpper] <= currentLogLevel) {
    const logMethod =
      levelUpper === 'ERROR'
        ? 'error'
        : levelUpper === 'WARN'
          ? 'warn'
          : levelUpper === 'DEBUG'
            ? 'debug'
            : 'log'

    // 添加时间戳前缀
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${levelUpper}]`

    console[logMethod](prefix, ...args)
  }
}

/**
 * 输出错误日志
 * @param {...any} args - 日志参数
 */
export function error(...args) {
  log('ERROR', ...args)
}

/**
 * 输出警告日志
 * @param {...any} args - 日志参数
 */
export function warn(...args) {
  log('WARN', ...args)
}

/**
 * 输出信息日志
 * @param {...any} args - 日志参数
 */
export function info(...args) {
  log('INFO', ...args)
}

/**
 * 输出调试日志
 * @param {...any} args - 日志参数
 */
export function debug(...args) {
  log('DEBUG', ...args)
}

/**
 * 输出HTTP请求日志
 * @param {Object} config - 请求配置
 */
export function logRequest(config) {
  if (!config) return

  const { method = 'GET', url, data } = config
  const maskedData = data ? '[DATA]' : ''
  debug('HTTP请求:', method.toUpperCase(), url, maskedData)
}

/**
 * 输出HTTP响应日志
 * @param {Object} response - 响应对象
 */
export function logResponse(response) {
  if (!response) return

  const { status, config } = response
  const method = config?.method?.toUpperCase() || 'GET'
  const url = config?.url || ''

  if (status >= 200 && status < 300) {
    debug('HTTP响应:', method, url, status)
  } else if (status >= 400 && status < 500) {
    warn('HTTP响应:', method, url, status)
  } else if (status >= 500) {
    error('HTTP响应:', method, url, status)
  }
}

/**
 * 输出API响应时间日志
 * @param {string} url - 请求URL
 * @param {number} duration - 响应时间（毫秒）
 * @param {number} status - 响应状态码
 */
export function logApiResponseTime(url, duration, status) {
  if (!url) return

  debug('API响应时间:', {
    url,
    duration: `${duration.toFixed(2)}ms`,
    status,
    timestamp: new Date().toISOString(),
  })
}

/**
 * 输出错误日志（用于API错误）
 * @param {Error} err - 错误对象
 * @param {Object} context - 上下文信息
 */
export function logApiError(err, context = {}) {
  if (!err) return

  const { message, stack } = err
  const { url, method, statusCode, requestId } = context

  error('API错误:', {
    message,
    url,
    method,
    statusCode,
    requestId,
    stack,
    timestamp: new Date().toISOString(),
  })
}

export default {
  setLogLevel,
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  logApiError,
  logApiResponseTime,
}
