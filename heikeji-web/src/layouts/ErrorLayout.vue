<template>
  <ErrorBoundary
    :fallback-title="errorConfig.title"
    :fallback-message="errorConfig.message"
    :show-details="isDev"
    :on-retry="handleRetry"
    @error="handleError"
  >
    <slot />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorBoundary from '@/components/GlobalErrorBoundary.vue'

const route = useRoute()
const router = useRouter()
const isDev = import.meta.env.DEV

const lastError = ref<Error | null>(null)
const errorInfo = ref('')

const errorConfig = computed(() => {
  const pageName = (route.meta.title as string) || '当前页面'

  return {
    title: `${pageName}加载失败`,
    message: '抱歉，页面加载时出现了问题。您可以尝试刷新或返回首页。',
    retryText: `重新加载${pageName}`
  }
})

onErrorCaptured((err: Error, instance, info) => {
  lastError.value = err
  errorInfo.value = info

  console.error('[AppLayout] Error captured:', {
    error: err,
    info,
    route: route.path,
    component: instance?.$options?.name || 'Unknown'
  })

  if (window.__VUE_APP_ERROR_HANDLER__) {
    window.__VUE_APP_ERROR_HANDLER__({
      error: err,
      info,
      route: route.path,
      timestamp: Date.now()
    })
  }

  return false
})

function handleError(error: Error, info: string): void {
  console.warn('[AppLayout] ErrorBoundary reported:', { error, info })

  if (import.meta.env.PROD && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      const payload = JSON.stringify({
        type: 'component_error',
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        info,
        route: route.path,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })

      navigator.sendBeacon('/api/errors', payload)
    } catch {
      console.error('[AppLayout] Failed to report error')
    }
  }
}

async function handleRetry(): Promise<void> {
  console.log('[AppLayout] Retrying...')

  const currentPath = route.path
  const query = { ...route.query, _t: Date.now() }

  try {
    await router.replace({ path: currentPath, query })
  } catch (error) {
    console.error('[AppLayout] Retry failed:', error)

    await router.push('/')
  }
}

defineExpose({
  lastError,
  errorInfo,
  handleRetry
})
</script>
