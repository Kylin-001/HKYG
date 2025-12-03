<template>
  <div class="finance-expense">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-wallet"></i>
          支出分析
        </h1>
        <p>详细的支出数据和成本分析</p>
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
        <el-select v-model="expenseType" placeholder="支出类型" @change="handleExpenseTypeChange">
          <el-option label="全部支出" value="all"></el-option>
          <el-option label="运营成本" value="operation"></el-option>
          <el-option label="人员工资" value="salary"></el-option>
          <el-option label="设备采购" value="equipment"></el-option>
          <el-option label="营销推广" value="marketing"></el-option>
          <el-option label="租金水电" value="rent"></el-option>
          <el-option label="其他支出" value="other"></el-option>
        </el-select>
        <el-button type="primary" @click="exportExpense" icon="el-icon-download">
          导出支出报表
        </el-button>
      </div>
    </div>

    <!-- 支出概览统计 -->
    <div class="expense-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card danger">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-wallet"></i>
              </div>
              <div class="stat-info">
                <h3>¥{{ expenseSummary.totalExpense }}</h3>
                <p>总支出</p>
                <span class="stat-trend down">
                  <i class="el-icon-bottom"></i>
                  {{ expenseSummary.expenseGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card warning">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-coin"></i>
              </div>
              <div class="stat-info">
                <h3>{{ expenseSummary.totalTransactions }}</h3>
                <p>支出笔数</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ expenseSummary.transactionGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card info">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-cpu"></i>
              </div>
              <div class="stat-info">
                <h3>¥{{ expenseSummary.avgExpense }}</h3>
                <p>平均支出</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ expenseSummary.avgGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card success">
            <div class="stat-content">
              <div class="stat-icon">
                <i class="el-icon-data-line"></i>
              </div>
              <div class="stat-info">
                <h3>{{ expenseSummary.costEfficiency }}%</h3>
                <p>成本效率</p>
                <span class="stat-trend up">
                  <i class="el-icon-top"></i>
                  {{ expenseSummary.efficiencyGrowth }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 支出趋势图表 -->
    <el-card class="chart-section">
      <div slot="header">
        <div class="card-header">
          <span>支出趋势分析</span>
          <el-radio-group v-model="trendTimeRange" size="mini" @change="handleTrendTimeRangeChange">
            <el-radio-button label="daily">日</el-radio-button>
            <el-radio-button label="weekly">周</el-radio-button>
            <el-radio-button label="monthly">月</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chart-container">
        <div id="expenseTrendChart" class="chart"></div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 支出分类分析 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>支出分类分析</span>
          </div>
          <div class="chart-container">
            <div id="expenseCategoryChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 成本结构分析 -->
      <el-col :span="12">
        <el-card class="chart-section">
          <div slot="header">
            <span>成本结构分析</span>
          </div>
          <div class="chart-container">
            <div id="costStructureChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 支出明细表格 -->
    <el-card class="expense-table">
      <div slot="header">
        <div class="card-header">
          <span>支出明细</span>
          <div class="header-tools">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索单号或描述"
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
      </div>
      <el-table
        :data="filteredExpenseList"
        stripe
        v-loading="tableLoading"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="date" label="日期" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="expenseNo" label="支出单号" width="140">
          <template v-slot="{ row }">
            <el-link @click="viewExpenseDetail(row.expenseNo)">
              {{ row.expenseNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="支出类型" width="120">
          <template v-slot="{ row }">
            <el-tag :type="getExpenseTypeTag(row.type)" size="mini">
              {{ getExpenseTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="100"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
        <el-table-column prop="amount" label="金额" width="100" sortable="custom">
          <template v-slot="{ row }">
            <span class="expense-amount">-¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="{ row }">
            <el-tag :type="row.status === '已支付' ? 'success' : 'warning'" size="mini">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template v-slot="{ row }">
            <el-button type="text" size="mini" @click="viewExpenseDetail(row)"> 详情 </el-button>
            <el-button type="text" size="mini" @click="exportExpenseItem(row)"> 导出 </el-button>
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

    <!-- 支出详情对话框 -->
    <el-dialog
      :title="`支出详情 - ${selectedExpense && selectedExpense.expenseNo}`"
      v-model="expenseDetailVisible"
      width="600px"
    >
      <div v-if="selectedExpense" class="expense-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="支出单号">{{
            selectedExpense.expenseNo
          }}</el-descriptions-item>
          <el-descriptions-item label="支出类型">
            <el-tag :type="getExpenseTypeTag(selectedExpense.type)" size="mini">
              {{ getExpenseTypeText(selectedExpense.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支出部门">{{
            selectedExpense.department
          }}</el-descriptions-item>
          <el-descriptions-item label="支出金额"
            >¥{{ selectedExpense.amount }}</el-descriptions-item
          >
          <el-descriptions-item label="支出时间"
            >{{ selectedExpense.date }} {{ selectedExpense.time }}</el-descriptions-item
          >
          <el-descriptions-item label="状态">
            <el-tag :type="selectedExpense.status === '已支付' ? 'success' : 'warning'" size="mini">
              {{ selectedExpense.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{
            selectedExpense.paymentMethod
          }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{
            selectedExpense.description
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer">
        <el-button @click="expenseDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportExpenseDetail">导出详情</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import logger from '@/utils/logger'

// 类型定义
interface ExpenseSummary {
  totalExpense: string
  expenseGrowth: string
  totalTransactions: string
  transactionGrowth: string
  avgExpense: string
  avgGrowth: string
  costEfficiency: string
  efficiencyGrowth: string
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

interface ExpenseItem {
  id: number
  date: string
  time: string
  expenseNo: string
  type: string
  department: string
  description: string
  amount: string
  status: string
  paymentMethod: string
}

// 响应式数据
const dateRange = ref<Date[]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()])
const expenseType = ref<string>('all')
const trendTimeRange = ref<string>('daily')
const searchKeyword = ref<string>('')
const tableLoading = ref<boolean>(false)
const expenseDetailVisible = ref<boolean>(false)
const selectedExpense = ref<ExpenseItem | null>(null)

const expenseSummary = reactive<ExpenseSummary>({
  totalExpense: '89,650',
  expenseGrowth: '-8.3%',
  totalTransactions: '1,234',
  transactionGrowth: '+12.5%',
  avgExpense: '72.65',
  avgGrowth: '+5.2%',
  costEfficiency: '85.7',
  efficiencyGrowth: '+3.8%',
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

const expenseList = ref<ExpenseItem[]>([
  {
    id: 1,
    date: '2024-01-15',
    time: '16:30:25',
    expenseNo: 'EX20240115001',
    type: 'salary',
    department: '运营部',
    description: '配送员工资支出 - 2024年1月',
    amount: '15,000',
    status: '已支付',
    paymentMethod: '银行转账',
  },
  {
    id: 2,
    date: '2024-01-15',
    time: '14:45:12',
    expenseNo: 'EX20240115002',
    type: 'operation',
    department: '技术部',
    description: '服务器租赁费用 - 阿里云',
    amount: '3,200',
    status: '已支付',
    paymentMethod: '支付宝',
  },
  {
    id: 3,
    date: '2024-01-15',
    time: '12:20:33',
    expenseNo: 'EX20240115003',
    type: 'marketing',
    department: '市场部',
    description: '广告投放费用 - 抖音推广',
    amount: '8,500',
    status: '已支付',
    paymentMethod: '微信支付',
  },
  {
    id: 4,
    date: '2024-01-15',
    time: '10:45:18',
    expenseNo: 'EX20240115004',
    type: 'rent',
    department: '行政部',
    description: '办公租金 - 1月租金',
    amount: '12,000',
    status: '已支付',
    paymentMethod: '银行转账',
  },
  {
    id: 5,
    date: '2024-01-15',
    time: '09:30:55',
    expenseNo: 'EX20240115005',
    type: 'equipment',
    department: '技术部',
    description: '办公设备采购 - 电脑主机',
    amount: '4,800',
    status: '已支付',
    paymentMethod: '支付宝',
  },
])

const filteredExpenseList = ref<ExpenseItem[]>([])

// 生命周期钩子
onMounted(() => {
  initData()
  initCharts()
})

// 初始化数据
function initData() {
  filteredExpenseList.value = [...expenseList.value]
  pagination.total = expenseList.value.length
}

// 初始化图表
function initCharts() {
  nextTick(() => {
    drawExpenseTrendChart()
    drawExpenseCategoryChart()
    drawCostStructureChart()
  })
}

// 绘制支出趋势图表
function drawExpenseTrendChart() {
  const container = document.getElementById('expenseTrendChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 350px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📉</div>
          <div style="font-weight: bold;">支出趋势图表</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">显示支出变化趋势和成本波动</div>
        </div>
      </div>
    `
  }
}

// 绘制支出分类分析图表
function drawExpenseCategoryChart() {
  const container = document.getElementById('expenseCategoryChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
          <div style="font-weight: bold;">支出分类分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">各类支出占比分析</div>
        </div>
      </div>
    `
  }
}

// 绘制成本结构分析图表
function drawCostStructureChart() {
  const container = document.getElementById('costStructureChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
          <div style="font-weight: bold;">成本结构分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">成本构成和优化建议</div>
        </div>
      </div>
    `
  }
}

// 事件处理
function handleDateChange() {
  loadExpenseData()
}

function handleExpenseTypeChange() {
  loadExpenseData()
}

function handleTrendTimeRangeChange() {
  drawExpenseTrendChart()
}

function handleSearch() {
  filterExpenseList()
}

function handleSortChange({ prop, order }: any) {
  sortConfig.prop = prop
  sortConfig.order = order
  filterExpenseList()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  filterExpenseList()
}

function handleCurrentChange(page: number) {
  pagination.page = page
  filterExpenseList()
}

// 刷新表格
function refreshTable() {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

// 过滤支出列表
function filterExpenseList() {
  let filtered = [...expenseList.value]

  // 关键词搜索
  if (searchKeyword.value) {
    filtered = filtered.filter(
      item =>
        item.expenseNo.includes(searchKeyword.value) ||
        item.description.includes(searchKeyword.value)
    )
  }

  // 支出类型筛选
  if (expenseType.value !== 'all') {
    filtered = filtered.filter(item => item.type === expenseType.value)
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
      let aVal = a[sortConfig.prop]
      let bVal = b[sortConfig.prop]

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

  filteredExpenseList.value = filtered
  pagination.total = filtered.length
}

// 加载支出数据
function loadExpenseData() {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('加载支出数据...', {
      dateRange: dateRange.value,
      expenseType: expenseType.value,
    })
  }
  filterExpenseList()
  initCharts()
}

// 获取支出类型文本
function getExpenseTypeText(type: string) {
  const typeMap: Record<string, string> = {
    operation: '运营成本',
    salary: '人员工资',
    equipment: '设备采购',
    marketing: '营销推广',
    rent: '租金水电',
    other: '其他支出',
  }
  return typeMap[type] || '未知'
}

// 获取支出类型标签
function getExpenseTypeTag(type: string) {
  const tagMap: Record<string, string> = {
    operation: 'primary',
    salary: 'success',
    equipment: 'warning',
    marketing: 'danger',
    rent: 'info',
    other: 'info',
  }
  return tagMap[type] || 'info'
}

// 查看支出详情
function viewExpenseDetail(expenseNo: string) {
  const expense = expenseList.value.find(item => item.expenseNo === expenseNo)
  if (expense) {
    selectedExpense.value = expense
    expenseDetailVisible.value = true
  }
}

// 导出支出报表
function exportExpense() {
  ElMessage.info('正在导出支出报表...')
  setTimeout(() => {
    ElMessage.success('支出报表导出成功')
  }, 2000)
}

// 导出支出明细
function exportExpenseItem(row: any) {
  ElMessage.info('正在导出支出明细...')
}

// 导出支出详情
function exportExpenseDetail() {
  ElMessage.info('正在导出支出详情...')
}
</script>

<style scoped>
.finance-expense {
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
  color: #f56c6c;
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

.expense-stats {
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

.stat-card.danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #333;
}

.stat-card.info {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
}

.stat-card.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
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

.stat-trend.down {
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

.expense-table {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-tools {
  display: flex;
  gap: 10px;
  align-items: center;
}

.expense-amount {
  color: #f56c6c;
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.expense-detail {
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

  .expense-stats .el-col {
    margin-bottom: 15px;
  }
}

@media (max-width: 576px) {
  .finance-expense {
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
