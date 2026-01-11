<template>
  <div class="order-stats-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">订单统计</div>
      </div>
    </div>

    <!-- 统计筛选 -->
    <div class="stats-filter">
      <div class="filter-item">
        <span class="filter-label">时间范围：</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="loadOrderStats"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <span class="filter-label">订单状态：</span>
        <el-select v-model="selectedStatus" placeholder="全部" @change="loadOrderStats">
          <el-option label="全部" value=""></el-option>
          <el-option label="待付款" value="10"></el-option>
          <el-option label="待发货" value="20"></el-option>
          <el-option label="待收货" value="30"></el-option>
          <el-option label="待评价" value="40"></el-option>
          <el-option label="已完成" value="50"></el-option>
          <el-option label="已取消" value="60"></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="loadOrderStats" :loading="loading">查询</el-button>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="overview-card">
        <div class="card-content">
          <div class="card-title">订单总数</div>
          <div class="card-value">{{ statsData.totalOrders }}</div>
          <div
            class="card-change"
            :class="{
              'change-up': statsData.orderChange > 0,
              'change-down': statsData.orderChange < 0,
            }"
          >
            <span v-if="statsData.orderChange !== 0"
              >{{ statsData.orderChange > 0 ? '+' : '' }}{{ statsData.orderChange }}%</span
            >
            <span v-else>--</span>
            <span class="change-text">较上期</span>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-content">
          <div class="card-title">销售总额</div>
          <div class="card-value">¥{{ statsData.totalAmount.toFixed(2) }}</div>
          <div
            class="card-change"
            :class="{
              'change-up': statsData.amountChange > 0,
              'change-down': statsData.amountChange < 0,
            }"
          >
            <span v-if="statsData.amountChange !== 0"
              >{{ statsData.amountChange > 0 ? '+' : '' }}{{ statsData.amountChange }}%</span
            >
            <span v-else>--</span>
            <span class="change-text">较上期</span>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-content">
          <div class="card-title">订单转化率</div>
          <div class="card-value">{{ statsData.conversionRate }}%</div>
          <div
            class="card-change"
            :class="{
              'change-up': statsData.conversionChange > 0,
              'change-down': statsData.conversionChange < 0,
            }"
          >
            <span v-if="statsData.conversionChange !== 0"
              >{{ statsData.conversionChange > 0 ? '+' : ''
              }}{{ statsData.conversionChange }}%</span
            >
            <span v-else>--</span>
            <span class="change-text">较上期</span>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-content">
          <div class="card-title">平均客单价</div>
          <div class="card-value">¥{{ statsData.averagePrice.toFixed(2) }}</div>
          <div
            class="card-change"
            :class="{
              'change-up': statsData.averageChange > 0,
              'change-down': statsData.averageChange < 0,
            }"
          >
            <span v-if="statsData.averageChange !== 0"
              >{{ statsData.averageChange > 0 ? '+' : '' }}{{ statsData.averageChange }}%</span
            >
            <span v-else>--</span>
            <span class="change-text">较上期</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计图表 -->
    <div class="stats-charts">
      <!-- 销售趋势图 -->
      <div class="chart-card">
        <div class="chart-title">销售趋势</div>
        <div class="chart-container">
          <div v-if="loading" class="chart-loading">
            <el-loading-spinner></el-loading-spinner>
            <span>正在加载...</span>
          </div>
          <div v-else>
            <div ref="trendChartRef" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 订单状态分布 -->
      <div class="chart-card">
        <div class="chart-title">订单状态分布</div>
        <div class="chart-container">
          <div v-if="loading" class="chart-loading">
            <el-loading-spinner></el-loading-spinner>
            <span>正在加载...</span>
          </div>
          <div v-else>
            <div ref="statusChartRef" class="chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计表格 -->
    <div class="stats-table">
      <div class="table-title">订单统计明细</div>
      <div v-if="loading" class="table-loading">
        <el-skeleton :rows="5" animated></el-skeleton>
      </div>
      <el-table v-else :data="statsDetails" stripe>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="orderCount" label="订单数" width="120"></el-table-column>
        <el-table-column
          prop="totalAmount"
          label="销售金额"
          width="150"
          formatter="formatCurrency"
        ></el-table-column>
        <el-table-column
          prop="averagePrice"
          label="平均客单价"
          width="150"
          formatter="formatCurrency"
        ></el-table-column>
        <el-table-column
          prop="conversionRate"
          label="转化率"
          width="120"
          formatter="formatPercentage"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderStats } from '@/api/app/order'

// 初始化数据
const loading = ref(false)
const dateRange = ref([])
const selectedStatus = ref('')
const trendChartRef = ref(null)
const statusChartRef = ref(null)

// 统计数据
const statsData = ref({
  totalOrders: 0,
  totalAmount: 0,
  conversionRate: 0,
  averagePrice: 0,
  orderChange: 0,
  amountChange: 0,
  conversionChange: 0,
  averageChange: 0,
})

const statsDetails = ref([])

// 加载订单统计数据
const loadOrderStats = async () => {
  loading.value = true
  try {
    const params = {
      startDate: dateRange.value[0] ? new Date(dateRange.value[0]).toISOString().split('T')[0] : '',
      endDate: dateRange.value[1] ? new Date(dateRange.value[1]).toISOString().split('T')[0] : '',
      status: selectedStatus.value,
    }

    const response = await getOrderStats(params)
    statsData.value = response.data.summary || {
      totalOrders: 0,
      totalAmount: 0,
      conversionRate: 0,
      averagePrice: 0,
      orderChange: 0,
      amountChange: 0,
      conversionChange: 0,
      averageChange: 0,
    }
    statsDetails.value = response.data.details || []

    // 渲染图表
    renderCharts()
  } catch (error: any) {
    ElMessage.error(error.message || '加载统计数据失败')
  } finally {
    loading.value = false
  }
}

// 渲染图表
const renderCharts = () => {
  // 这里使用占位逻辑，实际项目中应使用echarts或其他图表库
  console.log('渲染销售趋势图', statsDetails.value)
  console.log('渲染订单状态分布', statsData.value)
}

// 格式化货币
const formatCurrency = (row, column, cellValue) => {
  return `¥${cellValue.toFixed(2)}`
}

// 格式化百分比
const formatPercentage = (row, column, cellValue) => {
  return `${cellValue}%`
}

// 组件挂载时加载数据
onMounted(() => {
  // 设置默认日期范围为最近7天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)
  dateRange.value = [startDate, endDate]

  loadOrderStats()
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 清理图表资源
})
</script>

<style scoped>
.order-stats-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 20px;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 统计筛选 */
.stats-filter {
  background-color: #fff;
  padding: 16px;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666;
  font-size: 14px;
}

/* 统计概览 */
.stats-overview {
  display: flex;
  gap: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
}

.overview-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  text-align: center;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.card-change {
  font-size: 12px;
}

.change-up {
  color: #67c23a;
}

.change-down {
  color: #f56c6c;
}

.change-text {
  margin-left: 4px;
  color: #999;
}

/* 统计图表 */
.stats-charts {
  display: flex;
  gap: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
}

.chart-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.chart-loading span {
  margin-top: 10px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 统计表格 */
.stats-table {
  background-color: #fff;
  margin: 0 10px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.table-loading {
  padding: 20px 0;
}
</style>
