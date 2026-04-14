/**
 * useScrollAnimate - 滚动触发动画组合式函数
 * 提供 Intersection Observer 封装的滚动动画功能
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface ScrollAnimateOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimate(
  elementRef: Ref<HTMLElement | null>,
  options: ScrollAnimateOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options

  const isVisible = ref(false)
  const hasTriggered = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    // 检查是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // 降级处理：直接显示
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 添加延迟
            if (delay > 0) {
              setTimeout(() => {
                isVisible.value = true
              }, delay)
            } else {
              isVisible.value = true
            }

            hasTriggered.value = true

            // 如果只触发一次，取消观察
            if (triggerOnce && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer && elementRef.value) {
      observer.unobserve(elementRef.value)
      observer.disconnect()
    }
  })

  return {
    isVisible,
    hasTriggered
  }
}

/**
 * useScrollAnimateGroup - 批量滚动动画
 * 为一组元素添加交错动画
 */
export function useScrollAnimateGroup(
  containerRef: Ref<HTMLElement | null>,
  selector: string = '.scroll-animate',
  options: ScrollAnimateOptions & { staggerDelay?: number } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    staggerDelay = 100
  } = options

  const visibleItems = ref<Set<number>>(new Set())
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return

    const items = containerRef.value.querySelectorAll(selector)
    if (items.length === 0) return

    if (!('IntersectionObserver' in window)) {
      // 降级处理
      items.forEach((_, index) => {
        visibleItems.value.add(index)
      })
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(items).indexOf(entry.target as HTMLElement)
            
            // 交错延迟
            setTimeout(() => {
              visibleItems.value = new Set([...visibleItems.value, index])
            }, index * staggerDelay)

            if (triggerOnce && observer) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    items.forEach((item) => {
      observer?.observe(item)
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    visibleItems,
    isItemVisible: (index: number) => visibleItems.value.has(index)
  }
}

/**
 * useParallax - 视差滚动效果
 */
export function useParallax(
  elementRef: Ref<HTMLElement | null>,
  speed: number = 0.5
) {
  const offset = ref(0)
  let rafId: number | null = null

  const handleScroll = () => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // 计算元素在视口中的位置
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = windowHeight / 2
    const distance = elementCenter - viewportCenter
    
    offset.value = distance * speed
  }

  const smoothScroll = () => {
    handleScroll()
    rafId = requestAnimationFrame(smoothScroll)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  return {
    offset
  }
}

export default useScrollAnimate
