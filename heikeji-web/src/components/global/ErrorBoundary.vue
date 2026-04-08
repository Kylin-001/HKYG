<script setup lang="ts">
import { ref, onErrorCaptured, type ErrorCaptured } from 'vue'

interface Props {
  /** 自定义错误提示 */
  fallback?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 是否显示错误详情 (开发环境) */
  showErrorDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '页面出现了一些问题',
  showRetry: true,
  showErrorDetails: import.meta.env.DEV,
})

const emit = defineEmits<{
  error: [error: Error, instance: any, info: string]
  retry: []
}>()

const hasError = ref(false)
const error = ref<Error | null>(null)
const errorInfo = ref('')
const errorId = ref(Date.now())

onErrorCaptured((err: ErrorCaptured, instance, info) => {
  console.error('[ErrorBoundary] Captured error:', err, info)

  error.value = err instanceof Error ? err : new Error(String(err))
  errorInfo.value = info
  hasError.value = true
  errorId.value = Date.now()

  emit('error', error.value, instance, info)

  // 阻止错误继续向上传播
  return false
})

function handleRetry() {
  hasError.value = false
  error.value = null
  errorInfo.value = ''
  
  emit('retry')
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__container">
      <!-- 错误图标 -->
      <div class="error-boundary__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <!-- 错误标题 -->
      <h3 class="error-boundary__title">{{ fallback }}</h3>

      <!-- 错误信息 -->
      <p v-if="error?.message" class="error-boundary__message">
        {{ error.message }}
      </p>

      <!-- 错误详情 (开发环境) -->
      <details v-if="showErrorDetails && errorInfo" class="error-boundary__details">
        <summary>技术详情</summary>
        <pre class="error-boundary__stack">{{ error?.stack }}</pre>
        <code class="error-boundary__info">{{ errorInfo }}</code>
      </details>

      <!-- 操作按钮 -->
      <div class="error-boundary__actions">
        <button 
          v-if="showRetry"
          @click="handleRetry"
          class="error-boundary__btn error-boundary__btn--primary"
        >
          重试
        </button>
        <button 
          @click="$router.push('/')"
          class="error-boundary__btn error-boundary__btn--secondary"
        >
          返回首页
        </button>
      </div>

      <!-- 错误ID (用于反馈) -->
      <p v-if="showErrorDetails" class="error-boundary__id">
        错误ID: {{ errorId }}
      </p>
    </div>
  </div>

  <slot v-else />
</template>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fef3f3 0%, #fff5f5 100%);
  border-radius: var(--radius-xl);
  margin: 20px;
}

.error-boundary__container {
  max-width: 480px;
  text-align: center;
}

.error-boundary__icon {
  color: #ef4444;
  margin-bottom: 20px;
  animation: shake 0.6s ease-in-out;
}

.error-boundary__title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.error-boundary__message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.error-boundary__details {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: left;
  margin-bottom: 20px;
}

.error-boundary__details summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  user-select: none;
}

.error-boundary__stack {
  font-family: monospace;
  font-size: 11px;
  color: #dc2626;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
}

.error-boundary__info {
  display: block;
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.error-boundary__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-boundary__btn {
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.error-boundary__btn--primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.error-boundary__btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
}

.error-boundary__btn--secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.error-boundary__btn--secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.error-boundary__id {
  margin-top: 20px;
  font-size: 12px;
  color: #9ca3af;
  font-family: monospace;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 640px) {
  .error-boundary {
    margin: 10px;
    padding: 30px 15px;
  }

  .error-boundary__icon svg {
    width: 48px;
    height: 48px;
  }

  .error-boundary__title {
    font-size: 18px;
  }

  .error-boundary__btn {
    width: 100%;
  }
}
</style>
