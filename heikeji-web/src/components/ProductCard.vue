<script setup lang="ts">
/**
 * ProductCard 商品卡片组件 v4.0 - Modern Design
 * 现代化电商风格商品卡片，支持多种布局变体
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  isDiscount?: string
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
const isHovered = ref(false)

// ====== 计算属性 ======
const discountPercentage = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice <= props.product.price) {
    return 0
  }
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})

const savingsAmount = computed(() => {
  if (!props.product.originalPrice || !props.product.price || props.product.originalPrice <= props.product.price) {
    return 0
  }
  return props.product.originalPrice - props.product.price
})

const hasBadge = computed(() => {
  return props.product.isHot || props.product.isNew || props.product.isDiscount || discountPercentage.value > 0
})

// ====== 工具函数 ======
function formatPrice(price: number | undefined): string {
  return (price ?? 0).toFixed(2)
}

function formatSales(sales: number | undefined): string {
  const s = sales ?? 0
  if (s >= 10000) {
    return `${(s / 10000).toFixed(1)}万`
  }
  return s.toString()
}

// ====== 事件处理 ======
function handleCardClick(): void {
  if (!props.clickable) return
  emit('click', props.product)
  if (props.href) {
    router.push(props.href)
  } else {
    router.push(`/products/${props.product.id}`)
  }
}

function handleAddToCart(event: Event): void {
  event.stopPropagation()
  emit('addToCart', props.product)
}

function handleFavorite(event: Event): void {
  event.stopPropagation()
  isFavorite.value = !isFavorite.value
  emit('favorite', props.product, isFavorite.value)
}

function handleImageLoad(): void {
  imageLoaded.value = true
  imageError.value = false
}

function handleImageError(event: Event): void {
  imageLoaded.value = false
  imageError.value = true
  const error = new Error(`图片加载失败: ${props.product.image}`)
  emit('imageError', error)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleCardClick()
  }
}
</script>

<template>
  <article
    :class="[
      'product-card group relative',
      `product-card--${variant}`,
      {
        'cursor-pointer': clickable,
        'product-card--loaded': imageLoaded
      }
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="`查看商品：${product.name}`"
    @click="handleCardClick"
    @keydown="handleKeydown"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- ==================== 图片区域 ==================== -->
    <div class="product-card__media relative overflow-hidden bg-slate-100">
      <!-- 图片容器 -->
      <div class="product-card__image-wrapper w-full h-full">
        <!-- 加载骨架屏 -->
        <div 
          v-if="!imageLoaded && !imageError" 
          class="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer"
        ></div>
        
        <!-- 错误占位符 -->
        <div 
          v-if="imageError" 
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400"
        >
          <svg class="w-12 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm">图片加载失败</span>
        </div>
        
        <!-- 实际图片 -->
        <img
          v-show="imageLoaded"
          :src="product.image"
          :alt="product.name"
          :loading="lazyImage ? 'lazy' : 'eager'"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          :class="{ 'scale-105': isHovered && variant !== 'horizontal' }"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>

      <!-- 标签徽章系统 - 左上角 -->
      <div v-if="hasBadge" class="absolute top-3 left-3 flex flex-col gap-2 z-10">
        <!-- HOT标签 -->
        <span 
          v-if="product.isHot" 
          class="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-rose-500/30"
        >
          HOT
        </span>
        
        <!-- NEW标签 -->
        <span 
          v-if="product.isNew" 
          class="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-emerald-500/30"
        >
          NEW
        </span>
        
        <!-- 折扣标签 -->
        <span 
          v-if="product.isDiscount || discountPercentage > 0" 
          class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-amber-500/30"
        >
          {{ product.isDiscount || `-${discountPercentage}%` }}
        </span>
      </div>

      <!-- 收藏按钮 - 右上角 -->
      <button
        :class="[
          'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10',
          isFavorite 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
            : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white shadow-md'
        ]"
        @click="handleFavorite"
        :title="isFavorite ? '取消收藏' : '加入收藏'"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>

      <!-- 快速操作按钮 - 底部滑入 -->
      <div 
        v-if="showActions && variant !== 'horizontal'"
        class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
      >
        <button
          class="w-full py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-lg"
          @click="handleAddToCart"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          加入购物车
        </button>
      </div>
    </div>

    <!-- ==================== 内容区域 ==================== -->
    <div class="product-card__content flex flex-col p-4">
      <!-- 分类标签 -->
      <div v-if="product.category" class="mb-2">
        <span class="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
          {{ product.category }}
        </span>
      </div>

      <!-- 商品名称 -->
      <h4 
        class="font-semibold text-slate-900 leading-snug mb-2 transition-colors duration-200 group-hover:text-blue-600"
        :class="[
          variant === 'compact' ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'
        ]"
        :title="product.name"
      >
        {{ product.name }}
      </h4>

      <!-- 评分和销量 -->
      <div 
        v-if="(showSales && product.sales) || (showRating && product.rating)" 
        class="flex items-center gap-3 mb-2 text-xs text-slate-500"
      >
        <!-- 评分 -->
        <span v-if="showRating && product.rating" class="flex items-center gap-1">
          <span class="text-amber-400">★</span>
          <span class="font-medium text-slate-700">{{ product.rating.toFixed(1) }}</span>
        </span>
        
        <!-- 销量 -->
        <span v-if="showSales && product.sales" class="flex items-center gap-1">
          <svg v-if="product.isHot || product.sales > 1000" class="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-4.97 0-9-3.582-9-8 0-3.536 2.618-6.632 5.5-8.25.5-.278.987-.55 1.457-.82C11.967 4.68 13 3.85 13 2c0-.667.333-1 1-1 .667 0 1 .333 1 1 0 2.5-1.5 4-3 5.5-.5.5-.833 1.167-1 2-.167.833 0 1.667.5 2.5.5.833 1.333 1.5 2.5 2 1.167.5 2.333.75 3.5.75 1.167 0 2.083-.417 2.75-1.25.667-.833 1-1.917 1-3.25 0-1.333-.417-2.583-1.25-3.75C19.167 5.333 18 4.167 16.5 3c-.5-.417-.667-.833-.5-1.25.167-.417.5-.625 1-.625.5 0 1 .167 1.5.5 2 1.5 3.5 3.25 4.5 5.25s1.5 4.083 1.5 6.25c0 3.314-2.686 6-6 6z"/>
          </svg>
          已售{{ formatSales(product.sales) }}
        </span>
      </div>

      <!-- 价格区域 -->
      <div class="flex items-baseline gap-2 flex-wrap mt-auto">
        <!-- 现价 -->
        <span class="text-lg font-bold text-rose-600">
          <span class="text-sm">¥</span>{{ formatPrice(product.price) }}
        </span>
        
        <!-- 原价 -->
        <del v-if="product.originalPrice && product.originalPrice > product.price" 
             class="text-sm text-slate-400">
          ¥{{ formatPrice(product.originalPrice) }}
        </del>
        
        <!-- 节省标签 -->
        <span v-if="savingsAmount > 0" 
              class="ml-auto px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-full">
          省¥{{ formatPrice(savingsAmount) }}
        </span>
      </div>

      <!-- 水平布局的操作按钮 -->
      <div v-if="showActions && variant === 'horizontal'" class="flex gap-2 mt-3">
        <button
          class="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all duration-200"
          @click="handleAddToCart"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          加入购物车
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ============================================
   基础样式
   ============================================ */
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e1;
}

/* 可点击状态 */
.product-card[role="button"] {
  cursor: pointer;
}

.product-card[role="button"]:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.product-card[role="button"]:active {
  transform: scale(0.98);
}

/* ============================================
   变体样式
   ============================================ */

/* 默认变体 */
.product-card--default {
  .product-card__media {
    aspect-ratio: 1 / 1;
  }
}

/* 水平变体 */
.product-card--horizontal {
  flex-direction: row;
  
  .product-card__media {
    width: 140px;
    min-width: 140px;
    aspect-ratio: 1 / 1;
  }
  
  .product-card__content {
    flex: 1;
    justify-content: center;
  }
}

/* 紧凑变体 */
.product-card--compact {
  .product-card__media {
    aspect-ratio: 4 / 3;
  }
  
  .product-card__content {
    padding: 12px;
  }
}

/* 特色推荐变体 */
.product-card--featured {
  .product-card__media {
    aspect-ratio: 16 / 10;
  }
  
  .product-card__content {
    padding: 20px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(217, 119, 6, 0.02) 100%);
  }
}

/* ============================================
   图片区域
   ============================================ */
.product-card__media {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

/* 骨架屏动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

/* ============================================
   响应式适配
   ============================================ */
@media (max-width: 639px) {
  .product-card--horizontal {
    .product-card__media {
      width: 100px;
      min-width: 100px;
    }
  }
  
  .product-card__content {
    padding: 12px;
  }
}

/* ============================================
   减少动画偏好
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: none;
  }
  
  .animate-shimmer {
    animation: none;
  }
  
  .product-card img {
    transition: none;
  }
}

/* ============================================
   触摸设备优化
   ============================================ */
@media (hover: none) and (pointer: coarse) {
  .product-card:active {
    background: #f8fafc;
  }
  
  /* 触摸设备始终显示操作按钮 */
  .product-card .absolute.bottom-0 {
    transform: translateY(0);
  }
}
</style>
