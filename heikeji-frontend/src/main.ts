import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { setupElementPlus } from './plugins/element-plus'
import { ElMessage } from 'element-plus'
import Vue3Lazyload from 'vue3-lazyload'
import { registerPermissionDirective } from './directives/permission'
import i18n from './plugins/i18n'
import securityPlugin from './plugins/security'
import 'nprogress/nprogress.css'
import 'normalize.css'
import './styles/index.scss'
import './styles/element-plus.scss'

// 创建应用实例
const app = createApp(App)

// 创建Pinia实例
const pinia = createPinia()

// 使用插件
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(securityPlugin)

// 配置Element Plus
setupElementPlus(app)

// 配置图片懒加载
app.use(Vue3Lazyload, {
  preLoad: 1.3,
  loading: '/src/assets/images/loading.svg',
  error: '/src/assets/images/error.svg',
  attempt: 1,
  lazyComponent: true,
})

// 注册权限指令
registerPermissionDirective(app)

// 全局错误处理
app.config.errorHandler = (err: unknown, instance: any, info: string) => {
  console.error('Vue全局错误:', err)
  console.error('错误信息:', info)
  ElMessage.error(`应用错误: ${err instanceof Error ? err.message : String(err)}`)
}

// 挂载应用
app.mount('#app')

console.log('🚀 黑科易购前端项目启动成功!')
console.log('🌟 Vue版本:', app.version)
console.log('🔧 环境:', import.meta.env.MODE)
