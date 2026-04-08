<script setup lang="ts">
/**
 * FormSelect - 统一表单选择组件 v3.0
 *
 * @description
 * 黑龙江科技大学设计系统的统一选择器组件，提供现代化、高可访问性的下拉选择体验。
 * 支持单选/多选模式、搜索过滤、选项分组、键盘导航等高级功能。
 * 符合WCAG 2.1 AA可访问性标准，完整支持暗色模式。
 *
 * @features
 * - 3种尺寸：sm (36px), md (44px), lg (52px)
 * - 3种变体：default, filled, outlined
 * - 单选/多选模式切换
 * - 内置搜索过滤功能
 * - 下拉面板动画效果
 * - 完整键盘导航（方向键、Enter、Escape、字母跳转）
 * - 选项分组支持
 * - 可清除选中项
 * - 多状态反馈：error, success
 *
 * @example
 * ```vue
 * <!-- 基础单选 -->
 * <FormSelect v-model="value" :options="options" label="请选择" />
 *
 * <!-- 带搜索的多选 -->
 * <FormSelect
 *   v-model="selected"
 *   :options="courseOptions"
 *   label="选择课程"
 *   multiple
 *   searchable
 *   placeholder="搜索课程..."
 * />
 *
 * <!-- 带验证状态 -->
 * <FormSelect
 *   v-model="department"
 *   :options="deptOptions"
 *   label="所属学院"
 *   :error="errors.department"
 *   required
 *   clearable
 * />
 * ```
 */

// ====== 类型导出 ======

/**
 * 选择器选项接口
 */
export interface SelectOption {
  /** 选项值 */
  value: string | number | boolean
  /** 显示文本 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 选项图标组件 */
  icon?: any
  /** 描述文字 */
  description?: string
  /** 分组名称 */
  group?: string
}

/**
 * 选择器尺寸
 */
export type SelectSize = 'sm' | 'md' | 'lg'

/**
 * 选择器变体
 */
export type SelectVariant = 'default' | 'filled' | 'outlined'

// ====== Props 接口 ======

interface Props {
  /**
   * 绑定值 (v-model)
   * - 单选：string | number | boolean
   * - 多选：数组
   */
  modelValue: string | number | boolean | (string | number | boolean)[]

  /**
   * 选项列表
   */
  options: SelectOption[]

  /**
   * 标签文字
   */
  label?: string

  /**
   * 占位符文字
   */
  placeholder?: string

  /**
   * 选择器尺寸
   * - sm: 小 (36px高)
   * - md: 中等 (44px高) - 默认
   * - lg: 大 (52px高)
   * @default 'md'
   */
  size?: SelectSize

  /**
   * 视觉变体
   * - default: 默认样式
   * - filled: 填充样式
   * - outlined: 轮廓样式
   * @default 'default'
   */
  variant?: SelectVariant

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否可清除（显示清除按钮）
   * @default false
   */
  clearable?: boolean

  /**
   * 是否多选模式
   * @default false
   */
  multiple?: boolean

  /**
   * 是否可搜索过滤
   * @default false
   */
  searchable?: boolean

  /**
   * 搜索框占位符
   * @default '搜索...'
   */
  filterPlaceholder?: string

  /**
   * 错误消息（有值时显示错误状态）
   */
  error?: string

  /**
   * 成功消息（有值时显示成功状态）
   */
  success?: string

  /**
   * 是否必填（显示*标记）
   * @default false
   */
  required?: boolean
}

// ====== Props 默认值 ======

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  size: 'md',
  variant: 'default',
  disabled: false,
  clearable: false,
  multiple: false,
  searchable: false,
  filterPlaceholder: '搜索...',
  error: undefined,
  success: undefined,
  required: false,
})

// ====== Events ======

const emit = defineEmits<{
  /**
   * 更新绑定值 (v-model:update)
   */
  'update:modelValue': [value: string | number | boolean | (string | number | boolean)[]]
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
   * 选项改变事件
   */
  change: [value: string | number | boolean | (string | number | boolean)[]]
  /**
   * 搜索事件
   */
  search: [query: string]
  /**
   * 下拉面板打开/关闭事件
   */
  'dropdown-toggle': [isOpen: boolean]
}>()

// ====== Slots ======

defineSlots<{
  /**
   * 标签内容（覆盖label prop）
   */
  label?: () => any
  /**
   * 选项内容自定义
   */
  option?: (option: SelectOption) => any
  /**
   * 前缀图标
   */
  'prefix-icon'?: () => any
  /**
   * 无数据时的提示内容
   */
  empty?: () => any
  /**
   * 加载中的提示内容
   */
  loading?: () => any
}>()

// ====== 响应式状态 ======

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

/** 下拉面板是否打开 */
const isOpen = ref(false)

/** 当前聚焦的选项索引 */
const activeIndex = ref(-1)

/** 搜索关键词 */
const searchQuery = ref('')

/** 组件根元素引用 */
const selectRef = ref<HTMLElement>()

/** 触发器元素引用 */
const triggerRef = ref<HTMLElement>()

/** 下拉面板引用 */
const dropdownRef = ref<HTMLElement>()

/** 搜索输入框引用 */
const searchInputRef = ref<HTMLInputElement>()

/** 上次按键时间（用于typeahead） */
let lastKeyTime = 0

/** 拼接的搜索字符串 */
let typeaheadString = ''

/** typeahead定时器 */
let typeaheadTimer: ReturnType<typeof setTimeout> | null = null

// ====== 计算属性 ======

/**
 * 过滤后的选项列表
 */
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      (option.description && option.description.toLowerCase().includes(query))
  )
})

/**
 * 分组后的选项列表
 */
const groupedOptions = computed(() => {
  if (!filteredOptions.value.some((opt) => opt.group)) {
    return { '': filteredOptions.value }
  }

  const groups: Record<string, SelectOption[]> = {}
  filteredOptions.value.forEach((option) => {
    const group = option.group || ''
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(option)
  })
  return groups
})

/** 是否有值 */
const hasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0
  }
  return props.modelValue !== '' && props.modelValue !== undefined && props.modelValue !== null
})

/** 是否显示清除按钮 */
const shouldShowClear = computed(() => {
  return (
    props.clearable &&
    !props.disabled &&
    hasValue.value &&
    !isOpen.value
  )
})

/** 当前选中的标签文本 */
const selectedLabel = computed(() => {
  if (!hasValue.value) return ''

  if (props.multiple && Array.isArray(props.modelValue)) {
    const labels = props.modelValue.map((val) => {
      const opt = props.options.find((o) => o.value === val)
      return opt ? opt.label : String(val)
    })
    return labels.join(', ')
  }

  const option = props.options.find((o) => o.value === props.modelValue)
  return option ? option.label : String(props.modelValue)
})

/** 展开的选项数组（用于键盘导航） */
const flatOptions = computed(() => filteredOptions.value.filter((opt) => !opt.disabled))

/** 组件根元素的动态类名 */
const wrapperClasses = computed(() => [
  'form-select',
  `form-select--${props.size}`,
  `form-select--variant-${props.variant}`,
  {
    'form-select--open': isOpen.value,
    'form-select--disabled': props.disabled,
    'form-select--error': !!props.error,
    'form-select--success': !!props.success && !props.error,
    'form-select--multiple': props.multiple,
    'form-select--searchable': props.searchable,
    'form-select--has-value': hasValue.value,
    'form-select--has-label': !!props.label || !!useSlots().label,
  },
])

// ====== 方法 ======

/**
 * 切换下拉面板
 */
function toggleDropdown() {
  if (props.disabled) return

  isOpen.value = !isOpen.value

  if (isOpen.value) {
    openDropdown()
  } else {
    closeDropdown()
  }
}

/**
 * 打开下拉面板
 */
function openDropdown() {
  isOpen.value = true
  emit('dropdown-toggle', true)

  nextTick(() => {
    // 如果可搜索，聚焦到搜索框
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }

    // 设置默认激活项
    if (props.multiple && Array.isArray(props.modelValue)) {
      const firstSelectedIndex = flatOptions.value.findIndex((opt) =>
        props.modelValue.includes(opt.value)
      )
      activeIndex.value = firstSelectedIndex >= 0 ? firstSelectedIndex : 0
    } else {
      const selectedIndex = flatOptions.value.findIndex(
        (opt) => opt.value === props.modelValue
      )
      activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0
    }

    // 滚动到激活项
    scrollToActiveOption()
  })
}

/**
 * 关闭下拉面板
 */
function closeDropdown() {
  isOpen.value = false
  emit('dropdown-toggle', false)
  searchQuery.value = ''
  activeIndex.value = -1
}

/**
 * 选择选项
 */
function selectOption(option: SelectOption) {
  if (option.disabled || props.disabled) return

  if (props.multiple) {
    // 多选模式
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValues.indexOf(option.value)

    if (index >= 0) {
      // 取消选择
      currentValues.splice(index, 1)
    } else {
      // 添加选择
      currentValues.push(option.value)
    }

    emit('update:modelValue', currentValues)
    emit('change', currentValues)

    // 多选不关闭下拉
    nextTick(() => {
      scrollToActiveOption()
    })
  } else {
    // 单选模式
    emit('update:modelValue', option.value)
    emit('change', option.value)
    closeDropdown()
  }
}

/**
 * 清除选择
 */
function handleClear(event: Event) {
  event.stopPropagation()

  if (props.multiple) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    emit('update:modelValue', '')
    emit('change', '')
  }

  emit('clear')
}

/**
 * 处理搜索输入
 */
function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  activeIndex.value = 0
  emit('search', target.value)

  nextTick(() => {
    scrollToActiveOption()
  })
}

/**
 * 处理触发器点击
 */
function handleTriggerClick() {
  toggleDropdown()
}

/**
 * 处理外部点击
 */
function handleClickOutside(event: MouseEvent) {
  if (
    selectRef.value &&
    !selectRef.value.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

/**
 * 键盘导航处理
 */
function handleKeydown(event: KeyboardEvent) {
  // 打开状态下处理导航
  if (isOpen.value) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        navigateOption(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        navigateOption(-1)
        break
      case 'Enter':
        event.preventDefault()
        if (activeIndex.value >= 0 && flatOptions.value[activeIndex.value]) {
          selectOption(flatOptions.value[activeIndex.value])
        }
        break
      case 'Escape':
        event.preventDefault()
        closeDropdown()
        triggerRef.value?.focus()
        break
      case 'Home':
        event.preventDefault()
        activeIndex.value = 0
        scrollToActiveOption()
        break
      case 'End':
        event.preventDefault()
        activeIndex.value = flatOptions.value.length - 1
        scrollToActiveOption()
        break
      case 'Tab':
        closeDropdown()
        break
      default:
        // Typeahead: 字母键快速跳转
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          handleTypeahead(event.key)
        }
    }
  } else {
    // 关闭状态下的快捷键
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault()
        openDropdown()
        break
    }
  }
}

/**
 * 导航选项
 */
function navigateOption(direction: number) {
  const newIndex = activeIndex.value + direction

  if (newIndex >= 0 && newIndex < flatOptions.value.length) {
    activeIndex.value = newIndex
    scrollToActiveOption()
  }
}

/**
 * Typeahead 快速跳转
 */
function handleTypeahead(key: string) {
  const now = Date.now()

  // 如果距离上次按键超过500ms，重置字符串
  if (now - lastKeyTime > 500) {
    typeaheadString = ''
  }

  lastKeyTime = now
  typeaheadString += key.toLowerCase()

  // 查找匹配的选项
  const matchedIndex = flatOptions.value.findIndex((opt) =>
    opt.label.toLowerCase().startsWith(typeaheadString)
  )

  if (matchedIndex >= 0) {
    activeIndex.value = matchedIndex
    scrollToActiveOption()
  }

  // 清除之前的定时器
  if (typeaheadTimer) {
    clearTimeout(typeaheadTimer)
  }

  // 500ms后重置
  typeaheadTimer = setTimeout(() => {
    typeaheadString = ''
  }, 500)
}

/**
 * 滚动到激活选项
 */
function scrollToActiveOption() {
  nextTick(() => {
    if (!dropdownRef.value || activeIndex.value < 0) return

    const activeElement = dropdownRef.value.querySelector(
      `[data-option-index="${activeIndex.value}"]`
    ) as HTMLElement

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  })
}

/**
 * 失去焦点处理
 */
function handleBlur(event: FocusEvent) {
  // 延迟关闭以允许点击选项
  setTimeout(() => {
    if (
      !selectRef.value?.contains(document.activeElement) &&
      !selectRef.value?.contains(event.relatedTarget as Node)
    ) {
      closeDropdown()
      emit('blur', event)
    }
  }, 150)
}

/**
 * 移除多选标签
 */
function removeTag(value: string | number | boolean, event: Event) {
  event.stopPropagation()

  if (Array.isArray(props.modelValue)) {
    const newValues = props.modelValue.filter((v) => v !== value)
    emit('update:modelValue', newValues)
    emit('change', newValues)
  }
}

// ====== 生命周期 ======

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  if (typeaheadTimer) {
    clearTimeout(typeaheadTimer)
  }
})

// ====== 暴露方法 ======

defineExpose({
  /** 打开下拉面板 */
  open: openDropdown,
  /** 关闭下拉面板 */
  close: closeDropdown,
  /** 组件DOM引用 */
  selectRef,
})
</script>

<template>
  <div
    ref="selectRef"
    :class="wrapperClasses"
    @keydown="handleKeydown"
  >
    <!-- 触发器 -->
    <div
      ref="triggerRef"
      class="form-select__trigger"
      :tabindex="disabled ? -1 : 0"
      role="combobox"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-label="label || '选择器'"
      :aria-disabled="disabled"
      :aria-invalid="!!error"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? `option-${activeIndex}` : undefined"
      @click="handleTriggerClick"
      @blur="handleBlur"
    >
      <!-- 浮动标签 -->
      <label
        v-if="label || $slots.label"
        class="form-select__label"
      >
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="form-select__required" aria-hidden="true">*</span>
      </label>

      <!-- 选中的值显示区域 -->
      <div class="form-select__value">
        <!-- 多选标签 -->
        <template v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0">
          <span
            v-for="(value, index) in modelValue"
            :key="index"
            class="form-select__tag"
          >
            {{ getOptionLabel(value) }}
            <button
              type="button"
              class="form-select__tag-close"
              :aria-label="`移除 ${getOptionLabel(value)}`"
              @click.stop="removeTag(value, $event)"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </span>
        </template>

        <!-- 单选或空值占位符 -->
        <span
          v-else
          class="form-select__placeholder"
          :class="{ 'form-select__placeholder--visible': !hasValue }"
        >
          {{ hasValue ? selectedLabel : (placeholder || '请选择') }}
        </span>
      </div>

      <!-- 后缀图标区域 -->
      <div class="form-select__suffix">
        <!-- 清除按钮 -->
        <button
          v-if="shouldShowClear"
          type="button"
          class="form-select__clear"
          aria-label="清除选择"
          tabindex="-1"
          @click.stop="handleClear"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- 下拉箭头 -->
        <span class="form-select__arrow" :class="{ 'form-select__arrow--open': isOpen }" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- 下拉面板 -->
    <Transition name="form-select-dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="form-select__dropdown"
        role="listbox"
        :aria-label="`${label || '选择'}选项列表`"
        :aria-multiselectable="multiple"
      >
        <!-- 搜索框 -->
        <div v-if="searchable" class="form-select__search">
          <svg class="form-select__search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            ref="searchInputRef"
            type="text"
            class="form-select__search-input"
            :value="searchQuery"
            :placeholder="filterPlaceholder"
            aria-label="搜索选项"
            @input="handleSearch"
            @keydown.stop="handleKeydown"
          />
        </div>

        <!-- 选项列表 -->
        <div class="form-select__options">
          <!-- 有分组的情况 -->
          <template v-if="Object.keys(groupedOptions).length > 1 || Object.keys(groupedOptions)[0]">
            <template v-for="(groupOptions, groupName) in groupedOptions" :key="groupName">
              <!-- 分组标题 -->
              <div v-if="groupName" class="form-select__group-label">
                {{ groupName }}
              </div>

              <!-- 组内选项 -->
              <div
                v-for="(option, index) in groupOptions"
                :key="option.value"
                :data-option-index="getFlatIndex(option)"
                class="form-select__option"
                :class="{
                  'form-select__option--selected': isSelected(option.value),
                  'form-select__option--active': getFlatIndex(option) === activeIndex,
                  'form-select__option--disabled': option.disabled,
                }"
                role="option"
                :aria-selected="isSelected(option.value)"
                :aria-disabled="option.disabled"
                :tabindex="-1"
                @click="selectOption(option)"
                @mouseenter="activeIndex = getFlatIndex(option)"
              >
                <!-- 自定义选项插槽 -->
                <slot name="option" :option="option">
                  <!-- 多选checkbox -->
                  <span v-if="multiple" class="form-select__checkbox" :class="{ 'form-select__checkbox--checked': isSelected(option.value) }">
                    <svg v-if="isSelected(option.value)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>

                  <!-- 选项图标 -->
                  <span v-if="option.icon" class="form-select__option-icon">
                    <component :is="option.icon" />
                  </span>

                  <!-- 选项内容 -->
                  <div class="form-select__option-content">
                    <span class="form-select__option-label">{{ option.label }}</span>
                    <span v-if="option.description" class="form-select__option-description">
                      {{ option.description }}
                    </span>
                  </div>

                  <!-- 选中标记（单选） -->
                  <span v-if="!multiple && isSelected(option.value)" class="form-select__option-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </slot>
              </div>
            </template>
          </template>

          <!-- 无数据提示 -->
          <div v-if="filteredOptions.length === 0" class="form-select__empty">
            <slot name="empty">
              <p class="form-select__empty-text">暂无匹配选项</p>
            </slot>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 底部信息区域 -->
    <div class="form-select__footer">
      <div class="form-select__messages">
        <!-- 错误消息 -->
        <p v-if="error" class="form-select__message form-select__message--error" role="alert">
          {{ error }}
        </p>

        <!-- 成功消息 -->
        <p v-else-if="success && !error" class="form-select__message form-select__message--success" role="status">
          {{ success }}
        </p>
      </div>
    </div>
  </div>
</template>

// ====== 辅助函数 ======

/**
 * 获取选项的显示标签
 */
function getOptionLabel(value: string | number | boolean): string {
  const option = props.options.find((o) => o.value === value)
  return option ? option.label : String(value)
}

/**
 * 获取选项在过滤后列表中的索引
 */
function getFlatIndex(option: SelectOption): number {
  return flatOptions.value.findIndex((o) => o.value === option.value)
}

/**
 * 判断选项是否被选中
 */
function isSelected(value: string | number | boolean): boolean {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}
</script>

<style scoped>
/* ====== CSS变量定义（从设计令牌继承）====== */
.form-select {
  /* 颜色令牌 */
  --select-bg: #ffffff;
  --select-border-color: #F3F4F6;
  --select-border-width: 1.5px;
  --select-text-color: #111827;
  --select-placeholder-color: #9CA3AF;
  --select-focus-border-color: #93C5FD;
  --select-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.10), 0 1px 3px rgba(0, 0, 0, 0.08);
  --select-error-color: #DC2626;
  --select-error-bg: #FEF2F2;
  --select-error-shadow: 0 0 0 3px rgba(220, 38, 38, 0.10);
  --select-success-color: #16A34A;
  --select-success-bg: #F0FDF4;
  --select-disabled-bg: #F3F4F6;
  --select-disabled-border: #E5E7EB;
  --select-disabled-text: #9CA3AF;

  /* 下拉面板颜色 */
  --dropdown-bg: #ffffff;
  --dropdown-border-color: #E5E7EB;
  --dropdown-shadow: 0 10px 25px rgba(17, 24, 39, 0.12), 0 4px 10px rgba(17, 24, 39, 0.06);
  --option-hover-bg: #DBEAFE;
  --option-hover-text: #000AB0;
  --option-selected-bg: #DBEAFE;
  --option-selected-text: #000AB0;

  /* 圆角令牌 */
  --select-radius: 16px;
  --dropdown-radius: 12px;

  /* 动画时长 */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;

  /* 缓动函数 */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* 尺寸变量（通过size类覆盖） */
  --select-height: 44px;
  --select-padding-x: 1rem;
  --select-font-size: 1rem;
  --select-icon-size: 18px;
}

/* ====== 基础布局 ====== */
.form-select {
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

/* ====== 触发器样式 ====== */
.form-select__trigger {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--select-height);
  padding: 0 var(--select-padding-x);
  background: var(--select-bg);
  border: var(--select-border-width) solid var(--select-border-color);
  border-radius: var(--select-radius);
  cursor: pointer;
  transition:
    border-color var(--transition-normal) var(--ease-out),
    box-shadow var(--transition-normal) var(--ease-out),
    background-color var(--transition-normal) var(--ease-out);
  outline: none;
  overflow: hidden;

  &:hover:not(.form-select--disabled):not(.form-select--open) {
    border-color: #D1D5DB;
  }

  &:focus-visible {
    border-color: var(--select-focus-border-color);
    box-shadow: var(--select-focus-shadow);
  }
}

/* 打开状态 */
.form-select--open .form-select__trigger {
  border-color: var(--select-focus-border-color);
  border-width: 2px;
  box-shadow: var(--select-focus-shadow);
}

/* 禁用状态 */
.form-select--disabled .form-select__trigger {
  background: var(--select-disabled-bg);
  border-color: var(--select-disabled-border);
  cursor: not-allowed;
  opacity: 0.65;
}

/* 错误状态 */
.form-select--error .form-select__trigger {
  border-color: var(--select-error-color);
  border-width: 2px;
  background-color: var(--select-error-bg);
}

/* 成功状态 */
.form-select--success .form-select__trigger {
  border-color: var(--select-success-color);
  border-width: 2px;
  background-color: var(--select-success-bg);
}

/* 浮动标签 */
.form-select__label {
  position: absolute;
  left: var(--select-padding-x);
  top: 50%;
  transform: translateY(-50%);
  color: var(--select-placeholder-color);
  font-weight: 400;
  pointer-events: none;
  transition:
    all 200ms ease-out,
    transform 200ms ease-out,
    font-size 200ms ease-out;
  white-space: nowrap;
  z-index: 1;
  font-size: var(--select-font-size);
}

/* 必填标记 */
.form-select__required {
  color: var(--select-error-color);
  margin-left: 2px;
  font-weight: 600;
}

/* 有值时的标签上浮 */
.form-select--has-value .form-select__label,
.form-select--open .form-select__label {
  top: 0;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--select-focus-border-color);
  background: linear-gradient(
    to bottom,
    transparent 45%,
    var(--select-bg) 45%,
    var(--select-bg) 55%,
    transparent 55%
  );
  padding: 0 4px;
}

/* 值显示区域 */
.form-select__value {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 100%;
  padding: 0.5rem 0;
  overflow: hidden;
}

/* 占位符 */
.form-select__placeholder {
  color: var(--select-placeholder-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-select__placeholder--visible {
  color: var(--select-placeholder-color);
}

/* 多选标签 */
.form-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 120px;
  padding: 0.125rem 0.5rem;
  background: #DBEAFE;
  color: #000AB0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  animation: tagIn 0.2s ease-out;
}

.form-select__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-fast);

  &:hover {
    opacity: 1;
    background: rgba(0, 10, 176, 0.15);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 后缀区域 */
.form-select__suffix {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  flex-shrink: 0;
  color: #6B7280;
}

/* 清除按钮 */
.form-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--select-icon-size);
  height: var(--select-icon-size);
  padding: 4px;
  margin: -4px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #9CA3AF;
  cursor: pointer;
  transition: all var(--transition-fast) var(--ease-out);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #374151;
    transform: rotate(90deg);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 下拉箭头 */
.form-select__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--select-icon-size);
  height: var(--select-icon-size);
  transition: transform var(--transition-normal) var(--ease-in-out);

  svg {
    width: 100%;
    height: 100%;
  }
}

.form-select__arrow--open {
  transform: rotate(180deg);
}

/* ====== 下拉面板样式 ====== */
.form-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  min-width: 100%;
  max-height: 280px;
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border-color);
  border-radius: var(--dropdown-radius);
  box-shadow: var(--dropdown-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 搜索框 */
.form-select__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--dropdown-border-color);
}

.form-select__search-icon {
  width: 16px;
  height: 16px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.form-select__search-input {
  flex: 1;
  width: 100%;
  padding: 0.375rem 0;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--select-text-color);
  background: transparent;

  &::placeholder {
    color: var(--select-placeholder-color);
  }
}

/* 选项列表容器 */
.form-select__options {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.375rem 0;
}

/* 分组标题 */
.form-select__group-label {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #F9FAFB;
  border-top: 1px solid #F3F4F6;
  border-bottom: 1px solid #F3F4F6;
}

/* 选项样式 */
.form-select__option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition:
    background-color 150ms ease-out,
    color 150ms ease-out,
    transform 150ms ease-out;
  user-select: none;

  &:hover:not(.form-select__option--disabled) {
    background: var(--option-hover-bg);
    color: var(--option-hover-text);
  }

  &.form-select__option--active:not(.form-select__option--disabled) {
    background: var(--option-hover-bg);
    color: var(--option-hover-text);
  }

  &.form-select__option--selected {
    background: var(--option-selected-bg);
    color: var(--option-selected-text);
    font-weight: 500;

    /* 左侧指示条 */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #000AB0;
      border-radius: 0 2px 2px 0;
    }
  }

  &.form-select__option--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

/* 多选Checkbox */
.form-select__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  background: white;
  flex-shrink: 0;
  transition: all var(--transition-fast) ease-out;

  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
}

.form-select__checkbox--checked {
  background: #000AB0;
  border-color: #000AB0;
}

/* 选项图标 */
.form-select__option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 选项内容 */
.form-select__option-content {
  flex: 1;
  min-width: 0;
}

.form-select__option-label {
  display: block;
  font-size: 0.9375rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-select__option-description {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.3;
  color: #6B7280;
  margin-top: 0.125rem;
}

/* 选中标记（单选） */
.form-select__option-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #000AB0;

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 无数据提示 */
.form-select__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.form-select__empty-text {
  margin: 0;
  color: #9CA3AF;
  text-align: center;
}

/* 底部信息区域 */
.form-select__footer {
  margin-top: 0.375rem;
  min-height: 1.25rem;
}

.form-select__messages {
  display: flex;
  flex-direction: column;
}

.form-select__message {
  margin: 0;
  padding: 0;
  line-height: 1.4;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: fadeInUp 0.2s ease-out;
}

.form-select__message--error {
  color: var(--select-error-color);
  font-weight: 500;

  &::before {
    content: '⚠';
    font-size: 1em;
  }
}

.form-select__message--success {
  color: var(--select-success-color);

  &::before {
    content: '✓';
    font-size: 1em;
    font-weight: 700;
  }
}

/* ====== 尺寸规范 ====== */

/* sm - 小尺寸 (36px) */
.form-select--size-sm {
  --select-height: 36px;
  --select-padding-x: 0.75rem;
  --select-font-size: 0.875rem; /* caption (14px) */
  --select-icon-size: 16px;
  --select-radius: 12px;

  .form-select__label {
    font-size: 0.75rem;
  }

  .form-select__tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
  }

  .form-select__option {
    padding: 0.5rem 0.75rem;
  }

  .form-select__option-label {
    font-size: 0.875rem;
  }

  .form-select__option-description {
    font-size: 0.75rem;
  }

  .form-select__message {
    font-size: 0.75rem;
  }
}

/* md - 中等尺寸 (44px) - 默认 */
.form-select--size-md {
  --select-height: 44px;
  --select-padding-x: 1rem;
  --select-font-size: 1rem; /* body (16px) ⭐ */
  --select-icon-size: 18px;
  --select-radius: 16px;

  .form-select__label {
    font-size: 0.875rem;
  }

  .form-select__tag {
    font-size: 0.875rem;
  }

  .form-select__option {
    padding: 0.625rem 1rem;
  }

  .form-select__option-label {
    font-size: 0.9375rem;
  }

  .form-select__option-description {
    font-size: 0.8125rem;
  }

  .form-select__message {
    font-size: 0.8125rem;
  }
}

/* lg - 大尺寸 (52px) */
.form-select--size-lg {
  --select-height: 52px;
  --select-padding-x: 1.25rem;
  --select-font-size: 1.125rem; /* bodyLarge (18px) */
  --select-icon-size: 20px;
  --select-radius: 16px;

  .form-select__label {
    font-size: 0.9375rem;
  }

  .form-select__tag {
    font-size: 0.9375rem;
    padding: 0.25rem 0.625rem;
  }

  .form-select__option {
    padding: 0.75rem 1.25rem;
  }

  .form-select__option-label {
    font-size: 1rem;
  }

  .form-select__option-description {
    font-size: 0.875rem;
  }

  .form-select__message {
    font-size: 0.875rem;
  }
}

/* ====== 变体样式 ====== */

/* filled变体 */
.form-select--variant-filled .form-select__trigger {
  background: #F9FAFB;
  border-color: transparent;
  border-width: 0;

  &:hover:not(.form-select--disabled):not(.form-select--open) {
    background: #F3F4F6;
  }

  &.form-select--open {
    background: var(--select-bg);
    border-width: 2px;
    border-color: var(--select-focus-border-color);
    box-shadow: var(--select-focus-shadow);
  }
}

/* outlined变体 */
.form-select--variant-outlined .form-select__trigger {
  background: transparent;
  border-width: 2px;
  border-color: #E5E7EB;

  &.form-select--open {
    border-color: var(--select-focus-border-color);
    box-shadow: var(--select-focus-shadow);
  }
}

/* ====== 过渡动画 ====== */

/* 下拉面板展开/收起动画 */
.form-select-dropdown-enter-active {
  animation: dropdownIn 200ms ease-out;
}

.form-select-dropdown-leave-active {
  animation: dropdownOut 150ms ease-in;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: scaleY(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scaleY(0.95) translateY(-8px);
  }
}

/* 标签进入动画 */
@keyframes tagIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 淡入上滑 */
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

/* ====== 可访问性增强 ====== */

/* 焦点可见性 */
.form-select__trigger:focus-visible {
  outline: 2px solid var(--select-focus-border-color);
  outline-offset: 2px;
  border-radius: calc(var(--select-radius) - 2px);
}

/* 选项焦点样式 */
.form-select__option:focus {
  outline: 2px solid var(--select-focus-border-color);
  outline-offset: -2px;
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .form-select {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
  }

  .form-select-dropdown-enter-active,
  .form-select-dropdown-leave-active {
    animation-duration: 0ms;
  }

  .form-select__arrow {
    transition-duration: 0ms;
  }

  .form-select__clear:hover {
    transform: none;
  }

  .form-select__tag {
    animation: none;
  }

  .form-select__message {
    animation: none;
  }
}

/* ====== 暗色模式适配 ====== */

@media (prefers-color-scheme: dark) {
  .form-select {
    --select-bg: #1F2937;
    --select-border-color: #374151;
    --select-text-color: #F9FAFB;
    --select-placeholder-color: #6B7280;
    --select-focus-border-color: #60A5FA;
    --select-focus-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
    --select-error-bg: #450A0A;
    --select-error-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    --select-success-bg: #052E16;
    --select-disabled-bg: #111827;
    --select-disabled-border: #1F2937;
    --select-disabled-text: #4B5563;

    --dropdown-bg: #1F2937;
    --dropdown-border-color: #374151;
    --dropdown-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3);
    --option-hover-bg: #374151;
    --option-hover-text: #93C5FD;
    --option-selected-bg: #172033;
    --option-selected-text: #60A5FA;
  }

  .form-select__trigger:hover:not(.form-select--disabled):not(.form-select--open) {
    border-color: #4B5563;
  }

  .form-select__clear:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #E5E7EB;
  }

  .form-select__label {
    background: linear-gradient(
      to bottom,
      transparent 45%,
      var(--select-bg) 45%,
      var(--select-bg) 55%,
      transparent 55%
    );
  }

  .form-select__tag {
    background: #172033;
    color: #60A5FA;
  }

  .form-select__tag-close:hover {
    background: rgba(96, 165, 250, 0.2);
  }

  .form-select__checkbox {
    background: #374151;
    border-color: #4B5563;
  }

  .form-select__checkbox--checked {
    background: #3B82F6;
    border-color: #3B82F6;
  }

  .form-select__option-check {
    color: #60A5FA;
  }

  .form-select__option-selected::before {
    background: #3B82F6;
  }

  .form-select__group-label {
    color: #9CA3AF;
    background: #111827;
    border-top-color: #1F2937;
    border-bottom-color: #1F2937;
  }

  .form-select__option-description {
    color: #9CA3AF;
  }

  .form-select__empty-text {
    color: #6B7280;
  }

  .form-select__search {
    border-bottom-color: #374151;
  }

  .form-select__search-icon {
    color: #6B7280;
  }

  .form-select--variant-filled .form-select__trigger {
    background: #111827;

    &:hover:not(.form-select--disabled):not(.form-select--open) {
      background: #1F2937;
    }
  }

  .form-select--variant-outlined .form-select__trigger {
    border-color: #4B5563;
  }
}
</style>

<!--
  ====== 使用示例 ======

  ## 1. 基础单选
  ```vue
  <template>
    <FormSelect
      v-model="selected"
      :options="options"
      label="选择专业"
      placeholder="请选择..."
    />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import FormSelect from '@/components/base/FormSelect.vue'

  const selected = ref('')
  const options = [
    { value: 'cs', label: '计算机科学与技术' },
    { value: 'se', label: '软件工程' },
    { value: 'ai', label: '人工智能' },
    { value: 'ds', label: '数据科学' },
  ]
  </script>
  ```

  ## 2. 带搜索的选择器
  ```vue
  <template>
    <FormSelect
      v-model="course"
      :options="courseOptions"
      label="选择课程"
      searchable
      filter-placeholder="输入课程名称搜索..."
      size="lg"
    />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'

  const course = ref('')
  const courseOptions = [
    { value: 1, label: '高等数学', description: '必修课 · 4学分' },
    { value: 2, label: '线性代数', description: '必修课 · 3学分' },
    { value: 3, label: '概率论与数理统计', description: '必修课 · 3学分' },
    { value: 4, label: '大学物理', description: '必修课 · 4学分' },
    { value: 5, label: '程序设计基础', description: '必修课 · 4学分' },
  ]
  </script>
  ```

  ## 3. 多选模式
  ```vue
  <template>
    <FormSelect
      v-model="selectedCourses"
      :options="courses"
      label="选修课程"
      multiple
      searchable
      placeholder="可选择多个课程"
      :max-tag-count="3"
    />

    <p>已选: {{ selectedCourses.length }} 门课程</p>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'

  const selectedCourses = ref<number[]>([])
  const courses = [
    { value: 1, label: '机器学习' },
    { value: 2, label: '深度学习' },
    { value: 3, label: '自然语言处理' },
    { value: 4, label: '计算机视觉' },
    { value: 5, label: '强化学习' },
  ]
  </script>
  ```

  ## 4. 选项分组
  ```vue
  <template>
    <FormSelect
      v-model="department"
      :options="deptOptions"
      label="所属部门"
      clearable
    />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'

  const department = ref('')
  const deptOptions = [
    { value: 'cs1', label: '计算机科学系', group: '信息学院' },
    { value: 'se1', label: '软件工程系', group: '信息学院' },
    { value: 'ai1', label: '人工智能系', group: '信息学院' },
    { value: 'math1', label: '数学系', group: '理学院' },
    { value: 'phys1', label: '物理系', group: '理学院' },
    { value: 'chem1', label: '化学系', group: '理学院' },
  ]
  </script>
  ```

  ## 5. 表单验证集成
  ```vue
  <template>
    <FormSelect
      v-model="major"
      :options="majorOptions"
      label="主修专业"
      :error="errors.major"
      :success="isValidMajor ? '已选择有效专业' : undefined"
      required
      clearable
      size="lg"
    />

    <FormSelect
      v-model="minor"
      :options="minorOptions"
      label="辅修专业（可选）"
      hint="如无辅修专业可不填写"
      clearable
    />
  </template>

  <script setup lang="ts">
  import { ref, computed } from 'vue'

  const major = ref('')
  const minor = ref('')
  const errors = ref({ major: '' })

  const majorOptions = [
    { value: 'cs', label: '计算机科学' },
    { value: 'se', label: '软件工程' },
  ]

  const isValidMajor = computed(() => major.value !== '')
  </script>
  ```

  ## 6. 不同尺寸和变体
  ```vue
  <template>
    <div class="space-y-6">
      <!-- 尺寸变化 -->
      <FormSelect v-model="value1" :options="options" size="sm" label="小尺寸" />
      <FormSelect v-model="value2" :options="options" size="md" label="中等尺寸" />
      <FormSelect v-value="value3" :options="options" size="lg" label="大尺寸" />

      <!-- 变体变化 -->
      <FormSelect v-model="value4" :options="options" variant="default" label="默认" />
      <FormSelect v-model="value5" :options="options" variant="filled" label="填充" />
      <FormSelect v-model="value6" :options="options" variant="outlined" label="轮廓" />
    </div>
  </template>
  ```

  ## 7. 禁用状态
  ```vue
  <template>
    <FormSelect
      v-model="value"
      :options="options"
      label="禁用状态"
      disabled
    />
  </template>
  ```

  ## 8. 完整注册表单示例
  ```vue
  <template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <FormSelect
        v-model="form.department"
        :options="departmentOptions"
        label="所属学院"
        placeholder="请选择学院"
        :error="errors.department"
        required
        clearable
      />

      <FormSelect
        v-model="form.major"
        :options="getMajorOptions(form.department)"
        label="专业"
        placeholder="请先选择学院"
        :error="errors.major"
        required
        searchable
      />

      <FormSelect
        v-model="form.grade"
        :options="gradeOptions"
        label="年级"
        :error="errors.grade"
        required
      />

      <FormSelect
        v-model="form.interests"
        :options="interestOptions"
        label="兴趣方向"
        multiple
        searchable
        placeholder="可选择多个方向"
        hint="选择你感兴趣的研究方向"
      />

      <button type="submit">提交申请</button>
    </form>
  </template>

  <script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import FormSelect from '@/components/base/FormSelect.vue'

  const form = reactive({
    department: '',
    major: '',
    grade: '',
    interests: [] as string[],
  })

  const errors = reactive({
    department: '',
    major: '',
    grade: '',
  })

  const departmentOptions = [
    { value: 'info', label: '信息学院' },
    { value: 'science', label: '理学院' },
    { value: 'engineering', label: '工程学院' },
  ]

  function getMajorOptions(dept: string) {
    const map: Record<string, { value: string; label: string }[]> = {
      info: [
        { value: 'cs', label: '计算机科学' },
        { value: 'se', label: '软件工程' },
        { value: 'ai', label: '人工智能' },
      ],
      science: [
        { value: 'math', label: '数学' },
        { value: 'physics', label: '物理学' },
        { value: 'chemistry', label: '化学' },
      ],
      engineering: [
        { value: 'mechanical', label: '机械工程' },
        { value: 'electrical', label: '电气工程' },
        { value: 'civil', label: '土木工程' },
      ],
    }
    return map[dept] || []
  }

  const gradeOptions = [
    { value: 1, label: '大一' },
    { value: 2, label: '大二' },
    { value: 3, label: '大三' },
    { value: 4, label: '大四' },
  ]

  const interestOptions = [
    { value: 'ml', label: '机器学习' },
    { value: 'dl', label: '深度学习' },
    { value: 'nlp', label: '自然语言处理' },
    { value: 'cv', label: '计算机视觉' },
    { value: 'iot', label: '物联网' },
    { value: 'blockchain', label: '区块链' },
    { value: 'cybersecurity', label: '网络安全' },
  ]

  function handleSubmit() {
    console.log('提交:', form)
  }
  </script>
  ```
-->
