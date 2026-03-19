import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import { createPinia } from 'pinia'
import { setupElementPlus } from './plugins/element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import Vue3Lazyload from 'vue3-lazyload'
import { registerPermissionDirective } from './directives/permission'
import i18n from './plugins/i18n'
import securityPlugin from './plugins/security'
import 'nprogress/nprogress.css'
import 'normalize.css'
import './styles/index.scss'
import './styles/element-plus.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(securityPlugin)

setupElementPlus(app)

app.use(Vue3Lazyload, {
  preLoad: 1.3,
  loading: '/src/assets/images/loading.svg',
  error: '/src/assets/images/error.svg',
  attempt: 1,
  lazyComponent: true,
})

registerPermissionDirective(app)

const errorHandler = (err: unknown, instance: any, info: string) => {
  const errorInfo = {
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : '',
    info,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  }

  console.error('=== 全局错误捕获 ===', errorInfo)

  if (import.meta.env.DEV) {
    console.error('开发模式详细错误:', err)
    if (instance) {
      console.error('错误组件:', instance.$options.name || '匿名组件')
    }
  }

  const errorType = classifyError(err, info)
  handleErrorByType(errorType, errorInfo)
}

function classifyError(err: unknown, info: string): string {
  if (err instanceof TypeError) return 'type_error'
  if (err instanceof ReferenceError) return 'reference_error'
  if (err instanceof SyntaxError) return 'syntax_error'
  if (err instanceof RangeError) return 'range_error'
  if (info?.includes('network')) return 'network_error'
  if (info?.includes('promise')) return 'promise_error'
  return 'unknown_error'
}

function handleErrorByType(type: string, info: any) {
  const errorMessages: Record<string, { message: string; duration: number }> = {
    network_error: { message: '网络连接失败，请检查网络设置', duration: 5000 },
    promise_error: { message: '异步操作失败，请稍后重试', duration: 4000 },
    type_error: { message: '数据处理异常', duration: 3000 },
    reference_error: { message: '页面资源加载失败', duration: 4000 },
    unknown_error: { message: '操作失败，请稍后重试', duration: 3000 },
  }

  const config = errorMessages[type] || errorMessages.unknown_error

  if (import.meta.env.PROD) {
    reportToMonitoring(info)
  }

  ElMessage.error({
    message: config.message,
    duration: config.duration,
    grouping: true,
  })
}

function reportToMonitoring(errorInfo: any) {
  const monitoringEndpoint = import.meta.env.VITE_MONITORING_ENDPOINT

  if (monitoringEndpoint) {
    fetch(monitoringEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'frontend_error',
        data: errorInfo,
        appVersion: '1.0.0',
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  }
}

window.addEventListener('unhandledrejection', event => {
  console.error('未处理的Promise拒绝:', event.reason)
  ElMessage.warning('有未完成的后台操作')
})

window.addEventListener('error', event => {
  if (event.error) {
    console.error('资源加载错误:', event.error)
  } else {
    console.error('资源加载失败:', event.target)
  }
})

app.config.errorHandler = errorHandler

app.mount('#app')

console.log('🚀 黑科易购前端项目启动成功!')
console.log('🌟 Vue版本:', app.version)
console.log('🔧 环境:', import.meta.env.MODE)
