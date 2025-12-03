<template>
  <div class="finance-overview">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-money"></i>
          财务概览
        </h1>
        <p>实时财务数据监控和分析</p>
      </div>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          @change="handleDateChange"
        ></el-date-picker>
        <el-button type="primary" @click="exportData" icon="el-icon-download"> 导出数据 </el-button>
        <el-button @click="refreshData" icon="el-icon-refresh"> 刷新 </el-button>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <el-card
        v-for="metric in keyMetrics"
        :key="metric.key"
        class="metric-card"
        :class="{ negative: metric.trend === 'down', positive: metric.trend === 'up' }"
      >
        <div class="metric-content">
          <div class="metric-icon" :style="{ backgroundColor: metric.color }">
            <i :class="metric.icon"></i>
          </div>
          <div class="metric-info">
            <h3>{{ metric.value }}</h3>
            <p class="metric-label">{{ metric.label }}</p>
            <div class="metric-trend">
              <span class="trend-icon" :class="metric.trend">
                <i :class="metric.trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
              </span>
              <span class="trend-text">{{ metric.change }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <!-- 收入趋势图表 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>收入趋势分析</span>
              <el-radio-group
                v-model="revenueTimeRange"
                size="mini"
                @change="handleRevenueTimeRangeChange"
              >
                <el-radio-button label="7d">7天</el-radio-button>
                <el-radio-button label="30d">30天</el-radio-button>
                <el-radio-button label="90d">90天</el-radio-button>
                <el-radio-button label="1y">1年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div id="revenueChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 收入来源分布 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>收入来源分布</span>
          </template>
          <div class="chart-container">
            <div id="sourceChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 支出分析 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>支出分析</span>
              <el-button type="text" size="mini" @click="goToFinancePage('expense')">
                查看详情
              </el-button>
            </div>
          </template>
          <div class="chart-container">
            <div id="expenseChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 利润分析 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>利润分析</span>
              <el-button type="text" size="mini" @click="goToFinancePage('profit')">
                查看详情
              </el-button>
            </div>
          </template>
          <div class="chart-container">
            <div id="profitChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 近期交易记录 -->
    <el-card class="recent-transactions">
      <template #header>
        <div class="card-header">
          <span>近期交易记录</span>
          <el-button type="text" @click="goToFinancePage('transactions')"> 查看全部 </el-button>
        </div>
      </template>
      <el-table :data="recentTransactions" stripe>
        <el-table-column prop="time" label="时间" width="160"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template v-slot="{ row }">
            <el-tag :type="row.type === '收入' ? 'success' : 'danger'" size="mini">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="120"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template v-slot="{ row }">
            <span :class="row.type === '收入' ? 'text-success' : 'text-danger'">
              {{ row.type === '收入' ? '+' : '-' }}¥{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="mini">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import logger from '@/utils/logger'

// 类型定义
interface Metric {
  key: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

interface Transaction {
  time: string
  type: string
  category: string
  description: string
  amount: string
  status: string
}

// 响应式数据
const router = useRouter()
const dateRange = ref<Date[]>([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()])
const revenueTimeRange = ref<string>('7d')

const keyMetrics = reactive<Metric[]>([
  {
    key: 'totalRevenue',
    label: '总收入',
    value: '¥158,432',
    change: '+12.5%',
    trend: 'up',
    icon: 'el-icon-s-finance',
    color: '#67C23A',
  },
  {
    key: 'totalExpense',
    label: '总支出',
    value: '¥98,765',
    change: '+8.3%',
    trend: 'up',
    icon: 'el-icon-s-cooperation',
    color: '#E6A23C',
  },
  {
    key: 'netProfit',
    label: '净利润',
    value: '¥59,667',
    change: '+18.7%',
    trend: 'up',
    icon: 'el-icon-coin',
    color: '#409EFF',
  },
  {
    key: 'profitRate',
    label: '利润率',
    value: '37.7%',
    change: '+2.1%',
    trend: 'up',
    icon: 'el-icon-percentage',
    color: '#F56C6C',
  },
])

const recentTransactions = reactive<Transaction[]>([
  {
    time: '2024-01-15 14:30',
    type: '收入',
    category: '外卖订单',
    description: '商家A的订单收入',
    amount: '28.50',
    status: '已完成',
  },
  {
    time: '2024-01-15 13:45',
    type: '支出',
    category: '配送成本',
    description: '配送员张三的服务费',
    amount: '8.00',
    status: '已完成',
  },
  {
    time: '2024-01-15 12:20',
    type: '收入',
    category: '跑腿服务',
    description: '代购商品服务费',
    amount: '15.00',
    status: '已完成',
  },
  {
    time: '2024-01-15 11:10',
    type: '支出',
    category: '平台维护',
    description: '服务器维护费用',
    amount: '500.00',
    status: '已完成',
  },
  {
    time: '2024-01-15 10:30',
    type: '收入',
    category: '外卖订单',
    description: '商家B的订单收入',
    amount: '35.20',
    status: '已完成',
  },
])

// 生命周期钩子
onMounted(() => {
  initCharts()
  loadData()
})

// 初始化图表
function initCharts() {
  // 模拟图表初始化
  nextTick(() => {
    drawRevenueChart()
    drawSourceChart()
    drawExpenseChart()
    drawProfitChart()
  })
}

// 绘制收入趋势图表
function drawRevenueChart() {
  // 模拟绘制收入趋势图
  const container = document.getElementById('revenueChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(45deg, #f0f9ff, #e0f2fe); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1890ff; font-size: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">📈</div>
          <div>收入趋势图表</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">显示近7天收入变化趋势</div>
        </div>
      </div>
    `
  }
}

// 绘制收入来源图表
function drawSourceChart() {
  // 模拟绘制收入来源饼图
  const container = document.getElementById('sourceChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(45deg, #f6ffed, #f6ffed); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #52c41a; font-size: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🥧</div>
          <div>收入来源分布</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">外卖65% | 跑腿25% | 其他10%</div>
        </div>
      </div>
    `
  }
}

// 绘制支出分析图表
function drawExpenseChart() {
  // 模拟绘制支出分析图
  const container = document.getElementById('expenseChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 250px; background: linear-gradient(45deg, #fff7e6, #fff1b8); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fa8c16; font-size: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">📊</div>
          <div>支出分析图表</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">各类支出占比分析</div>
        </div>
      </div>
    `
  }
}

// 绘制利润分析图表
function drawProfitChart() {
  // 模拟绘制利润分析图
  const container = document.getElementById('profitChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 250px; background: linear-gradient(45deg, #f0f5ff, #e6f4ff); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1890ff; font-size: 16px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">💰</div>
          <div>利润分析图表</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">收入支出对比分析</div>
        </div>
      </div>
    `
  }
}

// 事件处理
function handleDateChange() {
  loadData()
}

function handleRevenueTimeRangeChange() {
  drawRevenueChart()
}

// 加载数据
function loadData() {
  // 模拟数据加载
  logger.info('加载财务数据...', {
    dateRange: dateRange.value,
    revenueTimeRange: revenueTimeRange.value,
  })
}

// 刷新数据
function refreshData() {
  loadData()
  initCharts()
  ElMessage.success('数据已刷新')
}

// 导出数据
function exportData() {
  // 模拟数据导出
  ElMessage.info('正在导出财务数据...')
  setTimeout(() => {
    ElMessage.success('财务数据导出成功')
  }, 2000)
}

// 路由跳转
function goToFinancePage(path: string) {
  router.push(`/finance/${path}`)
}
</script>

<style scoped>
.finance-overview {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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

.metric-card.negative {
  border-left: 4px solid #f56c6c;
}

.metric-card.positive {
  border-left: 4px solid #67c23a;
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
  color: white;
  font-size: 20px;
}

.metric-info {
  flex: 1;
}

.metric-info h3 {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.metric-label {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 5px;
}

.trend-icon {
  font-size: 12px;
}

.trend-icon.up {
  color: #67c23a;
}

.trend-icon.down {
  color: #f56c6c;
}

.trend-text {
  font-size: 12px;
  color: #909399;
}

.chart-card {
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

.chart {
  width: 100%;
  height: 100%;
}

.recent-transactions {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-success {
  color: #67c23a;
  font-weight: 500;
}

.text-danger {
  color: #f56c6c;
  font-weight: 500;
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

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .finance-overview {
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
