<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    :width="dialogWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :before-close="handleClose"
    :class="['error-dialog', `error-dialog--${errorSeverity}`]"
    append-to-body
    destroy-on-close
  >
    <!-- 错误图标和基本信息 -->
    <div class="error-dialog__header-content">
      <div class="error-dialog__icon-wrapper">
        <el-icon :size="48" :color="iconColor">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <div class="error-dialog__basic-info">
        <h3 class="error-dialog__title">{{ displayTitle }}</h3>
        <p v-if="displayMessage" class="error-dialog__message">
          {{ displayMessage }}
        </p>
      </div>
    </div>

    <!-- 严重级别标识 -->
    <el-tag
      v-if="showSeverity"
      :type="severityTagType"
      size="small"
      class="error-dialog__severity-tag"
    >
      {{ severityLabel }}
    </el-tag>

    <!-- 错误详情（可折叠） -->
    <el-collapse
      v-if="error && error.technicalDetail"
      v-model="detailExpanded"
      class="error-dialog__detail-section"
    >
      <el-collapse-item :name="'detail'">
        <template #title>
          <span class="error-dialog__detail-toggle">
            <el-icon><Document /></el-icon>
            {{ t('error.errorDetail') }}
          </span>
        </template>
        <div class="error-dialog__detail-content">
          <pre>{{ formattedDetail }}</pre>

          <!-- 额外的上下文信息 -->
          <div
            v-if="error.context && Object.keys(error.context).length > 0"
            class="error-dialog__context"
          >
            <h4>{{ t('error.errorContext') }}</h4>
            <dl class="error-dialog__context-list">
              <template v-for="(value, key) in error.context" :key="key">
                <dt>{{ key }}</dt>
                <dd>{{ formatContextValue(value) }}</dd>
              </template>
            </dl>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 建议操作提示 -->
    <div
      v-if="suggestionText"
      class="error-dialog__suggestion"
    >
      <el-icon><InfoFilled /></el-icon>
      <span>{{ suggestionText }}</span>
    </div>

    <!-- 时间戳 -->
    <div v-if="error && showTimestamp" class="error-dialog__timestamp">
      {{ t('error.errorTime') }}: {{ formattedTimestamp }}
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="error-dialog__footer">
        <!-- 左侧：次要操作 -->
        <div class="error-dialog__footer-secondary">
          <el-button
            v-if="showCopyButton"
            text
            type="info"
            size="small"
            @click="copyErrorDetail"
          >
            <el-icon><CopyDocument /></el-icon>
            {{ t('error.copyError') }}
          </el-button>

          <el-button
            v-if="error?.technicalDetail"
            text
            type="info"
            size="small"
            @click="toggleDetail"
          >
            <el-icon><View /></el-icon>
            {{ detailExpanded.includes('detail') ? t('error.hideDetail') : t('error.showDetail') }}
          </el-button>
        </div>

        <!-- 右侧：主要操作 -->
        <div class="error-dialog__footer-primary">
          <el-button @click="handleClose">
            {{ closeButtonText }}
          </el-button>

          <el-button
            v-if="showRetryButton && error?.retryable"
            type="primary"
            :loading="retrying"
            @click="handleRetry"
          >
            <el-icon><RefreshRight /></el-icon>
            {{ t('error.retry') }}
          </el-button>

          <el-button
            v-if="showActionButton"
            :type="actionButtonType"
            @click="handleAction"
          >
            <component :is="actionIcon" />
            {{ actionButtonText }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/locales'
import { ElMessage } from 'element-plus'
import {
  Warning,
  CircleClose,
  Connection,
  Lock,
  InfoFilled,
  Document,
  CopyDocument,
  View,
  RefreshRight,
  Back,
  HomeFilled,
  Refresh,
  User,
  Phone
} from '@element-plus/icons-vue'
import type { ClassifiedError, ErrorSeverity, ErrorCategory } from '@/utils/errorHandler'

/**
 * 组件 Props 接口
 */
interface Props {
  /** 控制对话框显示/隐藏（v-model） */
  modelValue: boolean
  /** 分类后的错误对象 */
  error?: ClassifiedError | null
  /** 对话框宽度 */
  width?: string | number
  /** 是否显示严重级别标签 */
  showSeverity?: boolean
  /** 是否显示时间戳 */
  showTimestamp?: boolean
  /** 是否显示复制按钮 */
  showCopyButton?: boolean
  /** 是否显示重试按钮（如果错误可重试） */
  showRetryButton?: boolean
  /** 是否显示建议操作按钮 */
  showActionButton?: boolean
  /** 自定义关闭按钮文本 */
  closeButtonText?: string
  /** 是否正在重试 */
  retrying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  error: null,
  width: 560,
  showSeverity: true,
  showTimestamp: true,
  showCopyButton: true,
  showRetryButton: true,
  showActionButton: true,
  closeButtonText: '',
  retrying: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'retry'): void
  (e: 'action'): void
  (e: 'close'): void
  (e: 'copy'): void
}>()

const { t, locale } = useI18n()

// 内部状态
const detailExpanded = ref<string[]>([])

/**
 * 双向绑定可见性
 */
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

/**
 * 对话框宽度
 */
const dialogWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})

/**
 * 错误严重级别
 */
const errorSeverity = computed<ErrorSeverity>(() =>
  props.error?.severity || 'error'
)

/**
 * 根据严重级别获取对应的图标组件
 */
const iconComponent = computed(() => {
  if (!props.error) return CircleClose

  const categoryIconMap: Record<ErrorCategory, any> = {
    network: Connection,
    http: CircleClose,
    business: Warning,
    authentication: Lock,
    authorization: Lock,
    validation: Warning,
    not_found: InfoFilled,
    server: CircleClose,
    timeout: Connection,
    unknown: CircleClose
  }

  return categoryIconMap[props.error.category] || CircleClose
})

/**
 * 图标颜色
 */
const iconColor = computed(() => {
  const colorMap: Record<ErrorSeverity, string> = {
    info: '#409EFF',
    warning: '#E6A23C',
    error: '#F56C6C',
    fatal: '#F56C6C'
  }
  return colorMap[errorSeverity.value] || '#909399'
})

/**
 * 对话框标题
 */
const dialogTitle = computed(() => {
  return t('error.dialogTitle')
})

/**
 * 显示的标题
 */
const displayTitle = computed(() => {
  if (!props.error) return t('error.unknownError')
  if (props.error.userTitle) return props.error.userTitle

  // 根据 category 和 statusCode 映射到 i18n key
  const titleKeyMap: Record<string, string> = {
    [`network`]: 'error.networkError',
    [`server`]: 'error.serverErrorTitle',
    [`authentication`]: 'error.401',
    [`authorization`]: 'error.403',
    [`not_found`]: 'error.pageNotFound',
    [`timeout`]: 'error.timeoutError',
    [`validation`]: 'error.400',
    [`business`]: 'error.businessError',
    [`unknown`]: 'error.unknownError'
  }

  const key = props.error.statusCode
    ? `error.${props.error.statusCode}`
    : titleKeyMap[props.error.category] || 'error.unknownError'

  return t(key)
})

/**
 * 显示的消息
 */
const displayMessage = computed(() => {
  if (!props.error) return ''
  if (props.error.userMessage) return props.error.userMessage

  const msgKeyMap: Record<ErrorCategory, string> = {
    network: 'error.offlineTip',
    http: 'error.serverErrorTip',
    authentication: 'error.loginRequired',
    authorization: 'error.permissionDenied',
    not_found: 'error.notFoundTip',
    timeout: 'error.timeoutError',
    validation: 'error.validationFailed',
    business: 'error.businessError',
    unknown: 'error.unknownError',
    server: 'error.serverErrorTip'
  }

  return t(msgKeyMap[props.error.category] || 'error.unknownError')
})

/**
 * 严重级别标签类型
 */
const severityTagType = computed(() => {
  const typeMap: Record<ErrorSeverity, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    info: 'info',
    warning: 'warning',
    error: 'danger',
    fatal: 'danger'
  }
  return typeMap[errorSeverity.value] || 'danger'
})

/**
 * 严重级别标签文本
 */
const severityLabel = computed(() => {
  const labelMap: Record<ErrorSeverity, string> = {
    info: t('error.severityInfo'),
    warning: t('error.severityWarning'),
    error: t('error.severityError'),
    fatal: t('error.severityFatal')
  }
  return labelMap[errorSeverity.value] || ''
})

/**
 * 格式化的详细错误信息
 */
const formattedDetail = computed(() => {
  if (!props.error?.technicalDetail) return ''

  try {
    // 尝试格式化 JSON
    const parsed = JSON.parse(props.error.technicalDetail)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return props.error.technicalDetail
  }
})

/**
 * 格式化的时间戳
 */
const formattedTimestamp = computed(() => {
  if (!props.error?.timestamp) return ''

  const date = new Date(props.error.timestamp)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  return date.toLocaleString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', options)
})

/**
 * 建议操作的文本描述
 */
const suggestionText = computed(() => {
  if (!props.error?.suggestedAction || props.error.suggestedAction === 'none') return ''

  const suggestionMap: Record<string, string> = {
    retry: t('error.suggestionRetry'),
    refresh: t('error.suggestionRefresh'),
    goBack: t('error.suggestionGoBack'),
    goHome: t('error.suggestionGoHome'),
    login: t('error.suggestionLogin'),
    contact: t('error.suggestionContact')
  }

  return suggestionMap[props.error.suggestedAction] || ''
})

/**
 * 操作按钮类型
 */
const actionButtonType = computed(() => {
  if (!props.error?.suggestedAction) return 'primary'

  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    retry: 'primary',
    refresh: 'warning',
    goBack: 'info',
    goHome: 'success',
    login: 'warning',
    contact: 'info'
  }

  return typeMap[props.error.suggestedAction] || 'primary'
})

/**
 * 操作按钮图标
 */
const actionIcon = computed(() => {
  if (!props.error?.suggestedAction) return RefreshRight

  const iconMap: Record<string, any> = {
    retry: RefreshRight,
    refresh: Refresh,
    goBack: Back,
    goHome: HomeFilled,
    login: User,
    contact: Phone
  }

  return iconMap[props.error.suggestedAction] || RefreshRight
})

/**
 * 操作按钮文本
 */
const actionButtonText = computed(() => {
  if (!props.error?.suggestedAction) return t('error.retry')

  const textMap: Record<string, string> = {
    retry: t('error.retry'),
    refresh: t('error.refresh'),
    goBack: t('error.goBack'),
    goHome: t('error.goHome'),
    login: t('error.goToLogin'),
    contact: t('error.contactSupport')
  }

  return textMap[props.error.suggestedAction] || t('error.retry')
})

/**
 * 关闭按钮文本
 */
const closeButtonComputedText = computed(() => {
  return props.closeButtonText || t('common.close') || '关闭'
})

/**
 * 处理关闭对话框
 */
function handleClose(): void {
  emit('update:modelValue', false)
  emit('close')
}

/**
 * 处理重试
 */
function handleRetry(): void {
  emit('retry')
}

/**
 * 处理建议的操作
 */
function handleAction(): void {
  emit('action')

  // 如果是简单的导航类操作，可以直接执行
  if (props.error?.suggestedAction === 'refresh') {
    window.location.reload()
  }
}

/**
 * 切换详细信息展开/折叠
 */
function toggleDetail(): void {
  if (detailExpanded.value.includes('detail')) {
    detailExpanded.value = []
  } else {
    detailExpanded.value = ['detail']
  }
}

/**
 * 复制错误详情到剪贴板
 */
async function copyErrorDetail(): Promise<void> {
  if (!props.error) return

  const textToCopy = [
    `[${errorSeverity.value.toUpperCase()}] ${displayTitle.value}`,
    displayMessage.value ? `\nMessage: ${displayMessage.value}` : '',
    `\nTime: ${formattedTimestamp.value}`,
    props.error.statusCode ? `\nStatus Code: ${props.error.statusCode}` : '',
    props.error.errorCode ? `\nError Code: ${props.error.errorCode}` : '',
    props.error.category ? `\nCategory: ${props.error.category}` : '',
    '\n--- Detail ---',
    formattedDetail.value
  ].filter(Boolean).join('\n')

  try {
    await navigator.clipboard.writeText(textToCopy)
    ElMessage.success(t('error.copySuccess'))
    emit('copy')
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = textToCopy
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      document.execCommand('copy')
      ElMessage.success(t('error.copySuccess'))
      emit('copy')
    } catch {
      ElMessage.error(t('error.copyFailed'))
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

/**
 * 格式化上下文值
 */
function formatContextValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

// 监听 error 变化，自动重置详情展开状态
watch(
  () => props.error,
  () => {
    detailExpanded.value = []
  }
)

// 当对话框打开时，如果有详情信息，默认不展开
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      detailExpanded.value = []
    }
  }
)
</script>

<style scoped lang="scss">
.error-dialog {
  &__header-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__icon-wrapper {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-fill-color-light);
  }

  &__basic-info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }

  &__message {
    font-size: 0.9375rem;
    color: var(--el-text-color-regular);
    margin: 0;
    line-height: 1.6;
  }

  &__severity-tag {
    margin-bottom: 1rem;
  }

  &__detail-section {
    margin-bottom: 1rem;

    :deep(.el-collapse-item__header) {
      font-size: 0.875rem;
      height: 36px;
      line-height: 36px;
    }

    :deep(.el-collapse-item__content) {
      padding-bottom: 0;
    }
  }

  &__detail-toggle {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--el-color-info);
    font-size: 0.875rem;

    .el-icon {
      font-size: 1rem;
    }
  }

  &__detail-content {
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
    padding: 1rem;

    pre {
      margin: 0 0 1rem;
      padding: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--el-text-color-secondary);
      white-space: pre-wrap;
      word-break: break-all;
      overflow-x: auto;
      max-height: 250px;
      overflow-y: auto;
    }
  }

  &__context {
    h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 0.5rem;
    }
  }

  &__context-list {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.375rem 1rem;

    dt {
      font-weight: 500;
      color: var(--el-text-color-secondary);
      font-size: 0.8125rem;
    }

    dd {
      margin: 0;
      color: var(--el-text-color-primary);
      font-size: 0.8125rem;
      word-break: break-all;
      font-family: 'Monaco', 'Menlo', monospace;
    }
  }

  &__suggestion {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--el-color-info-light-9);
    border-radius: 6px;
    border-left: 3px solid var(--el-color-info);
    margin-bottom: 1rem;

    .el-icon {
      color: var(--el-color-info);
      margin-top: 2px;
      flex-shrink: 0;
    }

    span {
      font-size: 0.875rem;
      color: var(--el-text-color-regular);
      line-height: 1.5;
    }
  }

  &__timestamp {
    font-size: 0.8125rem;
    color: var(--el-text-color-placeholder);
    text-align: right;
    margin-bottom: 0;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__footer-secondary {
    display: flex;
    gap: 0.5rem;
  }

  &__footer-primary {
    display: flex;
    gap: 0.5rem;
  }

  // 不同严重级别的视觉变体
  &--info {
    .error-dialog__icon-wrapper {
      background-color: var(--el-color-info-light-9);
    }
  }

  &--warning {
    .error-dialog__icon-wrapper {
      background-color: var(--el-color-warning-light-9);
    }

    .error-dialog__suggestion {
      background-color: var(--el-color-warning-light-9);
      border-left-color: var(--el-color-warning);

      .el-icon {
        color: var(--el-color-warning);
      }
    }
  }

  &--error,
  &--fatal {
    .error-dialog__icon-wrapper {
      background-color: var(--el-color-danger-light-9);
    }

    .error-dialog__suggestion {
      background-color: var(--el-color-danger-light-9);
      border-left-color: var(--el-color-danger);

      .el-icon {
        color: var(--el-color-danger);
      }
    }
  }
}

// 响应式适配
@media (max-width: 640px) {
  .error-dialog {
    &__header-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    &__icon-wrapper {
      width: 80px;
      height: 80px;
    }

    &__footer {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }

    &__footer-secondary,
    &__footer-primary {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
