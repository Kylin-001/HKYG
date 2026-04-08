<template>
  <nav class="skip-links" :aria-label="t('a11y.skipLinks') || '快捷导航链接'">
    <ul class="skip-links__list">
      <!-- Skip to main content -->
      <li>
        <a
          href="#main-content"
          class="skip-links__link"
          @click="handleSkip('main')"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="skip-links__icon">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
          </svg>
          {{ t('a11y.skipToContent') || '跳转到主要内容' }}
        </a>
      </li>

      <!-- Skip to navigation -->
      <li v-if="showNavLink">
        <a
          href="#main-nav"
          class="skip-links__link"
          @click="handleSkip('nav')"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="skip-links__icon">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ t('a11y.skipToNavigation') || '跳转到导航' }}
        </a>
      </li>

      <!-- Skip to footer -->
      <li v-if="showFooterLink">
        <a
          href="#main-footer"
          class="skip-links__link"
          @click="handleSkip('footer')"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="skip-links__icon">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          {{ t('a11y.skipToFooter') || '跳转到页脚' }}
        </a>
      </li>

      <!-- Accessibility settings (optional) -->
      <li v-if="showSettingsLink">
        <button
          type="button"
          class="skip-links__link skip-links__link--button"
          @click="handleOpenSettings"
          :aria-label="t('a11y.accessibilitySettings') || '无障碍设置'"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="skip-links__icon">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
          </svg>
          {{ t('a11y.settings') || '无障碍设置' }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Props
interface Props {
  /** Show navigation skip link */
  showNavLink?: boolean
  /** Show footer skip link */
  showFooterLink?: boolean
  /** Show accessibility settings link */
  showSettingsLink?: boolean
}

withDefaults(defineProps<Props>(), {
  showNavLink: true,
  showFooterLink: true,
  showSettingsLink: false
})

// Emits
const emit = defineEmits<{
  (e: 'skip', target: string): void
  (e: 'open-settings'): void
}>()

const { t } = useI18n()

function handleSkip(target: string): void {
  emit('skip', target)
}

function handleOpenSettings(): void {
  emit('open-settings')
}
</script>

<style scoped>
.skip-links {
  /* Visually hidden by default, visible on keyboard focus */
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 99999;
  width: 100%;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 59, 128, 0.15);
  padding: 8px 0;
}

.skip-links:focus-within {
  top: 0;
}

.skip-links__list {
  list-style: none;
  margin: 0;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 1280px;
  margin: 0 auto;
}

.skip-links__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: primary text-white;
  background: linear-gradient(135deg, primary 0%, primary-light 100%);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(primary, 0.25);
  border: none;
  cursor: pointer;
}

.skip-links__link:hover,
.skip-links__link:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(primary, 0.35);
  outline: 2px solid primary-dark;
  outline-offset: 2px;
}

.skip-links__link--button {
  background: linear-gradient(135deg, gray-700 0%, gray-600 100%);
  color: white;
}

.skip-links__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Ensure links are visible when focused via keyboard */
.skip-links__link:focus {
  outline: 3px solid #003B80;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .skip-links__list {
    flex-direction: column;
    padding: 8px 12px;
    gap: 6px;
  }

  .skip-links__link {
    width: 100%;
    justify-content: center;
    font-size: 13px;
    padding: 10px 12px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .skip-links__link {
    border: 2px solid currentColor;
  }
}
</style>
