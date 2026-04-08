<template>
  <el-dropdown trigger="click" @command="switchLang" class="lang-switch">
    <span class="cursor-pointer flex items-center gap-1 text-sm hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary-50">
      <span class="text-base">{{ currentFlag }}</span>
      <span class="hidden sm:inline font-medium">{{ currentLabel }}</span>
      <el-icon class="text-xs"><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in availableLocales"
          :key="locale.code"
          :command="locale.code"
          :class="{ 'is-active': locale.value === locale.code }"
        >
          <span class="flex items-center gap-2">
            <span>{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <el-icon v-if="locale.value === locale.code" class="text-primary ml-auto"><Check /></el-icon>
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
  const found = availableLocales.find(l => l.code === locale.value)
  return found?.flag || '🌐'
})

const currentLabel = computed(() => {
  const found = availableLocales.find(l => l.code === locale.value)
  return found?.name || locale.value
})

function switchLang(lang: string | number | object) {
  setLocale(lang as Locale)
}
</script>

<style scoped>
.lang-switch :deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style>
