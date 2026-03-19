<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="isMobile ? '80px' : labelWidth"
    :inline="!isMobile && inline"
    :size="size"
    :disabled="disabled"
    :validate-on-rule-change="validateOnRuleChange"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    @submit.prevent="handleSubmit"
  >
    <el-row :gutter="isMobile ? 0 : 20">
      <template v-for="item in items" :key="item.prop">
        <el-col
          v-if="!item.hidden"
          :xs="24"
          :sm="item.span || 24"
          :md="item.span || 12"
          :lg="item.span || 8"
          :xl="item.span || 6"
        >
          <el-form-item :label="item.label" :prop="item.prop">
            <template v-if="item.type === 'input'">
              <el-input
                v-model="formData[item.prop]"
                :type="item.inputType || 'text'"
                :placeholder="item.placeholder"
                :clearable="item.clearable !== false"
                :disabled="item.disabled"
                :readonly="item.readonly"
                :maxlength="item.maxlength"
                :minlength="item.minlength"
                :show-password="item.showPassword"
                :prefix-icon="item.prefixIcon"
                :suffix-icon="item.suffixIcon"
                @change="handleChange(item.prop)"
              >
                <template v-if="item.prepend" #prepend>{{ item.prepend }}</template>
                <template v-if="item.append" #append>{{ item.append }}</template>
              </el-input>
            </template>

            <template v-else-if="item.type === 'textarea'">
              <el-input
                v-model="formData[item.prop]"
                type="textarea"
                :placeholder="item.placeholder"
                :rows="item.rows || 3"
                :clearable="item.clearable !== false"
                :disabled="item.disabled"
                :readonly="item.readonly"
                :maxlength="item.maxlength"
                :show-word-limit="item.showWordLimit"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'number'">
              <el-input-number
                v-model="formData[item.prop]"
                :placeholder="item.placeholder"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :precision="item.precision"
                :controls-position="isMobile ? '' : item.controlsPosition"
                :disabled="item.disabled"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'select'">
              <el-select
                v-model="formData[item.prop]"
                :placeholder="item.placeholder"
                :clearable="item.clearable !== false"
                :filterable="item.filterable"
                :multiple="item.multiple"
                :collapse-tags="item.collapseTags"
                :disabled="item.disabled"
                @change="handleChange(item.prop)"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </template>

            <template v-else-if="item.type === 'date'">
              <el-date-picker
                v-model="formData[item.prop]"
                :type="item.dateType || 'date'"
                :placeholder="item.placeholder"
                :clearable="item.clearable !== false"
                :disabled="item.disabled"
                :format="item.format"
                :value-format="item.valueFormat"
                :shortcuts="item.shortcuts"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'daterange'">
              <el-date-picker
                v-model="formData[item.prop]"
                type="daterange"
                :placeholder="item.placeholder || ['开始日期', '结束日期']"
                :clearable="item.clearable !== false"
                :disabled="item.disabled"
                :format="item.format"
                :value-format="item.valueFormat"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'switch'">
              <el-switch
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'radio'">
              <el-radio-group
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                @change="handleChange(item.prop)"
              >
                <el-radio v-for="option in item.options" :key="option.value" :label="option.value">
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </template>

            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                @change="handleChange(item.prop)"
              >
                <el-checkbox
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
            </template>

            <template v-else-if="item.type === 'slider'">
              <el-slider
                v-model="formData[item.prop]"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :show-stops="item.showStops"
                :disabled="item.disabled"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'time'">
              <el-time-picker
                v-model="formData[item.prop]"
                :placeholder="item.placeholder"
                :clearable="item.clearable !== false"
                :disabled="item.disabled"
                :format="item.format"
                :value-format="item.valueFormat"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'cascader'">
              <el-cascader
                v-model="formData[item.prop]"
                :options="item.options"
                :placeholder="item.placeholder"
                :clearable="item.clearable !== false"
                :filterable="item.filterable"
                :disabled="item.disabled"
                :props="item.props"
                @change="handleChange(item.prop)"
              />
            </template>

            <template v-else-if="item.type === 'slot'">
              <slot :name="item.prop" :item="item" :model-value="formData[item.prop]" />
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-form-item v-if="showActions">
      <el-button type="primary" @click="handleSubmit">
        {{ submitText }}
      </el-button>
      <el-button @click="handleReset">{{ resetText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useResponsive } from '@/utils/responsive'
import type { FormInstance, FormRules } from 'element-plus'

interface FormItem {
  prop: string
  label: string
  type: string
  hidden?: boolean
  span?: number
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  minlength?: number
  showPassword?: boolean
  prefixIcon?: string
  suffixIcon?: string
  prepend?: string
  append?: string
  inputType?: string
  rows?: number
  showWordLimit?: boolean
  min?: number
  max?: number
  step?: number
  precision?: number
  controlsPosition?: 'right'
  filterable?: boolean
  multiple?: boolean
  collapseTags?: boolean
  dateType?: string
  format?: string
  valueFormat?: string
  shortcuts?: Array<{ text: string; value: Date | [Date, Date] }>
  activeText?: string
  inactiveText?: string
  showStops?: boolean
  props?: object
  options?: Array<{ label: string; value: any; disabled?: boolean }>
}

interface Props {
  modelValue?: Record<string, any>
  items?: FormItem[]
  rules?: FormRules
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  inline?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  validateOnRuleChange?: boolean
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  showActions?: boolean
  submitText?: string
  resetText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  items: () => [],
  rules: () => ({}),
  labelPosition: 'right',
  labelWidth: '120px',
  inline: false,
  size: 'default',
  disabled: false,
  validateOnRuleChange: true,
  showMessage: true,
  inlineMessage: false,
  statusIcon: false,
  showActions: true,
  submitText: '提交',
  resetText: '重置',
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  submit: [formData: Record<string, any>]
  reset: []
  change: [prop: string, value: any]
}>()

const { isMobile } = useResponsive()

const formRef = ref<FormInstance>()
const formData = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  val => {
    formData.value = { ...val }
  },
  { deep: true }
)

watch(
  formData,
  val => {
    emit('update:modelValue', val)
  },
  { deep: true }
)

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', formData.value)
  } catch (error) {
    console.log('Form validation failed:', error)
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

const handleChange = (prop: string) => {
  emit('change', prop, formData.value[prop])
}

const validate = () => {
  return formRef.value?.validate()
}

const resetFields = () => {
  formRef.value?.resetFields()
}

const clearValidate = () => {
  formRef.value?.clearValidate()
}

defineExpose({
  formRef,
  formData,
  validate,
  resetFields,
  clearValidate,
})
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  .el-form {
    .el-form-item {
      margin-bottom: 16px;

      .el-input,
      .el-select,
      .el-date-editor,
      .el-input-number {
        width: 100% !important;
      }
    }
  }
}
</style>
