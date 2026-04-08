import type { App, Directive, DirectiveBinding } from 'vue'

interface LazyLoadOptions {
  threshold?: number
  rootMargin?: string
  loading?: string
  error?: string
  /** 是否启用 WebP 格式转换 */
  webp?: boolean
  /** 自定义占位图 URL */
  placeholder?: string
}

interface LazyHTMLElement extends HTMLElement {
  dataset: DOMStringMap & {
    src?: string
    originalSrc?: string
  }
  _lazyObserver?: IntersectionObserver | null
  _lazyImage?: HTMLImageElement | null
}

// ====== WebP 支持检测 ======

/** WebP 检测结果缓存 key */
const WEBP_CACHE_KEY = 'hljust_webp_support'

/**
 * 检测浏览器是否支持 WebP 格式（Canvas 检测法）
 * 结果会缓存到 sessionStorage 避免重复检测
 */
export function checkWebPSupport(): Promise<boolean> {
  // 先检查缓存
  const cached = sessionStorage.getItem(WEBP_CACHE_KEY)
  if (cached !== null) {
    return Promise.resolve(cached === 'true')
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    // 尝试将 WebP 数据绘制到 canvas
    const webpData = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
    const img = new Image()

    img.onload = () => {
      const ctx = canvas.getContext('2d')
      try {
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          // 如果能成功获取像素数据，说明支持 WebP
          const data = ctx.getImageData(0, 0, 1, 1).data
          const supported = data.length > 0 && data[3] === 0
          sessionStorage.setItem(WEBP_CACHE_KEY, String(supported))
          resolve(supported)
          return
        }
      } catch (e) {
        // CORS 或其他错误
      }
      sessionStorage.setItem(WEBP_CACHE_KEY, 'false')
      resolve(false)
    }

    img.onerror = () => {
      sessionStorage.setItem(WEBP_CACHE_KEY, 'false')
      resolve(false)
    }

    img.src = webpData
  })
}

/**
 * 将图片 URL 转换为 WebP 格式
 * 支持 .jpg, .jpeg, .png 等常见格式
 */
function convertToWebp(url: string): string {
  // 已经是 WebP 则不转换
  if (/\.webp(\?|$)/i.test(url)) {
    return url
  }

  // 替换常见图片扩展名为 webp
  return url.replace(/\.(jpg|jpeg|png|gif|bmp)(\?|$)/i, '.webp$2')
}

/**
 * 获取原始格式 URL（从 WebP 回退）
 */
function getOriginalFormat(webpUrl: string, originalUrl: string): string {
  return originalUrl || webpUrl.replace(/\.webp(\?|$)/i, '.jpg$1')
}

// ====== 默认 SVG 占位图 ======

/** 默认加载中占位图 - 灰色骨架屏效果 */
const DEFAULT_LOADING_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f0f2f5' rx='4'/%3E%3C/svg%3E`

/** 默认错误占位图 - 图片图标 */
const ERROR_PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E`

// ====== 懒加载指令实现 ======

const lazyLoadDirective: Directive<LazyHTMLElement, LazyLoadOptions> = {
  async mounted(el: LazyHTMLElement, binding: DirectiveBinding<LazyLoadOptions>) {
    const options = binding.value || {}
    const threshold = options.threshold ?? 0.1
    const rootMargin = options.rootMargin ?? '50px'
    const errorFallback = options.error || ERROR_PLACEHOLDER_SVG
    const enableWebp = options.webp !== false // 默认启用 WebP

    // 保存原始 URL 用于回退
    const originalSrc = el.dataset.src
    if (originalSrc) {
      el.dataset.originalSrc = originalSrc
    }

    /**
     * 设置元素为加载状态（显示骨架屏）
     */
    const setLoadingState = () => {
      el.classList.add('lazy-loading')

      // 设置加载中的样式
      if (el.tagName === 'IMG') {
        const imgEl = el as HTMLImageElement
        imgEl.style.opacity = '0'
        imgEl.style.transition = 'opacity 0.3s ease-in-out'
        // 使用内联骨架屏背景
        imgEl.style.backgroundColor = '#f0f2f5'
      } else {
        el.style.backgroundColor = '#f0f2f5'
        el.style.opacity = '0'
        el.style.transition = 'opacity 0.3s ease-in-out'
      }
    }

    /**
     * 图片加载成功的处理
     */
    const handleLoadSuccess = (src: string) => {
      if (el.tagName === 'IMG') {
        const imgEl = el as HTMLImageElement
        imgEl.src = src
        // 触发 fade-in 动画
        requestAnimationFrame(() => {
          imgEl.style.opacity = '1'
        })
      } else {
        ;(el as HTMLDivElement).style.backgroundImage = `url(${src})`
        requestAnimationFrame(() => {
          el.style.opacity = '1'
        })
      }

      // 移除加载状态，添加完成状态
      el.classList.remove('lazy-loading')
      el.classList.add('lazy-loaded')
    }

    /**
     * 图片加载失败的处理
     */
    const handleError = (attemptedSrc: string, isWebpAttempt: boolean) => {
      console.warn(`[LazyLoad] Image load failed: ${attemptedSrc}`)

      // 如果是 WebP 加载失败，尝试回退到原始格式
      if (isWebpAttempt && originalSrc) {
        loadWithRetry(getOriginalFormat(attemptedSrc, originalSrc), false)
        return
      }

      // 最终失败，显示错误占位图
      if (el.tagName === 'IMG') {
        const imgEl = el as HTMLImageElement
        imgEl.src = errorFallback
        imgEl.style.opacity = '1'
      } else {
        ;(el as HTMLDivElement).style.backgroundImage = `url(${errorFallback})`
        el.style.opacity = '1'
      }

      el.classList.remove('lazy-loading')
      el.classList.add('lazy-error', 'img-error')
    }

    /**
     * 加载图片（带重试逻辑）
     */
    const loadWithRetry = async (src: string, useWebp: boolean) => {
      let finalSrc = src

      // WebP 转换
      if (useWebp && enableWebp) {
        const webpSupported = await checkWebPSupport()
        if (webpSupported && !/\.webp(\?|$)/i.test(src)) {
          finalSrc = convertToWebp(src)
        }
      }

      // 先设置为加载状态
      setLoadingState()

      // 创建 Image 对象预加载
      const img = new Image()

      img.onload = () => {
        handleLoadSuccess(finalSrc)
      }

      img.onerror = () => {
        handleError(finalSrc, useWebp && enableWebp && finalSrc !== src)
      }

      img.src = finalSrc
      // 保存引用以便清理
      el._lazyImage = img
    }

    /**
     * 执行图片加载
     */
    const setImageSrc = () => {
      const src = el.dataset.src
      if (!src) {
        console.warn('[LazyLoad] No data-src found on element', el)
        return
      }

      loadWithRetry(src, true)
    }

    // 初始化加载状态
    setLoadingState()

    // 使用 IntersectionObserver 实现懒加载
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc()
              observer.unobserve(el)
            }
          })
        },
        { threshold, rootMargin }
      )

      observer.observe(el)
      el._lazyObserver = observer
    } else {
      // 不支持 IntersectionObserver 的浏览器直接加载
      setImageSrc()
    }
  },

  unmounted(el: LazyHTMLElement) {
    // 清理 Observer
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      el._lazyObserver = null
    }

    // 清理正在加载的 Image 对象
    if (el._lazyImage) {
      el._lazyImage.onload = null
      el._lazyImage.onerror = null
      el._lazyImage = null
    }
  },

  // 支持 v-lazy 值更新
  updated(el: LazyHTMLElement, binding: DirectiveBinding<LazyLoadOptions>) {
    // 如果 data-src 发生变化，重新初始化
    if (binding.value?.src && binding.value.src !== el.dataset.src) {
      el.dataset.src = binding.value.src
      el.dataset.originalSrc = binding.value.src

      // 重新触发加载
      if (el._lazyObserver) {
        el._lazyObserver.disconnect()
      }

      // 重新设置观察或直接加载
      if ('IntersectionObserver' in window) {
        const options = binding.value || {}
        const threshold = options.threshold ?? 0.1
        const rootMargin = options.rootMargin ?? '50px'

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const src = el.dataset.src
                if (src) {
                  const img = new Image()
                  img.onload = () => {
                    if (el.tagName === 'IMG') {
                      ;(el as HTMLImageElement).src = src
                      el.style.opacity = '1'
                    }
                    el.classList.add('lazy-loaded')
                  }
                  img.src = src
                }
                observer.unobserve(el)
              }
            })
          },
          { threshold, rootMargin }
        )

        observer.observe(el)
        el._lazyObserver = observer
      }
    }
  }
}

/**
 * 设置全局懒加载指令
 * @param app Vue 应用实例
 */
export function setupLazyLoadDirective(app: App) {
  app.directive('lazy', lazyLoadDirective)
}

export default lazyLoadDirective
