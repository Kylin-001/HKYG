<!--
@fileoverview 主题管理组件
@description 支持主题切换、主题持久化和动态主题配置
@example
  <ThemeManager
    :default-theme="'light'"
    @theme-change="handleThemeChange"
  />

  或作为函数调用:
  import { useThemeManager } from '@/components/ui/ThemeManager'
  const { theme, switchTheme, themes } = useThemeManager()
-->
<template>
  <div
    v-if="mergedProps.showSelector"
    class="theme-manager"
    :class="{ floating: mergedProps.floating }"
  >
    <el-dropdown
      :trigger="mergedProps.trigger"
      :hide-on-click="mergedProps.hideOnClick"
      @command="handleThemeChange"
    >
      <span class="theme-selector">
        <el-icon :size="mergedProps.iconSize"><component :is="currentThemeIcon" /></el-icon>
        <span v-if="mergedProps.showText" class="theme-text">{{ currentThemeName }}</span>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="theme in availableThemes"
            :key="theme.value"
            :command="theme.value"
            :disabled="theme.disabled"
          >
            <div class="theme-item">
              <div class="theme-color-preview" :style="{ backgroundColor: theme.color }"></div>
              <span class="theme-label">{{ theme.label }}</span>
              <el-icon v-if="theme.value === currentTheme" :size="14"><Check /></el-icon>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { Sun, Moon, Monitor } from '@element-plus/icons-vue'

// 定义接口
interface ThemeOption {
  value: string
  label: string
  color: string
  icon: any
  disabled?: boolean
}

interface ThemeManagerOptions {
  defaultTheme?: string
  storageKey?: string
  themes?: ThemeOption[]
  showSelector?: boolean
  floating?: boolean
  trigger?: 'hover' | 'click' | 'contextmenu'
  hideOnClick?: boolean
  showText?: boolean
  iconSize?: number
}

// 全局主题管理状态
const globalTheme = ref<string>('light')
const isThemeInitialized = ref<boolean>(false)

// 主题图标映射
const themeIcons = {
  light: Sun,
  dark: Moon,
  auto: Monitor,
}

// 默认主题列表
const defaultThemes: ThemeOption[] = [
  {
    value: 'light',
    label: '浅色主题',
    color: '#ffffff',
    icon: Sun,
  },
  {
    value: 'dark',
    label: '深色主题',
    color: '#1a1a1a',
    icon: Moon,
  },
  {
    value: 'auto',
    label: '跟随系统',
    color: '#409eff',
    icon: Monitor,
    disabled: false, // 启用自动主题
  },
]

// 主题管理组合式函数
export const useThemeManager = (options: ThemeManagerOptions = {}) => {
  const { defaultTheme = 'light', storageKey = 'heikeji-theme', themes = defaultThemes } = options

  // 检测系统主题的工具函数
  const isSystemDarkMode = () => {
    // 检查window.matchMedia是否存在（在测试环境中可能不存在）
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    // 默认返回浅色主题
    return false
  }

  // 应用主题
  const applyTheme = (theme: string) => {
    const root = document.documentElement

    // 添加过渡类
    root.classList.add('theme-transition')

    let actualTheme = theme

    // 处理自动主题
    if (theme === 'auto') {
      // 检测系统主题
      const prefersDark = isSystemDarkMode()
      actualTheme = prefersDark ? 'dark' : 'light'
    }

    // 设置主题属性
    root.setAttribute('data-theme', actualTheme)

    // 触发主题变化事件
    window.dispatchEvent(
      new CustomEvent('theme-change', { detail: { theme: actualTheme, originalTheme: theme } })
    )

    // 移除过渡类
    setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 500) // 与CSS过渡时间一致
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    // 检查window.matchMedia是否存在（在测试环境中可能不存在）
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      // 如果不存在，返回空函数
      return () => {}
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (globalTheme.value === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  // 切换主题
  const switchTheme = (theme: string) => {
    globalTheme.value = theme
    localStorage.setItem(storageKey, theme)
    applyTheme(theme)
  }

  // 初始化主题
  if (!isThemeInitialized.value) {
    const savedTheme = localStorage.getItem(storageKey) || defaultTheme
    globalTheme.value = savedTheme
    applyTheme(savedTheme)
    isThemeInitialized.value = true

    // 设置系统主题监听
    setupSystemThemeListener()
  }

  // 获取当前主题配置
  const currentThemeConfig = computed(() => {
    return themes.find(t => t.value === globalTheme.value) || themes[0]
  })

  return {
    theme: globalTheme,
    themes,
    currentThemeConfig,
    switchTheme,
    applyTheme,
  }
}
</script>

<script setup lang="ts">
import { computed, watch, onMounted, provide } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { useThemeManager } from './ThemeManager.vue'

// 定义组件属性
const props = withDefaults(
  defineProps<{
    // 默认主题
    defaultTheme?: string
    // 是否显示主题选择器
    showSelector?: boolean
    // 是否浮动显示
    floating?: boolean
    // 触发方式
    trigger?: 'hover' | 'click' | 'contextmenu'
    // 点击菜单项后是否隐藏菜单
    hideOnClick?: boolean
    // 是否显示文字
    showText?: boolean
    // 图标大小
    iconSize?: number
    // 自定义主题列表
    customThemes?: ThemeOption
  }>(),
  {
    defaultTheme: 'light',
    showSelector: true,
    floating: false,
    trigger: 'click',
    hideOnClick: true,
    showText: true,
    iconSize: 18,
  }
)

// 使用props直接访问，不需要mergedProps
const mergedProps = props

// 定义事件
const emit = defineEmits<{
  (e: 'theme-change', theme: string): void
}>()

// 使用主题管理器
const { theme, switchTheme, themes } = useThemeManager({
  defaultTheme: mergedProps.defaultTheme,
})

// 当前主题
const currentTheme = computed(() => theme.value)

// 可用主题
const availableThemes = computed(() => {
  return props.customThemes || themes
})

// 当前主题名称
const currentThemeName = computed(() => {
  const themeConfig = availableThemes.value.find(t => t.value === currentTheme.value)
  return themeConfig?.label || currentTheme.value
})

// 当前主题图标
const currentThemeIcon = computed(() => {
  const themeConfig = availableThemes.value.find(t => t.value === currentTheme.value)
  return themeConfig?.icon || themeIcons[currentTheme.value as keyof typeof themeIcons] || Sun
})

// 处理主题变化
const handleThemeChange = (themeValue: string) => {
  switchTheme(themeValue)
  emit('theme-change', themeValue)
}

// 监听主题变化
watch(
  () => props.defaultTheme,
  newTheme => {
    if (newTheme && !localStorage.getItem('heikeji-theme')) {
      switchTheme(newTheme)
      emit('theme-change', newTheme)
    }
  }
)

// 监听全局主题变化，触发组件事件
watch(theme, (newTheme, oldTheme) => {
  if (newTheme !== oldTheme) {
    emit('theme-change', newTheme)
  }
})

// 生命周期钩子
onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('heikeji-theme') || mergedProps.defaultTheme
  if (savedTheme !== currentTheme.value) {
    switchTheme(savedTheme)
  }
})

// 提供主题管理
provide('themeManager', {
  theme,
  switchTheme,
  themes: availableThemes,
})
</script>

<style lang="scss" scoped>
.theme-manager {
  display: inline-flex;
  align-items: center;

  &.floating {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9998;
    background-color: var(--color-card-background, #ffffff);
    border: 1px solid var(--color-border-color, #e0e0e0);
    border-radius: 50%;
    box-shadow: var(--color-shadow-base, 0 2px 12px rgba(0, 0, 0, 0.1));
    padding: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--color-shadow-lg, 0 4px 20px rgba(0, 0, 0, 0.15));
    }
  }

  .theme-selector {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--color-hover-background, #f0f8ff);
    }

    .theme-text {
      font-size: 14px;
      color: var(--color-text-regular, #666666);
    }
  }

  .theme-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .theme-color-preview {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid var(--color-border-color, #e0e0e0);
    }

    .theme-label {
      flex: 1;
      font-size: 14px;
    }
  }
}

// 主题过渡效果
.theme-transition {
  transition:
    background-color var(--transition-duration-base) var(--transition-easing),
    color var(--transition-duration-base) var(--transition-easing),
    border-color var(--transition-duration-base) var(--transition-easing),
    box-shadow var(--transition-duration-base) var(--transition-easing);

  /* 应用到所有子元素 */
  * {
    transition:
      background-color var(--transition-duration-base) var(--transition-easing),
      color var(--transition-duration-base) var(--transition-easing),
      border-color var(--transition-duration-base) var(--transition-easing),
      box-shadow var(--transition-duration-base) var(--transition-easing);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .theme-manager {
    &.floating {
      bottom: 10px;
      right: 10px;
      padding: 6px;
    }

    .theme-selector {
      padding: 4px 8px;

      .theme-text {
        display: none;
      }
    }
  }
}
</style>
