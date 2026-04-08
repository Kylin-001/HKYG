/**
 * 核心性能指标收集器
 * 收集Web Vitals和自定义性能指标
 * 使用PerformanceObserver API进行高效采集
 */

import { performanceBudget, getPerformanceRating } from '@/config/performance.config'

/** 性能指标类型 */
export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  navigationType?: string
  metadata?: Record<string, any>
}

/** 核心Web Vitals集合 */
export interface CoreWebVitals {
  FCP: PerformanceMetric | null   // First Contentful Paint - 首次内容绘制
  LCP: PerformanceMetric | null   // Largest Contentful Paint - 最大内容绘制
  FID: PerformanceMetric | null   // First Input Delay - 首次输入延迟
  CLS: PerformanceMetric | null   // Cumulative Layout Shift - 累积布局偏移
  TTFB: PerformanceMetric | null  // Time to First Byte - 首字节时间
  INP: PerformanceMetric | null   // Interaction to Next Paint - 交互到下一帧
  TTI: PerformanceMetric | null   // Time to Interactive - 可交互时间
  FMP: PerformanceMetric | null   // First Meaningful Paint - 首次有意义的绘制
}

/** 自定义性能指标 */
export interface CustomMetrics {
  routeChangeTime?: number        // 路由切换耗时(ms)
  apiResponseTimes: Map<string, number[]> // API响应时间分布
  componentRenderTimes: Map<string, number> // 组件渲染耗时
  resourceLoadTimes: Map<string, ResourceTimingInfo> // 资源加载信息
  memoryUsage: MemoryInfo          // 内存使用量
  longTasks: LongTaskInfo[]        // 长任务列表
}

/** 资源加载信息 */
interface ResourceTimingInfo {
  name: string
  duration: number
  size: number
  type: string
  timestamp: number
}

/** 内存使用信息 */
interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  timestamp: number
}

/** 长任务信息 */
interface LongTaskInfo {
  name: string
  duration: number
  startTime: number
  timestamp: number
  attribution?: string
}

/** API响应时间记录 */
interface ApiTimingRecord {
  url: string
  method: string
  duration: number
  status: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private observers: PerformanceObserver[] = []
  private onMetricCallback?: (metric: PerformanceMetric) => void
  private customMetrics: CustomMetrics = {
    apiResponseTimes: new Map(),
    componentRenderTimes: new Map(),
    resourceLoadTimes: new Map(),
    memoryUsage: { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0, timestamp: 0 },
    longTasks: []
  }
  private routeChangeStartTime: number = 0
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  /**
   * 初始化性能监控器
   */
  private init(): void {
    if (this.isInitialized) return
    this.isInitialized = true

    try {
      this.initCoreWebVitalsObservers()
      this.initCustomMetricsCollectors()
      this.setupVisibilityListener()

      if (import.meta.env.DEV) {
        console.log('[PerformanceMonitor] 初始化完成')
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] 初始化失败:', error)
    }
  }

  /**
   * 注册指标回调
   */
  onMetric(callback: (metric: PerformanceMetric) => void): void {
    this.onMetricCallback = callback
  }

  /**
   * 获取核心Web Vitals
   */
  getCoreWebVitals(): CoreWebVitals {
    return {
      FCP: this.metrics.get('FCP') || null,
      LCP: this.metrics.get('LCP') || null,
      FID: this.metrics.get('FID') || null,
      CLS: this.metrics.get('CLS') || null,
      TTFB: this.metrics.get('TTFB') || null,
      INP: this.metrics.get('INP') || null,
      TTI: this.metrics.get('TTI') || null,
      FMP: this.metrics.get('FMP') || null
    }
  }

  /**
   * 获取所有已收集的指标
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * 获取单个指标
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name)
  }

  /**
   * 获取自定义指标
   */
  getCustomMetrics(): CustomMetrics {
    return { ...this.customMetrics }
  }

  /**
   * 获取API响应时间统计
   */
  getApiStats(url?: string): {
    avg: number
    min: number
    max: number
    count: number
    p95: number
  } | null {
    const timings = url
      ? this.customMetrics.apiResponseTimes.get(url)
      : Array.from(this.customMetrics.apiResponseTimes.values()).flat()

    if (!timings || timings.length === 0) return null

    const sorted = [...timings].sort((a, b) => a - b)
    const sum = sorted.reduce((acc, val) => acc + val, 0)

    return {
      avg: Math.round(sum / sorted.length),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: sorted.length,
      p95: sorted[Math.ceil(sorted.length * 0.95) - 1]
    }
  }

  /**
   * 获取长任务列表
   */
  getLongTasks(): LongTaskInfo[] {
    return [...this.customMetrics.longTasks]
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): MemoryInfo | null {
    const memory = (performance as any).memory
    if (!memory) return null

    return {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      timestamp: Date.now()
    }
  }

  // ==================== 核心Web Vitals观察器 ====================

  private initCoreWebVitalsObservers(): void {
    // FCP - 首次内容绘制
    this.observePaintMetrics()

    // LCP - 最大内容绘制
    this.observeLCP()

    // FID - 首次输入延迟
    this.observeFID()

    // CLS - 累积布局偏移
    this.observeCLS()

    // TTFB - 首字节时间
    this.measureTTFB()

    // INP - 交互到下一帧（如果支持）
    this.observeINP()

    // TTI - 可交互时间
    this.measureTTI()
  }

  /** 观察绘制指标（FCP等） */
  private observePaintMetrics(): void {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime)
            this.recordMetric('FMP', entry.startTime)
          }
        }
      })
      paintObserver.observe({ type: 'paint', buffered: true })
      this.observers.push(paintObserver)
    } catch (e) {
      console.warn('[PerformanceMonitor] Paint observer not supported')
    }
  }

  /** 观察LCP */
  private observeLCP(): void {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]

        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime, {
            element: (lastEntry as any).element?.tagName,
            size: `${(lastEntry as any).size?.[0]}x${(lastEntry as any).size?.[1]}`
          })
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.push(lcpObserver)
    } catch (e) {
      console.warn('[PerformanceMonitor] LCP observer not supported')
    }
  }

  /** 观察FID */
  private observeFID(): void {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidValue = entry.processingStart - entry.startTime
          this.recordMetric('FID', fidValue, {
            eventType: entry.name,
            eventTarget: (entry as any).target?.tagName
          })
        }
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
      this.observers.push(fidObserver)
    } catch (e) {
      console.warn('[PerformanceMonitor] FID observer not supported')
    }
  }

  /** 观察CLS */
  private observeCLS(): void {
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.recordMetric('CLS', clsValue, {
          sessionValue: clsValue,
          recentInputCount: list.getEntries().filter(e => (e as any).hadRecentInput).length
        })
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      this.observers.push(clsObserver)
    } catch (e) {
      console.warn('[PerformanceMonitor] CLS observer not supported')
    }
  }

  /** 测量TTFB */
  private measureTTFB(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined

    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      this.recordMetric('TTFB', ttfb, {
        requestStart: navigation.requestStart,
        responseStart: navigation.responseStart,
        domainLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        connection: navigation.connectEnd - navigation.connectStart,
        tls: navigation.secureConnectionStart > 0
          ? navigation.connectEnd - navigation.secureConnectionStart
          : 0
      })

      // 同时记录导航类型
      const navTypes: Record<number, string> = {
        0: 'navigate',
        1: 'reload',
        2: 'back_forward'
      }
      const navType = navTypes[navigation.type] || 'unknown'
      this.setNavigationType(navType)
    }
  }

  /** 观察INP */
  private observeINP(): void {
    if ('InteractionCount' in performance) {
      try {
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('INP', entry.duration, {
              eventType: entry.name,
              processingDuration: entry.processingEnd - entry.processingStart
            })
          }
        })
        inpObserver.observe({ type: 'event', buffered: true })
        this.observers.push(inpObserver)
      } catch (e) {
        console.warn('[PerformanceMonitor] INP observer not supported')
      }
    }
  }

  /** 测量TTI */
  private measureTTI(): void {
    if ('PerformanceObserver' in window) {
      try {
        const ttiObserver = new PerformanceObserver((list) => {
          const longTasks = list.getEntries()
          // 简化的TTI计算：最后一个长任务之后的时间
          const lastLongTask = longTasks[longTasks.length - 1]
          if (lastLongTask) {
            const tti = lastLongTask.startTime + lastLongTask.duration
            this.recordMetric('TTI', tti)

            // 记录为长任务
            this.customMetrics.longTasks.push({
              name: 'longtask',
              duration: lastLongTask.duration,
              startTime: lastLongTask.startTime,
              timestamp: Date.now()
            })

            // 只保留最近50个长任务
            if (this.customMetrics.longTasks.length > 50) {
              this.customMetrics.longTasks = this.customMetrics.longTasks.slice(-50)
            }
          }
        })
        ttiObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(ttiObserver)
      } catch (e) {
        console.warn('[PerformanceMonitor] Long task observer not supported')
      }
    }
  }

  // ==================== 自定义指标收集器 ====================

  private initCustomMetricsCollectors(): void {
    // 监听资源加载
    this.observeResourceTiming()

    // 定期收集内存使用
    this.startMemoryMonitoring()
  }

  /** 监控资源加载 */
  private observeResourceTiming(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming
          const resourceType = this.getResourceType(resourceEntry.name)

          this.customMetrics.resourceLoadTimes.set(resourceEntry.name, {
            name: resourceEntry.name.split('/').pop() || resourceEntry.name,
            duration: Math.round(resourceEntry.duration),
            size: resourceEntry.transferSize || 0,
            type: resourceType,
            timestamp: Date.now()
          })
        }
      })
      resourceObserver.observe({ type: 'resource', buffered: true })
      this.observers.push(resourceObserver)
    } catch (e) {
      console.warn('[PerformanceMonitor] Resource timing observer failed')
    }
  }

  /** 获取资源类型 */
  private getResourceType(url: string): string {
    if (/\.(js)$/.test(url)) return 'script'
    if (/\.(css)$/.test(url)) return 'stylesheet'
    if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(url)) return 'image'
    if (/\.(woff2?|ttf|eot|otf)$/.test(url)) return 'font'
    return 'other'
  }

  /** 开始内存监控 */
  private startMemoryMonitoring(): void {
    if (!(performance as any).memory) return

    setInterval(() => {
      const memory = (performance as any).memory
      if (memory) {
        this.customMetrics.memoryUsage = {
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
          timestamp: Date.now()
        }
      }
    }, 10000) // 每10秒采样一次
  }

  // ==================== 公共API方法 ====================

  /**
   * 记录路由切换开始
   */
  startRouteChange(): void {
    this.routeChangeStartTime = performance.now()
  }

  /**
   * 记录路由切换结束
   */
  endRouteChange(routePath: string): number {
    if (this.routeChangeStartTime === 0) return 0

    const duration = Math.round(performance.now() - this.routeChangeStartTime)
    this.routeChangeStartTime = 0

    this.recordMetric('route_change', duration, {
      path: routePath,
      timestamp: Date.now()
    })

    this.customMetrics.routeChangeTime = duration

    // 检查是否超过阈值
    if (duration > performanceBudget.custom.routeChange) {
      this.triggerAlert(
        'slow_route_change',
        `路由切换较慢 (${duration}ms): ${routePath}`,
        duration
      )
    }

    return duration
  }

  /**
   * 记录API请求耗时
   */
  recordApiTiming(record: ApiTimingRecord): void {
    const key = record.url
    const existing = this.customMetrics.apiResponseTimes.get(key) || []

    existing.push(record.duration)
    this.customMetrics.apiResponseTimes.set(key, existing)

    // 检查是否是慢API
    if (record.duration > performanceBudget.alerts.slowApiThreshold) {
      this.triggerAlert(
        'slow_api',
        `慢API响应 (${record.duration}ms): ${record.method} ${record.url}`,
        record.duration
      )
    }

    // 保持每个URL最多100条记录
    if (existing.length > 100) {
      this.customMetrics.apiResponseTimes.set(key, existing.slice(-100))
    }
  }

  /**
   * 记录组件渲染耗时
   */
  recordComponentRender(componentName: string, duration: number): void {
    this.customMetrics.componentRenderTimes.set(componentName, duration)

    if (duration > performanceBudget.custom.componentRender) {
      this.triggerAlert(
        'slow_component_render',
        `组件渲染较慢 (${duration}ms): ${componentName}`,
        duration
      )
    }
  }

  /**
   * 手动记录自定义指标
   */
  recordCustomMetric(name: string, value: number, metadata?: Record<string, any>): void {
    this.recordMetric(name, value, metadata)
  }

  /**
   * 开始性能标记（用于测量代码块）
   */
  startMeasure(name: string): void {
    performance.mark(`${name}-start`)
  }

  /**
   * 结束性能标记并返回耗时
   */
  endMeasure(name: string): number {
    performance.mark(`${name}-end`)

    try {
      performance.measure(name, `${name}-start`, `${name}-end`)
      const measure = performance.getEntriesByName(name).pop()

      if (measure) {
        this.recordMetric(name, measure.duration)
        return measure.duration
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] Measure failed:', name, error)
    }

    return 0
  }

  /**
   * 设置导航类型
   */
  private setNavigationType(type: string): void {
    for (const metric of this.metrics.values()) {
      metric.navigationType = type
    }
  }

  // ==================== 内部方法 ====================

  /**
   * 记录指标
   */
  private recordMetric(
    name: string,
    value: number,
    metadata?: Record<string, any>
  ): void {
    const thresholds = performanceBudget.vitals[name.toUpperCase() as keyof typeof performanceBudget.vitals]

    let rating: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (thresholds) {
      rating = getPerformanceRating(value, thresholds)
    }

    const metric: PerformanceMetric = {
      name,
      value: Math.round(value * 100) / 100,
      rating,
      timestamp: Date.now(),
      metadata
    }

    this.metrics.set(name, metric)

    // 触发回调
    if (this.onMetricCallback) {
      this.onMetricCallback(metric)
    }

    // 开发环境输出日志
    if (import.meta.env.DEV && performanceBudget.alerts.enableConsoleWarning) {
      if (rating === 'poor') {
        console.warn(
          `[PerformanceMonitor] ⚠️ ${name} 较差: ${value}ms (阈值: ≤${thresholds?.good}ms良好, ≤${thresholds?.poor}ms需改进)`
        )
      } else if (rating === 'needs-improvement') {
        console.info(
          `[PerformanceMonitor] 💡 ${name} 待改进: ${value}ms (阈值: ≤${thresholds?.good}ms良好)`
        )
      }
    }
  }

  /**
   * 触发告警
   */
  private triggerAlert(type: string, message: string, value: number): void {
    if (!performanceBudget.alerts.enableConsoleWarning) return

    console.warn(`[PerformanceAlert] ${type}: ${message}`)

    // 发送自定义事件，供其他模块监听
    window.dispatchEvent(
      new CustomEvent('performanceAlert', {
        detail: { type, message, value, timestamp: Date.now() }
      })
    )
  }

  /**
   * 页面可见性变化时重新初始化某些观察器
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 页面重新可见时，可以重新初始化一些观察器
        // 这里可以根据需要添加逻辑
      }
    })
  }

  /**
   * 销毁所有观察器和资源
   */
  dispose(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.metrics.clear()
    this.isInitialized = false

    if (import.meta.env.DEV) {
      console.log('[PerformanceMonitor] 已销毁')
    }
  }

  /**
   * 导出当前所有数据（用于调试）
   */
  exportData(): {
    coreWebVitals: CoreWebVitals
    customMetrics: CustomMetrics
    allMetrics: PerformanceMetric[]
    exportTimestamp: number
  } {
    return {
      coreWebVitals: this.getCoreWebVitals(),
      customMetrics: this.getCustomMetrics(),
      allMetrics: this.getAllMetrics(),
      exportTimestamp: Date.now()
    }
  }
}

/** 全局性能监控实例 */
export const perfMonitor = new PerformanceMonitor()

/**
 * 性能测量装饰器工厂
 * 用于自动测量方法执行时间
 */
export function withPerformanceTracking(metricName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const name = metricName || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      perfMonitor.startMeasure(name)
      try {
        const result = await originalMethod.apply(this, args)
        perfMonitor.endMeasure(name)
        return result
      } catch (error) {
        perfMonitor.endMeasure(name)
        throw error
      }
    }

    return descriptor
  }
}
