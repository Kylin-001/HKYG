import { ref, reactive, computed, type Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

interface FieldRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  patternMessage?: string
  custom?: (value: unknown) => boolean | string
  validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
}

type RulesConfig = Record<string, FieldRule | FieldRule[]>

export function useFormValidation<T extends Record<string, unknown>>(initialValues: T, rules: RulesConfig) {
  const formRef = ref<FormInstance | null>(null)
  const formData = reactive<T>({ ...initialValues })
  const errors = reactive<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isValid = computed(() => Object.keys(errors).length === 0)

  const elementPlusRules = computed<FormRules>(() => {
    const result: FormRules = {}

    for (const [field, fieldRules] of Object.entries(rules)) {
      const rulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
      
      result[field] = rulesArray.map((rule) => ({
        required: rule.required,
        message: rule.message || `${field} is required`,
        trigger: 'blur',
        min: rule.min,
        max: rule.max,
        pattern: rule.pattern,
        message: rule.patternMessage || rule.message,
        validator: rule.validator || rule.custom ? (
          (_rule: unknown, value: unknown, callback: (error?: Error) => void) => {
            if (rule.custom && typeof rule.custom === 'function') {
              const result = rule.custom(value)
              if (result === false) {
                callback(new Error(rule.message || 'Validation failed'))
                return
              }
              if (typeof result === 'string') {
                callback(new Error(result))
                return
              }
            }
            if (rule.validator) {
              rule.validator(_rule, value, callback)
              return
            }
            callback()
          }
        ) : undefined,
      }))
    }

    return result
  })

  function validateField(fieldName: string): Promise<boolean> {
    return new Promise((resolve) => {
      formRef.value?.validateField(fieldName, (isValid, invalidFields) => {
        if (!isValid && invalidFields) {
          for (const field of Object.keys(invalidFields)) {
            errors[field] = (invalidFields as any)[field]?.[0]?.message || 'Validation error'
          }
        } else {
          delete errors[fieldName]
        }

        resolve(isValid)
      }) ?? resolve(true)
    })
  }

  async function validate(): Promise<ValidationResult> {
    try {
      await formRef.value?.validate()
      return { valid: true, errors: {} }
    } catch (err: unknown) {
      const errorObj = err as { [key: string]: any[] }
      const newErrors: Record<string, string> = {}

      for (const [field, messages] of Object.entries(errorObj)) {
        if (Array.isArray(messages) && messages.length > 0) {
          newErrors[field] = messages[0].message || 'Validation error'
        }
      }

      Object.assign(errors, newErrors)

      return { valid: false, errors: newErrors }
    }
  }

  function resetForm(): void {
    formRef.value?.resetFields()
    Object.assign(formData, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
  }

  function clearErrors(): void {
    Object.keys(errors).forEach(key => delete errors[key])
    formRef.value?.clearValidate()
  }

  function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
    ;(formData as any)[field] = value
    validateField(field as string)
  }

  function getFieldValue<K extends keyof T>(field: K): T[K] {
    return formData[field]
  }

  function getFieldError(fieldName: string): string | undefined {
    return errors[fieldName]
  }

  function hasError(fieldName: string): boolean {
    return fieldName in errors
  }

  async function submit(handler: (data: T) => Promise<void> | void): Promise<ValidationResult> {
    isSubmitting.value = true

    try {
      const validation = await validate()

      if (!validation.valid) {
        return validation
      }

      await handler({ ...formData } as T)

      return { valid: true, errors: {} }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formRef,
    formData,
    errors,
    isSubmitting,
    isValid,
    elementPlusRules,
    validate,
    validateField,
    resetForm,
    clearErrors,
    setFieldValue,
    getFieldValue,
    getFieldError,
    hasError,
    submit,
  }
}

export const commonValidators = {
  required(message?: string): FieldRule {
    return { required: true, message: message || 'This field is required' }
  },

  email(message?: string): FieldRule {
    return {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: message || 'Please enter a valid email address',
    }
  },

  phone(message?: string): FieldRule {
    return {
      pattern: /^1[3-9]\d{9}$/,
      patternMessage: message || 'Please enter a valid phone number',
    }
  },

  password(minLength = 6, maxLength = 20): FieldRule {
    return {
      min: minLength,
      max: maxLength,
      message: `Password must be between ${minLength} and ${maxLength} characters`,
      custom: (value: unknown) => {
        if (typeof value !== 'string') return false
        if (value.length < minLength || value.length > maxLength) return false
        return true
      },
    }
  },

  confirmPassword(passwordFieldName: string, message?: string): FieldRule {
    return {
      validator: (rule: unknown, value: unknown, callback: (error?: Error) => void) => {
        if (!value) {
          callback(new Error(message || 'Please confirm your password'))
          return
        }
        
        const passwordValue = (rule as any)?.form?.[passwordFieldName]
        if (passwordValue && value !== passwordValue) {
          callback(new Error('Passwords do not match'))
          return
        }
        
        callback()
      },
    }
  },

  url(message?: string): FieldRule {
    return {
      pattern: /^https?:\/\/.+/,
      patternMessage: message || 'Please enter a valid URL',
    }
  },

  number(min?: number, max?: number, message?: string): FieldRule {
    return {
      custom: (value: unknown) => {
        if (value === '' || value === null || value === undefined) return true
        
        const num = Number(value)
        if (isNaN(num)) return 'Please enter a valid number'
        if (min !== undefined && num < min) return `Value must be at least ${min}`
        if (max !== undefined && num > max) return `Value must be at most ${max}`
        
        return true
      },
    }
  },

  minLength(length: number, message?: string): FieldRule {
    return {
      min: length,
      message: message || `Minimum length is ${length}`,
    }
  },

  maxLength(length: number, message?: string): FieldRule {
    return {
      max: length,
      message: message || `Maximum length is ${length}`,
    }
  },

  chineseName(message?: string): FieldRule {
    return {
      pattern: /^[\u4e00-\u9fa5]{2,8}$/,
      patternMessage: message || 'Please enter a valid Chinese name',
    }
  },

  studentId(message?: string): FieldRule {
    return {
      pattern: /^\d{10,12}$/,
      patternMessage: message || 'Please enter a valid student ID',
    }
  },

  idCard(message?: string): FieldRule {
    return {
      pattern: /^\d{17}[\dXx]$/,
      patternMessage: message || 'Please enter a valid ID card number',
    }
  },
}
