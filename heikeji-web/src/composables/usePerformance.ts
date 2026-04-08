import { ref, onMounted, onUnmounted } from 'vue'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface CoreWebVitals {
  fcp: PerformanceMetric | null
  lcp: PerformanceMetric | null
  fid: PerformanceMetric | null
  cls: PerformanceMetric | null
  inp: PerformanceMetric | null
  ttfb: PerformanceMetric | null
}

interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  usagePercent: number
}

const VITAL_THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  inp: { good: 200, poor: 500 },
  ttfb: { good: 800, poor: 1800 },
}

function rateMetric(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITAL_THRESHOLDS[name as keyof typeof VITAL_THRESHOLDS]
  if (!thresholds) return 'good'
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

export function usePerformance() {
  const metrics = ref<PerformanceMetric[]>([])
  const coreVitals = ref<CoreWebVitals>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    inp: null,
    ttfb: null,
  })
  const memoryInfo = ref<MemoryInfo | null>(null)
  const isLowPerformance = ref(false)
  const longTasks = ref<number[]>([])

  let observer: PerformanceObserver | null = null
  let longTaskObserver: PerformanceObserver | null = null

  function observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            const metric: PerformanceMetric = {
              name: entry.name === 'first-contentful-paint' ? 'fcp' : entry.name,
              value: entry.startTime,
              rating: rateMetric(entry.name === 'first-contentful-paint' ? 'fcp' : entry.name, entry.startTime),
              timestamp: Date.now(),
            }
            metrics.value.push(metric)

            if (entry.name === 'first-contentful-paint') {
              coreVitals.value.fcp = metric
            }
          }

          if (entry.entryType === 'largest-contentful-paint') {
            const metric: PerformanceMetric = {
              name: 'lcp',
              value: entry.startTime,
              rating: rateMetric('lcp', entry.startTime),
              timestamp: Date.now(),
            }
            coreVitals.value.lcp = metric
          }

          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const currentCls = coreVitals.value.cls?.value || 0
            const newValue = currentCls + (entry as any).value
            const metric: PerformanceMetric = {
              name: 'cls',
              value: Number(newValue.toFixed(4)),
              rating: rateMetric('cls', newValue),
              timestamp: Date.now(),
            }
            coreVitals.value.cls = metric
          }

          if (entry.entryType === 'first-input') {
            const processingStart = (entry as any).processingStart
            const startTime = entry.startTime
            const delay = processingStart - startTime

            const metric: PerformanceMetric = {
              name: 'fid',
              value: delay,
              rating: rateMetric('fid', delay),
              timestamp: Date.now(),
            }
            coreVitals.value.fid = metric
          }
        }
      })

      observer.observe({
        type: 'paint',
        buffered: true,
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      observer.observe({ type: 'layout-shift', buffered: true })
      observer.observe({ type: 'first-input', buffered: true })

      if ('PerformanceEventTiming' in window) {
        try {
          observer.observe({ type: 'interaction-to-next-paint', buffered: true })
        } catch {}
      }
    } catch (error) {
      console.warn('[Perf] Observer setup failed:', error)
    }
  }

  function observeLongTasks(): void {
    if (!('PerformanceObserver' in window)) return

    try {
      longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasks.value.push(entry.duration)
          if (longTasks.value.length > 50) {
            longTasks.value.shift()
          }
        }
      })

      longTaskObserver.observe({ type: 'longtask', buffered: true })
    } catch {}
  }

  function getNavigationTiming(): PerformanceMetric | null {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!nav) return null

    const ttfbValue = nav.responseStart - nav.requestStart
    const metric: PerformanceMetric = {
      name: 'ttfb',
      value: Math.round(ttfbValue),
      rating: rateMetric('ttfb', ttfbValue),
      timestamp: Date.now(),
    }
    coreVitals.value.ttfb = metric
    return metric
  }

  function measureMemoryUsage(): void {
    const memory = (performance as any).memory
    if (!memory) return

    memoryInfo.value = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercent: Math.round(
        (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 * 100
      ) / 100,
    }

    isLowPerformance.value = memoryInfo.value.usagePercent > 80
  }

  function getFCP(): number | null {
    return coreVitals.value.fcp?.value ?? null
  }

  function getLCP(): number | null {
    return coreVitals.value.lcp?.value ?? null
  }

  function getCLS(): number | null {
    return coreVitals.value.cls?.value ?? null
  }

  function getOverallScore(): number {
    const vitals = [
      coreVitals.value.fcp,
      coreVitals.value.lcp,
      coreVitals.value.fid,
      coreVitals.value.cls,
      coreVitals.value.ttfb,
    ].filter(Boolean) as PerformanceMetric[]

    if (vitals.length === 0) return 100

    const scoreMap = { good: 100, 'needs-improvement': 50, poor: 0 }
    const totalScore = vitals.reduce((sum, m) => sum + (scoreMap[m.rating] || 0), 0)

    return Math.round(totalScore / vitals.length)
  }

  function markCustom(name: string): () => void {
    const startMark = `perf-${name}-start`
    const endMark = `perf-${name}-end`
    const measureName = `perf-${name}`

    performance.mark(startMark)

    return () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)

      const entries = performance.getEntriesByName(measureName)
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1]
        metrics.value.push({
          name: measureName,
          value: Math.round(lastEntry.duration),
          rating: lastEntry.duration < 100 ? 'good' : lastEntry.duration < 500 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        })
      }

      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(measureName)
    }
  }

  onMounted(() => {
    observePaintTiming()
    observeLongTasks()
    getNavigationTiming()

    setInterval(measureMemoryUsage, 5000)
    measureMemoryUsage()
  })

  onUnmounted(() => {
    observer?.disconnect()
    longTaskObserver?.disconnect()
  })

  return {
    metrics,
    coreVitals,
    memoryInfo,
    isLowPerformance,
    longTasks,
    getFCP,
    getLCP,
    getCLS,
    getOverallScore,
    markCustom,
    measureMemoryUsage,
  }
}
