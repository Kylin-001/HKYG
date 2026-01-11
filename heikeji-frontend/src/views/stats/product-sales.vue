<template>
  <div class="product-sales-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>商品销售统计</h2>
        <span class="subtitle">分析平台的商品销售数据</span>
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
        <el-statistic title="总订单数" :value="totalOrders">
          <template #suffix>
            <el-progress
              :percentage="ordersGrowth"
              :color="ordersGrowth > 0 ? '#67c23a' : '#f56c6c'"
            />
          </template>
        </el-statistic>
        <el-statistic title="总商品数" :value="totalProducts">
          <template #suffix>
            <el-progress
              :percentage="productsGrowth"
              :color="productsGrowth > 0 ? '#67c23a' : '#f56c6c'"
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
        <el-form-item label="商品分类">
          <el-select v-model="filterParams.categoryId" placeholder="请选择商品分类" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select v-model="filterParams.salesStatus" placeholder="请选择销售状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="正常销售" value="1"></el-option>
            <el-option label="已下架" value="0"></el-option>
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
          <h3 class="chart-title">商品销售趋势</h3>
          <el-select v-model="chartType" placeholder="图表类型" style="width: 120px">
            <el-option label="折线图" value="line"></el-option>
            <el-option label="柱状图" value="bar"></el-option>
          </el-select>
        </div>
      </template>
      <div class="chart-container">
        <div ref="salesChartRef" class="sales-chart"></div>
      </div>
    </el-card>

    <!-- 商品销售详情 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">商品销售详情</h3>
        </div>
      </template>
      <el-table v-loading="loading" :data="salesData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="商品ID" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
        <el-table-column
          prop="categoryName"
          label="商品分类"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="price" label="单价" width="100" align="right">
          <template #default="scope">¥{{ scope.row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column
          prop="salesCount"
          label="销量"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="salesAmount" label="销售额" width="120" align="right">
          <template #default="scope">¥{{ scope.row.salesAmount.toFixed(2) }}</template>
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
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常销售' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
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
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 类型定义
interface ProductSales {
  id: number
  name: string
  categoryName: string
  price: number
  salesCount: number
  salesAmount: number
  growthRate: number
  status: number
}

interface Category {
  id: number
  name: string
}

// 响应式状态
const loading = ref(false)
const salesChartRef = ref<HTMLElement>()
let salesChart: echarts.ECharts | null = null

// 筛选参数
const filterParams = reactive({
  dateRange: [] as [string, string],
  categoryId: '',
  salesStatus: '',
})

// 图表类型
const chartType = ref('line')

// 商品分类列表
const categories = ref<Category[]>([
  { id: 1, name: '数码产品' },
  { id: 2, name: '生活用品' },
  { id: 3, name: '食品饮料' },
  { id: 4, name: '图书文具' },
  { id: 5, name: '运动户外' },
])

// 销售数据
const salesData = ref<ProductSales[]>([])
const total = ref(0)

// 统计数据
const totalSales = ref(123456.78)
const totalOrders = ref(1234)
const totalProducts = ref(567)
const averageOrderValue = ref(234.56)

// 增长率数据
const salesGrowth = ref(12.3)
const ordersGrowth = ref(-5.6)
const productsGrowth = ref(8.9)
const avgOrderValueGrowth = ref(6.7)

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 模拟销售趋势数据
const salesTrendData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  sales: [12000, 15000, 18000, 16000, 20000, 25000, 28000, 30000, 27000, 32000, 35000, 40000],
}

// 生命周期钩子
onMounted(() => {
  // 初始化图表
  initChart()
  // 加载销售数据
  loadSalesData()
})

onUnmounted(() => {
  // 销毁图表
  if (salesChart) {
    salesChart.dispose()
    salesChart = null
  }
})

// 监听图表类型变化
watch(chartType, () => {
  updateChart()
})

// 初始化图表
const initChart = () => {
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value)
    updateChart()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  }
}

// 更新图表
const updateChart = () => {
  if (!salesChart) return

  const option = {
    title: {
      text: '商品销售趋势',
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
      data: ['销售额'],
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
        data: salesTrendData.dates,
        axisLabel: {
          rotate: 30,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售额 (元)',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: chartType.value,
        data: salesTrendData.sales,
        smooth: chartType.value === 'line',
        itemStyle: {
          color: '#003366',
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }

  salesChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  salesChart?.resize()
}

// 加载销售数据
const loadSalesData = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟数据
    const mockData: ProductSales[] = []
    for (let i = 1; i <= 20; i++) {
      mockData.push({
        id: i,
        name: `商品名称${i}`,
        categoryName: categories.value[Math.floor(Math.random() * categories.value.length)].name,
        price: Math.random() * 1000 + 100,
        salesCount: Math.floor(Math.random() * 1000) + 100,
        salesAmount: Math.random() * 100000 + 10000,
        growthRate: (Math.random() - 0.5) * 50,
        status: Math.random() > 0.8 ? 0 : 1,
      })
    }
    salesData.value = mockData
    total.value = 100
  } catch (error) {
    ElMessage.error('获取销售数据失败')
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
  loadSalesData()
}

// 重置筛选条件
const handleReset = () => {
  filterParams.dateRange = [] as [string, string]
  filterParams.categoryId = ''
  filterParams.salesStatus = ''
  pagination.currentPage = 1
  loadSalesData()
}

// 刷新数据
const handleRefresh = () => {
  loadSalesData()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出功能已触发')
}

// 分页变化处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadSalesData()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadSalesData()
}
</script>

<style scoped>
.product-sales-stats {
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

.sales-chart {
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
