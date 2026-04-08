/**
 * 追踪核心引擎
 * 用户行为追踪系统的核心模块
 * 包含：会话管理、事件追踪、自动化数据采集
 */

import { analyticsConfig } from '@/config/analytics.config'
import { privacyManager } from './privacy'
import type { PerformanceData } from '../performance/reporter'

/** 事件类型枚举 */
export enum EventType {
  // 页面事件
  PAGE_VIEW = 'page_view',
  PAGE_LEAVE = 'page_leave',

  // 用户交互
  CLICK = 'click',
  DOUBLE_CLICK = 'double_click',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  FORM_ERROR = 'form_error',

  // 业务事件
  SEARCH = 'search',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  INITIATE_CHECKOUT = 'initiate_checkout',
  COMPLETE_PURCHASE = 'complete_purchase',
  ADD_TO_FAVORITES = 'add_to_favorites',
  SHARE = 'share',

  // 内容互动
  VIEW_PRODUCT = 'view_product',
  VIEW_CATEGORY = 'view_category',
  READ_ARTICLE = 'read_article',
  LIKE_CONTENT = 'like_content',
  COMMENT = 'comment',

  // 错误事件
  ERROR = 'error',
  API_ERROR = 'api_error',

  // 性能事件
  SLOW_PAGE_LOAD = 'slow_page_load',
  SLOW_API = 'slow_api'
}

/** 追踪事件接口 */
export interface TrackEvent {
  eventName: string
  eventParams: Record<string, any>
  category: string
  timestamp: number
  sessionId: string
  userId?: string
  pageUrl: string
  referrer: string
  userAgent: string
}

/** 会话信息 */
interface SessionInfo {
  sessionId: string
  userId?: string | null
  deviceId: string
  startTime: number
  lastActivityTime: number
  pageCount: number
  referrer: string
  landingPage: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

/** 电商产品信息 */
export interface EcommerceProduct {
  id: string
  name: string
  price: number
  quantity?: number
  category?: string
  variant?: string
  brand?: string
}

/** 电商事件 */
export interface EcommerceEvent {
  action: 'view' | 'add_to_cart' | 'remove_from_cart' | 'checkout' | 'purchase'
  products: EcommerceProduct[]
  transactionId?: string
  revenue?: number
  currency?: string
  coupon?: string
}

/** 滚动深度信息 */
interface ScrollDepthInfo {
  thresholds: number[]
  reachedThresholds: Set<number>
  maxDepth: number
}

class AnalyticsTracker {
  private session: SessionInfo
  private eventQueue: TrackEvent[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private scrollDepthInfo: ScrollDepthInfo
  private currentPageStartTime: number = Date.now()
  private isInitialized = false

  constructor() {
    this.session = this.createSession()
    this.scrollDepthInfo = { thresholds: [25, 50, 75, 100], reachedThresholds: new Set(), maxDepth: 0 }
  }

  /**
   * 初始化追踪器
   */
  init(): void {
    if (this.isInitialized || !analyticsConfig.enabled) return
    this.isInitialized = true

    // 检查隐私合规
    if (!privacyManager.isTrackingAllowed()) {
      console.warn('[Analytics] 追踪被禁用（隐私设置或DNT）')
      return
    }

    // 恢复或创建会话
    this.restoreOrCreateSession()

    // 初始化自动化追踪
    this.initAutoTrackers()

    // 启动批量上报
    this.startAutoFlush()

    // 监听页面卸载
    this.setupUnloadListeners()

    if (import.meta.env.DEV) {
      console.log(`[Analytics] 初始化完成 (Session: ${this.session.sessionId})`)
    }
  }

  // ==================== 公共API ====================

  /**
   * 手动追踪事件
   */
  track(eventName: string, params: Record<string, any> = {}, category: string = 'custom'): void {
    if (!this.shouldTrack()) return

    const event: TrackEvent = {
      eventName,
      eventParams: privacyManager.maskSensitiveData(params),
      category,
      timestamp: Date.now(),
      sessionId: this.session.sessionId,
      userId: this.session.userId || undefined,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }

    this.addToQueue(event)

    if (import.meta.env.DEV && analyticsConfig.debug) {
      console.log('[Analytics] Track:', event)
    }
  }

  /**
   * 页面浏览追踪
   */
  pageView(url?: string): void {
    const currentUrl = url || window.location.pathname + window.location.search

    // 记录上一个页面的停留时长
    this.recordPageLeave()

    // 更新当前页面开始时间
    this.currentPageStartTime = Date.now()

    // 增加页面计数
    this.session.pageCount++
    this.saveSession()

    this.track(EventType.PAGE_VIEW, {
      url: currentUrl,
      title: document.title,
      referrer: document.referrer
    }, 'page')

    // 重置滚动深度
    this.resetScrollDepth()
  }

  /**
   * 电商事件追踪
   */
  trackEcommerce(event: EcommerceEvent): void {
    if (!analyticsConfig.ecommerce.enabled) return

    this.track(event.action === 'purchase' ? EventType.COMPLETE_PURCHASE : `ecommerce_${event.action}`, {
      products: event.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity || 1,
        category: p.category,
        brand: p.brand
      })),
      transaction_id: event.transactionId,
      revenue: event.revenue,
      currency: event.currency || analyticsConfig.ecommerce.currency,
      coupon: event.coupon,
      item_count: event.products.reduce((sum, p) => sum + (p.quantity || 1), 0)
    }, 'ecommerce')
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: Record<string, any>): void {
    this.track('set_user_properties', properties, 'user')
  }

  /**
   * 身份关联（登录后调用）
   */
  identify(userId: string, traits?: Record<string, any>): void {
    const hashedUserId = privacyManager.hashUserId(userId)
    this.session.userId = hashedUserId
    this.saveSession()

    this.track('identify', {
      user_id: hashedUserId,
      ...traits
    }, 'user')

    if (import.meta.env.DEV && analyticsConfig.debug) {
      console.log('[Analytics] 用户身份已关联:', hashedUserId)
    }
  }

  /**
   * 清除用户身份（登出时调用）
   */
  resetIdentity(): void {
    this.track('logout', {}, 'user')
    this.session.userId = null
    this.saveSession()
  }

  /**
   * 获取当前会话ID
   */
  getSessionId(): string {
    return this.session.sessionId
  }

  /**
   * 获取当前用户ID
   */
  getUserId(): string | undefined {
    return this.session.userId || undefined
  }

  /**
   * 手动触发刷新
   */
  flush(isSync: boolean = false): void {
    if (this.eventQueue.length === 0) return

    const eventsToSend = [...this.eventQueue]
    this.eventQueue = []

    this.sendEvents(eventsToSend, isSync)
  }

  /**
   * 获取队列长度
   */
  getQueueLength(): number {
    return this.eventQueue.length
  }

  /**
   * 销毁追踪器
   */
  destroy(): void {
    this.stopAutoFlush()
    this.flush(true)
    this.removeEventListeners()
    this.isInitialized = false
  }

  // ==================== 自动化追踪 ====================

  private initAutoTrackers(): void {
    const config = analyticsConfig.autoTrack

    // 页面浏览（初始）
    if (config.pageView) {
      this.pageView()
    }

    // 点击追踪
    if (config.click) {
      this.initClickTracker()
    }

    // 滚动深度追踪
    if (config.scroll) {
      this.initScrollTracker()
    }

    // 表单交互追踪
    if (config.formInteraction) {
      this.initFormTracker()
    }

    // 错误追踪
    if (config.error) {
      this.initErrorTracker()
    }

    // SPA路由变化监听
    if (config.routeChange) {
      this.initRouteChangeTracker()
    }
  }

  /** 点击追踪 */
  private initClickTracker(): void {
    let clickThrottle = false

    document.addEventListener('click', (e) => {
      if (clickThrottle) return
      clickThrottle = true
      setTimeout(() => (clickThrottle = false), 250)

      const target = e.target as HTMLElement
      if (!target) return

      const elementData = this.extractElementData(target)

      this.track(EventType.CLICK, {
        x: e.clientX,
        y: e.clientY,
        ...elementData
      }, 'interaction')
    })
  }

  /** 滚动深度追踪 */
  private initScrollTracker(): void {
    let scrollTimeout: ReturnType<typeof setTimeout>

    window.addEventListener(
      'scroll',
      () => {
        if (scrollTimeout) clearTimeout(scrollTimeout)

        scrollTimeout = setTimeout(() => {
          this.recordScrollDepth()
        }, 100)
      },
      { passive: true }
    )
  }

  /** 表单交互追踪 */
  private initFormTracker(): void {
    // 表单开始填写
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form')
        if (form) {
          form.dataset.analyticsFormStart = Date.now().toString()
        }
      }
    })

    // 表单提交
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement
      if (!form) return

      const formData = new FormData(form)
      const fields = Array.from(formData.keys())

      this.track(EventType.FORM_SUBMIT, {
        form_id: form.id || form.name || 'unknown',
        form_action: form.action,
        field_count: fields.length,
        duration: form.dataset.analyticsFormStart
          ? Date.now() - parseInt(form.dataset.analyticsFormStart)
          : undefined
      }, 'form')
    })

    // 表单验证错误
    if ('reportValidity' in HTMLFormElement.prototype) {
      const originalReportValidity = HTMLFormElement.prototype.reportValidity
      HTMLFormElement.prototype.reportValidity = function () {
        const isValid = originalReportValidity.call(this)
        if (!isValid) {
          // 找到第一个无效字段
          const invalidField = this.querySelector(':invalid') as HTMLElement
          if (invalidField) {
            // 注意：这里需要通过其他方式访问tracker实例
            // 简化处理，实际项目中可以使用全局事件总线
          }
        }
        return isValid
      }
    }
  }

  /** 错误追踪 */
  private initErrorTracker(): void {
    // JavaScript错误
    window.addEventListener('error', (e) => {
      this.track(EventType.ERROR, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      }, 'error')
    })

    // Promise未捕获错误
    window.addEventListener('unhandledrejection', (e) => {
      this.track(EventType.ERROR, {
        message: 'Unhandled Promise Rejection',
        reason: String(e.reason),
        type: 'promise'
      }, 'error')
    })

    // API错误（通过拦截器）
    this.interceptApiErrors()
  }

  /** SPA路由变化追踪 */
  private initRouteChangeTracker(): void {
    // 监听pushState和replaceState
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(this, args as any)
      // 使用requestAnimationFrame确保URL已经更新
      requestAnimationFrame(() => {
        // 通过自定义事件通知tracker
        window.dispatchEvent(new CustomEvent('routechange'))
      })
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args as any)
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('routechange'))
      })
    }

    // 监听popstate
    window.addEventListener('popstate', () => {
      this.pageView()
    })

    // 监听自定义路由变化事件
    window.addEventListener('routechange', () => {
      this.pageView()
    })
  }

  // ==================== 内部方法 ====================

  /**
   * 是否应该追踪
   */
  private shouldTrack(): boolean {
    if (!analyticsConfig.enabled) return false
    if (!privacyManager.isTrackingAllowed()) return false
    if (Math.random() > analyticsConfig.sampling.rate) return false
    return true
  }

  /**
   * 创建新会话
   */
  private createSession(): SessionInfo {
    return {
      sessionId: this.generateUUID(),
      deviceId: this.getOrCreateDeviceId(),
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      pageCount: 1,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      utmSource: this.getUTMParam('utm_source'),
      utmMedium: this.getUTMParam('utm_medium'),
      utmCampaign: this.getUTMParam('utm_campaign')
    }
  }

  /**
   * 恢复或创建会话
   */
  private restoreOrCreateSession(): void {
    try {
      const stored = sessionStorage.getItem('analytics_session')
      if (stored) {
        const parsed = JSON.parse(stored) as SessionInfo
        const sessionAge = Date.now() - parsed.lastActivityTime

        // 如果会话未超时，则恢复
        if (sessionAge < analyticsConfig.sessionTimeout) {
          this.session = {
            ...parsed,
            lastActivityTime: Date.now()
          }
          return
        }
      }
    } catch (e) {
      console.warn('[Analytics] 恢复会话失败:', e)
    }

    // 创建新会话
    this.session = this.createSession()
    this.saveSession()
  }

  /**
   * 保存会话到sessionStorage
   */
  private saveSession(): void {
    try {
      sessionStorage.setItem('analytics_session', JSON.stringify(this.session))
    } catch (e) {
      console.warn('[Analytics] 保存会话失败:', e)
    }
  }

  /**
   * 生成UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * 获取或创建设备ID
   */
  private getOrCreateDeviceId(): string {
    const DEVICE_ID_KEY = 'analytics_device_id'

    try {
      let deviceId = localStorage.getItem(DEVICE_ID_KEY)
      if (!deviceId) {
        deviceId = `device_${this.generateUUID()}`
        localStorage.setItem(DEVICE_ID_KEY, deviceId)
      }
      return deviceId
    } catch (e) {
      return `device_anonymous_${Date.now()}`
    }
  }

  /**
   * 获取UTM参数
   */
  private getUTMParam(param: string): string | undefined {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param) || undefined
  }

  /**
   * 提取元素信息
   */
  private extractElementData(element: HTMLElement): Record<string, any> {
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || undefined,
      class: element.className?.toString().split(' ')[0],
      text: (element.textContent || '').trim().substring(0, 100),
      href: (element as HTMLAnchorElement).href || undefined,
      data_track_id: element.getAttribute('data-track-id'),
      data_track_name: element.getAttribute('data-track-name')
    }
  }

  /**
   * 记录滚动深度
   */
  private recordScrollDepth(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const depth = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0

    this.scrollDepthInfo.maxDepth = Math.max(this.scrollDepthInfo.maxDepth, depth)

    // 检查是否达到阈值
    for (const threshold of this.scrollDepthInfo.thresholds) {
      if (depth >= threshold && !this.scrollDepthInfo.reachedThresholds.has(threshold)) {
        this.scrollDepthInfo.reachedThresholds.add(threshold)

        this.track(EventType.SCROLL, {
          depth: threshold,
          max_depth: this.scrollDepthInfo.maxDepth
        }, 'engagement')
      }
    }
  }

  /**
   * 重置滚动深度
   */
  private resetScrollDepth(): void {
    this.scrollDepthInfo.reachedThresholds.clear()
    this.scrollDepthInfo.maxDepth = 0
  }

  /**
   * 记录页面离开
   */
  private recordPageLeave(): void {
    const duration = Date.now() - this.currentPageStartTime

    if (duration > 0) {
      this.track(EventType.PAGE_LEAVE, {
        url: window.location.pathname + window.location.search,
        duration,
        scroll_depth: this.scrollDepthInfo.maxDepth
      }, 'page')
    }
  }

  /**
   * 拦截API错误
   */
  private interceptApiErrors(): void {
    // 拦截fetch
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const duration = Math.round(performance.now() - startTime)

        if (!response.ok) {
          this.track(EventType.API_ERROR, {
            url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
            method: (args[1] as RequestInit)?.method || 'GET',
            status: response.status,
            status_text: response.statusText,
            duration
          }, 'api')
        }

        return response
      } catch (error) {
        const duration = Math.round(performance.now() - startTime)
        this.track(EventType.API_ERROR, {
          url: typeof args[0] === 'string' ? args[0] : 'unknown',
          method: (args[1] as RequestInit)?.method || 'GET',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration
        }, 'api')
        throw error
      }
    }

    // 拦截XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    const originalXHRSend = XMLHttpRequest.prototype.send

    XMLHttpRequest.prototype.open = function (...args) {
      ;(this as any)._analyticsUrl = args[1]
      ;(this as any)._analyticsMethod = args[0]
      return originalXHROpen.apply(this, args as any)
    }

    XMLHttpRequest.prototype.send = function (...args) {
      const xhr = this
      const startTime = performance.now()

      xhr.addEventListener('loadend', () => {
        const duration = Math.round(performance.now() - startTime)
        if (xhr.status >= 400) {
          // 这里需要访问tracker实例，简化处理
          // 实际项目中可以通过全局变量或事件总线实现
        }
      })

      return originalXHRSend.apply(this, args as any)
    }
  }

  /**
   * 添加事件到队列
   */
  private addToQueue(event: TrackEvent): void {
    this.eventQueue.push(event)

    // 队列大小限制
    if (this.eventQueue.length > analyticsConfig.maxEventQueueSize) {
      this.eventQueue.shift() // 移除最旧的事件
    }

    // 达到批量大小时立即发送
    if (
      analyticsConfig.batch.enabled &&
      this.eventQueue.length >= analyticsConfig.batch.maxSize
    ) {
      this.flush(false)
    }
  }

  /**
   * 发送事件到服务器
   */
  private async sendEvents(events: TrackEvent[], isSync: boolean): Promise<void> {
    try {
      const payload = {
        events,
        sent_at: new Date().toISOString(),
        version: '2.0.0',
        client_info: {
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          platform: navigator.platform
        }
      }

      if (isSync && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        navigator.sendBeacon(analyticsConfig.endpoint, blob)
      } else {
        await fetch(analyticsConfig.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        })
      }

      if (import.meta.env.DEV && analyticsConfig.debug) {
        console.log(`[Analytics] 已发送 ${events.length} 个事件`)
      }
    } catch (error) {
      console.error('[Analytics] 发送失败:', error)
      // 失败的事件放回队列头部
      this.eventQueue.unshift(...events)
    }
  }

  /**
   * 启动自动定时刷新
   */
  private startAutoFlush(): void {
    if (this.flushTimer !== null) clearInterval(this.flushTimer)

    this.flushTimer = setInterval(() => {
      this.flush(false)
    }, analyticsConfig.batch.flushInterval)
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
   * 设置页面卸载监听器
   */
  private setupUnloadListeners(): void {
    // 页面隐藏时发送剩余数据
    if (analyticsConfig.batch.sendOnPageHide) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush(true)
        }
      })
    }

    // 页面卸载前发送
    window.addEventListener('beforeunload', () => {
      this.recordPageLeave()
      this.flush(true)
    })
  }

  /**
   * 移除所有事件监听器
   */
  private removeEventListeners(): void {
    // 在实际实现中应该保存并移除所有添加的监听器
    // 这里简化处理
  }
}

/** 全局追踪器实例 */
export const analyticsTracker = new AnalyticsTracker()

/**
 * 初始化分析追踪系统
 * 应在应用启动时调用一次
 */
export function initAnalytics(): void {
  analyticsTracker.init()
}
