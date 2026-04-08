import type { App } from 'vue'
import type { ErrorType } from '@/components/global/ErrorFallback.vue'

/**
 * 错误类别枚举
 */
export enum ErrorCategory {
  /** 网络相关错误（断网、超时、DNS解析失败等） */
  NETWORK = 'network',
  /** HTTP 状态码错误（4xx, 5xx） */
  HTTP = 'http',
  /** 业务逻辑错误（后端返回的业务异常） */
  BUSINESS = 'business',
  /** 权限/认证错误（401, 403等） */
  AUTHENTICATION = 'authentication',
  /** 授权/权限不足错误 */
  AUTHORIZATION = 'authorization',
  /** 验证错误（表单验证、参数校验失败） */
  VALIDATION = 'validation',
  /** 资源未找到错误 */
  NOT_FOUND = 'not_found',
  /** 服务器内部错误 */
  SERVER = 'server',
  /** 超时错误 */
  TIMEOUT = 'timeout',
  /** 未知/其他错误 */
  UNKNOWN = 'unknown'
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  /** 信息级别 - 不影响使用 */
  INFO = 'info',
  /** 警告级别 - 部分功能受限 */
  WARNING = 'warning',
  /** 错误级别 - 当前操作失败 */
  ERROR = 'error',
  /** 致命级别 - 应用无法继续 */
  FATAL = 'fatal'
}

/**
 * 分类后的错误信息接口
 */
export interface ClassifiedError {
  /** 原始错误对象 */
  originalError: Error | unknown
  /** 错误类别 */
  category: ErrorCategory
  /** 错误严重级别 */
  severity: ErrorSeverity
  /** 用户友好的错误标题（已翻译） */
  userTitle: string
  /** 用户友好的错误消息（已翻译） */
  userMessage: string
  /** 技术细节（用于调试和日志） */
  technicalDetail: string
  /** HTTP状态码（如果是HTTP错误） */
  statusCode?: number
  /** 错误代码（业务错误码） */
  errorCode?: string
  /** 是否可重试 */
  retryable: boolean
  /** 建议的操作 */
  suggestedAction: 'retry' | 'refresh' | 'goBack' | 'goHome' | 'login' | 'contact' | 'none'
  /** 时间戳 */
  timestamp: number
  /** 额外的上下文信息 */
  context?: Record<string, unknown>
}

/**
 * HTTP错误映射配置
 */
interface HttpErrorMapping {
  statusCode: number
  category: ErrorCategory
  severity: ErrorSeverity
  defaultTitleKey: string
  defaultMessageKey: string
  retryable: boolean
  suggestedAction: ClassifiedError['suggestedAction']
}

/**
 * 预定义的HTTP错误映射
 */
const HTTP_ERROR_MAPPINGS: HttpErrorMapping[] = [
  {
    statusCode: 400,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.WARNING,
    defaultTitleKey: 'error.400',
    defaultMessageKey: 'error.badRequestTip',
    retryable: false,
    suggestedAction: 'goBack'
  },
  {
    statusCode: 401,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.401',
    defaultMessageKey: 'error.loginRequired',
    retryable: true,
    suggestedAction: 'login'
  },
  {
    statusCode: 403,
    category: ErrorCategory.AUTHORIZATION,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.403',
    defaultMessageKey: 'error.permissionDenied',
    retryable: false,
    suggestedAction: 'goHome'
  },
  {
    statusCode: 404,
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.WARNING,
    defaultTitleKey: 'error.404',
    defaultMessageKey: 'error.notFoundTip',
    retryable: false,
    suggestedAction: 'goHome'
  },
  {
    statusCode: 405,
    category: ErrorCategory.HTTP,
    severity: ErrorSeverity.WARNING,
    defaultTitleKey: 'error.405',
    defaultMessageKey: 'error.methodNotAllowed',
    retryable: false,
    suggestedAction: 'goBack'
  },
  {
    statusCode: 408,
    category: ErrorCategory.TIMEOUT,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.408',
    defaultMessageKey: 'error.timeoutError',
    retryable: true,
    suggestedAction: 'retry'
  },
  {
    statusCode: 422,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.WARNING,
    defaultTitleKey: 'error.422',
    defaultMessageKey: 'error.validationFailed',
    retryable: false,
    suggestedAction: 'goBack'
  },
  {
    statusCode: 429,
    category: ErrorCategory.HTTP,
    severity: ErrorSeverity.WARNING,
    defaultTitleKey: 'error.429',
    defaultMessageKey: 'error.tooManyRequests',
    retryable: true,
    suggestedAction: 'retry'
  },
  {
    statusCode: 500,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.500',
    defaultMessageKey: 'error.serverErrorTip',
    retryable: true,
    suggestedAction: 'retry'
  },
  {
    statusCode: 502,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.502',
    defaultMessageKey: 'error.badGateway',
    retryable: true,
    suggestedAction: 'retry'
  },
  {
    statusCode: 503,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.FATAL,
    defaultTitleKey: 'error.503',
    defaultMessageKey: 'error.serviceUnavailable',
    retryable: true,
    suggestedAction: 'refresh'
  },
  {
    statusCode: 504,
    category: ErrorCategory.TIMEOUT,
    severity: ErrorSeverity.ERROR,
    defaultTitleKey: 'error.504',
    defaultMessageKey: 'error.gatewayTimeout',
    retryable: true,
    suggestedAction: 'retry'
  }
]

/**
 * 带有HTTP响应信息的错误对象接口
 */
export interface ErrorResponse {
  response?: {
    status: number
    data: {
      code?: string
      message?: string
      [key: string]: unknown
    }
    headers?: Record<string, string>
  }
  request?: XMLHttpRequest
  message: string
  config?: {
    url?: string
    method?: string
    [key: string]: unknown
  }
}

/**
 * 判断是否为网络错误
 */
function isNetworkError(error: unknown): error is Error {
  if (error instanceof Error) {
    // 常见的网络错误消息
    const networkMessages = [
      'Network Error',
      'Failed to fetch',
      'Network request failed',
      'The Internet connection appears to be offline',
      '网络错误',
      '网络请求失败',
      'Failed to connect'
    ]
    return networkMessages.some(msg =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    )
  }
  return false
}

/**
 * 判断是否为超时错误
 */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    const timeoutMessages = [
      'timeout',
      'Timeout',
      '超时',
      'aborted',
      'cancelled'
    ]
    return timeoutMessages.some(msg =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    )
  }

  // 检查 Axios 错误对象的 code
  const axiosError = error as Partial<ErrorResponse>
  if (axiosError?.code === 'ECONNABORTED') return true

  return false
}

/**
 * 判断是否为HTTP响应错误
 */
function isHttpError(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as ErrorResponse).response !== undefined
  )
}

/**
 * 判断是否为业务错误（带有特定错误码）
 */
function isBusinessError(errorData: unknown): boolean {
  if (typeof errorData === 'object' && errorData !== null) {
    const data = errorData as Record<string, unknown>
    // 检查是否有业务错误码字段
    return 'code' in data || 'errorCode' in data || 'errCode' in data
  }
  return false
}

/**
 * 从HTTP状态码获取错误映射配置
 */
function getHttpErrorMapping(statusCode: number): HttpErrorMapping | undefined {
  return HTTP_ERROR_MAPPINGS.find(mapping => mapping.statusCode === statusCode)
}

/**
 * 将 ErrorType 转换为 ErrorCategory
 */
export function errorTypeToCategory(type: ErrorType | string): ErrorCategory {
  const mapping: Record<string, ErrorCategory> = {
    network: ErrorCategory.NETWORK,
    server: ErrorCategory.SERVER,
    permission: ErrorCategory.AUTHORIZATION,
    unauthorized: ErrorCategory.AUTHENTICATION,
    not_found: ErrorCategory.NOT_FOUND,
    business: ErrorCategory.BUSINESS,
    unknown: ErrorCategory.UNKNOWN,
    custom: ErrorCategory.UNKNOWN
  }
  return mapping[type] || ErrorCategory.UNKNOWN
}

/**
 * 将 ErrorCategory 转换为 ErrorType (用于UI组件)
 */
export function categoryToErrorType(category: ErrorCategory): ErrorType {
  const mapping: Record<ErrorCategory, ErrorType> = {
    [ErrorCategory.NETWORK]: 'network' as ErrorType,
    [ErrorCategory.HTTP]: 'server' as ErrorType,
    [ErrorCategory.BUSINESS]: 'business' as ErrorType,
    [ErrorCategory.AUTHENTICATION]: 'unauthorized' as ErrorType,
    [ErrorCategory.AUTHORIZATION]: 'permission' as ErrorType,
    [ErrorCategory.VALIDATION]: 'business' as ErrorType,
    [ErrorCategory.NOT_FOUND]: 'not_found' as ErrorType,
    [ErrorCategory.SERVER]: 'server' as ErrorType,
    [ErrorCategory.TIMEOUT]: 'network' as ErrorType,
    [ErrorCategory.UNKNOWN]: 'unknown' as ErrorType
  }
  return mapping[category] || ('unknown' as ErrorType)
}

/**
 * 核心错误分类函数
 *
 * @param error - 原始错误对象
 * @param context - 可选的额外上下文信息
 * @returns 分类后的错误信息
 *
 * @example
 * ```typescript
 * try {
 *   await api.getData()
 * } catch (error) {
 *   const classified = classifyError(error)
 *   console.log(classified.category) // ErrorCategory.NETWORK
 *   console.log(classified.userMessage) // 用户友好的错误消息
 * }
 * ```
 */
export function classifyError(
  error: unknown,
  context?: Record<string, unknown>
): ClassifiedError {
  const timestamp = Date.now()

  // 1. 处理网络错误
  if (isNetworkError(error)) {
    return {
      originalError: error,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.ERROR,
      userTitle: '', // 将由 i18n 处理
      userMessage: '',
      technicalDetail: `Network Error: ${(error as Error).message}`,
      retryable: true,
      suggestedAction: 'retry',
      timestamp,
      context
    }
  }

  // 2. 处理超时错误
  if (isTimeoutError(error)) {
    return {
      originalError: error,
      category: ErrorCategory.TIMEOUT,
      severity: ErrorSeverity.ERROR,
      userTitle: '',
      userMessage: '',
      technicalDetail: `Timeout Error: ${error instanceof Error ? error.message : String(error)}`,
      retryable: true,
      suggestedAction: 'retry',
      timestamp,
      context
    }
  }

  // 3. 处理HTTP响应错误
  if (isHttpError(error)) {
    const { status, data } = error.response!

    // 优先检查是否为业务错误
    if (isBusinessError(data)) {
      return {
        originalError: error,
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.WARNING,
        userTitle: '',
        userMessage: data.message || (data as Record<string, string>).msg || '',
        technicalDetail: `Business Error [${status}]: ${JSON.stringify(data)}`,
        statusCode: status,
        errorCode: (data as Record<string, string>).code ||
                   (data as Record<string, string>).errorCode ||
                   (data as Record<string, string>).errCode,
        retryable: false,
        suggestedAction: 'goBack',
        timestamp,
        context
      }
    }

    // 使用预定义的HTTP错误映射
    const mapping = getHttpErrorMapping(status)
    if (mapping) {
      return {
        originalError: error,
        category: mapping.category,
        severity: mapping.severity,
        userTitle: '',
        userMessage: '',
        technicalDetail: `HTTP Error [${status}]: ${data?.message || error.message}`,
        statusCode: status,
        retryable: mapping.retryable,
        suggestedAction: mapping.suggestedAction,
        timestamp,
        context
      }
    }

    // 未映射的HTTP状态码
    return {
      originalError: error,
      category: ErrorCategory.HTTP,
      severity: ErrorSeverity.ERROR,
      userTitle: '',
      userMessage: '',
      technicalDetail: `Unhandled HTTP Status [${status}]: ${JSON.stringify(data)}`,
      statusCode: status,
      retryable: status >= 500, // 5xx错误通常可重试
      suggestedAction: status >= 500 ? 'retry' : 'goBack',
      timestamp,
      context
    }
  }

  // 4. 处理普通Error对象
  if (error instanceof Error) {
    return {
      originalError: error,
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      userTitle: '',
      userMessage: '',
      technicalDetail: `${error.name}: ${error.message}\n${error.stack || ''}`,
      retryable: true,
      suggestedAction: 'retry',
      timestamp,
      context
    }
  }

  // 5. 处理其他类型的错误
  return {
    originalError: error,
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.ERROR,
    userTitle: '',
    userMessage: '',
    technicalDetail: `Unknown Error: ${String(error)}`,
    retryable: true,
    suggestedAction: 'retry',
    timestamp,
    context
  }
}

/**
 * 创建用户友好的错误对象（用于直接传递给组件）
 *
 * @param error - 原始错误
 * @param options - 可选配置项
 * @returns 格式化的错误信息，可直接用于 UI 组件
 */
export function createUserFriendlyError(
  error: unknown,
  options?: {
    customTitle?: string
    customMessage?: string
    context?: Record<string, unknown>
  }
): {
  type: ErrorType
  title: string
  message: string
  detail: string
  retryable: boolean
  suggestedAction: ClassifiedError['suggestedAction']
} {
  const classified = classifyError(error, options?.context)
  const type = categoryToErrorType(classified.category)

  return {
    type,
    title: options?.customTitle || classified.userTitle,
    message: options?.customMessage || classified.userMessage,
    detail: classified.technicalDetail,
    retryable: classified.retryable,
    suggestedAction: classified.suggestedAction
  }
}

// ==================== 保留原有的 GlobalErrorHandler 类 ====================

interface ErrorInfo {
  timestamp: number
  error: Error
  info?: string
  url: string
  userAgent: string
  classified?: ClassifiedError
}

interface ErrorHandlerOptions {
  maxErrors?: number
  reportUrl?: string
  onError?: (errorInfo: ErrorInfo) => void
  onClassifiedError?: (classified: ClassifiedError) => void
  enableClassification?: boolean
}

class GlobalErrorHandler {
  private errors: ErrorInfo[] = []
  private options: Required<ErrorHandlerOptions>
  private isReporting = false

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      maxErrors: options.maxErrors ?? 50,
      reportUrl: options.reportUrl ?? '',
      onError: options.onError ?? (() => {}),
      onClassifiedError: options.onClassifiedError ?? (() => {}),
      enableClassification: options.enableClassification ?? true
    }
  }

  install(app: App): void {
    app.config.errorHandler = (err, instance, info) => {
      const error = err instanceof Error ? err : new Error(String(err))
      const errorInfo: ErrorInfo = {
        timestamp: Date.now(),
        error,
        info,
        url: window.location.href,
        userAgent: navigator.userAgent
      }

      // 启用错误分类
      if (this.options.enableClassification) {
        errorInfo.classified = classifyError(error, { component: instance?.$options?.name, info })
        this.options.onClassifiedError(errorInfo.classified)
      }

      this.errors.push(errorInfo)

      if (this.errors.length > this.options.maxErrors) {
        this.errors.shift()
      }

      console.error('[GlobalErrorHandler]', error)
      if (info) console.error('[GlobalErrorHandler] Info:', info)

      this.options.onError(errorInfo)

      this.report(errorInfo)
    }

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))

      const rejectionInfo: ErrorInfo = {
        timestamp: Date.now(),
        error,
        info: 'Unhandled Promise Rejection',
        url: window.location.href,
        userAgent: navigator.userAgent
      }

      // 启用错误分类
      if (this.options.enableClassification) {
        rejectionInfo.classified = classifyError(error, { source: 'unhandledrejection' })
        this.options.onClassifiedError(rejectionInfo.classified!)
      }

      this.errors.push(rejectionInfo)
      this.options.onError(rejectionInfo)
      this.report(rejectionInfo)
    })

    window.addEventListener('error', (event) => {
      if (event.error) return

      const resourceError: ErrorInfo = {
        timestamp: Date.now(),
        error: new Error(`Resource loading failed: ${event.message}`),
        info: `Resource: ${event.filename}:${event.lineno}:${event.colno}`,
        url: window.location.href,
        userAgent: navigator.userAgent
      }

      this.errors.push(resourceError)
      this.options.onError(resourceError)
    }, true)
  }

  private async report(errorInfo: ErrorInfo): Promise<void> {
    if (!this.options.reportUrl || this.isReporting) return

    this.isReporting = true
    try {
      const payload = JSON.stringify({
        ...errorInfo,
        stack: errorInfo.error.stack,
        message: errorInfo.error.message,
        classified: errorInfo.classified
          ? {
              category: errorInfo.classified.category,
              severity: errorInfo.classified.severity,
              statusCode: errorInfo.classified.statusCode,
              errorCode: errorInfo.classified.errorCode
            }
          : undefined
      })

      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(this.options.reportUrl, payload)
      } else {
        await fetch(this.options.reportUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        })
      }
    } catch {
      console.warn('[GlobalErrorHandler] Failed to report error')
    } finally {
      this.isReporting = false
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  clearErrors(): void {
    this.errors = []
  }

  getErrorCount(): number {
    return this.errors.length
  }

  /**
   * 获取分类后的错误列表
   */
  getClassifiedErrors(): ClassifiedError[] {
    return this.errors
      .filter(e => e.classified)
      .map(e => e.classified!)
  }
}

// ==================== 导出 ====================

export { GlobalErrorHandler }
export type { ErrorInfo, ErrorHandlerOptions }

function setupErrorHandler(app: App, options?: ErrorHandlerOptions): void {
  const handler = new GlobalErrorHandler(options)
  handler.install(app)
}

export { setupErrorHandler }
