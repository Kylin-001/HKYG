<template>
  <div class="finance-revenue">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-money"></i>
          收入分析
        </h1>
        <p>详细的收入数据和趋势分析</p>
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
        <el-select v-model="revenueType" placeholder="收入类型" @change="handleRevenueTypeChange">
          <el-option label="全部收入" value="all"></el-option>
          <el-option label="外卖订单" value="takeout"></el-option>
          <el-option label="跑腿服务" value="delivery"></el-option>
          <el-option label="配送费" value="delivery-fee"></el-option>
          <el-option label="其他收入" value="other"></el-option>
        </el-select>
        <el-button type="primary" @click="exportRevenue" icon="el-icon-download">
          导出收入报表
        </el-button>
      </div>
    </div>

    <!-- 收入概览统计 -->
    <div class="revenue-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card primary">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-money"></i>
              </div>
              <div class="stat-info">
                <h3>¥{{ revenueSummary.totalRevenue }}</h3>
                <p>总收入</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ revenueSummary.revenueGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card success">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-shopping-cart-2"></i>
              </div>
              <div class="stat-info">
                <h3>{{ revenueSummary.totalOrders }}</h3>
                <p>订单总数</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ revenueSummary.orderGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card info">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-medal"></i>
              </div>
              <div class="stat-info">
                <h3>¥{{ revenueSummary.avgOrderValue }}</h3>
                <p>平均订单价值</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ revenueSummary.aovGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card warning">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-percentage"></i>
              </div>
              <div class="stat-info">
                <h3>{{ revenueSummary.conversionRate }}%</h3>
                <p>订单转化率</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ revenueSummary.conversionGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 收入趋势图表 -->
    <el-card class="chart-section">
      <template #header>
        <div class="card-header">
          <span>收入趋势分析</span>
          <el-radio-group v-model="trendTimeRange" size="mini" @change="handleTrendTimeRangeChange">
            <el-radio-button label="daily">日</el-radio-button>
            <el-radio-button label="weekly">周</el-radio-button>
            <el-radio-button label="monthly">月</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-container">
        <div id="revenueTrendChart" class="chart"></div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 收入来源分析 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>收入来源分析</span>
          </template>
          <div class="chart-container">
            <div id="revenueSourceChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 收入类型分布 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>收入类型分布</span>
          </template>
          <div class="chart-container">
            <div id="revenueTypeChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入明细表格 -->
    <el-card class="revenue-table">
      <template #header>
        <div class="card-header">
          <span>收入明细</span>
          <div class="header-tools">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号或描述"
              prefix-icon="el-icon-search"
              size="mini"
              style="width: 200px"
              @input="handleSearch"
            ></el-input>
            <el-button size="mini" @click="refreshTable">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
        </div>
      </template>
      <el-table
        :data="filteredRevenueList"
        stripe
        v-loading="tableLoading"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="date" label="日期" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="140">
          <template v-slot="{ row }">
            <el-link @click="viewOrderDetail(row.orderNo)">
              {{ row.orderNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收入类型" width="120">
          <template v-slot="{ row }">
            <el-tag :type="getRevenueTypeTag(row.type)" size="mini">
              {{ getRevenueTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="120"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
        <el-table-column prop="amount" label="金额" width="100" sortable="custom">
          <template v-slot="{ row }">
            <span class="revenue-amount">+¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="{ row }">
            <el-tag :type="row.status === '已到账' ? 'success' : 'warning'" size="mini">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template v-slot="{ row }">
            <el-button type="text" size="mini" @click="viewRevenueDetail(row)"> 详情 </el-button>
            <el-button type="text" size="mini" @click="exportRevenueItem(row)"> 导出 </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 收入详情对话框 -->
    <el-dialog
      :title="`收入详情 - ${selectedRevenue && selectedRevenue.orderNo}`"
      v-model="revenueDetailVisible"
      width="600px"
    >
      <div v-if="selectedRevenue" class="revenue-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ selectedRevenue.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="收入类型">
            <el-tag :type="getRevenueTypeTag(selectedRevenue.type)" size="mini">
              {{ getRevenueTypeText(selectedRevenue.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收入来源">{{ selectedRevenue.source }}</el-descriptions-item>
          <el-descriptions-item label="收入金额"
            >¥{{ selectedRevenue.amount }}</el-descriptions-item
          >
          <el-descriptions-item label="交易时间"
            >{{ selectedRevenue.date }} {{ selectedRevenue.time }}</el-descriptions-item
          >
          <el-descriptions-item label="状态">
            <el-tag :type="selectedRevenue.status === '已到账' ? 'success' : 'warning'" size="mini">
              {{ selectedRevenue.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{
            selectedRevenue.paymentMethod
          }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{
            selectedRevenue.description
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="revenueDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportRevenueDetail">导出详情</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的Vue 3 API和组件
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import logger from '@/utils/logger'

// 类型定义
interface RevenueSummary {
  totalRevenue: string
  revenueGrowth: string
  totalOrders: string
  orderGrowth: string
  avgOrderValue: string
  aovGrowth: string
  conversionRate: string
  conversionGrowth: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface SortConfig {
  prop: string
  order: 'ascending' | 'descending' | ''
}

interface RevenueItem {
  id: number
  date: string
  time: string
  orderNo: string
  type: string
  source: string
  description: string
  amount: string
  status: string
  paymentMethod: string
}

// 响应式数据
const router = useRouter()
const dateRange = ref<Date[]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()])
const revenueType = ref<string>('all')
const trendTimeRange = ref<string>('daily')
const searchKeyword = ref<string>('')
const tableLoading = ref<boolean>(false)
const revenueDetailVisible = ref<boolean>(false)
const selectedRevenue = ref<RevenueItem | null>(null)

const revenueSummary = reactive<RevenueSummary>({
  totalRevenue: '125,680',
  revenueGrowth: '+15.2%',
  totalOrders: '2,456',
  orderGrowth: '+8.7%',
  avgOrderValue: '51.18',
  aovGrowth: '+5.9%',
  conversionRate: '12.8',
  conversionGrowth: '+2.1%',
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

const revenueList = reactive<RevenueItem[]>([
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30:25',
    orderNo: 'TK20240115001',
    type: 'takeout',
    source: '商家A',
    description: '外卖订单收入 - 黄焖鸡米饭套餐',
    amount: '28.50',
    status: '已到账',
    paymentMethod: '支付宝',
  },
  {
    id: 2,
    date: '2024-01-15',
    time: '13:45:12',
    orderNo: 'DL20240115002',
    type: 'delivery',
    source: '用户B',
    description: '跑腿服务费 - 代购商品',
    amount: '15.00',
    status: '已到账',
    paymentMethod: '微信支付',
  },
  {
    id: 3,
    date: '2024-01-15',
    time: '12:20:33',
    orderNo: 'TK20240115003',
    type: 'takeout',
    source: '商家C',
    description: '外卖订单收入 - 麻辣烫',
    amount: '35.20',
    status: '已到账',
    paymentMethod: '支付宝',
  },
  {
    id: 4,
    date: '2024-01-15',
    time: '11:45:18',
    orderNo: 'DF20240115004',
    type: 'delivery-fee',
    source: '系统',
    description: '配送费收入',
    amount: '6.00',
    status: '已到账',
    paymentMethod: '系统',
  },
  {
    id: 5,
    date: '2024-01-15',
    time: '10:30:55',
    orderNo: 'TK20240115005',
    type: 'takeout',
    source: '商家D',
    description: '外卖订单收入 - 牛肉面',
    amount: '22.80',
    status: '已到账',
    paymentMethod: '微信支付',
  },
])

const filteredRevenueList = ref<RevenueItem[]>([])

// 生命周期钩子
onMounted(() => {
  initData()
  initCharts()
})

// 初始化数据
function initData() {
  filteredRevenueList.value = [...revenueList]
  pagination.total = revenueList.length
}

// 初始化图表
function initCharts() {
  nextTick(() => {
    drawRevenueTrendChart()
    drawRevenueSourceChart()
    drawRevenueTypeChart()
  })
}

// 绘制收入趋势图表
function drawRevenueTrendChart() {
  const container = document.getElementById('revenueTrendChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 350px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📈</div>
          <div style="font-weight: bold;">收入趋势图表</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">显示收入变化趋势和数据波动</div>
        </div>
      </div>
    `
  }
}

// 绘制收入来源图表
function drawRevenueSourceChart() {
  const container = document.getElementById('revenueSourceChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
          <div style="font-weight: bold;">收入来源分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">各渠道收入贡献占比</div>
        </div>
      </div>
    `
  }
}

// 绘制收入类型图表
function drawRevenueTypeChart() {
  const container = document.getElementById('revenueTypeChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
          <div style="font-weight: bold;">收入类型分布</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">不同类型收入占比分析</div>
        </div>
      </div>
    `
  }
}

// 事件处理
function handleDateChange() {
  loadRevenueData()
}

function handleRevenueTypeChange() {
  loadRevenueData()
}

function handleTrendTimeRangeChange() {
  drawRevenueTrendChart()
}

function handleSearch() {
  filterRevenueList()
}

function handleSortChange({ prop, order }) {
  sortConfig.prop = prop
  sortConfig.order = order
  filterRevenueList()
}

function handleSizeChange(size) {
  pagination.pageSize = size
  filterRevenueList()
}

function handleCurrentChange(page) {
  pagination.page = page
  filterRevenueList()
}

// 刷新表格
function refreshTable() {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

// 筛选收入列表
function filterRevenueList() {
  let filtered = [...revenueList]

  // 关键词搜索
  if (searchKeyword.value) {
    filtered = filtered.filter(
      item =>
        item.orderNo.includes(searchKeyword.value) || item.description.includes(searchKeyword.value)
    )
  }

  // 收入类型筛选
  if (revenueType.value !== 'all') {
    filtered = filtered.filter(item => item.type === revenueType.value)
  }

  // 日期筛选
  if (dateRange.value && dateRange.value.length === 2) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date)
      const startDate = new Date(dateRange.value[0])
      const endDate = new Date(dateRange.value[1])
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  // 排序
  if (sortConfig.prop) {
    filtered.sort((a, b) => {
      let aVal: any = a[sortConfig.prop as keyof RevenueItem]
      let bVal: any = b[sortConfig.prop as keyof RevenueItem]

      if (sortConfig.prop === 'amount') {
        aVal = parseFloat(aVal)
        bVal = parseFloat(bVal)
      } else if (sortConfig.prop === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (sortConfig.order === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  filteredRevenueList.value = filtered
  pagination.total = filtered.length
}

// 加载收入数据
function loadRevenueData() {
  // 模拟数据加载
  logger.info('加载收入数据...', {
    dateRange: dateRange.value,
    revenueType: revenueType.value,
  })
  filterRevenueList()
  initCharts()
}

// 获取收入类型文本
function getRevenueTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    takeout: '外卖订单',
    delivery: '跑腿服务',
    'delivery-fee': '配送费',
    other: '其他收入',
  }
  return typeMap[type] || '未知'
}

// 获取收入类型标签
function getRevenueTypeTag(type: string): string {
  const tagMap: Record<string, string> = {
    takeout: 'primary',
    delivery: 'success',
    'delivery-fee': 'warning',
    other: 'info',
  }
  return tagMap[type] || 'info'
}

// 查看订单详情
function viewOrderDetail(orderNo: string) {
  router.push(`/order/detail/${orderNo}`)
}

// 查看收入详情
function viewRevenueDetail(row: RevenueItem) {
  selectedRevenue.value = row
  revenueDetailVisible.value = true
}

// 导出收入报表
function exportRevenue() {
  ElMessage.info('正在导出收入报表...')
  setTimeout(() => {
    ElMessage.success('收入报表导出成功')
  }, 2000)
}

// 导出收入明细
function exportRevenueItem(row: RevenueItem) {
  ElMessage.info('正在导出收入明细...')
}

// 导出收入详情
function exportRevenueDetail() {
  ElMessage.info('正在导出收入详情...')
}
</script>

<style scoped>
.finance-revenue {
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

.revenue-stats {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card.info {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
}

.stat-card.warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #333;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 20px;
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.stat-info p {
  margin: 5px 0;
  opacity: 0.8;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.up {
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

.revenue-table {
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.revenue-detail {
  padding: 10px 0;
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

  .revenue-stats .el-col {
    margin-bottom: 15px;
  }
}

@media (max-width: 576px) {
  .finance-revenue {
    padding: 15px;
  }

  .stat-content {
    gap: 10px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .stat-info h3 {
    font-size: 20px;
  }
}
</style>
