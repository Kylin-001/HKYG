import { ref, onMounted, onUnmounted } from 'vue'

// ====== 全局Loading管理（基于NProgress增强）======

interface LoadingManagerOptions {
  /** 最小显示时间(ms) - 防止闪烁 */
  minimumDisplayTime?: number
  /** 是否在路由变化时自动触发 */
  autoStartOnRouteChange?: boolean
  /** 自定义颜色 */
  color?: string
  /** 自定义高度 */
  height?: string
}

class GlobalLoadingManager {
  private isLoading = ref(false)
  private startTime: number | null = null
  private options: Required<LoadingManagerOptions>
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(options: LoadingManagerOptions = {}) {
    this.options = {
      minimumDisplayTime: options.minimumDisplayTime || 300,
      autoStartOnRouteChange: options.autoStartOnRouteChange !== false,
      color: options.color || '#3b82f6',
      height: options.height || '3px',
    }

    this.configureNProgress()
  }

  /**
   * 配置NProgress样式
   */
  private configureNProgress(): void {
    // 动态导入NProgress
    if (typeof window !== 'undefined' && (window as any).NProgress) {
      const NProgress = (window as any).NProgress

      NProgress.configure({
        showSpinner: false,
        trickleSpeed: 200,
        minimum: 0.1,
        parent: '#app',
      })

      // 自定义CSS变量
      this.injectCustomStyles()
    }
  }

  /**
   * 注入自定义样式
   */
  private injectCustomStyles(): void {
    if (document.getElementById('nprogress-custom-styles')) return

    const style = document.createElement('style')
    style.id = 'nprogress-custom-styles'
    style.textContent = `
      #nprogress .bar {
        background: ${this.options.color} !important;
        height: ${this.options.height} !important;
        box-shadow: 0 0 10px ${this.options.color}40 !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px ${this.options.color}, 0 0 5px ${this.options.color} !important;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 开始加载
   */
  start(): void {
    if (this.isLoading.value) return

    this.isLoading.value = true
    this.startTime = Date.now()

    if ((window as any).NProgress) {
      ;(window as any).NProgress.start()
    }

    // 触发事件
    window.dispatchEvent(new CustomEvent('global-loading-start'))
  }

  /**
   * 结束加载
   */
  done(): void {
    if (!this.isLoading.value) return

    const elapsed = this.startTime ? Date.now() - this.startTime : Infinity

    // 确保最小显示时间
    const remainingTime = Math.max(0, this.options.minimumDisplayTime - elapsed)

    if (remainingTime > 0) {
      this.timeoutId = setTimeout(() => {
        this.finishLoading()
      }, remainingTime)
    } else {
      this.finishLoading()
    }
  }

  /**
   * 完成加载（内部方法）
   */
  private finishLoading(): void {
    this.isLoading.value = false
    this.startTime = null

    if ((window as any).NProgress) {
      ;(window as any).NProgress.done()
    }

    // 触发事件
    window.dispatchEvent(new CustomEvent('global-loading-done'))
  }

  /**
   * 设置进度（0-1）
   */
  set(progress: number): void {
    if ((window as any).NProgress) {
      ;(window as any).NProgress.set(Math.min(1, Math.max(0, progress)))
    }
  }

  /**
   * 增加进度
   */
  increment(amount = 0.1): void {
    if ((window as any).NProgress) {
      ;(window as any).NProgress.inc(amount)
    }
  }

  get loading() {
    return this.isLoading.value
  }
}

// 全局单例
let globalLoadingInstance: GlobalLoadingManager | null = null

export function useGlobalLoading(options?: LoadingManagerOptions): GlobalLoadingManager {
  if (!globalLoadingInstance) {
    globalLoadingInstance = new GlobalLoadingManager(options)
  }
  return globalLoadingInstance
}

// ====== 触觉反馈 ======

interface HapticFeedbackOptions {
  /** 振动模式 */
  pattern?: number | number[]
  /** 持续时间(ms) */
  duration?: number
}

/**
 * 触觉反馈 Composable
 *
 * 功能:
 * - 轻触反馈（成功/错误/警告）
 * - 自定义振动模式
 * - 自动降级（不支持时静默失败）
 */
export function useHapticFeedback() {
  /**
   * 检测是否支持振动API
   */
  const isSupported = (): boolean => {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator
  }

  /**
   * 触发振动
   */
  function vibrate(pattern: number | number[] = 10): boolean {
    if (!isSupported()) return false

    try {
      navigator.vibrate(pattern)
      return true
    } catch (error) {
      console.warn('[Haptic] Vibration failed:', error)
      return false
    }
  }

  /**
   * 成功反馈（短促的轻触）
   */
  function success(): boolean {
    return vibrate(15)
  }

  /**
   * 错误反馈（两次短振动）
   */
  function error(): boolean {
    return vibrate([50, 50, 50])
  }

  /**
   * 警告反馈（中等长度）
   */
  function warning(): boolean {
    return vibrate(30)
  }

  /**
   * 确认反馈（轻微脉冲）
   */
  function confirm(): boolean {
    return vibrate(20)
  }

  /**
   * 长按反馈（持续振动）
   */
  function longPress(duration = 500): boolean {
    return vibrate(duration)
  }

  return {
    isSupported,
    vibrate,
    success,
    error,
    warning,
    confirm,
    longPress,
  }
}

// ====== 操作确认和撤销 ======

interface UndoAction<T = any> {
  id: string
  type: 'create' | 'update' | 'delete'
  description: string
  previousData?: T
  newData?: T
  timestamp: number
  undo: () => Promise<void> | void
  redo: () => Promise<void> | void
}

interface UseConfirmAndUndoOptions {
  /** 最大撤销历史数 */
  maxHistorySize?: number
  /** 撤销提示显示时间(ms) */
  toastDuration?: number
  /** 是否启用确认对话框 */
  enableConfirmDialog?: boolean
}

/**
 * 操作确认和撤销 Composable
 *
 * 功能:
 * - 操作前确认
 * - 操作后可撤销
 * - 撤销历史记录
 * - Toast提示
 */
export function useConfirmAndUndo(options: UseConfirmAndUndoOptions = {}) {
  const {
    maxHistorySize = 20,
    toastDuration = 5000,
    enableConfirmDialog = true,
  } = options

  const history = ref<UndoAction[]>([])
  const currentToast = ref<UndoAction | null>(null)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 执行带确认的操作
   */
  async function executeWithConfirm<T>(
    action: () => Promise<T>,
    options: {
      message?: string
      title?: string
      confirmText?: string
      cancelText?: string
      type?: 'info' | 'warning' | 'danger'
    } = {}
  ): Promise<{ result: T; actionId: string }> {
    // 如果需要确认且浏览器支持confirm
    if (enableConfirmDialog && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        options.message || '确定要执行此操作吗？'
      )

      if (!confirmed) {
        throw new Error('User cancelled the operation')
      }
    }

    // 执行操作
    const result = await action()

    return { result, actionId: `action-${Date.now()}` }
  }

  /**
   * 记录可撤销的操作
   */
  function recordAction<T>(action: UndoAction<T>): void {
    // 添加到历史
    history.value.unshift(action)

    // 限制历史大小
    if (history.value.length > maxHistorySize) {
      history.value = history.value.slice(0, maxHistorySize)
    }

    // 显示撤销提示
    showToast(action)

    // 触发事件
    window.dispatchEvent(
      new CustomEvent('undo-action-recorded', { detail: action })
    )
  }

  /**
   * 显示撤销提示
   */
  function showToast(action: UndoAction): void {
    currentToast.value = action

    // 清除之前的定时器
    if (toastTimer) {
      clearTimeout(toastTimer)
    }

    // 设置新的定时器
    toastTimer = setTimeout(() => {
      currentToast.value = null
    }, toastDuration)
  }

  /**
   * 撤销操作
   */
  async function undo(actionId?: string): Promise<boolean> {
    let action: UndoAction | undefined

    if (actionId) {
      action = history.value.find(a => a.id === actionId)
    } else {
      action = history.value[0]
    }

    if (!action) {
      console.warn('[ConfirmAndUndo] No action to undo')
      return false
    }

    try {
      await action.undo()

      // 从历史中移除
      history.value = history.value.filter(a => a.id !== action!.id)

      // 隐藏toast
      if (currentToast.value?.id === action.id) {
        currentToast.value = null
        if (toastTimer) {
          clearTimeout(toastTimer)
          toastTimer = null
        }
      }

      // 触发事件
      window.dispatchEvent(
        new CustomEvent('undo-action-executed', { detail: action })
      )

      return true
    } catch (error) {
      console.error('[ConfirmAndUndo] Undo failed:', error)
      return false
    }
  }

  /**
   * 重做操作
   */
  async function redo(actionId?: string): Promise<boolean> {
    let action: UndoAction | undefined

    if (actionId) {
      action = history.value.find(a => a.id === actionId)
    } else {
      action = history.value[0]
    }

    if (!action || !action.redo) {
      console.warn('[ConfirmAndUndo] No action to redo')
      return false
    }

    try {
      await action.redo()

      window.dispatchEvent(
        new CustomEvent('redo-action-executed', { detail: action })
      )

      return true
    } catch (error) {
      console.error('[ConfirmAndUndo] Redo failed:', error)
      return false
    }
  }

  /**
   * 清空历史
   */
  function clearHistory(): void {
    history.value = []
    currentToast.value = null
  }

  /**
   * 是否可以撤销
   */
  const canUndo = (): boolean => history.value.length > 0

  return {
    // 状态
    history,
    currentToast,

    // 方法
    executeWithConfirm,
    recordAction,
    undo,
    redo,
    clearHistory,
    canUndo,
  }
}

// ====== 页面切换动画 ======

interface PageTransitionOptions {
  /** 动画类型 */
  type?: 'fade' | 'slide' | 'zoom' | 'flip' | 'none'
  /** 动画时长(ms) */
  duration?: number
  /** 缓动函数 */
  easing?: string
  /** 是否禁用动画（尊重用户偏好） */
  respectReducedMotion?: boolean
}

/**
 * 页面切换动画 Composable
 */
export function usePageTransition(options: PageTransitionOptions = {}) {
  const {
    type = 'slide',
    duration = 300,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    respectReducedMotion = true,
  } = options

  const isTransitioning = ref(false)
  const transitionType = ref(type)

  /**
   * 检查用户是否偏好减少动画
   */
  const shouldReduceMotion = (): boolean => {
    if (!respectReducedMotion) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * 应用页面进入动画类名
   */
  function getEnterClass(routeName: string): string {
    if (shouldReduceMotion()) return ''

    switch (transitionType.value) {
      case 'fade':
        return 'page-fade-enter-active'
      case 'slide':
        return 'page-slide-enter-active'
      case 'zoom':
        return 'page-zoom-enter-active'
      case 'flip':
        return 'page-flip-enter-active'
      default:
        return ''
    }
  }

  /**
   * 应用页面离开动画类名
   */
  function getLeaveClass(routeName: string): string {
    if (shouldReduceMotion()) return ''

    switch (transitionType.value) {
      case 'fade':
        return 'page-fade-leave-active'
      case 'slide':
        return 'page-slide-leave-active'
      case 'zoom':
        return 'page-zoom-leave-active'
      case 'flip':
        return 'page-flip-leave-active'
      default:
        return ''
    }
  }

  /**
   * 开始过渡
   */
  function startTransition(): void {
    isTransitioning.value = true

    setTimeout(() => {
      isTransitioning.value = false
    }, duration)
  }

  /**
   * 设置动画类型
   */
  function setTransitionType(newType: typeof type): void {
    transitionType.value = newType
  }

  return {
    isTransitioning,
    transitionType,
    getEnterClass,
    getLeaveClass,
    startTransition,
    setTransitionType,
    shouldReduceMotion,
  }
}

// 导出所有工具
export {
  GlobalLoadingManager,
}
