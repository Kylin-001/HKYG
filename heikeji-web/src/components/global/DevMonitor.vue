<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  color: string
}

const isVisible = ref(false)
const metrics = ref<PerformanceMetric[]>([])
const fps = ref(60)
const memory = ref({ used: 0, total: 0 })
const networkRequests = ref(0)
let animationFrameId: number | null = null

// FPS计算
let lastTime = performance.now()
let frameCount = 0

function measureFPS() {
  frameCount++
  const currentTime = performance.now()

  if (currentTime >= lastTime + 1000) {
    fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime))
    frameCount = 0
    lastTime = currentTime
    
    updateMetrics()
  }

  animationFrameId = requestAnimationFrame(measureFPS)
}

// 内存使用 (如果可用)
function measureMemory() {
  if ((performance as any).memory) {
    const mem = (performance as any).memory
    memory.value = {
      used: Math.round(mem.usedJSHeapSize / 1048576),
      total: Math.round(mem.jsHeapSizeLimit / 1048576),
    }
  }
}

// 更新性能指标
function updateMetrics() {
  const newMetrics: PerformanceMetric[] = []

  // FPS
  newMetrics.push({
    name: 'FPS',
    value: fps.value,
    unit: '',
    status: fps.value >= 50 ? 'good' : fps.value >= 30 ? 'warning' : 'critical',
    color: fps.value >= 50 ? '#10b981' : fps.value >= 30 ? '#f59e0b' : '#ef4444',
  })

  // 内存
  if (memory.value.total > 0) {
    const usagePercent = (memory.value.used / memory.value.total) * 100
    newMetrics.push({
      name: 'Memory',
      value: memory.value.used,
      unit: 'MB',
      status: usagePercent < 70 ? 'good' : usagePercent < 90 ? 'warning' : 'critical',
      color: usagePercent < 70 ? '#10b981' : usagePercent < 90 ? '#f59e0b' : '#ef4444',
    })
  }

  // Core Web Vitals (如果可用)
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  if (navigation) {
    // FCP
    const fcp = Math.round(navigation.responseStart - navigation.startTime)
    newMetrics.push({
      name: 'FCP',
      value: fcp,
      unit: 'ms',
      status: fcp <= 1800 ? 'good' : fcp <= 3000 ? 'warning' : 'critical',
      color: fcp <= 1800 ? '#10b981' : fcp <= 3000 ? '#f59e0b' : '#ef4444',
    })

    // DOM加载时间
    const domLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.startTime)
    newMetrics.push({
      name: 'DOM Ready',
      value: domLoaded,
      unit: 'ms',
      status: domLoaded <= 2000 ? 'good' : domLoaded <= 4000 ? 'warning' : 'critical',
      color: domLoaded <= 2000 ? '#10b981' : domLoaded <= 4000 ? '#f59e0b' : '#ef4444',
    })

    // 完全加载时间
    const loadComplete = Math.round(navigation.loadEventEnd - navigation.startTime)
    newMetrics.push({
      name: 'Load Time',
      value: loadComplete,
      unit: 'ms',
      status: loadComplete <= 3500 ? 'good' : loadComplete <= 6000 ? 'warning' : 'critical',
      color: loadComplete <= 3500 ? '#10b981' : loadComplete <= 6000 ? '#f59e0b' : '#ef4444',
    })
  }

  // 资源数量
  const resources = performance.getEntriesByType('resource').length
  networkRequests.value = resources

  metrics.value = newMetrics
}

// 切换显示/隐藏
function togglePanel() {
  isVisible.value = !isVisible.value
  
  if (isVisible.value) {
    startMonitoring()
  } else {
    stopMonitoring()
  }
}

function startMonitoring() {
  measureMemory()
  updateMetrics()
  animationFrameId = requestAnimationFrame(measureFPS)
  
  // 定期更新内存和网络信息
  setInterval(measureMemory, 2000)
}

function stopMonitoring() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

onMounted(() => {
  // 默认在开发环境显示
  if (import.meta.env.DEV) {
    isVisible.value = true
    startMonitoring()
  }
})

onUnmounted(() => {
  stopMonitoring()
})
</script>

<template>
  <!-- 切换按钮 -->
  <button
    @click="togglePanel"
    class="dev-monitor__toggle"
    :class="{ active: isVisible }"
    title="性能监控面板"
  >
    📊
  </button>

  <!-- 监控面板 -->
  <Transition name="slide-fade">
    <div v-if="isVisible" class="dev-monitor">
      <div class="dev-monitor__header">
        <h3>🔧 Dev Monitor</h3>
        <span class="env-badge">{{ import.meta.env.MODE }}</span>
        <button @click="togglePanel" class="close-btn">✕</button>
      </div>

      <!-- 实时指标 -->
      <div class="dev-monitor__metrics">
        <div
          v-for="metric in metrics"
          :key="metric.name"
          class="metric-card"
          :style="{ borderColor: metric.color }"
        >
          <div class="metric-label">{{ metric.name }}</div>
          <div class="metric-value" :style="{ color: metric.color }">
            {{ metric.value }}{{ metric.unit }}
          </div>
          <div class="metric-status" :class="metric.status">
            {{ metric.status === 'good' ? '✅' : metric.status === 'warning' ? '⚠️' : '❌' }}
          </div>
        </div>
      </div>

      <!-- 网络请求统计 -->
      <div class="dev-monitor__section">
        <div class="section-title">📡 Network</div>
        <div class="info-row">
          <span>请求总数:</span>
          <strong>{{ networkRequests }}</strong>
        </div>
      </div>

      <!-- 内存使用 -->
      <div v-if="memory.total > 0" class="dev-monitor__section">
        <div class="section-title">💾 Memory</div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(memory.used / memory.total) * 100}%` }"
          ></div>
        </div>
        <div class="info-row">
          <span>{{ memory.used }}MB / {{ memory.total }}MB</span>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="dev-monitor__actions">
        <button @click="$router.push('/')" class="action-btn">
          🏠 首页
        </button>
        <button @click="location.reload()" class="action-btn">
          🔄 刷新
        </button>
        <button @click="console.clear()" class="action-btn">
          🗑️ 清控制台
        </button>
      </div>

      <!-- 版本信息 -->
      <div class="dev-monitor__footer">
        <small>v2.2.0 | Phase 2 Complete</small>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dev-monitor__toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.dev-monitor__toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.dev-monitor__toggle.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.dev-monitor {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  overflow-y: auto;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  z-index: 9998;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.dev-monitor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dev-monitor__header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.env-badge {
  padding: 2px 8px;
  background: #10b981;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: white;
}

.dev-monitor__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-label {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  font-family: monospace;
}

.metric-status {
  font-size: 14px;
  margin-top: 2px;
}

.dev-monitor__section {
  margin-bottom: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #d1d5db;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.dev-monitor__actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  padding: 8px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: #60a5fa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
}

.dev-monitor__footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #6b7280;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 响应式 */
@media (max-width: 480px) {
  .dev-monitor {
    left: 10px;
    right: 10px;
    width: auto;
    max-height: 400px;
  }

  .dev-monitor__toggle {
    bottom: 10px;
    right: 10px;
  }
}
</style>
