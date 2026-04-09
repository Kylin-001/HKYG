import { onMounted, onUnmounted } from 'vue'

interface PerformanceMetrics {
  FCP: number | null
  LCP: number | null
  FID: number | null
  CLS: number | null
  TTFB: number | null
}

export function usePerformanceMonitor() {
  const metrics = ref<PerformanceMetrics>({
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
  })

  let observer: PerformanceObserver | null = null

  function measureFCP() {
    try {
      const entry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry
      metrics.value.FCP = Math.round(entry.startTime)
    } catch (err) {
      console.warn('[Perf] FCP测量失败:', err)
    }
  }

  function measureLCP() {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.value.LCP = Math.round(lastEntry.startTime)

        if (metrics.value.LCP > 2500) {
          console.warn(`[Perf] LCP 较慢 (${metrics.value.LCP}ms)，建议优化`)
        }
      })

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      observer = lcpObserver
    } catch (err) {
      console.warn('[Perf] LCP观察器创建失败:', err)
    }
  }

  function measureFID() {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0]
        metrics.value.FID = Math.round(firstInput.processingStart - firstInput.startTime)

        if (metrics.value.FID! > 100) {
          console.warn(`[Perf] FID 较慢 (${metrics.value.FID}ms)，建议优化交互响应`)
        }
      })

      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (err) {
      console.warn('[Perf] FID观察器创建失败:', err)
    }
  }

  function measureCLS() {
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        metrics.value.CLS = Math.round(clsValue * 1000) / 1000

        if (metrics.value.CLS > 0.1) {
          console.warn(`[Perf] CLS 较高 (${metrics.value.CLS})，建议优化布局稳定性`)
        }
      })

      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch (err) {
      console.warn('[Perf] CLS观察器创建失败:', err)
    }
  }

  function measureTTFB() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      metrics.value.TTFB = Math.round(navigation.responseStart - navigation.requestStart)
    } catch (err) {
      console.warn('[Perf] TTFB测量失败:', err)
    }
  }

  function reportMetrics() {
    if (import.meta.env.PROD && typeof navigator.sendBeacon === 'function') {
      try {
        const data = {
          url: window.location.href,
          timestamp: Date.now(),
          metrics: metrics.value,
          userAgent: navigator.userAgent,
        }

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        navigator.sendBeacon('/api/performance', blob)
      } catch (err) {
        console.warn('[Perf] 性能数据上报失败:', err)
      }
    } else {
      console.table({
        '首屏绘制(FCP)': `${metrics.value.FCP || '-'}ms`,
        '最大内容绘制(LCP)': `${metrics.value.LCP || '-'}ms`,
        '首次输入延迟(FID)': `${metrics.value.FID || '-'}ms`,
        '累积布局偏移(CLS)': metrics.value.CLS ?? '-',
        '首字节时间(TTFB)': `${metrics.value.TTFB || '-'}ms`,
      })
    }
  }

  onMounted(() => {
    if ('PerformanceObserver' in window) {
      measureLCP()
      measureFID()
      measureCLS()
    }

    measureFCP()
    measureTTFB()

    setTimeout(reportMetrics, 3000)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    metrics,
    reportMetrics,
  }
}
