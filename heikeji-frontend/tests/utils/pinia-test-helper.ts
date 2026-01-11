import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/**
 * Pinia 测试辅助工具
 * 用于在测试中正确初始化 Pinia store 和 Vue 应用
 */
export const setupPinia = () => {
  const pinia = createPinia()

  return {
    pinia,
  }
}

/**
 * 重置 Pinia store 状态
 * @param pinia - Pinia 实例
 */
export const resetPinia = (pinia: ReturnType<typeof createPinia>) => {
  const stores = pinia.state.value
  Object.keys(stores).forEach(key => {
    delete stores[key]
  })
}
