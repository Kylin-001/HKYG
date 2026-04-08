<template>
  <div v-if="error" class="error-boundary" role="alert">
    <div class="error-boundary__container">
      <div class="error-boundary__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 7v6M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <h2 class="error-boundary__title">{{ title }}</h2>
      <p class="error-boundary__message">{{ message }}</p>

      <div v-if="showDetails && errorDetails" class="error-boundary__details">
        <button
          type="button"
          class="error-boundary__toggle"
          @click="toggleDetails"
          :aria-expanded="showErrorInfo"
        >
          {{ showErrorInfo ? '隐藏错误详情' : '显示错误详情' }}
          <span class="error-boundary__toggle-icon" :class="{ 'is-open': showErrorInfo }">▼</span>
        </button>
        <transition name="slide">
          <pre v-show="showErrorInfo" class="error-boundary__stack">{{ errorDetails }}</pre>
        </transition>
      </div>

      <div class="error-boundary__actions">
        <el-button type="primary" @click="handleRetry" :loading="retrying">
          <template #icon><RefreshRight /></template>
          {{ retryText }}
        </el-button>
        <el-button @click="handleGoHome">
          <template #icon><HomeFilled /></template>
          返回首页
        </el-button>
      </div>

      <p v-if="supportContact" class="error-boundary__contact">
        问题持续存在？请联系：<a :href="'mailto:' + supportContact">{{ supportContact }}</a>
      </p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshRight, HomeFilled } from '@element-plus/icons-vue'

interface Props {
  fallbackTitle?: string
  fallbackMessage?: string
  showDetails?: boolean
  supportContact?: string
  onRetry?: () => Promise<void> | void
  onError?: (error: Error, instance: ComponentPublicInstance | null, info: string) => void
  maxRetries?: number
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: '页面出现了一些问题',
  fallbackMessage: '抱歉，该部分内容加载失败。您可以尝试刷新或返回首页。',
  showDetails: import.meta.env.DEV,
  supportContact: '',
  maxRetries: 3
})

const emit = defineEmits<{
  (e: 'error', error: Error, info: string): void
  (e: 'reset'): void
}>()

const router = useRouter()
const error = ref<Error | null>(null)
const errorInfo = ref('')
const retrying = ref(false)
const retryCount = ref(0)
const showErrorInfo = ref(false)

const title = computed(() => props.fallbackTitle)
const message = computed(() => props.fallbackMessage)

const errorDetails = computed(() => {
  if (!error.value) return ''
  return [
    `错误类型: ${error.value.name}`,
    `错误消息: ${error.value.message}`,
    error.value.stack || '',
    `组件信息: ${errorInfo.value}`
  ].filter(Boolean).join('\n')
})

onErrorCaptured((err: Error, instance: ComponentPublicInstance | null, info: string) => {
  error.value = err
  errorInfo.value = info

  console.error('[ErrorBoundary]', err)
  console.error('[ErrorBoundary] Component:', info)

  props.onError?.(err, instance, info)
  emit('error', err, info)

  return false
})

function toggleDetails(): void {
  showErrorInfo.value = !showErrorInfo.value
}

const retryText = computed(() => retryCount.value > 0 ? `重试 (${retryCount.value}/${props.maxRetries})` : '重新加载')

async function handleRetry(): Promise<void> {
  if (retryCount.value >= props.maxRetries) return

  retrying.value = true
  retryCount.value++

  try {
    if (props.onRetry) {
      await props.onRetry()
    }
    reset()
  } catch (retryError) {
    console.error('[ErrorBoundary] Retry failed:', retryError)
    error.value = retryError as Error
  } finally {
    retrying.value = false
  }
}

function handleGoHome(): void {
  router.push('/')
}

function reset(): void {
  error.value = null
  errorInfo.value = ''
  retryCount.value = 0
  showErrorInfo.value = false
  emit('reset')
}

defineExpose({ reset })
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
}

.error-boundary__container {
  max-width: 480px;
  width: 100%;
}

.error-boundary__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: var(--el-color-danger);
  animation: shake 0.6s ease-in-out;
}

.error-boundary__icon svg {
  width: 100%;
  height: 100%;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
}

.error-boundary__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 0.75rem;
}

.error-boundary__message {
  font-size: 0.9375rem;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.error-boundary__details {
  margin-bottom: 1.5rem;
  text-align: left;
}

.error-boundary__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: var(--el-fill-color-light);
  border: none;
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
}

.error-boundary__toggle:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}

.error-boundary__toggle-icon {
  font-size: 0.75rem;
  transition: transform 0.2s;
}

.error-boundary__toggle-icon.is-open {
  transform: rotate(180deg);
}

.error-boundary__stack {
  margin-top: 0.75rem;
  padding: 1rem;
  background: var(--el-fill-color-darker);
  border-radius: var(--el-border-radius-base);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--el-text-color-regular);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow-y: auto;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.error-boundary__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.error-boundary__contact {
  font-size: 0.8125rem;
  color: var(--el-text-color-placeholder);
}

.error-boundary__contact a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.error-boundary__contact a:hover {
  text-decoration: underline;
}
</style>
