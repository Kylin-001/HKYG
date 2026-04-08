import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

import './styles/global.css'

import i18n from './locales'
import { setupLazyLoadDirective } from './directives/lazyLoad'
import { setupErrorHandler } from './utils/errorHandler'
import { createPersistedState } from './utils/piniaPersist'

// 新增：PWA增强
import { initPWA } from '@/utils/pwaHelper'

// 新增：性能监控系统
import { perfMonitor } from '@/utils/performance/monitor'
import { connectMonitorToReporter } from '@/utils/performance/reporter'

// 新增：用户行为追踪系统
import { initAnalytics } from '@/utils/analytics/tracker'

// 新增：可访问性
import focusVisibleDirective from '@/directives/focusVisible'

// 新增：追踪指令
import { setupTrackDirectives } from '@/directives/track'

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
setupTrackDirectives(app)

app.mount('#app')

// 初始化用户会话
const userStore = useUserStore()
userStore.restoreSession()
if (userStore.token) {
  userStore.fetchUserInfo().catch(() => {})
}

// 初始化PWA增强版Service Worker
initPWA({
  onUpdateFound: (registration) => {
    console.log('[PWA] 新版本可用，正在后台更新...')
  },
  onActivated: () => {
    console.log('[PWA] Service Worker 已激活')
  }
})

// 初始化性能监控（仅在开发环境或带perf参数时）
if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('perf')) {
  try {
    if (typeof perfMonitor !== 'undefined' && typeof perfMonitor.startMonitoring === 'function') {
      perfMonitor.startMonitoring()
    }
  } catch {
    console.warn('[Perf] 性能监控初始化失败，已忽略')
  }
}
connectMonitorToReporter()

// 初始化用户行为追踪系统
initAnalytics()

// 原有Service Worker注册（降级方案）
if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error)
      })
  })
}

declare module 'vue' {
  interface HTMLElement {
    _lazyObserver?: IntersectionObserver | null
  }
}

export type { VueApp }
