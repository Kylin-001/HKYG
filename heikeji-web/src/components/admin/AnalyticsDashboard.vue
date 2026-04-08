<template>
  <div class="min-h-screen bg-gray-50/50 p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-text-primary flex items-center gap-2">
          <el-icon :size="22" class="text-primary"><DataAnalysis /></el-icon> 数据分析看板
        </h2>
        <p class="text-xs text-text-tertiary mt-1">实时监控平台运营数据与用户行为</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="timeRange"
          class="px-3 py-2 rounded-xl border border-primary-100 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary-50">
          <option value="today">今日</option>
          <option value="7days">近7天</option>
          <option value="30days">近30天</option>
        </select>
        <button @click="refreshData" :disabled="isLoading"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5">
          <el-icon :size="14" v-if="!isLoading"><Refresh /></el-icon>
          <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" v-else></span>
          {{ isLoading ? '刷新中...' : '刷新数据' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, idx) in realTimeStats" :key="stat.label"
        class="bg-white rounded-2xl border border-primary-50/50 p-5 relative overflow-hidden hover:shadow-md transition-shadow group">
        <div :class="['absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity', statColor(idx)]"></div>
        <p class="text-2xl font-bold text-text-primary">{{ stat.value }}</p>
        <p class="text-xs text-text-secondary mt-1">{{ stat.label }}</p>
        <span v-if="stat.change !== undefined"
          :class="['inline-flex items-center gap-0.5 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full',
            stat.change > 0 ? 'bg-pine/10 text-pine' : 'bg-crimson/10 text-crimson']">
          <el-icon :size="11"><component :is="stat.change > 0 ? Top : Bottom" /></el-icon>
          {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-info"><TrendCharts /></el-icon> 流量趋势
        </h3>
        <div ref="trafficChartRef" class="h-[280px]"></div>
      </div>

      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-gold"><Rank /></el-icon> 热门页面 Top 10
        </h3>
        <div ref="pagesChartRef" class="h-[280px]"></div>
      </div>

      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-crimson"><Guide /></el-icon> 转化漏斗
        </h3>
        <div ref="funnelChartRef" class="h-[280px]"></div>
      </div>

      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-pine"><PieChart /></el-icon> 用户来源分布
        </h3>
        <div ref="sourceChartRef" class="h-[280px]"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-warning"><Monitor /></el-icon> 设备分布
        </h3>
        <div ref="deviceChartRef" class="h-[260px]"></div>
      </div>

      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-info"><Odometer /></el-icon> 性能概览 (Web Vitals)
        </h3>
        <div ref="performanceChartRef" class="h-[260px]"></div>
      </div>

      <div class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-shadow">
        <h3 class="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
          <el-icon :size="16" class="text-crimson"><WarningFilled /></el-icon> 最近错误 Top 10
        </h3>
        <div class="space-y-2.5 max-h-[260px] overflow-y-auto scrollbar-hide">
          <div v-for="(error, index) in recentErrors" :key="index"
            class="p-3 rounded-xl bg-crimson/5 border-l-2 border-crimson hover:bg-crimson/8 transition-colors">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-bold text-crimson">{{ error.type }}</span>
              <span class="text-[10px] text-text-quaternary flex items-center gap-0.5">
                <el-icon :size="10"><Warning /></el-icon>{{ error.count }}次
              </span>
            </div>
            <p class="text-[11px] text-text-secondary break-all line-clamp-2">{{ error.message }}</p>
            <p class="text-[10px] text-text-quaternary mt-1">{{ formatTime(error.lastSeen) }}</p>
          </div>
          <div v-if="recentErrors.length === 0" class="text-center py-8">
            <el-icon :size="28" class="text-pine/30"><CircleCheckFilled /></el-icon>
            <p class="text-xs text-text-tertiary mt-2">暂无错误记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  DataAnalysis, Refresh, TrendCharts, Rank, Guide, PieChart,
  Monitor, Odometer, WarningFilled, Warning, CircleCheckFilled, Top, Bottom
} from '@element-plus/icons-vue'

interface StatCard {
  label: string
  value: string | number
  change?: number
}

interface ErrorItem {
  type: string
  message: string
  count: number
  lastSeen: number
}

const timeRange = ref('7days')
const isLoading = ref(false)
const trafficChartRef = ref<HTMLElement>()
const pagesChartRef = ref<HTMLElement>()
const funnelChartRef = ref<HTMLElement>()
const sourceChartRef = ref<HTMLElement>()
const deviceChartRef = ref<HTMLElement>()
const performanceChartRef = ref<HTMLElement>()

let trafficChart: echarts.ECharts | null = null
let pagesChart: echarts.ECharts | null = null
let funnelChart: echarts.ECharts | null = null
let sourceChart: echarts.ECharts | null = null
let deviceChart: echarts.ECharts | null = null
let performanceChart: echarts.ECharts | null = null

function statColor(index: number): string {
  const colors = ['bg-primary', 'bg-gold', 'bg-pine', 'bg-crimson']
  return colors[index % colors.length]
}

const realTimeStats = ref<StatCard[]>([
  { label: '当前在线', value: 128, change: 12.5 },
  { label: '今日 PV', value: '12,456', change: 8.3 },
  { label: '今日 UV', value: '3,891', change: -2.1 },
  { label: '平均停留时长', value: '4m 32s', change: 5.6 }
])

const recentErrors = ref<ErrorItem[]>([
  { type: 'TypeError', message: "Cannot read property 'map' of undefined", count: 23, lastSeen: Date.now() - 1000 * 60 * 5 },
  { type: 'NetworkError', message: 'Failed to fetch /api/products', count: 15, lastSeen: Date.now() - 1000 * 60 * 15 },
  { type: 'ReferenceError', message: 'analytics is not defined', count: 8, lastSeen: Date.now() - 1000 * 60 * 30 }
])

const PRIMARY = '#000AB0'
const PRIMARY_LIGHT = '#335ECC'
const GOLD = '#D4A843'
const PINE = '#2D8659'
const CRIMSON = '#C0392B'

function initCharts(): void {
  nextTick(() => {
    if (trafficChartRef.value) { trafficChart = echarts.init(trafficChartRef.value); renderTrafficChart() }
    if (pagesChartRef.value) { pagesChart = echarts.init(pagesChartRef.value); renderPagesChart() }
    if (funnelChartRef.value) { funnelChart = echarts.init(funnelChartRef.value); renderFunnelChart() }
    if (sourceChartRef.value) { sourceChart = echarts.init(sourceChartRef.value); renderSourceChart() }
    if (deviceChartRef.value) { deviceChart = echarts.init(deviceChartRef.value); renderDeviceChart() }
    if (performanceChartRef.value) { performanceChart = echarts.init(performanceChartRef.value); renderPerformanceChart() }
  })
}

function renderTrafficChart(): void {
  if (!trafficChart) return
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const pvData = [12000, 15000, 13500, 16000, 14500, 18000, 16500]
  const uvData = [3500, 4200, 3800, 4500, 4100, 5200, 4800]
  trafficChart.setOption({
    tooltip: { trigger: 'axis' }, legend: { data: ['PV', 'UV'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: '#E5E7EB' } }, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#F3F4F6' } } },
    series: [
      { name: 'PV', type: 'line', data: pvData, smooth: true, lineStyle: { color: PRIMARY, width: 2.5 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,10,176,0.25)' }, { offset: 1, color: 'rgba(0,10,176,0.02)' }]) } },
      { name: 'UV', type: 'line', data: uvData, smooth: true, lineStyle: { color: PRIMARY_LIGHT, width: 2.5 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(51,94,204,0.2)' }, { offset: 1, color: 'rgba(51,94,204,0.02)' }]) } }
    ]
  })
}

function renderPagesChart(): void {
  if (!pagesChart) return
  const pages = ['/home', '/products/list', '/products/detail', '/cart', '/checkout', '/orders/list', '/user/profile', '/search', '/takeout/home', '/community/forum']
  const values = [3200, 2800, 2100, 1900, 1500, 1400, 1200, 1100, 950, 800]
  pagesChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#F3F4F6' } } },
    yAxis: { type: 'category', data: pages.reverse(), axisLine: { lineStyle: { color: '#E5E7EB' } }, axisTick: { show: false }, axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', data: values.reverse(), barWidth: '55%',
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: PRIMARY }, { offset: 1, color: PRIMARY_LIGHT }]), borderRadius: [0, 4, 4, 0] } }]
  })
}

function renderFunnelChart(): void {
  if (!funnelChart) return
  funnelChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      name: '转化漏斗', type: 'funnel', left: '10%', width: '80%', sort: 'descending', gap: 2,
      label: { show: true, position: 'inside', formatter: '{b}\n{c}', fontSize: 11 },
      data: [
        { value: 10000, name: '浏览商品', itemStyle: { color: PRIMARY } },
        { value: 5500, name: '加入购物车', itemStyle: { color: PRIMARY_LIGHT } },
        { value: 2500, name: '开始结账', itemStyle: { color: GOLD } },
        { value: 1800, name: '提交订单', itemStyle: { color: PINE } },
        { value: 1500, name: '完成支付', itemStyle: { color: CRIMSON } }
      ], itemStyle: { borderColor: '#fff', borderWidth: 1 }
    }]
  })
}

function renderSourceChart(): void {
  if (!sourceChart) return
  sourceChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { fontSize: 11 } },
    series: [{
      name: '用户来源', type: 'pie', radius: ['40%', '70%'], center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false }, emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
      data: [
        { value: 1048, name: '直接访问', itemStyle: { color: PRIMARY } },
        { value: 735, name: '搜索引擎', itemStyle: { color: PRIMARY_LIGHT } },
        { value: 580, name: '社交媒体', itemStyle: { color: GOLD } },
        { value: 484, name: '外部链接', itemStyle: { color: PINE } },
        { value: 300, name: '其他', itemStyle: { color: CRIMSON } }
      ]
    }]
  })
}

function renderDeviceChart(): void {
  if (!deviceChart) return
  deviceChart.setOption({
    tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [
      { name: '设备类型', type: 'pie', radius: ['35%', '55%'], center: ['30%', '45%'],
        data: [
          { value: 5833, name: 'PC', itemStyle: { color: PRIMARY } },
          { value: 4234, name: 'Mobile', itemStyle: { color: PRIMARY_LIGHT } },
          { value: 1234, name: 'Tablet', itemStyle: { color: GOLD } }
        ] },
      { name: '操作系统', type: 'pie', radius: ['20%', '30%'], center: ['70%', '45%'],
        data: [
          { value: 6532, name: 'Windows', itemStyle: { color: PINE } },
          { value: 2890, name: 'macOS', itemStyle: { color: '#43e97b' } },
          { value: 1444, name: 'iOS', itemStyle: { color: CRIMSON } },
          { value: 435, name: 'Android', itemStyle: { color: '#fee140' } }
        ] }
    ]
  })
}

function renderPerformanceChart(): void {
  if (!performanceChart) return
  performanceChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'], axisLine: { lineStyle: { color: '#E5E7EB' } } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#F3F4F6' } } },
    series: [
      { name: '平均值', type: 'bar', data: [
        { value: 2200, itemStyle: { color: PINE } },
        { value: 85, itemStyle: { color: PINE } },
        { value: 0.08, itemStyle: { color: PINE } },
        { value: 1600, itemStyle: { color: PINE } },
        { value: 650, itemStyle: { color: PINE } }
      ], barWidth: '45%' },
      { name: '阈值线', type: 'line', markLine: { silent: true, symbol: 'none',
        data: [{ yAxis: 2500, name: 'LCP 良好', lineStyle: { color: GOLD, type: 'dashed' } },
          { yAxis: 4000, name: 'LCP 较差', lineStyle: { color: CRIMSON, type: 'dashed' } }] }
      },
    ]
  })
}

async function refreshData(): Promise<void> {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    renderTrafficChart(); renderPagesChart(); renderFunnelChart()
    renderSourceChart(); renderDeviceChart(); renderPerformanceChart()
  } catch (error) {
    console.error('[AnalyticsDashboard] 刷新失败:', error)
  } finally {
    isLoading.value = false
  }
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  const d = new Date(timestamp)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function handleResize(): void {
  trafficChart?.resize(); pagesChart?.resize(); funnelChart?.resize()
  sourceChart?.resize(); deviceChart?.resize(); performanceChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
  ;(window as any).__analyticsDashboardRefreshInterval = setInterval(refreshData, 5 * 60 * 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trafficChart?.dispose(); pagesChart?.dispose(); funnelChart?.dispose()
  sourceChart?.dispose(); deviceChart?.dispose(); performanceChart?.dispose()
  clearInterval((window as any).__analyticsDashboardRefreshInterval)
})

watch(timeRange, () => { refreshData() })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
