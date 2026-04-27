import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入高德地图类型定义
import './types/amap.d'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

// Tailwind CSS 必须在 Element Plus 之前导入，以确保优先级
import './styles/global.css'

// Element Plus 基础样式（函数式组件需要）
import 'element-plus/dist/index.css'

import i18n from './locales'
import { setupLazyLoadDirective } from './directives/lazyLoad'
import { setupErrorHandler } from './utils/errorHandler'
import { createPersistedState } from './utils/piniaPersist'

// 延迟加载非关键模块
const initPWA = async () => {
  const { initPWA } = await import('@/utils/pwaHelper')
  return initPWA
}

const initPerfMonitor = async () => {
  const { perfMonitor } = await import('@/utils/performance/monitor')
  const { connectMonitorToReporter } = await import('@/utils/performance/reporter')
  return { perfMonitor, connectMonitorToReporter }
}

const initAnalytics = async () => {
  const { initAnalytics } = await import('@/utils/analytics/tracker')
  return initAnalytics
}

// 关键指令同步加载
import focusVisibleDirective from '@/directives/focusVisible'

// 追踪指令延迟加载
const setupTrackDirectives = async (app: VueApp) => {
  const { setupTrackDirectives } = await import('@/directives/track')
  setupTrackDirectives(app)
}

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistedState({
  key: (context) => `heikeji-${context.store.$id}`,
  storage: localStorage,
}))

app.use(pinia)
app.use(router)
app.use(i18n)

// 注册所有 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

setupLazyLoadDirective(app)
setupErrorHandler(app)

// 新增：注册全局指令
app.directive('focus-visible', focusVisibleDirective)
// 延迟加载追踪指令
requestIdleCallback(() => {
  setupTrackDirectives(app)
})

app.mount('#app')

// 初始化用户会话（使用 setTimeout 确保 Pinia 已完全初始化）
setTimeout(() => {
  const userStore = useUserStore()
  userStore.restoreSession()
  if (userStore.token) {
    userStore.fetchUserInfo().catch(() => {})
  }
}, 0)

// 延迟初始化非关键功能（使用 requestIdleCallback 确保主线程空闲）
const initNonCriticalFeatures = () => {
  // 初始化PWA增强版Service Worker（仅生产环境）
  if (import.meta.env.PROD) {
    initPWA().then((init) => {
      init({
        onUpdateFound: (registration: any) => {
          console.log('[PWA] 新版本可用，正在后台更新...')
        },
        onActivated: () => {
          console.log('[PWA] Service Worker 已激活')
        }
      })
    })
  }

  // 初始化性能监控（仅在开发环境或带perf参数时）
  if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('perf')) {
    initPerfMonitor().then(({ perfMonitor }) => {
      try {
        if (typeof perfMonitor !== 'undefined' && typeof perfMonitor.startMonitoring === 'function') {
          perfMonitor.startMonitoring()
        }
      } catch {
        console.warn('[Perf] 性能监控初始化失败，已忽略')
      }
    })
  }

  // 性能数据上报（仅生产环境，开发环境静默）
  if (import.meta.env.PROD) {
    initPerfMonitor().then(({ connectMonitorToReporter }) => {
      connectMonitorToReporter()
    })
  }

  // 初始化用户行为追踪系统
  initAnalytics().then((init) => init())
}

// 使用 requestIdleCallback 延迟加载非关键功能
if ('requestIdleCallback' in window) {
  requestIdleCallback(initNonCriticalFeatures, { timeout: 2000 })
} else {
  setTimeout(initNonCriticalFeatures, 100)
}

// Service Worker管理：生产环境注册，开发环境注销
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // 生产环境：注册 Service Worker
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered with scope:', registration.scope)
        })
        .catch((error) => {
          console.warn('[SW] Service Worker registration failed:', error.message)
        })
    })
  } else {
    // 开发环境：注销所有 Service Worker 并清除缓存
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
        console.log('[SW] Development mode: Service Worker unregistered')
      })
    })
    // 清除所有缓存
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
          console.log('[SW] Development mode: Cache cleared:', cacheName)
        })
      })
    }
  }
}

declare module 'vue' {
  interface HTMLElement {
    _lazyObserver?: IntersectionObserver | null
  }
}

export type { VueApp }
