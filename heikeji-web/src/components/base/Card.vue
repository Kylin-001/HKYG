<script setup lang="ts">
/**
 * Card - 通用卡片组件 v1.0
 *
 * @description
 * 黑龙江科技大学设计系统的统一卡片容器组件，建立统一的卡片样式规范。
 * 支持5种视觉变体、多种内边距/圆角规格、4种hover效果、加载骨架屏等。
 * 符合WCAG 2.1 AA可访问性标准。
 *
 * @features
 * - 5种变体：elevated(浮起), outlined(轮廓), filled(填充), ghost(幽灵), glass(毛玻璃)
 * - 6种内边距预设：none, sm, md, lg, xl, custom
 * - 7种圆角规格：none, sm, md, lg, xl, 2xl, full
 * - 4种hover效果：lift(浮起), glow(发光), border(边框高亮), scale(缩放)
 * - 加载状态：shimmer骨架屏动画
 * - 语义化HTML标签支持
 * - 完整的暗色模式支持
 * - 响应式适配
 *
 * @example
 * ```vue
 * <!-- 商品卡片 -->
 * <Card variant="elevated" hoverable hover-effect="lift" clickable>
 *   <template #media><img src="..." /></template>
 *   <template #header><h4>商品名称</h4></template>
 *   <div>价格信息</div>
 *   <template #footer><Button>购买</Button></template>
 * </Card>
 *
 * <!-- 毛玻璃悬浮卡片 -->
 * <Card variant="glass" padding="md" radius="xl">
 *   快捷操作菜单...
 * </Card>
 *
 * <!-- 统计数据卡片 -->
 * <Card variant="filled" padding="lg">
 *   <template #header><span class="text-overline">总销售额</span></template>
 *   <div class="text-display font-bold">¥128,450</div>
 * </Card>
 * ```
 */

// ====== 类型导出 ======

/**
 * 卡片变体类型
 */
export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost' | 'glass'

/**
 * 内边距预设
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom'

/**
 * 圆角规格
 */
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

/**
 * Hover效果类型
 */
export type HoverEffect = 'lift' | 'glow' | 'border' | 'scale' | 'none'

/**
 * 阴影等级
 */
export type ShadowLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'brand'

/**
 * HTML标签类型
 */
export type CardTag = 'div' | 'article' | 'section' | 'aside' | 'main'

// ====== Props 接口 ======

interface Props {
  /**
   * 卡片变体类型
   * - elevated: 浮起卡片（默认）- 白色背景 + 轻微阴影，适用于商品/内容卡片
   * - outlined: 轮廓卡片 - 透明/白色背景 + 边框，适用于表单容器
   * - filled: 填充卡片 - 浅灰背景，适用于代码块/通知栏
   * - ghost: 幽灵卡片 - 透明背景，仅通过spacing分隔内容
   * - glass: 毛玻璃卡片 - 半透明 + backdrop-filter模糊效果
   * @default 'elevated'
   */
  variant?: CardVariant

  /**
   * 内边距预设
   * - none: 无内边距 (0px) - 全宽图片卡片
   * - sm: 小 (12px) - 紧凑信息卡
   * - md: 中等 (16px) - 标准内容卡片 (默认)
   * - lg: 大 (24px) - 大型内容区
   * - xl: 超大 (32px) - Hero卡片
   * - custom: 自定义 - 通过customPadding指定
   * @default 'md'
   */
  padding?: CardPadding

  /**
   * 自定义padding值（padding='custom'时使用）
   * @example '16px 24px' 或 '1rem 1.5rem'
   */
  customPadding?: string

  /**
   * 圆角规格
   * - none: 无圆角 (0px)
   * - sm: 小圆角 (8px) - 标签/徽章
   * - md: 中圆角 (12px) - 输入框/小型卡片
   * - lg: 大圆角 (16px) - 标准卡片 (默认)
   * - xl: 超大圆角 (20px) - 大型卡片
   * - 2xl: 特大圆角 (24px) - 特色卡片
   * - full: 完全圆形 (9999px) - 药丸形状
   * @default 'lg'
   */
  radius?: CardRadius

  /**
   * 是否可点击（整个卡片作为按钮）
   * 启用后会添加role="button"、tabindex="0"和键盘交互
   * @default false
   */
  clickable?: boolean

  /**
   * 是否显示hover效果
   * @default false
   */
  hoverable?: boolean

  /**
   * hover效果强度/类型（hoverable=true时生效）
   * - lift: 上浮效果（默认）- translateY(-4px) + 阴影提升
   * - glow: 发光效果 - 品牌蓝色光晕
   * - border: 边框高亮 - border-color变为primary-300
   * - scale: 缩放效果 - scale(1.02) 弹性动画
   * - none: 无效果
   * @default 'lift'
   */
  hoverEffect?: HoverEffect

  /**
   * 是否显示边框
   * @default false
   */
  bordered?: boolean

  /**
   * 阴影等级
   * - none: 无阴影
   * - xs: 极轻微阴影
   * - sm: 轻微阴影（elevated默认值）
   * - md: 中等阴影
   * - lg: 大阴影
   * - xl: 超大阴影
   * - brand: 品牌蓝色阴影
   * @default 'sm'
   */
  shadow?: ShadowLevel

  /**
   * 背景色（可选覆盖变体的默认背景色）
   * @example '#F9FAFB' 或 'var(--color-surface-secondary)'
   */
  bgColor?: string

  /**
   * 背景渐变（可选）
   * @example 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
   */
  gradient?: string

  /**
   * 是否溢出隐藏
   * @default true
   */
  overflow?: boolean

  /**
   * 最大高度（带滚动）
   * @example '400px' 或 '50vh'
   */
  maxHeight?: string | number

  /**
   * 是否显示加载骨架屏
   * @default false
   */
  loading?: boolean

  /**
   * 骨架屏行数（loading=true时生效）
   * @default 3
   */
  skeletonLines?: number

  /**
   * 自定义类名（透传到根元素）
   */
  class?: string

  /**
   * HTML标签类型
   * - div: 默认容器
   * - article: 文章/商品卡片（推荐用于SEO）
   * - section: 内容区块
   * - aside: 侧边栏内容
   * - main: 主要内容区
   * @default 'div'
   */
  tag?: CardTag

  /**
   * ARIA标签（描述卡片用途，特别是clickable=true或无文字内容时）
   */
  ariaLabel?: string

  /**
   * 数据属性（用于测试）
   * @example 'product-card'
   */
  testDataId?: string
}

// ====== Props默认值 ======

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  padding: 'md',
  customPadding: undefined,
  radius: 'lg',
  clickable: false,
  hoverable: false,
  hoverEffect: 'lift',
  bordered: false,
  shadow: 'sm',
  bgColor: undefined,
  gradient: undefined,
  overflow: true,
  maxHeight: undefined,
  loading: false,
  skeletonLines: 3,
  class: undefined,
  tag: 'div',
  ariaLabel: undefined,
  testDataId: undefined,
})

// ====== Events ======

const emit = defineEmits<{
  /**
   * 点击事件（clickable=true时触发）
   */
  click: [event: MouseEvent | KeyboardEvent]
  /**
   * 鼠标进入事件
   */
  mouseenter: [event: MouseEvent]
  /**
   * 鼠标离开事件
   */
  mouseleave: [event: MouseEvent]
}>()

// ====== Slots ======

defineSlots<{
  /**
   * 头部区域（标题、副标题、操作按钮）
   */
  header?: () => any
  /**
   * 默认内容插槽（主要内容区域）
   */
  default?: () => any
  /**
   * 图片/媒体区域
   */
  media?: () => any
  /**
   * 底部区域（操作按钮、元信息）
   */
  footer?: () => any
  /**
   * 右上角额外操作（更多菜单、关闭按钮等）
   */
  actions?: () => any
  /**
   * 徽章/标签区域（NEW、HOT等标记）
   */
  badge?: () => any
}>()

// ====== 导入依赖 ======

import { computed, useSlots } from 'vue'
import { shadows } from '@/tokens'

// ====== 计算属性 ======

/**
 * 计算卡片根元素类名
 */
const cardClasses = computed(() => [
  'card',
  `card--variant-${props.variant}`,
  `card--padding-${props.padding}`,
  `card--radius-${props.radius}`,
  {
    'card--clickable': props.clickable,
    'card--hoverable': props.hoverable,
    [`card--hover-${props.hoverEffect}`]: props.hoverable && props.hoverEffect !== 'none',
    'card--bordered': props.bordered,
    `card--shadow-${props.shadow}`: props.shadow !== 'none',
    'card--overflow-hidden': props.overflow,
    'card--loading': props.loading,
  },
  props.class,
])

/**
 * 计算动态内联样式
 */
const cardStyles = computed(() => {
  const styles: Record<string, string | number> = {}

  // 自定义padding
  if (props.padding === 'custom' && props.customPadding) {
    styles.padding = props.customPadding
  }

  // 自定义背景色
  if (props.bgColor) {
    styles.backgroundColor = props.bgColor
  }

  // 渐变背景（优先级高于bgColor）
  if (props.gradient) {
    styles.background = props.gradient
  }

  // 最大高度
  if (props.maxHeight) {
    styles.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    styles.overflowY = 'auto'
  }

  return styles
})

/**
 * 获取当前变体的默认阴影
 */
const variantShadow = computed(() => {
  const shadowMap: Record<CardVariant, string> = {
    elevated: shadows.light.sm,
    outlined: 'none',
    filled: 'none',
    ghost: 'none',
    glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
  }
  return shadowMap[props.variant]
})

// ====== 方法 ======

/**
 * 处理点击事件
 */
function handleClick(event: MouseEvent) {
  if (!props.clickable || props.loading) return
  emit('click', event)
}

/**
 * 处理键盘事件（Enter/Space激活，仅在clickable时）
 */
function handleKeydown(event: KeyboardEvent) {
  if (!props.clickable || props.loading) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event as unknown as KeyboardEvent)
  }
}

/**
 * 处理鼠标进入事件
 */
function handleMouseEnter(event: MouseEvent) {
  emit('mouseenter', event)
}

/**
 * 处理鼠标离开事件
 */
function handleMouseLeave(event: MouseEvent) {
  emit('mouseleave', event)
}
</script>

<template>
  <component
    :is="tag"
    :class="cardClasses"
    :style="cardStyles"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="ariaLabel"
    :data-test-id="testDataId"
    :aria-busy="loading || undefined"
    @click="handleClick"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 徽章/标签插槽 -->
    <div v-if="$slots.badge" class="card__badge">
      <slot name="badge"></slot>
    </div>

    <!-- 右上角操作插槽 -->
    <div v-if="$slots.actions" class="card__actions">
      <slot name="actions"></slot>
    </div>

    <!-- 媒体/图片插槽 -->
    <div v-if="$slots.media" class="card__media">
      <slot name="media"></slot>
    </div>

    <!-- 头部插槽 -->
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>

    <!-- Loading状态：骨架屏 -->
    <div v-if="loading" class="card__skeleton">
      <div
        v-for="i in skeletonLines"
        :key="i"
        class="skeleton-line"
        :style="{ width: i === skeletonLines ? '60%' : '100%' }"
      ></div>
    </div>

    <!-- 默认内容插槽（非loading状态） -->
    <div v-if="!loading && $slots.default" class="card__content">
      <slot></slot>
    </div>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer && !loading" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<style scoped>
/* ====== CSS变量定义（从设计令牌继承）====== */
.card {
  /* 设计令牌引用 */
  --card-bg-white: #FFFFFF;
  --card-bg-transparent: transparent;
  --card-bg-secondary: #F9FAFB;
  --card-border-subtle: #F3F4F6;
  --card-border-default: #E5E7EB;
  --card-primary-100: #BFDBFE;
  --card-primary-200: #93C5FD;
  --card-primary-300: #60A5FA;
  --card-text-primary: #111827;
  --card-text-secondary: #4B5563;
  --card-surface-secondary: #F9FAFB;

  /* Glass变体专用变量 */
  --card-glass-bg-light: rgba(255, 255, 255, 0.70);
  --card-glass-bg-dark: rgba(17, 24, 39, 0.05);
  --card-glass-border-light: rgba(255, 255, 255, 0.20);
  --card-glass-border-dark: rgba(255, 255, 255, 0.10);

  /* 动画时长 */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;

  /* 缓动函数 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* 圆角预设 */
  --radius-none: 0px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}

/* ====== 基础样式 ====== */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
  color: var(--card-text-primary);
  transition:
    transform var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out),
    border-color var(--transition-normal) var(--ease-out),
    background-color var(--transition-normal) var(--ease-out);

  /* 性能优化：GPU加速 */
  will-change: transform, box-shadow;

  /* 可点击状态光标 */
  &.card--clickable {
    cursor: pointer;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--card-primary-300);
      outline-offset: 2px;
      border-radius: inherit;
    }
  }

  /* 减少动效支持 */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    will-change: auto;
  }
}

/* ====== 变体样式 ====== */

/* elevated变体 - 浮起卡片（默认）⭐推荐 */
.card--variant-elevated {
  background-color: var(--card-bg-white);
  box-shadow: 0 2px 4px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04);
  border: none;

  /* 暗色模式适配 */
  :global(.dark) & {
    background-color: #1F2937;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* outlined变体 - 轮廓卡片 */
.card--variant-outlined {
  background-color: var(--card-bg-white);
  border: 1.5px solid var(--card-border-subtle);
  box-shadow: none;

  &:hover {
    border-color: var(--card-primary-200);
  }

  /* 暗色模式适配 */
  :global(.dark) & {
    background-color: transparent;
    border-color: #374151;
  }
}

/* filled变体 - 填充卡片 */
.card--variant-filled {
  background-color: var(--card-bg-secondary);
  border: none;
  box-shadow: none;

  /* 暗色模式适配 */
  :global(.dark) & {
    background-color: #111827;
  }
}

/* ghost变体 - 幽灵卡片 */
.card--variant-ghost {
  background-color: var(--card-bg-transparent);
  border: none;
  box-shadow: none;
}

/* glass变体 - 毛玻璃卡片 🎨高级 */
.card--variant-glass {
  background-color: var(--card-glass-bg-light);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid var(--card-glass-border-light);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  /* 暗色模式适配 */
  :global(.dark) & {
    background-color: var(--card-glass-bg-dark);
    border-color: var(--card-glass-border-dark);
  }
}

/* ====== Padding内边距规范 ====== */

.card--padding-none {
  padding: 0;
}

.card--padding-sm {
  padding: 12px; /* p-3 */
}

.card--padding-md {
  padding: 16px; /* p-4 ⭐默认 */
}

.card--padding-lg {
  padding: 24px; /* p-6 */
}

.card--padding-xl {
  padding: 32px; /* p-8 */
}

/* 移动端响应式：自动减小padding */
@media (max-width: 767px) {
  .card--padding-lg {
    padding: 16px; /* lg -> md */
  }

  .card--padding-xl {
    padding: 24px; /* xl -> lg */
  }
}

/* ====== Radius圆角规范 ====== */

.card--radius-none {
  border-radius: var(--radius-none);
}

.card--radius-sm {
  border-radius: var(--radius-sm); /* 8px */
}

.card--radius-md {
  border-radius: var(--radius-md); /* 12px */
}

.card--radius-lg {
  border-radius: var(--radius-lg); /* 16px ⭐默认 */
}

.card--radius-xl {
  border-radius: var(--radius-xl); /* 20px */
}

.card--radius-2xl {
  border-radius: var(--radius-2xl); /* 24px */
}

.card--radius-full {
  border-radius: var(--radius-full); /* 9999px */
}

/* ====== Hover效果系统 ====== */

/* lift效果 - 上浮（默认，最常用） */
.card--hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.06);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* 触摸设备优化：使用active替代hover */
  @media (hover: none) and (pointer: coarse) {
    transform: none;
  }

  &:active {
    transform: translateY(-2px);
    transition-duration: var(--transition-fast);
  }
}

/* glow效果 - 发光 */
.card--hover-glow:hover {
  box-shadow: 0 4px 14px rgba(0, 10, 176, 0.20), 0 0 20px rgba(59, 130, 246, 0.30);
  border-color: transparent;
  transition: all 300ms var(--ease-out);

  &:active {
    box-shadow: 0 4px 14px rgba(0, 10, 176, 0.15), 0 0 15px rgba(59, 130, 246, 0.25);
  }
}

/* border效果 - 边框高亮 */
.card--hover-border:hover {
  border-color: var(--card-primary-300);
  box-shadow: 0 0 0 1px var(--card-primary-100);
  transition: all 250ms var(--ease-out);

  &:active {
    border-color: var(--card-primary-200);
  }
}

/* scale效果 - 缩放 */
.card--hover-scale:hover {
  transform: scale(1.02);
  transition: transform 250ms var(--ease-spring);

  @media (hover: none) and (pointer: coarse) {
    transform: none;
  }

  &:active {
    transform: scale(1.01);
    transition-duration: var(--transition-fast);
  }
}

/* ====== 阴影等级系统 ====== */

.card--shadow-xs {
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04);
}

.card--shadow-sm {
  box-shadow: 0 2px 4px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04);
}

.card--shadow-md {
  box-shadow: 0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.06);
}

.card--shadow-lg {
  box-shadow: 0 8px 16px rgba(17, 24, 39, 0.12), 0 4px 8px rgba(17, 24, 39, 0.08);
}

.card--shadow-xl {
  box-shadow: 0 16px 32px rgba(17, 24, 39, 0.16), 0 8px 16px rgba(17, 24, 39, 0.12);
}

.card--shadow-brand {
  box-shadow: 0 4px 14px rgba(0, 10, 176, 0.20), 0 0 1px rgba(0, 10, 176, 0.10);
}

/* 小屏幕下阴影减弱 */
@media (max-width: 767px) {
  .card--shadow-lg {
    box-shadow: 0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.06);
  }

  .card--shadow-xl {
    box-shadow: 0 8px 16px rgba(17, 24, 39, 0.12), 0 4px 8px rgba(17, 24, 39, 0.08);
  }
}

/* ====== 功能特性样式 ====== */

/* 可点击状态 */
.card--clickable {
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* 边框显示 */
.card--bordered {
  border: 1.5px solid var(--card-border-default);
}

/* 溢出隐藏 */
.card--overflow-hidden {
  overflow: hidden;
}

/* Loading状态 */
.card--loading {
  pointer-events: none;
  opacity: 0.85;
}

/* ====== 子元素布局 ====== */

/* 徽章/标签区域 */
.card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  pointer-events: none;
}

/* 右上角操作区域 */
.card__actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 媒体/图片区域 */
.card__media {
  width: 100%;
  margin-bottom: 16px;
  border-radius: inherit;
  overflow: hidden;

  :deep(img),
  :deep(video),
  :deep(canvas) {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
}

/* 头部区域 */
.card__header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--card-border-subtle);

  &:empty {
    display: none;
  }
}

/* 内容区域 */
.card__content {
  flex: 1;
  min-height: 0; /* 允许flex子项收缩 */
}

/* 底部区域 */
.card__footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--card-border-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;

  &:empty {
    display: none;
  }
}

/* ====== 骨架屏动画 ====== */
.card__skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--card-surface-secondary) 0%,
    var(--card-border-subtle) 50%,
    var(--card-surface-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 脉冲效果（可选增强） */
.card--loading .skeleton-line {
  animation: shimmer 1.5s infinite, pulse-opacity 2s ease-in-out infinite;
}

@keyframes pulse-opacity {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* ====== 暗色模式全局适配 ====== */
:global(.dark) {
  .skeleton-line {
    background: linear-gradient(
      90deg,
      #1F2937 0%,
      #374151 50%,
      #1F2937 100%
    );
    background-size: 200% 100%;
  }
}
</style>

<!--
  ====== 测试用例示例 ======

  ## 基础渲染测试
  ```typescript
  it('should render correctly with default props', () => {
    const wrapper = mount(Card)
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('card--variant-elevated')
    expect(wrapper.classes()).toContain('card--padding-md')
    expect(wrapper.classes()).toContain('card--radius-lg')
  })
  ```

  ## 变体切换测试
  ```typescript
  it('should apply correct variant classes', async () => {
    const variants: CardVariant[] = ['elevated', 'outlined', 'filled', 'ghost', 'glass']
    for (const variant of variants) {
      const wrapper = mount(Card, { props: { variant } })
      expect(wrapper.classes()).toContain(`card--variant-${variant}`)
    }
  })
  ```

  ## Padding变化测试
  ```typescript
  it('should render different paddings correctly', () => {
    const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg', 'xl', 'custom']
    paddings.forEach(padding => {
      const wrapper = mount(Card, { props: { padding, customPadding: '20px' } })
      expect(wrapper.classes()).toContain(`card--padding-${padding}`)
    })
  })
  ```

  ## Radius变化测试
  ```typescript
  it('should render different radius correctly', () => {
    const radii: CardRadius[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
    radii.forEach(radius => {
      const wrapper = mount(Card, { props: { radius } })
      expect(wrapper.classes()).toContain(`card--radius-${radius}`)
    })
  })
  ```

  ## Hover效果测试
  ```typescript
  it('should apply correct hover effect classes', () => {
    const effects: HoverEffect[] = ['lift', 'glow', 'border', 'scale']
    effects.forEach(effect => {
      const wrapper = mount(Card, {
        props: { hoverable: true, hoverEffect: effect }
      })
      expect(wrapper.classes()).toContain(`card--hover-${effect}`)
    })
  })

  it('should not apply hover effect when hoverable is false', () => {
    const wrapper = mount(Card, {
      props: { hoverable: false, hoverEffect: 'lift' }
    })
    expect(wrapper.classes()).not.toContain('card--hover-lift')
  })
  ```

  ## 点击事件测试
  ```typescript
  it('should emit click event when clicked and clickable is true', async () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should not emit click when clickable is false', async () => {
    const wrapper = mount(Card, { props: { clickable: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
  ```

  ## 键盘交互测试
  ```typescript
  it('should trigger click on Enter key press when clickable', async () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should trigger click on Space key press when clickable', async () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  ```

  ## Loading状态测试
  ```typescript
  it('should show skeleton when loading', async () => {
    const wrapper = mount(Card, {
      props: { loading: true, skeletonLines: 5 }
    })
    expect(wrapper.find('.card__skeleton').exists()).toBe(true)
    expect(wrapper.findAll('.skeleton-line').length).toBe(5)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('should hide content when loading', async () => {
    const wrapper = mount(Card, {
      props: { loading: true },
      slots: { default: '<p>Content</p>' }
    })
    expect(wrapper.find('.card__content').exists()).toBe(false)
  })
  ```

  ## 插槽渲染测试
  ```typescript
  it('should render header slot', () => {
    const wrapper = mount(Card, {
      slots: { header: '<h3>Title</h3>' }
    })
    expect(wrapper.find('.card__header').exists()).toBe(true)
    expect(wrapper.find('.card__header').html()).toContain('<h3>Title</h3>')
  })

  it('should render media slot', () => {
    const wrapper = mount(Card, {
      slots: { media: '<img src="test.jpg" />' }
    })
    expect(wrapper.find('.card__media').exists()).toBe(true)
  })

  it('should render footer slot', () => {
    const wrapper = mount(Card, {
      slots: { footer: '<button>Action</button>' }
    })
    expect(wrapper.find('.card__footer').exists()).toBe(true)
  })

  it('should render actions slot', () => {
    const wrapper = mount(Card, {
      slots: { actions: '<button>More</button>' }
    })
    expect(wrapper.find('.card__actions').exists()).toBe(true)
  })

  it('should render badge slot', () => {
    const wrapper = mount(Card, {
      slots: { badge: '<span>New</span>' }
    })
    expect(wrapper.find('.card__badge').exists()).toBe(true)
  })
  ```

  ## ARIA属性测试
  ```typescript
  it('should have button role when clickable', () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should have aria-label when provided', () => {
    const wrapper = mount(Card, { props: { ariaLabel: 'Product Card' } })
    expect(wrapper.attributes('aria-label')).toBe('Product Card')
  })

  it('should have data-test-id when provided', () => {
    const wrapper = mount(Card, { props: { testDataId: 'product-card' } })
    expect(wrapper.attributes('data-test-id')).toBe('product-card')
  })
  ```

  ## 标签渲染测试
  ```typescript
  it('should render as article tag when specified', () => {
    const wrapper = mount(Card, { props: { tag: 'article' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('should render as section tag when specified', () => {
    const wrapper = mount(Card, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
  ```

  ## 自定义样式测试
  ```typescript
  it('should apply custom padding when padding is custom', () => {
    const wrapper = mount(Card, {
      props: { padding: 'custom', customPadding: '20px 32px' }
    })
    expect(wrapper.attributes('style')).toContain('padding: 20px 32px')
  })

  it('should apply bgColor when provided', () => {
    const wrapper = mount(Card, { props: { bgColor: '#F9FAFB' } })
    expect(wrapper.attributes('style')).toContain('background-color: #F9FAFB')
  })

  it('should apply gradient when provided', () => {
    const wrapper = mount(Card, {
      props: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    })
    expect(wrapper.attributes('style')).toContain('linear-gradient')
  })

  it('should apply maxHeight when provided', () => {
    const wrapper = mount(Card, { props: { maxHeight: '400px' } })
    expect(wrapper.attributes('style')).toContain('max-height: 400px')
  })
  ```

  ====== 示例用法 ======

  ### 1. 商品卡片（elevated变体）
  ```vue
  <template>
    <Card
      variant="elevated"
      hoverable
      hover-effect="lift"
      clickable
      tag="article"
      data-test-id="product-card"
    >
      <template #media>
        <img src="/product.jpg" alt="Product Image" />
      </template>
      <template #header>
        <h4>商品名称</h4>
        <p class="text-caption text-tertiary">副标题描述</p>
      </template>
      <div class="price text-lg font-bold text-primary">¥199.00</div>
      <template #footer>
        <BaseButton variant="brand" size="sm">加入购物车</BaseButton>
        <BaseButton variant="ghost" size="sm">收藏</BaseButton>
      </template>
      <template #badge>
        <Badge variant="danger">HOT</Badge>
      </template>
    </Card>
  </template>
  ```

  ### 2. 统计数据卡片（filled变体）
  ```vue
  <template>
    <Card variant="filled" padding="lg">
      <template #header>
        <span class="text-overline text-tertiary">总销售额</span>
      </template>
      <div class="text-display font-bold text-primary">¥128,450</div>
      <div class="text-caption text-pine flex items-center gap-1 mt-2">
        <ArrowTrendingUp />
        <span>+12.5%</span>
        <span class="text-tertiary">较上月</span>
      </div>
    </Card>
  </template>
  ```

  ### 3. 毛玻璃悬浮卡片（glass变体）
  ```vue
  <template>
    <Card
      variant="glass"
      padding="md"
      radius="xl"
      class="absolute top-4 right-4 z-50"
    >
      <template #actions>
        <IconButton icon="x" size="sm" @click="closeMenu" />
      </template>
      <nav class="flex flex-col gap-2">
        <a href="#" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20">
          <HomeIcon /> 首页
        </a>
        <a href="#" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20">
          <UserIcon /> 个人中心
        </a>
        <a href="#" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20">
          <SettingsIcon /> 设置
        </a>
      </nav>
    </Card>
  </template>
  ```

  ### 4. 表单容器（outlined变体）
  ```vue
  <template>
    <Card variant="outlined" padding="xl" shadow="none" tag="section">
      <template #header>
        <h2 class="text-h3 mb-1">用户设置</h2>
        <p class="text-body text-tertiary">管理您的账户信息和偏好设置</p>
      </template>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <InputField label="用户名" v-model="username" />
        <InputField label="邮箱" type="email" v-model="email" />
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" @click="resetForm">重置</Button>
          <Button variant="primary" type="submit">保存更改</Button>
        </div>
      </form>
    </Card>
  </template>
  ```

  ### 5. 列表项卡片（ghost变体）
  ```vue
  <template>
    <Card
      v-for="item in items"
      :key="item.id"
      variant="ghost"
      padding="md"
      hoverable
      hover-effect="border"
      clickable
      @click="navigateTo(item.path)"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-surface-secondary flex items-center justify-center">
          <component :is="item.icon" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium truncate">{{ item.title }}</h4>
          <p class="text-sm text-tertiary truncate">{{ item.description }}</p>
        </div>
        <ChevronRightIcon class="w-5 h-5 text-tertiary" />
      </div>
    </Card>
  </template>
  ```

  ### 6. 加载中状态
  ```vue
  <template>
    <Card
      variant="elevated"
      :loading="isLoading"
      :skeleton-lines="5"
      padding="lg"
    />

    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    const isLoading = ref(true)

    onMounted(async () => {
      await fetchData()
      isLoading.value = false
    })
    </script>
  ```

  ### 7. 自定义样式组合
  ```vue
  <template>
    <!-- 渐变背景Hero卡片 -->
    <Card
      variant="ghost"
      padding="xl"
      radius="2xl"
      :gradient="'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'"
      class="text-white"
    >
      <h2 class="text-display font-bold mb-2">欢迎回来</h2>
      <p class="text-bodyLarge opacity-90">探索更多精彩内容</p>
    </Card>

    <!-- 固定高度滚动卡片 -->
    <Card
      variant="outlined"
      padding="md"
      :max-height="400"
      class="w-full"
    >
      <ul class="space-y-3">
        <li v-for="i in 20" :key="i">列表项 {{ i }}</li>
      </ul>
    </Card>

    <!-- 无圆角全宽分割线 -->
    <Card
      variant="ghost"
      padding="sm"
      radius="none"
      class="border-b border-border-subtle"
    >
      <span class="text-sm text-tertiary">分割线内容</span>
    </Card>
  </template>
  ```
-->
