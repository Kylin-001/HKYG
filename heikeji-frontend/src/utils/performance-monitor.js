/**
 * 前端性能监控和优化系统
 * @fileoverview 全面的前端性能监控、分析和优化工具
 */

import { debounce, throttle, performanceMonitor } from './performance'
import logger from './logger'

// 性能指标类型定义
const METRICS_TYPES = {
  // 核心Web指标
  LCP: 'largest-contentful-paint', // 最大内容绘制
  FID: 'first-input-delay', // 首次输入延迟
  CLS: 'layout-shift-score', // 累积布局偏移

  // 自定义指标
  FCP: 'first-contentful-paint', // 首次内容绘制
  TTI: 'interactive', // 可交互时间
  TTFB: 'response', // 首字节时间

  // 性能指标
  NAVIGATION: 'navigation',
  RESOURCE: 'resource',
  MARKS: 'mark',
  MEASURES: 'measure',
}

// 性能监控配置
const DEFAULT_CONFIG = {
  enableWebVitals: true,
  enableResourceTiming: true,
  enableUserTiming: true,
  enableErrorTracking: true,
  batchSize: 10,
  flushInterval: 5000, // 5秒批量发送
  sampleRate: 1, // 1.0表示100%采样
  endpoint: '/api/performance/collect',
  debug: process.env.NODE_ENV === 'development',
}

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.metrics = []
    this.subscribers = new Map()
    this.batchQueue = []
    this.flushTimer = null
    this.isInitialized = false

    this.init()
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (this.isInitialized) return

    // 检查浏览器支持
    if (!this.isSupported()) {
      logger.warn('当前浏览器不支持性能监控API')
      return
    }

    this.setupWebVitals()
    this.setupResourceTiming()
    this.setupErrorTracking()
    this.setupBatchProcessing()

    this.isInitialized = true
    this.log('性能监控系统已初始化')
  }

  /**
   * 检查浏览器支持
   */
  isSupported() {
    return (
      typeof performance !== 'undefined' &&
      typeof performance.mark === 'function' &&
      typeof performance.measure === 'function'
    )
  }

  /**
   * 设置Web Vitals监控
   */
  setupWebVitals() {
    if (!this.config.enableWebVitals) return

    // 使用PerformanceObserver监听Web Vitals
    try {
      // LCP监控
      this.observeMetric('largest-contentful-paint', entries => {
        const lastEntry = entries[entries.length - 1]
        this.collectMetric({
          type: METRICS_TYPES.LCP,
          name: 'Largest Contentful Paint',
          value: lastEntry.startTime,
          rating: this.rateLCP(lastEntry.startTime),
          timestamp: Date.now(),
          metadata: {
            element: lastEntry.element?.tagName,
            size: lastEntry.size,
          },
        })
      })

      // FID监控
      this.observeMetric('first-input', entries => {
        const firstEntry = entries[0]
        this.collectMetric({
          type: METRICS_TYPES.FID,
          name: 'First Input Delay',
          value: firstEntry.processingStart - firstEntry.startTime,
          rating: this.rateFID(firstEntry.processingStart - firstEntry.startTime),
          timestamp: Date.now(),
          metadata: {
            eventType: firstEntry.name,
            target: firstEntry.target?.tagName,
          },
        })
      })

      // CLS监控
      this.observeLayoutShift()
    } catch (error) {
      this.log('Web Vitals设置失败:', error)
    }
  }

  /**
   * 监控布局偏移（CLS）
   */
  observeLayoutShift() {
    if ('LayoutShift' in window) {
      let clsValue = 0

      this.observeMetric('layout-shift', entries => {
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }

        this.collectMetric({
          type: METRICS_TYPES.CLS,
          name: 'Cumulative Layout Shift',
          value: clsValue,
          rating: this.rateCLS(clsValue),
          timestamp: Date.now(),
          metadata: {
            sources: entries.length,
          },
        })
      })
    }
  }

  /**
   * 设置资源性能监控
   */
  setupResourceTiming() {
    if (!this.config.enableResourceTiming) return

    this.observeMetric('resource', entries => {
      entries.forEach(entry => {
        this.collectMetric({
          type: METRICS_TYPES.RESOURCE,
          name: 'Resource Timing',
          value: entry.duration,
          timestamp: Date.now(),
          metadata: {
            url: entry.name,
            initiatorType: entry.initiatorType,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            domainLookupTime: entry.domainLookupEnd - entry.domainLookupStart,
            connectionTime: entry.connectEnd - entry.connectStart,
            requestTime: entry.responseStart - entry.requestStart,
            responseTime: entry.responseEnd - entry.responseStart,
            domContentLoadedTime: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          },
        })
      })
    })

    // 监控导航性能
    this.observeNavigationTiming()
  }

  /**
   * 监控导航性能
   */
  observeNavigationTiming() {
    this.observeMetric('navigation', entries => {
      const navigation = entries[0]

      this.collectMetric({
        type: METRICS_TYPES.NAVIGATION,
        name: 'Navigation Timing',
        value: navigation.loadEventEnd - navigation.navigationStart,
        timestamp: Date.now(),
        metadata: {
          // DNS查询时间
          dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP连接时间
          tcpTime: navigation.connectEnd - navigation.connectStart,
          // 请求时间
          requestTime: navigation.responseStart - navigation.requestStart,
          // 响应时间
          responseTime: navigation.responseEnd - navigation.responseStart,
          // DOM解析时间
          domParseTime: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          // 资源加载时间
          loadTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
          // 首字节时间
          ttfb: navigation.responseStart - navigation.navigationStart,
          // DOM就绪时间
          domReadyTime: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        },
      })
    })
  }

  /**
   * 设置错误监控
   */
  setupErrorTracking() {
    if (!this.config.enableErrorTracking) return

    // 捕获JavaScript错误
    window.addEventListener('error', event => {
      this.collectMetric({
        type: 'error',
        name: 'JavaScript Error',
        value: 1,
        timestamp: Date.now(),
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        },
      })
    })

    // 捕获Promise错误
    window.addEventListener('unhandledrejection', event => {
      this.collectMetric({
        type: 'error',
        name: 'Unhandled Promise Rejection',
        value: 1,
        timestamp: Date.now(),
        metadata: {
          reason: event.reason?.toString(),
          stack: event.reason?.stack,
        },
      })
    })
  }

  /**
   * 设置批量处理
   */
  setupBatchProcessing() {
    // 定期批量发送数据
    this.flushTimer = setInterval(() => {
      this.flushBatch()
    }, this.config.flushInterval)

    // 页面卸载时发送剩余数据
    window.addEventListener('beforeunload', () => {
      this.flushBatch(true)
    })
  }

  /**
   * 创建性能标记
   */
  mark(name, detail = {}) {
    if (!this.isSupported()) return

    performance.mark(name, { detail })
    this.log(`性能标记: ${name}`)
  }

  /**
   * 测量性能
   */
  measure(name, startMark, endMark, detail = {}) {
    if (!this.isSupported()) return null

    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]

      this.collectMetric({
        type: METRICS_TYPES.MEASURES,
        name,
        value: measure.duration,
        timestamp: Date.now(),
        metadata: {
          startTime: measure.startTime,
          endTime: measure.endTime,
          ...detail,
        },
      })

      this.log(`性能测量: ${name} = ${measure.duration.toFixed(2)}ms`)
      return measure.duration
    } catch (error) {
      this.log(`性能测量失败: ${name}`, error)
      return null
    }
  }

  /**
   * 监控组件渲染性能
   */
  monitorComponent(componentName, renderFunction) {
    return performanceMonitor({
      [componentName]: renderFunction,
    })[componentName]
  }

  /**
   * 监控网络请求
   */
  monitorRequest(url, options = {}) {
    const startTime = performance.now()
    const requestId = this.generateId()

    this.mark(`request-start-${requestId}`, { url, method: options.method || 'GET' })

    return fetch(url, options)
      .then(response => {
        const endTime = performance.now()
        const duration = endTime - startTime

        this.mark(`request-end-${requestId}`)
        this.measure(
          `request-${requestId}`,
          `request-start-${requestId}`,
          `request-end-${requestId}`,
          {
            url,
            method: options.method || 'GET',
            status: response.status,
            success: response.ok,
          }
        )

        return response
      })
      .catch(error => {
        const endTime = performance.now()
        const duration = endTime - startTime

        this.mark(`request-error-${requestId}`)
        this.measure(
          `request-error-${requestId}`,
          `request-start-${requestId}`,
          `request-error-${requestId}`,
          {
            url,
            method: options.method || 'GET',
            error: error.message,
          }
        )

        throw error
      })
  }

  /**
   * 收集性能指标
   */
  collectMetric(metric) {
    // 采样检查
    if (Math.random() > this.config.sampleRate) {
      return
    }

    // 添加基础信息
    metric.id = this.generateId()
    metric.url = window.location.href
    metric.userAgent = navigator.userAgent
    metric.connection = this.getConnectionInfo()

    this.batchQueue.push(metric)

    // 通知订阅者
    this.notifySubscribers(metric.type, metric)

    // 如果达到批量大小，立即发送
    if (this.batchQueue.length >= this.config.batchSize) {
      this.flushBatch()
    }
  }

  /**
   * 批量发送数据
   */
  flushBatch(isUnload = false) {
    if (this.batchQueue.length === 0) return

    const batch = [...this.batchQueue]
    this.batchQueue = []

    if (isUnload) {
      // 页面卸载时使用sendBeacon
      this.sendWithBeacon(batch)
    } else {
      // 正常情况下异步发送
      this.sendBatch(batch).catch(error => {
        logger.error('性能数据发送失败:', error)
      })
    }
  }

  /**
   * 发送批量数据
   */
  async sendBatch(batch) {
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch,
          timestamp: Date.now(),
          version: '1.0.0',
        }),
      })

      this.log(`已发送${batch.length}条性能数据`)
    } catch (error) {
      this.log('发送性能数据失败:', error)
      throw error
    }
  }

  /**
   * 使用sendBeacon发送数据
   */
  sendWithBeacon(data) {
    if ('sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify({ batch: data, timestamp: Date.now() })], {
        type: 'application/json',
      })

      navigator.sendBeacon(this.config.endpoint, blob)
    }
  }

  /**
   * 订阅性能指标
   */
  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set())
    }
    this.subscribers.get(type).add(callback)

    // 返回取消订阅函数
    return () => {
      const subscribers = this.subscribers.get(type)
      if (subscribers) {
        subscribers.delete(callback)
      }
    }
  }

  /**
   * 通知订阅者
   */
  notifySubscribers(type, metric) {
    const subscribers = this.subscribers.get(type)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(metric)
        } catch (error) {
          logger.error('性能监控订阅者错误:', error)
        }
      })
    }
  }

  /**
   * 性能评级
   */
  rateLCP(value) {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }

  rateFID(value) {
    if (value <= 100) return 'good'
    if (value <= 300) return 'needs-improvement'
    return 'poor'
  }

  rateCLS(value) {
    if (value <= 0.1) return 'good'
    if (value <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  /**
   * 获取网络连接信息
   */
  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }
    }
    return null
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  /**
   * 创建性能观察者
   */
  observeMetric(type, callback) {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver(list => {
        callback(list.getEntries())
      })

      observer.observe({ type, buffered: true })
      return observer
    } catch (error) {
      this.log(`创建性能观察者失败: ${type}`, error)
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    if (!this.isSupported()) return null

    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    const marks = performance.getEntriesByType('mark')
    const measures = performance.getEntriesByType('measure')

    return {
      navigation: navigation
        ? {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            ttfb: navigation.responseStart - navigation.navigationStart,
          }
        : null,
      paint: paint.reduce((acc, entry) => {
        acc[entry.name] = entry.startTime
        return acc
      }, {}),
      customMarks: marks.map(mark => ({
        name: mark.name,
        startTime: mark.startTime,
      })),
      customMeasures: measures.map(measure => ({
        name: measure.name,
        duration: measure.duration,
        startTime: measure.startTime,
      })),
      memory: performance.memory
        ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          }
        : null,
    }
  }

  /**
   * 清理资源
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    this.subscribers.clear()
    this.isInitialized = false

    this.log('性能监控系统已清理')
  }

  /**
   * 日志输出
   */
  log(...args) {
    if (this.config.debug) {
      logger.debug('[PerformanceMonitor]', ...args)
    }
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor()

// Vue插件形式导出
const PerformanceMonitorPlugin = {
  install(Vue, options = {}) {
    const monitor = new PerformanceMonitor(options)

    // 添加到Vue原型
    Vue.prototype.$performance = monitor

    // 添加全局指令和混入
    Vue.mixin({
      created() {
        // 组件创建时开始性能监控
        if (this.$options.name) {
          monitor.mark(`component-created-${this.$options.name}`)
        }
      },

      mounted() {
        // 组件挂载完成
        if (this.$options.name) {
          monitor.mark(`component-mounted-${this.$options.name}`)
        }
      },

      beforeDestroy() {
        // 组件销毁前
        if (this.$options.name) {
          monitor.mark(`component-destroyed-${this.$options.name}`)
          monitor.measure(
            `component-lifecycle-${this.$options.name}`,
            `component-created-${this.$options.name}`,
            `component-destroyed-${this.$options.name}`
          )
        }
      },
    })
  },
}

export default PerformanceMonitor
export { performanceMonitor, PerformanceMonitorPlugin }

// 工具函数
export const createCustomMetric = (name, value, metadata = {}) => ({
  type: 'custom',
  name,
  value,
  timestamp: Date.now(),
  metadata,
})

export const measureComponentRender = (componentName, renderFn) => {
  return function (...args) {
    performance.mark(`${componentName}-render-start`)

    const result = renderFn.apply(this, args)

    performance.mark(`${componentName}-render-end`)
    performance.measure(
      `${componentName}-render`,
      `${componentName}-render-start`,
      `${componentName}-render-end`
    )

    return result
  }
}

export const measureAsyncFunction = (name, fn) => {
  return async function (...args) {
    performance.mark(`${name}-start`)

    try {
      const result = await fn.apply(this, args)
      performance.mark(`${name}-end`)
      performance.measure(`${name}`, `${name}-start`, `${name}-end`)
      return result
    } catch (error) {
      performance.mark(`${name}-error`)
      performance.measure(`${name}-error`, `${name}-start`, `${name}-error`)
      throw error
    }
  }
}
