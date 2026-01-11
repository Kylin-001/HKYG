import { createPinia } from 'pinia'
import type { App } from 'vue'

// 创建pinia实例
const pinia = createPinia()

// 导出pinia插件，供app使用
export function setupStore(app: App<Element>) {
  app.use(pinia)
}

// 导出pinia实例，供其他地方使用
export { pinia }

// 导出各个store模块，保持与原Vuex结构一致
export * from './modules/app'
export * from './modules/user'
export * from './modules/product'
export * from './modules/order'
export * from './modules/permission'
export * from './modules/marketing'
export * from './modules/system'
export * from './modules/campus'
export * from './modules/dashboard'
export * from './modules/courier'
export * from './modules/cart'

export default pinia
