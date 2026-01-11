<!--
@fileoverview 日期范围选择器组件
@description 支持快捷日期选项、时间格式化、禁用日期设置、联动日期选择
@example
  <DateRangePicker
    v-model="dateRange"
    :shortcuts="customShortcuts"
    :disabled-dates="disabledDate"
    :format="'YYYY-MM-DD'
    @change="handleDateChange"
    @confirm="handleDateConfirm"
  />
-->
<template>
  <div class="date-range-picker">
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :shortcuts="combinedShortcuts"
      :format="format"
      :value-format="valueFormat"
      :disabled="disabled"
      :size="size"
      :editable="editable"
      :clearable="clearable"
      :placeholder="placeholder"
      :popper-class="popperClass"
      :unlink-panels="unlinkPanels"
      :prefix-icon="prefixIcon"
      :clear-icon="clearIcon"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :hide-disabled-options="hideDisabledOptions"
      :cell-class-name="cellClassName"
      :first-day-of-week="firstDayOfWeek"
      :teleported="teleported"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @calendar-change="handleCalendarChange"
      @panel-change="handlePanelChange"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { ElIcon } from 'element-plus'
import { Calendar, Close } from '@element-plus/icons-vue'

// 定义接口
interface ShortcutOption {
  text: string
  value: Date[] | (() => Date[])
  onClick?: (picker: any) => void
}

interface DateRangePickerProps {
  // 基础配置
  modelValue?: Date[]
  format?: string
  valueFormat?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  editable?: boolean
  clearable?: boolean
  placeholder?: string
  popperClass?: string
  unlinkPanels?: boolean
  // 自定义图标
  prefixIcon?: any
  clearIcon?: any
  // 显示配置
  rangeSeparator?: string
  startPlaceholder?: string
  endPlaceholder?: string
  // 快捷选项配置
  shortcuts?: ShortcutOption[]
  showDefaultShortcuts?: boolean
  // 禁用配置
  disabledDate?: (time: Date) => boolean
  disabledTime?: (date: Date | null, partial: 'start' | 'end') => Record<string, any>
  hideDisabledOptions?: boolean
  // 样式配置
  cellClassName?: (date: Date) => string
  firstDayOfWeek?: number
  teleported?: boolean
}

// 定义组件属性
const props = withDefaults(defineProps<DateRangePickerProps>(), {
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD',
  disabled: false,
  size: 'default',
  editable: true,
  clearable: true,
  placeholder: '',
  popperClass: '',
  unlinkPanels: false,
  prefixIcon: () => h(Calendar),
  clearIcon: () => h(Close),
  rangeSeparator: '至',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  shortcuts: () => [],
  showDefaultShortcuts: true,
  hideDisabledOptions: false,
  firstDayOfWeek: 7,
  teleported: true,
})

// 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: Date[]): void
  (e: 'change', value: Date[]): void
  (e: 'focus', value: Date[]): void
  (e: 'blur', value: Date[]): void
  (e: 'calendar-change', value: Date[]): void
  (e: 'panel-change', currentDate: Date, currentView: string): void
  (e: 'confirm', value: Date[]): void
}>()

// 响应式数据
const dateValue = ref<Date[]>(props.modelValue || [])

// 内置快捷选项
const defaultShortcuts: ShortcutOption[] = [
  {
    text: '今天',
    value: () => {
      const today = new Date()
      return [today, today]
    },
  },
  {
    text: '昨天',
    value: () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return [yesterday, yesterday]
    },
  },
  {
    text: '最近7天',
    value: () => {
      const today = new Date()
      const start = new Date(today)
      start.setDate(start.getDate() - 6)
      return [start, today]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const today = new Date()
      const start = new Date(today)
      start.setDate(start.getDate() - 29)
      return [start, today]
    },
  },
  {
    text: '本月',
    value: () => {
      const today = new Date()
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      return [start, today]
    },
  },
  {
    text: '上月',
    value: () => {
      const today = new Date()
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      return [start, end]
    },
  },
  {
    text: '今年',
    value: () => {
      const today = new Date()
      const start = new Date(today.getFullYear(), 0, 1)
      return [start, today]
    },
  },
]

// 合并快捷选项
const combinedShortcuts = computed(() => {
  const shortcuts = [...(props.showDefaultShortcuts ? defaultShortcuts : [])]
  if (props.shortcuts && props.shortcuts.length > 0) {
    shortcuts.push(...props.shortcuts)
  }
  return shortcuts
})

// 监听modelValue变化
watch(
  () => props.modelValue,
  newValue => {
    dateValue.value = newValue || []
  },
  { deep: true, immediate: true }
)

// 监听dateValue变化
watch(
  () => dateValue.value,
  newValue => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
  },
  { deep: true }
)

// 处理日期变化
const handleChange = (value: Date[]) => {
  emit('change', value)
}

// 处理焦点事件
const handleFocus = (value: Date[]) => {
  emit('focus', value)
}

// 处理失焦事件
const handleBlur = (value: Date[]) => {
  emit('blur', value)
}

// 处理日历变化
const handleCalendarChange = (value: Date[]) => {
  emit('calendar-change', value)
}

// 处理面板变化
const handlePanelChange = (currentDate: Date, currentView: string) => {
  emit('panel-change', currentDate, currentView)
}

// 处理确认事件
const handleConfirm = (value: Date[]) => {
  emit('confirm', value)
}
</script>

<style lang="scss" scoped>
.date-range-picker {
  display: inline-block;
  width: 100%;

  // 自定义样式
  :deep(.el-date-editor) {
    width: 100%;

    // 输入框样式
    .el-input__wrapper {
      border-radius: 4px;

      &:hover {
        box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2) inset;
      }
    }

    // 输入框内容
    .el-date-editor__input {
      .el-date-editor__input-text {
        font-size: 14px;
        color: #303133;
      }

      .el-input__inner {
        font-size: 14px;
      }
    }

    // 前缀图标
    .el-input__prefix {
      color: #c0c4cc;

      .el-icon {
        font-size: 16px;
      }
    }

    // 清除图标
    .el-input__suffix {
      .el-input__clear {
        color: #c0c4cc;

        &:hover {
          color: #909399;
        }
      }
    }
  }

  // 快捷选项样式
  :deep(.el-picker-panel__shortcuts) {
    .el-picker-panel__shortcut {
      font-size: 14px;
      color: #606266;

      &:hover {
        background-color: #ecf5ff;
        color: #409eff;
      }

      &.is-active {
        background-color: #ecf5ff;
        color: #409eff;
      }
    }
  }

  // 日历面板样式
  :deep(.el-picker-panel) {
    .el-picker-panel__body {
      .el-date-range-picker__header {
        .el-date-range-picker__content {
          .el-date-range-picker__header-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .el-picker-panel__content {
        .el-month-table,
        .el-year-table,
        .el-date-table {
          th,
          td {
            font-size: 14px;
          }
        }

        .el-date-table {
          .el-date-table__row {
            .el-date-table__cell {
              .el-date-table__text {
                &:hover {
                  background-color: #ecf5ff;
                }

                &.is-today {
                  color: #409eff;
                }

                &.is-selected {
                  background-color: #409eff;
                  color: #fff;
                }

                &.is-disabled {
                  color: #c0c4cc;
                }
              }
            }
          }
        }
      }
    }

    // 时间选择器样式
    .el-picker-panel__footer {
      .el-time-panel {
        .el-time-spinner {
          .el-time-spinner__wrapper {
            .el-time-spinner__list {
              .el-time-spinner__item {
                font-size: 14px;

                &:hover {
                  background-color: #ecf5ff;
                }

                &.is-active {
                  background-color: #409eff;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .date-range-picker {
    :deep(.el-date-editor) {
      .el-input__wrapper {
        padding: 0 12px;
      }

      .el-date-editor__input {
        .el-date-editor__input-text {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
