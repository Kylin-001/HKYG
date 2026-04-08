<script setup lang="ts">
/**
 * SearchBar.vue - 现代化搜索栏组件 v3.0
 * 
 * 特性：
 * - 4种视觉变体（default/filled/outlined/rounded）
 * - 4种尺寸规格（sm/md/lg/full）
 * - 完整的键盘导航和可访问性支持
 * - 高性能防抖输入
 * - 响应式适配和暗色模式支持
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick, type Component } from 'vue'
import { Search, CircleClose, Loading } from '@element-plus/icons-vue'

// ==================== 类型定义 ====================

interface Props {
  // v-model绑定值
  modelValue: string
  
  // 占位符文字
  placeholder?: string
  
  // 尺寸规格
  size?: 'sm' | 'md' | 'lg' | 'full'
  
  // 变体风格
  variant?: 'default' | 'filled' | 'outlined' | 'rounded'
  
  // 是否显示搜索按钮
  showButton?: boolean
  
  // 是否显示清除按钮
  clearable?: boolean
  
  // 是否自动聚焦
  autofocus?: boolean
  
  // 是否禁用
  disabled?: boolean
  
  // 最大长度
  maxlength?: number
  
  // 是否显示字数统计
  showWordCount?: boolean
  
  // 自定义搜索图标
  searchIcon?: Component
  
  // 自定义类名
  class?: string
  
  // 是否处于加载状态
  loading?: boolean
  
  // 防抖延迟（毫秒），0表示不防抖
  debounceDelay?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', value: string): void
}

// ==================== Props & Emits ====================

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索商品、外卖、二手好物...',
  size: 'md',
  variant: 'default',
  showButton: false,
  clearable: true,
  autofocus: false,
  disabled: false,
  maxlength: undefined,
  showWordCount: false,
  searchIcon: undefined,
  class: '',
  loading: false,
  debounceDelay: 300
})

const emit = defineEmits<Emits>()

// ==================== 响应式状态 ====================

const isFocused = ref(false)
const searchInput = ref<HTMLInputElement>()
const labelId = `search-label-${Math.random().toString(36).substr(2, 9)}`

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 全局快捷键处理函数（提前声明以避免暂时性死区问题）
let handleGlobalShortcut: ((event: KeyboardEvent) => void) | null = null

// ==================== 计算属性 ====================

/** 是否显示清除按钮 */
const showClearButton = computed(() => {
  return props.clearable && props.modelValue.length > 0 && !props.disabled && isFocused.value
})

/** 字数统计信息 */
const wordCountInfo = computed(() => {
  const current = props.modelValue.length
  const max = props.maxlength || 0
  const percentage = max > 0 ? (current / max) * 100 : 0
  
  return {
    current,
    max,
    percentage,
    isWarning: percentage > 80 && percentage <= 95,
    isDanger: percentage > 95
  }
})

/** 搜索图标组件 */
const SearchIconComponent = computed(() => {
  return props.searchIcon || Search
})

// ==================== 方法 ====================

/** 处理输入事件（带防抖） */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  emit('update:modelValue', value)
  
  // 防抖处理
  if (props.debounceDelay > 0) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      emit('input', value)
    }, props.debounceDelay)
  } else {
    emit('input', value)
  }
}

/** 处理聚焦 */
function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

/** 处理失焦 */
function handleBlur(event: FocusEvent) {
  // 延迟失焦以允许点击按钮
  setTimeout(() => {
    isFocused.value = false
  }, 200)
  emit('blur', event)
}

/** 处理键盘事件 */
function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  
  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      const value = target.value.trim()
      if (value) {
        performSearch(value)
      }
      break
      
    case 'Escape':
      clearInput()
      target.blur()
      break
  }
}

/** 执行搜索 */
function performSearch(value: string) {
  emit('search', value)
}

/** 清除输入 */
function clearInput() {
  emit('update:modelValue', '')
  emit('clear')
  // 清除后重新聚焦
  nextTick(() => {
    searchInput.value?.focus()
  })
}

/** 点击搜索按钮 */
function handleSearchClick() {
  const value = props.modelValue.trim()
  if (value) {
    performSearch(value)
  } else {
    // 如果为空，聚焦输入框
    searchInput.value?.focus()
  }
}

/** 聚焦方法（供外部调用） */
function focus() {
  searchInput.value?.focus()
}

/** 失焦方法（供外部调用） */
function blur() {
  searchInput.value?.blur()
}

// ==================== 生命周期 ====================

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
  
  // 监听全局快捷键 Ctrl/Cmd + K
  handleGlobalShortcut = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      searchInput.value?.focus()
    }
  }
  document.addEventListener('keydown', handleGlobalShortcut)
})

onUnmounted(() => {
  // 清理防抖定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // 移除全局快捷键监听
  if (handleGlobalShortcut) {
    document.removeEventListener('keydown', handleGlobalShortcut)
  }
})

// ==================== 暴露方法 ====================

defineExpose({
  focus,
  blur
})
</script>

<template>
  <div
    role="search"
    :class="[
      'search-bar',
      `search-bar--${size}`,
      `search-bar--${variant}`,
      {
        'search-bar--focused': isFocused,
        'search-bar--disabled': disabled,
        'search-bar--loading': loading
      },
      props.class
    ]"
  >
    <!-- 无障碍标签 -->
    <label :id="labelId" class="sr-only">搜索</label>
    
    <!-- 搜索图标（左侧） -->
    <div class="search-bar__icon-wrapper">
      <component
        :is="SearchIconComponent"
        :class="['search-bar__icon', { 'search-bar__icon--active': isFocused }]"
        :size="size === 'sm' ? 16 : size === 'lg' ? 20 : 18"
      />
    </div>
    
    <!-- 输入框 -->
    <input
      ref="searchInput"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :aria-labelledby="labelId"
      :aria-label="placeholder"
      role="searchbox"
      class="search-bar__input"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    
    <!-- 清除按钮 -->
    <Transition name="search-bar-clear">
      <button
        v-if="showClearButton"
        type="button"
        class="search-bar__clear-btn"
        aria-label="清除搜索"
        tabindex="0"
        @click.stop="clearInput"
        @mousedown.prevent
      >
        <CircleClose :size="16" />
      </button>
    </Transition>
    
    <!-- 字数统计 -->
    <Transition name="search-bar-count">
      <span
        v-if="showWordCount && maxlength"
        :class="[
          'search-bar__word-count',
          {
            'search-bar__word-count--warning': wordCountInfo.isWarning,
            'search-bar__word-count--danger': wordCountInfo.isDanger
          }
        ]"
        aria-live="polite"
      >
        {{ wordCountInfo.current }}/{{ wordCountInfo.max }}
      </span>
    </Transition>
    
    <!-- 搜索按钮 -->
    <button
      v-if="showButton"
      type="button"
      :class="['search-bar__search-btn', { 'search-bar__search-btn--loading': loading }]"
      :aria-label="loading ? '正在搜索' : '搜索'"
      :disabled="disabled || loading"
      tabindex="0"
      @click="handleSearchClick"
    >
      <!-- 加载状态 -->
      <Loading v-if="loading" :size="18" class="search-bar__spinner" />
      
      <!-- 正常状态 -->
      <Search v-else :size="18" />
      
      <span v-if="size !== 'sm'" class="search-bar__search-text">搜索</span>
    </button>
    
    <!-- 快捷键提示（桌面端） -->
    <kbd
      v-if="!isFocused && !showButton && size !== 'sm'"
      class="search-bar__shortcut"
      aria-hidden="true"
    >
      ⌘K
    </kbd>
  </div>
</template>

<style scoped>
/* ==================== CSS 变量引用设计令牌 ==================== */
.search-bar {
  /* 基础布局 */
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  /* 过渡动画 */
  transition: all var(--animation-duration-normal, 250ms) var(--animation-easing-default, cubic-bezier(0.4, 0, 0.2, 1));
  
  /* 焦点可见性轮廓（可访问性） */
  &:focus-within:focus-visible {
    outline: 2px solid #60A5FA;
    outline-offset: 2px;
  }
}

/* ==================== 视觉变体样式 ==================== */

/* default 变体（默认） */
.search-bar--default {
  background-color: #FFFFFF;
  border: 1.5px solid #F3F4F6;
  border-radius: 16px; /* borderRadiusTokens['2xl'] */
  
  &:hover:not(.search-bar--disabled) {
    border-color: #E5E7EB;
  }
  
  &.search-bar--focused {
    border-color: #60A5FA; /* primary-300 */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* 蓝色光晕 */
  }
}

/* filled 变体（填充式） */
.search-bar--filled {
  background-color: #F9FAFB; /* surface-secondary */
  border: none;
  border-radius: 12px; /* borderRadiusTokens['xl'] */
  
  &.search-bar--focused {
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
}

/* outlined 变体（轮廓式） */
.search-bar--outlined {
  background-color: transparent;
  border: 2px solid #E5E7EB; /* border.default */
  border-radius: 8px; /* borderRadiusTokens['lg'] */
  
  &.search-bar--focused {
    border-color: #000AB0; /* brand primary */
    box-shadow: none;
  }
}

/* rounded 变体（胶囊形） */
.search-bar--rounded {
  background-color: #F9FAFB; /* surface-secondary */
  border: none;
  border-radius: 9999px; /* borderRadiusTokens['full'] */
  
  &.search-bar--focused {
    background-color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 10, 176, 0.12);
  }
  
  /* 紧凑模式下的展开效果 */
  .search-bar__input::placeholder {
    opacity: 0.7;
  }
}

/* ==================== 尺寸规格 ==================== */

/* sm 尺寸 */
.search-bar--sm {
  height: 36px;
  padding-left: 12px;
  padding-right: 12px;
  gap: 8px;
  
  .search-bar__icon-wrapper {
    width: 16px;
    height: 16px;
  }
  
  .search-bar__input {
    font-size: 14px; /* caption */
    padding: 6px 0;
  }
  
  .search-bar__clear-btn {
    width: 24px;
    height: 24px;
  }
  
  .search-bar__search-btn {
    width: 32px;
    min-width: 32px;
    padding: 0;
  }
  
  .search-bar__shortcut {
    display: none;
  }
}

/* md 尺寸（默认） */
.search-bar--md {
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 10px;
  
  .search-bar__icon-wrapper {
    width: 18px;
    height: 18px;
  }
  
  .search-bar__input {
    font-size: 16px; /* body */
    padding: 8px 0;
  }
  
  .search-bar__clear-btn {
    width: 28px;
    height: 28px;
  }
  
  .search-bar__search-btn {
    width: 40px;
    min-width: 40px;
    padding: 0 12px;
  }
}

/* lg 尺寸 */
.search-bar--lg {
  height: 52px;
  padding-left: 20px;
  padding-right: 20px;
  gap: 12px;
  
  .search-bar__icon-wrapper {
    width: 20px;
    height: 20px;
  }
  
  .search-bar__input {
    font-size: 18px; /* bodyLarge */
    padding: 11px 0;
  }
  
  .search-bar__clear-btn {
    width: 32px;
    height: 32px;
  }
  
  .search-bar__search-btn {
    width: 48px;
    min-width: 48px;
    padding: 0 16px;
  }
}

/* full 尺寸 */
.search-bar--full {
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  gap: 12px;
  
  .search-bar__icon-wrapper {
    width: 20px;
    height: 20px;
  }
  
  .search-bar__input {
    font-size: 18px; /* bodyLarge */
    padding: 13px 0;
  }
  
  .search-bar__clear-btn {
    width: 32px;
    height: 32px;
  }
  
  .search-bar__search-btn {
    width: 52px;
    min-width: 52px;
    padding: 0 20px;
  }
  
  .search-bar__search-text {
    font-size: 15px;
  }
}

/* ==================== 子元素样式 ==================== */

/* 搜索图标 */
.search-bar__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #9CA3AF; /* text.quaternary */
  transition: color var(--animation-duration-fast, 150ms) ease-out;
}

.search-bar__icon {
  transition: transform var(--animation-duration-normal, 300ms) ease-out;
  
  &--active {
    color: #000AB0; /* brand primary */
  }
}

/* 输入框 */
.search-bar__input {
  flex: 1;
  width: 100%;
  min-width: 0; /* 防止flex子项溢出 */
  border: none;
  outline: none;
  background: transparent;
  color: #111827; /* text.primary */
  font-family: inherit;
  line-height: 1.5;
  
  &::placeholder {
    color: #9CA3AF; /* text.quaternary */
    transition: opacity var(--animation-duration-fast, 150ms) ease-out;
  }
  
  &:disabled {
    cursor: not-allowed;
    color: #D1D5DB; /* text.disabled */
  }
  
  /* 隐藏浏览器默认的清除按钮 */
  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
}

/* 禁用状态 */
.search-bar--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* ==================== 清除按钮样式 ==================== */

.search-bar__clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: #9CA3AF;
  cursor: pointer;
  transition: all var(--animation-duration-fast, 150ms) ease-out;
  
  &:hover {
    background-color: #F3F4F6; /* neutral-100 */
    color: #6B7280; /* neutral-500 */
    transform: rotate(90deg); /* X旋转效果 */
  }
  
  &:active {
    transform: rotate(90deg) scale(0.9);
  }
  
  &:focus-visible {
    outline: 2px solid #60A5FA;
    outline-offset: 2px;
  }
}

/* 清除按钮动画 */
.search-bar-clear-enter-active {
  transition: all 150ms var(--animation-easing-default, cubic-bezier(0.4, 0, 0.2, 1));
}

.search-bar-clear-leave-active {
  transition: all 100ms ease-in;
}

.search-bar-clear-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.search-bar-clear-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ==================== 字数统计样式 ==================== */

.search-bar__word-count {
  position: absolute;
  right: 12px;
  bottom: -22px;
  font-size: 12px; /* overline */
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #9CA3AF;
  pointer-events: none;
  transition: color var(--animation-duration-fast, 150ms) ease-out;
  
  &--warning {
    color: #CA8A04; /* warning.DEFAULT */
  }
  
  &--danger {
    color: #DC2626; /* danger.DEFAULT */
  }
}

.search-bar-count-enter-active,
.search-bar-count-leave-active {
  transition: all 150ms ease-out;
}

.search-bar-count-enter-from,
.search-bar-count-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ==================== 搜索按钮样式 ==================== */

.search-bar__search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #000AB0 0%, #3B82F6 50%, #60A5FA 100%); /* 品牌渐变 */
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all var(--animation-duration-fast, 150ms) ease-out;
  
  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateX(2px); /* 向右移动暗示前进 */
  }
  
  &:active:not(:disabled) {
    transform: translateX(2px) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid #60A5FA;
    outline-offset: 2px;
  }
  
  &--loading {
    pointer-events: none;
  }
}

.search-bar__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.search-bar__search-text {
  white-space: nowrap;
}

/* ==================== 快捷键提示样式 ==================== */

.search-bar__shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  color: #9CA3AF;
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  pointer-events: none;
  transition: opacity var(--animation-duration-fast, 150ms) ease-out;
}

/* ==================== 屏幕阅读器隐藏类 ==================== */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ==================== 暗色模式适配 ==================== */

:global(.dark) .search-bar {
  /* default 变体暗色模式 */
  &.search-bar--default {
    background-color: #1F2937;
    border-color: #374151;
    
    &:hover:not(.search-bar--disabled) {
      border-color: #4B5563;
    }
    
    &.search-bar--focused {
      border-color: #60A5FA;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
    }
  }
  
  /* filled 变体暗色模式 */
  &.search-bar--filled {
    background-color: #374151;
    
    &.search-bar--focused {
      background-color: #1F2937;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.5);
    }
  }
  
  /* outlined 变体暗色模式 */
  &.search-bar--outlined {
    border-color: #4B5563;
    
    &.search-bar--focused {
      border-color: #3B82F6;
    }
  }
  
  /* rounded 变体暗色模式 */
  &.search-bar--rounded {
    background-color: #374151;
    
    &.search-bar--focused {
      background-color: #1F2937;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    }
  }
  
  /* 图标颜色 */
  .search-bar__icon-wrapper {
    color: #6B7280;
    
    .search-bar__icon--active {
      color: #60A5FA;
    }
  }
  
  /* 输入框文字 */
  .search-bar__input {
    color: #F9FAFB;
    
    &::placeholder {
      color: #6B7280;
    }
    
    &:disabled {
      color: #4B5563;
    }
  }
  
  /* 清除按钮 */
  .search-bar__clear-btn {
    color: #6B7280;
    
    &:hover {
      background-color: #4B5563;
      color: #9CA3AF;
    }
  }
  
  /* 快捷键提示 */
  .search-bar__shortcut {
    color: #6B7280;
    background-color: #374151;
    border-color: #4B5563;
  }
  
  /* 字数统计 */
  .search-bar__word-count {
    color: #6B7280;
    
    &--warning {
      color: #FBBF24;
    }
    
    &--danger {
      color: #F87171;
    }
  }
}

/* ==================== 响应式适配 ==================== */

@media (max-width: 640px) {
  /* 移动端特殊处理 */
  .search-bar {
    /* 触摸目标增大 */
    min-height: 48px;
  }
  
  .search-bar--sm {
    min-height: 44px;
  }
  
  /* 清除按钮触摸区域扩大 */
  .search-bar__clear-btn {
    min-width: 44px;
    min-height: 44px;
  }
  
  /* 搜索按钮固定显示 */
  .search-bar__search-btn {
    min-width: 48px;
  }
  
  /* 隐藏快捷键提示 */
  .search-bar__shortcut {
    display: none;
  }
  
  /* 字数统计位置调整 */
  .search-bar__word-count {
    position: static;
    margin-left: 8px;
    font-size: 11px;
  }
}
</style>
