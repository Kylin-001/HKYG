<script setup lang="ts">
/**
 * Skeleton 骨架屏组件
 *
 * 支持多种预设类型，用于内容加载时的占位展示。
 * 使用 CSS 变量 --color-surface / --color-divider 保持主题一致性，
 * 通过 shimmer 渐变背景位移动画实现闪烁效果。
 */
import { computed } from 'vue'

interface SkeletonProps {
  /** 骨架屏类型 */
  type?: 'heading' | 'text' | 'image' | 'button' | 'card' | 'list' | 'table' | 'banner' | 'product-grid' | 'order-item' | 'takeout-merchant' | 'forum-post'
  /** 文本行数 (text/list/table 类型生效) */
  rows?: number
  /** 自定义宽度 */
  width?: string | number
  /** 自定义高度 */
  height?: string | number
  /** 圆角风格 (兼容旧 API) */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  /** 动画效果 */
  animation?: 'pulse' | 'wave' | 'none'
  /** 网格列数 (product-grid类型) */
  columns?: number
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  type: 'text',
  width: '100%',
  height: undefined,
  variant: 'rounded',
  animation: 'wave',
  rows: 3,
  columns: 4,
})

/** 根据类型推导默认高度 */
const resolvedHeight = computed(() => {
  if (props.height) {
    return typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  const defaults: Record<string, string> = {
    heading: '28px',
    text: '16px',
    image: '200px',
    button: '40px',
    card: 'auto',
    list: 'auto',
    table: 'auto',
  }
  return defaults[props.type] || '16px'
})

/** 根据类型推导默认宽度 */
const resolvedWidth = computed(() => {
  if (props.width) {
    return typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return '100%'
})
</script>

<template>
  <!-- ========== heading 标题骨架 ========== -->
  <div v-if="type === 'heading'"
       class="skeleton skeleton--shimmer"
       :style="{ width: resolvedWidth, height: resolvedHeight, borderRadius: 'var(--radius-md)' }" />

  <!-- ========== text 文本骨架 ========== -->
  <div v-else-if="type === 'text'" class="skeleton-text-group">
    <div v-for="(row, index) in rows"
         :key="index"
         class="skeleton skeleton--shimmer"
         :style="{
           width: index === rows - 1 ? '60%' : '100%',
           height: resolvedHeight,
           borderRadius: '4px',
           marginBottom: index < rows - 1 ? '10px' : '0',
         }" />
  </div>

  <!-- ========== image 图片骨架 ========== -->
  <div v-else-if="type === 'image'"
       class="skeleton skeleton--shimmer"
       :style="{ width: resolvedWidth, height: resolvedHeight, borderRadius: 'var(--radius-lg)' }" />

  <!-- ========== button 按钮骨架 ========== -->
  <div v-else-if="type === 'button'"
       class="skeleton skeleton--shimmer"
       :style="{
         width: resolvedWidth === '100%' ? '120px' : resolvedWidth,
         height: resolvedHeight,
         borderRadius: 'var(--radius-full)',
       }" />

  <!-- ========== card 卡片骨架 ========== -->
  <div v-else-if="type === 'card'" class="skeleton-card">
    <div class="skeleton skeleton--shimmer skeleton-card__img"
         :style="{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }" />
    <div class="skeleton-card__body">
      <div class="skeleton skeleton--shimmer skeleton-card__title"
           :style="{ borderRadius: 'var(--radius-sm)' }" />
      <div class="skeleton skeleton--shimmer skeleton-card__text"
           :style="{ borderRadius: 'var(--radius-sm)' }" />
      <div class="skeleton skeleton--shimmer skeleton-card__price"
           :style="{ borderRadius: 'var(--radius-sm)', width: '40%' }" />
    </div>
  </div>

  <!-- ========== list 列表骨架 ========== -->
  <div v-else-if="type === 'list'" class="skeleton-list">
    <div v-for="i in rows" :key="i" class="skeleton-list__item">
      <div class="skeleton skeleton--shimmer skeleton-list__avatar"
           :style="{ borderRadius: '50%' }" />
      <div class="skeleton-list__content">
        <div class="skeleton skeleton--shimmer skeleton-list__line"
             :style="{ borderRadius: '4px' }" />
        <div class="skeleton skeleton--shimmer skeleton-list__line skeleton-list__line--short"
             :style="{ borderRadius: '4px' }" />
      </div>
    </div>
  </div>

  <!-- ========== table 表格骨架 ========== -->
  <div v-else-if="type === 'table'" class="skeleton-table">
    <div class="skeleton-table__row skeleton-table__header">
      <div v-for="col in 4" :key="'h-' + col"
           class="skeleton skeleton--shimmer skeleton-table__cell"
           :style="{ borderRadius: '4px' }" />
    </div>
    <div v-for="row in Math.max(rows, 3)" :key="'r-' + row" class="skeleton-table__row">
      <div v-for="col in 4" :key="'c-' + col"
           class="skeleton skeleton--shimmer skeleton-table__cell"
           :style="{ borderRadius: '4px' }" />
    </div>
  </div>

  <!-- ========== banner 横幅骨架 ========== -->
  <div v-else-if="type === 'banner'" class="skeleton-banner">
    <div class="skeleton skeleton--shimmer skeleton-banner__main"
         :style="{ borderRadius: 'var(--radius-xl)' }" />
    <div class="skeleton-banner__dots">
      <span v-for="i in 3" :key="i" class="skeleton-banner__dot" :class="{ active: i === 1 }"></span>
    </div>
  </div>

  <!-- ========== product-grid 商品网格骨架 ========== -->
  <div v-else-if="type === 'product-grid'" class="skeleton-product-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <div v-for="i in (rows || columns * 2)" :key="i" class="skeleton-card">
      <div class="skeleton skeleton--shimmer skeleton-card__img"
           :style="{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }" />
      <div class="skeleton-card__body">
        <div class="skeleton skeleton--shimmer skeleton-card__title"
             :style="{ borderRadius: 'var(--radius-sm)' }" />
        <div class="skeleton skeleton--shimmer skeleton-card__text"
             :style="{ borderRadius: 'var(--radius-sm)' }" />
        <div class="skeleton skeleton--shimmer skeleton-card__price"
             :style="{ borderRadius: 'var(--radius-sm)', width: '40%' }" />
      </div>
    </div>
  </div>

  <!-- ========== order-item 订单项骨架 ========== -->
  <div v-else-if="type === 'order-item'" class="skeleton-order-item">
    <div class="skeleton-order-item__header">
      <div class="skeleton skeleton--shimmer" style="width: 120px; height: 16px; border-radius: 4px;" />
      <div class="skeleton skeleton--shimmer" style="width: 60px; height: 20px; border-radius: 10px;" />
    </div>
    <div class="skeleton-order-item__body">
      <div class="skeleton skeleton--shimmer" style="width: 60px; height: 60px; border-radius: var(--radius-md); flex-shrink: 0;" />
      <div class="skeleton-order-item__info">
        <div class="skeleton skeleton--shimmer" style="width: 80%; height: 14px; border-radius: 4px; margin-bottom: 8px;" />
        <div class="skeleton skeleton--shimmer" style="width: 50%; height: 12px; border-radius: 4px; margin-bottom: 8px;" />
        <div class="skeleton skeleton--shimmer" style="width: 30%; height: 16px; border-radius: 4px;" />
      </div>
    </div>
  </div>

  <!-- ========== takeout-merchant 外卖商家骨架 ========== -->
  <div v-else-if="type === 'takeout-merchant'" class="skeleton-takeout-merchant">
    <div class="skeleton skeleton--shimmer skeleton-takeout-merchant__logo"
         :style="{ borderRadius: '50%' }" />
    <div class="skeleton-takeout-merchant__info">
      <div class="skeleton skeleton--shimmer" style="width: 60%; height: 18px; border-radius: 4px; margin-bottom: 8px;" />
      <div class="skeleton skeleton--shimmer" style="width: 80%; height: 13px; border-radius: 4px; margin-bottom: 6px;" />
      <div class="skeleton skeleton--shimmer" style="width: 70%; height: 13px; border-radius: 4px;" />
    </div>
    <div class="skeleton-takeout-merchant__rating">
      <div class="skeleton skeleton--shimmer" style="width: 40px; height: 18px; border-radius: 9px;" />
    </div>
  </div>

  <!-- ========== forum-post 论坛帖子骨架 ========== -->
  <div v-else-if="type === 'forum-post'" class="skeleton-forum-post">
    <div class="skeleton-forum-post__header">
      <div class="skeleton skeleton--shimmer" style="width: 36px; height: 36px; border-radius: 50%;" />
      <div class="skeleton-forum-post__user-info">
        <div class="skeleton skeleton--shimmer" style="width: 80px; height: 14px; border-radius: 4px; margin-bottom: 6px;" />
        <div class="skeleton skeleton--shimmer" style="width: 60px; height: 12px; border-radius: 4px;" />
      </div>
    </div>
    <div class="skeleton skeleton--shimmer" style="width: 90%; height: 18px; border-radius: 4px; margin-bottom: 10px;" />
    <div class="skeleton skeleton--shimmer" style="width: 100%; height: 14px; border-radius: 4px; margin-bottom: 8px;" />
    <div class="skeleton skeleton--shimmer" style="width: 75%; height: 14px; border-radius: 4px; margin-bottom: 12px;" />
    <div class="skeleton-forum-post__footer">
      <div class="skeleton skeleton--shimmer" style="width: 40px; height: 12px; border-radius: 4px;" />
      <div class="skeleton skeleton--shimmer" style="width: 40px; height: 12px; border-radius: 4px;" />
      <div class="skeleton skeleton--shimmer" style="width: 40px; height: 12px; border-radius: 4px;" />
    </div>
  </div>

  <!-- ========== 兜底：旧 variant 兼容 ========== -->
  <div v-else
       class="skeleton skeleton--shimmer"
       :style="{
         width: resolvedWidth,
         height: resolvedHeight,
         borderRadius: variant === 'circular' ? '50%' : variant === 'rectangular' ? '0' : '8px',
       }" />
</template>

<style scoped>
/* ---- 基础 shimmer 动画层 ---- */
.skeleton--shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    color-mix(in srgb, var(--color-surface) 85%, var(--color-divider)) 40%,
    color-mix(in srgb, var(--color-surface) 70%, var(--color-divider)) 50%,
    color-mix(in srgb, var(--color-surface) 85%, var(--color-surface)) 60%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ---- card 卡片骨架 ---- */
.skeleton-card {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-divider);
}
.skeleton-card__img {
  width: 100%;
  height: 180px;
}
.skeleton-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.skeleton-card__title {
  width: 72%;
  height: 20px;
}
.skeleton-card__text {
  width: 100%;
  height: 14px;
}
.skeleton-card__price {
  height: 22px;
}

/* ---- list 列表骨架 ---- */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.skeleton-list__item {
  display: flex;
  align-items: center;
  gap: 14px;
}
.skeleton-list__avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
.skeleton-list__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-list__line {
  width: 100%;
  height: 16px;
}
.skeleton-list__line--short {
  width: 55%;
  height: 13px;
}

/* ---- table 表格骨架 ---- */
.skeleton-table {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-md);
  padding: 16px;
}
.skeleton-table__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.skeleton-table__header {
  margin-bottom: 4px;
}
.skeleton-table__header .skeleton-table__cell {
  height: 32px;
}
.skeleton-table__cell {
  height: 44px;
}

/* ---- banner 横幅骨架 ---- */
.skeleton-banner {
  width: 100%;
  position: relative;
}
.skeleton-banner__main {
  width: 100%;
  height: 280px;
}
.skeleton-banner__dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.skeleton-banner__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s;
}
.skeleton-banner__dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--color-gold, #DAA520);
}

/* ---- product-grid 商品网格骨架 ---- */
.skeleton-product-grid {
  display: grid;
  gap: 16px;
  width: 100%;
}

/* ---- order-item 订单项骨架 ---- */
.skeleton-order-item {
  padding: 16px;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-md);
  background: white;
}
.skeleton-order-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.skeleton-order-item__body {
  display: flex;
  gap: 12px;
}
.skeleton-order-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ---- takeout-merchant 外卖商家骨架 ---- */
.skeleton-takeout-merchant {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--color-divider);
}
.skeleton-takeout-merchant__logo {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.skeleton-takeout-merchant__info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.skeleton-takeout-merchant__rating {
  flex-shrink: 0;
}

/* ---- forum-post 论坛帖子骨架 ---- */
.skeleton-forum-post {
  padding: 16px;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-md);
  background: white;
}
.skeleton-forum-post__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.skeleton-forum-post__user-info {
  display: flex;
  flex-direction: column;
}
.skeleton-forum-post__footer {
  display: flex;
  gap: 24px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
}

/* ---- 减少动画偏好 ---- */
@media (prefers-reduced-motion: reduce) {
  .skeleton--shimmer {
    animation: none;
    background: var(--color-background);
  }
}
</style>
