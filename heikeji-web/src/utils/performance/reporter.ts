/**
 * 性能数据上报器
 * 负责批量收集、采样控制、数据格式化和发送性能指标
 * 支持多种上报方式：sendBeacon、fetch keepalive、Image beacon
 */

import { performanceBudget } from '@/config/performance.config'
import type { PerformanceMetric } from './monitor'
import { perfMonitor } from './monitor'

/** 性能数据上报格式 */
export interface PerformanceData {
  timestamp: number
  url: string
  metricName: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  metadata?: Record<string, any>
  userAgent: string
  sessionId: string
  userId?: string
}

/** 上报器配置 */
interface ReporterConfig {
  endpoint: string
  sampleRate: number
  batchSize: number
  flushInterval: number
  sendOnPageHide: boolean
  maxQueueSize: number
}

/** 上报结果 */
interface ReportResult {
  success: boolean
  count: number
  method: 'beacon' | 'fetch' | 'image'
  timestamp: number
}

class PerformanceReporter {
  private queue: PerformanceData[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private config: ReporterConfig
  private sessionId: string
  private retryCount = 0
  private isFlushing = false

  constructor(config?: Partial<ReporterConfig>) {
    this.config = {
      endpoint: performanceBudget.reporting.endpoint,
      sampleRate: performanceBudget.reporting.sampleRate,
      batchSize: performanceBudget.reporting.batchSize,
      flushInterval: performanceBudget.reporting.flushInterval,
      sendOnPageHide: performanceBudget.reporting.sendOnPageHide,
      maxQueueSize: performanceBudget.reporting.maxQueueSize,
      ...config
    }

    this.sessionId = this.generateSessionId()
    this.init()
  }

  /**
   * 初始化上报器
   */
  private init(): void {
    // 启动定时刷新
    if (this.config.flushInterval > 0) {
      this.startAutoFlush()
    }

    // 监听页面隐藏事件，立即上报剩余数据
    if (this.config.sendOnPageHide) {
      this.setupPageHideListener()
    }

    // 监听页面卸载事件
    window.addEventListener('beforeunload', () => {
      this.flush(true)
    })

    if (import.meta.env.DEV) {
      console.log(
        `[PerformanceReporter] 初始化完成 (采样率: ${this.config.sampleRate * 100}%, 批量大小: ${this.config.batchSize})`
      )
    }
  }

  /**
   * 添加性能数据到队列
   */
  addMetric(metric: PerformanceMetric): void {
    // 采样率检查
    if (!this.shouldSample()) return

    // 队列大小检查
    if (this.queue.length >= this.config.maxQueueSize) {
      this.queue.shift() // 移除最旧的数据
    }

    const data: PerformanceData = {
      timestamp: metric.timestamp,
      url: window.location.href,
      metricName: metric.name,
      value: metric.value,
      rating: metric.rating,
      metadata: metric.metadata,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    }

    this.queue.push(data)

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[PerformanceReporter] 添加指标: ${metric.name} = ${metric.value}`)
    }

    // 检查是否达到批量大小
    if (this.queue.length >= this.config.batchSize) {
      this.flush(false)
    }
  }

  /**
   * 手动触发刷新（立即上报）
   */
  flush(isSync: boolean = false): Promise<ReportResult> {
    if (this.queue.length === 0 || this.isFlushing) {
      return Promise.resolve({
        success: true,
        count: 0,
        method: 'fetch',
        timestamp: Date.now()
      })
    }

    this.isFlushing = true
    const dataToSend = [...this.queue]
    this.queue = []

    return this.sendData(dataToSend, isSync)
      .then((result) => {
        this.retryCount = 0
        this.isFlushing = false
        return result
      })
      .catch((error) => {
        console.error('[PerformanceReporter] 上报失败:', error)

        // 失败重试
        if (this.retryCount < 3) {
          this.retryCount++
          this.queue.unshift(...dataToSend) // 将数据放回队列头部

          setTimeout(() => {
            this.flush(false)
          }, 1000 * this.retryCount) // 指数退避
        }

        this.isFlushing = false
        throw error
      })
  }

  /**
   * 获取当前队列大小
   */
  getQueueLength(): number {
    return this.queue.length
  }

  /**
   * 清空队列
   */
  clearQueue(): void {
    this.queue = []
  }

  /**
   * 销毁上报器
   */
  destroy(): void {
    this.stopAutoFlush()

    // 尝试最后上报一次
    if (this.queue.length > 0) {
      this.flush(true).catch(() => {})
    }

    this.clearQueue()
  }

  // ==================== 内部方法 ====================

  /**
   * 发送数据
   */
  private async sendData(
    data: PerformanceData[],
    isSync: boolean
  ): Promise<ReportResult> {
    let result: ReportResult

    try {
      // 优先使用 sendBeacon（同步、不阻塞）
      if (isSync && typeof navigator.sendBeacon === 'function') {
        result = await this.sendViaBeacon(data)
      }
      // 其次使用 fetch with keepalive
      else if ('keepalive' in Request.prototype || typeof fetch !== 'undefined') {
        result = await this.sendViaFetch(data)
      }
      // 最后降级为 Image beacon
      else {
        result = await this.sendViaImageBeacon(data)
      }

      if (import.meta.env.DEV) {
        console.log(
          `[PerformanceReporter] 成功上报 ${result.count} 条数据 (${result.method})`
        )
      }

      return result
    } catch (error) {
      console.error('[PerformanceReporter] 所有上报方式均失败:', error)
      throw error
    }
  }

  /**
   * 使用 sendBeacon 发送（推荐用于页面卸载时）
   */
  private sendViaBeacon(data: PerformanceData[]): ReportResult {
    const payload = JSON.stringify({
      metrics: data,
      sentAt: new Date().toISOString(),
      version: '1.0.0',
      userAgent: navigator.userAgent
    })

    const blob = new Blob([payload], { type: 'application/json' })
    const success = navigator.sendBeacon(this.config.endpoint, blob)

    return {
      success,
      count: data.length,
      method: 'beacon',
      timestamp: Date.now()
    }
  }

  /**
   * 使用 fetch with keepalive 发送
   */
  private async sendViaFetch(data: PerformanceData[]): Promise<ReportResult> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metrics: data,
        sentAt: new Date().toISOString(),
        version: '1.0.0',
        userAgent: navigator.userAgent
      }),
      keepalive: true // 允许在页面卸载后继续请求
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return {
      success: true,
      count: data.length,
      method: 'fetch',
      timestamp: Date.now()
    }
  }

  /**
   * 使用 Image beacon 发送（最终降级方案）
   */
  private sendViaImageBeacon(data: PerformanceData[]): ReportResult {
    return new Promise((resolve, reject) => {
      try {
        // 只发送关键指标，避免URL过长
        const criticalMetrics = data.filter(m =>
          ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'].includes(m.metricName)
        )

        const payload = btoa(encodeURIComponent(JSON.stringify(criticalMetrics)))
        const img = new Image()

        img.onload = () =>
          resolve({
            success: true,
            count: criticalMetrics.length,
            method: 'image',
            timestamp: Date.now()
          })

        img.onerror = () => reject(new Error('Image beacon failed'))

        // URL长度限制在2KB以内
        const url = `${this.config.endpoint}?data=${payload.slice(0, 2000)}`
        img.src = url
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 采样率检查
   */
  private shouldSample(): boolean {
    if (this.config.sampleRate >= 1) return true
    if (this.config.sampleRate <= 0) return false

    return Math.random() < this.config.sampleRate
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 9)
    return `perf_${timestamp}_${random}`
  }

  /**
   * 启动自动定时刷新
   */
  private startAutoFlush(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush(false).catch(() => {})
    }, this.config.flushInterval)
  }

  /**
   * 停止自动定时刷新
   */
  private stopAutoFlush(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  /**
   * 设置页面隐藏监听器
   */
  private setupPageHideListener(): void {
    // visibilitychange 更可靠
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.queue.length > 0) {
        this.flush(true).catch(() => {})
      }
    })

    // pagehide 作为备选
    window.addEventListener('pagehide', () => {
      if (this.queue.length > 0) {
        this.flush(true).catch(() => {})
      }
    })

    // iOS Safari 特殊处理
    ;(window as any).addEventListener('freeze', () => {
      if (this.queue.length > 0) {
        this.flush(true).catch(() => {})
      }
    })
  }
}

/** 全局性能上报器实例 */
export const perfReporter = new PerformanceReporter()

/**
 * 连接监控器和上报器
 * 当监控器收集到新指标时自动上报
 */
export function connectMonitorToReporter(): void {
  perfMonitor.onMetric((metric: PerformanceMetric) => {
    perfReporter.addMetric(metric)
  })

  if (import.meta.env.DEV) {
    console.log('[Performance] 监控器与上报器已连接')
  }
}
