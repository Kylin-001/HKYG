import { defineAsyncComponent, type AsyncComponentLoader } from 'vue'

interface AsyncComponentOptions {
  loader: AsyncComponentLoader
  loadingComponent?: ReturnType<typeof defineAsyncComponent>
  errorComponent?: ReturnType<typeof defineAsyncComponent>
  delay?: number
  timeout?: number
  retryable?: boolean
  maxRetries?: number
  name?: string
}

const DEFAULT_LOADING = defineAsyncComponent({
  loader: () => import('@/components/global/USTHLogo.vue'),
})

function createLoadingSkeleton() {
  return {
    template: `
      <div class="async-loading-skeleton" style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        background: linear-gradient(90deg, #f0f2f5 25%, #e8eef5 50%, #f0f2f5 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 1.5s ease-in-out infinite;
        border-radius: 12px;
      ">
        <style>
          @keyframes skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        </style>
        <span style="color: #000AB0; font-weight: 600;">加载中...</span>
      </div>
    `,
  }
}

function createErrorFallback(name?: string) {
  const displayName = name || '组件'
  return {
    template: `
      <div class="async-error-fallback" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        padding: 24px;
        text-align: center;
        color: #64748b;
      ">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style="margin-top: 12px; font-size: 14px;">${displayName} 加载失败</p>
        <button @click="$emit('retry')" style="
          margin-top: 12px;
          padding: 6px 20px;
          background: #000AB0;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        ">重试</button>
      </div>
    `,
  }
}

export function createHeavyComponent(options: AsyncComponentOptions) {
  const {
    loader,
    delay = 200,
    timeout = 10000,
    retryable = true,
    maxRetries = 2,
    name,
  } = options

  let attempt = 0

  const enhancedLoader: AsyncComponentLoader = () => {
    attempt++
    return loader().catch((error) => {
      if (retryable && attempt <= maxRetries) {
        console.warn(`[AsyncComponent] Retry ${attempt}/${maxRetries} for ${name || 'component'}`)
        return new Promise((resolve) =>
          setTimeout(() => resolve(enhancedLoader()), Math.pow(2, attempt) * 500)
        )
      }
      throw error
    })
  }

  return defineAsyncComponent({
    loader: enhancedLoader,
    loadingComponent: options.loadingComponent || (createLoadingSkeleton() as any),
    errorComponent: options.errorComponent || (createErrorFallback(name) as any),
    delay,
    timeout,
    suspensible: true,
  })
}

export function createAdminDashboard() {
  return createHeavyComponent({
    name: 'AnalyticsDashboard',
    loader: () => import('@/components/admin/AnalyticsDashboard.vue'),
    delay: 300,
    timeout: 15000,
  })
}

export function createEChartsComponent(loader: AsyncComponentLoader, name: string) {
  return createHeavyComponent({
    name,
    loader,
    delay: 150,
    timeout: 8000,
  })
}

export function preloadComponent(loader: AsyncComponentLoader): void {
  loader().catch(() => {})
}

export function preloadRoutes(routeNames: string[], router: any): void {
  routeNames.forEach((name) => {
    try {
      const resolved = router.resolve({ name })
      if (resolved?.matched?.length > 0) {
        const record = resolved.matched[resolved.matched.length - 1]
        if (record?.components?.default) {
          const comp = record.components.default
          if (typeof comp === 'function') {
            comp().catch(() => {})
          }
        }
      }
    } catch {}
  })
}
