<!--
@fileoverview 智能搜索筛选组件
@description 支持多条件组合搜索、保存搜索条件、搜索历史等功能
@example
  <SearchFilter
    :search-fields="searchFields"
    :default-values="defaultValues"
    @search="handleSearch"
    @reset="handleReset"
  />
-->
<template>
  <div class="search-filter" :class="{ 'compact-mode': compactMode }">
    <!-- 搜索条件区域 -->
    <div class="search-fields">
      <el-form
        ref="searchForm"
        :model="formData"
        :label-width="compactMode ? '0px' : '80px'"
        inline
        class="search-form"
      >
        <div class="search-field-container">
          <template v-for="field in searchFields" :key="field.field">
            <el-form-item
              :label="field.label"
              :prop="field.field"
              class="search-field"
              :class="`field-type-${field.type}`"
            >
              <!-- 输入框类型 -->
              <el-input
                v-if="field.type === 'input'"
                v-model="formData[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :disabled="disabled"
                @keyup.enter="handleSearch"
                clearable
              />

              <!-- 数字输入框 -->
              <el-input-number
                v-else-if="field.type === 'input-number'"
                v-model="formData[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                :disabled="disabled"
                @change="handleFieldChange(field.field, $event)"
                :class="{ 'range-input': field.range }"
              />

              <!-- 选择框 -->
              <el-select
                v-else-if="field.type === 'select'"
                v-model="formData[field.field]"
                :placeholder="field.placeholder || `请选择${field.label}`"
                :disabled="disabled"
                :multiple="field.multiple"
                :multiple-limit="field.multipleLimit"
                clearable
                @change="handleFieldChange(field.field, $event)"
                style="width: 200px"
              >
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>

              <!-- 日期选择器 -->
              <el-date-picker
                v-else-if="field.type === 'date-picker'"
                v-model="formData[field.field]"
                :type="field.range ? 'daterange' : 'date'"
                :placeholder="field.placeholder || `请选择${field.label}`"
                :format="field.format || 'YYYY-MM-DD'"
                :value-format="field.valueFormat || 'YYYY-MM-DD'"
                :disabled="disabled"
                :start-placeholder="field.startPlaceholder || '开始日期'"
                :end-placeholder="field.endPlaceholder || '结束日期'"
                clearable
                @change="handleFieldChange(field.field, $event)"
                style="width: 240px"
              />

              <!-- 单选按钮 -->
              <el-radio-group
                v-else-if="field.type === 'radio'"
                v-model="formData[field.field]"
                :disabled="disabled"
                @change="handleFieldChange(field.field, $event)"
              >
                <el-radio v-for="option in field.options" :key="option.value" :label="option.value">
                  {{ option.label }}
                </el-radio>
              </el-radio-group>

              <!-- 复选框 -->
              <el-checkbox-group
                v-else-if="field.type === 'checkbox'"
                v-model="formData[field.field]"
                :disabled="disabled"
                @change="handleFieldChange(field.field, $event)"
              >
                <el-checkbox
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>

              <!-- 自定义字段 -->
              <div v-else-if="field.type === 'custom'" class="custom-field">
                <slot
                  :name="`field-${field.field}`"
                  :field="field"
                  :value="formData[field.field]"
                  :update="value => updateFieldValue(field.field, value)"
                />
              </div>

              <!-- 默认输入框 -->
              <el-input
                v-else
                v-model="formData[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :disabled="disabled"
                clearable
              />
            </el-form-item>
          </template>
        </div>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="search-actions">
      <div class="action-group">
        <!-- 重置按钮 -->
        <el-button
          v-if="showResetButton"
          :disabled="disabled"
          @click="handleReset"
          icon="el-icon-refresh-left"
        >
          重置
        </el-button>

        <!-- 保存搜索按钮 -->
        <el-dropdown
          v-if="showSaveButton && hasSearchConditions"
          trigger="click"
          @command="handleSaveSearch"
        >
          <el-button :disabled="disabled" icon="el-icon-star-off" type="primary">
            保存搜索
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="new">保存为新搜索</el-dropdown-item>
            <el-dropdown-item
              v-for="search in savedSearches"
              :key="search.name"
              :command="`update:${search.name}`"
            >
              {{ search.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 搜索按钮 -->
        <el-button
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleSearch"
          icon="el-icon-search"
        >
          <slot name="searchButton">搜索</slot>
        </el-button>
      </div>

      <!-- 快速日期选择 -->
      <div v-if="showQuickDate" class="quick-date">
        <el-button-group>
          <el-button
            v-for="quick in quickDateOptions"
            :key="quick.label"
            size="small"
            @click="applyQuickDate(quick)"
          >
            {{ quick.label }}
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 保存的搜索列表 -->
    <div v-if="savedSearches.length > 0" class="saved-searches">
      <div class="saved-searches-header">
        <span>已保存的搜索</span>
      </div>
      <div class="saved-searches-list">
        <el-tag
          v-for="search in savedSearches"
          :key="search.name"
          class="saved-search-tag"
          closable
          @click="loadSavedSearch(search)"
          @close="removeSavedSearch(search.name)"
        >
          {{ search.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义接口
interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
}

interface SearchField {
  field: string
  label: string
  type: 'input' | 'input-number' | 'select' | 'date-picker' | 'radio' | 'checkbox' | 'custom'
  placeholder?: string
  disabled?: boolean
  options?: Array<{ label: string; value: any }>
  multiple?: boolean
  multipleLimit?: number
  range?: boolean
  min?: number
  max?: number
  step?: number
  startPlaceholder?: string
  endPlaceholder?: string
  format?: string
  valueFormat?: string
  validation?: ValidationRules
}

interface SavedSearch {
  name: string
  conditions: Record<string, any>
}

interface QuickDateOption {
  label: string
  getValue: () => [Date, Date]
}

// 定义组件属性
const props = defineProps<{
  searchFields: SearchField[]
  defaultValues?: Record<string, any>
  savedSearches?: SavedSearch[]
  showSaveButton?: boolean
  showResetButton?: boolean
  showQuickDate?: boolean
  loading?: boolean
  disabled?: boolean
  compactMode?: boolean
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'search', params: Record<string, any>): void
  (e: 'reset'): void
  (e: 'field-change', field: string, value: any): void
  (e: 'quick-date', label: string, dateRange: [Date, Date]): void
  (e: 'save-search', params: Record<string, any>, name: string): void
  (e: 'load-search', search: SavedSearch): void
  (e: 'remove-saved-search', name: string): void
}>()

// 响应式数据
const searchForm = ref()
const formData = reactive<Record<string, any>>({})
const currentValues = reactive<Record<string, any>>({})

const quickDateOptions: QuickDateOption[] = [
  {
    label: '今天',
    getValue: () => {
      const today = new Date()
      return [today, today]
    },
  },
  {
    label: '昨天',
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return [yesterday, yesterday]
    },
  },
  {
    label: '最近7天',
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    label: '最近30天',
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return [start, end]
    },
  },
]

// 计算属性
const hasSearchConditions = computed(() => {
  return Object.keys(formData).some(key => {
    const value = formData[key]
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value !== null && value !== undefined && value !== ''
  })
})

// 监听默认值变化
watch(
  () => props.defaultValues,
  () => {
    initializeFormData()
  },
  { deep: true, immediate: true }
)

// 生命周期钩子
onMounted(() => {
  initializeFormData()
})

// 初始化表单数据
const initializeFormData = () => {
  const newFormData: Record<string, any> = {}

  props.searchFields.forEach(field => {
    const defaultValue = props.defaultValues?.[field.field]

    switch (field.type) {
      case 'input':
      case 'input-number':
        newFormData[field.field] = defaultValue || null
        break
      case 'select':
        newFormData[field.field] = defaultValue || (field.multiple ? [] : null)
        break
      case 'date-picker':
        newFormData[field.field] = defaultValue || (field.range ? [] : null)
        break
      case 'radio':
        newFormData[field.field] = defaultValue || null
        break
      case 'checkbox':
        newFormData[field.field] = defaultValue || []
        break
      default:
        newFormData[field.field] = defaultValue || null
    }
  })

  // 清空现有数据
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })

  // 设置新数据
  Object.assign(formData, newFormData)
  Object.assign(currentValues, newFormData)
}

// 处理搜索
const handleSearch = () => {
  // 表单验证
  const isValid = validateForm()
  if (!isValid) {
    return
  }

  // 格式化搜索参数
  const searchParams = formatSearchParams()

  // 触发搜索事件
  emit('search', searchParams)
}

// 处理重置
const handleReset = () => {
  // 重置表单数据
  initializeFormData()

  // 触发重置事件
  emit('reset')
}

// 处理字段值变化
const handleFieldChange = (field: string, value: any) => {
  updateFieldValue(field, value)

  // 触发字段变化事件
  emit('field-change', field, value)
}

// 更新字段值
const updateFieldValue = (field: string, value: any) => {
  formData[field] = value
}

// 表单验证
const validateForm = (): boolean => {
  for (const field of props.searchFields) {
    const rules = field.validation
    if (!rules) continue

    const value = formData[field.field]

    // 必填验证
    if (rules.required) {
      if (Array.isArray(value) && value.length === 0) {
        ElMessage.warning(`请填写${field.label}`)
        return false
      }
      if (!Array.isArray(value) && (value === null || value === undefined || value === '')) {
        ElMessage.warning(`请填写${field.label}`)
        return false
      }
    }

    // 最小长度验证
    if (rules.minLength && value && value.length < rules.minLength) {
      ElMessage.warning(`${field.label}最少需要${rules.minLength}个字符`)
      return false
    }

    // 最大长度验证
    if (rules.maxLength && value && value.length > rules.maxLength) {
      ElMessage.warning(`${field.label}最多允许${rules.maxLength}个字符`)
      return false
    }
  }

  return true
}

// 格式化搜索参数
const formatSearchParams = (): Record<string, any> => {
  const params: Record<string, any> = {}

  Object.keys(formData).forEach(key => {
    const value = formData[key]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length === 0) {
        return // 跳过空数组
      }
      params[key] = value
    }
  })

  return params
}

// 应用快速日期
const applyQuickDate = (quickDate: QuickDateOption) => {
  const dateRange = quickDate.getValue()
  const dateField = props.searchFields.find(field => field.type === 'date-picker')

  if (dateField) {
    updateFieldValue(dateField.field, dateRange)
    emit('quick-date', quickDate.label, dateRange)
  }
}

// 处理保存搜索
const handleSaveSearch = (command: string) => {
  const searchParams = formatSearchParams()

  if (command === 'new') {
    ElMessageBox.prompt('请输入搜索名称:', '保存搜索', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,20}$/,
      inputErrorMessage: '搜索名称长度在 1 到 20 个字符',
    })
      .then(({ value }) => {
        emit('save-search', searchParams, value)
      })
      .catch(() => {
        ElMessage.info('已取消保存')
      })
  } else if (command.startsWith('update:')) {
    const searchName = command.substring(7)
    emit('save-search', searchParams, searchName)
  }
}

// 加载保存的搜索
const loadSavedSearch = (search: SavedSearch) => {
  // 清空现有数据
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })

  // 设置新数据
  Object.assign(formData, search.conditions)
  emit('load-search', search)
  ElMessage.success(`已加载搜索条件: ${search.name}`)
}

// 删除保存的搜索
const removeSavedSearch = (searchName: string) => {
  emit('remove-saved-search', searchName)
}

// 公共方法
defineExpose({
  resetForm: handleReset,
  getSearchParams: formatSearchParams,
  setSearchParams: (params: Record<string, any>) => {
    Object.keys(params).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        updateFieldValue(key, params[key])
      }
    })
  },
})
</script>

<style lang="scss" scoped>
.search-filter {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &.compact-mode {
    padding: 12px;

    .search-form {
      .el-form-item {
        margin-bottom: 12px;
      }
    }
  }

  .search-fields {
    margin-bottom: 16px;

    .search-field-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
    }

    .search-field {
      min-width: 200px;

      &.field-type-radio,
      &.field-type-checkbox {
        min-width: auto;
      }

      .range-input {
        display: flex;
        gap: 8px;
      }

      .custom-field {
        min-width: 200px;
      }
    }
  }

  .search-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    .action-group {
      display: flex;
      gap: 8px;
    }

    .quick-date {
      .el-button-group {
        .el-button {
          padding: 4px 12px;
          font-size: 12px;
        }
      }
    }
  }

  .saved-searches {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    .saved-searches-header {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }

    .saved-searches-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .saved-search-tag {
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-filter {
    .search-fields {
      .search-field-container {
        flex-direction: column;
        gap: 12px;
      }

      .search-field {
        width: 100%;
        min-width: auto;
      }
    }

    .search-actions {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .action-group {
        justify-content: center;
      }
    }
  }
}
</style>
