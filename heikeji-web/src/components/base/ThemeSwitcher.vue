<script setup lang="ts">
/**
 * ThemeSwitcher - 主题切换组件 v3.0
 *
 * @description
 * 黑龙江科技大学设计系统的主题切换组件，提供优雅的亮色/暗色/系统主题切换UI。
 * 支持4种显示模式：Toggle开关、按钮组、下拉菜单、仅图标。
 * 符合WCAG 2.1 AA可访问性标准。
 *
 * @features
 * - 4种显示模式：toggle（开关）、buttons（按钮组）、dropdown（下拉菜单）、icon-only（仅图标）
 * - 3种尺寸规格：sm、md、lg
 * - 流畅的动画效果（滑块滑动、图标旋转/翻转、背景渐变过渡）
 * - 系统主题偏好检测和监听
 * - 完整的键盘导航支持
 * - ARIA无障碍属性
 * - 减少动画偏好支持
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <ThemeSwitcher v-model="theme" />
 *
 * <!-- 完整配置 -->
 * <ThemeSwitcher
 *   v-model="theme"
 *   mode="toggle"
 *   size="lg"
 *   :show-label="true"
 *   :animated="true"
 *   @change="handleThemeChange"
 * />
 *
 * <!-- 导航栏紧凑版 -->
 * <ThemeSwitcher
 *   v-model="theme"
 *   mode="icon-only"
 *   size="sm"
 * />
 *
 * <!-- 按钮组模式 -->
 * <ThemeSwitcher
 *   v-model="theme"
 *   mode="buttons"
 *   :show-icon="true"
 *   :show-label="true"
 * />
 * ```
 */

// ====== 类型导出 ======

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * 显示模式类型
 */
export type DisplayMode = 'toggle' | 'buttons' | 'dropdown' | 'icon-only'

/**
 * 组件尺寸类型
 */
export type SwitcherSize = 'sm' | 'md' | 'lg'

// ====== Props 接口 ======

interface Props {
  /**
   * 当前主题模型值（v-model绑定）
   * - light: 亮色模式
   * - dark: 暗色模式
   * - system: 跟随系统
   */
  modelValue: ThemeMode

  /**
   * 显示模式
   * - toggle: Toggle开关（默认推荐）
   * - buttons: 按钮组（Segmented Control风格）
   * - dropdown: 下拉菜单
   * - icon-only: 仅图标（适用于导航栏紧凑空间）
   * @default 'toggle'
   */
  mode?: DisplayMode

  /**
   * 组件尺寸
   * - sm: 小尺寸 (56×28px)
   * - md: 中等尺寸 (64×32px) - 默认
   * - lg: 大尺寸 (72×36px)
   * @default 'md'
   */
  size?: SwitcherSize

  /**
   * 是否显示标签文字
   * @default false
   */
  showLabel?: boolean

  /**
   * 亮色模式标签文字
   * @default '亮色'
   */
  lightLabel?: string

  /**
   * 暗色模式标签文字
   * @default '暗色'
   */
  darkLabel?: string

  /**
   * 系统跟随模式标签文字
   * @default '跟随系统'
   */
  systemLabel?: string

  /**
   * 是否显示图标
   * @default true
   */
  showIcon?: boolean

  /**
   * 是否启用动画效果
   * @default true
   */
  animated?: boolean

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 自定义类名
   */
  class?: string
}

// ====== Props 默认值 ======

const props = withDefaults(defineProps<Props>(), {
  mode: 'toggle',
  size: 'md',
  showLabel: false,
  lightLabel: '亮色',
  darkLabel: '暗色',
  systemLabel: '跟随系统',
  showIcon: true,
  animated: true,
  disabled: false,
  class: undefined,
})

// ====== Emits 定义 ======

const emit = defineEmits<{
  /**
   * 模型值更新事件（v-model）
   */
  (e: 'update:modelValue', value: ThemeMode): void
  /**
   * 主题变化事件
   * @param value - 新的主题值
   * @param previousValue - 之前的主题值
   */
  (e: 'change', value: ThemeMode, previousValue: string): void
}>()

// ====== 响应式状态 ======

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/** 下拉菜单是否展开 */
const isDropdownOpen = ref(false)

/** 系统实际解析的主题（light或dark） */
const resolvedSystemTheme = ref<'light' | 'dark'>('light')

/** 媒体查询列表引用 */
let mediaQueryList: MediaQueryList | null = null

// ====== 计算属性 ======

/**
 * 当前是否为暗色模式（考虑system模式的解析结果）
 */
const isDark = computed(() => {
  if (props.modelValue === 'dark') return true
  if (props.modelValue === 'light') return false
  // system模式：返回系统解析的实际主题
  return resolvedSystemTheme.value === 'dark'
})

/**
 * 组件根元素类名
 */
const switcherClasses = computed(() => [
  'theme-switcher',
  `theme-switcher--${props.mode}`,
  `theme-switcher--size-${props.size}`,
  {
    'theme-switcher--disabled': props.disabled,
    'theme-switcher--animated': props.animated,
    'theme-switcher--dark': isDark.value,
    'theme-switcher--show-label': props.showLabel,
  },
  props.class,
])

/**
 * Toggle模式的滑块位置样式
 */
const sliderStyle = computed(() => {
  const offsets = { sm: 28, md: 32, lg: 36 }
  const offset = offsets[props.size]
  return {
    transform: isDark.value ? `translateX(${offset}px)` : 'translateX(0)',
  }
})

/**
 * 当前显示的图标类型
 */
const currentIconType = computed(() => {
  if (props.modelValue === 'system') return 'system'
  return isDark.value ? 'moon' : 'sun'
})

// ====== 方法 ======

/**
 * 检测系统主题偏好
 */
function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * 应用主题到DOM
 */
function applyThemeToDOM(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // 设置data-theme属性
  root.setAttribute('data-theme', theme)

  // 切换dark类名（兼容Tailwind等框架）
  root.classList.toggle('dark', theme === 'dark')

  // 更新meta theme-color标签
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#F5F7FA')
  }

  // 添加过渡动画类（可选增强）
  root.classList.add('theme-transitioning')
  setTimeout(() => {
    root.classList.remove('theme-transitioning')
  }, 300)
}

/**
 * 解析并应用主题
 */
function resolveAndApplyTheme(mode: ThemeMode) {
  let actualTheme: 'light' | 'dark'

  if (mode === 'system') {
    actualTheme = detectSystemTheme()
    resolvedSystemTheme.value = actualTheme
  } else {
    actualTheme = mode
  }

  applyThemeToDOM(actualTheme)

  // 存储到localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('heikeji-theme', mode)
  }
}

/**
 * 切换主题
 */
function setTheme(newTheme: ThemeMode) {
  if (props.disabled) return

  const previousValue = props.modelValue
  emit('update:modelValue', newTheme)
  emit('change', newTheme, previousValue)

  resolveAndApplyTheme(newTheme)

  // 关闭下拉菜单
  if (props.mode === 'dropdown' || props.mode === 'icon-only') {
    isDropdownOpen.value = false
  }
}

/**
 * 循环切换主题（用于icon-only模式）
 */
function cycleTheme() {
  const modes: ThemeMode[] = ['light', 'dark', 'system']
  const currentIndex = modes.indexOf(props.modelValue)
  const nextIndex = (currentIndex + 1) % modes.length
  setTheme(modes[nextIndex])
}

/**
 * Toggle点击处理
 */
function handleToggleClick() {
  if (props.disabled) return
  // Toggle模式：在light和dark之间切换
  const newTheme: ThemeMode = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
}

/**
 * 键盘事件处理
 */
function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      if (props.mode === 'toggle') {
        handleToggleClick()
      } else if (props.mode === 'icon-only') {
        cycleTheme()
      } else if (props.mode === 'dropdown' || props.mode === 'icon-only') {
        isDropdownOpen.value = !isDropdownOpen.value
      }
      break

    case 'Escape':
      if (isDropdownOpen.value) {
        isDropdownOpen.value = false
      }
      break

    case 'ArrowLeft':
    case 'ArrowRight':
      if (props.mode === 'buttons') {
        event.preventDefault()
        const modes: ThemeMode[] = ['light', 'dark', 'system']
        const currentIndex = modes.indexOf(props.modelValue)
        const direction = event.key === 'ArrowRight' ? 1 : -1
        const nextIndex = (currentIndex + direction + modes.length) % modes.length
        setTheme(modes[nextIndex])
      }
      break

    // 快捷键：Ctrl/Cmd + Shift + D 快速切换深色模式
    case 'd':
    case 'D':
      if (event.ctrlKey || event.metaKey) {
        if (event.shiftKey) {
          event.preventDefault()
          cycleTheme()
        }
      }
      break
  }
}

/**
 * 点击外部关闭下拉菜单
 */
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-switcher')) {
    isDropdownOpen.value = false
  }
}

// ====== 生命周期 ======

onMounted(() => {
  // 初始化：从localStorage读取或检测系统偏好
  if (typeof localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem('heikeji-theme') as ThemeMode | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      emit('update:modelValue', savedTheme)
      resolveAndApplyTheme(savedTheme)
    } else {
      // 默认使用system模式
      resolvedSystemTheme.value = detectSystemTheme()
      resolveAndApplyTheme('system')
    }
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQueryList.addEventListener('change', (e) => {
      resolvedSystemTheme.value = e.matches ? 'dark' : 'light'
      if (props.modelValue === 'system') {
        applyThemeToDOM(e.matches ? 'dark' : 'light')
      }
    })
  }

  // 点击外部关闭下拉菜单
  if (props.mode === 'dropdown' || props.mode === 'icon-only') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  // 清理媒体查询监听
  if (mediaQueryList) {
    mediaQueryList.removeEventListener('change', () => {})
    mediaQueryList = null
  }

  // 清理点击外部监听
  document.removeEventListener('click', handleClickOutside)
})

// ====== 监听器 ======

watch(
  () => props.modelValue,
  (newMode) => {
    resolveAndApplyTheme(newMode)
  }
)
</script>

<template>
  <!-- ========== Toggle 开关模式（默认推荐）========== -->
  <div
    v-if="mode === 'toggle'"
    :class="switcherClasses"
    role="switch"
    :aria-checked="modelValue === 'dark'"
    :aria-label="`当前为${modelValue === 'dark' ? darkLabel : lightLabel}模式，点击切换到${modelValue === 'dark' ? lightLabel : darkLabel}模式`"
    :tabindex="disabled ? -1 : 0"
    @click="handleToggleClick"
    @keydown="handleKeydown"
  >
    <!-- Toggle轨道 -->
    <div class="theme-toggle__track">
      <!-- 左侧图标：月亮（暗色模式） -->
      <span v-if="showIcon" class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>

      <!-- 滑块 -->
      <span class="theme-toggle__slider" :style="animated ? sliderStyle : undefined" />

      <!-- 右侧图标：太阳（亮色模式） -->
      <span v-if="showIcon" class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </div>

    <!-- 标签文字（可选） -->
    <span v-if="showLabel" class="theme-toggle__label">
      {{ isDark ? darkLabel : lightLabel }}
    </span>
  </div>

  <!-- ========== Buttons 按钮组模式 ========== -->
  <div
    v-else-if="mode === 'buttons'"
    :class="switcherClasses"
    role="radiogroup"
    :aria-label="`主题选择：当前为${modelValue === 'light' ? lightLabel : modelValue === 'dark' ? darkLabel : systemLabel}`"
    @keydown="handleKeydown"
  >
    <!-- 暗色模式按钮 -->
    <button
      class="theme-buttons__button"
      :class="{ 'theme-buttons__button--active': modelValue === 'dark' }"
      role="radio"
      :aria-checked="modelValue === 'dark'"
      :tabindex="disabled ? -1 : modelValue === 'dark' ? 0 : -1"
      :disabled="disabled"
      @click="setTheme('dark')"
    >
      <span v-if="showIcon" class="theme-buttons__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span v-if="showLabel" class="theme-buttons__label">{{ darkLabel }}</span>
    </button>

    <!-- 系统跟随按钮 -->
    <button
      class="theme-buttons__button"
      :class="{ 'theme-buttons__button--active': modelValue === 'system' }"
      role="radio"
      :aria-checked="modelValue === 'system'"
      :tabindex="disabled ? -1 : modelValue === 'system' ? 0 : -1"
      :disabled="disabled"
      @click="setTheme('system')"
    >
      <span v-if="showIcon" class="theme-buttons__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </span>
      <span v-if="showLabel" class="theme-buttons__label">{{ systemLabel }}</span>
    </button>

    <!-- 亮色模式按钮 -->
    <button
      class="theme-buttons__button"
      :class="{ 'theme-buttons__button--active': modelValue === 'light' }"
      role="radio"
      :aria-checked="modelValue === 'light'"
      :tabindex="disabled ? -1 : modelValue === 'light' ? 0 : -1"
      :disabled="disabled"
      @click="setTheme('light')"
    >
      <span v-if="showIcon" class="theme-buttons__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span v-if="showLabel" class="theme-buttons__label">{{ lightLabel }}</span>
    </button>
  </div>

  <!-- ========== Dropdown 下拉菜单模式 & Icon-Only 仅图标模式 ========== -->
  <div
    v-else
    :class="switcherClasses"
    @keydown="handleKeydown"
  >
    <!-- 触发器按钮 -->
    <button
      class="theme-dropdown__trigger"
      :aria-expanded="isDropdownOpen"
      :aria-haspopup="true"
      :aria-label="mode === 'icon-only' ? `切换主题（当前：${modelValue === 'light' ? lightLabel : modelValue === 'dark' ? darkLabel : systemLabel}）` : undefined"
      :tabindex="disabled ? -1 : 0"
      :disabled="disabled"
      @click.stop="isDropdownOpen = !isDropdownOpen"
    >
      <!-- 图标 -->
      <span v-if="showIcon" class="theme-dropdown__icon" aria-hidden="true">
        <!-- 太阳图标 -->
        <svg v-if="currentIconType === 'sun'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <!-- 月亮图标 -->
        <svg v-else-if="currentIconType === 'moon'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- 系统图标 -->
        <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </span>

      <!-- 标签文字（仅dropdown模式显示） -->
      <span v-if="mode === 'dropdown' && showLabel" class="theme-dropdown__label">
        {{
          modelValue === 'light'
            ? lightLabel
            : modelValue === 'dark'
              ? darkLabel
              : systemLabel
        }}
      </span>

      <!-- 下拉箭头（仅dropdown模式显示） -->
      <svg
        v-if="mode === 'dropdown'"
        class="theme-dropdown__arrow"
        :class="{ 'theme-dropdown__arrow--open': isDropdownOpen }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- 下拉面板 -->
    <Transition name="dropdown">
      <div
        v-show="isDropdownOpen"
        class="theme-dropdown__panel"
        role="menu"
        :aria-label="主题选项列表"
      >
        <!-- 亮色模式选项 -->
        <button
          class="theme-dropdown__option"
          :class="{ 'theme-dropdown__option--active': modelValue === 'light' }"
          role="menuitemradio"
          :aria-checked="modelValue === 'light'"
          :tabindex="disabled ? -1 : 0"
          @click.stop="setTheme('light')"
        >
          <span v-if="showIcon" class="theme-dropdown__option-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <span class="theme-dropdown__option-text">{{ lightLabel }}</span>
          <svg
            v-if="modelValue === 'light'"
            class="theme-dropdown__checkmark"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- 暗色模式选项 -->
        <button
          class="theme-dropdown__option"
          :class="{ 'theme-dropdown__option--active': modelValue === 'dark' }"
          role="menuitemradio"
          :aria-checked="modelValue === 'dark'"
          :tabindex="disabled ? -1 : 0"
          @click.stop="setTheme('dark')"
        >
          <span v-if="showIcon" class="theme-dropdown__option-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="theme-dropdown__option-text">{{ darkLabel }}</span>
          <svg
            v-if="modelValue === 'dark'"
            class="theme-dropdown__checkmark"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- 跟随系统选项 -->
        <button
          class="theme-dropdown__option"
          :class="{ 'theme-dropdown__option--active': modelValue === 'system' }"
          role="menuitemradio"
          :aria-checked="modelValue === 'system'"
          :tabindex="disabled ? -1 : 0"
          @click.stop="setTheme('system')"
        >
          <span v-if="showIcon" class="theme-dropdown__option-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" />
              <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
          <span class="theme-dropdown__option-text">{{ systemLabel }}</span>
          <svg
            v-if="modelValue === 'system'"
            class="theme-dropdown__checkmark"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- 快捷键提示 -->
        <div class="theme-dropdown__shortcut-hint">
          按 Ctrl+Shift+D 快速切换
        </div>
      </div>
    </Transition>
  </div>

  <!-- 屏幕阅读器实时播报区域 -->
  <div
    v-if="mode === 'toggle'"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
  >
    已切换到{{ isDark ? darkLabel : lightLabel }}模式
  </div>
</template>

<style scoped>
/* ====== CSS变量定义（从设计令牌继承）====== */
.theme-switcher {
  /* 设计令牌引用 */
  --switcher-primary: #000AB0;
  --switcher-primary-hover: #000880;
  --switcher-track-light: #E5E7EB;
  --switcher-track-dark: #374151;
  --switcher-slider: #FFFFFF;
  --switcher-text-primary: #111827;
  --switcher-text-secondary: #6B7280;
  --switcher-sun-color: #F59E0B;       /* Amber/Yellow */
  --switcher-moon-color: #6366F1;       /* Indigo/Blue */
  --switcher-system-color: #6B7280;     /* Gray-500 */

  /* 动画时长 */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;

  /* 缓动函数 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;

  &:focus-visible {
    outline: 2px solid var(--switcher-primary);
    outline-offset: 2px;
    border-radius: inherit;
  }
}

/* ====== 尺寸规范 ====== */
.theme-switcher--size-sm {
  --toggle-width: 56px;
  --toggle-height: 28px;
  --slider-size: 24px;
  --icon-size: 14px;
  --font-size: 0.75rem;     /* caption (12px) */
  --slider-offset: 28px;
}

/* md - 中等尺寸 (64×32px) - 默认 */
.theme-switcher--size-md {
  --toggle-width: 64px;
  --toggle-height: 32px;
  --slider-size: 28px;
  --icon-size: 16px;
  --font-size: 0.875rem;    /* body (14px) */
  --slider-offset: 32px;
}

/* lg - 大尺寸 (72×36px) */
.theme-switcher--size-lg {
  --toggle-width: 72px;
  --toggle-height: 36px;
  --slider-size: 32px;
  --icon-size: 18px;
  --font-size: 1rem;        /* bodyLarge (16px) */
  --slider-offset: 36px;
}

/* ====== Disabled状态 ====== */
.theme-switcher--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ========================================
   Toggle 开关模式样式
   ======================================== */

.theme-switcher--toggle {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;

  .theme-toggle__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: var(--toggle-width);
    height: var(--toggle-height);
    padding: 0 4px;
    border-radius: 9999px;
    background-color: var(--switcher-track-light);
    transition: background-color var(--transition-normal) var(--ease-default);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

    /* 暗色模式下轨道颜色调整 */
    :global(.dark) &,
    .theme-switcher--dark & {
      background-color: var(--switcher-track-dark);
    }
  }

  .theme-toggle__slider {
    position: absolute;
    top: 50%;
    left: 4px;
    width: var(--slider-size);
    height: var(--slider-size);
    background-color: var(--switcher-slider);
    border-radius: 50%;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.1);
    transform: translateY(-50%);
    transition: transform var(--transition-normal) var(--ease-default);
    z-index: 1;
  }

  .theme-toggle__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size);
    height: var(--icon-size);
    z-index: 2;
    transition:
      transform var(--transition-slow) ease,
      opacity var(--transition-fast) ease,
      color var(--transition-normal) ease;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  /* 月亮图标（左侧） */
  .theme-toggle__icon--moon {
    color: var(--switcher-moon-color);
    transform: rotate(-90deg) scale(0);
    opacity: 0;

    .theme-switcher--dark & {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  /* 太阳图标（右侧） */
  .theme-toggle__icon--sun {
    color: var(--switcher-sun-color);
    transform: rotate(0deg) scale(1);
    opacity: 1;

    .theme-switcher--dark & {
      transform: rotate(360deg) scale(0);
      opacity: 0;
    }
  }

  /* 标签文字 */
  .theme-toggle__label {
    font-size: var(--font-size);
    font-weight: 500;
    color: var(--switcher-text-primary);
    transition: color var(--transition-normal) ease;
  }

  /* Hover效果 */
  &:hover:not(.theme-switcher--disabled) {
    .theme-toggle__track {
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .theme-toggle__slider {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.2),
        0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  /* Active效果 */
  &:active:not(.theme-switcher--disabled) {
    .theme-toggle__slider {
      transform: translateY(-50%) scale(0.95);
    }
  }
}

/* ========================================
   Buttons 按钮组模式样式
   ======================================== */

.theme-switcher--buttons {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  background-color: #F3F4F6;

  /* 暗色模式背景 */
  :global(.dark) &,
  .theme-switcher--dark & {
    background-color: #374151;
  }

  .theme-buttons__button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-family: inherit;
    font-size: var(--font-size);
    font-weight: 500;
    color: var(--switcher-text-secondary);
    background-color: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    transition:
      background-color var(--transition-fast) ease,
      color var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease,
      transform var(--transition-fast) ease;

    .theme-buttons__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--icon-size);
      height: var(--icon-size);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .theme-buttons__label {
      line-height: 1;
    }

    /* 选中态 */
    &--active {
      color: #FFFFFF;
      background-color: var(--switcher-primary);
      box-shadow:
        0 2px 4px rgba(0, 10, 176, 0.2),
        0 1px 2px rgba(0, 10, 176, 0.1);

      &:hover {
        background-color: var(--switcher-primary-hover);
      }
    }

    /* 未选中Hover */
    &:hover:not(&--active):not(:disabled) {
      color: var(--switcher-text-primary);
      background-color: rgba(0, 10, 176, 0.08);
    }

    /* Active按压 */
    &:active:not(&--active):not(:disabled) {
      transform: scale(0.98);
    }

    &:focus-visible {
      outline: 2px solid var(--switcher-primary);
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

/* ========================================
   Dropdown 下拉菜单模式 & Icon-Only 仅图标模式样式
   ======================================== */

.theme-switcher--dropdown,
.theme-switcher--icon-only {
  position: relative;

  .theme-dropdown__trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-family: inherit;
    font-size: var(--font-size);
    font-weight: 500;
    color: var(--switcher-text-primary);
    background-color: transparent;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    transition:
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease;

    /* 暗色模式边框 */
    :global(.dark) &,
    .theme-switcher--dark & {
      color: #F3F4F6;
      border-color: #4B5563;
    }

    .theme-dropdown__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--icon-size);
      height: var(--icon-size);
      color: var(--switcher-sun-color);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .theme-dropdown__label {
      line-height: 1;
    }

    .theme-dropdown__arrow {
      width: 16px;
      height: 16px;
      color: var(--switcher-text-secondary);
      transition: transform var(--transition-fast) ease;

      &--open {
        transform: rotate(180deg);
      }
    }

    &:hover:not(:disabled) {
      background-color: #F9FAFB;
      border-color: var(--switcher-primary);

      :global(.dark) &,
      .theme-switcher--dark & {
        background-color: #1F2937;
        border-color: #60A5FA;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--switcher-primary);
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Icon-Only模式触发器特殊样式 */
  &.theme-switcher--icon-only .theme-dropdown__trigger {
    padding: 0.5rem;
    border: none;
    border-radius: 8px;

    &:hover:not(:disabled) {
      background-color: #F3F4F6;

      :global(.dark) &,
      .theme-switcher--dark & {
        background-color: #374151;
      }
    }
  }

  .theme-dropdown__panel {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 50;
    min-width: 180px;
    padding: 0.5rem;
    background-color: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1);

    /* 暗色模式 */
    :global(.dark) &,
    .theme-switcher--dark & {
      background-color: #1F2937;
      border-color: #4B5563;
      box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.5),
        0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .theme-dropdown__option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.625rem 0.75rem;
      font-family: inherit;
      font-size: var(--font-size);
      font-weight: 500;
      color: var(--switcher-text-primary);
      text-align: left;
      background-color: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      outline: none;
      transition:
        background-color var(--transition-fast) ease,
        color var(--transition-fast) ease;

      /* 暗色模式文字 */
    :global(.dark) &,
    .theme-switcher--dark & {
      color: #F3F4F6;
    }

      .theme-dropdown__option-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--icon-size);
        height: var(--icon-size);
        flex-shrink: 0;

        svg {
          width: 100%;
          height: 100%;
        }

        /* 亮色选项图标 */
        &:first-child {
          color: var(--switcher-sun-color);
        }

        /* 暗色选项图标 */
        &:nth-child(2) {
          color: var(--switcher-moon-color);
        }

        /* 系统选项图标 */
        &:nth-child(3) {
          color: var(--switcher-system-color);
        }
      }

      .theme-dropdown__option-text {
        flex: 1;
        line-height: 1;
      }

      .theme-dropdown__checkmark {
        width: 16px;
        height: 16px;
        color: var(--switcher-primary);
        flex-shrink: 0;
      }

      /* Hover */
      &:hover:not(&--active) {
        background-color: #EFF6FF;

        :global(.dark) &,
        .theme-switcher--dark & {
          background-color: #172033;
        }
      }

      /* 选中态 */
      &--active {
        color: var(--switcher-primary);
        background-color: #EFF6FF;
        font-weight: 600;

        :global(.dark) &,
        .theme-switcher--dark & {
          color: #93C5FD;
          background-color: #172033;
        }
      }

      &:focus-visible {
        outline: 2px solid var(--switcher-primary);
        outline-offset: -2px;
      }
    }

    .theme-dropdown__shortcut-hint {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #E5E7EB;
      font-size: 0.75rem;
      color: var(--switcher-text-secondary);
      text-align: center;

      :global(.dark) &,
      .theme-switcher--dark & {
        border-color: #4B5563;
        color: #9CA3AF;
      }
    }
  }
}

/* ========================================
   动画过渡效果
   ======================================== */

/* Dropdown展开/收起动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity var(--transition-normal) var(--ease-default),
    transform var(--transition-normal) var(--ease-default);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* ========================================
   减少动画偏好支持（无障碍）
   ======================================== */

@media (prefers-reduced-motion: reduce) {
  .theme-switcher--animated {
    .theme-toggle__slider {
      transition: none;
    }

    .theme-toggle__icon {
      transition: none;
      animation: none;
    }

    .theme-toggle__track {
      transition: none;
    }

    .theme-buttons__button {
      transition: none;
    }

    .theme-dropdown__trigger {
      transition: none;
    }

    .theme-dropdown__option {
      transition: none;
    }

    .dropdown-enter-active,
    .dropdown-leave-active {
      transition: none;
    }
  }
}

/* ========================================
   屏幕阅读器专用样式
   ======================================== */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ========================================
   全局主题过渡动画（在html/body上使用）
   ======================================== */

:global(.theme-transitioning),
:global(.theme-transitioning *) {
  transition:
    background-color 300ms ease,
    color 300ms ease,
    border-color 300ms ease !important;
}
</style>
