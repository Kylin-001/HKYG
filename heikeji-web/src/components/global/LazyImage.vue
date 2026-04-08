<template>
  <div
    ref="containerRef"
    class="lazy-image-wrapper"
    :class="[
      { 'lazy-image--loaded': isLoaded },
      { 'lazy-image--error': hasError },
      { 'lazy-image--loading': isLoading },
      `lazy-image--${fit}`,
    ]"
    :style="wrapperStyle"
  >
    <!-- 加载中状态 -->
    <div v-if="isLoading && !isLoaded" class="lazy-image__placeholder">
      <slot name="placeholder">
        <div class="lazy-image__skeleton" :style="skeletonStyle">
          <svg
            v-if="showPlaceholderIcon"
            class="lazy-image__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </slot>
      <slot name="loading">
        <div v-if="showLoadingSpinner" class="lazy-image__spinner"></div>
      </slot>
    </div>

    <!-- 实际图片 -->
    <img
      v-show="isLoaded || (src && !hasError)"
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      :loading="nativeLazy ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误状态 -->
    <div v-if="hasError && errorSlotUsed" class="lazy-image__error">
      <slot name="error">
        <div class="lazy-image__error-content">
          <svg
            class="lazy-image__error-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            stroke-width="1.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span class="lazy-image__error-text">图片加载失败</span>
        </div>
      </slot>
    </div>

    <!-- 渐变遮罩（可选） -->
    <div v-if="fadeEffect && !isLoaded && !hasError" class="lazy-image__fade-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  type CSSProperties,
} from 'vue'
import { checkWebPSupport, convertToWebp } from '@/directives/lazyLoad'

export interface LazyImageProps {
  /** 图片地址 */
  src?: string
  /** 替代文本 */
  alt?: string
  /** 宽度 */
  width?: number | string
  /** 高度 */
  height?: number | string
  /** 填充模式 */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  /** 占位图URL（支持data URI） */
  placeholder?: string
  /** 错误时的替代图 */
  errorSrc?: string
  /** 是否使用原生懒加载 */
  nativeLazy?: boolean
  /** 是否启用WebP格式转换 */
  enableWebp?: boolean
  /** IntersectionObserver阈值 */
  threshold?: number
  /** rootMargin偏移 */
  rootMargin?: string
  /** 是否显示加载动画 */
  showLoadingSpinner?: boolean
  /** 是否显示占位图标 */
  showPlaceholderIcon?: boolean
  /** 是否启用渐变效果 */
  fadeEffect?: boolean
  /** 自定义CSS类名 */
  class?: string
  /** 圆角 */
  radius?: number | string
  /** 对象位置 */
  objectPosition?: string
  /** 重试次数 */
  retryCount?: number
  /** 重试延迟(ms) */
  retryDelay?: number
}

const props = withDefaults(defineProps<LazyImageProps>(), {
  alt: '',
  fit: 'cover',
  placeholder: undefined,
  errorSrc: undefined,
  nativeLazy: false,
  enableWebp: true,
  threshold: 0.1,
  rootMargin: '50px',
  showLoadingSpinner: false,
  showPlaceholderIcon: true,
  fadeEffect: true,
  radius: 8,
  objectPosition: 'center',
  retryCount: 2,
  retryDelay: 1000,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  [key: string]: any[]
}>()

// 状态管理
const containerRef = ref<HTMLElement>()
const imgRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)
const isLoading = ref(true)
const currentSrc = ref('')
const isInView = ref(false)
let observer: IntersectionObserver | null = null
let retryAttempts = 0
let retryTimer: ReturnType<typeof setTimeout> | null = null

// 计算属性
const wrapperStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  style.borderRadius = typeof props.radius === 'number' ? `${props.radius}px` : props.radius

  return style
})

const skeletonStyle = computed<CSSProperties>(() => ({
  backgroundImage: props.placeholder
    ? `url(${props.placeholder})`
    : undefined,
}))

const imageClass = computed(() => ['lazy-image__img', props.class])

const imageStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit,
  objectPosition: props.objectPosition,
  opacity: isLoaded.value || hasError.value ? 1 : 0,
  transition: props.fadeEffect ? 'opacity 0.3s ease-in-out' : 'none',
}))

const errorSlotUsed = computed(() => !!useSlots().error)

// 默认错误占位图
const DEFAULT_ERROR_SRC = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E`

/**
 * 处理图片加载成功
 */
function handleLoad(event: Event) {
  isLoaded.value = true
  hasError.value = false
  isLoading.value = false
  emit('load', event)
}

/**
 * 处理图片加载失败
 */
function handleError(event: Event) {
  // 如果还有重试机会，尝试重试
  if (retryAttempts < props.retryCount) {
    retryAttempts++
    console.warn(`[LazyImage] Load failed, retrying (${retryAttempts}/${props.retryCount})...`)

    retryTimer = setTimeout(() => {
      if (imgRef.value && currentSrc.value) {
        imgRef.value.src = currentSrc.value
      }
    }, props.retryDelay)

    return
  }

  // 所有重试都失败了
  hasError.value = true
  isLoading.value = false

  // 显示错误占位图
  if (props.errorSrc || DEFAULT_ERROR_SRC) {
    currentSrc.value = props.errorSrc || DEFAULT_ERROR_SRC
  }

  emit('error', event)
}

/**
 * 加载图片
 */
async function loadImage() {
  if (!props.src) {
    isLoading.value = false
    return
  }

  let finalSrc = props.src

  // WebP 转换
  if (props.enableWebp) {
    try {
      const webpSupported = await checkWebPSupport()
      if (webpSupported) {
        finalSrc = convertToWebp(props.src)
      }
    } catch (e) {
      console.warn('[LazyImage] WebP detection failed:', e)
    }
  }

  currentSrc.value = finalSrc
  isInView.value = true
}

/**
 * 设置IntersectionObserver
 */
function setupObserver() {
  if (!containerRef.value) return

  // 如果已经可见或使用原生懒加载，直接加载
  if (props.nativeLazy || !('IntersectionObserver' in window)) {
    loadImage()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin,
    }
  )

  observer.observe(containerRef.value)
}

/**
 * 清理资源
 */
function cleanup() {
  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
}

// 监听src变化
watch(
  () => props.src,
  () => {
    isLoaded.value = false
    hasError.value = false
    isLoading.value = true
    retryAttempts = 0

    cleanup()

    if (isInView.value || props.nativeLazy) {
      loadImage()
    } else {
      setupObserver()
    }
  }
)

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  cleanup()
})

// 暴露方法供外部调用
defineExpose({
  reload: () => {
    isLoaded.value = false
    hasError.value = false
    isLoading.value = true
    retryAttempts = 0
    cleanup()
    setupObserver()
  },
  isLoaded,
  hasError,
  isLoading,
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  background-color: #f3f4f6;
}

.lazy-image__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.lazy-image__skeleton {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.lazy-image__icon {
  color: #d1d5db;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.lazy-image__spinner {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

.lazy-image__img {
  width: 100%;
  height: 100%;
  display: block;
}

.lazy-image__error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.lazy-image__error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.lazy-image__fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.3)
  );
  pointer-events: none;
  animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

/* 填充模式变体 */
.lazy-image--cover .lazy-image__img {
  object-fit: cover;
}

.lazy-image--contain .lazy-image__img {
  object-fit: contain;
}

.lazy-image--fill .lazy-image__img {
  object-fit: fill;
}

.lazy-image--none .lazy-image__img {
  object-fit: none;
}
</style>
