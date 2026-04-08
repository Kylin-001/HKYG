/**
 * 便捷API封装 - Vue组合函数
 * 提供声明式的分析追踪API
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { analyticsTracker, EventType, type EcommerceEvent, type EcommerceProduct } from '@/utils/analytics/tracker'

/** useAnalytics 返回值接口 */
export interface UseAnalyticsReturn {
  /** 手动追踪事件 */
  track: (eventName: string, params?: Record<string, any>, category?: string) => void

  /** 页面浏览追踪 */
  pageView: (url?: string) => void

  // ==================== 电商专用方法 ====================

  /** 追踪电商事件 */
  trackEcommerce: (event: EcommerceEvent) => void

  /** 商品浏览 */
  trackViewProduct: (product: EcommerceProduct) => void

  /** 添加到购物车 */
  trackAddToCart: (product: EcommerceProduct) => void

  /** 从购物车移除 */
  trackRemoveFromCart: (product: EcommerceProduct) => void

  /** 开始结账 */
  trackInitiateCheckout: (
    products: EcommerceProduct[],
    options?: { coupon?: string; revenue?: number }
  ) => void

  /** 完成购买 */
  trackCompletePurchase: (
    transactionId: string,
    products: EcommerceProduct[],
    revenue: number,
    options?: { coupon?: string; currency?: string }
  ) => void

  /** 添加收藏 */
  trackAddToFavorites: (product: EcommerceProduct) => void

  /** 分享 */
  trackShare: (content: {
    contentType: string
    contentId: string
    method: string
  }) => void

  // ==================== 用户相关方法 ====================

  /** 设置用户属性 */
  setUserProperties: (properties: Record<string, any>) => void

  /** 身份关联（登录后调用） */
  identify: (userId: string, traits?: Record<string, any>) => void

  /** 清除用户身份（登出时调用） */
  resetIdentity: () => void

  // ==================== 内容互动方法 ====================

  /** 搜索追踪 */
  trackSearch: (keyword: string, resultCount?: number, category?: string) => void

  /** 表单提交追踪 */
  trackFormSubmit: (formId: string, formData?: Record<string, any>) => void

  /** 错误追踪 */
  trackError: (error: Error | string, context?: string) => void

  // ==================== 状态和工具方法 ====================

  /** 获取当前会话ID */
  getSessionId: () => string

  /** 获取当前用户ID */
  getUserId: () => string | undefined

  /** 获取队列长度 */
  getQueueLength: () => number

  /** 手动刷新队列 */
  flush: (isSync?: boolean) => void
}

/**
 * Vue组合函数 - 分析追踪
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const analytics = useAnalytics()
 *
 * // 手动追踪事件
 * analytics.track('button_click', {
 *   button_id: 'submit_order',
 *   page: 'checkout',
 *   value: 299.00
 * })
 *
 * // 页面浏览追踪（自动，也可手动）
 * analytics.pageView('/orders/detail/123')
 *
 * // 电商专用方法
 * analytics.trackEcommerce({
 *   action: 'purchase',
 *   products: [{ id: 'p1', name: '商品A', price: 100, quantity: 2 }],
 *   transactionId: 'order_123',
 *   revenue: 200,
 *   currency: 'CNY'
 * })
 *
 * // 用户属性设置
 * analytics.setUserProperties({
 *   grade: '2024',
 *   major: '软件工程',
 *   college: '计算机学院'
 * })
 *
 * // 身份关联
 * analytics.identify('user_123', {
 *   email: 'student@usth.edu.cn',
 *   nickname: '科小易'
 * })
 * </script>
 * ```
 */
export function useAnalytics(): UseAnalyticsReturn {
  const isInitialized = ref(false)

  onMounted(() => {
    if (!analyticsTracker.getSessionId()) {
      analyticsTracker.init()
    }
    isInitialized.value = true
  })

  onUnmounted(() => {
    // 组件卸载时不销毁tracker，它是全局单例
  })

  return {
    /**
     * 手动追踪事件
     */
    track(eventName: string, params?: Record<string, any>, category?: string): void {
      analyticsTracker.track(eventName, params, category)
    },

    /**
     * 页面浏览追踪
     */
    pageView(url?: string): void {
      analyticsTracker.pageView(url)
    },

    // ==================== 电商专用方法 ====================

    /**
     * 追踪电商事件
     */
    trackEcommerce(event: EcommerceEvent): void {
      analyticsTracker.trackEcommerce(event)
    },

    /**
     * 商品浏览
     */
    trackViewProduct(product: EcommerceProduct): void {
      analyticsTracker.trackEcommerce({
        action: 'view',
        products: [product]
      })
      analyticsTracker.track(EventType.VIEW_PRODUCT, {
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        price: product.price
      }, 'ecommerce')
    },

    /**
     * 添加到购物车
     */
    trackAddToCart(product: EcommerceProduct): void {
      analyticsTracker.trackEcommerce({
        action: 'add_to_cart',
        products: [product]
      })
      analyticsTracker.track(EventType.ADD_TO_CART, {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: product.quantity || 1
      }, 'ecommerce')
    },

    /**
     * 从购物车移除
     */
    trackRemoveFromCart(product: EcommerceProduct): void {
      analyticsTracker.trackEcommerce({
        action: 'remove_from_cart',
        products: [product]
      })
      analyticsTracker.track(EventType.REMOVE_FROM_CART, {
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity || 1
      }, 'ecommerce')
    },

    /**
     * 开始结账
     */
    trackInitiateCheckout(
      products: EcommerceProduct[],
      options?: { coupon?: string; revenue?: number }
    ): void {
      analyticsTracker.trackEcommerce({
        action: 'checkout',
        products,
        ...options
      })
      analyticsTracker.track(EventType.INITIATE_CHECKOUT, {
        item_count: products.reduce((sum, p) => sum + (p.quantity || 1), 0),
        revenue: options?.revenue,
        coupon: options?.coupon
      }, 'ecommerce')
    },

    /**
     * 完成购买
     */
    trackCompletePurchase(
      transactionId: string,
      products: EcommerceProduct[],
      revenue: number,
      options?: { coupon?: string; currency?: string }
    ): void {
      analyticsTracker.trackEcommerce({
        action: 'purchase',
        products,
        transactionId,
        revenue,
        currency: options?.currency,
        coupon: options?.coupon
      })
      analyticsTracker.track(EventType.COMPLETE_PURCHASE, {
        transaction_id: transactionId,
        revenue,
        item_count: products.reduce((sum, p) => sum + (p.quantity || 1), 0),
        coupon: options?.coupon
      }, 'ecommerce')
    },

    /**
     * 添加收藏
     */
    trackAddToFavorites(product: EcommerceProduct): void {
      analyticsTracker.track(EventType.ADD_TO_FAVORITES, {
        product_id: product.id,
        product_name: product.name,
        category: product.category
      }, 'engagement')
    },

    /**
     * 分享
     */
    trackShare(content: {
      contentType: string
      contentId: string
      method: string
    }): void {
      analyticsTracker.track(EventType.SHARE, {
        content_type: content.contentType,
        content_id: content.contentId,
        method: content.method
      }, 'engagement')
    },

    // ==================== 用户相关方法 ====================

    /**
     * 设置用户属性
     */
    setUserProperties(properties: Record<string, any>): void {
      analyticsTracker.setUserProperties(properties)
    },

    /**
     * 身份关联（登录后调用）
     */
    identify(userId: string, traits?: Record<string, any>): void {
      analyticsTracker.identify(userId, traits)
    },

    /**
     * 清除用户身份（登出时调用）
     */
    resetIdentity(): void {
      analyticsTracker.resetIdentity()
    },

    // ==================== 内容互动方法 ====================

    /**
     * 搜索追踪
     */
    trackSearch(keyword: string, resultCount?: number, category?: string): void {
      analyticsTracker.track(EventType.SEARCH, {
        keyword,
        result_count: resultCount,
        category
      }, 'search')
    },

    /**
     * 表单提交追踪
     */
    trackFormSubmit(formId: string, formData?: Record<string, any>): void {
      analyticsTracker.track(EventType.FORM_SUBMIT, {
        form_id: formId,
        form_data: formData ? Object.keys(formData).length : undefined
      }, 'form')
    },

    /**
     * 错误追踪
     */
    trackError(error: Error | string, context?: string): void {
      const errorInfo =
        typeof error === 'string'
          ? { message: error }
          : { message: error.message, stack: error.stack }

      analyticsTracker.track(EventType.ERROR, {
        ...errorInfo,
        context
      }, 'error')
    },

    // ==================== 状态和工具方法 ====================

    /**
     * 获取当前会话ID
     */
    getSessionId(): string {
      return analyticsTracker.getSessionId()
    },

    /**
     * 获取当前用户ID
     */
    getUserId(): string | undefined {
      return analyticsTracker.getUserId()
    },

    /**
     * 获取队列长度
     */
    getQueueLength(): number {
      return analyticsTracker.getQueueLength()
    },

    /**
     * 手动刷新队列
     */
    flush(isSync: boolean = false): void {
      analyticsTracker.flush(isSync)
    }
  }
}

export default useAnalytics
