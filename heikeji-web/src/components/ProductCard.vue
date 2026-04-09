<script setup lang="ts">
/**
 * ProductCard 商品卡片组件 v3.0
 * 符合黑龙江科技大学设计系统规范的现代化电商商品展示卡片
 * 支持多种布局变体、完整的插槽系统、可访问性和性能优化
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// ====== 设计令牌导入 ======
import { lightColorTokens as colors } from '@/tokens/colors'
import { typographyTokens } from '@/tokens/typography'
import { spacingTokens, borderRadiusTokens, shadowTokens } from '@/tokens/spacing'
import { animationTokens, transitionPresets } from '@/tokens/animation'

// ====== 类型定义 ======
interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category?: string
  sales?: number
  rating?: number
  stock?: number
  tags?: string[]
  isHot?: boolean
  isNew?: boolean
  isDiscount?: string // 如 "8折"
}

interface Props {
  product: Product
  variant?: 'default' | 'horizontal' | 'compact' | 'featured'
  showActions?: boolean
  showRating?: boolean
  showSales?: boolean
  lazyImage?: boolean
  clickable?: boolean
  href?: string
}

// ====== Props 配置 ======
const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showActions: true,
  showRating: false,
  showSales: true,
  lazyImage: true,
  clickable: true,
  href: ''
})

// ====== Emits 定义 ======
const emit = defineEmits<{
  click: [product: Product]
  addToCart: [product: Product]
  favorite: [product: Product, isFavorite: boolean]
  imageError: [event: Error]
}>()

// ====== 路由实例 ======
const router = useRouter()

// ====== 响应式状态 ======
const imageLoaded = ref(false)
const imageError = ref(false)
const isFavorite = ref(false)

// ====== 计算属性 ======

/** 折扣百分比计算 */
const discountPercentage = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice <= props.product.price) {
    return 0
  }
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})

/** 折扣节省金额 */
const savingsAmount = computed(() => {
  if (!props.product.originalPrice || !props.product.price || props.product.originalPrice <= props.product.price) {
    return 0
  }
  return props.product.originalPrice - props.product.price
})

/** 格式化价格显示 */
function formatPrice(price: number | undefined): string {
  return (price ?? 0).toFixed(2)
}

/** 格式化销量显示 */
function formatSales(sales: number | undefined): string {
  const s = sales ?? 0
  if (s >= 10000) {
    return `${(s / 10000).toFixed(1)}万`
  }
  return s.toString()
}

/** 是否显示标签徽章 */
const hasBadge = computed(() => {
  return props.product.isHot || props.product.isNew || props.product.isDiscount || discountPercentage.value > 0
})

// ====== 事件处理函数（缓存优化）=====

/** 卡片点击处理 */
function handleCardClick(): void {
  if (!props.clickable) return
  
  emit('click', props.product)
  
  if (props.href) {
    router.push(props.href)
  }
}

/** 加入购物车处理 */
function handleAddToCart(event: Event): void {
  event.stopPropagation()
  emit('addToCart', props.product)
}

/** 收藏切换处理 */
function handleFavorite(event: Event): void {
  event.stopPropagation()
  isFavorite.value = !isFavorite.value
  emit('favorite', props.product, isFavorite.value)
}

/** 图片加载成功处理 */
function handleImageLoad(): void {
  imageLoaded.value = true
  imageError.value = false
}

/** 图片加载失败处理 */
function handleImageError(event: Event): void {
  imageLoaded.value = false
  imageError.value = true
  const error = new Error(`图片加载失败: ${props.product.image}`)
  emit('imageError', error)
}

/** 键盘交互处理（可访问性）*/
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleCardClick()
  }
}

// ====== 插槽定义 ======
defineSlots<{
  /** 图片区域覆盖 */
  image(props: { product: Product }): any
  /** 标签区域扩展 */
  tags(props: { product: Product }): any
  /** 价格区域自定义 */
  price(props: { product: Product }): any
  /** 操作按钮区域 */
  actions(props: { product: Product }): any
  /** 底部额外内容 */
  footer(): any
}>()
</script>

<template>
  <article
    :class="[
      'product-card',
      `product-card--${variant}`,
      {
        'product-card--clickable': clickable,
        'product-card--has-actions': showActions,
        'product-card--loaded': imageLoaded
      }
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="`查看商品：${product.name}`"
    @click="handleCardClick"
    @keydown="handleKeydown"
  >
    <!-- ==================== 图片区域 ==================== -->
    <div class="product-card__media">
      <!-- 自定义图片插槽 -->
      <slot name="image" :product="product">
        <!-- 默认图片实现 -->
        <div class="product-card__image-wrapper">
          <!-- 加载骨架屏 -->
          <div v-if="!imageLoaded && !imageError" class="product-card__skeleton"></div>
          
          <!-- 错误占位符 -->
          <div v-if="imageError" class="product-card__error-placeholder">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>图片加载失败</span>
          </div>
          
          <!-- 实际图片 -->
          <img
            v-show="imageLoaded"
            :src="product.image"
            :alt="`${product.name}的商品图片`"
            :loading="lazyImage ? 'lazy' : 'eager'"
            class="product-card__image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>
      </slot>

      <!-- 标签徽章系统 -->
      <div v-if="hasBadge" class="product-card__badges">
        <slot name="tags" :product="product">
          <!-- HOT标签 -->
          <span 
            v-if="product.isHot" 
            class="product-card__badge product-card__badge--hot"
          >
            HOT
          </span>
          
          <!-- NEW标签 -->
          <span 
            v-if="product.isNew" 
            class="product-card__badge product-card__badge--new"
          >
            NEW
          </span>
          
          <!-- 折扣标签 -->
          <span 
            v-if="product.isDiscount || discountPercentage > 0" 
            class="product-card__badge product-card__badge--discount"
          >
            {{ product.isDiscount || `-${discountPercentage}%` }}
          </span>
        </slot>
      </div>
    </div>

    <!-- ==================== 内容区域 ==================== -->
    <div class="product-card__content">
      <!-- 商品名称 -->
      <h4 class="product-card__name" :title="product.name">
        {{ product.name }}
      </h4>

      <!-- 价格区域 -->
      <div class="product-card__price-section">
        <slot name="price" :product="product">
          <!-- 现价 -->
          <span class="product-card__current-price">
            <span class="currency">¥</span>{{ formatPrice(product.price) }}
          </span>
          
          <!-- 原价 -->
          <del v-if="product.originalPrice && product.originalPrice > product.price" 
               class="product-card__original-price">
            ¥{{ formatPrice(product.originalPrice) }}
          </del>
          
          <!-- 省钱提示 -->
          <span v-if="savingsAmount > 0" class="product-card__savings">
            省¥{{ formatPrice(savingsAmount) }}
          </span>
        </slot>
      </div>

      <!-- 销量/评分信息（可选） -->
      <div v-if="(showSales && product.sales) || (showRating && product.rating)" 
           class="product-card__meta">
        <!-- 销量 -->
        <span v-if="showSales && product.sales" class="product-card__sales">
          <svg v-if="product.isHot || product.sales > 1000" class="fire-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-4.97 0-9-3.582-9-8 0-3.536 2.618-6.632 5.5-8.25.5-.278.987-.55 1.457-.82C11.967 4.68 13 3.85 13 2c0-.667.333-1 1-1 .667 0 1 .333 1 1 0 2.5-1.5 4-3 5.5-.5.5-.833 1.167-1 2-.167.833 0 1.667.5 2.5.5.833 1.333 1.5 2.5 2 1.167.5 2.333.75 3.5.75 1.167 0 2.083-.417 2.75-1.25.667-.833 1-1.917 1-3.25 0-1.333-.417-2.583-1.25-3.75C19.167 5.333 18 4.167 16.5 3c-.5-.417-.667-.833-.5-1.25.167-.417.5-.625 1-.625.5 0 1 .167 1.5.5 2 1.5 3.5 3.25 4.5 5.25s1.5 4.083 1.5 6.25c0 3.314-2.686 6-6 6z"/>
          </svg>
          已售{{ formatSales(product.sales) }}
        </span>
        
        <!-- 评分 -->
        <span v-if="showRating && product.rating" class="product-card__rating">
          <span class="stars">★</span>
          {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <!-- 操作按钮区域（hover时显示） -->
      <div v-if="showActions" class="product-card__actions">
        <slot name="actions" :product="product">
          <!-- 加入购物车按钮 -->
          <button
            class="product-card__btn product-card__btn--primary"
            @click="handleAddToCart"
            title="加入购物车"
            aria-label="加入购物车"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <span>加入购物车</span>
          </button>
          
          <!-- 收藏按钮 -->
          <button
            :class="['product-card__btn', 'product-card__btn--icon', { 'is-favorite': isFavorite }]"
            @click="handleFavorite"
            :title="isFavorite ? '取消收藏' : '加入收藏'"
            :aria-label="isFavorite ? '取消收藏' : '加入收藏'"
          >
            <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </slot>
      </div>

      <!-- 底部插槽 -->
      <div v-if="$slots.footer" class="product-card__footer">
        <slot name="footer" />
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ============================================
   CSS 变量 - 集成设计令牌系统 v3.0
   ============================================ */
.product-card {
  /* 布局基础 */
  position: relative;
  display: flex;
  flex-direction: column;
  
  /* 视觉样式 */
  background: var(--color-surface, #FFFFFF);
  border-radius: var(--radius-xl, 12px);
  border: 1px solid var(--color-border-subtle, #F3F4F6);
  overflow: hidden;
  
  /* 阴影和过渡 */
  box-shadow: var(--shadow-sm);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 宽度控制 */
  width: 100%;
}

/* 可点击状态 */
.product-card--clickable {
  cursor: pointer;
  
  &:focus-visible {
    outline: 2px solid var(--color-primary-500, #000AB0);
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98);
    transition-duration: 100ms;
  }
  
  /* Hover 效果 - 仅 default 和 featured 变体 */
  &.product-card--default:hover,
  &.product-card--featured:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-brand, 0 4px 14px rgba(0, 10, 176, 0.20));
    border-color: var(--color-primary-200, #93C5FD);
    
    /* 图片缩放效果 */
    .product-card__image {
      transform: scale(1.05);
    }
    
    /* 显示操作按钮 */
    .product-card__actions {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    /* 名称颜色变化 */
    .product-card__name {
      color: var(--color-primary-500, #000AB0);
    }
  }
}

/* ============================================
   图片媒体区域
   ============================================ */
.product-card__media {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
}

/* 默认变体 - 16:9 比例 */
.product-card--default .product-card__media {
  aspect-ratio: 16 / 9;
}

/* 水平变体 - 固定尺寸 */
.product-card--horizontal .product-card__media {
  width: 120px;
  min-width: 120px;
  height: 120px;
  flex-shrink: 0;
}

/* 紧凑变体 - 4:3 比例 */
.product-card--compact .product-card__media {
  aspect-ratio: 4 / 3;
}

/* 特色推荐变体 - 更大比例 */
.product-card--featured .product-card__media {
  aspect-ratio: 16 / 10;
  position: relative;
  
  /* 渐变遮罩层 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    pointer-events: none;
    z-index: 1;
  }
}

/* 图片容器 */
.product-card__image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图片样式 */
.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 加载骨架屏动画 */
.product-card__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #F3F4F6 0%,
    #E5E7EB 20%,
    #F3F4F6 40%,
    #F3F4F6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 错误占位符 */
.product-card__error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--color-text-quaternary, #9CA3AF);
  
  .error-icon {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }
  
  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

/* ============================================
   标签徽章系统
   ============================================ */
.product-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: badgeFadeIn 0.3s ease-out both;
}

@keyframes badgeFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 徽章通用样式 */
.product-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* staggered 动画延迟 */
  &:nth-child(1) { animation-delay: 0ms; }
  &:nth-child(2) { animation-delay: 80ms; }
  &:nth-child(3) { animation-delay: 160ms; }
}

/* HOT标签 - crimson红色 */
.product-card__badge--hot {
  background: var(--color-crimson-default, #DC2626);
  color: white;
}

/* NEW标签 - pine绿色 */
.product-card__badge--new {
  background: var(--color-pine-default, #16A34A);
  color: white;
}

/* 折扣标签 - gold金色 */
.product-card__badge--discount {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  color: white;
  font-weight: 700;
}

/* ============================================
   内容区域
   ============================================ */
.product-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex: 1;
}

/* 水平变体的内容区 */
.product-card--horizontal .product-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

/* 紧凑变体的内容区 */
.product-card--compact .product-card__content {
  gap: 6px;
  padding: 12px;
}

/* 特色变体的内容区 */
.product-card--featured .product-card__content {
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(217, 119, 6, 0.02) 100%);
  
  /* 装饰边框 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-primary-500, #000AB0), var(--color-gold-default, #D97706));
  }
}

/* ============================================
   商品名称
   ============================================ */
.product-card__name {
  margin: 0;
  font-size: 1.125rem; /* h4 层级 */
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary, #111827);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 200ms ease-out;
}

/* 紧凑变体名称 */
.product-card--compact .product-card__name {
  font-size: 0.875rem;
  -webkit-line-clamp: 1;
}

/* 水平变体名称 */
.product-card--horizontal .product-card__name {
  font-size: 1rem;
  -webkit-line-clamp: 2;
}

/* 特色变体名称 */
.product-card--featured .product-card__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  position: absolute;
  bottom: 60px;
  left: 20px;
  right: 20px;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* ============================================
   价格区域
   ============================================ */
.product-card__price-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

/* 现价样式 */
.product-card__current-price {
  font-size: 1.125rem; /* bodyLarge 层级 */
  font-weight: 700;
  color: var(--color-crimson-default, #DC2626);
  line-height: 1;
  
  .currency {
    font-size: 0.875rem;
    font-weight: 600;
    margin-right: 1px;
  }
}

/* 紧凑变体现价 */
.product-card--compact .product-card__current-price {
  font-size: 1rem;
}

/* 特色变体现价 */
.product-card--featured .product-card__current-price {
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  .currency {
    font-size: 1.125rem;
  }
}

/* 原价样式 */
.product-card__original-price {
  font-size: 0.875rem; /* overline 层级 */
  color: var(--color-text-quaternary, #9CA3AF);
  text-decoration: line-through;
  line-height: 1;
}

/* 省钱提示 */
.product-card__savings {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-pine-default, #16A34A);
  background: var(--color-pine-light, #DCFCE7);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
}

/* ============================================
   元数据（销量/评分）
   ============================================ */
.product-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem; /* overline 层级 */
  color: var(--color-text-tertiary, #6B7280);
}

/* 销量 */
.product-card__sales {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  .fire-icon {
    width: 14px;
    height: 14px;
    color: var(--color-crimson-default, #DC2626);
  }
}

/* 评分 */
.product-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  .stars {
    color: var(--color-warning-default, #CA8A04);
    font-size: 0.875rem;
  }
}

/* ============================================
   操作按钮区域
   ============================================ */
.product-card__actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  
  /* 默认隐藏，hover时显示 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 200ms ease-out;
}

/* 按钮通用样式 */
.product-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease-out;
  
  &:focus-visible {
    outline: 2px solid var(--color-primary-500, #000AB0);
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

/* 主按钮 - 加入购物车 */
.product-card__btn--primary {
  flex: 1;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary-500, #000AB0) 0%, var(--color-primary-400, #3B82F6) 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 10, 176, 0.2);
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--color-primary-600, #000880) 0%, var(--color-primary-500, #000AB0) 100%);
    box-shadow: 0 4px 12px rgba(0, 10, 176, 0.3);
    transform: translateY(-1px);
  }
}

/* 图标按钮 - 收藏 */
.product-card__btn--icon {
  width: 36px;
  height: 36px;
  padding: 0;
  background: white;
  border: 1px solid var(--color-border-default, #E5E7EB);
  border-radius: 8px;
  color: var(--color-text-secondary, #4B5563);
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    border-color: var(--color-crimson-light, #FEE2E2);
    background: var(--color-crimson-bg, #FEF2F2);
    color: var(--color-crimson-default, #DC2626);
  }
  
  &.is-favorite {
    background: var(--color-crimson-bg, #FEF2F2);
    border-color: var(--color-crimson-default, #DC2626);
    color: var(--color-crimson-default, #DC2626);
  }
}

/* 底部插槽区域 */
.product-card__footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-subtle, #F3F4F6);
}

/* ============================================
   响应式适配
   ============================================ */

/* 移动端 (< 640px) */
@media (max-width: 639px) {
  .product-card--compact {
    /* 小屏幕自动启用紧凑模式的一些特性 */
    .product-card__content {
      padding: 10px;
      gap: 4px;
    }
    
    .product-card__name {
      font-size: 0.8125rem;
    }
    
    .product-card__current-price {
      font-size: 0.9375rem;
    }
  }
  
  /* 减小操作按钮尺寸 */
  .product-card__actions {
    gap: 6px;
  }
  
  .product-card__btn--primary {
    padding: 6px 12px;
    font-size: 0.8125rem;
  }
  
  .product-card__btn--icon {
    width: 32px;
    height: 32px;
  }
}

/* 平板 (640px - 767px) */
@media (min-width: 640px) and (max-width: 767px) {
  .product-card__content {
    padding: 14px;
  }
}

/* 中等屏幕 (768px - 1023px) - 保持默认样式 */

/* 大屏 (1024px+) - 保持默认样式 */

/* 超大屏 (1280px+) - 可选紧凑布局 */
@media (min-width: 1280px) {
  .product-card--compact .product-card__meta {
    display: none; /* 隐藏次要信息 */
  }
}

/* ============================================
   触摸设备优化
   ============================================ */
@media (hover: none) and (pointer: coarse) {
  .product-card--clickable:active {
    background: var(--color-primary-25, #EFF4FF);
  }
  
  /* 触摸设备始终显示操作按钮 */
  .product-card__actions {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

/* ============================================
   减少动效偏好（无障碍）
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: none;
  }
  
  .product-card__image {
    transition: none;
  }
  
  .product-card__badge {
    animation: none;
  }
  
  .product-card__skeleton {
    animation: none;
  }
}
</style>
