<template>
  <div class="sales-trend-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>销售趋势分析</h2>
        <span class="subtitle">分析平台的销售趋势数据</span>
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
        <el-statistic title="总销售额" :value="totalSales" prefix="¥" :precision="2">
          <template #suffix>
            <el-progress
              :percentage="salesGrowth"
              :color="salesGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="销售增长率" :value="salesGrowth" :precision="2" suffix="%">
          <template #suffix>
            <el-progress
              :percentage="Math.abs(salesGrowth)"
              :color="salesGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="平均客单价" :value="averageOrderValue" prefix="¥" :precision="2">
          <template #suffix>
            <el-progress
              :percentage="avgOrderValueGrowth"
              :color="avgOrderValueGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="销售订单量" :value="totalOrders">
          <template #suffix>
            <el-progress
              :percentage="orderGrowth"
              :color="orderGrowth > 0 ? '#67c23a' : '#f56c6c'"
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
            :shortcuts="dateShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="商品类别">
          <el-select v-model="filterParams.category" placeholder="请选择商品类别" clearable>
            <el-option label="全部" value="" />
            <el-option label="食品饮料" value="food" />
            <el-option label="数码家电" value="digital" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="家居用品" value="home" />
            <el-option label="运动户外" value="sports" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售渠道">
          <el-select v-model="filterParams.channel" placeholder="请选择销售渠道" clearable>
            <el-option label="全部" value="" />
            <el-option label="线上商城" value="online" />
            <el-option label="线下门店" value="offline" />
            <el-option label="第三方平台" value="third_party" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间粒度">
          <el-select v-model="filterParams.timeGranularity" placeholder="请选择时间粒度">
            <el-option label="按日" value="day" />
            <el-option label="按周" value="week" />
            <el-option label="按月" value="month" />
            <el-option label="按季" value="quarter" />
            <el-option label="按年" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表区域 -->
    <div class="chart-container">
      <el-card class="chart-card full-width">
        <template #header>
          <div class="chart-header">
            <span>销售趋势分析</span>
            <div class="chart-controls">
              <el-select
                v-model="chartType"
                placeholder="图表类型"
                style="width: 120px; margin-right: 10px"
              >
                <el-option label="折线图" value="line" />
                <el-option label="柱状图" value="bar" />
                <el-option label="面积图" value="area" />
              </el-select>
              <el-select v-model="comparisonType" placeholder="比较维度" style="width: 150px">
                <el-option label="销售额" value="sales" />
                <el-option label="订单量" value="orders" />
                <el-option label="平均客单价" value="avg_order_value" />
              </el-select>
            </div>
          </div>
        </template>
        <div class="chart-wrapper">
          <div ref="salesTrendChart" class="chart" style="width: 100%; height: 500px"></div>
        </div>
      </el-card>

      <div class="chart-row">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>销售渠道对比</span>
            </div>
          </template>
          <div class="chart-wrapper">
            <div
              ref="channelComparisonChart"
              class="chart"
              style="width: 100%; height: 350px"
            ></div>
          </div>
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>商品类别销售分布</span>
            </div>
          </template>
          <div class="chart-wrapper">
            <div
              ref="categoryDistributionChart"
              class="chart"
              style="width: 100%; height: 350px"
            ></div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>销售趋势详情</span>
          <el-select v-model="tableViewType" placeholder="视图类型">
            <el-option label="按时间统计" value="time" />
            <el-option label="按商品类别统计" value="category" />
            <el-option label="按销售渠道统计" value="channel" />
          </el-select>
        </div>
      </template>
      <div class="table-wrapper">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
          <el-table-column v-if="tableViewType === 'time'" prop="time" label="时间" width="150" />
          <el-table-column
            v-else-if="tableViewType === 'category'"
            prop="category"
            label="商品类别"
            width="120"
          />
          <el-table-column
            v-else-if="tableViewType === 'channel'"
            prop="channel"
            label="销售渠道"
            width="120"
          />
          <el-table-column
            prop="salesAmount"
            label="销售额(¥)"
            width="150"
            :formatter="row => row.salesAmount.toFixed(2)"
          />
          <el-table-column prop="orderCount" label="订单数量" width="120" />
          <el-table-column
            prop="avgOrderValue"
            label="平均客单价(¥)"
            width="150"
            :formatter="row => row.avgOrderValue.toFixed(2)"
          />
          <el-table-column
            prop="growthRate"
            label="增长率(%)"
            width="120"
            :formatter="row => row.growthRate.toFixed(2)"
            :cell-style="row => ({ color: row.row.growthRate >= 0 ? '#67c23a' : '#f56c6c' })"
          />
          <el-table-column
            prop="环比增长"
            label="环比增长(%)"
            width="120"
            :formatter="row => row.momGrowth.toFixed(2)"
            :cell-style="row => ({ color: row.row.momGrowth >= 0 ? '#67c23a' : '#f56c6c' })"
          />
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Download, Refresh, Search, RefreshRight } from '@element-plus/icons-vue'

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '今年',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0, 1)
      return [start, end]
    },
  },
]

// 筛选参数
const filterParams = reactive({
  dateRange: [] as string[],
  category: '',
  channel: '',
  timeGranularity: 'day',
})

// 图表类型
const chartType = ref('line')
const comparisonType = ref('sales')
const tableViewType = ref('time')

// 统计数据
const totalSales = ref(1568900.5)
const salesGrowth = ref(18.5)
const averageOrderValue = ref(285.6)
const totalOrders = ref(5493)
const avgOrderValueGrowth = ref(12.3)
const orderGrowth = ref(10.8)

// 表格数据
const loading = ref(false)
const total = ref(100)
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

const tableData = ref([
  {
    time: '2026-01-01',
    salesAmount: 52000.5,
    orderCount: 182,
    avgOrderValue: 285.71,
    growthRate: 15.2,
    momGrowth: 8.5,
  },
  {
    time: '2026-01-02',
    salesAmount: 48500.75,
    orderCount: 169,
    avgOrderValue: 286.98,
    growthRate: 12.8,
    momGrowth: 6.2,
  },
  {
    time: '2026-01-03',
    salesAmount: 56800.2,
    orderCount: 199,
    avgOrderValue: 285.43,
    growthRate: 18.3,
    momGrowth: 17.1,
  },
  {
    time: '2026-01-04',
    salesAmount: 62300.9,
    orderCount: 218,
    avgOrderValue: 285.78,
    growthRate: 22.1,
    momGrowth: 9.7,
  },
  {
    time: '2026-01-05',
    salesAmount: 59800.45,
    orderCount: 209,
    avgOrderValue: 286.13,
    growthRate: 20.5,
    momGrowth: -4.0,
  },
  {
    time: '2026-01-06',
    salesAmount: 65200.6,
    orderCount: 228,
    avgOrderValue: 285.97,
    growthRate: 25.8,
    momGrowth: 9.0,
  },
  {
    time: '2026-01-07',
    salesAmount: 71500.85,
    orderCount: 250,
    avgOrderValue: 286.0,
    growthRate: 30.2,
    momGrowth: 9.7,
  },
  {
    time: '2026-01-08',
    salesAmount: 68900.3,
    orderCount: 241,
    avgOrderValue: 285.9,
    growthRate: 27.8,
    momGrowth: -3.6,
  },
])

// 图表实例
let salesTrendChartInstance: echarts.ECharts | null = null
let channelComparisonChartInstance: echarts.ECharts | null = null
let categoryDistributionChartInstance: echarts.ECharts | null = null

// 图表DOM引用
const salesTrendChart = ref<HTMLElement | null>(null)
const channelComparisonChart = ref<HTMLElement | null>(null)
const categoryDistributionChart = ref<HTMLElement | null>(null)

// 初始化销售趋势图表
const initSalesTrendChart = () => {
  if (!salesTrendChartInstance && salesTrendChart.value) {
    salesTrendChartInstance = echarts.init(salesTrendChart.value)
  }

  const option: echarts.EChartsOption = {
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
      data: ['销售额', '订单量', '平均客单价'],
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
        boundaryGap: false,
        data: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售额(元)',
        min: 0,
        max: 80000,
        interval: 20000,
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '订单量',
        min: 0,
        max: 300,
        interval: 75,
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '平均客单价(元)',
        min: 280,
        max: 290,
        interval: 2.5,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        stack: chartType.value === 'area' ? '总量' : undefined,
        areaStyle: chartType.value === 'area' ? {} : undefined,
        emphasis: {
          focus: 'series',
        },
        data: [52000.5, 48500.75, 56800.2, 62300.9, 59800.45, 65200.6, 71500.85, 68900.3],
      },
      {
        name: '订单量',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        yAxisIndex: 1,
        stack: chartType.value === 'area' ? '总量' : undefined,
        areaStyle: chartType.value === 'area' ? {} : undefined,
        emphasis: {
          focus: 'series',
        },
        data: [182, 169, 199, 218, 209, 228, 250, 241],
      },
      {
        name: '平均客单价',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        yAxisIndex: 2,
        stack: chartType.value === 'area' ? '总量' : undefined,
        areaStyle: chartType.value === 'area' ? {} : undefined,
        emphasis: {
          focus: 'series',
        },
        data: [285.71, 286.98, 285.43, 285.78, 286.13, 285.97, 286.0, 285.9],
      },
    ],
  }

  salesTrendChartInstance?.setOption(option)
}

// 初始化渠道对比图表
const initChannelComparisonChart = () => {
  if (!channelComparisonChartInstance && channelComparisonChart.value) {
    channelComparisonChartInstance = echarts.init(channelComparisonChart.value)
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['线上商城', '线下门店', '第三方平台'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '销售额(元)',
    },
    yAxis: {
      type: 'category',
      data: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日'],
    },
    series: [
      {
        name: '线上商城',
        type: 'bar',
        data: [28000.5, 26500.75, 30800.2, 33300.9, 31800.45, 35200.6, 38500.85, 36900.3],
      },
      {
        name: '线下门店',
        type: 'bar',
        data: [18000.0, 16500.0, 19000.0, 21000.0, 19500.0, 22000.0, 24500.0, 23500.0],
      },
      {
        name: '第三方平台',
        type: 'bar',
        data: [6000.0, 5500.0, 7000.0, 8000.0, 8500.0, 8000.0, 8500.0, 8500.0],
      },
    ],
  }

  channelComparisonChartInstance?.setOption(option)
}

// 初始化商品类别分布图表
const initCategoryDistributionChart = () => {
  if (!categoryDistributionChartInstance && categoryDistributionChart.value) {
    categoryDistributionChartInstance = echarts.init(categoryDistributionChart.value)
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '商品类别销售分布',
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
          { value: 450000, name: '食品饮料' },
          { value: 380000, name: '数码家电' },
          { value: 320000, name: '服装鞋帽' },
          { value: 250000, name: '家居用品' },
          { value: 168900, name: '运动户外' },
        ],
      },
    ],
  }

  categoryDistributionChartInstance?.setOption(option)
}

// 刷新所有图表
const refreshCharts = () => {
  initSalesTrendChart()
  initChannelComparisonChart()
  initCategoryDistributionChart()
}

// 窗口大小变化时调整图表
const handleResize = () => {
  salesTrendChartInstance?.resize()
  channelComparisonChartInstance?.resize()
  categoryDistributionChartInstance?.resize()
}

// 查询数据
const handleSearch = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选条件
const handleReset = () => {
  Object.assign(filterParams, {
    dateRange: [],
    category: '',
    channel: '',
    timeGranularity: 'day',
  })
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 刷新数据
const handleRefresh = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
    refreshCharts()
  }, 500)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  handleSearch()
}

// 监听图表类型变化
watch(chartType, () => {
  initSalesTrendChart()
})

// 生命周期
onMounted(() => {
  // 初始化图表
  setTimeout(() => {
    initSalesTrendChart()
    initChannelComparisonChart()
    initCategoryDistributionChart()
  }, 100)

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
const beforeUnmount = () => {
  window.removeEventListener('resize', handleResize)
  salesTrendChartInstance?.dispose()
  channelComparisonChartInstance?.dispose()
  categoryDistributionChartInstance?.dispose()
}
</script>

<style scoped lang="scss">
.sales-trend-stats {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .subtitle {
      font-size: 14px;
      color: #909399;
      margin-left: 10px;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.stats-card {
  margin-bottom: 20px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;

    .el-statistic {
      background-color: #fafafa;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

.filter-card {
  margin-bottom: 20px;

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .el-form-item {
      margin-bottom: 16px;
    }
  }
}

.chart-container {
  margin-bottom: 20px;

  .chart-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  .chart-card {
    &.full-width {
      width: 100%;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;

      .chart-controls {
        display: flex;
        align-items: center;
      }
    }

    .chart-wrapper {
      margin-top: 20px;
    }
  }
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .table-wrapper {
    margin-top: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
