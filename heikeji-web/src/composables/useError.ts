import { ref, reactive, computed, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locales'
import { ElMessage, ElNotification } from 'element-plus'
import {
  classifyError,
  createUserFriendlyError,
  type ClassifiedError,
  type ErrorCategory,
  type ErrorSeverity
} from '@/utils/errorHandler'
import type { ErrorType } from '@/components/global/ErrorFallback.vue'

/**
 * useError 组合函数的配置选项
 */
export interface UseErrorOptions {
  /** 是否自动显示通知提示（默认 true） */
  autoNotify?: boolean
  /** 通知类型：message 或 notification（默认 message） */
  notifyType?: 'message' | 'notification'
  /** 是否自动记录错误到错误列表（默认 true） */
  autoRecord?: boolean
  /** 最大错误记录数（默认 50） */
  maxErrors?: number
  /** 全局重试次数限制（默认 3） */
  maxRetries?: number
  /** 重试延迟时间（毫秒，默认 1000） */
  retryDelay?: number
  /** 自定义错误处理回调 */
  onError?: (error: ClassifiedError) => void
  /** 自定义成功处理回调 */
  onRetrySuccess?: () => void
}

/**
 * 错误状态接口
 */
interface ErrorState {
  /** 当前活跃的错误 */
  currentError: ClassifiedError | null
  /** 错误历史记录 */
  errorHistory: ClassifiedError[]
  /** 是否正在重试 */
  isRetrying: boolean
  /** 当前重试次数 */
  retryCount: number
}

/**
 * 异步操作包装器返回值
 */
export interface AsyncResult<T> {
  /** 操作结果数据 */
  data: T | null
  /** 分类后的错误信息 */
  error: ClassifiedError | null
  /** 是否正在加载 */
  loading: boolean
  /** 是否成功 */
  success: boolean
  /** 执行重试 */
  retry: () => Promise<void>
  /** 清除状态 */
  clear: () => void
}

/**
 * 统一的错误处理组合函数
 *
 * 提供完整的错误处理能力，包括：
 * - 错误捕获与分类
 * - 用户友好的错误展示
 * - 自动重试机制
 * - 错误历史管理
 * - i18n 国际化支持
 *
 * @example
 * ```typescript
 * // 基础用法
 * const { handleError, error, showErrorDialog } = useError()
 *
 * try {
 *   await api.getData()
 * } catch (err) {
 *   handleError(err)
 * }
 *
 * // 使用异步包装器
 * const { data, error, loading, retry } = useError()
 * const result = await wrapAsync(() => api.getData())
 *
 * // 带重试的异步操作
 * const result = await withRetry(() => api.getData(), { maxRetries: 3 })
 * ```
 */
export function useError(options: UseErrorOptions = {}) {
  const {
    autoNotify = true,
    notifyType = 'message',
    autoRecord = true,
    maxErrors = 50,
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRetrySuccess
  } = options

  const router = useRouter()
  const { t } = useI18n()

  // 响应式状态
  const state = reactive<ErrorState>({
    currentError: null,
    errorHistory: [],
    isRetrying: false,
    retryCount: 0
  })

  // 对话框显示控制
  const showDialog = ref(false)
  const dialogError = ref<ClassifiedError | null>(null)

  /**
   * 计算属性：是否有当前错误
   */
  const hasError: ComputedRef<boolean> = computed(() => state.currentError !== null)

  /**
   * 计算属性：错误数量
   */
  const errorCount: ComputedRef<number> = computed(() => state.errorHistory.length)

  /**
   * 计算属性：最后一条错误
   */
  const lastError: ComputedRef<ClassifiedError | null> = computed(
    () => state.errorHistory[state.errorHistory.length - 1] || null
  )

  /**
   * 按类别过滤错误历史
   */
  function getErrorsByCategory(category: ErrorCategory): ClassifiedError[] {
    return state.errorHistory.filter(e => e.category === category)
  }

  /**
   * 按严重级别过滤错误历史
   */
  function getErrorsBySeverity(severity: ErrorSeverity): ClassifiedError[] {
    return state.errorHistory.filter(e => e.severity === severity)
  }

  /**
   * 核心错误处理函数
   *
   * @param error - 原始错误对象
   * @param context - 可选上下文信息
   * @returns 分类后的错误信息
   */
  function handleError(error: unknown, context?: Record<string, unknown>): ClassifiedError {
    // 分类错误
    const classified = classifyError(error, context)

    // 设置当前错误
    state.currentError = classified

    // 记录到历史
    if (autoRecord) {
      state.errorHistory.push(classified)
      if (state.errorHistory.length > maxErrors) {
        state.errorHistory.shift()
      }
    }

    // 调用自定义回调
    onError?.(classified)

    // 自动显示通知
    if (autoNotify) {
      showNotification(classified)
    }

    return classified
  }

  /**
   * 显示用户友好的错误通知
   */
  function showNotification(error: ClassifiedError): void {
    const title = getErrorTitle(error)
    const message = error.userMessage || getErrorMessage(error)

    if (notifyType === 'notification') {
      const iconMap: Record<string, string> = {
        warning: 'warning',
        error: 'error',
        info: 'info',
        fatal: 'error'
      }

      ElNotification({
        title,
        message,
        type: (iconMap[error.severity] as any) || 'error',
        duration: error.severity === 'fatal' ? 0 : 4500,
        showClose: true
      })
    } else {
      const typeMap: Record<string, 'warning' | 'error' | 'info'> = {
        warning: 'warning',
        error: 'error',
        info: 'info',
        fatal: 'error'
      }

      ElMessage({
        message: `${title}: ${message}`,
        type: typeMap[error.severity] || 'error',
        duration: error.severity === 'fatal' ? 0 : 3000,
        showClose: true
      })
    }
  }

  /**
   * 显示错误对话框
   */
  function showErrorDialog(error?: ClassifiedError | unknown): void {
    let targetError: ClassifiedError

    if (error && typeof error === 'object' && 'category' in error) {
      targetError = error as ClassifiedError
    } else if (error) {
      targetError = classifyError(error)
    } else if (state.currentError) {
      targetError = state.currentError
    } else {
      console.warn('[useError] No error to display in dialog')
      return
    }

    dialogError.value = targetError
    showDialog.value = true
  }

  /**
   * 关闭错误对话框
   */
  function closeErrorDialog(): void {
    showDialog.value = false
    dialogError.value = null
  }

  /**
   * 获取错误标题（支持i18n）
   */
  function getErrorTitle(error: ClassifiedError): string {
    if (error.userTitle) return error.userTitle

    // 根据 category 和 statusCode 映射到 i18n key
    const titleKeyMap: Record<string, string> = {
      [`${error.category}_${error.statusCode}`]: `error.${error.statusCode}`,
      [error.category]: getDefaultTitleKey(error.category)
    }

    const key = titleKeyMap[`${error.category}_${error.statusCode}`] ||
                titleKeyMap[error.category] ||
                'error.unknownError'

    return t(key)
  }

  /**
   * 获取错误消息（支持i18n）
   */
  function getErrorMessage(error: ClassifiedError): string {
    if (error.userMessage) return error.userMessage

    const msgKeyMap: Record<string, string> = {
      network: 'error.offlineTip',
      server: 'error.serverErrorTip',
      authentication: 'error.loginRequired',
      authorization: 'error.permissionDenied',
      not_found: 'error.notFoundTip',
      timeout: 'error.timeoutError',
      validation: 'error.validationFailed',
      business: 'error.businessError',
      unknown: 'error.unknownError'
    }

    const key = msgKeyMap[error.category] || 'error.unknownError'
    return t(key)
  }

  /**
   * 获取默认标题的 i18n key
   */
  function getDefaultTitleKey(category: ErrorCategory): string {
    const keyMap: Record<ErrorCategory, string> = {
      network: 'error.networkError',
      http: 'error.serverErrorTitle',
      business: 'error.businessError',
      authentication: 'error.401',
      authorization: 'error.403',
      validation: 'error.400',
      not_found: 'error.pageNotFound',
      server: 'error.serverErrorTitle',
      timeout: 'error.timeoutError',
      unknown: 'error.unknownError'
    }
    return keyMap[category] || 'error.unknownError'
  }

  /**
   * 延迟函数
   */
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 带重试机制的异步操作执行器
   *
   * @param fn - 要执行的异步函数
   * @param retries - 最大重试次数（可选，覆盖全局配置）
   * @returns 操作结果
   */
  async function withRetry<T>(
    fn: () => Promise<T>,
    retries?: number
  ): Promise<AsyncResult<T>> {
    const maxAttempt = retries ?? maxRetries
    state.isRetrying = false
    state.retryCount = 0

    const result: AsyncResult<T> = {
      data: null,
      error: null,
      loading: true,
      success: false,
      retry: async () => {},
      clear: () => {}
    }

    // 赋值 retry 方法
    result.retry = async () => {
      result.loading = true
      result.error = null
      result.success = false

      try {
        result.data = await fn()
        result.success = true
        onRetrySuccess?.()
      } catch (error) {
        result.error = handleError(error)
      } finally {
        result.loading = false
      }
    }

    // 赋值 clear 方法
    result.clear = () => {
      result.data = null
      result.error = null
      result.loading = false
      result.success = false
    }

    for (let attempt = 0; attempt <= maxAttempt; attempt++) {
      try {
        result.data = await fn()
        result.success = true
        result.loading = false

        // 如果之前有错误，清除它
        if (state.currentError) {
          state.currentError = null
        }

        return result
      } catch (error) {
        const classified = handleError(error, { attempt, maxAttempts: maxAttempt })

        // 如果不可重试或已达到最大重试次数
        if (!classified.retryable || attempt >= maxAttempt) {
          result.error = classified
          result.loading = false
          return result
        }

        // 更新重试状态
        state.isRetrying = true
        state.retryCount = attempt + 1

        // 等待后重试
        await delay(retryDelay * (attempt + 1)) // 指数退避
      }
    }

    result.loading = false
    return result
  }

  /**
   * 包装异步操作（简化版）
   *
   * @param fn - 异步函数
   * @returns 操作结果
   */
  async function wrapAsync<T>(fn: () => Promise<T>): Promise<AsyncResult<T>> {
    return withRetry(fn, 0) // 不自动重试
  }

  /**
   * 清除当前错误
   */
  function clearCurrentError(): void {
    state.currentError = null
    state.isRetrying = false
    state.retryCount = 0
  }

  /**
   * 清除所有错误历史
   */
  function clearErrorHistory(): void {
    state.errorHistory = []
    state.currentError = null
  }

  /**
   * 处理建议的操作
   */
  function executeSuggestedAction(error?: ClassifiedError): void {
    const targetError = error || state.currentError
    if (!targetError) return

    switch (targetError.suggestedAction) {
      case 'retry':
        // 由调用者实现具体重试逻辑
        break
      case 'refresh':
        window.location.reload()
        break
      case 'goBack':
        router.back()
        break
      case 'goHome':
        router.push('/')
        break
      case 'login':
        router.push('/auth/login')
        break
      case 'contact':
        // 打开联系方式或帮助页面
        window.open('/help', '_blank')
        break
      case 'none':
      default:
        // 不执行任何操作
        break
    }
  }

  /**
   * 创建用于组件绑定的响应式错误对象
   */
  function createComponentError(error: unknown): {
    type: ErrorType
    title: string
    message: string
    detail: string
    retryable: boolean
  } {
    const friendly = createUserFriendlyError(error)
    const classified = classifyError(error)

    return {
      type: friendly.type,
      title: friendly.title || getErrorTitle(classified),
      message: friendly.message || getErrorMessage(classified),
      detail: friendly.detail,
      retryable: friendly.retryable
    }
  }

  return {
    // 状态
    currentError: computed(() => state.currentError),
    errorHistory: computed(() => [...state.errorHistory]),
    isRetrying: computed(() => state.isRetrying),
    retryCount: computed(() => state.retryCount),
    hasError,
    errorCount,
    lastError,

    // 对话框状态
    showDialog: computed(() => showDialog.value),
    dialogError: computed(() => dialogError.value),

    // 核心方法
    handleError,
    showNotification,
    showErrorDialog,
    closeErrorDialog,
    clearCurrentError,
    clearErrorHistory,

    // 异步操作辅助
    withRetry,
    wrapAsync,

    // 工具方法
    getErrorTitle,
    getErrorMessage,
    createComponentError,
    getErrorsByCategory,
    getErrorsBySeverity,
    executeSuggestedAction
  }
}

/**
 * 预设的错误处理配置
 */
export const errorPresets = {
  /** API请求错误的预设配置 */
  api: {
    autoNotify: true,
    notifyType: 'message' as const,
    maxRetries: 2,
    retryDelay: 1000
  },

  /** 表单提交错误的预设配置 */
  form: {
    autoNotify: true,
    notifyType: 'message' as const,
    maxRetries: 0
  },

  /** 文件上传错误的预设配置 */
  upload: {
    autoNotify: true,
    notifyType: 'notification' as const,
    maxRetries: 3,
    retryDelay: 2000
  },

  /** 关键操作错误的预设配置（如支付） */
  critical: {
    autoNotify: true,
    notifyType: 'notification' as const,
    maxRetries: 1,
    retryDelay: 500
  },

  /** 静默模式（不自动通知） */
  silent: {
    autoNotify: false,
    maxRetries: 0
  }
} as const
