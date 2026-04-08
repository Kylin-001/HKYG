import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'

interface UsePreloadRouteOptions {
  /** hover延迟时间(ms) */
  delay?: number
  /** 是否启用hover预加载 */
  prefetchOnHover?: boolean
  /** 是否启用空闲时预加载 */
  prefetchOnIdle?: boolean
  /** 空闲预加载的优先级路由列表 */
  idlePrefetchRoutes?: string[]
  /** 是否启用可见性预加载（当链接进入视口时） */
  prefetchOnVisible?: boolean
  /** 可见性预加载的IntersectionObserver阈值 */
  visibleThreshold?: number
  /** 预加载超时时间(ms) */
  preloadTimeout?: number
  /** 最大并发预加载数 */
  maxConcurrentPreloads?: number
  /** 是否在移动端网络下禁用预加载 */
  disableOnSlowConnection?: boolean
  /** 慢网络阈值(慢速2G/3G) */
  slowConnectionThreshold?: EffectiveType
}

type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g'

interface PreloadTask {
  route: RouteLocationRaw
  priority: number
  timestamp: number
  status: 'pending' | 'loading' | 'completed' | 'error'
}

/**
 * 智能路由预加载 Composable
 *
 * 功能:
 * - hover预加载（鼠标悬停时）
 * - 空闲时预加载（requestIdleCallback）
 * - 可见性预加载（IntersectionObserver）
 * - 连接速度感知（慢速网络自动降级）
 * - 并发控制
 * - 预加载统计
 */
export function usePreloadRoute(options: UsePreloadRouteOptions = {}) {
  const {
    delay = 150,
    prefetchOnHover = true,
    prefetchOnIdle = true,
    idlePrefetchRoutes = [],
    prefetchOnVisible = true,
    visibleThreshold = 0.1,
    preloadTimeout = 10000,
    maxConcurrentPreloads = 3,
    disableOnSlowConnection = true,
    slowConnectionThreshold = '3g',
  } = options

  const router = useRouter()
  const preloadTimer = ref<number | null>(null)
  const isSlowConnection = ref(false)
  const activePreloads = ref<PreloadTask[]>([])
  const preloadStats = ref({
    total: 0,
    success: 0,
    error: 0,
    skipped: 0,
  })

  // ====== 连接速度检测 ======

  /**
   * 检测当前网络连接类型
   */
  function detectConnectionSpeed(): void {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return

    const connection = (navigator as any).connection as {
      effectiveType?: EffectiveType
      saveData?: boolean
    }

    if (connection?.effectiveType) {
      const speedOrder: EffectiveType[] = ['slow-2g', '2g', '3g', '4g']
      const currentLevel = speedOrder.indexOf(connection.effectiveType)
      const thresholdLevel = speedOrder.indexOf(slowConnectionThreshold)

      isSlowConnection.value =
        connection.saveData ||
        currentLevel <= thresholdLevel

      // 监听连接变化
      connection.addEventListener('change', detectConnectionSpeed)
    }
  }

  /**
   * 判断是否应该执行预加载
   */
  function shouldPreload(): boolean {
    if (disableOnSlowConnection && isSlowConnection.value) {
      preloadStats.value.skipped++
      return false
    }
    return true
  }

  // ====== 核心预加载逻辑 ======

  /**
   * 执行路由预加载
   */
  async function preloadRoute(route: RouteLocationRaw, priority = 0): Promise<boolean> {
    if (!shouldPreload()) return false

    try {
      const resolved = router.resolve(route)

      if (!resolved.matched.length) {
        console.warn('[usePreloadRoute] Invalid route:', route)
        return false
      }

      // 创建任务记录
      const task: PreloadTask = {
        route,
        priority,
        timestamp: Date.now(),
        status: 'pending',
      }

      activePreloads.value.push(task)

      // 更新统计
      preloadStats.value.total++

      // 设置超时
      const timeoutId = setTimeout(() => {
        task.status = 'error'
        console.warn('[usePreloadRoute] Preload timeout for:', route)
      }, preloadTimeout)

      // 并发控制
      const loadingCount = activePreloads.value.filter(t => t.status === 'loading').length
      if (loadingCount >= maxConcurrentPreloads) {
        await waitForSlot()
      }

      task.status = 'loading'

      // 预加载所有匹配的路由组件
      const loadPromises = resolved.matched.map(async (record) => {
        if (record.components) {
          const componentPromises = Object.values(record.components).map(async (component) => {
            if (typeof component === 'function') {
              try {
                await component()
                return true
              } catch (error) {
                console.error('[usePreloadRoute] Component load error:', error)
                return false
              }
            }
            return true
          })

          return Promise.all(componentPromises)
        }
        return Promise.resolve(true)
      })

      await Promise.all(loadPromises)

      clearTimeout(timeoutId)
      task.status = 'completed'
      preloadStats.value.success++

      return true
    } catch (error) {
      console.error('[usePreloadRoute] Preload failed:', error)
      preloadStats.value.error++
      return false
    }
  }

  /**
   * 等待可用预加载槽位
   */
  async function waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const loadingCount = activePreloads.value.filter(
          t => t.status === 'loading'
        ).length

        if (loadingCount < maxConcurrentPreloads) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }

  // ====== Hover预加载 ======

  function handleLinkHover(event: MouseEvent, route: RouteLocationRaw): void {
    if (!prefetchOnHover || !shouldPreload()) return

    const target = event.currentTarget as HTMLElement

    target.addEventListener(
      'mouseleave',
      () => {
        if (preloadTimer.value !== null) {
          clearTimeout(preloadTimer.value)
          preloadTimer.value = null
        }
      },
      { once: true }
    )

    if (preloadTimer.value !== null) {
      clearTimeout(preloadTimer.value)
    }

    preloadTimer.value = window.setTimeout(() => {
      preloadRoute(route, 1) // hover预加载优先级为1
      preloadTimer.value = null
    }, delay)
  }

  // ====== 空闲时预加载 ======

  let idleCallbackId: number | null = null

  function setupIdlePrefetch(): void {
    if (!prefetchOnIdle || typeof window === 'undefined') return

    // 使用 requestIdleCallback 或降级方案
    const scheduleIdleCallback = (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ): number => {
      if ('requestIdleCallback' in window) {
        return (window as any).requestIdleCallback(callback, options)
      }

      // 降级方案：使用setTimeout模拟
      return window.setTimeout(callback, 1) as unknown as number
    }

    const cancelIdleCallback = (id: number): void => {
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(id)
      } else {
        clearTimeout(id)
      }
    }

    const prefetchNextBatch = async (): Promise<void> => {
      // 获取尚未预加载的路由
      const pendingRoutes = idlePrefetchRoutes.filter((routeName) => {
        const alreadyLoaded = activePreloads.value.some(
          (task) =>
            typeof task.route === 'string'
              ? task.route === routeName
              : (task.route as any)?.name === routeName
        )
        return !alreadyLoaded
      })

      // 每次空闲时只预加载1-2个路由
      const batch = pendingRoutes.slice(0, 2)

      for (const routeName of batch) {
        await preloadRoute({ name: routeName }, 2) // 空闲预加载优先级为2
      }

      // 如果还有未预加载的路由，继续安排下一次空闲预加载
      if (pendingRoutes.length > batch.length && prefetchOnIdle) {
        idleCallbackId = scheduleIdleCallback(prefetchNextBatch, { timeout: 3000 })
      }
    }

    // 开始空闲预加载
    idleCallbackId = scheduleIdleCallback(prefetchNextBatch, { timeout: 3000 })
  }

  // ====== 可见性预加载 ======

  let visibilityObserver: IntersectionObserver | null = null
  const observedElements = new WeakMap<HTMLElement, RouteLocationRaw>()

  function setupVisiblePrefetch(): void {
    if (!prefetchOnVisible || typeof IntersectionObserver === 'undefined') return

    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const route = observedElements.get(entry.target as HTMLElement)
            if (route && shouldPreload()) {
              preloadRoute(route, 3) // 可见性预加载优先级为3
            }
            // 一旦预加载就停止观察
            visibilityObserver?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: visibleThreshold,
        rootMargin: '200px', // 提前200px开始预加载
      }
    )
  }

  /**
   * 注册需要可见性预加载的元素
   */
  function observeLink(element: HTMLElement, route: RouteLocationRaw): void {
    if (!visibilityObserver || !prefetchOnVisible) return

    observedElements.set(element, route)
    visibilityObserver.observe(element)
  }

  // ====== 预测性预加载 ======

  /**
   * 基于用户行为预测并预加载可能的下一个路由
   */
  function predictAndPrefetch(currentRoute: string): void {
    if (!shouldPreload()) return

    // 定义路由之间的跳转概率图
    const routeProbabilities: Record<string, string[]> = {
      '/': ['/products', '/takeout', '/secondhand'],
      '/products': ['/products/:id', '/cart'],
      '/cart': ['/orders/checkout', '/orders/payment/:orderId'],
      '/orders': ['/orders/:id'],
      '/takeout': ['/takeout/merchant/:merchantId'],
      '/secondhand': ['/secondhand/:id'],
      '/user/profile': ['/user/orders', '/user/favorites'],
    }

    const likelyNextRoutes = routeProbabilities[currentRoute] || []

    // 预加载最可能的前2个路由
    likelyNextRoutes.slice(0, 2).forEach((route, index) => {
      setTimeout(() => {
        preloadRoute({ path: route }, 4 + index) // 预测性预加载优先级较低
      }, index * 500) // 错开预加载时间
    })
  }

  // ====== 工具方法 ======

  /**
   * 清理已完成的预加载任务
   */
  function cleanupCompletedTasks(): void {
    const now = Date.now()
    activePreloads.value = activePreloads.value.filter(
      (task) =>
        task.status === 'pending' ||
        task.status === 'loading' ||
        (task.status !== 'loading' && now - task.timestamp < 60000) // 保留最近1分钟的记录
    )
  }

  /**
   * 获取预加载状态报告
   */
  function getPreloadReport(): {
    stats: typeof preloadStats.value
    activeTasks: PreloadTask[]
    isSlowNetwork: boolean
  } {
    cleanupCompletedTasks()

    return {
      stats: { ...preloadStats.value },
      activeTasks: [...activePreloads.value],
      isSlowNetwork: isSlowConnection.value,
    }
  }

  /**
   * 取消所有待处理的预加载
   */
  function cancelPendingPreloads(): void {
    if (preloadTimer.value !== null) {
      clearTimeout(preloadTimer.value)
      preloadTimer.value = null
    }

    if (idleCallbackId !== null) {
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackId)
      } else {
        clearTimeout(idleCallbackId)
      }
      idleCallbackId = null
    }

    activePreloads.value = activePreloads.value.filter(
      (task) => task.status === 'loading' // 只保留正在加载的任务
    )
  }

  // ====== 生命周期 ======

  onMounted(() => {
    detectConnectionSpeed()

    setupIdlePrefetch()
    setupVisiblePrefetch()

    // 监听路由变化进行预测性预加载
    watch(
      () => router.currentRoute.value.fullPath,
      (newPath) => {
        predictAndPrefetch(newPath)
      },
      { immediate: true }
    )

    // 定期清理已完成任务
    setInterval(cleanupCompletedTasks, 30000)
  })

  onUnmounted(() => {
    cancelPendingPreloads()

    if (visibilityObserver) {
      visibilityObserver.disconnect()
      visibilityObserver = null
    }

    // 移除连接监听
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      connection?.removeEventListener('change', detectConnectionSpeed)
    }
  })

  return {
    // 核心
    preloadRoute,
    handleLinkHover,
    observeLink,

    // 控制
    cancelPendingPreloads,
    shouldPreload,

    // 状态
    isSlowConnection,
    activePreloads,
    preloadStats,

    // 报告
    getPreloadReport,
  }
}
