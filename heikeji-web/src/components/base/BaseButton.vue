<script setup lang="ts">
/**
 * BaseButton - 统一按钮组件 v3.0
 *
 * @description
 * 黑龙江科技大学设计系统的统一按钮组件，整合所有按钮变体。
 * 支持6种视觉变体、5种尺寸规格、loading状态、禁用状态、图标插槽等。
 * 符合WCAG 2.1 AA可访问性标准。
 *
 * @features
 * - 6种变体：brand, primary, secondary, danger, ghost, outline
 * - 5种尺寸：xs, sm, md, lg, xl
 * - Loading状态带旋转动画
 * - 支持button/a/router-link标签渲染
 * - 键盘可访问性（Enter/Space激活）
 * - GPU加速动画（transform + opacity）
 * - 光泽扫过动画效果（brand变体）
 *
 * @example
 * ```vue
 * <!-- 品牌主按钮 -->
 * <BaseButton variant="brand" size="lg">立即购买</BaseButton>
 *
 * <!-- 主要操作 -->
 * <BaseButton variant="primary" :loading="isLoading">
 *   提交表单
 * </BaseButton>
 *
 * <!-- 带图标的次要按钮 -->
 * <BaseButton variant="secondary" size="sm" icon-position="left">
 *   <template #icon><SearchIcon /></template>
 *   搜索
 * </BaseButton>
 *
 * <!-- 危险操作 -->
 * <BaseButton variant="danger" @click="handleDelete">
 *   删除
 * </BaseButton>
 *
 * <!-- 链接渲染 -->
 * <BaseButton tag="a" href="/about" variant="ghost">
 *   了解更多
 * </BaseButton>
 * ```
 */

// ====== 类型导出 ======

/**
 * 按钮变体类型
 */
export type ButtonVariant = 'brand' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'

/**
 * 按钮尺寸类型
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * 图标位置
 */
export type IconPosition = 'left' | 'right'

/**
 * HTML标签类型
 */
export type ButtonTag = 'button' | 'a' | 'router-link'

// ====== Props 接口 ======

interface Props {
  /**
   * 按钮变体类型
   * - brand: 品牌主按钮（渐变背景 + 阴影 + 光泽动画）
   * - primary: 主要操作按钮（纯色背景）
   * - secondary: 次要操作按钮（浅灰背景 + 边框）
   * - danger: 危险操作按钮（红色背景）
   * - ghost: 幽灵按钮（透明背景）
   * - outline: 轮廓按钮（透明背景 + 边框）
   * @default 'primary'
   */
  variant?: ButtonVariant

  /**
   * 按钮尺寸
   * - xs: 超小 (24px高)
   * - sm: 小 (32px高)
   * - md: 中等 (40px高) - 默认
   * - lg: 大 (48px高)
   * - xl: 超大 (56px高)
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * 是否全宽显示
   * @default false
   */
  block?: boolean

  /**
   * 是否圆角（pill形状）
   * @default false
   */
  pill?: boolean

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean

  /**
   * 加载状态文字
   * @default '加载中...'
   */
  loadingText?: string

  /**
   * 图标位置（仅在使用icon插槽时有效）
   * @default 'left'
   */
  iconPosition?: IconPosition

  /**
   * 原生按钮type属性
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'

  /**
   * HTML标签类型
   * - button: 默认按钮标签
   * - a: 链接标签（需要href prop）
   * - router-link: Vue Router链接（需要to prop）
   * @default 'button'
   */
  tag?: ButtonTag

  /**
   * 链接地址（tag='a'时使用）
   */
  href?: string

  /**
   * 路由地址（tag='router-link'时使用）
   */
  to?: string | object

  /**
   * 无障碍标签（图标按钮无文字时必须提供）
   */
  ariaLabel?: string

  /**
   * 是否在加载时禁用点击穿透
   * @default true
   */
  disableOnClickLoading?: boolean
}

// ====== Props默认值 ======

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  pill: false,
  disabled: false,
  loading: false,
  loadingText: '加载中...',
  iconPosition: 'left',
  type: 'button',
  tag: 'button',
  href: undefined,
  to: undefined,
  ariaLabel: undefined,
  disableOnClickLoading: true,
})

// ====== Events ======

const emit = defineEmits<{
  /**
   * 点击事件
   */
  click: [event: MouseEvent | KeyboardEvent]
  /**
   * 聚焦事件
   */
  focus: [event: FocusEvent]
  /**
   * 失焦事件
   */
  blur: [event: FocusEvent]
}>()

// ====== Slots ======

/**
 * 图标插槽
 * @binding {boolean} loading - 是否加载中
 */
defineSlots<{
  /**
   * 图标内容（可选）
   */
  icon?: (props: { loading: boolean }) => any
  /**
   * 默认内容（按钮文字）
   */
  default?: () => any
}>()

// ====== 计算属性 ======

import { computed } from 'vue'
import { gradients, shadows } from '@/tokens'

/**
 * 计算按钮类名
 */
const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--size-${props.size}`,
  {
    'base-button--block': props.block,
    'base-button--pill': props.pill,
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--has-icon': !!useSlots().icon && !props.loading,
    [`base-button--icon-${props.iconPosition}`]: !!useSlots().icon && !props.loading,
  },
])

/**
 * 计算动态样式（用于渐变和阴影）
 */
const dynamicStyles = computed(() => {
  const styles: Record<string, string> = {}

  // brand变体的渐变背景
  if (props.variant === 'brand') {
    styles.background = gradients.light.primary
    styles.boxShadow = shadows.light.brand
  }

  return styles
})

/**
 * 判断是否应该禁用交互
 */
const isInteractiveDisabled = computed(() => props.disabled || props.loading)

// ====== 方法 ======

/**
 * 处理点击事件
 */
function handleClick(event: MouseEvent) {
  if (isInteractiveDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)

  // 触觉反馈（如果设备支持）
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(10)
    } catch {
      // 忽略振动API错误
    }
  }
}

/**
 * 处理键盘事件（Enter/Space激活）
 */
function handleKeydown(event: KeyboardEvent) {
  if (isInteractiveDisabled.value) return

  // Enter或Space键触发点击
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    ;(event.target as HTMLElement).click()
  }
}

/**
 * 处理聚焦事件
 */
function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

/**
 * 处理失焦事件
 */
function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

// ====== 插槽工具函数 ======

const slots = useSlots()

/**
 * 是否有图标插槽内容
 */
const hasIconSlot = computed(() => !!slots.icon)
</script>

<template>
  <a
    v-if="tag === 'a'"
    :class="buttonClasses"
    :style="dynamicStyles"
    :href="href"
    :aria-disabled="isInteractiveDisabled || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (loading ? '正在加载' : undefined)"
    :tabindex="disabled ? -1 : undefined"
    role="button"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="base-button__spinner" aria-hidden="true">
      <svg class="base-button__spinner-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="base-button__spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.2"
        />
        <path
          class="base-button__spinner-head"
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <!-- Icon Slot (左侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'left'"
      class="base-button__icon base-button__icon--left"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Button Content -->
    <span class="base-button__content">
      <slot>{{ loading ? loadingText : '' }}</slot>
    </span>

    <!-- Icon Slot (右侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'right'"
      class="base-button__icon base-button__icon--right"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Shine Effect for Brand Variant -->
    <span v-if="variant === 'brand'" class="base-button__shine" aria-hidden="true"></span>
  </a>

  <router-link
    v-else-if="tag === 'router-link'"
    :class="buttonClasses"
    :style="dynamicStyles"
    :to="to"
    :aria-disabled="isInteractiveDisabled || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (loading ? '正在加载' : undefined)"
    :tabindex="disabled ? -1 : undefined"
    role="button"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="base-button__spinner" aria-hidden="true">
      <svg class="base-button__spinner-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="base-button__spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.2"
        />
        <path
          class="base-button__spinner-head"
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <!-- Icon Slot (左侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'left'"
      class="base-button__icon base-button__icon--left"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Button Content -->
    <span class="base-button__content">
      <slot>{{ loading ? loadingText : '' }}</slot>
    </span>

    <!-- Icon Slot (右侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'right'"
      class="base-button__icon base-button__icon--right"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Shine Effect for Brand Variant -->
    <span v-if="variant === 'brand'" class="base-button__shine" aria-hidden="true"></span>
  </router-link>

  <button
    v-else
    :class="buttonClasses"
    :style="dynamicStyles"
    :type="type"
    :disabled="isInteractiveDisabled"
    :aria-disabled="isInteractiveDisabled || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (loading ? '正在加载' : undefined)"
    :tabindex="disabled ? -1 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="base-button__spinner" aria-hidden="true">
      <svg class="base-button__spinner-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="base-button__spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          opacity="0.2"
        />
        <path
          class="base-button__spinner-head"
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <!-- Icon Slot (左侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'left'"
      class="base-button__icon base-button__icon--left"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Button Content -->
    <span class="base-button__content">
      <slot>{{ loading ? loadingText : '' }}</slot>
    </span>

    <!-- Icon Slot (右侧) -->
    <span
      v-if="hasIconSlot && !loading && iconPosition === 'right'"
      class="base-button__icon base-button__icon--right"
      aria-hidden="true"
    >
      <slot name="icon" :loading="loading"></slot>
    </span>

    <!-- Shine Effect for Brand Variant -->
    <span v-if="variant === 'brand'" class="base-button__shine" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
/* ====== CSS变量定义（从设计令牌继承）====== */
.base-button {
  /* 设计令牌引用 */
  --button-primary: #000AB0;
  --button-primary-hover: #000880;
  --button-primary-active: #000660;
  --button-danger: #DC2626;
  --button-danger-hover: #B91C1C;
  --button-surface-secondary: #F9FAFB;
  --button-border-subtle: #F3F4F6;
  --button-text-primary: #111827;
  --button-primary-50: #DBEAFE;
  --button-primary-100: #BFDBFE;
  --button-primary-300: #60A5FA;

  /* 动画时长 */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;

  /* 缓动函数 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* ====== 基础样式 ====== */
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  outline: none;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* GPU加速的过渡属性 */
  transition-property: transform, box-shadow, background-color, border-color, opacity, filter;
  transition-duration: var(--transition-normal);
  transition-timing-function: var(--ease-out);

  /* 性能优化：提示浏览器将进行变换 */
  will-change: transform, box-shadow;

  &:focus-visible {
    outline: 2px solid var(--button-primary-300);
    outline-offset: 2px;
    border-radius: inherit;
  }

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    transform: translateY(-2px);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    transform: scale(0.98) translateY(0);
    transition-duration: var(--transition-fast);
  }
}

/* ====== 尺寸规范 ====== */

/* xs - 超小尺寸 (24px) */
.base-button--size-xs {
  height: 24px;
  padding: 0 0.5rem; /* px-2 */
  font-size: 0.75rem; /* overline (12px) */
  border-radius: 4px;
  gap: 0.375rem;

  .base-button__icon {
    width: 12px;
    height: 12px;
  }

  .base-button__spinner {
    width: 12px;
    height: 12px;
  }
}

/* sm - 小尺寸 (32px) */
.base-button--size-sm {
  height: 32px;
  padding: 0 0.75rem; /* px-3 py-1.5 */
  font-size: 0.875rem; /* caption (14px) */
  border-radius: 6px;
  gap: 0.5rem;

  .base-button__icon {
    width: 14px;
    height: 14px;
  }

  .base-button__spinner {
    width: 14px;
    height: 14px;
  }
}

/* md - 中等尺寸 (40px) - 默认 */
.base-button--size-md {
  height: 40px;
  padding: 0 1rem; /* px-4 py-2 */
  font-size: 1rem; /* body (16px) */
  border-radius: 8px;
  gap: 0.5rem;

  .base-button__icon {
    width: 16px;
    height: 16px;
  }

  .base-button__spinner {
    width: 16px;
    height: 16px;
  }
}

/* lg - 大尺寸 (48px) */
.base-button--size-lg {
  height: 48px;
  padding: 0 1.5rem; /* px-6 py-3 */
  font-size: 1.125rem; /* bodyLarge (18px) */
  border-radius: 8px;
  gap: 0.625rem;

  .base-button__icon {
    width: 18px;
    height: 18px;
  }

  .base-button__spinner {
    width: 18px;
    height: 18px;
  }
}

/* xl - 超大尺寸 (56px) */
.base-button--size-xl {
  height: 56px;
  padding: 0 2rem; /* px-8 py-4 */
  font-size: 1.125rem; /* h4 (18px, 600) */
  font-weight: 700;
  border-radius: 12px;
  gap: 0.75rem;

  .base-button__icon {
    width: 20px;
    height: 20px;
  }

  .base-button__spinner {
    width: 20px;
    height: 20px;
  }
}

/* ====== 变体样式 ====== */

/* brand变体 - 品牌主按钮（渐变 + 阴影 + 光泽效果） */
.base-button--brand {
  color: #ffffff;
  background-image: linear-gradient(
    135deg,
    #000AB0 0%,
    #3B82F6 50%,
    #60A5FA 100%
  );
  box-shadow:
    0 4px 14px rgba(0, 10, 176, 0.20),
    0 0 1px rgba(0, 10, 176, 0.10);

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    transform: translateY(-2px);
    box-shadow:
      0 8px 16px rgba(17, 24, 39, 0.12),
      0 4px 8px rgba(17, 24, 39, 0.08);
    filter: brightness(1.05);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    transform: scale(0.98) translateY(0);
    filter: brightness(1);
  }

  /* 光泽扫过动画容器 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: left 0.6s var(--ease-out);
    pointer-events: none;
  }

  &:hover::before {
    left: 100%;
  }
}

/* primary变体 - 主要操作按钮 */
.base-button--primary {
  background-color: var(--button-primary);
  color: #ffffff;

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-hover);
    box-shadow:
      0 4px 8px rgba(17, 24, 39, 0.08),
      0 2px 4px rgba(17, 24, 39, 0.06);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-active);
  }
}

/* secondary变体 - 次要操作按钮 */
.base-button--secondary {
  background-color: var(--button-surface-secondary);
  color: var(--button-text-primary);
  border: 1px solid var(--button-border-subtle);

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    background-color: #F3F4F6;
    border-color: var(--button-primary-100);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    background-color: #E5E7EB;
  }
}

/* danger变体 - 危险操作按钮 */
.base-button--danger {
  background-color: var(--button-danger);
  color: #ffffff;

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-danger-hover);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    background-color: #991B1B;
  }
}

/* ghost变体 - 幽灵按钮 */
.base-button--ghost {
  background-color: transparent;
  color: var(--button-primary);

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-50);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-100);
  }
}

/* outline变体 - 轮廓按钮 */
.base-button--outline {
  background-color: transparent;
  color: var(--button-primary);
  border: 2px solid var(--button-primary);

  &:hover:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-50);
    border-color: var(--button-primary-hover);
  }

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    background-color: var(--button-primary-100);
  }
}

/* ====== 功能特性样式 ====== */

/* 全宽显示 */
.base-button--block {
  display: flex;
  width: 100%;
}

/* 圆角pill形状 */
.base-button--pill {
  border-radius: 9999px;
}

/* Disabled状态 */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;

  &:hover {
    transform: none;
    box-shadow: none;
    filter: none;
  }
}

/* Loading状态 */
.base-button--loading {
  opacity: 0.75;
  cursor: wait;
  pointer-events: none;

  .base-button__content {
    opacity: 0.7;
  }
}

/* ====== 内部元素样式 ====== */

/* Loading Spinner */
.base-button__spinner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.base-button__spinner-icon {
  width: 100%;
  height: 100%;
  animation: spin 0.7s linear infinite;
}

.base-button__spinner-track {
  transition: stroke-opacity 0.2s ease;
}

.base-button__spinner-head {
  transition: stroke-opacity 0.2s ease;
}

/* Icon容器 */
.base-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  :deep(svg),
  :deep(img) {
    width: 100%;
    height: 100%;
  }
}

.base-button__icon--left {
  order: -1;
  margin-right: 0.25rem;
}

.base-button__icon--right {
  order: 1;
  margin-left: 0.25rem;
}

/* Content容器 */
.base-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

/* 光泽效果层 */
.base-button__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 100%
  );
  pointer-events: none;
  animation: shine 3s ease-in-out infinite;
}

/* ====== 动画关键帧 ====== */

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}
</style>

