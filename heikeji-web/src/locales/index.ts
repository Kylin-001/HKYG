import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import ruRU from './ru-RU'

export type Locale = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'ru-RU'

const i18n = createI18n({
  legacy: false,
  locale: (localStorage.getItem('heikeji-locale') as Locale) || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'ru-RU': ruRU,
  },
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
})

export default i18n

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('heikeji-locale', locale)

  document.documentElement.setAttribute('lang', locale)
}

export function getLocale(): Locale {
  return i18n.global.locale.value as Locale
}

export const availableLocales = [
  { code: 'zh-CN' as Locale, name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US' as Locale, name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP' as Locale, name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR' as Locale, name: '한국어', flag: '🇰🇷' },
  { code: 'ru-RU' as Locale, name: 'Русский', flag: '🇷🇺' },
]
