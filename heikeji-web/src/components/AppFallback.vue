<template>
  <div class="app-fallback" :class="[`app-fallback--${type}`]">
    <div class="app-fallback__content">
      <div class="app-fallback__illustration">
        <component :is="iconComponent" />
      </div>

      <h1 class="app-fallback__title">{{ title }}</h1>
      <p class="app-fallback__description">{{ description }}</p>

      <div v-if="showActions" class="app-fallback__actions">
        <el-button
          v-for="(action, index) in actions"
          :key="index"
          :type="action.type || 'primary'"
          :loading="action.loading"
          @click="action.handler"
        >
          <template #icon>
            <component :is="action.icon" />
          </template>
          {{ action.text }}
        </el-button>
      </div>

      <div v-if="type === 'offline'" class="app-fallback__status">
        <div class="app-fallback__status-item">
          <span class="app-fallback__status-label">连接状态</span>
          <el-tag :type="isOnline ? 'success' : 'danger'" size="small">
            {{ isOnline ? '已连接' : '离线' }}
          </el-tag>
        </div>
        <div v-if="lastSyncTime" class="app-fallback__status-item">
          <span class="app-fallback__status-label">最后同步</span>
          <span class="app-fallback__status-value">{{ lastSyncTime }}</span>
        </div>
      </div>

      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue'
import {
  RefreshRight,
  HomeFilled,
  WarningFilled,
  Connection,
  Lock,
  Search
} from '@element-plus/icons-vue'

interface FallbackAction {
  text: string
  handler: () => void
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: Component
  loading?: boolean
}

type FallbackType = 'error' | 'empty' | 'offline' | 'forbidden' | 'not-found' | 'network'

interface Props {
  type?: FallbackType
  title?: string
  description?: string
  showActions?: boolean
  actions?: FallbackAction[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  title: '',
  description: '',
  showActions: true,
  actions: () => []
})

const isOnline = ref(navigator.onLine)
const lastSyncTime = ref('')

const iconMap: Record<FallbackType, Component> = {
  error: WarningFilled,
  empty: Search,
  offline: Connection,
  forbidden: Lock,
  'not-found': Search,
  network: Connection
}

const defaultTitles: Record<FallbackType, string> = {
  error: '出现了一些问题',
  empty: '暂无数据',
  offline: '网络连接断开',
  forbidden: '没有访问权限',
  'not-found': '页面未找到',
  network: '网络请求失败'
}

const defaultDescriptions: Record<FallbackType, string> = {
  error: '页面加载时发生错误，请稍后重试。',
  empty: '这里还没有内容，快去添加吧！',
  offline: '请检查您的网络连接，或使用离线功能。',
  forbidden: '您没有权限访问此页面，请联系管理员。',
  'not-found': '您访问的页面不存在，可能已被删除或移动。',
  network: '无法连接到服务器，请检查网络后重试。'
}

const iconComponent = computed(() => iconMap[props.type])
const title = computed(() => props.title || defaultTitles[props.type])
const description = computed(() => props.description || defaultDescriptions[props.type])

function handleOnline(): void {
  isOnline.value = true
  lastSyncTime.value = new Date().toLocaleTimeString()
}

function handleOffline(): void {
  isOnline.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.app-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--el-bg-color-page);
}

.app-fallback__content {
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.app-fallback__illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  color: var(--el-color-info-light-5);
  transition: transform 0.3s ease;
}

.app-fallback:hover .app-fallback__illustration {
  transform: scale(1.05);
}

.app-fallback__illustration svg {
  width: 100%;
  height: 100%;
}

.app-fallback--error .app-fallback__illustration {
  color: var(--el-color-danger-light-5);
  animation: pulse-error 2s infinite;
}

.app-fallback--offline .app-fallback__illustration {
  color: var(--el-color-warning-light-5);
  animation: pulse-offline 2s infinite;
}

@keyframes pulse-error {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulse-offline {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.app-fallback__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 0.75rem;
}

.app-fallback__description {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.app-fallback__actions {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.app-fallback__status {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  font-size: 0.875rem;
}

.app-fallback__status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-fallback__status-label {
  color: var(--el-text-color-secondary);
}

.app-fallback__status-value {
  color: var(--el-text-color-regular);
  font-family: monospace;
}
</style>
