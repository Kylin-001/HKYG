<template>
  <el-dropdown
    trigger="click"
    class="lang-switch"
    @command="switchLang"
  >
    <span class="cursor-pointer flex items-center gap-1 text-sm hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary-50">
      <span class="text-base">{{ currentFlag }}</span>
      <span class="hidden sm:inline font-medium">{{ currentLabel }}</span>
      <el-icon class="text-xs"><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in availableLocales"
          :key="item.code"
          :command="item.code"
          :class="{ 'is-active': locale === item.code }"
        >
          <span class="flex items-center gap-2">
            <span>{{ item.flag }}</span>
            <span>{{ item.name }}</span>
            <el-icon
              v-if="locale === item.code"
              class="text-primary ml-auto"
            ><Check /></el-icon>
          </span>
        </el-dropdown-item>
        <el-dropdown-item
          divided
          @click="resetLocale"
        >
          <span class="flex items-center gap-2 text-gray-500">
            <span>🔄</span>
            <span>重置为默认</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, Check } from '@element-plus/icons-vue'
import { setLocale, availableLocales, type Locale } from '@/locales'

const { locale } = useI18n()

const currentFlag = computed(() => {
  const code = locale.value
  // 首先尝试精确匹配
  const found = availableLocales.find(l => l.code === code)
  if (found) {
    return found.flag
  }
  // 处理简化的语言代码 - 只保留中文和英语
  const codeMap: Record<string, Locale> = {
    us: 'en-US',
    en: 'en-US',
    zh: 'zh-CN',
  }
  const mappedCode = codeMap[code.toLowerCase()]
  if (mappedCode) {
    const mappedFound = availableLocales.find(l => l.code === mappedCode)
    if (mappedFound) {
      return mappedFound.flag
    }
  }
  // 最后尝试前缀匹配
  const prefixMatch = availableLocales.find(l => l.code.toLowerCase().startsWith(code.toLowerCase().split('-')[0]))
  return prefixMatch?.flag || '🌐'
})

const currentLabel = computed(() => {
  const code = String(locale.value || '')
  // 首先尝试精确匹配
  const found = availableLocales.find(l => l.code === code)
  if (found) {
    return found.name
  }
  // 处理简化的语言代码（如 'us' -> 'en-US', 'zh' -> 'zh-CN'）- 只保留中文和英语
  const codeMap: Record<string, Locale> = {
    us: 'en-US',
    en: 'en-US',
    zh: 'zh-CN',
  }
  const mappedCode = codeMap[code.toLowerCase()]
  if (mappedCode) {
    const mappedFound = availableLocales.find(l => l.code === mappedCode)
    if (mappedFound) {
      return mappedFound.name
    }
  }
  // 最后尝试从语言代码前缀匹配（如 'en-US' 匹配 'en'）
  const prefixMatch = availableLocales.find(l => l.code.toLowerCase().startsWith(code.toLowerCase().split('-')[0]))
  if (prefixMatch) {
    return prefixMatch.name
  }
  return code
})

function switchLang(lang: string | number | object) {
  setLocale(lang as Locale)
}

function resetLocale() {
  localStorage.removeItem('heikeji-locale')
  setLocale('zh-CN')
  // 使用路由跳转代替页面刷新，避免整页重载
  // window.location.reload()
}
</script>

<style scoped>
.lang-switch :deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style>
