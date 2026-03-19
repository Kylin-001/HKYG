<template>
  <div
    ref="containerRef"
    class="lazy-image-container"
    :class="{ 'is-loaded': isLoaded, 'is-error': isError }"
    :style="containerStyle"
    @click="handleClick"
  >
    <img
      v-if="isInView"
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :class="['lazy-image', { 'is-blur': blurLoad }]"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-else class="lazy-image-placeholder" :style="placeholderStyle">
      <img v-if="placeholder" :src="placeholder" class="placeholder-img" />
      <div v-else class="placeholder-loading">
        <slot name="placeholder">
          <div class="default-placeholder">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
        </slot>
      </div>
    </div>
    <div v-if="isError && showError" class="lazy-image-error">
      <slot name="error">
        <div class="error-content">
          <el-icon><PictureFilled /></el-icon>
          <span>加载失败</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Loading, PictureFilled } from '@element-plus/icons-vue'

interface Props {
  src: string
  alt?: string
  lazy?: boolean
  placeholder?: string
  errorSrc?: string
  showError?: boolean
  blurLoad?: boolean
  rootMargin?: string
  threshold?: number | number[]
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  width?: string | number
  height?: string | number
  radius?: string | number
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazy: true,
  placeholder: '',
  errorSrc: '',
  showError: true,
  blurLoad: true,
  rootMargin: '50px',
  threshold: 0,
  fit: 'cover',
  width: '100%',
  height: 'auto',
  radius: 0,
  clickable: false,
})

const emit = defineEmits<{
  load: []
  error: [e: Event]
  click: [e: Event]
}>()

const containerRef = ref<HTMLElement>()
const imgRef = ref<HTMLImageElement>()
const isInView = ref(!props.lazy)
const isLoaded = ref(false)
const isError = ref(false)
const hasReportedView = ref(false)

const currentSrc = computed(() => {
  if (isError.value && props.errorSrc) {
    return props.errorSrc
  }
  return props.src
})

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  borderRadius: typeof props.radius === 'number' ? `${props.radius}px` : props.radius,
  cursor: props.clickable ? 'pointer' : 'default',
}))

const placeholderStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))

let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (!props.lazy || !containerRef.value) return

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isInView.value = true
          if (!hasReportedView.value) {
            hasReportedView.value = true
          }
          observer?.disconnect()
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    }
  )

  observer.observe(containerRef.value)
}

const handleLoad = () => {
  isLoaded.value = true
  isError.value = false
  emit('load')
}

const handleError = (e: Event) => {
  isError.value = true
  isLoaded.value = false
  emit('error', e)
}

const handleClick = (e: Event) => {
  if (props.clickable) {
    emit('click', e)
  }
}

watch(
  () => props.src,
  () => {
    isLoaded.value = false
    isError.value = false
    if (!props.lazy) {
      isInView.value = true
    }
  }
)

onMounted(() => {
  if (props.lazy) {
    initObserver()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

defineExpose({
  reload: () => {
    isInView.value = props.lazy
    isLoaded.value = false
    isError.value = false
    if (props.lazy) {
      initObserver()
    }
  },
})
</script>

<style scoped lang="scss">
.lazy-image-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
  background-color: #f5f7fa;

  &.is-loaded {
    .lazy-image {
      opacity: 1;
    }
  }

  &.is-error {
    .lazy-image {
      display: none;
    }
  }

  .lazy-image {
    width: 100%;
    height: 100%;
    object-fit: v-bind(fit);
    opacity: 0;
    transition: opacity 0.3s ease;

    &.is-blur {
      filter: blur(10px);
      transform: scale(1.1);
    }
  }

  &.is-loaded .lazy-image.is-blur {
    filter: blur(0);
    transform: scale(1);
  }

  .lazy-image-placeholder,
  .lazy-image-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-img {
    width: 100%;
    height: 100%;
    object-fit: v-bind(fit);
  }

  .placeholder-loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;

    .default-placeholder {
      .el-icon {
        font-size: 24px;
        color: #c0c4cc;
      }
    }
  }

  .lazy-image-error {
    background-color: #f5f7fa;

    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #909399;

      .el-icon {
        font-size: 32px;
      }

      span {
        font-size: 12px;
      }
    }
  }
}
</style>
