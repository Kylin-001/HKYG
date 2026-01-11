<!--
@fileoverview 性能监控组件
@description 监控页面加载、接口响应、用户操作和错误情况
@example
  <PerformanceMonitor
    :enabled="true"
    :sample-rate="0.5"
    @performance-data="handlePerformanceData"
  />
-->
<template>
  <div v-if="showPanel" class="performance-monitor" :class="{ expanded: isExpanded }">
    <div class="monitor-header" @click="togglePanel">
      <el-icon :size="18"><DataAnalysis /></el-icon>
      <span class="header-title">性能监控</span>
      <span class="performance-score" :class="scoreClass">{{ performanceScore }}</span>
      <el-icon :size="16"><ChevronDown v-if="isExpanded" /><ChevronUp v-else /></el-icon>
    </div>

    <div v-if="isExpanded" class="monitor-content">
      <!-- 核心指标 -->
      <div class="metrics-section">
        <h3 class="section-title">核心指标</h3>
        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-label">FCP</div>
            <div class="metric-value">{{ formatTime(metrics.fcp) }}</div>
            <div class="metric-status" :class="getStatusClass(metrics.fcp, 1000)"></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">LCP</div>
            <div class="metric-value">{{ formatTime(metrics.lcp) }}</div>
            <div class="metric-status" :class="getStatusClass(metrics.lcp, 2500)"></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">FID</div>
            <div class="metric-value">{{ formatTime(metrics.fid) }}</div>
            <div class="metric-status" :class="getStatusClass(metrics.fid, 100)"></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">INP</div>
            <div class="metric-value">{{ formatTime(metrics.inp) }}</div>
            <div class="metric-status" :class="getStatusClass(metrics.inp, 200)"></div>
          </div>
          <div class="metric-item">
            <div class="metric-label">CLS</div>
            <div class="metric-value">{{ formatCLS(metrics.cls) }}</div>
            <div class="metric-status" :class="getStatusClass(metrics.cls, 0.1)"></div>
          </div>
        </div>
      </div>

      <!-- 资源加载 -->
      <div class="resources-section">
        <h3 class="section-title">资源加载</h3>
        <div class="resources-list">
          <div v-for="resource in resources.slice(0, 5)" :key="resource.name" class="resource-item">
            <div class="resource-name">{{ resource.name }}</div>
            <div class="resource-time">{{ formatTime(resource.time) }}</div>
          </div>
          <div v-if="resources.length > 5" class="resource-more">
            +{{ resources.length - 5 }} more resources
          </div>
        </div>
      </div>

      <!-- 接口请求 -->
      <div class="requests-section">
        <h3 class="section-title">接口请求</h3>
        <div class="requests-list">
          <div
            v-for="request in requests.slice(0, 5)"
            :key="request.url"
            class="request-item"
            :class="{ error: request.status >= 400 }"
          >
            <div class="request-method">{{ request.method }}</div>
            <div class="request-url">{{ truncateUrl(request.url) }}</div>
            <div class="request-status">{{ request.status }}</div>
            <div class="request-time">{{ formatTime(request.time) }}</div>
          </div>
          <div v-if="requests.length > 5" class="request-more">
            +{{ requests.length - 5 }} more requests
          </div>
        </div>
      </div>

      <!-- 错误统计 -->
      <div class="errors-section">
        <h3 class="section-title">错误统计</h3>
        <div class="errors-list">
          <div v-if="errors.length === 0" class="no-errors">
            <el-icon :size="24"><CircleCheck /></el-icon>
            <span>暂无错误</span>
          </div>
          <div v-for="error in errors.slice(0, 5)" :key="error.id" class="error-item">
            <div class="error-type">{{ error.type }}</div>
            <div class="error-message">{{ error.message }}</div>
            <div class="error-time">{{ formatDateTime(error.timestamp) }}</div>
          </div>
          <div v-if="errors.length > 5" class="error-more">
            +{{ errors.length - 5 }} more errors
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="monitor-actions">
        <el-button type="primary" size="small" @click="exportData">导出数据</el-button>
        <el-button size="small" @click="clearData">清空数据</el-button>
        <el-button size="small" @click="togglePanel">收起</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { DataAnalysis, ChevronDown, ChevronUp, CircleCheck } from '@element-plus/icons-vue'

// 定义接口
interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  inp: number
  cls: number
  tti: number
  tbt: number
}

interface ResourceTiming {
  name: string
  time: number
  size: number
  type: string
}

interface RequestTiming {
  url: string
  method: string
  status: number
  time: number
  timestamp: number
}

interface ErrorInfo {
  id: string
  type: string
  message: string
  stack?: string
  url?: string
  line?: number
  column?: number
  timestamp: number
}

interface PerformanceData {
  metrics: PerformanceMetrics
  resources: ResourceTiming[]
  requests: RequestTiming[]
  errors: ErrorInfo[]
  timestamp: number
  score: number
}

// 定义组件属性
const props = defineProps<{
  // 是否启用监控
  enabled?: boolean
  // 采样率 (0-1)
  sampleRate?: number
  // 是否显示监控面板
  showPanel?: boolean
  // 是否自动展开面板
  autoExpand?: boolean
  // 是否监控资源加载
  monitorResources?: boolean
  // 是否监控接口请求
  monitorRequests?: boolean
  // 是否监控用户操作
  monitorUserActions?: boolean
  // 是否监控错误
  monitorErrors?: boolean
  // 数据上报间隔 (ms)
  reportInterval?: number
}>()

// 定义默认值
const defaultProps = {
  enabled: true,
  sampleRate: 1.0,
  showPanel: true,
  autoExpand: false,
  monitorResources: true,
  monitorRequests: true,
  monitorUserActions: true,
  monitorErrors: true,
  reportInterval: 30000, // 30秒
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 定义事件
const emit = defineEmits<{
  (e: 'performance-data', data: PerformanceData): void
  (e: 'error', error: ErrorInfo): void
  (e: 'request-finished', request: RequestTiming): void
}>()

// 响应式数据
const isExpanded = ref(mergedProps.autoExpand)
const metrics = reactive<PerformanceMetrics>({
  fcp: 0,
  lcp: 0,
  fid: 0,
  cls: 0,
  inp: 0, // 添加INP指标支持
  tti: 0,
  tbt: 0,
})
const resources = ref<ResourceTiming[]>([])
const requests = ref<RequestTiming[]>([])
const errors = ref<ErrorInfo[]>([])
const isMonitoring = ref(false)
const reportTimer = ref<number | null>(null)
const isSampled = ref(false)
const observers = ref<PerformanceObserver[]>([])

// 计算属性
const performanceScore = computed(() => {
  const scores = [
    getScore(metrics.fcp, 1000, 3000),
    getScore(metrics.lcp, 2500, 4000),
    getScore(metrics.fid, 100, 300),
    getScore(metrics.inp, 200, 500), // INP指标，建议值200ms以内
    getScore(metrics.cls, 0.1, 0.25),
  ]
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  return Math.round(avgScore)
})

const scoreClass = computed(() => {
  const score = performanceScore.value
  if (score >= 90) return 'score-good'
  if (score >= 75) return 'score-average'
  return 'score-poor'
})

// 生命周期钩子
onMounted(() => {
  // 采样判断
  isSampled.value = Math.random() < mergedProps.sampleRate

  if (mergedProps.enabled && isSampled.value) {
    startMonitoring()
  }
})

onBeforeUnmount(() => {
  stopMonitoring()
})

// 监听启用状态变化
watch(
  () => props.enabled,
  newEnabled => {
    if (newEnabled && isSampled.value) {
      startMonitoring()
    } else {
      stopMonitoring()
    }
  }
)

// 开始监控
const startMonitoring = () => {
  if (isMonitoring.value) return

  isMonitoring.value = true

  // 监控核心指标
  monitorCoreMetrics()

  // 监控资源加载
  if (mergedProps.monitorResources) {
    monitorResources()
  }

  // 监控接口请求
  if (mergedProps.monitorRequests) {
    monitorRequests()
  }

  // 监控错误
  if (mergedProps.monitorErrors) {
    monitorErrors()
  }

  // 启动数据上报
  startReporting()
}

// 停止监控
const stopMonitoring = () => {
  if (!isMonitoring.value) return

  isMonitoring.value = false

  // 清理所有observers，避免内存泄漏
  observers.value.forEach(observer => {
    observer.disconnect()
  })
  observers.value = []

  // 停止数据上报
  stopReporting()
}

// 监控核心指标
const monitorCoreMetrics = () => {
  // 监听 FCP
  const fcpObserver = new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      metrics.fcp = entry.startTime
    })
  })
  fcpObserver.observe({ type: 'first-contentful-paint', buffered: true })
  observers.value.push(fcpObserver)

  // 监听 LCP
  const lcpObserver = new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      metrics.lcp = entry.startTime
    })
  })
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  observers.value.push(lcpObserver)

  // 监听 CLS
  let clsValue = 0
  const clsObserver = new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        metrics.cls = clsValue
      }
    })
  })
  clsObserver.observe({ type: 'layout-shift', buffered: true })
  observers.value.push(clsObserver)

  // 监听 FID
  const fidObserver = new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      metrics.fid = entry.processingStart - entry.startTime
    })
  })
  fidObserver.observe({ type: 'first-input', buffered: true })
  observers.value.push(fidObserver)

  // 监听 INP
  const inpObserver = new PerformanceObserver(entries => {
    let maxInp = 0
    entries.getEntries().forEach(entry => {
      const inpDuration = entry.processingStart - entry.startTime
      if (inpDuration > maxInp) {
        maxInp = inpDuration
        metrics.inp = maxInp
      }
    })
  })
  inpObserver.observe({ type: 'event', buffered: true })
  observers.value.push(inpObserver)
}

// 监控资源加载
const monitorResources = () => {
  // 监听资源加载完成
  new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      if (entry.entryType === 'resource') {
        const resource: ResourceTiming = {
          name: entry.name.split('/').pop() || entry.name,
          time: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType,
        }
        resources.value.push(resource)
      }
    })
  }).observe({ type: 'resource', buffered: true })
}

// 监控接口请求
const monitorRequests = () => {
  // 拦截 fetch
  const originalFetch = window.fetch
  window.fetch = async (url, options) => {
    const startTime = performance.now()
    const timestamp = Date.now()

    try {
      const response = await originalFetch(url, options)
      const endTime = performance.now()

      const request: RequestTiming = {
        url: url.toString(),
        method: options?.method || 'GET',
        status: response.status,
        time: endTime - startTime,
        timestamp,
      }

      requests.value.push(request)
      emit('request-finished', request)

      return response
    } catch (error) {
      const endTime = performance.now()

      const request: RequestTiming = {
        url: url.toString(),
        method: options?.method || 'GET',
        status: 0,
        time: endTime - startTime,
        timestamp,
      }

      requests.value.push(request)
      emit('request-finished', request)

      throw error
    }
  }

  // 拦截 XMLHttpRequest
  const originalXHR = window.XMLHttpRequest
  window.XMLHttpRequest = function () {
    const xhr = new originalXHR()
    const startTime = performance.now()
    const timestamp = Date.now()
    let method = 'GET'
    let url = ''

    const originalOpen = xhr.open
    xhr.open = function (...args) {
      method = args[0] || 'GET'
      url = args[1] || ''
      return originalOpen.apply(this, args)
    }

    const originalSend = xhr.send
    xhr.send = function (...args) {
      xhr.addEventListener('loadend', () => {
        const endTime = performance.now()

        const request: RequestTiming = {
          url,
          method,
          status: xhr.status,
          time: endTime - startTime,
          timestamp,
        }

        requests.value.push(request)
        emit('request-finished', request)
      })
      return originalSend.apply(this, args)
    }

    return xhr
  } as any
}

// 监控错误
const monitorErrors = () => {
  // 监听全局错误
  window.addEventListener('error', event => {
    const error: ErrorInfo = {
      id: generateId(),
      type: 'Error',
      message: event.message || 'Unknown error',
      url: event.filename,
      line: event.lineno,
      column: event.colno,
      timestamp: Date.now(),
    }

    errors.value.push(error)
    emit('error', error)
  })

  // 监听未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', event => {
    const error: ErrorInfo = {
      id: generateId(),
      type: 'UnhandledRejection',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack,
      timestamp: Date.now(),
    }

    errors.value.push(error)
    emit('error', error)
  })
}

// 开始数据上报
const startReporting = () => {
  if (reportTimer.value) {
    clearInterval(reportTimer.value)
  }

  reportTimer.value = window.setInterval(() => {
    reportPerformanceData()
  }, mergedProps.reportInterval)
}

// 停止数据上报
const stopReporting = () => {
  if (reportTimer.value) {
    clearInterval(reportTimer.value)
    reportTimer.value = null
  }
}

// 上报性能数据
const reportPerformanceData = () => {
  const data: PerformanceData = {
    metrics: { ...metrics },
    resources: [...resources.value],
    requests: [...requests.value],
    errors: [...errors.value],
    timestamp: Date.now(),
    score: performanceScore.value,
  }

  emit('performance-data', data)
}

// 生成唯一ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 格式化时间
const formatTime = (time: number): string => {
  if (!time) return '-'
  if (time < 1000) {
    return `${Math.round(time)}ms`
  }
  return `${(time / 1000).toFixed(2)}s`
}

// 格式化CLS
const formatCLS = (cls: number): string => {
  if (!cls) return '0.00'
  return cls.toFixed(2)
}

// 格式化日期时间
const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// 获取状态类
const getStatusClass = (value: number, threshold: number): string => {
  if (!value) return ''
  if (value <= threshold) return 'status-good'
  if (value <= threshold * 2) return 'status-average'
  return 'status-poor'
}

// 获取评分
const getScore = (value: number, goodThreshold: number, poorThreshold: number): number => {
  if (!value) return 100
  if (value <= goodThreshold) return 100
  if (value >= poorThreshold) return 0
  return Math.round(100 - ((value - goodThreshold) / (poorThreshold - goodThreshold)) * 100)
}

// 截断URL
const truncateUrl = (url: string): string => {
  if (url.length <= 50) return url
  return `${url.substring(0, 47)}...`
}

// 切换面板展开状态
const togglePanel = () => {
  isExpanded.value = !isExpanded.value
}

// 导出数据
const exportData = () => {
  const data: PerformanceData = {
    metrics: { ...metrics },
    resources: [...resources.value],
    requests: [...requests.value],
    errors: [...errors.value],
    timestamp: Date.now(),
    score: performanceScore.value,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-data-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 清空数据
const clearData = () => {
  resources.value = []
  requests.value = []
  errors.value = []

  // 重置指标
  Object.assign(metrics, {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    tti: 0,
    tbt: 0,
  })
}

// 暴露公共方法
defineExpose({
  startMonitoring,
  stopMonitoring,
  reportPerformanceData,
  clearData,
  exportData,
})
</script>

<style lang="scss" scoped>
.performance-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.3s ease;

  &.expanded {
    max-height: 600px;
    overflow: auto;
  }

  // 监控头部
  .monitor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #fafafa;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f5f7fa;
    }

    .header-title {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }

    .performance-score {
      margin-left: auto;
      font-size: 14px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      background-color: #ecf5ff;
      color: #409eff;

      &.score-good {
        background-color: #f0f9eb;
        color: #67c23a;
      }

      &.score-average {
        background-color: #fdf6ec;
        color: #e6a23c;
      }

      &.score-poor {
        background-color: #fef0f0;
        color: #f56c6c;
      }
    }
  }

  // 监控内容
  .monitor-content {
    padding: 16px;
  }

  // 章节标题
  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  // 指标网格
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  // 指标项
  .metric-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: #fafafa;
    border-radius: 6px;

    .metric-label {
      font-size: 12px;
      color: #606266;
      font-weight: 500;
    }

    .metric-value {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .metric-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #dcdfe6;

      &.status-good {
        background-color: #67c23a;
      }

      &.status-average {
        background-color: #e6a23c;
      }

      &.status-poor {
        background-color: #f56c6c;
      }
    }
  }

  // 资源列表
  .resources-list {
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 16px;

    .resource-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 12px;

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .resource-name {
        color: #303133;
        flex: 1;
      }

      .resource-time {
        color: #606266;
        font-family: monospace;
      }
    }

    .resource-more {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: #909399;
    }
  }

  // 请求列表
  .requests-list {
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 16px;

    .request-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      font-size: 12px;

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      &.error {
        color: #f56c6c;
      }

      .request-method {
        width: 50px;
        text-align: center;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 3px;
        background-color: #ecf5ff;
        color: #409eff;
      }

      .request-url {
        flex: 1;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .request-status {
        width: 50px;
        text-align: right;
        font-weight: 500;
      }

      .request-time {
        width: 60px;
        text-align: right;
        color: #606266;
        font-family: monospace;
      }
    }

    .request-more {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: #909399;
    }
  }

  // 错误列表
  .errors-list {
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 16px;

    .no-errors {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 20px;
      color: #67c23a;
      font-size: 14px;
    }

    .error-item {
      padding: 8px 0;
      font-size: 12px;

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .error-type {
        font-weight: 500;
        color: #f56c6c;
        margin-bottom: 2px;
      }

      .error-message {
        color: #606266;
        margin-bottom: 2px;
        line-height: 1.4;
      }

      .error-time {
        color: #909399;
        font-size: 11px;
      }
    }

    .error-more {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: #909399;
    }
  }

  // 操作按钮
  .monitor-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .performance-monitor {
    width: calc(100% - 40px);
    bottom: 10px;
    right: 10px;

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .requests-list .request-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .request-method,
      .request-status,
      .request-time {
        width: auto;
        text-align: left;
      }
    }
  }
}
</style>
