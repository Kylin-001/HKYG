<template>
  <Transition name="offline-banner">
    <div
      v-if="isOffline"
      :class="['offline-banner', `offline-banner--${position}`, { 'offline-banner--visible': isVisible }]"
      role="alert"
      aria-live="assertive"
      aria-label="离线模式通知"
    >
      <div class="offline-banner__container">
        <!-- Icon -->
        <div class="offline-banner__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H13V18H11V16ZM13 14H11V6H13V14Z" fill="currentColor"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="offline-banner__content">
          <p class="offline-banner__title">{{ t('offline.title') || '您当前处于离线模式' }}</p>
          <p class="offline-banner__message">
            {{ t('offline.message') || '部分功能可能不可用，网络恢复后将自动重连' }}
          </p>
        </div>

        <!-- Cache Info (optional) -->
        <div v-if="showCacheInfo && cacheSize > 0" class="offline-banner__cache-info">
          <span class="cache-size">{{ formatCacheSize(cacheSize) }}</span>
          <span class="cache-label">{{ t('offline.cached') || '已缓存' }}</span>
        </div>

        <!-- Retry Button -->
        <button
          @click="handleRetry"
          class="offline-banner__retry-btn"
          :aria-label="t('offline.retry') || '重试连接'"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="{ 'spinning': isRetrying }">
            <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25 4 6.84 5.39 5.42 7.5M5.42 7.5V3M5.42 7.5H9.92"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ isRetrying ? (t('offline.retrying') || '连接中...') : (t('offline.retry') || '重试连接') }}
        </button>

        <!-- Close Button (optional) -->
        <button
          v-if="dismissible"
          @click="dismiss"
          class="offline-banner__close"
          :aria-label="t('common.close') || '关闭'"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isOnline, addOnlineStatusListener, getCacheInfo } from '@/utils/pwaHelper'

// Props
interface Props {
  /** Banner position: 'top' or 'bottom' */
  position?: 'top' | 'bottom'
  /** Show cache size information */
  showCacheInfo?: boolean
  /** Allow user to dismiss the banner */
  dismissible?: boolean
  /** Auto-hide delay in milliseconds after coming back online (0 = no auto-hide) */
  autoHideDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  showCacheInfo: true,
  dismissible: true,
  autoHideDelay: 3000
})

// Emits
const emit = defineEmits<{
  (e: 'online'): void
  (e: 'offline'): void
  (e: 'retry'): void
  (e: 'dismiss'): void
}>()

const { t } = useI18n()

// State
const isOffline = ref(!navigator.onLine)
const isVisible = ref(false)
const isRetrying = ref(false)
const cacheSize = ref(0)

let unsubscribeOnlineStatus: (() => void) | null = null
let autoHideTimer: ReturnType<typeof setTimeout> | null = null

// Computed
const formatCacheSize = computed(() => {
  return (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`
    }
    return `${(sizeInKB / 1024).toFixed(1)} MB`
  }
})

// Methods
async function handleRetry(): Promise<void> {
  if (isRetrying.value) return

  isRetrying.value = true

  try {
    // Try to fetch a lightweight resource to verify connectivity
    const response = await fetch(window.location.origin, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (response.ok) {
      // Network is back online
      handleOnline()
    }
  } catch (error) {
    // Still offline - show feedback to user
    console.warn('[OfflineBanner] Retry failed:', error)
  } finally {
    isRetrying.value = false
  }

  emit('retry')
}

function handleOnline(): void {
  isOffline.value = false

  // Auto-hide after delay
  if (props.autoHideDelay > 0) {
    autoHideTimer = setTimeout(() => {
      isVisible.value = false
    }, props.autoHideDelay)
  }

  emit('online')
}

function handleOffline(): void {
  isOffline.value = true
  isVisible.value = true

  // Clear any pending auto-hide timer
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }

  emit('offline')
}

function dismiss(): void {
  isVisible.value = false
  emit('dismiss')
}

async function loadCacheInfo(): Promise<void> {
  if (!props.showCacheInfo) return

  try {
    const info = await getCacheInfo()
    if (info) {
      cacheSize.value = info.size
    }
  } catch (error) {
    console.warn('[OfflineBanner] Failed to load cache info:', error)
  }
}

// Lifecycle
onMounted(async () => {
  // Set initial visibility based on current status
  if (!navigator.onLine) {
    isVisible.value = true
  }

  // Listen for online/offline events
  unsubscribeOnlineStatus = addOnlineStatusListener((online) => {
    if (online) {
      handleOnline()
    } else {
      handleOffline()
    }
  })

  // Load cache info for display
  await loadCacheInfo()
})

onUnmounted(() => {
  // Cleanup listeners
  if (unsubscribeOnlineStatus) {
    unsubscribeOnlineStatus()
  }

  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
  }
})
</script>

<style scoped>
.offline-banner {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
  border-bottom: 1px solid #FECACA;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none;
}

.offline-banner--visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.offline-banner--bottom {
  top: auto;
  bottom: 0;
  border-bottom: none;
  border-top: 1px solid #FECACA;
  box-shadow: 0 -4px 12px rgba(239, 68, 68, 0.15);
  transform: translateY(100%);
}

.offline-banner--bottom.offline-banner--visible {
  transform: translateY(0);
}

.offline-banner__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (min-width: 768px) {
  .offline-banner__container {
    gap: 16px;
  }
}

.offline-banner__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #DC2626;
}

.offline-banner__icon svg {
  w-4 h-4;
}

.offline-banner__content {
  flex: 1 min-w-0;
}

.offline-banner__title {
  font-size: 14px;
  font-weight: 600;
  color: #991B1B;
  line-height: 1.4;
  margin: 0 0 2px;
}

.offline-banner__message {
  font-size: 12px;
  color: #B91C1C;
  line-height: 1.4;
  margin: 0;
  opacity: 0.85;
}

.offline-banner__cache-info {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 10px;
  background: white/60;
  border-radius: 8px;
  border: 1px solid #FECACA;
}

.cache-size {
  font-size: 13px;
  font-weight: 600;
  color: #DC2626;
}

.cache-label {
  font-size: 10px;
  color: #EF4444;
  opacity: 0.8;
}

.offline-banner__retry-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.offline-banner__retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.offline-banner__retry-btn:active {
  transform: translateY(0);
}

.offline-banner__retry-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.5s ease;
}

.offline-banner__retry-btn svg.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.offline-banner__close {
  flex-shrink: 0;
  w-7 h-7 rounded-full flex items-center justify-center text-crimson/60 hover:text-crimson hover:bg-crimson/10 transition-colors cursor-pointer;
}

.offline-banner__close svg {
  w-4 h-4;
}

/* Transition */
.offline-banner-enter-active {
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.offline-banner-leave-active {
  transition: all 0.2s ease-in;
}

.offline-banner-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.offline-banner-enter-from.offline-banner--bottom {
  transform: translateY(100%);
}

.offline-banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.offline-banner-leave-to.offline-banner--bottom {
  transform: translateY(100%);
}

/* Responsive */
@media (max-width: 640px) {
  .offline-banner__container {
    padding: 12px 16px;
    gap: 10px;
  }

  .offline-banner__title {
    font-size: 13px;
  }

  .offline-banner__message {
    font-size: 11px;
  }

  .offline-banner__cache-info {
    display: none; /* Hide on small screens */
  }

  .offline-banner__retry-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .offline-banner {
    transition-duration: 0.01ms;
  }

  .offline-banner__retry-btn svg.spinning {
    animation: none;
  }

  .offline-banner-enter-active,
  .offline-banner-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
