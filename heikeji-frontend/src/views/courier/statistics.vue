<template>
  <div class="courier-statistics">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-data-analysis"></i>
          数据统计
        </h1>
        <p>查看您的配送业绩和数据趋势</p>
      </div>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="handleDateRangeChange"
        ></el-date-picker>
        <el-button type="primary" @click="exportReport">
          <i class="el-icon-download"></i>
          导出报表
        </el-button>
      </div>
    </div>

    <!-- 概览统计卡片 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card delivery-count">
            <div class="card-content">
              <div class="card-icon">
                <i class="el-icon-truck"></i>
              </div>
              <div class="card-info">
                <h3>{{ overviewStats.totalDeliveries }}</h3>
                <p>总配送数</p>
                <div class="trend">
                  <i
                    class="el-icon-top"
                    :class="{
                      up: overviewStats.deliveryTrend > 0,
                      down: overviewStats.deliveryTrend < 0,
                    }"
                  ></i>
                  <span>{{ Math.abs(overviewStats.deliveryTrend) }}% 相比上期</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card total-income">
            <div class="card-content">
              <div class="card-icon">
                <i class="el-icon-money"></i>
              </div>
              <div class="card-info">
                <h3>¥{{ overviewStats.totalIncome.toFixed(2) }}</h3>
                <p>总收入</p>
                <div class="trend">
                  <i
                    class="el-icon-top"
                    :class="{
                      up: overviewStats.incomeTrend > 0,
                      down: overviewStats.incomeTrend < 0,
                    }"
                  ></i>
                  <span>{{ Math.abs(overviewStats.incomeTrend) }}% 相比上期</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card avg-rating">
            <div class="card-content">
              <div class="card-icon">
                <i class="el-icon-star-on"></i>
              </div>
              <div class="card-info">
                <h3>{{ overviewStats.avgRating.toFixed(1) }}</h3>
                <p>平均评分</p>
                <div class="trend">
                  <el-rate
                    v-model="overviewStats.avgRating"
                    disabled
                    size="small"
                    :max="5"
                  ></el-rate>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card avg-delivery-time">
            <div class="card-content">
              <div class="card-icon">
                <i class="el-icon-time"></i>
              </div>
              <div class="card-info">
                <h3>{{ overviewStats.avgDeliveryTime }}分钟</h3>
                <p>平均配送时长</p>
                <div class="trend">
                  <i
                    class="el-icon-bottom"
                    :class="{ down: overviewStats.timeTrend < 0, up: overviewStats.timeTrend > 0 }"
                  ></i>
                  <span>{{ Math.abs(overviewStats.timeTrend) }}% 相比上期</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <!-- 配送趋势图表 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <div v-slot:header>
            <div class="card-header">
              <span>配送趋势</span>
              <div class="chart-tabs">
                <el-button-group>
                  <el-button
                    :type="trendChartType === 'daily' ? 'primary' : 'default'"
                    size="mini"
                    @click="trendChartType = 'daily'"
                  >
                    按日
                  </el-button>
                  <el-button
                    :type="trendChartType === 'weekly' ? 'primary' : 'default'"
                    size="mini"
                    @click="trendChartType = 'weekly'"
                  >
                    按周
                  </el-button>
                  <el-button
                    :type="trendChartType === 'monthly' ? 'primary' : 'default'"
                    size="mini"
                    @click="trendChartType = 'monthly'"
                  >
                    按月
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div ref="trendChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 订单类型分布 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <div v-slot:header>
            <span>订单类型分布</span>
          </div>
          <div class="chart-container">
            <div ref="orderTypeChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 收入分析 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <div v-slot:header>
            <span>收入分析</span>
          </div>
          <div class="chart-container">
            <div ref="incomeChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 时段配送分布 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <div v-slot:header>
            <span>时段配送分布</span>
          </div>
          <div class="chart-container">
            <div ref="timeDistributionChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-card class="data-table-card" style="margin-top: 20px">
      <div v-slot:header>
        <div class="card-header">
          <span>详细数据</span>
          <div class="table-actions">
            <el-button size="mini" type="primary" @click="refreshData">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="每日统计" name="daily">
          <el-table :data="dailyStats" style="width: 100%" height="400">
            <el-table-column prop="date" label="日期" width="120"></el-table-column>
            <el-table-column prop="deliveries" label="配送数" width="80"></el-table-column>
            <el-table-column prop="income" label="收入" width="80">
              <template v-slot="{ row }"> ¥{{ row.income.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column
              prop="avgDeliveryTime"
              label="平均时长(分钟)"
              width="120"
            ></el-table-column>
            <el-table-column prop="takeoutOrders" label="外卖" width="60"></el-table-column>
            <el-table-column prop="pickupOrders" label="取快递" width="80"></el-table-column>
            <el-table-column prop="buyOrders" label="代购" width="60"></el-table-column>
            <el-table-column prop="rating" label="评分" width="80">
              <template v-slot="{ row }">
                <el-rate v-model="row.rating" disabled size="small" :max="5"></el-rate>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="订单类型" name="orderType">
          <el-table :data="orderTypeStats" style="width: 100%" height="400">
            <el-table-column prop="type" label="订单类型" width="120">
              <template v-slot="{ row }">
                {{ getOrderTypeText(row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" width="80"></el-table-column>
            <el-table-column prop="percentage" label="占比" width="80">
              <template slot-scope="{ row }"> {{ (row.percentage * 100).toFixed(1) }}% </template>
            </el-table-column>
            <el-table-column prop="totalIncome" label="总收入" width="120">
              <template v-slot="{ row }"> ¥{{ row.totalIncome.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="avgIncome" label="平均收入" width="120">
              <template v-slot="{ row }"> ¥{{ row.avgIncome.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="avgDeliveryTime" label="平均时长" width="100">
              <template v-slot="{ row }"> {{ row.avgDeliveryTime }}分钟 </template>
            </el-table-column>
            <el-table-column prop="avgRating" label="平均评分" width="100">
              <template slot-scope="{ row }">
                {{ row.avgRating.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="区域统计" name="area">
          <el-table :data="areaStats" style="width: 100%" height="400">
            <el-table-column prop="area" label="区域" width="150"></el-table-column>
            <el-table-column prop="deliveries" label="配送数" width="80"></el-table-column>
            <el-table-column prop="totalDistance" label="总距离(km)" width="100">
              <template v-slot="{ row }">
                {{ row.totalDistance.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column prop="avgDistance" label="平均距离" width="100">
              <template v-slot="{ row }">
                {{ row.avgDistance.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column prop="totalIncome" label="总收入" width="120">
              <template v-slot="{ row }"> ¥{{ row.totalIncome.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="avgIncome" label="平均收入" width="120">
              <template v-slot="{ row }"> ¥{{ row.avgIncome.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="avgTime" label="平均时长" width="100">
              <template slot-scope="{ row }"> {{ row.avgTime }}分钟 </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 成就徽章 -->
    <el-card class="achievements-card" style="margin-top: 20px">
      <div v-slot:header>
        <span>成就徽章</span>
      </div>
      <div class="achievements-grid">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">
            <i :class="achievement.icon"></i>
          </div>
          <div class="achievement-info">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
            <div class="achievement-progress">
              <el-progress
                :percentage="achievement.progress"
                :show-text="false"
                :stroke-width="6"
              ></el-progress>
              <span class="progress-text">
                {{ achievement.current }}/{{ achievement.target }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// TypeScript 类型定义
interface OverviewStats {
  totalDeliveries: number
  totalIncome: number
  avgRating: number
  avgDeliveryTime: number
  deliveryTrend: number
  incomeTrend: number
  timeTrend: number
}

interface DailyStat {
  date: string
  deliveries: number
  income: number
  avgDeliveryTime: number
  takeoutOrders: number
  pickupOrders: number
  buyOrders: number
  rating: number
}

interface OrderTypeStat {
  type: 'takeout' | 'pickup' | 'buy'
  count: number
  percentage: number
  totalIncome: number
  avgIncome: number
  avgDeliveryTime: number
  avgRating: number
}

interface AreaStat {
  area: string
  deliveries: number
  totalDistance: number
  avgDistance: number
  totalIncome: number
  avgIncome: number
  avgTime: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  current: number
  target: number
  progress: number
  unlocked: boolean
}

// 响应式数据
const dateRange = ref<string[]>([])
const trendChartType = ref<'daily' | 'weekly' | 'monthly'>('daily')
const activeTab = ref<'daily' | 'orderType' | 'area'>('daily')
const trendChart = ref<HTMLElement | null>(null)
const orderTypeChart = ref<HTMLElement | null>(null)
const incomeChart = ref<HTMLElement | null>(null)
const timeDistributionChart = ref<HTMLElement | null>(null)

const overviewStats = reactive<OverviewStats>({
  totalDeliveries: 1256,
  totalIncome: 8945.6,
  avgRating: 4.8,
  avgDeliveryTime: 16,
  deliveryTrend: 12.5,
  incomeTrend: 8.3,
  timeTrend: -5.2,
})

const dailyStats = reactive<DailyStat[]>([
  {
    date: '2024-01-15',
    deliveries: 15,
    income: 112.5,
    avgDeliveryTime: 14,
    takeoutOrders: 8,
    pickupOrders: 5,
    buyOrders: 2,
    rating: 4.9,
  },
  {
    date: '2024-01-14',
    deliveries: 12,
    income: 89.3,
    avgDeliveryTime: 16,
    takeoutOrders: 7,
    pickupOrders: 3,
    buyOrders: 2,
    rating: 4.7,
  },
  {
    date: '2024-01-13',
    deliveries: 18,
    income: 135.2,
    avgDeliveryTime: 15,
    takeoutOrders: 10,
    pickupOrders: 6,
    buyOrders: 2,
    rating: 4.8,
  },
  {
    date: '2024-01-12',
    deliveries: 14,
    income: 105.8,
    avgDeliveryTime: 17,
    takeoutOrders: 8,
    pickupOrders: 4,
    buyOrders: 2,
    rating: 4.6,
  },
  {
    date: '2024-01-11',
    deliveries: 16,
    income: 118.9,
    avgDeliveryTime: 15,
    takeoutOrders: 9,
    pickupOrders: 5,
    buyOrders: 2,
    rating: 4.8,
  },
])

const orderTypeStats = reactive<OrderTypeStat[]>([
  {
    type: 'takeout',
    count: 756,
    percentage: 0.6,
    totalIncome: 5674.5,
    avgIncome: 7.5,
    avgDeliveryTime: 18,
    avgRating: 4.7,
  },
  {
    type: 'pickup',
    count: 378,
    percentage: 0.3,
    totalIncome: 2268.0,
    avgIncome: 6.0,
    avgDeliveryTime: 12,
    avgRating: 4.9,
  },
  {
    type: 'buy',
    count: 122,
    percentage: 0.1,
    totalIncome: 1003.1,
    avgIncome: 8.22,
    avgDeliveryTime: 22,
    avgRating: 4.8,
  },
])

const areaStats = reactive<AreaStat[]>([
  {
    area: '东北校区',
    deliveries: 456,
    totalDistance: 623.4,
    avgDistance: 1.37,
    totalIncome: 3256.8,
    avgIncome: 7.14,
    avgTime: 15,
  },
  {
    area: '西南校区',
    deliveries: 378,
    totalDistance: 756.8,
    avgDistance: 2.0,
    totalIncome: 3024.6,
    avgIncome: 8.0,
    avgTime: 18,
  },
  {
    area: '西北校区',
    deliveries: 298,
    totalDistance: 476.9,
    avgDistance: 1.6,
    totalIncome: 1987.2,
    avgIncome: 6.67,
    avgTime: 16,
  },
  {
    area: '东南校区',
    deliveries: 124,
    totalDistance: 186.2,
    avgDistance: 1.5,
    totalIncome: 677.0,
    avgIncome: 5.46,
    avgTime: 14,
  },
])

const achievements = reactive<Achievement[]>([
  {
    id: 1,
    title: '新手上路',
    description: '完成第一次配送',
    icon: 'el-icon-medal',
    current: 1,
    target: 1,
    progress: 100,
    unlocked: true,
  },
  {
    id: 2,
    title: '勤奋配送员',
    description: '单日完成20单配送',
    icon: 'el-icon-sunny',
    current: 15,
    target: 20,
    progress: 75,
    unlocked: false,
  },
  {
    id: 3,
    title: '收入达人',
    description: '单日收入超过150元',
    icon: 'el-icon-money',
    current: 135.2,
    target: 150,
    progress: 90,
    unlocked: false,
  },
  {
    id: 4,
    title: '服务之星',
    description: '获得100个五星好评',
    icon: 'el-icon-star-on',
    current: 87,
    target: 100,
    progress: 87,
    unlocked: false,
  },
  {
    id: 5,
    title: '闪电侠',
    description: '单次配送用时少于10分钟',
    icon: 'el-icon-lightning',
    current: 3,
    target: 10,
    progress: 30,
    unlocked: false,
  },
  {
    id: 6,
    title: '千里之行',
    description: '累计配送距离超过1000公里',
    icon: 'el-icon-map-location',
    current: 856.4,
    target: 1000,
    progress: 86,
    unlocked: false,
  },
])

// 生命周期钩子
onMounted(() => {
  // 设置默认日期范围（最近7天）
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 7)

  dateRange.value = [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]

  initCharts()
})

// 方法
const handleDateRangeChange = () => {
  initCharts()
}

const handleTabChange = () => {
  // 切换标签时刷新数据
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
  // 实际应用中这里会重新获取数据
}

const exportReport = () => {
  ElMessage.info('报表导出功能开发中...')
}

const initCharts = () => {
  // 这里应该使用 ECharts 或其他图表库初始化图表
  logger.log('初始化统计图表...')
  logger.log('图表类型:', trendChartType.value)
  logger.log('日期范围:', dateRange.value)
}

const getOrderTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    takeout: '外卖配送',
    pickup: '取快递',
    buy: '代购商品',
  }
  return typeMap[type] || '未知'
}
</script>

<style scoped>
.courier-statistics {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-content h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.header-content h1 i {
  margin-right: 10px;
  color: #409eff;
}

.header-content p {
  margin: 5px 0 0 35px;
  color: #606266;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: none;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.overview-card.delivery-count .card-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.overview-card.total-income .card-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.overview-card.avg-rating .card-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.overview-card.avg-delivery-time .card-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-info h3 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.card-info p {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.trend {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.trend i {
  font-size: 12px;
  margin-right: 4px;
}

.trend .up {
  color: #67c23a;
}

.trend .down {
  color: #f56c6c;
}

.trend span {
  font-size: 12px;
  color: #909399;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-tabs {
  display: flex;
  gap: 10px;
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.data-table-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-actions {
  display: flex;
  gap: 10px;
}

.achievements-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6fffa 100%);
}

.achievement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: #909399;
  background: #f5f5f5;
  transition: all 0.3s ease;
}

.achievement-item.unlocked .achievement-icon {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
}

.achievement-info p {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.achievement-progress .el-progress {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}
</style>
