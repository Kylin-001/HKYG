<template>
  <div class="finance-analytics">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-data-analysis"></i>
          数据分析
        </h1>
        <p>综合业务数据分析和趋势预测</p>
      </div>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="handleDateChange"
        ></el-date-picker>
        <el-select v-model="dataType" placeholder="数据类型" @change="handleDataTypeChange">
          <el-option label="全部数据" value="all"></el-option>
          <el-option label="销售数据" value="sales"></el-option>
          <el-option label="用户数据" value="user"></el-option>
          <el-option label="运营数据" value="operation"></el-option>
          <el-option label="配送数据" value="delivery"></el-option>
        </el-select>
        <el-button type="primary" @click="exportAnalytics" icon="el-icon-download">
          导出分析报告
        </el-button>
      </div>
    </div>

    <!-- 核心指标概览 -->
    <div class="metrics-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="metric-card primary">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-shopping-cart-full"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalOrders }}</h3>
                <p>总订单数</p>
                <span class="metric-trend up">
                  <i class="el-icon-top"></i>
                  {{ metrics.orderGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card success">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-user"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalUsers }}</h3>
                <p>活跃用户</p>
                <span class="metric-trend up">
                  <i class="el-icon-top"></i>
                  {{ metrics.userGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card warning">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-truck"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.deliveryRate }}%</h3>
                <p>配送成功率</p>
                <span class="metric-trend up">
                  <i class="el-icon-top"></i>
                  {{ metrics.deliveryGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card info">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-star-on"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.satisfactionRate }}%</h3>
                <p>用户满意度</p>
                <span class="metric-trend up">
                  <i class="el-icon-top"></i>
                  {{ metrics.satisfactionGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 销售趋势分析 -->
    <el-card class="chart-section">
      <div slot="header">
        <div class="card-header">
          <span>销售趋势分析</span>
          <el-radio-group v-model="trendTimeRange" size="mini" @change="handleTrendTimeRangeChange">
            <el-radio-button label="daily">日</el-radio-button>
            <el-radio-button label="weekly">周</el-radio-button>
            <el-radio-button label="monthly">月</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chart-container">
        <div id="salesTrendChart" class="chart"></div>
      </div>
    </el-card>

    <!-- 数据分析面板 -->
    <el-row :gutter="20">
      <!-- 用户增长分析 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>用户增长分析</span>
          </div>
          <div class="chart-container">
            <div id="userGrowthChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 订单类型分布 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>订单类型分布</span>
          </div>
          <div class="chart-container">
            <div id="orderTypeChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 配送效率分析 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>配送效率分析</span>
          </div>
          <div class="chart-container">
            <div id="deliveryEfficiencyChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 区域订单热力图 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>区域订单热力图</span>
          </div>
          <div class="chart-container">
            <div id="areaHeatmapChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-card class="analytics-table">
      <div slot="header">
        <div class="card-header">
          <span>详细数据分析</span>
          <div class="header-tools">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索关键词"
              prefix-icon="el-icon-search"
              size="mini"
              style="width: 200px"
              @input="handleSearch"
            ></el-input>
            <el-button size="mini" @click="refreshData">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="销售数据" name="sales">
          <el-table
            :data="filteredSalesData"
            stripe
            v-loading="tableLoading"
            @sort-change="handleSortChange"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="orderType" label="订单类型" width="120">
              <template v-slot="{ row }">
                <el-tag :type="getOrderTypeTag(row.orderType)" size="mini">
                  {{ getOrderTypeText(row.orderType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="orders"
              label="订单数"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="revenue" label="营收" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="revenue-amount">¥{{ row.revenue }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="avgOrderValue" label="平均客单价" width="120" sortable="custom">
              <template v-slot="{ row }">
                <span class="aov-amount">¥{{ row.avgOrderValue }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="conversionRate" label="转化率" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="conversion-rate">{{ row.conversionRate }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="refundRate" label="退款率" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="refund-rate">{{ row.refundRate }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="用户数据" name="user">
          <el-table
            :data="filteredUserData"
            stripe
            v-loading="tableLoading"
            @sort-change="handleSortChange"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column
              prop="newUsers"
              label="新用户"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column
              prop="activeUsers"
              label="活跃用户"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="retentionRate" label="留存率" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="retention-rate">{{ row.retentionRate }}%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="avgSessionTime"
              label="平均使用时长"
              width="120"
              sortable="custom"
            >
              <template v-slot="{ row }">
                <span class="session-time">{{ row.avgSessionTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column prop="engagementRate" label="参与度" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="engagement-rate">{{ row.engagementRate }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="运营数据" name="operation">
          <el-table
            :data="filteredOperationData"
            stripe
            v-loading="tableLoading"
            @sort-change="handleSortChange"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="deliveryTime" label="平均配送时长" width="120" sortable="custom">
              <template v-slot="{ row }">
                <span class="delivery-time">{{ row.deliveryTime }}分钟</span>
              </template>
            </el-table-column>
            <el-table-column prop="completionRate" label="完成率" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="completion-rate">{{ row.completionRate }}%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customerComplaints"
              label="客诉数"
              width="100"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="responseTime" label="平均响应时间" width="120" sortable="custom">
              <template v-slot="{ row }">
                <span class="response-time">{{ row.responseTime }}秒</span>
              </template>
            </el-table-column>
            <el-table-column prop="operationalCost" label="运营成本" width="100" sortable="custom">
              <template v-slot="{ row }">
                <span class="operational-cost">¥{{ row.operationalCost }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import logger from '@/utils/logger'

// 类型定义
interface Metrics {
  totalOrders: string
  orderGrowth: string
  totalUsers: string
  userGrowth: string
  deliveryRate: string
  deliveryGrowth: string
  satisfactionRate: string
  satisfactionGrowth: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface SortConfig {
  prop: string
  order: string
}

interface SalesDataItem {
  id: number
  date: string
  orderType: string
  orders: number
  revenue: string
  avgOrderValue: string
  conversionRate: string
  refundRate: string
}

interface UserDataItem {
  id: number
  date: string
  newUsers: number
  activeUsers: number
  retentionRate: string
  avgSessionTime: string
  engagementRate: string
}

interface OperationDataItem {
  id: number
  date: string
  deliveryTime: string
  completionRate: string
  customerComplaints: number
  responseTime: string
  operationalCost: string
}

// 响应式数据
const dateRange = ref<Date[]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()])
const dataType = ref<string>('all')
const trendTimeRange = ref<string>('daily')
const searchKeyword = ref<string>('')
const tableLoading = ref<boolean>(false)
const activeTab = ref<string>('sales')

const metrics = reactive<Metrics>({
  totalOrders: '45,678',
  orderGrowth: '+12.5%',
  totalUsers: '28,456',
  userGrowth: '+8.7%',
  deliveryRate: '98.2',
  deliveryGrowth: '+1.3%',
  satisfactionRate: '96.8',
  satisfactionGrowth: '+2.1%',
})

const pagination = reactive<Pagination>({
  page: 1,
  pageSize: 20,
  total: 0,
})

const sortConfig = reactive<SortConfig>({
  prop: 'date',
  order: 'descending',
})

const salesData = ref<SalesDataItem[]>([
  {
    id: 1,
    date: '2024-01-15',
    orderType: 'takeout',
    orders: 156,
    revenue: '15,680',
    avgOrderValue: '100.51',
    conversionRate: '12.8',
    refundRate: '2.3',
  },
  {
    id: 2,
    date: '2024-01-14',
    orderType: 'delivery',
    orders: 89,
    revenue: '8,950',
    avgOrderValue: '100.56',
    conversionRate: '14.2',
    refundRate: '1.8',
  },
  {
    id: 3,
    date: '2024-01-13',
    orderType: 'takeout',
    orders: 234,
    revenue: '23,400',
    avgOrderValue: '100.00',
    conversionRate: '11.5',
    refundRate: '3.1',
  },
  {
    id: 4,
    date: '2024-01-12',
    orderType: 'delivery',
    orders: 67,
    revenue: '6,700',
    avgOrderValue: '100.00',
    conversionRate: '15.8',
    refundRate: '1.2',
  },
  {
    id: 5,
    date: '2024-01-11',
    orderType: 'takeout',
    orders: 198,
    revenue: '19,800',
    avgOrderValue: '100.00',
    conversionRate: '13.4',
    refundRate: '2.7',
  },
])

const userData = ref<UserDataItem[]>([
  {
    id: 1,
    date: '2024-01-15',
    newUsers: 156,
    activeUsers: 2840,
    retentionRate: '78.5',
    avgSessionTime: '25.6',
    engagementRate: '68.9',
  },
  {
    id: 2,
    date: '2024-01-14',
    newUsers: 134,
    activeUsers: 2650,
    retentionRate: '76.2',
    avgSessionTime: '23.8',
    engagementRate: '65.4',
  },
  {
    id: 3,
    date: '2024-01-13',
    newUsers: 189,
    activeUsers: 3200,
    retentionRate: '82.1',
    avgSessionTime: '28.9',
    engagementRate: '72.3',
  },
])

const operationData = ref<OperationDataItem[]>([
  {
    id: 1,
    date: '2024-01-15',
    deliveryTime: '32.5',
    completionRate: '98.2',
    customerComplaints: 5,
    responseTime: '45.2',
    operationalCost: '2,340',
  },
  {
    id: 2,
    date: '2024-01-14',
    deliveryTime: '28.7',
    completionRate: '97.8',
    customerComplaints: 8,
    responseTime: '52.1',
    operationalCost: '2,180',
  },
  {
    id: 3,
    date: '2024-01-13',
    deliveryTime: '35.2',
    completionRate: '98.9',
    customerComplaints: 3,
    responseTime: '38.6',
    operationalCost: '2,560',
  },
])

const filteredSalesData = ref<SalesDataItem[]>([])
const filteredUserData = ref<UserDataItem[]>([])
const filteredOperationData = ref<OperationDataItem[]>([])

// 生命周期钩子
onMounted(() => {
  initData()
  initCharts()
})

// 初始化数据
function initData() {
  filteredSalesData.value = [...salesData.value]
  filteredUserData.value = [...userData.value]
  filteredOperationData.value = [...operationData.value]
  pagination.total = Math.max(
    salesData.value.length,
    userData.value.length,
    operationData.value.length
  )
}

// 初始化图表
function initCharts() {
  nextTick(() => {
    drawSalesTrendChart()
    drawUserGrowthChart()
    drawOrderTypeChart()
    drawDeliveryEfficiencyChart()
    drawAreaHeatmapChart()
  })
}

// 绘制销售趋势图表
function drawSalesTrendChart() {
  const container = document.getElementById('salesTrendChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 350px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📈</div>
          <div style="font-weight: bold;">销售趋势图表</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">显示销售数据变化趋势</div>
        </div>
      </div>
    `
  }
}

// 绘制用户增长图表
function drawUserGrowthChart() {
  const container = document.getElementById('userGrowthChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">👥</div>
          <div style="font-weight: bold;">用户增长图表</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">用户数量增长趋势分析</div>
        </div>
      </div>
    `
  }
}

// 绘制订单类型分布图表
function drawOrderTypeChart() {
  const container = document.getElementById('orderTypeChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
          <div style="font-weight: bold;">订单类型分布</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">不同类型订单占比分析</div>
        </div>
      </div>
    `
  }
}

// 绘制配送效率分析图表
function drawDeliveryEfficiencyChart() {
  const container = document.getElementById('deliveryEfficiencyChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🚚</div>
          <div style="font-weight: bold;">配送效率分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">配送效率和时效分析</div>
        </div>
      </div>
    `
  }
}

// 绘制区域热力图
function drawAreaHeatmapChart() {
  const container = document.getElementById('areaHeatmapChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🗺️</div>
          <div style="font-weight: bold;">区域热力图</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">各区域订单分布热力图</div>
        </div>
      </div>
    `
  }
}

// 事件处理
function handleDateChange() {
  loadAnalyticsData()
}

function handleDataTypeChange() {
  loadAnalyticsData()
}

function handleTrendTimeRangeChange() {
  drawSalesTrendChart()
}

function handleSearch() {
  filterData()
}

function handleTabChange(tab: any) {
  activeTab.value = tab.name
  pagination.page = 1
  filterData()
}

function handleSortChange({ prop, order }: any) {
  sortConfig.prop = prop
  sortConfig.order = order
  filterData()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  filterData()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  filterData()
}

// 刷新数据
function refreshData() {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

// 过滤数据
function filterData() {
  // 根据当前标签页过滤数据
  let data: any[] = []
  switch (activeTab.value) {
    case 'sales':
      data = [...salesData.value]
      break
    case 'user':
      data = [...userData.value]
      break
    case 'operation':
      data = [...operationData.value]
      break
  }

  // 关键词搜索
  if (searchKeyword.value) {
    data = data.filter(item => {
      return Object.values(item).some(value => String(value).includes(searchKeyword.value))
    })
  }

  // 排序
  if (sortConfig.prop && data.length > 0) {
    data.sort((a, b) => {
      let aVal = a[sortConfig.prop]
      let bVal = b[sortConfig.prop]

      // 数值排序
      if (typeof aVal === 'number' || (!isNaN(parseFloat(aVal)) && isFinite(aVal))) {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      }

      if (sortConfig.order === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  // 更新对应数据
  switch (activeTab.value) {
    case 'sales':
      filteredSalesData.value = data
      break
    case 'user':
      filteredUserData.value = data
      break
    case 'operation':
      filteredOperationData.value = data
      break
  }

  pagination.total = data.length
}

// 加载分析数据
function loadAnalyticsData() {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('加载分析数据...', {
      dateRange: dateRange.value,
      dataType: dataType.value,
    })
  }
  filterData()
  initCharts()
}

// 获取订单类型文本
function getOrderTypeText(type: string) {
  const typeMap: Record<string, string> = {
    takeout: '外卖订单',
    delivery: '跑腿服务',
    retail: '零售订单',
  }
  return typeMap[type] || '未知'
}

// 获取订单类型标签
function getOrderTypeTag(type: string) {
  const tagMap: Record<string, string> = {
    takeout: 'primary',
    delivery: 'success',
    retail: 'warning',
  }
  return tagMap[type] || 'info'
}

// 导出分析报告
function exportAnalytics() {
  ElMessage.info('正在导出分析报告...')
  setTimeout(() => {
    ElMessage.success('分析报告导出成功')
  }, 2000)
}
</script>

<style scoped>
.finance-analytics {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
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
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.metrics-overview {
  margin-bottom: 20px;
}

.metric-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.metric-card.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.metric-card.warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #333;
}

.metric-card.info {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 20px;
}

.metric-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.metric-info p {
  margin: 5px 0;
  opacity: 0.8;
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.up {
  color: inherit;
}

.chart-section {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  position: relative;
}

.analytics-table {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-tools {
  display: flex;
  gap: 10px;
  align-items: center;
}

.revenue-amount {
  color: #67c23a;
  font-weight: 500;
}

.aov-amount {
  color: #409eff;
  font-weight: 500;
}

.conversion-rate {
  color: #e6a23c;
  font-weight: 500;
}

.refund-rate {
  color: #f56c6c;
  font-weight: 500;
}

.retention-rate {
  color: #67c23a;
  font-weight: 500;
}

.session-time {
  color: #909399;
  font-weight: 500;
}

.engagement-rate {
  color: #409eff;
  font-weight: 500;
}

.delivery-time {
  color: #e6a23c;
  font-weight: 500;
}

.completion-rate {
  color: #67c23a;
  font-weight: 500;
}

.response-time {
  color: #909399;
  font-weight: 500;
}

.operational-cost {
  color: #f56c6c;
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .metrics-overview .el-col {
    margin-bottom: 15px;
  }
}

@media (max-width: 576px) {
  .finance-analytics {
    padding: 15px;
  }

  .metric-content {
    gap: 10px;
  }

  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .metric-info h3 {
    font-size: 20px;
  }
}
</style>
