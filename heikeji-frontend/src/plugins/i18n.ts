import { createI18n } from 'vue-i18n'
import zhCN from '@/locales/zh-CN'
import enUS from '@/locales/en-US'

// 定义语言环境
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

// 创建i18n实例
const i18n = createI18n({
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
  legacy: false, // 使用组合式API
  globalInjection: true, // 全局注入$t和$i18n
})

export default i18n
