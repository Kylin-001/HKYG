<!--
@fileoverview 图片懒加载组件
@description 支持图片懒加载、占位符、加载状态和错误处理
@example
  <LazyImage
    :src="imageUrl"
    :alt="imageAlt"
    :placeholder="placeholderUrl"
    @load="handleImageLoad"
    @error="handleImageError"
  />
-->
<template>
  <div
    class="lazy-image"
    :class="{ loading: isLoading, error: hasError, loaded: isLoaded }"
    :style="containerStyle"
  >
    <!-- 占位符 -->
    <div v-if="placeholder || !isLoaded" class="lazy-image-placeholder" :style="placeholderStyle">
      <div v-if="showLoading && isLoading" class="loading-indicator">
        <el-icon :size="loadingSize" :class="{ spinning: true }"><Loading /></el-icon>
        <span v-if="showProgress" class="loading-progress">{{ loadingProgress }}%</span>
      </div>
      <div v-else-if="hasError" class="error-indicator" @click="reload">
        <el-icon :size="errorSize"><PictureRounded /></el-icon>
        <div v-if="showRetryButton" class="retry-button">
          <el-button type="primary" size="small">重试</el-button>
        </div>
      </div>
      <img
        v-else-if="typeof placeholder === 'string'"
        :src="placeholder"
        :alt="alt || 'placeholder'"
        class="placeholder-image"
      />
      <div v-else class="default-placeholder">
        <el-icon :size="48"><PictureRounded /></el-icon>
      </div>
    </div>

    <!-- 实际图片 -->
    <img
      ref="imageRef"
      :src="imageSrc"
      :alt="alt"
      :class="['lazy-image-real', imageClass]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Loading, PictureRounded } from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps<{
  // 图片地址
  src: string
  // 图片替代文本
  alt?: string
  // 占位符（可以是图片地址或自定义元素）
  placeholder?: string | boolean
  // 是否显示加载动画
  showLoading?: boolean
  // 加载动画大小
  loadingSize?: number
  // 错误图标大小
  errorSize?: number
  // 是否显示加载进度
  showProgress?: boolean
  // 是否显示重试按钮
  showRetryButton?: boolean
  // 图片容器类名
  containerClass?: string
  // 图片类名
  imageClass?: string
  // 图片容器样式
  containerStyle?: Record<string, any>
  // 图片样式
  imageStyle?: Record<string, any>
  // 占位符样式
  placeholderStyle?: Record<string, any>
  // 延迟加载时间（毫秒）
  delay?: number
  // 是否立即加载
  immediate?: boolean
  // 图片加载完成后的回调
  onLoad?: (event: Event) => void
  // 图片加载失败后的回调
  onError?: (event: Event) => void
  // 图片加载重试次数
  retryCount?: number
}>()

// 定义默认值
const defaultProps = {
  alt: '',
  placeholder: true,
  showLoading: true,
  loadingSize: 24,
  errorSize: 24,
  showProgress: false,
  showRetryButton: false,
  delay: 0,
  immediate: false,
  retryCount: 0,
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 定义事件
const emit = defineEmits<{
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
  (e: 'load-start'): void
}>()

// 响应式数据
const imageRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const imageSrc = ref('')
const observer = ref<IntersectionObserver | null>(null)
const loadingProgress = ref(0)
const retryCount = ref(0)
const loadStartTime = ref(0)

// 计算属性
const isVisible = ref(false)

// 重置图片状态
const resetImage = () => {
  isLoading.value = false
  isLoaded.value = false
  hasError.value = false
  imageSrc.value = ''
  loadingProgress.value = 0
  retryCount.value = 0
  loadStartTime.value = 0
}

// 加载图片
const loadImage = () => {
  if (!mergedProps.src || isLoading.value || isLoaded.value) {
    return
  }

  isLoading.value = true
  hasError.value = false
  loadingProgress.value = 0
  loadStartTime.value = Date.now()
  emit('load-start')

  // 延迟加载
  setTimeout(() => {
    // 使用XMLHttpRequest监控加载进度
    if (mergedProps.showProgress) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', mergedProps.src)
      xhr.responseType = 'blob'

      xhr.onprogress = event => {
        if (event.lengthComputable) {
          loadingProgress.value = Math.round((event.loaded / event.total) * 100)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blobUrl = URL.createObjectURL(xhr.response)
          imageSrc.value = blobUrl
        } else {
          handleError(new Event('error'))
        }
      }

      xhr.onerror = () => {
        handleError(new Event('error'))
      }

      xhr.send()
    } else {
      // 普通加载方式
      imageSrc.value = mergedProps.src
    }
  }, mergedProps.delay)
}

// 处理图片加载完成
const handleLoad = (event: Event) => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
  props.onLoad?.(event)
}

// 处理图片加载错误
const handleError = (event: Event) => {
  isLoading.value = false
  isLoaded.value = false
  hasError.value = true
  emit('error', event)
  props.onError?.(event)

  // 自动重试机制
  if (retryCount.value < mergedProps.retryCount) {
    retryCount.value++
    // 延迟重试，每次重试间隔增加
    const retryDelay = 1000 * Math.pow(2, retryCount.value)
    setTimeout(() => {
      loadImage()
    }, retryDelay)
  }
}

// 重新加载图片
const reload = () => {
  resetImage()
  loadImage()
}

// 初始化交叉观察器
const initIntersectionObserver = () => {
  if (!('IntersectionObserver' in window)) {
    // 不支持 IntersectionObserver，直接加载图片
    loadImage()
    return
  }

  observer.value = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          loadImage()
          observer.value?.disconnect()
        }
      })
    },
    {
      rootMargin: '50px', // 提前50px开始加载
      threshold: 0.01, // 只要有1%可见就开始加载
    }
  )

  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
}

// 监听图片地址变化
watch(
  () => props.src,
  newSrc => {
    resetImage()
    if (newSrc) {
      if (mergedProps.immediate || isVisible.value) {
        loadImage()
      }
    }
  },
  { immediate: true }
)

// 生命周期钩子
onMounted(() => {
  if (mergedProps.src) {
    if (mergedProps.immediate) {
      loadImage()
    } else {
      initIntersectionObserver()
    }
  }
})

// 暴露公共方法
defineExpose({
  reload,
  loadImage,
  resetImage,
})
</script>

<style lang="scss" scoped>
.lazy-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s ease;
  line-height: 0;

  &.loading {
    opacity: 0.8;
  }

  &.error {
    background-color: #fef0f0;
  }

  &.loaded {
    opacity: 1;
  }

  // 占位符
  .lazy-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    transition: opacity 0.3s ease;
    z-index: 1;

    .loading-indicator,
    .error-indicator,
    .default-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;
      gap: 8px;
    }

    .loading-indicator {
      .spinning {
        animation: spin 1s linear infinite;
      }

      .loading-progress {
        font-size: 12px;
        color: #606266;
        font-weight: 500;
      }
    }

    .error-indicator {
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #409eff;
      }

      .retry-button {
        margin-top: 8px;
      }
    }

    .placeholder-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }
  }

  // 实际图片
  .lazy-image-real {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
    opacity: 0;

    .loaded & {
      opacity: 1;
    }
  }
}

// 旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
