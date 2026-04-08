<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  size?: 'small' | 'medium' | 'large'
  error?: string
  prefixIcon?: string
  suffixIcon?: string
  maxlength?: number
  showWordLimit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: true,
  size: 'medium',
  error: '',
  maxlength: undefined,
  showWordLimit: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: []
  blur: []
  clear: []
}>()

const isFocused = ref(false)
const inputRef = ref<HTMLInputElement>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleFocus() {
  isFocused.value = true
  emit('focus')
}

function handleBlur() {
  isFocused.value = false
  emit('blur')
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div 
    :class="[
      'apple-input-wrapper',
      `apple-input-wrapper--${size}`,
      {
        'apple-input-wrapper--focused': isFocused,
        'apple-input-wrapper--error': !!error,
        'apple-input-wrapper--disabled': disabled,
      }
    ]"
  >
    <!-- 前缀图标 -->
    <span v-if="prefixIcon" class="apple-input__prefix">
      <el-icon><component :is="prefixIcon" /></el-icon>
    </span>
    
    <!-- 输入框 -->
    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      class="apple-input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <!-- 清除按钮 -->
    <button 
      v-if="clearable && modelValue && !disabled && !readonly"
      class="apple-input__clear"
      @click="handleClear"
      type="button"
    >
      <el-icon><CircleClose /></el-icon>
    </button>
    
    <!-- 后缀图标/字数统计 -->
    <span class="apple-input__suffix">
      <span v-if="showWordLimit && maxlength" class="word-limit">
        {{ String(modelValue)?.length || 0 }}/{{ maxlength }}
      </span>
      <el-icon v-else-if="suffixIcon"><component :is="suffixIcon" /></el-icon>
    </span>
    
    <!-- 错误提示 -->
    <div v-if="error" class="apple-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { CircleClose } from '@element-plus/icons-vue'

export default {
  components: { CircleClose },
}
</script>

<style scoped>
.apple-input-wrapper {
  position: relative;
  width: 100%;
}

.apple-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--color-divider);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
  transition: all 0.25s var(--ease-out);
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-background);
  }
  
  &::selection {
    background-color: rgba(0, 122, 255, 0.15);
  }
}

/* 尺寸 */
.apple-input-wrapper--small .apple-input {
  height: 36px;
  padding: 8px 12px;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.apple-input-wrapper--medium .apple-input {
  height: 48px; /* 更大的触摸区域 */
  padding: 14px 16px;
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.apple-input-wrapper--large .apple-input {
  height: 56px;
  padding: 16px 20px;
  font-size: var(--font-size-md);
  border-radius: var(--radius-lg);
}

/* 状态 */
.apple-input-wrapper--focused .apple-input {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.apple-input-wrapper--error .apple-input {
  border-color: var(--color-error);
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
  }
}

.apple-input-wrapper--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 前后缀图标 */
.apple-input__prefix,
.apple-input__suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.apple-input__prefix {
  left: 14px;
}

.apple-input__suffix {
  right: 14px;
  gap: var(--spacing-xs);
}

/* 调整输入框padding以适应图标 */
.has-prefix:not(.has-suffix) .apple-input {
  padding-left: 42px;
}

.has-suffix .apple-input {
  padding-right: 42px;
}

.has-prefix.has-suffix .apple-input {
  padding-left: 42px;
  padding-right: 42px;
}

/* 清除按钮 */
.apple-input__clear {
  position: absolute;
  right: 42px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: all 0.2s ease-out;
  pointer-events: none;
  
  /* 当有内容时显示 */
  .has-value & {
    opacity: 1;
    pointer-events: auto;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text-secondary);
  }
}

/* 字数统计 */
.word-limit {
  font-size: 11px;
  color: var(--color-text-tertiary);
  
  &.over-limit {
    color: var(--color-error);
  }
}

/* 错误提示 */
.apple-input__error {
  margin-top: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-error);
  line-height: 1.4;
}
</style>
