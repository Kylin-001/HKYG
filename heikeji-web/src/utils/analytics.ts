interface AnalyticsEvent {
  eventName: string
  properties?: Record<string, unknown>
  timestamp: number
  userId?: string
  sessionId: string
  pageUrl: string
  referrer: string
  userAgent: string
  screenResolution: string
}

interface PageViewEvent extends AnalyticsEvent {
  eventName: 'page_view'
  properties: {
    title: string
    url: string
    loadTime?: number
  }
}

interface ClickEvent extends AnalyticsEvent {
  eventName: 'click'
  properties: {
    elementId?: string
    elementClass?: string
    elementText?: string
    x: number
    y: number
  }
}

interface PerformanceEvent extends AnalyticsEvent {
  eventName: 'performance'
  properties: {
    metricName: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
  }
}

type EventData = PageViewEvent | ClickEvent | PerformanceEvent

class AnalyticsManager {
  private eventsQueue: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null
  private isInitialized = false
  private flushInterval: number | null = null
  private maxBatchSize = 20
  private flushDelay = 5000
  private endpoint: string
  private enabled: boolean

  constructor(options?: { endpoint?: string; enabled?: boolean; debug?: boolean }) {
    this.endpoint = options?.endpoint || '/api/analytics/events'
    this.enabled = options?.enabled ?? import.meta.env.PROD
    this.sessionId = this.generateSessionId()

    if (this.enabled) {
      this.init()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  init(): void {
    if (this.isInitialized) return

    this.isInitialized = true

    window.addEventListener('beforeunload', () => {
      this.flush(true)
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(false)
      }
    })

    this.startAutoFlush()

    this.trackPageView()

    console.log('[Analytics] Initialized')
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  clearUserId(): void {
    this.userId = null
  }

  track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    }

    this.eventsQueue.push(event)

    if (import.meta.env.DEV) {
      console.log('[Analytics] Track:', event)
    }

    if (this.eventsQueue.length >= this.maxBatchSize) {
      this.flush(false)
    }
  }

  trackPageView(title?: string): void {
    const startTime = performance.now()

    this.track('page_view', {
      title: title || document.title,
      url: window.location.pathname + window.location.search,
      loadTime: undefined,
    })

    if (typeof PerformanceObserver !== 'undefined') {
      setTimeout(() => {
        const loadTime = performance.now() - startTime
        this.updateLastEventProperty('loadTime', Math.round(loadTime))
      }, 100)
    }
  }

  trackClick(element: HTMLElement, extraProps?: Record<string, unknown>): void {
    this.track('click', {
      elementId: element.id || undefined,
      elementClass: element.className?.toString().split(' ')[0],
      elementText: (element.textContent || '').trim().substring(0, 50),
      ...extraProps,
    })
  }

  trackPerformance(metricName: string, value: number): void {
    let rating: 'good' | 'needs-improvement' | 'poor'

    switch (metricName) {
      case 'FCP':
        rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
        break
      case 'LCP':
        rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
        break
      case 'FID':
        rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
        break
      case 'CLS':
        rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
        break
      default:
        rating = 'good'
    }

    this.track('performance', { metricName, value: Math.round(value), rating })
  }

  trackError(error: Error, context?: string): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      fileName: (error as any).fileName,
      lineNumber: (error as any).lineNumber,
      columnNumber: (error as any).columnNumber,
    })
  }

  trackConversion(eventType: string, value?: number): void {
    this.track('conversion', {
      eventType,
      value,
      currency: 'CNY',
    })
  }

  trackSearch(keyword: string, resultCount?: number): void {
    this.track('search', {
      keyword,
      resultCount,
    })
  }

  trackAddToCart(productId: string, productName: string, price: number): void {
    this.track('add_to_cart', {
      productId,
      productName,
      price,
    })
  }

  trackPurchase(orderId: string, totalAmount: number, items: Array<{ id: string; name: string; price: number; quantity: number }>): void {
    this.track('purchase', {
      orderId,
      totalAmount,
      itemCount: items.length,
      items,
    })
  }

  startAutoFlush(): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval)
    }

    this.flushInterval = window.setInterval(() => {
      this.flush(false)
    }, this.flushDelay)
  }

  stopAutoFlush(): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }

  async flush(isSync: boolean = false): Promise<void> {
    if (this.eventsQueue.length === 0) return

    const eventsToSend = [...this.eventsQueue]
    this.eventsQueue = []

    try {
      if (isSync && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(eventsToSend)], {
          type: 'application/json',
        })

        navigator.sendBeacon(this.endpoint, blob)
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            events: eventsToSend,
            sentAt: new Date().toISOString(),
            version: '1.0.0',
          }),
          keepalive: true,
        }).catch((err) => {
          console.warn('[Analytics] Flush failed:', err)
          this.eventsQueue.unshift(...eventsToSend)
        })
      }

      if (import.meta.env.DEV) {
        console.log(`[Analytics] Flushed ${eventsToSend.length} events`)
      }
    } catch (error) {
      console.error('[Analytics] Flush error:', error)
      this.eventsQueue.unshift(...eventsToSend)
    }
  }

  getQueueLength(): number {
    return this.eventsQueue.length
  }

  clearQueue(): void {
    this.eventsQueue = []
  }

  destroy(): void {
    this.stopAutoFlush()
    this.flush(true)
    this.clearQueue()
    this.isInitialized = false
  }

  private updateLastEventProperty(key: string, value: unknown): void {
    if (this.eventsQueue.length > 0) {
      const lastEvent = this.eventsQueue[this.eventsQueue.length - 1]
      if (lastEvent.properties) {
        lastEvent.properties[key] = value
      }
    }
  }
}

let analyticsInstance: AnalyticsManager | null = null

export function useAnalytics(options?: { endpoint?: string; enabled?: boolean; debug?: boolean }) {
  function initAnalytics(): AnalyticsManager {
    if (!analyticsInstance) {
      analyticsInstance = new AnalyticsManager(options)
    }
    return analyticsInstance
  }

  function trackClick(element: HTMLElement, extraProps?: Record<string, unknown>): void {
    analyticsInstance?.trackClick(element, extraProps)
  }

  return {
    initAnalytics,
    track: (...args: Parameters<AnalyticsManager['track']>) => analyticsInstance?.track(...args),
    trackPageView: (...args: Parameters<AnalyticsManager['trackPageView']>) => analyticsInstance?.trackPageView(...args),
    trackClick,
    trackPerformance: (...args: Parameters<AnalyticsManager['trackPerformance']>) => analyticsInstance?.trackPerformance(...args),
    trackError: (...args: Parameters<AnalyticsManager['trackError']>) => analyticsInstance?.trackError(...args),
    trackConversion: (...args: Parameters<AnalyticsManager['trackConversion']>) => analyticsInstance?.trackConversion(...args),
    trackSearch: (...args: Parameters<AnalyticsManager['trackSearch']>) => analyticsInstance?.trackSearch(...args),
    trackAddToCart: (...args: Parameters<AnalyticsManager['trackAddToCart']>) => analyticsInstance?.trackAddToCart(...args),
    trackPurchase: (...args: Parameters<AnalyticsManager['trackPurchase']>) => analyticsInstance?.trackPurchase(...args),
    setUserId: (userId: string) => analyticsInstance?.setUserId(userId),
    clearUserId: () => analyticsInstance?.clearUserId(),
    flush: (isSync?: boolean) => analyticsInstance?.flush(isSync),
    destroy: () => analyticsInstance?.destroy(),
    instance: () => analyticsInstance,
  }
}

export { AnalyticsManager }
export type { AnalyticsEvent, PageViewEvent, ClickEvent, PerformanceEvent }
