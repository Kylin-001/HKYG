/**
 * 全局指令集成 - v-track
 * 提供声明式的分析追踪指令
 *
 * @example
 * ```vue
 * <!-- 追踪点击 -->
 * <button v-track="{ event: 'click', name: 'buy_now' }">立即购买</button>
 *
 * <!-- 追踪曝光 -->
 * <div v-track:view="{ event: 'exposure', name: 'banner_a' }">广告位</div>
 *
 * <!-- 追踪表单 -->
 * <form v-track:submit="{ event: 'form_submit', name: 'login_form' }">
 *   ...
 * </form>
 *
 * <!-- 追踪滚动 -->
 * <div v-track:scroll="{
 *   event: 'scroll_depth',
 *   thresholds: [25, 50, 75, 100],
 *   name: 'article_1'
 * }">
 *   长文章内容...
 * </div>
 * ```
 */

import type { Directive, DirectiveBinding } from 'vue'
import { analyticsTracker } from '@/utils/analytics/tracker'

/** 指令配置接口 */
interface TrackDirectiveConfig {
  event?: string
  name?: string
  category?: string
  params?: Record<string, any>
  once?: boolean // 只触发一次
}

/** 滚动追踪配置 */
interface ScrollTrackConfig extends TrackDirectiveConfig {
  thresholds?: number[] // 滚动深度阈值，如 [25, 50, 75, 100]
  offset?: number // 偏移量（px）
}

/** 曝光追踪配置 */
interface ViewTrackConfig extends TrackDirectiveConfig {
  threshold?: number // 曝光阈值（0-1），默认0.5（50%可见）
  rootMargin?: string // 根边距
  once?: boolean // 只触发一次
}

/** 指令状态存储 */
const directiveState = new WeakMap<HTMLElement, {
  hasTracked: Set<string>
  observer?: IntersectionObserver
  scrollHandler?:() => void
}>()

/**
 * v-track 指令 - 点击追踪
 */
export const trackDirective: Directive<HTMLElement, TrackDirectiveConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}

    // 默认事件类型为 click
    const eventName = config.event || 'click'
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'

    const handleClick = (e: Event) => {
      const state = directiveState.get(el) || { hasTracked: new Set() }
      const trackKey = `${eventName}_${trackName}`

      // 如果设置了 once 且已追踪过，则跳过
      if (config.once && state.hasTracked.has(trackKey)) {
        return
      }

      // 提取元素信息
      const elementInfo = extractElementInfo(el)

      analyticsTracker.track(eventName, {
        name: trackName,
        category: config.category || 'interaction',
        ...elementInfo,
        ...config.params
      })

      // 标记已追踪
      state.hasTracked.add(trackKey)
      directiveState.set(el, state)
    }

    el.addEventListener('click', handleClick)
    el._trackClickHandler = handleClick as any
  },

  unmounted(el) {
    if (el._trackClickHandler) {
      el.removeEventListener('click', el._trackClickHandler)
      delete el._trackClickHandler
    }
  }
}

/**
 * v-track:view 指令 - 曝光追踪（使用 IntersectionObserver）
 */
export const trackViewDirective: Directive<HTMLElement, ViewTrackConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'
    const threshold = config.threshold ?? 0.5
    const rootMargin = config.rootMargin || '0px'

    const state: {
      hasTracked: Set<string>
      observer?: IntersectionObserver
    } = {
      hasTracked: new Set()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const trackKey = `view_${trackName}`

            // 如果设置了 once 且已追踪过，则跳过
            if (config.once && state.hasTracked.has(trackKey)) {
              return
            }

            // 提取元素信息
            const elementInfo = extractElementInfo(el)

            analyticsTracker.track('view', {
              name: trackName,
              category: config.category || 'exposure',
              visibility: Math.round(entry.intersectionRatio * 100),
              ...elementInfo,
              ...config.params
            })

            // 标记已追踪
            state.hasTracked.add(trackKey)

            // 如果设置了 once，则停止观察
            if (config.once) {
              observer.unobserve(el)
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(el)
    state.observer = observer
    directiveState.set(el, state)
  },

  unmounted(el) {
    const state = directiveState.get(el)
    if (state?.observer) {
      state.observer.disconnect()
    }
    directiveState.delete(el)
  }
}

/**
 * v-track:submit 指令 - 表单提交追踪
 */
export const trackSubmitDirective: Directive<HTMLElement, TrackDirectiveConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const fields = Array.from(formData.keys())

      analyticsTracker.track('form_submit', {
        name: trackName,
        category: config.category || 'form',
        form_id: form.id || form.name || 'unknown',
        field_count: fields.length,
        ...config.params
      })
    }

    el.addEventListener('submit', handleSubmit)
    el._trackSubmitHandler = handleSubmit as any
  },

  unmounted(el) {
    if (el._trackSubmitHandler) {
      el.removeEventListener('submit', el._trackSubmitHandler)
      delete el._trackSubmitHandler
    }
  }
}

/**
 * v-track:scroll 指令 - 滚动深度追踪
 */
export const trackScrollDirective: Directive<HTMLElement, ScrollTrackConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'
    const thresholds = config.thresholds || [25, 50, 75, 100]
    const offset = config.offset || 0

    const state: {
      hasTracked: Set<number>
      scrollHandler: () => void
    } = {
      hasTracked: new Set(),
      scrollHandler: () => {}
    }

    let scrollTimeout: ReturnType<typeof setTimeout>

    state.scrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop
        const elementHeight = rect.height
        const elementBottom = elementTop + elementHeight

        // 计算滚动百分比
        const visibleTop = Math.max(scrollTop + offset, elementTop)
        const visibleBottom = Math.min(scrollTop + viewportHeight, elementBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        if (elementHeight > 0) {
          const scrollPercent = Math.round((visibleHeight / elementHeight) * 100)

          // 检查是否达到阈值
          for (const threshold of thresholds) {
            if (scrollPercent >= threshold && !state.hasTracked.has(threshold)) {
              state.hasTracked.add(threshold)

              analyticsTracker.track('scroll', {
                name: trackName,
                category: config.category || 'scroll',
                depth: threshold,
                element_id: el.id,
                ...config.params
              })
            }
          }
        }
      }, 100) // 100ms 节流
    }

    window.addEventListener('scroll', state.scrollHandler, { passive: true })
    directiveState.set(el, state)
  },

  unmounted(el) {
    const state = directiveState.get(el)
    if (state?.scrollHandler) {
      window.removeEventListener('scroll', state.scrollHandler)
    }
    directiveState.delete(el)
  }
}

/**
 * v-track:focus 指令 - 聚焦追踪
 */
export const trackFocusDirective: Directive<HTMLElement, TrackDirectiveConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'

    const handleFocus = () => {
      analyticsTracker.track('focus', {
        name: trackName,
        category: config.category || 'interaction',
        element_id: el.id,
        element_type: el.tagName.toLowerCase(),
        ...config.params
      })
    }

    el.addEventListener('focus', handleFocus)
    el._trackFocusHandler = handleFocus as any
  },

  unmounted(el) {
    if (el._trackFocusHandler) {
      el.removeEventListener('focus', el._trackFocusHandler)
      delete el._trackFocusHandler
    }
  }
}

/**
 * v-track:blur 指令 - 失焦追踪
 */
export const trackBlurDirective: Directive<HTMLElement, TrackDirectiveConfig> = {
  mounted(el, binding) {
    const config = binding.value || {}
    const trackName = config.name || el.getAttribute('data-track-name') || 'unknown'

    const handleBlur = () => {
      analyticsTracker.track('blur', {
        name: trackName,
        category: config.category || 'interaction',
        element_id: el.id,
        element_type: el.tagName.toLowerCase(),
        ...config.params
      })
    }

    el.addEventListener('blur', handleBlur)
    el._trackBlurHandler = handleBlur as any
  },

  unmounted(el) {
    if (el._trackBlurHandler) {
      el.removeEventListener('blur', el._trackBlurHandler)
      delete el._trackBlurHandler
    }
  }
}

/**
 * 提取元素信息
 */
function extractElementInfo(el: HTMLElement): Record<string, any> {
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    class: el.className?.toString().split(' ')[0],
    text: (el.textContent || '').trim().substring(0, 100),
    href: (el as HTMLAnchorElement).href || undefined,
    data_track_id: el.getAttribute('data-track-id'),
    data_track_category: el.getAttribute('data-track-category')
  }
}

/**
 * 注册所有追踪指令
 * 在 main.ts 中调用
 */
export function setupTrackDirectives(app: any): void {
  app.directive('track', trackDirective)
  app.directive('track:view', trackViewDirective)
  app.directive('track:submit', trackSubmitDirective)
  app.directive('track:scroll', trackScrollDirective)
  app.directive('track:focus', trackFocusDirective)
  app.directive('track:blur', trackBlurDirective)

  if (import.meta.env.DEV) {
    console.log('[Directives] 追踪指令已注册')
  }
}

export default {
  track: trackDirective,
  'track:view': trackViewDirective,
  'track:submit': trackSubmitDirective,
  'track:scroll': trackScrollDirective,
  'track:focus': trackFocusDirective,
  'track:blur': trackBlurDirective
}
