<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

const { metrics } = usePerformanceMonitor()

interface MetricCard {
  name: string
  value: number | null
  unit: string
  color: string
  threshold: { good: number; needsImprovement: number }
  description: string
}

const metricCards = ref<MetricCard[]>([])

function getRatingColor(value: number | null, thresholds: { good: number; needsImprovement: number }): string {
  if (value === null) return 'text-gray-400'
  if (value <= thresholds.good) return 'text-green-500'
  if (value <= thresholds.needsImprovement) return 'text-yellow-500'
  return 'text-red-500'
}

function getRatingBadge(value: number | null, thresholds: { good: number; needsImprovement: number }): { text: string; class: string } {
  if (value === null) return { text: '测量中...', class: 'bg-gray-100 text-gray-600' }
  if (value <= thresholds.good) return { text: '优秀', class: 'bg-green-100 text-green-700' }
  if (value <= thresholds.needsImprovement) return { text: '需改进', class: 'bg-yellow-100 text-yellow-700' }
  return { text: '较差', class: 'bg-red-100 text-red-700' }
}

onMounted(() => {
  metricCards.value = [
    {
      name: 'FCP',
      value: metrics.value.FCP,
      unit: 'ms',
      color: 'from-blue-500 to-cyan-500',
      threshold: { good: 1800, needsImprovement: 3000 },
      description: '首次内容绘制 - 页面开始渲染内容的时间',
    },
    {
      name: 'LCP',
      value: metrics.value.LCP,
      unit: 'ms',
      color: 'from-purple-500 to-pink-500',
      threshold: { good: 2500, needsImprovement: 4000 },
      description: '最大内容绘制 - 页面最大内容元素渲染完成的时间',
    },
    {
      name: 'FID',
      value: metrics.value.FID,
      unit: 'ms',
      color: 'from-orange-500 to-red-500',
      threshold: { good: 100, needsImprovement: 300 },
      description: '首次输入延迟 - 用户首次交互到浏览器响应的时间',
    },
    {
      name: 'CLS',
      value: metrics.value.CLS !== null ? Number((metrics.value.CLS * 1000).toFixed(1)) : null,
      unit: '',
      color: 'from-teal-500 to-emerald-500',
      threshold: { good: 100, needsImprovement: 250 },
      description: '累积布局偏移 - 视觉稳定性指标（×1000）',
    },
    {
      name: 'TTFB',
      value: metrics.value.TTFB,
      unit: 'ms',
      color: 'from-indigo-500 to-blue-500',
      threshold: { good: 800, needsImprovement: 1800 },
      description: '首字节时间 - 服务器响应速度',
    },
  ]
})

let refreshInterval: number | null = null

onMounted(() => {
  refreshInterval = window.setInterval(() => {
    metrics.reportMetrics()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <div class="performance-dashboard p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">🚀 性能监控面板</h2>
      <button 
        @click="metrics.reportMetrics()"
        class="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
      >
        🔄 刷新数据
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div
        v-for="(card, index) in metricCards"
        :key="index"
        class="metric-card p-4 rounded-xl border transition-all hover:shadow-md"
        :class="[
          `bg-gradient-to-br ${card.color} bg-opacity-5`,
          'border-opacity-20'
        ]"
        :style="{ borderColor: card.color.split(' ')[0].replace('from-', '') }"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {{ card.name }}
          </span>
          <span 
            class="px-2 py-0.5 text-xs font-medium rounded-full"
            :class="getRatingBadge(card.value, card.threshold).class"
          >
            {{ getRatingBadge(card.value, card.threshold).text }}
          </span>
        </div>

        <div class="mb-2">
          <span 
            class="text-3xl font-bold"
            :class="getRatingColor(card.value, card.threshold)"
          >
            {{ card.value ?? '--' }}
            <span class="text-base font-normal opacity-70">{{ card.unit }}</span>
          </span>
        </div>

        <p class="text-xs text-gray-500 leading-relaxed">
          {{ card.description }}
        </p>

        <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="`bg-gradient-to-r ${card.color}`"
            :style="{ 
              width: card.value ? `${Math.min(100, (card.value / card.threshold.needsImprovement) * 100)}%` : '0%' 
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">📊 Core Web Vitals 总览</h3>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">整体评分</span>
          <span class="font-bold text-lg" :class="
            (!metrics.FCP || !metrics.LCP || !metrics.FID || !metrics.CLS) ? 'text-gray-400' :
            (metrics.LCP! <= 2500 && metrics.FID! <= 100 && metrics.CLS! <= 0.1) ? 'text-green-500' :
            (metrics.LCP! <= 4000 && metrics.FID! <= 300 && metrics.CLS! <= 0.25) ? 'text-yellow-500' : 'text-red-500'
          ">
            {{ 
              (!metrics.FCP || !metrics.LCP || !metrics.FID || !metrics.CLS) ? '--' :
              (metrics.LCP! <= 2500 && metrics.FID! <= 100 && metrics.CLS! <= 0.1) ? '优秀 ✓' :
              (metrics.LCP! <= 4000 && metrics.FID! <= 300 && metrics.CLS! <= 0.25) ? '需改进 ⚠️' : '较差 ✗'
            }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2">
          <div class="text-center p-2 bg-white rounded-lg">
            <div class="text-xs text-gray-500">通过指标</div>
            <div class="text-lg font-bold text-green-600">
              {{ [metrics.FCP, metrics.LCP, metrics.FID, metrics.CLS].filter(m => m !== null).length }} / 4
            </div>
          </div>
          <div class="text-center p-2 bg-white rounded-lg">
            <div class="text-xs text-gray-500">采集时间</div>
            <div class="text-sm font-semibold text-gray-700">{{ new Date().toLocaleTimeString() }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between text-xs text-gray-400">
      <span>💡 数据由 Web Vitals API 自动采集</span>
      <span>每30秒自动刷新</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9));
}
</style>
