<template>
  <div class="analytics-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-users">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activeUsers }}</div>
              <div class="stat-label">活跃用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-orders">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-revenue">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue }}</div>
              <div class="stat-label">总营收</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="userGrowthPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="userGrowthChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
              <el-radio-group v-model="orderTrendPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="orderTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>商品分类占比</span>
          </template>
          <div ref="categoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>用户等级分布</span>
          </template>
          <div ref="levelChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>推荐效果分析</span>
          </template>
          <div ref="recommendationChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户行为分析</span>
              <el-select v-model="behaviorType" size="small" style="width: 150px">
                <el-option label="浏览量" value="view"></el-option>
                <el-option label="点击量" value="click"></el-option>
                <el-option label="收藏量" value="favorite"></el-option>
                <el-option label="购买量" value="purchase"></el-option>
              </el-select>
            </div>
          </template>
          <div ref="behaviorChart" class="chart-container large"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>热门商品排行</span>
          </template>
          <el-table :data="topProducts" stripe>
            <el-table-column type="index" label="排名" width="80" align="center" />
            <el-table-column prop="name" label="商品名称" min-width="150" />
            <el-table-column prop="sales" label="销量" width="100" align="center" />
            <el-table-column prop="revenue" label="营收" width="120" align="center">
              <template #default="{ row }"> ¥{{ row.revenue }} </template>
            </el-table-column>
            <el-table-column prop="growth" label="增长率" width="100" align="center">
              <template #default="{ row }">
                <span :class="row.growth >= 0 ? 'growth-up' : 'growth-down'">
                  {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>活跃用户排行</span>
          </template>
          <el-table :data="activeUsersList" stripe>
            <el-table-column type="index" label="排名" width="80" align="center" />
            <el-table-column prop="username" label="用户名" min-width="120" />
            <el-table-column prop="points" label="积分" width="100" align="center" />
            <el-table-column prop="orders" label="订单数" width="100" align="center" />
            <el-table-column prop="level" label="等级" width="100" align="center" />
            <el-table-column prop="lastActive" label="最后活跃" width="150" align="center">
              <template #default="{ row }">
                {{ formatTime(row.lastActive) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { User, UserFilled, ShoppingCart, Money } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
])

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
})

const userGrowthPeriod = ref('week')
const orderTrendPeriod = ref('week')
const behaviorType = ref('view')

const userGrowthChart = ref(null)
const orderTrendChart = ref(null)
const categoryChart = ref(null)
const levelChart = ref(null)
const recommendationChart = ref(null)
const behaviorChart = ref(null)

const topProducts = ref([])
const activeUsersList = ref([])

let charts = []

const initUserGrowthChart = () => {
  if (!userGrowthChart.value) return

  const chart = echarts.init(userGrowthChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#409eff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ]),
        },
      },
    ],
  }

  chart.setOption(option)
}

const initOrderTrendChart = () => {
  if (!orderTrendChart.value) return

  const chart = echarts.init(orderTrendChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: [82, 93, 90, 104, 134, 190, 230],
        itemStyle: {
          color: '#67c23a',
        },
      },
    ],
  }

  chart.setOption(option)
}

const initCategoryChart = () => {
  if (!categoryChart.value) return

  const chart = echarts.init(categoryChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '商品分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '食品', itemStyle: { color: '#5470c6' } },
          { value: 735, name: '日用品', itemStyle: { color: '#91cc75' } },
          { value: 580, name: '电子产品', itemStyle: { color: '#fac858' } },
          { value: 484, name: '服装', itemStyle: { color: '#ee6666' } },
          { value: 300, name: '其他', itemStyle: { color: '#73c0de' } },
        ],
      },
    ],
  }

  chart.setOption(option)
}

const initLevelChart = () => {
  if (!levelChart.value) return

  const chart = echarts.init(levelChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['普通会员', '银卡会员', '金卡会员', '钻石会员'],
    },
    series: [
      {
        name: '用户数',
        type: 'bar',
        data: [18203, 23489, 29034, 104970],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ],
          },
        },
      },
    ],
  }

  chart.setOption(option)
}

const initRecommendationChart = () => {
  if (!recommendationChart.value) return

  const chart = echarts.init(recommendationChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['点击率', '转化率'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['User-CF', 'Item-CF', '混合推荐'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '点击率',
        type: 'bar',
        data: [12, 18, 15],
        itemStyle: { color: '#5470c6' },
      },
      {
        name: '转化率',
        type: 'bar',
        data: [8, 12, 10],
        itemStyle: { color: '#91cc75' },
      },
    ],
  }

  chart.setOption(option)
}

const initBehaviorChart = () => {
  if (!behaviorChart.value) return

  const chart = echarts.init(behaviorChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '行为次数',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 99, 132, 0.3)' },
            { offset: 1, color: 'rgba(255, 99, 132, 0.05)' },
          ]),
        },
        itemStyle: {
          color: '#ff6384',
        },
      },
    ],
  }

  chart.setOption(option)
}

const fetchStats = async () => {
  stats.value = {
    totalUsers: 12890,
    activeUsers: 8560,
    totalOrders: 45230,
    totalRevenue: 892340,
  }
}

const fetchTopProducts = async () => {
  topProducts.value = [
    { name: 'iPhone 15', sales: 2340, revenue: 1170000, growth: 15.2 },
    { name: 'MacBook Pro', sales: 1890, revenue: 1890000, growth: 8.5 },
    { name: 'AirPods Pro', sales: 1650, revenue: 247500, growth: 12.3 },
    { name: 'iPad Air', sales: 1430, revenue: 572000, growth: -2.1 },
    { name: 'Apple Watch', sales: 1280, revenue: 384000, growth: 5.8 },
  ]
}

const fetchActiveUsers = async () => {
  activeUsersList.value = [
    { username: 'user001', points: 12580, orders: 156, level: '钻石会员', lastActive: new Date() },
    {
      username: 'user002',
      points: 9840,
      orders: 123,
      level: '金卡会员',
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      username: 'user003',
      points: 8760,
      orders: 98,
      level: '金卡会员',
      lastActive: new Date(Date.now() - 7200000),
    },
    {
      username: 'user004',
      points: 6540,
      orders: 87,
      level: '银卡会员',
      lastActive: new Date(Date.now() - 10800000),
    },
    {
      username: 'user005',
      points: 5430,
      orders: 76,
      level: '银卡会员',
      lastActive: new Date(Date.now() - 14400000),
    },
  ]
}

const formatTime = time => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const handleResize = () => {
  charts.forEach(chart => {
    chart && chart.resize()
  })
}

onMounted(() => {
  fetchStats()
  fetchTopProducts()
  fetchActiveUsers()

  setTimeout(() => {
    initUserGrowthChart()
    initOrderTrendChart()
    initCategoryChart()
    initLevelChart()
    initRecommendationChart()
    initBehaviorChart()
  }, 100)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  charts.forEach(chart => {
    chart && chart.dispose()
  })
  window.removeEventListener('resize', handleResize)
})

watch([userGrowthPeriod, orderTrendPeriod, behaviorType], () => {
  charts.forEach(chart => {
    chart && chart.dispose()
  })
  charts = []

  setTimeout(() => {
    initUserGrowthChart()
    initOrderTrendChart()
    initBehaviorChart()
  }, 100)
})
</script>

<style scoped>
.analytics-dashboard {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.total-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active-users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.total-orders {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.total-revenue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.chart-container.large {
  height: 400px;
}

.table-card {
  margin-bottom: 20px;
}

.growth-up {
  color: #67c23a;
  font-weight: bold;
}

.growth-down {
  color: #f56c6c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 10px;
  }

  .stat-content {
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 250px;
  }

  .chart-container.large {
    height: 300px;
  }
}
</style>
