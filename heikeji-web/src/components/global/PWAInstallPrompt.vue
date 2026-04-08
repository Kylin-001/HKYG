<template>
  <Transition name="install-prompt">
    <div
      v-if="showPrompt && !isInstalled"
      class="pwa-install-prompt"
      role="dialog"
      aria-modal="false"
      aria-labelledby="install-title"
      aria-describedby="install-description"
    >
      <!-- Banner Style (default) -->
      <div v-if="variant === 'banner'" class="pwa-install-prompt__banner">
        <div class="pwa-install-prompt__content">
          <!-- App Icon -->
          <div class="pwa-install-prompt__icon" aria-hidden="true">
            <img src="/favicon.svg" alt="" width="48" height="48" />
          </div>

          <!-- Text Content -->
          <div class="pwa-install-prompt__text">
            <h3 id="install-title" class="pwa-install-prompt__title">
              {{ t('pwa.installTitle') || '安装黑科易购' }}
            </h3>
            <p id="install-description" class="pwa-install-prompt__description">
              {{ getInstallDescription() }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="pwa-install-prompt__actions">
            <button
              @click="handleInstall"
              class="pwa-install-prompt__btn pwa-install-prompt__btn--primary"
              :aria-label="t('pwa.install') || '立即安装'"
            >
              {{ isInstalling ? (t('pwa.installing') || '安装中...') : (t('pwa.install') || '立即安装') }}
            </button>

            <button
              @click="handleRemindLater"
              class="pwa-install-prompt__btn pwa-install-prompt__btn--secondary"
              :aria-label="t('pwa.remindLater') || '稍后提醒'"
            >
              {{ t('pwa.remindLater') || '稍后提醒' }}
            </button>

            <button
              @click="dismiss"
              class="pwa-install-prompt__close"
              :aria-label="t('common.close') || '关闭'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Card Style -->
      <div v-else-if="variant === 'card'" class="pwa-install-prompt__card">
        <button @click="dismiss" class="pwa-install-prompt__card-close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="pwa-install-prompt__card-icon" aria-hidden="true">
          <img src="/favicon.svg" alt="" width="80" height="80" />
        </div>

        <h3 id="install-title-card" class="pwa-install-prompt__card-title">
          {{ t('pwa.installTitle') || '安装黑科易购' }}
        </h3>

        <p id="install-description-card" class="pwa-install-prompt__card-desc">
          {{ getInstallDescription() }}
        </p>

        <!-- Feature List -->
        <ul class="pwa-install-prompt__features" aria-label="应用特性">
          <li>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ t('pwa.featureOffline') || '离线访问' }}
          </li>
          <li>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ t('pwa.featureFast') || '快速启动' }}
          </li>
          <li>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ t('pwa.featurePush') || '消息推送' }}
          </li>
          <li>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ t('pwa.featureNative') || '原生体验' }}
          </li>
        </ul>

        <div class="pwa-install-prompt__card-actions">
          <button
            @click="handleInstall"
            class="pwa-install-prompt__card-btn pwa-install-prompt__card-btn--primary"
            :disabled="isInstalling"
          >
            {{ isInstalling ? (t('pwa.installing') || '安装中...') : (t('pwa.install') || '立即安装') }}
          </button>

          <button
            @click="handleRemindLater"
            class="pwa-install-prompt__card-btn pwa-install-prompt__card-btn--secondary"
          >
            {{ t('pwa.remindLater') || '稍后提醒' }}
          </button>
        </div>

        <!-- Platform-specific instructions for iOS -->
        <div v-if="isIOS" class="pwa-install-prompt__ios-hint">
          <p>{{ t('pwa.iosHint') || 'iOS用户：点击分享按钮，然后选择"添加到主屏幕"' }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  canInstall,
  showInstallPrompt,
  shouldShowInstallPrompt,
  recordPromptShown,
  isInstalled as checkIsInstalled,
  setupInstallPrompt
} from '@/utils/pwaHelper'

// Props
interface Props {
  /** Display variant: 'banner' or 'card' */
  variant?: 'banner' | 'card'
  /** Auto-show after delay in milliseconds (0 = don't auto-show) */
  autoShowDelay?: number
  /** Show prompt only once per session */
  showOnce?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'banner',
  autoShowDelay: 3000,
  showOnce: true
})

// Emits
const emit = defineEmits<{
  (e: 'install'): void
  (e: 'dismiss'): void
  (e: 'remind-later'): void
}>()

const { t } = useI18n()

// State
const showPrompt = ref(false)
const isInstalling = ref(false)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isInstalled = ref(checkIsInstalled())
let hasBeenDismissedThisSession = false

// Methods
function getInstallDescription(): string {
  if (isIOS) {
    return t('pwa.iosDescription') ||
           '将黑科易购添加到主屏幕，获得更好的使用体验'
  }

  return t('pwa.description') ||
         '安装应用到您的设备，享受更快的速度和离线功能'
}

async function handleInstall(): Promise<void> {
  if (!canInstall()) {
    // For iOS, show instructions
    if (isIOS) {
      alert(t('pwa.iosInstructions') || '请点击浏览器的"分享"按钮，然后选择"添加到主屏幕"')
      return
    }
    return
  }

  isInstalling.value = true

  try {
    const result = await showInstallPrompt()

    if (result === 'accepted') {
      showPrompt.value = false
      emit('install')
      trackInstallEvent('accepted')
    } else {
      trackInstallEvent('dismissed')
    }
  } catch (error) {
    console.error('[PWAInstallPrompt] Install failed:', error)
    trackInstallEvent('error')
  } finally {
    isInstalling.value = false
  }
}

function handleRemindLater(): void {
  recordPromptShown()
  showPrompt.value = false
  hasBeenDismissedThisSession = true
  emit('remind-later')
  trackInstallEvent('deferred')
}

function dismiss(): void {
  showPrompt.value = false
  hasBeenDismissedThisSession = true
  emit('dismiss')
  trackInstallEvent('closed')
}

function checkAndShow(): void {
  // Don't show if already installed
  if (isInstalled.value) return

  // Don't show if dismissed this session and showOnce is true
  if (props.showOnce && hasBeenDismissedThisSession) return

  // Check if we should show based on timing preferences
  if (!shouldShowInstallPrompt()) return

  // Check if app can be installed
  if (!canInstall()) return

  showPrompt.value = true
}

function trackInstallEvent(action: string): void {
  // Optional: Track installation events for analytics
  try {
    console.log(`[PWAInstallPrompt] Event tracked: ${action}`)
    // Example: send to analytics service
    // analytics.track('pwa_install_prompt', { action })
  } catch (error) {
    // Silently fail
  }
}

// Lifecycle
onMounted(() => {
  // Setup install prompt listener
  setupInstallPrompt(
    // onInstallable - called when app becomes installable
    () => {
      console.log('[PWAInstallPrompt] App is now installable')

      // Auto-show after delay if configured
      if (props.autoShowDelay > 0) {
        setTimeout(() => {
          checkAndShow()
        }, props.autoShowDelay)
      }
    },
    // onInstalled - called when app is installed
    () => {
      isInstalled.value = true
      showPrompt.value = false
      console.log('[PWAInstallPrompt] App was installed')
    }
  )

  // Also check immediately in case the event already fired
  setTimeout(() => {
    checkAndShow()
  }, 1000)
})
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  z-index: 9998;
}

/* Banner Variant */
.pwa-install-prompt__banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #E2E8F0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.pwa-install-prompt__content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (min-width: 768px) {
  .pwa-install-prompt__content {
    gap: 16px;
  }
}

.pwa-install-prompt__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(to bottom right, var(--color-primary), var(--color-primary-light));
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.pwa-install-prompt__icon img {
  w-full h-full object-contain filter brightness-0 invert;
}

.pwa-install-prompt__text {
  flex: 1 min-w-0;
}

.pwa-install-prompt__title {
  font-size: 15px;
  font-weight: 600;
  color: text-primary;
  margin: 0 0 4px;
}

.pwa-install-prompt__description {
  font-size: 13px;
  color: text-secondary;
  line-height: 1.4;
  margin: 0;
}

.pwa-install-prompt__actions {
  display: flex items-center gap-2;
  flex-shrink: 0;
}

.pwa-install-prompt__btn {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.pwa-install-prompt__btn--primary {
  color: white;
  background: linear-gradient(135deg, primary 0%, primary-light 100%);
  box-shadow: 0 2px 8px rgba(primary, 0.3);
}

.pwa-install-prompt__btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(primary, 0.4);
}

.pwa-install-prompt__btn--primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.pwa-install-prompt__btn--secondary {
  color: text-secondary;
  background: gray-100 hover:bg-gray-200 transition-colors;
}

.pwa-install-prompt__close {
  w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer ml-2;
}

.pwa-install-prompt__close svg {
  w-4 h-4;
}

/* Card Variant */
.pwa-install-prompt__card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center relative;
}

.pwa-install-prompt__card-close {
  absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer;
}

.pwa-install-prompt__card-close svg {
  w-4 h-4;
}

.pwa-install-prompt__card-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: linear-gradient(to bottom right, var(--color-primary), var(--color-primary-light));
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.pwa-install-prompt__card-icon img {
  w-full h-full object-contain filter brightness-0 invert;
}

.pwa-install-prompt__card-title {
  font-size: 18px;
  font-weight: 700;
  color: text-primary;
  margin: 0 0 8px;
}

.pwa-install-prompt__card-desc {
  font-size: 14px;
  color: text-secondary;
  line-height: 1.5;
  margin: 0 0 20px;
}

.pwa-install-prompt__features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
}

.pwa-install-prompt__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: text-secondary;
}

.pwa-install-prompt__features li svg {
  w-5 h-5 text-green-500 flex-shrink: 0;
}

.pwa-install-prompt__card-actions {
  display: flex flex-col gap-3;
}

.pwa-install-prompt__card-btn {
  w-full py-3 px-6 rounded-xl font-semibold text-sm border-none cursor-pointer transition-all 0.2s ease;
}

.pwa-install-prompt__card-btn--primary {
  color: white;
  background: linear-gradient(135deg, primary 0%, primary-light 100%);
  box-shadow: 0 4px 12px rgba(primary, 0.35);
}

.pwa-install-prompt__card-btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(primary, 0.45);
}

.pwa-install-prompt__card-btn--primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.pwa-install-prompt__card-btn--secondary {
  color: text-secondary;
  background: gray-100 hover:bg-gray-200 transition-colors;
}

.pwa-install-prompt__ios-hint {
  margin-top: 16px;
  padding: 12px;
  background: blue-50 rounded-lg border border-blue-200;
}

.pwa-install-prompt__ios-hint p {
  margin: 0;
  font-size: 12px;
  color: blue-700 line-height: 1.5;
}

/* Transitions */
.install-prompt-enter-active {
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.install-prompt-leave-active {
  transition: all 0.2s ease-in;
}

.install-prompt-enter-from .pwa-install-prompt__banner {
  transform: translateY(100%);
  opacity: 0;
}

.install-prompt-leave-to .pwa-install-prompt__banner {
  transform: translateY(100%);
  opacity: 0;
}

.install-prompt-enter-from .pwa-install-prompt__card {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

.install-prompt-leave-to .pwa-install-prompt__card {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .pwa-install-prompt__banner {
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .pwa-install-prompt__icon {
    w-10 h-10;
  }

  .pwa-install-prompt__title {
    font-size: 14px;
  }

  .pwa-install-prompt__description {
    font-size: 12px;
  }

  .pwa-install-prompt__btn {
    padding: 8px 16px;
    font-size: 12px;
  }

  .pwa-install-prompt__card {
    w-[95%] p-5;
  }

  .pwa-install-prompt__card-icon {
    w-16 h-16;
  }

  .pwa-install-prompt__card-title {
    font-size: 16px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .install-prompt-enter-active,
  .install-prompt-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
