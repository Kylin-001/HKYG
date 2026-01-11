// i18n辅助函数
import { useI18n } from 'vue-i18n'

export function useTranslation() {
  const { t, locale, setLocale, availableLocales } = useI18n()

  // 切换语言
  const changeLanguage = async (lang: string) => {
    if (locale.value !== lang) {
      setLocale(lang)
      localStorage.setItem('language', lang)
    }
  }

  // 获取当前语言
  const getCurrentLanguage = () => {
    return locale.value
  }

  // 初始化语言
  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && availableLocales.includes(savedLanguage)) {
      setLocale(savedLanguage)
    }
  }

  return {
    t,
    locale,
    setLocale,
    availableLocales,
    changeLanguage,
    getCurrentLanguage,
    initLanguage,
  }
}

// 组件内使用的翻译装饰器
export function withTranslation<T>(component: T): T {
  return component
}

// 翻译类型辅助函数
export type TranslationKey = keyof typeof import('@/locales/zh-CN').default
