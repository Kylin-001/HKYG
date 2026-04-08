<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
  icon: '',
  round: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  
  emit('click', event)
  
  // 触觉反馈（如果设备支持）
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}
</script>

<template>
  <button
    :class="[
      'apple-button',
      `apple-button--${variant}`,
      `apple-button--${size}`,
      {
        'apple-button--loading': loading,
        'apple-button--disabled': disabled,
        'apple-button--block': block,
        'apple-button--round': round,
        'apple-button--has-icon': !!icon,
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="apple-button__spinner"></span>
    
    <!-- Icon -->
    <span v-if="icon && !loading" class="apple-button__icon">
      <el-icon><component :is="icon" /></el-icon>
    </span>
    
    <!-- Content -->
    <span class="apple-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.apple-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: inherit;
  font-weight: 600;
  border: none;
  cursor: pointer;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.25s var(--ease-out);
  white-space: nowrap;
  
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.97);
    transition-duration: 0.1s;
  }
}

/* 尺寸变体 */
.apple-button--small {
  height: 32px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.apple-button--medium {
  height: 44px; /* Apple推荐触摸目标尺寸 */
  padding: 0 var(--spacing-lg);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.apple-button--large {
  height: 52px;
  padding: 0 var(--spacing-xl);
  font-size: var(--font-size-md);
  border-radius: var(--radius-lg);
}

/* 颜色变体 */
.apple-button--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5856D6 100%);
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--color-primary-dark) 0%, #4A3FBA 100%);
  }
}

.apple-button--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-divider);
  
  &:hover:not(:disabled) {
    background: var(--color-background);
    border-color: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.apple-button--ghost {
  background: transparent;
  color: var(--color-primary);
  
  &:hover:not(:disabled) {
    background: rgba(0, 122, 255, 0.08);
  }
}

.apple-button--danger {
  background: var(--color-error);
  color: white;
  
  &:hover:not(:disabled) {
    background: #D63031;
  }
}

.apple-button--success {
  background: var(--color-success);
  color: white;
  
  &:hover:not(:disabled) {
    background: #2EAD4B;
  }
}

/* 状态 */
.apple-button--loading {
  pointer-events: none;
  opacity: 0.75;
}

.apple-button--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
}

.apple-button--block {
  width: 100%;
}

.apple-button--round {
  border-radius: var(--radius-full);
}

/* 内部元素 */
.apple-button__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: buttonSpin 0.7s linear infinite;
}

.apple-button--secondary .apple-button__spinner,
.apple-button--ghost .apple-button__spinner {
  border-color: rgba(0, 0, 0, 0.15);
  border-top-color: currentColor;
}

.apple-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.apple-button__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

@keyframes buttonSpin {
  to { transform: rotate(360deg); }
}
</style>
