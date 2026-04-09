/**
 * 性能预算配置
 * 定义Web Vitals阈值、资源大小限制、自定义指标阈值和告警规则
 */

export interface PerformanceThresholds {
  good: number
  poor: number
}

export interface PerformanceBudgetConfig {
  /** Web Vitals 阈值（毫秒） */
  vitals: {
    LCP: PerformanceThresholds // Largest Contentful Paint - 最大内容绘制
    FID: PerformanceThresholds // First Input Delay - 首次输入延迟
    CLS: PerformanceThresholds // Cumulative Layout Shift - 累积布局偏移
    FCP: PerformanceThresholds // First Contentful Paint - 首次内容绘制
    TTFB: PerformanceThresholds // Time to First Byte - 首字节时间
    INP?: PerformanceThresholds // Interaction to Next Paint - 交互到下一次绘制
  }

  /** 资源大小限制（KB） */
  resources: {
    totalJS: number // JS总大小
    totalCSS: number // CSS总大小
    totalImages: number // 图片总大小
    singleBundle: number // 单个bundle大小
    font: number // 字体大小
    thirdParty: number // 第三方资源总大小
  }

  /** 自定义性能阈值（毫秒） */
  custom: {
    routeChange: number // 路由切换耗时
    apiResponse: number // API响应时间
    componentRender: number // 组件渲染耗时
    longTask: number // 长任务阈值
    hydration: number // SSR水合时间
    firstScreen: number // 首屏时间
  }

  /** 告警规则 */
  alerts: {
    enableConsoleWarning: boolean // 控制台告警
    enableToast: boolean // Toast提示
    slowApiThreshold: number // 慢API阈值(ms)
    largeBundleThreshold: number // 大包阈值(KB)
    memoryUsageThreshold: number // 内存使用率阈值(MB)
    errorRateThreshold: number // 错误率阈值(%)
  }

  /** 上报配置 */
  reporting: {
    endpoint: string // 上报接口
    sampleRate: number // 采样率(0-1)
    batchSize: number // 批量大小
    flushInterval: number // 刷新间隔(ms)
    sendOnPageHide: boolean // 页面隐藏时发送
    maxQueueSize: number // 最大队列大小
  }
}

/** 默认性能预算配置 */
export const performanceBudget: PerformanceBudgetConfig = {
  vitals: {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 }
  },

  resources: {
    totalJS: 500,
    totalCSS: 200,
    totalImages: 1000,
    singleBundle: 300,
    font: 100,
    thirdParty: 200
  },

  custom: {
    routeChange: 1000,
    apiResponse: 2000,
    componentRender: 100,
    longTask: 50,
    hydration: 3000,
    firstScreen: 1500
  },

  alerts: {
    enableConsoleWarning: true,
    enableToast: false,
    slowApiThreshold: 3000,
    largeBundleThreshold: 200,
    memoryUsageThreshold: 100,
    errorRateThreshold: 5
  },

  reporting: {
    endpoint: '/api/performance/collect',
    sampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    batchSize: 20,
    flushInterval: 30000,
    sendOnPageHide: true,
    maxQueueSize: 100
  }
}

/**
 * 性能评级工具函数
 * 根据值和阈值返回评级
 */
export function getPerformanceRating(
  value: number,
  thresholds: PerformanceThresholds
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * 计算性能分数 (0-100)
 * 基于所有核心指标的加权平均
 */
export function calculatePerformanceScore(metrics: Record<string, number>): number {
  const weights = {
    LCP: 0.3,
    FID: 0.2,
    CLS: 0.25,
    FCP: 0.15,
    TTFB: 0.1
  }

  let totalScore = 0
  let totalWeight = 0

  for (const [metric, weight] of Object.entries(weights)) {
    if (metrics[metric] !== undefined && metrics[metric] !== null) {
      const thresholds = performanceBudget.vitals[metric as keyof typeof performanceBudget.vitals]
      if (thresholds) {
        const rating = getPerformanceRating(metrics[metric], thresholds)
        let score = 0

        switch (rating) {
          case 'good':
            score = 90 + Math.min(10, (thresholds.good - metrics[metric]) / thresholds.good * 10)
            break
          case 'needs-improvement':
            score = 50 + ((thresholds.poor - metrics[metric]) / (thresholds.poor - thresholds.good)) * 40
            break
          case 'poor':
            score = Math.max(0, 50 - ((metrics[metric] - thresholds.poor) / thresholds.poor) * 50)
            break
        }

        totalScore += score * weight
        totalWeight += weight
      }
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}
