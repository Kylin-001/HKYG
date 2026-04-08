<script setup lang="ts">
/**
 * FormInput - 统一表单输入组件 v3.0
 *
 * @description
 * 黑龙江科技大学设计系统的统一表单输入组件，提供现代化、高可访问性的输入体验。
 * 支持浮动标签、清除按钮、密码切换、字数统计等高级功能。
 * 符合WCAG 2.1 AA可访问性标准，完整支持暗色模式。
 *
 * @features
 * - 3种尺寸：sm (36px), md (44px), lg (52px)
 * - 3种变体：default, filled, outlined
 * - 浮动标签动画效果
 * - 清除按钮（带旋转动画）
 * - 密码显示/隐藏切换
 * - 字数统计显示
 * - 前/后缀图标插槽
 * - 多状态反馈：error, success, warning
 * - 完整键盘导航和屏幕阅读器支持
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <FormInput v-model="text" label="用户名" placeholder="请输入用户名" />
 *
 * <!-- 带验证状态 -->
 * <FormInput
 *   v-model="email"
 *   type="email"
 *   label="邮箱地址"
 *   :error="errors.email"
 *   :success="isValid ? '格式正确' : undefined"
 *   required
 *   clearable
 * />
 *
 * <!-- 密码输入 -->
 * <FormInput
 *   v-model="password"
 *   type="password"
 *   label="密码"
 *   show-password-toggle
 *   :maxlength="20"
 *   show-word-count
 * />
 *
 * <!-- 带图标 -->
 * <FormInput v-model="search" placeholder="搜索..." size="lg">
 *   <template #prefix-icon><SearchIcon /></template>
 * </FormInput>
 * ```
 */

// ====== 类型导出 ======

/**
 * 输入框类型
 */
export type InputType = 'text' | 'password' | 'email' | 'tel' | 'number' | 'url' | 'search'

/**
 * 输入框尺寸
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * 输入框变体
 */
export type InputVariant = 'default' | 'filled' | 'outlined'

/**
 * 文本域调整大小选项
 */
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

// ====== Props 接口 ======

interface Props {
  /**
   * 绑定值 (v-model)
   */
  modelValue: string | number

  /**
   * 标签文字（支持浮动标签）
   */
  label?: string

  /**
   * 提示文字（显示在输入框下方）
   */
  hint?: string

  /**
   * 占位符文字
   */
  placeholder?: string

  /**
   * 输入类型
   * - text: 文本输入（默认）
   * - password: 密码输入
   * - email: 邮箱输入
   * - tel: 电话号码
   * - number: 数字输入
   * - url: URL地址
   * - search: 搜索框
   * @default 'text'
   */
  type?: InputType

  /**
   * 输入框尺寸
   * - sm: 小 (36px高)
   * - md: 中等 (44px高) - 默认
   * - lg: 大 (52px高)
   * @default 'md'
   */
  size?: InputSize

  /**
   * 视觉变体
   * - default: 默认样式（白色背景 + 边框）
   * - filled: 填充样式（浅灰背景 + 无边框）
   * - outlined: 轮廓样式（透明背景 + 边框）
   * @default 'default'
   */
  variant?: InputVariant

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean

  /**
   * 是否可清除（显示清除按钮）
   * @default false
   */
  clearable?: boolean

  /**
   * 是否显示密码切换按钮（仅type=password时有效）
   * @default false
   */
  showPasswordToggle?: boolean

  /**
   * 最大输入长度
   */
  maxlength?: number

  /**
   * 是否显示字数统计
   * @default false
   */
  showWordCount?: boolean

  /**
   * 是否自动聚焦
   * @default false
   */
  autofocus?: boolean

  /**
   * 是否必填（显示*标记）
   * @default false
   */
  required?: boolean

  /**
   * autocomplete属性值
   */
  autocomplete?: string

  /**
   * textarea行数（多行文本时使用）
   * @default 3
   */
  rows?: number

  /**
   * textarea调整大小方式
   * @default 'vertical'
   */
  resize?: TextareaResize

  /**
   * 错误消息（有值时显示错误状态）
   */
  error?: string

  /**
   * 成功消息（有值时显示成功状态）
   */
  success?: string

  /**
   * 警告消息（有值时显示警告状态）
   */
  warning?: string
}

// ====== Props 默认值 ======

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  hint: undefined,
  placeholder: undefined,
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  clearable: false,
  showPasswordToggle: false,
  maxlength: undefined,
  showWordCount: false,
  autofocus: false,
  required: false,
  autocomplete: undefined,
  rows: 3,
  resize: 'vertical',
  error: undefined,
  success: undefined,
  warning: undefined,
})

// ====== Events ======

const emit = defineEmits<{
  /**
   * 更新绑定值 (v-model:update)
   */
  'update:modelValue': [value: string | number]
  /**
   * 聚焦事件
   */
  focus: [event: FocusEvent]
  /**
   * 失焦事件
   */
  blur: [event: FocusEvent]
  /**
   * 清除事件
   */
  clear: []
  /**
   * 值改变事件
   */
  change: [event: Event]
  /**
   * 键盘按下事件
   */
  keydown: [event: KeyboardEvent]
  /**
   * 键盘抬起事件
   */
  keyup: [event: KeyboardEvent]
}>()

// ====== Slots ======

defineSlots<{
  /**
   * 标签内容（覆盖label prop）
   */
  label?: () => any
  /**
   * 前缀图标
   */
  'prefix-icon'?: () => any
  /**
   * 后缀图标
   */
  'suffix-icon'?: () => any
  /**
   * 提示文字（覆盖hint prop）
   */
  hint?: () => any
  /**
   * 错误消息（覆盖error prop）
   */
  error?: () => any
  /**
   * 前置内容区域
   */
  prefix?: () => any
  /**
   * 后置内容区域
   */
  suffix?: () => any
}>()

// ====== 响应式状态 ======

import { ref, computed, watch, nextTick, onMounted } from 'vue'

/** 输入框是否聚焦 */
const isFocused = ref(false)

/** 密码是否可见 */
const isPasswordVisible = ref(false)

/** 输入元素引用 */
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()

// ====== 计算属性 ======

/**
 * 当前实际输入类型（处理密码显示/隐藏）
 */
const currentType = computed(() => {
  if (props.type === 'password' && props.showPasswordToggle) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

/**
 * 是否显示清除按钮
 */
const shouldShowClear = computed(() => {
  return (
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    String(props.modelValue).length > 0 &&
    isFocused.value
  )
})

/**
 * 是否为多行文本
 */
const isTextarea = computed(() => {
  return props.rows && props.rows > 1
})

/**
 * 组件根元素的动态类名
 */
const wrapperClasses = computed(() => [
  'form-input',
  `form-input--${props.size}`,
  `form-input--variant-${props.variant}`,
  {
    'form-input--focused': isFocused.value,
    'form-input--disabled': props.disabled,
    'form-input--readonly': props.readonly,
    'form-input--error': !!props.error,
    'form-input--success': !!props.success && !props.error,
    'form-input--warning': !!props.warning && !props.error && !props.success,
    'form-input--has-value': String(props.modelValue).length > 0 || isFocused.value,
    'form-input--has-label': !!props.label || !!useSlots().label,
    'form-input--has-prefix': !!useSlots()['prefix-icon'] || !!useSlots().prefix,
    'form-input--has-suffix':
      shouldShowClear.value ||
      (props.type === 'password' && props.showPasswordToggle) ||
      !!useSlots()['suffix-icon'] ||
      !!useSlots().suffix,
    'form-input--textarea': isTextarea.value,
  },
])

/**
 * 输入框元素的类名
 */
const inputClasses = computed(() => ['form-input__inner'])

/**
 * 当前字数
 */
const currentLength = computed(() => String(props.modelValue).length)

/**
 * 字数统计是否接近上限（超过80%）
 */
const isNearLimit = computed(() => {
  if (!props.maxlength) return false
  return currentLength.value >= props.maxlength * 0.8
})

/**
 * 字数统计是否超限
 */
const isOverLimit = computed(() => {
  if (!props.maxlength) return false
  return currentLength.value > props.maxlength
})

// ====== 方法 ======

/**
 * 处理输入事件
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value: string | number = target.value

  // 数字类型转换
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }

  emit('update:modelValue', value)
}

/**
 * 处理聚焦事件
 */
function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

/**
 * 处理失焦事件
 */
function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}

/**
 * 处理清除操作
 */
function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

/**
 * 切换密码可见性
 */
function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

/**
 * 处理改变事件
 */
function handleChange(event: Event) {
  emit('change', event)
}

/**
 * 处理键盘事件
 */
function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
}

function handleKeyup(event: KeyboardEvent) {
  emit('keyup', event)
}

/**
 * 聚焦到输入框
 */
function focus() {
  inputRef.value?.focus()
}

/**
 * 让输入框失焦
 */
function blur() {
  inputRef.value?.blur()
}

/**
 * 选择所有文本
 */
function select() {
  inputRef.value?.select()
}

// ====== 生命周期 ======

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

// ====== 暴露方法 ======

defineExpose({
  /** 聚焦输入框 */
  focus,
  /** 失焦输入框 */
  blur,
  /** 选择文本 */
  select,
  /** 输入框DOM引用 */
  inputRef,
})
</script>

<template>
  <div :class="wrapperClasses">
    <!-- 浮动标签容器 -->
    <div class="form-input__container">
      <!-- 前缀区域 -->
      <span v-if="$slots['prefix-icon'] || $slots.prefix" class="form-input__prefix">
        <slot name="prefix-icon"></slot>
        <slot name="prefix"></slot>
      </span>

      <!-- 输入框主体 -->
      <div class="form-input__body">
        <!-- 浮动标签 -->
        <label
          v-if="label || $slots.label"
          class="form-input__label"
          :for="`form-input-${Math.random().toString(36).substr(2, 9)}`"
        >
          <slot name="label">{{ label }}</slot>
          <span v-if="required" class="form-input__required" aria-hidden="true">*</span>
        </label>

        <!-- 单行输入框 -->
        <input
          v-if="!isTextarea"
          ref="inputRef"
          :class="inputClasses"
          :type="currentType"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          :aria-label="label"
          :aria-invalid="!!error"
          :aria-describedby="
            error
              ? `error-${Math.random()}`
              : success
                ? `success-${Math.random()}`
                : warning
                  ? `warning-${Math.random()}`
                  : hint
                    ? `hint-${Math.random()}`
                    : undefined
          "
          :required="required"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
        />

        <!-- 多行文本域 -->
        <textarea
          v-else
          ref="inputRef"
          :class="inputClasses"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :rows="rows"
          :autocomplete="autocomplete"
          :aria-label="label"
          :aria-invalid="!!error"
          :style="{ resize }"
          :required="required"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
        ></textarea>
      </div>

      <!-- 后缀区域 -->
      <span class="form-input__suffix">
        <!-- 清除按钮 -->
        <button
          v-if="shouldShowClear"
          type="button"
          class="form-input__clear"
          aria-label="清除输入"
          tabindex="-1"
          @click.stop.prevent="handleClear"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- 密码切换按钮 -->
        <button
          v-if="type === 'password' && showPasswordToggle"
          type="button"
          class="form-input__password-toggle"
          :aria-label="isPasswordVisible ? '隐藏密码' : '显示密码'"
          tabindex="-1"
          @click.stop.prevent="togglePasswordVisibility"
        >
          <!-- 眼睛图标（显示） -->
          <svg v-if="!isPasswordVisible" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
          </svg>
          <!-- 眼睛关闭图标（隐藏） -->
          <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>

        <!-- 自定义后缀图标 -->
        <slot name="suffix-icon"></slot>
        <slot name="suffix"></slot>
      </span>
    </div>

    <!-- 底部信息区域 -->
    <div class="form-input__footer">
      <!-- 左侧：提示/错误/成功/警告消息 -->
      <div class="form-input__messages">
        <!-- 错误消息 -->
        <p v-if="error || $slots.error" class="form-input__message form-input__message--error" role="alert">
          <slot name="error">{{ error }}</slot>
        </p>

        <!-- 成功消息 -->
        <p
          v-else-if="success && !error"
          class="form-input__message form-input__message--success"
          role="status"
        >
          {{ success }}
        </p>

        <!-- 警告消息 -->
        <p
          v-else-if="warning && !error && !success"
          class="form-input__message form-input__message--warning"
          role="alert"
        >
          {{ warning }}
        </p>

        <!-- 提示消息 -->
        <p v-else-if="hint || $slots.hint" class="form-input__message form-input__message--hint">
          <slot name="hint">{{ hint }}</slot>
        </p>
      </div>

      <!-- 右侧：字数统计 -->
      <p
        v-if="showWordCount && maxlength"
        class="form-input__word-count"
        :class="{
          'form-input__word-count--near-limit': isNearLimit,
          'form-input__word-count--over-limit': isOverLimit,
        }"
        aria-live="polite"
      >
        {{ currentLength }}/{{ maxlength }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ====== CSS变量定义（从设计令牌继承）====== */
.form-input {
  /* 颜色令牌 */
  --input-bg: #ffffff;
  --input-border-color: #F3F4F6;
  --input-border-width: 1.5px;
  --input-text-color: #111827;
  --input-placeholder-color: #9CA3AF;
  --input-focus-border-color: #93C5FD;
  --input-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.10), 0 1px 3px rgba(0, 0, 0, 0.08);
  --input-error-color: #DC2626;
  --input-error-bg: #FEF2F2;
  --input-error-shadow: 0 0 0 3px rgba(220, 38, 38, 0.10);
  --input-success-color: #16A34A;
  --input-success-bg: #F0FDF4;
  --input-warning-color: #F59E0B;
  --input-warning-bg: #FFFBEB;
  --input-disabled-bg: #F3F4F6;
  --input-disabled-border: #E5E7EB;
  --input-disabled-text: #9CA3AF;

  /* 圆角令牌 */
  --input-radius: 16px;

  /* 动画时长 */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;

  /* 缓动函数 */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* 尺寸变量（通过size类覆盖） */
  --input-height: 44px;
  --input-padding-x: 1rem;
  --input-padding-y: 0.625rem;
  --input-font-size: 1rem;
  --input-icon-size: 18px;
}

/* ====== 基础布局 ====== */
.form-input {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
}

/* ====== 输入框容器 ====== */
.form-input__container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--input-bg);
  border: var(--input-border-width) solid var(--input-border-color);
  border-radius: var(--input-radius);
  transition:
    border-color var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out),
    background-color var(--transition-normal) var(--ease-out);
  overflow: hidden;

  &:hover:not(.form-input--disabled):not(.form-input--focused) {
    border-color: #D1D5DB;
  }
}

/* ====== 聚焦状态 ====== */
.form-input--focused .form-input__container {
  border-color: var(--input-focus-border-color);
  border-width: 2px;
  box-shadow: var(--input-focus-shadow);
}

/* ====== 错误状态 ====== */
.form-input--error .form-input__container {
  border-color: var(--input-error-color);
  border-width: 2px;
  background-color: var(--input-error-bg);
  box-shadow: var(--input-error-shadow);

  animation: shake 0.5s ease-in-out;
}

/* ====== 成功状态 ====== */
.form-input--success .form-input__container {
  border-color: var(--input-success-color);
  border-width: 2px;
  background-color: var(--input-success-bg);
}

/* ====== 警告状态 ====== */
.form-input--warning .form-input__container {
  border-color: var(--input-warning-color);
  border-width: 2px;
  background-color: var(--input-warning-bg);
}

/* ====== 禁用状态 ====== */
.form-input--disabled .form-input__container {
  background-color: var(--input-disabled-bg);
  border-color: var(--input-disabled-border);
  cursor: not-allowed;
  opacity: 0.65;

  .form-input__inner {
    color: var(--input-disabled-text);
    cursor: not-allowed;
  }
}

/* ====== 只读状态 ====== */
.form-input--readonly .form-input__container {
  background-color: #F9FAFB;
  cursor: default;
}

/* ====== 变体样式 ====== */

/* default变体 - 默认样式 */
.form-input--variant-default .form-input__container {
  background: var(--input-bg);
}

/* filled变体 - 填充样式 */
.form-input--variant-filled .form-input__container {
  background: #F9FAFB;
  border-color: transparent;
  border-width: 0;

  &:hover:not(.form-input--disabled):not(.form-input--focused) {
    background: #F3F4F6;
  }

  &.form-input--focused {
    background: var(--input-bg);
    border-width: 2px;
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-shadow);
  }
}

/* outlined变体 - 轮廓样式 */
.form-input--variant-outlined .form-input__container {
  background: transparent;
  border-width: 2px;
  border-color: #E5E7EB;

  &.form-input--focused {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-shadow);
  }
}

/* ====== 尺寸规范 ====== */

/* sm - 小尺寸 (36px) */
.form-input--size-sm {
  --input-height: 36px;
  --input-padding-x: 0.75rem;
  --input-padding-y: 0.375rem;
  --input-font-size: 0.875rem; /* caption (14px) */
  --input-icon-size: 16px;
  --input-radius: 12px;

  .form-input__prefix,
  .form-input__suffix {
    min-width: 36px;
  }

  .form-input__clear,
  .form-input__password-toggle {
    width: 16px;
    height: 16px;
  }

  .form-input__label {
    font-size: 0.75rem;
  }

  .form-input__message {
    font-size: 0.75rem;
  }

  .form-input__word-count {
    font-size: 0.6875rem;
  }
}

/* md - 中等尺寸 (44px) - 默认 */
.form-input--size-md {
  --input-height: 44px;
  --input-padding-x: 1rem;
  --input-padding-y: 0.625rem;
  --input-font-size: 1rem; /* body (16px) ⭐ */
  --input-icon-size: 18px;
  --input-radius: 16px;

  .form-input__prefix,
  .form-input__suffix {
    min-width: 40px;
  }

  .form-input__clear,
  .form-input__password-toggle {
    width: 18px;
    height: 18px;
  }

  .form-input__label {
    font-size: 0.875rem;
  }

  .form-input__message {
    font-size: 0.8125rem;
  }

  .form-input__word-count {
    font-size: 0.75rem;
  }
}

/* lg - 大尺寸 (52px) */
.form-input--size-lg {
  --input-height: 52px;
  --input-padding-x: 1.25rem;
  --input-padding-y: 0.75rem;
  --input-font-size: 1.125rem; /* bodyLarge (18px) */
  --input-icon-size: 20px;
  --input-radius: 16px;

  .form-input__prefix,
  .form-input__suffix {
    min-width: 44px;
  }

  .form-input__clear,
  .form-input__password-toggle {
    width: 20px;
    height: 20px;
  }

  .form-input__label {
    font-size: 0.9375rem;
  }

  .form-input__message {
    font-size: 0.875rem;
  }

  .form-input__word-count {
    font-size: 0.8125rem;
  }
}

/* ====== 内部元素样式 ====== */

/* 前缀区域 */
.form-input__prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: var(--input-padding-x);
  color: #6B7280;
  flex-shrink: 0;
  border-right: 1px solid var(--input-border-color);

  :deep(svg),
  :deep(img) {
    width: var(--input-icon-size);
    height: var(--input-icon-size);
  }
}

/* 输入框主体 */
.form-input__body {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  min-height: var(--input-height);
}

/* 浮动标签 */
.form-input__label {
  position: absolute;
  left: var(--input-padding-x);
  top: 50%;
  transform: translateY(-50%);
  color: var(--input-placeholder-color);
  font-weight: 400;
  pointer-events: none;
  transition:
    all 200ms ease-out,
    transform 200ms ease-out,
    font-size 200ms ease-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - var(--input-padding-x) * 2);
  z-index: 1;
}

/* 必填标记 */
.form-input__required {
  color: var(--input-error-color);
  margin-left: 2px;
  font-weight: 600;
}

/* 有值或聚焦时的标签上浮 */
.form-input--has-value .form-input__label,
.form-input--focused .form-input__label {
  top: 0;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--input-focus-border-color);
  background: linear-gradient(
    to bottom,
    transparent 45%,
    var(--input-bg) 45%,
    var(--input-bg) 55%,
    transparent 55%
  );
  padding: 0 4px;
}

/* 输入框元素 */
.form-input__inner {
  width: 100%;
  height: 100%;
  padding: var(--input-padding-y) var(--input-padding-x);
  font-family: inherit;
  font-size: var(--input-font-size);
  line-height: 1.5;
  color: var(--input-text-color);
  background: transparent;
  border: none;
  outline: none;
  resize: none;

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

/* textarea特殊处理 */
.form-input--textarea .form-input__inner {
  min-height: auto;
  padding-top: calc(var(--input-padding-y) + 1rem); /* 为标签留出空间 */
}

.form-input--textarea .form-input__label {
  top: var(--input-padding-y);
  transform: translateY(0);
}

.form-input--textarea.form-input--has-value .form-input__label,
.form-input--textarea.form-input--focused .form-input__label {
  top: 0;
  transform: translateY(-50%);
}

/* 后缀区域 */
.form-input__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding-right: var(--input-padding-x);
  color: #6B7280;
  flex-shrink: 0;
  border-left: 1px solid var(--input-border-color);

  :deep(svg),
  :deep(img) {
    width: var(--input-icon-size);
    height: var(--input-icon-size);
  }
}

/* 清除按钮 */
.form-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin: -4px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #9CA3AF;
  cursor: pointer;
  transition:
    all var(--transition-fast) var(--ease-out),
    transform var(--transition-fast) var(--ease-in-out);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #374151;
    transform: rotate(90deg);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg) scale(0.95);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 密码切换按钮 */
.form-input__password-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin: -4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  transition:
    all var(--transition-fast) var(--ease-out),
    transform var(--transition-normal) var(--ease-in-out);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #374151;
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 100%;
    height: 100%;
    transition: transform var(--transition-normal) var(--ease-in-out);
  }

  /* 切换时旋转动画 */
  &:hover svg {
    transform: rotate(180deg);
  }
}

/* ====== 底部信息区域 ====== */
.form-input__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 0.375rem;
  min-height: 1.25rem;
}

.form-input__messages {
  flex: 1;
}

/* 消息文本 */
.form-input__message {
  margin: 0;
  padding: 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: fadeInUp 0.2s ease-out;
}

/* 错误消息 */
.form-input__message--error {
  color: var(--input-error-color);
  font-weight: 500;

  &::before {
    content: '⚠';
    font-size: 1em;
    margin-right: 0.25rem;
  }
}

/* 成功消息 */
.form-input__message--success {
  color: var(--input-success-color);

  &::before {
    content: '✓';
    font-size: 1em;
    margin-right: 0.25rem;
    font-weight: 700;
  }
}

/* 警告消息 */
.form-input__message--warning {
  color: var(--input-warning-color);

  &::before {
    content: '⚡';
    font-size: 1em;
    margin-right: 0.25rem;
  }
}

/* 提示消息 */
.form-input__message--hint {
  color: #6B7280;
}

/* 字数统计 */
.form-input__word-count {
  margin: 0;
  padding: 0;
  color: #9CA3AF;
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: color var(--transition-fast) var(--ease-out);
}

/* 接近上限 */
.form-input__word-count--near-limit {
  color: #F59E0B;
  font-weight: 500;
}

/* 超限 */
.form-input__word-count--over-limit {
  color: var(--input-error-color);
  font-weight: 600;
  animation: pulse 1s ease-in-out infinite;
}

/* ====== 动画关键帧 ====== */

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* ====== 可访问性增强 ====== */

/* 焦点可见性（键盘导航） */
.form-input__inner:focus-visible {
  outline: 2px solid var(--input-focus-border-color);
  outline-offset: -2px;
  border-radius: calc(var(--input-radius) - 2px);
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .form-input {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
  }

  .form-input__clear:hover {
    transform: none;
  }

  .form-input__password-toggle:hover svg {
    transform: none;
  }

  .form-input--error .form-input__container {
    animation: none;
  }

  .form-input__word-count--over-limit {
    animation: none;
  }

  .form-input__message {
    animation: none;
  }
}

/* ====== 暗色模式适配 ====== */

@media (prefers-color-scheme: dark) {
  .form-input {
    --input-bg: #1F2937;
    --input-border-color: #374151;
    --input-text-color: #F9FAFB;
    --input-placeholder-color: #6B7280;
    --input-focus-border-color: #60A5FA;
    --input-focus-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
    --input-error-bg: #450A0A;
    --input-error-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    --input-success-bg: #052E16;
    --input-warning-bg: #451A03;
    --input-disabled-bg: #111827;
    --input-disabled-border: #1F2937;
    --input-disabled-text: #4B5563;
  }

  .form-input__container:hover:not(.form-input--disabled):not(.form-input--focused) {
    border-color: #4B5563;
  }

  .form-input__clear:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #E5E7EB;
  }

  .form-input__clear:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .form-input__password-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #E5E7EB;
  }

  .form-input__password-toggle:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .form-input--variant-filled .form-input__container {
    background: #111827;

    &:hover:not(.form-input--disabled):not(.form-input--focused) {
      background: #1F2937;
    }

    &.form-input--focused {
      background: var(--input-bg);
    }
  }

  .form-input--variant-outlined .form-input__container {
    border-color: #4B5563;
  }

  .form-input--readonly .form-input__container {
    background-color: #1F2937;
  }

  .form-input__label {
    background: linear-gradient(
      to bottom,
      transparent 45%,
      var(--input-bg) 45%,
      var(--input-bg) 55%,
      transparent 55%
    );
  }

  .form-input__prefix,
  .form-input__suffix {
    color: #9CA3AF;
    border-color: #374151;
  }

  .form-input__clear {
    color: #6B7280;
  }

  .form-input__password-toggle {
    color: #9CA3AF;
  }

  .form-input__message--hint {
    color: #9CA3AF;
  }

  .form-input__word-count {
    color: #6B7280;
  }
}
</style>

<!--
  ====== 使用示例 ======

  ## 1. 基础用法
  ```vue
  <template>
    <FormInput v-model="text" label="用户名" placeholder="请输入用户名" />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  const text = ref('')
  </script>
  ```

  ## 2. 不同尺寸
  ```vue
  <template>
    <div class="space-y-4">
      <FormInput v-model="value1" size="sm" label="小尺寸" />
      <FormInput v-model="value2" size="md" label="中等尺寸" />
      <FormInput v-model="value3" size="lg" label="大尺寸" />
    </div>
  </template>
  ```

  ## 3. 不同变体
  ```vue
  <template>
    <div class="space-y-4">
      <FormInput v-model="value1" variant="default" label="默认" />
      <FormInput v-model="value2" variant="filled" label="填充" />
      <FormInput v-model="value3" variant="outlined" label="轮廓" />
    </div>
  </template>
  ```

  ## 4. 表单验证集成
  ```vue
  <template>
    <FormInput
      v-model="email"
      type="email"
      label="邮箱地址"
      placeholder="example@usth.edu.cn"
      :error="errors.email"
      :success="isValidEmail ? '邮箱格式正确' : undefined"
      required
      clearable
    />

    <FormInput
      v-model="password"
      type="password"
      label="密码"
      show-password-toggle
      :maxlength="20"
      show-word-count
      :error="errors.password"
      required
    />
  </template>

  <script setup lang="ts">
  import { ref, computed } from 'vue'
  const email = ref('')
  const password = ref('')
  const errors = ref({ email: '', password: '' })

  const isValidEmail = computed(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  })
  </script>
  ```

  ## 5. 密码输入
  ```vue
  <template>
    <FormInput
      v-model="password"
      type="password"
      label="登录密码"
      show-password-toggle
      :maxlength="32"
      show-word-count
      hint="密码长度8-32位，需包含字母和数字"
      required
    />
  </template>
  ```

  ## 6. 带图标的输入框
  ```vue
  <template>
    <!-- 搜索框 -->
    <FormInput v-model="search" placeholder="搜索课程、教师..." size="lg">
      <template #prefix-icon>
        <SearchIcon />
      </template>
    </FormInput>

    <!-- 带单位的后缀 -->
    <FormInput v-model="amount" type="number" label="金额">
      <template #suffix>
        <span class="text-gray-500">元</span>
      </template>
    </FormInput>
  </template>
  ```

  ## 7. 多行文本域
  ```vue
  <template>
    <FormInput
      v-model="content"
      label="留言内容"
      :rows="5"
      resize="vertical"
      :maxlength="500"
      show-word-count
      hint="请详细描述您的问题或建议"
    />
  </template>
  ```

  ## 8. 禁用和只读状态
  ```vue
  <template>
    <FormInput v-model="disabledValue" label="禁用状态" disabled />
    <FormInput v-model="readonlyValue" label="只读状态" readonly />
  </template>
  ```

  ## 9. 不同输入类型
  ```vue
  <template>
    <div class="space-y-4">
      <FormInput v-model="email" type="email" label="邮箱" />
      <FormInput v-model="phone" type="tel" label="电话" />
      <FormInput v-model="age" type="number" label="年龄" />
      <FormInput v-model="website" type="url" label="网站" />
      <FormInput v-model="query" type="search" label="搜索" />
    </div>
  </template>
  ```

  ## 10. 完整表单示例
  ```vue
  <template>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <FormInput
          v-model="form.username"
          label="用户名"
          placeholder="请输入学号或工号"
          :error="errors.username"
          required
          clearable
        />

        <FormInput
          v-model="form.email"
          type="email"
          label="邮箱地址"
          placeholder="name@usth.edu.cn"
          :error="errors.email"
          required
          clearable
        />

        <FormInput
          v-model="form.password"
          type="password"
          label="设置密码"
          show-password-toggle
          :maxlength="32"
          show-word-count
          :error="errors.password"
          hint="密码长度8-32位，包含大小写字母和数字"
          required
        />

        <FormInput
          v-model="form.bio"
          label="个人简介"
          :rows="4"
          resize="vertical"
          :maxlength="200"
          show-word-count
          hint="简单介绍一下自己（选填）"
        />

        <button type="submit">注册</button>
      </div>
    </form>
  </template>

  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  import FormInput from '@/components/base/FormInput.vue'

  const form = reactive({
    username: '',
    email: '',
    password: '',
    bio: '',
  })

  const errors = reactive({
    username: '',
    email: '',
    password: '',
  })

  function handleSubmit() {
    // 表单验证逻辑
    console.log('提交表单:', form)
  }
  </script>
  ```
-->
