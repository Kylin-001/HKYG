<template>
  <div
    v-if="isVisible"
    class="performance-panel"
    :class="{ 'performance-panel--collapsed': isCollapsed }"
  >
    <!-- 头部 -->
    <div class="performance-panel__header">
      <div class="performance-panel__title">
        <span class="performance-panel__score" :class="scoreClass">
          {{ performanceScore }}
        </span>
        <span class="performance-panel__label">性能分数</span>
      </div>
      <div class="performance-panel__actions">
        <button
          @click="exportData"
          class="performance-panel__btn"
          title="导出数据"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
        </button>
        <button
          @click="toggleCollapse"
          class="performance-panel__btn"
          :title="isCollapsed ? '展开' : '折叠'"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            :style="{ transform: isCollapsed ? 'rotate(180deg)' : '' }"
          >
            <path
              fill-rule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
        <button
          @click="close"
          class="performance-panel__btn performance-panel__btn--close"
          title="关闭"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div v-if="!isCollapsed" class="performance-panel__content">
      <!-- Web Vitals 指标卡片 -->
      <div class="performance-panel__section">
        <h3 class="performance-panel__section-title">Web Vitals</h3>
        <div class="performance-panel__metrics">
          <div
            v-for="metric in webVitals"
            :key="metric.name"
            class="performance-panel__metric"
            :class="`performance-panel__metric--${metric.rating}`"
          >
            <div class="performance-panel__metric-name">{{ metric.name }}</div>
            <div class="performance-panel__metric-value">
              {{ formatValue(metric.name, metric.value) }}
            </div>
            <div class="performance-panel__metric-rating">{{ getRatingText(metric.rating) }}</div>
          </div>
        </div>
      </div>

      <!-- 资源加载瀑布图（简化版） -->
      <div class="performance-panel__section">
        <h3 class="performance-panel__section-title">资源加载</h3>
        <div class="performance-panel__resources">
          <div
            v-for="(resource, index) in resourceList.slice(0, 10)"
            :key="index"
            class="performance-panel__resource"
          >
            <div class="performance-panel__resource-name">{{ resource.name }}</div>
            <div class="performance-panel__resource-bar">
              <div
                class="performance-panel__resource-fill"
                :class="`performance-panel__resource-fill--${resource.type}`"
                :style="{ width: `${(resource.duration / maxResourceDuration) * 100}%` }"
              ></div>
            </div>
            <div class="performance-panel__resource-time">{{ resource.duration }}ms</div>
          </div>
        </div>
      </div>

      <!-- 长任务列表 -->
      <div v-if="longTasks.length > 0" class="performance-panel__section">
        <h3 class="performance-panel__section-title">长任务 ({{ longTasks.length }})</h3>
        <div class="performance-panel__long-tasks">
          <div
            v-for="(task, index) in longTasks.slice(0, 5)"
            :key="index"
            class="performance-panel__long-task"
          >
            <div class="performance-panel__long-task-duration">{{ task.duration }}ms</div>
            <div class="performance-panel__long-task-time">{{ formatTime(task.startTime) }}</div>
          </div>
        </div>
      </div>

      <!-- 内存使用 -->
      <div v-if="memoryUsage" class="performance-panel__section">
        <h3 class="performance-panel__section-title">内存使用</h3>
        <div class="performance-panel__memory">
          <div class="performance-panel__memory-bar">
            <div
              class="performance-panel__memory-fill"
              :style="{ width: `${(memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) * 100}%` }"
            ></div>
          </div>
          <div class="performance-panel__memory-info">
            <span>{{ memoryUsage.usedJSHeapSize }} MB</span>
            <span class="performance-panel__memory-total">/ {{ memoryUsage.jsHeapSizeLimit }} MB</span>
          </div>
        </div>
      </div>

      <!-- 性能警告 -->
      <div v-if="alerts.length > 0" class="performance-panel__section">
        <h3 class="performance-panel__section-title performance-panel__section-title--warning">
          性能警告 ({{ alerts.length }})
        </h3>
        <div class="performance-panel__alerts">
          <div
            v-for="(alert, index) in alerts.slice(0, 5)"
            :key="index"
            class="performance-panel__alert"
          >
            <span class="performance-panel__alert-icon">⚠️</span>
            <span class="performance-panel__alert-message">{{ alert.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { perfMonitor } from '@/utils/performance/monitor'
import type { PerformanceMetric, LongTaskInfo, MemoryInfo } from '@/utils/performance/monitor'
import { calculatePerformanceScore } from '@/config/performance.config'

// ==================== 状态 ====================

const isVisible = ref(false)
const isCollapsed = ref(false)
const alerts = ref<Array<{ type: string; message: string; value: number; timestamp: number }>>([])

// ==================== 计算属性 ====================

const webVitals = computed<PerformanceMetric[]>(() => {
  const vitals = perfMonitor.getCoreWebVitals()
  return Object.entries(vitals)
    .filter(([_, value]) => value !== null)
    .map(([name, value]) => value!)
    .sort((a, b) => a.name.localeCompare(b.name))
})

const performanceScore = computed(() => {
  const metrics: Record<string, number> = {}
  webVitals.value.forEach((metric) => {
    metrics[metric.name] = metric.value
  })
  return calculatePerformanceScore(metrics)
})

const scoreClass = computed(() => {
  const score = performanceScore.value
  if (score >= 90) return 'performance-panel__score--good'
  if (score >= 50) return 'performance-panel__score--needs-improvement'
  return 'performance-panel__score--poor'
})

const customMetrics = computed(() => perfMonitor.getCustomMetrics())

const resourceList = computed(() => {
  return Array.from(customMetrics.value.resourceLoadTimes.values())
    .sort((a, b) => b.duration - a.duration)
})

const maxResourceDuration = computed(() => {
  return Math.max(...resourceList.value.map((r) => r.duration), 100)
})

const longTasks = computed(() => {
  return customMetrics.value.longTasks
})

const memoryUsage = computed(() => {
  return customMetrics.value.memoryUsage.usedJSHeapSize > 0
    ? customMetrics.value.memoryUsage
    : null
})

// ==================== 方法 ====================

function formatValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3)
  }
  return `${Math.round(value)}ms`
}

function getRatingText(rating: string): string {
  const texts: Record<string, string> = {
    good: '良好',
    'needs-improvement': '需改进',
    poor: '较差'
  }
  return texts[rating] || rating
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}

function close(): void {
  isVisible.value = false
}

function exportData(): void {
  const data = perfMonitor.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 开发环境自动显示，生产环境通过URL参数开启
  if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('perf')) {
    isVisible.value = true
  }

  // 监听性能告警事件
  window.addEventListener('performanceAlert', handlePerformanceAlert as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('performanceAlert', handlePerformanceAlert as EventListener)
})

function handlePerformanceAlert(event: CustomEvent): void {
  const alert = event.detail
  alerts.value.unshift(alert)

  // 只保留最近10条告警
  if (alerts.value.length > 10) {
    alerts.value = alerts.value.slice(0, 10)
  }
}

// 暴露方法给外部调用
defineExpose({
  show: () => (isVisible.value = true),
  hide: () => (isVisible.value = false),
  toggle: () => (isVisible.value = !isVisible.value)
})
</script>

<style scoped>
.performance-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 380px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
}

.performance-panel--collapsed {
  width: auto;
}

.performance-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.performance-panel__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.performance-panel__score {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.performance-panel__score--good {
  color: #4caf50;
}

.performance-panel__score--needs-improvement {
  color: #ff9800;
}

.performance-panel__score--poor {
  color: #f44336;
}

.performance-panel__label {
  font-size: 12px;
  opacity: 0.9;
}

.performance-panel__actions {
  display: flex;
  gap: 4px;
}

.performance-panel__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.performance-panel__btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.performance-panel__btn--close:hover {
  background: rgba(244, 67, 54, 0.8);
}

.performance-panel__content {
  max-height: calc(80vh - 56px);
  overflow-y: auto;
  padding: 16px;
}

.performance-panel__section {
  margin-bottom: 20px;
}

.performance-panel__section:last-child {
  margin-bottom: 0;
}

.performance-panel__section-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
}

.performance-panel__section-title--warning {
  color: #f44336;
}

.performance-panel__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.performance-panel__metric {
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  text-align: center;
}

.performance-panel__metric--good {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.performance-panel__metric--needs-improvement {
  background: #fff3e0;
  border: 1px solid #ffe0b2;
}

.performance-panel__metric--poor {
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.performance-panel__metric-name {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.performance-panel__metric-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.performance-panel__metric-rating {
  font-size: 10px;
  color: #999;
}

.performance-panel__resources {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.performance-panel__resource {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.performance-panel__resource-name {
  flex: 0 0 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}

.performance-panel__resource-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.performance-panel__resource-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.performance-panel__resource-fill--script {
  background: #2196f3;
}

.performance-panel__resource-fill--stylesheet {
  background: #9c27b0;
}

.performance-panel__resource-fill--image {
  background: #4caf50;
}

.performance-panel__resource-fill--font {
  background: #ff9800;
}

.performance-panel__resource-fill--other {
  background: #9e9e9e;
}

.performance-panel__resource-time {
  flex: 0 0 50px;
  text-align: right;
  color: #666;
}

.performance-panel__long-tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.performance-panel__long-task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: #fff3e0;
  border-radius: 4px;
  font-size: 11px;
}

.performance-panel__long-task-duration {
  font-weight: bold;
  color: #e65100;
}

.performance-panel__long-task-time {
  color: #666;
}

.performance-panel__memory {
  padding: 12px;
  background: #e3f2fd;
  border-radius: 8px;
}

.performance-panel__memory-bar {
  height: 8px;
  background: #bbdefb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.performance-panel__memory-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #1976d2);
  border-radius: 4px;
  transition: width 0.3s;
}

.performance-panel__memory-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #1976d2;
}

.performance-panel__memory-total {
  color: #666;
}

.performance-panel__alerts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.performance-panel__alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
  font-size: 11px;
  color: #c62828;
}

.performance-panel__alert-icon {
  flex-shrink: 0;
}

.performance-panel__alert-message {
  flex: 1;
  line-height: 1.4;
}

/* 滚动条样式 */
.performance-panel__content::-webkit-scrollbar {
  width: 6px;
}

.performance-panel__content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.performance-panel__content::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}

.performance-panel__content::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}
</style>
