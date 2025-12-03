// src-vue3/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'normalize.css'
import '@/styles/global.scss'

import App from './App.vue'
import routes from './router'

// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 状态管理
const pinia = createPinia()

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

// 全局属性
app.config.globalProperties.$APP = {
  name: '黑科易购',
  version: '2.0.0',
}

// 挂载应用
app.mount('#app')
