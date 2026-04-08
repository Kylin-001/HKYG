<template>
  <div class="error-fallback" :class="[`error-fallback--${type}`, { 'error-fallback--fullscreen': fullscreen }]">
    <div class="error-fallback__container">
      <!-- 错误图标 -->
      <div class="error-fallback__icon">
        <el-icon :size="iconSize" :color="iconColor">
          <component :is="iconComponent" />
        </el-icon>
      </div>

      <!-- 错误标题 -->
      <h2 class="error-fallback__title">{{ displayTitle }}</h2>

      <!-- 错误描述 -->
      <p v-if="displayMessage" class="error-fallback__message">
        {{ displayMessage }}
      </p>

      <!-- 详细错误信息 (可折叠) -->
      <el-collapse v-if="showDetails && errorDetail" class="error-fallback__details">
        <el-collapse-item :title="t('error.errorDetail')">
          <pre class="error-fallback__detail-content">{{ errorDetail }}</pre>
        </el-collapse-item>
      </el-collapse>

      <!-- 操作按钮组 -->
      <div class="error-fallback__actions">
        <el-button
          v-if="showRetry"
          type="primary"
          :icon="RefreshRight"
          :loading="retrying"
          @click="handleRetry"
        >
          {{ t('error.retry') }}
        </el-button>

        <el-button
          v-if="showRefresh"
          :icon="Refresh"
          @click="handleRefresh"
        >
          {{ t('error.refresh') }}
        </el-button>

        <el-button
          v-if="showGoBack"
          :icon="Back"
          @click="handleGoBack"
        >
          {{ t('error.goBack') }}
        </el-button>

        <el-button
          v-if="showGoHome"
          type="success"
          :icon="HomeFilled"
          @click="handleGoHome"
        >
          {{ t('error.goHome') }}
        </el-button>
      </div>

      <!-- 帮助信息 -->
      <p v-if="showHelpText" class="error-fallback__help">
        {{ helpText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  RefreshRight,
  Refresh,
  Back,
  HomeFilled,
  Warning,
  CircleClose,
  Connection,
  Lock,
  InfoFilled
} from '@element-plus/icons-vue'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'network',
  /** 服务器错误 */
  SERVER = 'server',
  /** 权限错误 */
  PERMISSION = 'permission',
  /** 未授权/未登录 */
  UNAUTHORIZED = 'unauthorized',
  /** 资源未找到 */
  NOT_FOUND = 'not_found',
  /** 业务逻辑错误 */
  BUSINESS = 'business',
  /** 未知错误 */
  UNKNOWN = 'unknown',
  /** 自定义类型 */
  CUSTOM = 'custom'
}

/**
 * 组件 Props 接口
 */
interface Props {
  /** 错误类型 */
  type?: ErrorType | string
  /** 错误标题 */
  title?: string
  /** 错误消息 */
  message?: string
  /** 详细错误信息（技术细节） */
  detail?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示返回按钮 */
  showGoBack?: boolean
  /** 是否显示返回首页按钮 */
  showGoHome?: boolean
  /** 是否全屏显示 */
  fullscreen?: boolean
  /** 是否显示详细信息 */
  showDetails?: boolean
  /** 图标大小 */
  iconSize?: number
  /** 自定义帮助文本 */
  helpText?: string
  /** 是否正在重试 */
  retrying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: ErrorType.UNKNOWN,
  title: '',
  message: '',
  detail: '',
  showRetry: true,
  showRefresh: false,
  showGoBack: true,
  showGoHome: true,
  fullscreen: false,
  showDetails: false,
  iconSize: 64,
  helpText: '',
  retrying: false
})

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'refresh'): void
  (e: 'goBack'): void
  (e: 'goHome'): void
}>()

const { t } = useI18n()
const router = useRouter()

/**
 * 根据错误类型获取对应的图标组件
 */
const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    [ErrorType.NETWORK]: Connection,
    [ErrorType.SERVER]: CircleClose,
    [ErrorType.PERMISSION]: Lock,
    [ErrorType.UNAUTHORIZED]: Lock,
    [ErrorType.NOT_FOUND]: InfoFilled,
    [ErrorType.BUSINESS]: Warning,
    [ErrorType.UNKNOWN]: CircleClose,
    [ErrorType.CUSTOM]: Warning
  }
  return iconMap[props.type] || CircleClose
})

/**
 * 根据错误类型获取图标颜色
 */
const iconColor = computed(() => {
  const colorMap: Record<string, string> = {
    [ErrorType.NETWORK]: '#F56C6C',
    [ErrorType.SERVER]: '#F56C6C',
    [ErrorType.PERMISSION]: '#E6A23C',
    [ErrorType.UNAUTHORIZED]: '#E6A23C',
    [ErrorType.NOT_FOUND]: '#909399',
    [ErrorType.BUSINESS]: '#E6A23C',
    [ErrorType.UNKNOWN]: '#909399',
    [ErrorType.CUSTOM]: '#409EFF'
  }
  return colorMap[props.type] || '#909399'
})

/**
 * 显示的标题（优先使用传入的标题，否则使用 i18n 默认值）
 */
const displayTitle = computed(() => {
  if (props.title) return props.title

  const titleMap: Record<string, string> = {
    [ErrorType.NETWORK]: t('error.networkError'),
    [ErrorType.SERVER]: t('error.serverErrorTitle'),
    [ErrorType.PERMISSION]: t('error.403'),
    [ErrorType.UNAUTHORIZED]: t('error.401'),
    [ErrorType.NOT_FOUND]: t('error.pageNotFound'),
    [ErrorType.BUSINESS]: t('error.unknownError'),
    [ErrorType.UNKNOWN]: t('error.unknownError'),
    [ErrorType.CUSTOM]: t('error.unknownError')
  }
  return titleMap[props.type] || t('error.unknownError')
})

/**
 * 显示的消息（优先使用传入的消息）
 */
const displayMessage = computed(() => {
  if (props.message) return props.message

  const messageMap: Record<string, string> = {
    [ErrorType.NETWORK]: t('error.offlineTip'),
    [ErrorType.SERVER]: t('error.serverErrorTip'),
    [ErrorType.PERMISSION]: t('error.permissionDenied'),
    [ErrorType.UNAUTHORIZED]: t('error.loginRequired'),
    [ErrorType.NOT_FOUND]: t('error.notFoundTip'),
    [ErrorType.BUSINESS]: '',
    [ErrorType.UNKNOWN]: '',
    [ErrorType.CUSTOM]: ''
  }
  return messageMap[props.type] || ''
})

/**
 * 格式化的详细错误信息
 */
const errorDetail = computed(() => {
  if (!props.detail) return ''
  try {
    // 尝试格式化 JSON
    const parsed = JSON.parse(props.detail)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return props.detail
  }
})

/**
 * 是否显示帮助文本
 */
const showHelpText = computed(() => {
  return !!props.helpText || (!props.message && !displayMessage.value)
})

/**
 * 最终的帮助文本
 */
const helpText = computed(() => {
  if (props.helpText) return props.helpText
  return t('error.contactSupport')
})

/**
 * 处理重试点击
 */
function handleRetry(): void {
  emit('retry')
}

/**
 * 处理刷新点击
 */
function handleRefresh(): void {
  emit('refresh')
  window.location.reload()
}

/**
 * 处理返回上一页
 */
function handleGoBack(): void {
  emit('goBack')
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

/**
 * 处理返回首页
 */
function handleGoHome(): void {
  emit('goHome')
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 300px;
  text-align: center;

  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: var(--el-bg-color);
    min-height: 100vh;
  }

  &__container {
    max-width: 480px;
    width: 100%;
  }

  &__icon {
    margin-bottom: 1.5rem;
    animation: errorBounce 0.6s ease-out;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 0.75rem;
    line-height: 1.4;
  }

  &__message {
    font-size: 1rem;
    color: var(--el-text-color-regular);
    margin: 0 0 1.5rem;
    line-height: 1.6;
  }

  &__details {
    margin-bottom: 1.5rem;
    text-align: left;

    :deep(.el-collapse-item__header) {
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
    }
  }

  &__detail-content {
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    padding: 1rem;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--el-text-color-secondary);
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  &__help {
    font-size: 0.875rem;
    color: var(--el-text-color-placeholder);
    margin: 0;
    line-height: 1.5;
  }

  // 不同类型的视觉变体
  &--network &__icon {
    animation: errorShake 0.5s ease-in-out;
  }

  &--server &__icon {
    animation: errorPulse 1s ease-in-out infinite;
  }
}

@keyframes errorBounce {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes errorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

// 响应式适配
@media (max-width: 480px) {
  .error-fallback {
    padding: 1.5rem 1rem;

    &__title {
      font-size: 1.25rem;
    }

    &__message {
      font-size: 0.9375rem;
    }

    &__actions {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
