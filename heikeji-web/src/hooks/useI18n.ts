import { computed, watch } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import type { Locale } from '@/locales'

export function useI18n() {
  const { t, locale, availableLocales: locales } = useVueI18n()

  const currentLocale = computed(() => locale.value as Locale)

  const isZhCN = computed(() => locale.value === 'zh-CN')
  const isEnUS = computed(() => locale.value === 'en-US')

  function switchLocale(newLocale: Locale) {
    if (newLocale !== locale.value) {
      locale.value = newLocale
      localStorage.setItem('heikeji-locale', newLocale)

      document.documentElement.setAttribute('lang', newLocale)
    }
  }

  function formatMessage(key: string, params?: Record<string, unknown>): string {
    if (params) {
      return t(key, params).toString()
    }
    return t(key).toString()
  }

  function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(currentLocale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    })
  }

  function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleTimeString(currentLocale.value, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} ${formatTime(date)}`
  }

  function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
    return num.toLocaleString(currentLocale.value, options)
  }

  function formatCurrency(amount: number, currency?: string): string {
    return amount.toLocaleString(currentLocale.value, {
      style: 'currency',
      currency: currency || (isZhCN.value ? 'CNY' : 'USD'),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return t('time.justNow').toString()
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return t('time.minutesAgo', { minutes: diffInMinutes }).toString()
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return t('time.hoursAgo', { hours: diffInHours }).toString()
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return t('time.daysAgo', { days: diffInDays }).toString()
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return t('time.weeksAgo', { weeks: diffInWeeks }).toString()
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return t('time.monthsAgo', { months: diffInMonths }).toString()
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return t('time.yearsAgo', { years: diffInYears }).toString()
  }

  watch(currentLocale, (newLocale) => {
    document.documentElement.setAttribute('lang', newLocale)
  }, { immediate: true })

  return {
    t,
    locale: currentLocale,
    isZhCN,
    isEnUS,
    availableLocales: locales,
    switchLocale,
    formatMessage,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
  }
}
