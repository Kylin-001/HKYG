<template>
  <div class="order-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>订单统计</h2>
        <span class="subtitle">分析平台的订单数据</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <el-card class="stats-card">
      <div class="stats-grid">
        <el-statistic title="总订单数" :value="totalOrders">
          <template #suffix>
            <el-progress
              :percentage="ordersGrowth"
              :color="ordersGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="成交订单数" :value="completedOrders">
          <template #suffix>
            <el-progress :percentage="completedOrdersRate" color="#67c23a" />
          </template>
        </el-statistic>
        <el-statistic title="取消订单数" :value="cancelledOrders">
          <template #suffix>
            <el-progress :percentage="cancelledOrdersRate" color="#f56c6c" />
          </template>
        </el-statistic>
        <el-statistic title="平均订单金额" :value="averageOrderValue" prefix="¥" :precision="2">
          <template #suffix>
            <el-progress
              :percentage="avgOrderValueGrowth"
              :color="avgOrderValueGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
      </div>
    </el-card>

    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterParams" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
            @change="handleDateRangeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filterParams.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待付款" value="1"></el-option>
            <el-option label="待发货" value="2"></el-option>
            <el-option label="已发货" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
            <el-option label="已取消" value="5"></el-option>
            <el-option label="退款中" value="6"></el-option>
            <el-option label="已退款" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filterParams.paymentMethod" placeholder="请选择支付方式" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="微信支付" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="余额支付" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表区域 -->
    <el-card class="chart-card">
      <template #header>
        <div class="chart-header">
          <h3 class="chart-title">订单趋势</h3>
          <el-select v-model="chartType" placeholder="图表类型" style="width: 120px">
            <el-option label="折线图" value="line"></el-option>
            <el-option label="柱状图" value="bar"></el-option>
          </el-select>
        </div>
      </template>
      <div class="chart-container">
        <div ref="orderChartRef" class="order-chart"></div>
      </div>
    </el-card>

    <!-- 订单统计详情 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">订单统计详情</h3>
          <el-select v-model="detailType" placeholder="统计维度" style="width: 120px">
            <el-option label="按日期" value="date"></el-option>
            <el-option label="按订单类型" value="type"></el-option>
            <el-option label="按支付方式" value="payment"></el-option>
          </el-select>
        </div>
      </template>
      <el-table v-loading="loading" :data="orderStatsData" style="width: 100%" border stripe>
        <template v-if="detailType === 'date'">
          <el-table-column prop="date" label="日期" width="120" align="center"></el-table-column>
          <el-table-column
            prop="orderCount"
            label="订单数"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="completedCount"
            label="成交数"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cancelledCount"
            label="取消数"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
            <template #default="scope">¥{{ scope.row.totalAmount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="avgAmount" label="平均金额" width="120" align="right">
            <template #default="scope">¥{{ scope.row.avgAmount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="growthRate" label="增长率" width="120" align="center">
            <template #default="scope">
              <span
                :class="{
                  'growth-positive': scope.row.growthRate > 0,
                  'growth-negative': scope.row.growthRate < 0,
                }"
              >
                {{ scope.row.growthRate > 0 ? '+' : '' }}{{ scope.row.growthRate }}%
              </span>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="detailType === 'type'">
          <el-table-column
            prop="type"
            label="订单类型"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderCount"
            label="订单数"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="percentage" label="占比" width="100" align="center">
            <template #default="scope">{{ scope.row.percentage }}%</template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
            <template #default="scope">¥{{ scope.row.totalAmount.toFixed(2) }}</template>
          </el-table-column>
        </template>
        <template v-else-if="detailType === 'payment'">
          <el-table-column
            prop="paymentMethod"
            label="支付方式"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderCount"
            label="订单数"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="percentage" label="占比" width="100" align="center">
            <template #default="scope">{{ scope.row.percentage }}%</template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
            <template #default="scope">¥{{ scope.row.totalAmount.toFixed(2) }}</template>
          </el-table-column>
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 类型定义
interface OrderStatsByDate {
  date: string
  orderCount: number
  completedCount: number
  cancelledCount: number
  totalAmount: number
  avgAmount: number
  growthRate: number
}

interface OrderStatsByType {
  type: string
  orderCount: number
  percentage: number
  totalAmount: number
}

interface OrderStatsByPayment {
  paymentMethod: string
  orderCount: number
  percentage: number
  totalAmount: number
}

// 响应式状态
const loading = ref(false)
const orderChartRef = ref<HTMLElement>()
let orderChart: echarts.ECharts | null = null

// 筛选参数
const filterParams = reactive({
  dateRange: [] as [string, string],
  orderStatus: '',
  paymentMethod: '',
})

// 图表类型
const chartType = ref('line')

// 统计维度
const detailType = ref('date')

// 统计数据
const totalOrders = ref(12345)
const completedOrders = ref(11234)
const cancelledOrders = ref(1111)
const averageOrderValue = ref(234.56)

// 增长率数据
const ordersGrowth = ref(8.5)
const completedOrdersRate = ref(90.9)
const cancelledOrdersRate = ref(9.1)
const avgOrderValueGrowth = ref(5.2)

// 订单统计详情数据
const orderStatsData = ref<any[]>([])
const total = ref(0)

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 模拟订单趋势数据
const orderTrendData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  orderCount: [1200, 1500, 1800, 1600, 2000, 2500, 2800, 3000, 2700, 3200, 3500, 4000],
  completedCount: [1100, 1350, 1650, 1480, 1850, 2300, 2600, 2800, 2500, 3000, 3300, 3750],
  cancelledCount: [100, 150, 150, 120, 150, 200, 200, 200, 200, 200, 200, 250],
}

// 生命周期钩子
onMounted(() => {
  // 初始化图表
  initChart()
  // 加载订单统计数据
  loadOrderStatsData()
})

onUnmounted(() => {
  // 销毁图表
  if (orderChart) {
    orderChart.dispose()
    orderChart = null
  }
})

// 监听图表类型变化
watch(chartType, () => {
  updateChart()
})

// 监听统计维度变化
watch(detailType, () => {
  loadOrderStatsData()
})

// 初始化图表
const initChart = () => {
  if (orderChartRef.value) {
    orderChart = echarts.init(orderChartRef.value)
    updateChart()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  }
}

// 更新图表
const updateChart = () => {
  if (!orderChart) return

  const option = {
    title: {
      text: '订单趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['总订单数', '成交订单数', '取消订单数'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: chartType.value === 'bar' ? true : false,
        data: orderTrendData.dates,
        axisLabel: {
          rotate: 30,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '总订单数',
        type: chartType.value,
        data: orderTrendData.orderCount,
        smooth: chartType.value === 'line',
        itemStyle: {
          color: '#003366',
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '成交订单数',
        type: chartType.value,
        data: orderTrendData.completedCount,
        smooth: chartType.value === 'line',
        itemStyle: {
          color: '#67c23a',
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '取消订单数',
        type: chartType.value,
        data: orderTrendData.cancelledCount,
        smooth: chartType.value === 'line',
        itemStyle: {
          color: '#f56c6c',
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }

  orderChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  orderChart?.resize()
}

// 加载订单统计数据
const loadOrderStatsData = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    // 根据统计维度生成不同的模拟数据
    if (detailType.value === 'date') {
      // 按日期统计
      const mockData: OrderStatsByDate[] = []
      for (let i = 1; i <= 30; i++) {
        mockData.push({
          date: `2026-01-${i.toString().padStart(2, '0')}`,
          orderCount: Math.floor(Math.random() * 200) + 100,
          completedCount: Math.floor(Math.random() * 180) + 90,
          cancelledCount: Math.floor(Math.random() * 20) + 10,
          totalAmount: Math.random() * 50000 + 20000,
          avgAmount: Math.random() * 300 + 200,
          growthRate: (Math.random() - 0.5) * 20,
        })
      }
      orderStatsData.value = mockData
      total.value = mockData.length
    } else if (detailType.value === 'type') {
      // 按订单类型统计
      const mockData: OrderStatsByType[] = [
        { type: '普通订单', orderCount: 8567, percentage: 69.4, totalAmount: 2012345.67 },
        { type: '外卖订单', orderCount: 2345, percentage: 18.9, totalAmount: 556789.01 },
        { type: '跑腿订单', orderCount: 1456, percentage: 11.7, totalAmount: 345678.9 },
      ]
      orderStatsData.value = mockData
      total.value = mockData.length
    } else if (detailType.value === 'payment') {
      // 按支付方式统计
      const mockData: OrderStatsByPayment[] = [
        { paymentMethod: '微信支付', orderCount: 9876, percentage: 79.8, totalAmount: 2345678.9 },
        { paymentMethod: '支付宝', orderCount: 2134, percentage: 17.2, totalAmount: 501234.56 },
        { paymentMethod: '余额支付', orderCount: 335, percentage: 3.0, totalAmount: 76543.21 },
      ]
      orderStatsData.value = mockData
      total.value = mockData.length
    }
  } catch (error) {
    ElMessage.error('获取订单统计数据失败')
  } finally {
    loading.value = false
  }
}

// 处理日期范围变化
const handleDateRangeChange = () => {
  console.log('Date range changed:', filterParams.dateRange)
  // 可以在这里更新图表数据
}

// 搜索数据
const handleSearch = () => {
  pagination.currentPage = 1
  loadOrderStatsData()
}

// 重置筛选条件
const handleReset = () => {
  filterParams.dateRange = [] as [string, string]
  filterParams.orderStatus = ''
  filterParams.paymentMethod = ''
  pagination.currentPage = 1
  loadOrderStatsData()
}

// 刷新数据
const handleRefresh = () => {
  loadOrderStatsData()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出功能已触发')
}

// 分页变化处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadOrderStatsData()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadOrderStatsData()
}
</script>

<style scoped>
.order-stats {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #999;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.stats-card {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  flex-wrap: wrap;
  gap: 10px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  margin-top: 20px;
}

.order-chart {
  width: 100%;
  height: 100%;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.growth-positive {
  color: #67c23a;
}

.growth-negative {
  color: #f56c6c;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
