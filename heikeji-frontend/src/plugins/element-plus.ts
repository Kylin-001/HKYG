import { App } from 'vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 定义需要全局注册的组件列表
const components = [
  // 可以在这里添加需要全局注册的Element Plus组件
  // 例如：ElButton, ElInput, ElTable 等
]

// 定义Element Plus的全局配置
const elementPlusConfig = {
  size: 'default', // 组件默认尺寸
  zIndex: 3000, // 弹框默认z-index
}

/**
 * 注册Element Plus插件
 * @param app Vue应用实例
 */
export function setupElementPlus(app: App<Element>) {
  // 设置全局配置
  app.config.globalProperties.$ELEMENT = elementPlusConfig

  // 注册组件
  components.forEach(component => {
    app.component(component.name, component)
  })

  // 全局注册所有Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 挂载全局方法
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$prompt = ElMessageBox.prompt

  // 挂载到全局属性上，方便Composition API使用
  app.provide('$message', ElMessage)
  app.provide('$notify', ElNotification)
  app.provide('$confirm', ElMessageBox.confirm)
  app.provide('$alert', ElMessageBox.alert)
  app.provide('$prompt', ElMessageBox.prompt)
}

// 导出常用方法
export { ElMessage, ElNotification, ElMessageBox }

// 导出Element Plus配置
export { elementPlusConfig }
