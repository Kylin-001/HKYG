/**
 * 性能监控模块
 * 提供轻量级性能监控功能，确保Vue 2兼容性
 */

import logger from '../utils/logger'

class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.isSupported = typeof window !== 'undefined' && 'performance' in window
  }

  // 记录性能标记
  mark(name) {
    if (this.isSupported) {
      performance.mark(name)
    }
  }

  // 测量性能
  measure(name, startMark, endMark) {
    if (this.isSupported && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name)[0]
        return measure ? measure.duration : 0
      } catch (e) {
        logger.warn('Performance measurement failed:', e)
        return 0
      }
    }
    return 0
  }

  // 获取导航计时
  getNavigationTiming() {
    if (!this.isSupported) return {}

    const navigation = performance.getEntriesByType('navigation')[0]
    return {
      DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP: navigation.connectEnd - navigation.connectStart,
      SSL: navigation.connectEnd - navigation.secureConnectionStart,
      TTFB: navigation.responseStart - navigation.requestStart,
      Download: navigation.responseEnd - navigation.responseStart,
      DOM: navigation.domInteractive - navigation.responseEnd,
      Load: navigation.loadEventEnd - navigation.loadEventStart,
    }
  }

  // 核心网络指标监控
  monitorNetworkMetrics() {
    if (!this.isSupported) return

    const navigation = performance.getEntriesByType('navigation')[0]
    if (!navigation) return

    const metrics = {
      name: 'Network Performance',
      DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP: navigation.connectEnd - navigation.connectStart,
      TTFB: navigation.responseStart - navigation.requestStart,
      Transfer: navigation.responseEnd - navigation.responseStart,
      DOM: navigation.domInteractive - navigation.responseEnd,
      Load: navigation.loadEventEnd - navigation.loadEventStart,
    }

    // 只在开发环境输出性能数据
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('🌐 网络性能指标:', metrics)
    }

    this.metrics.network = metrics
  }

  // 初始化性能监控
  init(router) {
    if (!this.isSupported) {
      if (process.env.NODE_ENV !== 'production') {
        logger.warn('Performance API not supported')
      }
      return
    }

    // 监控页面加载完成后的网络指标
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.monitorNetworkMetrics()
      }, 0)
    })

    // 监控路由切换性能
    if (router) {
      router.afterEach((to, from) => {
        this.mark(`route-${to.name || to.path}`)
        this.measure(
          `route-transition-${to.name || to.path}`,
          `route-${from.name || from.path}`,
          `route-${to.name || to.path}`
        )
      })
    }
  }

  // 清理资源
  destroy() {
    this.metrics = {}
  }
}

// 创建单例实例
let performanceMonitorInstance = null

// 获取性能监控实例
export function getPerformanceMonitor() {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor()
  }
  return performanceMonitorInstance
}

// 导出性能监控混入
export const performanceMixin = {
  data() {
    return {
      _performanceStart: null,
    }
  },

  beforeCreate() {
    if (process.env.NODE_ENV !== 'production') {
      this._performanceStart = performance.now()
    }
  },

  mounted() {
    if (process.env.NODE_ENV !== 'production' && this.$options.name) {
      const mountTime = performance.now() - this._performanceStart
      if (mountTime > 50) {
        // 降低阈值以捕获更多性能问题
        logger.debug(`⚡ ${this.$options.name} 组件挂载时间: ${mountTime.toFixed(2)}ms`)
      }
    }
  },
}

// 导出默认实例
export default getPerformanceMonitor()
