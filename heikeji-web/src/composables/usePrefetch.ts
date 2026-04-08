import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

interface PrefetchEntry {
  routeName: string
  priority: number
  fetched: boolean
  fetchTime?: number
}

type PrefetchStrategy = 'hover' | 'visible' | 'idle' | 'immediate'

interface UsePrefetchOptions {
  strategy?: PrefetchStrategy
  idleTimeout?: number
  hoverDelay?: number
  visibleThreshold?: number
  maxConcurrent?: number
  onPrefetchStart?: (routeName: string) => void
  onPrefetchComplete?: (routeName: string, duration: number) => void
  onPrefetchError?: (routeName: string, error: Error) => void
}

const prefetchQueue: Map<string, () => Promise<any>> = new Map()
const prefetchHistory: Map<string, PrefetchEntry> = new Map()
let activeFetchCount = 0
const MAX_CONCURRENT_DEFAULT = 3

function getRouteKey(route: RouteLocationNormalized): string {
  return route.name ? String(route.name) : route.path
}

async function executePrefetch(
  key: string,
  loader: () => Promise<any>,
  entry: PrefetchEntry,
  callbacks?: Partial<UsePrefetchOptions>
): Promise<void> {
  if (activeFetchCount >= MAX_CONCURRENT_DEFAULT) {
    return
  }

  activeFetchCount++
  entry.fetched = false
  callbacks?.onPrefetchStart?.(key)

  const startTime = performance.now()

  try {
    await loader()
    entry.fetched = true
    entry.fetchTime = Math.round(performance.now() - startTime)
    callbacks?.onPrefetchComplete?.(key, entry.fetchTime)
  } catch (error) {
    entry.fetched = false
    callbacks?.onPrefetchError?.(key, error as Error)
  } finally {
    activeFetchCount--
    processQueue(callbacks)
  }
}

function processQueue(callbacks?: Partial<UsePrefetchOptions>): void {
  if (activeFetchCount >= MAX_CONCURRENT_DEFAULT) return

  for (const [key, loader] of prefetchQueue.entries()) {
    if (activeFetchCount >= MAX_CONCURRENT_DEFAULT) break

    const entry = prefetchHistory.get(key) || {
      routeName: key,
      priority: 0,
      fetched: false,
    }

    prefetchQueue.delete(key)
    executePrefetch(key, loader, entry, callbacks)
  }
}

export function usePrefetch(options: UsePrefetchOptions = {}) {
  const {
    strategy = 'hover',
    idleTimeout = 2000,
    hoverDelay = 150,
    maxConcurrent = MAX_CONCURRENT_DEFAULT,
    onPrefetchStart,
    onPrefetchComplete,
    onPrefetchError,
  } = options

  const isIdle = ref(false)
  const prefetchedRoutes: Ref<string[]> = ref([])
  let idleTimer: ReturnType<typeof setTimeout> | null = null
  let hoverTimer: ReturnType<typeof setTimeout> | null = null
  let visibilityObserver: IntersectionObserver | null = null
  let cleanupFunctions: Array<() => void> = []

  function registerPrefetch(
    route: RouteLocationNormalized,
    componentLoader: () => Promise<any>,
    priority: number = 0
  ): void {
    const key = getRouteKey(route)

    if (prefetchHistory.has(key) && prefetchHistory.get(key)!.fetched) {
      return
    }

    const entry: PrefetchEntry = {
      routeName: key,
      priority,
      fetched: false,
    }

    prefetchHistory.set(key, entry)
    prefetchQueue.set(key, componentLoader)

    if (strategy === 'immediate') {
      processQueue({ onPrefetchStart, onPrefetchComplete, onPrefetchError })
    }
  }

  function prefetchRoute(routeName: string, componentLoader: () => Promise<any>): void {
    const key = routeName

    if (prefetchHistory.has(key) && prefetchHistory.get(key)!.fetched) {
      return
    }

    const entry: PrefetchEntry = {
      routeName: key,
      priority: 10,
      fetched: false,
    }

    prefetchHistory.set(key, entry)
    prefetchQueue.set(key, componentLoader)
    processQueue({ onPrefetchStart, onPrefetchComplete, onPrefetchError })
  }

  function handleHover(element: HTMLElement, route: RouteLocationNormalized, loader: () => Promise<any>): void {
    if (strategy !== 'hover') return

    element.addEventListener('mouseenter', () => {
      if (hoverTimer) clearTimeout(hoverTimer)
      hoverTimer = setTimeout(() => {
        registerPrefetch(route, loader, 5)
      }, hoverDelay)
    })

    element.addEventListener('mouseleave', () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }
    })
  }

  function observeElement(
    element: HTMLElement,
    route: RouteLocationNormalized,
    loader: () => Promise<any>,
    threshold: number = 0.1
  ): void {
    if (strategy !== 'visible' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            registerPrefetch(route, loader, 3)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(element)
    cleanupFunctions.push(() => observer.disconnect())
    visibilityObserver = observer
  }

  function setupIdleCallback(): void {
    if (strategy !== 'idle' || !('requestIdleCallback' in window)) return

    const callback = (deadline: IdleDeadline) => {
      isIdle.value = true

      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && prefetchQueue.size > 0) {
        const [key, loader] = prefetchQueue.entries().next().value
        if (!key) break

        prefetchQueue.delete(key)
        const entry = prefetchHistory.get(key) || { routeName: key, priority: 0, fetched: false }
        executePrefetch(key, loader, entry, { onPrefetchStart, onPrefetchComplete, onPrefetchError })
      }

      if (prefetchQueue.size > 0) {
        requestIdleCallback(callback)
      }
    }

    idleTimer = setTimeout(() => {
      requestIdleCallback(callback)
    }, idleTimeout)
  }

  function getStats() {
    return {
      totalRegistered: prefetchHistory.size,
      fetched: Array.from(prefetchHistory.values()).filter(e => e.fetched).length,
      pending: prefetchQueue.size,
      active: activeFetchCount,
      history: Array.from(prefetchHistory.values()),
    }
  }

  function clearAll(): void {
    prefetchQueue.clear()
    if (idleTimer) clearTimeout(idleTimer)
    if (hoverTimer) clearTimeout(hoverTimer)
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
    if (visibilityObserver) {
      visibilityObserver.disconnect()
      visibilityObserver = null
    }
  }

  onMounted(() => {
    setupIdleCallback()
  })

  onUnmounted(() => {
    clearAll()
  })

  return {
    isIdle,
    prefetchedRoutes,
    registerPrefetch,
    prefetchRoute,
    handleHover,
    observeElement,
    getStats,
    clearAll,
  }
}

export function prefetchOnLinkHover(
  linkSelector: string = 'a[href]',
  router: any,
  routeComponentMap: Record<string, () => Promise<any>>
): () => void {
  const handlers: Array<() => void> = []

  function handleClick(event: Event) {
    const target = event.currentTarget as HTMLAnchorElement
    const href = target.getAttribute('href')
    if (!href) return

    try {
      const resolved = router.resolve(href)
      const loader = routeComponentMap[resolved.name as string]
      if (loader) {
        loader().catch(() => {})
      }
    } catch {}
  }

  document.querySelectorAll(linkSelector).forEach((link) => {
    link.addEventListener('click', handleClick)
    handlers.push(() => link.removeEventListener('click', handleClick))
  })

  return () => handlers.forEach(h => h())
}

export default usePrefetch
