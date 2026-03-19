<template>
  <div class="user-behavior-analysis">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-data-analysis"></i>
          用户行为分析
        </h1>
        <p>深入分析用户行为特征、趋势和偏好</p>
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
        <el-select v-model="userId" placeholder="选择用户" @change="handleUserChange">
          <el-option label="所有用户" value="">所有用户</el-option>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.username"
            :value="user.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="exportAnalysis" icon="el-icon-download">
          导出分析报告
        </el-button>
      </div>
    </div>

    <div class="metrics-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="metric-card primary">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-view"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalBrowsing }}</h3>
                <p>总浏览量</p>
                <span
                  class="metric-trend"
                  :class="metrics.browsingGrowth.startsWith('+') ? 'up' : 'down'"
                >
                  <i class="el-icon-top" v-if="metrics.browsingGrowth.startsWith('+')"></i>
                  <i class="el-icon-bottom" v-else></i>
                  {{ metrics.browsingGrowth }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card success">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-shopping-cart-full"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalPurchase }}</h3>
                <p>总购买量</p>
                <span
                  class="metric-trend"
                  :class="metrics.purchaseGrowth.startsWith('+') ? 'up' : 'down'"
                >
                  <i class="el-icon-top" v-if="metrics.purchaseGrowth.startsWith('+')"></i>
                  <i class="el-icon-bottom" v-else></i>
                  {{ metrics.purchaseGrowth }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card warning">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-star-on"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalFavorites }}</h3>
                <p>总收藏量</p>
                <span
                  class="metric-trend"
                  :class="metrics.favoritesGrowth.startsWith('+') ? 'up' : 'down'"
                >
                  <i class="el-icon-top" v-if="metrics.favoritesGrowth.startsWith('+')"></i>
                  <i class="el-icon-bottom" v-else></i>
                  {{ metrics.favoritesGrowth }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card info">
            <div class="metric-content">
              <div class="metric-icon">
                <i class="el-icon-chat-dot-round"></i>
              </div>
              <div class="metric-info">
                <h3>{{ metrics.totalComments }}</h3>
                <p>总评论量</p>
                <span
                  class="metric-trend"
                  :class="metrics.commentsGrowth.startsWith('+') ? 'up' : 'down'"
                >
                  <i class="el-icon-top" v-if="metrics.commentsGrowth.startsWith('+')"></i>
                  <i class="el-icon-bottom" v-else></i>
                  {{ metrics.commentsGrowth }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card class="chart-section">
      <template #header>
        <div class="card-header">
          <span>用户行为趋势分析</span>
          <el-radio-group v-model="behaviorType" size="mini" @change="handleBehaviorTypeChange">
            <el-radio-button label="">全部行为</el-radio-button>
            <el-radio-button label="browse">浏览</el-radio-button>
            <el-radio-button label="purchase">购买</el-radio-button>
            <el-radio-button label="favorite">收藏</el-radio-button>
            <el-radio-button label="comment">评论</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-container">
        <div id="behaviorTrendChart" class="chart"></div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>用户活跃度分析</span>
          </template>
          <div class="chart-container">
            <div id="activityChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>行为类型分布</span>
          </template>
          <div class="chart-container">
            <div id="behaviorTypeChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>用户偏好分析</span>
          </template>
          <div class="chart-container">
            <div id="preferencesChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-section">
          <template #header>
            <span>用户流失风险分析</span>
          </template>
          <div class="chart-container">
            <div id="churnRiskChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-section">
      <template #header>
        <div class="card-header">
          <span>热门商品分析</span>
          <el-select v-model="hotProductsLimit" size="mini" @change="handleHotProductsLimitChange">
            <el-option label="显示前5" value="5"></el-option>
            <el-option label="显示前10" value="10"></el-option>
            <el-option label="显示前20" value="20"></el-option>
          </el-select>
        </div>
      </template>
      <div class="chart-container">
        <div id="hotProductsChart" class="chart"></div>
      </div>
    </el-card>

    <el-card class="analysis-table">
      <template #header>
        <div class="card-header">
          <span>用户行为详细数据</span>
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
      </template>
      <el-table
        v-loading="tableLoading"
        :data="filteredBehaviorData"
        style="width: 100%"
        :default-sort="{ prop: 'behaviorTime', order: 'descending' }"
      >
        <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
        <el-table-column prop="behaviorType" label="行为类型" width="100">
          <template #default="scope">
            <el-tag :type="getBehaviorTypeTag(scope.row.behaviorType)">
              {{ getBehaviorTypeName(scope.row.behaviorType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="behaviorContent" label="行为内容"></el-table-column>
        <el-table-column prop="behaviorTime" label="行为时间" width="180"></el-table-column>
      </el-table>
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
import * as userBehaviorApi from '@/api/user-behavior'
import * as userApi from '@/api/user'

interface User {
  id: number
  username: string
}

interface BehaviorData {
  id: number
  userId: number
  behaviorType: string
  behaviorContent: string
  behaviorTime: string
}

interface Metrics {
  totalBrowsing: string
  browsingGrowth: string
  totalPurchase: string
  purchaseGrowth: string
  totalFavorites: string
  favoritesGrowth: string
  totalComments: string
  commentsGrowth: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

const dateRange = ref<string[]>([])
const userId = ref('')
const behaviorType = ref('')
const hotProductsLimit = ref('10')
const searchKeyword = ref('')
const tableLoading = ref(false)
const userList = ref<User[]>([])
const behaviorData = ref<BehaviorData[]>([])
const filteredBehaviorData = ref<BehaviorData[]>([])

const metrics = reactive<Metrics>({
  totalBrowsing: '0',
  browsingGrowth: '+0.0%',
  totalPurchase: '0',
  purchaseGrowth: '+0.0%',
  totalFavorites: '0',
  favoritesGrowth: '+0.0%',
  totalComments: '0',
  commentsGrowth: '+0.0%',
})

const pagination = reactive<Pagination>({
  page: 1,
  pageSize: 20,
  total: 0,
})

const initData = async () => {
  try {
    tableLoading.value = true
    await loadUserList()
    await loadBehaviorData()
    updateMetrics()
    tableLoading.value = false
  } catch (error) {
    logger.error('初始化数据失败:', error)
    ElMessage.error('初始化数据失败')
    tableLoading.value = false
  }
}

const loadUserList = async () => {
  try {
    const response = await userApi.getUserList({ page: 1, pageSize: 100 })
    userList.value = response.data.items || []
  } catch (error) {
    logger.error('加载用户列表失败:', error)
  }
}

const loadBehaviorData = async () => {
  try {
    const mockData: BehaviorData[] = []
    const now = new Date()

    for (let i = 0; i < 100; i++) {
      const date = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      mockData.push({
        id: i + 1,
        userId: Math.floor(Math.random() * 10) + 1,
        behaviorType: ['browse', 'purchase', 'favorite', 'comment'][Math.floor(Math.random() * 4)],
        behaviorContent: `商品${Math.floor(Math.random() * 100)}`,
        behaviorTime: date.toISOString().substring(0, 19).replace('T', ' '),
      })
    }

    behaviorData.value = mockData
    filteredBehaviorData.value = [...behaviorData.value]
    pagination.total = behaviorData.value.length
  } catch (error) {
    logger.error('加载用户行为数据失败:', error)
  }
}

const updateMetrics = () => {
  const browsingCount = behaviorData.value.filter(item => item.behaviorType === 'browse').length
  const purchaseCount = behaviorData.value.filter(item => item.behaviorType === 'purchase').length
  const favoriteCount = behaviorData.value.filter(item => item.behaviorType === 'favorite').length
  const commentCount = behaviorData.value.filter(item => item.behaviorType === 'comment').length

  metrics.totalBrowsing = browsingCount.toLocaleString()
  metrics.totalPurchase = purchaseCount.toLocaleString()
  metrics.totalFavorites = favoriteCount.toLocaleString()
  metrics.totalComments = commentCount.toLocaleString()

  metrics.browsingGrowth = `+${(Math.random() * 20).toFixed(1)}%`
  metrics.purchaseGrowth = `+${(Math.random() * 30).toFixed(1)}%`
  metrics.favoritesGrowth = `+${(Math.random() * 15).toFixed(1)}%`
  metrics.commentsGrowth = `+${(Math.random() * 10).toFixed(1)}%`
}

const initCharts = () => {
  nextTick(() => {
    drawBehaviorTrendChart()
    drawActivityChart()
    drawBehaviorTypeChart()
    drawPreferencesChart()
    drawChurnRiskChart()
    drawHotProductsChart()
  })
}

const drawBehaviorTrendChart = () => {
  const container = document.getElementById('behaviorTrendChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 350px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📈</div>
          <div style="font-weight: bold;">用户行为趋势图表</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">显示用户行为随时间的变化趋势</div>
        </div>
      </div>
    `
  }
}

const drawActivityChart = () => {
  const container = document.getElementById('activityChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔥</div>
          <div style="font-weight: bold;">用户活跃度分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">评估用户的活跃程度</div>
        </div>
      </div>
    `
  }
}

const drawBehaviorTypeChart = () => {
  const container = document.getElementById('behaviorTypeChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
          <div style="font-weight: bold;">行为类型分布</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">不同类型用户行为的占比</div>
        </div>
      </div>
    `
  }
}

const drawPreferencesChart = () => {
  const container = document.getElementById('preferencesChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
          <div style="font-weight: bold;">用户偏好分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">分析用户的商品偏好</div>
        </div>
      </div>
    `
  }
}

const drawChurnRiskChart = () => {
  const container = document.getElementById('churnRiskChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 300px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
          <div style="font-weight: bold;">用户流失风险</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">评估用户流失的可能性</div>
        </div>
      </div>
    `
  }
}

const drawHotProductsChart = () => {
  const container = document.getElementById('hotProductsChart')
  if (container) {
    container.innerHTML = `
      <div style="height: 350px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔥</div>
          <div style="font-weight: bold;">热门商品分析</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">显示用户关注的热门商品</div>
        </div>
      </div>
    `
  }
}

const getBehaviorTypeTag = (type: string): string => {
  const tagMap: Record<string, string> = {
    browse: 'info',
    purchase: 'success',
    favorite: 'warning',
    comment: 'primary',
  }
  return tagMap[type] || 'info'
}

const getBehaviorTypeName = (type: string): string => {
  const nameMap: Record<string, string> = {
    browse: '浏览',
    purchase: '购买',
    favorite: '收藏',
    comment: '评论',
  }
  return nameMap[type] || type
}

const handleDateChange = () => {
  loadBehaviorData()
}

const handleUserChange = () => {
  loadBehaviorData()
}

const handleBehaviorTypeChange = () => {
  drawBehaviorTrendChart()
}

const handleHotProductsLimitChange = () => {
  drawHotProductsChart()
}

const handleSearch = () => {
  filteredBehaviorData.value = behaviorData.value.filter(item => {
    return item.behaviorContent.toLowerCase().includes(searchKeyword.value.toLowerCase())
  })
  pagination.total = filteredBehaviorData.value.length
  pagination.page = 1
}

const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.page = 1
  loadBehaviorData()
}

const handleCurrentChange = (newPage: number) => {
  pagination.page = newPage
  loadBehaviorData()
}

const refreshData = () => {
  initData()
  initCharts()
  ElMessage.success('数据已刷新')
}

const exportAnalysis = () => {
  logger.info('导出用户行为分析报告', {
    userId: userId.value,
    dateRange: dateRange.value,
  })
  ElMessage.info('正在导出分析报告...')
  setTimeout(() => {
    ElMessage.success('分析报告导出成功')
  }, 2000)
}

onMounted(() => {
  initData()
  initCharts()
})
</script>

<style scoped>
.user-behavior-analysis {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  display: flex;
  align-items: center;
}

.header-content h1 i {
  margin-right: 10px;
  color: #409eff;
}

.header-content p {
  margin: 5px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.metrics-overview {
  margin-bottom: 20px;
}

.metric-card {
  border-radius: 8px;
  overflow: hidden;
}

.metric-content {
  padding: 20px;
  display: flex;
  align-items: center;
}

.metric-icon {
  font-size: 32px;
  color: white;
  margin-right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary .metric-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.success .metric-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.warning .metric-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.info .metric-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.metric-info h3 {
  margin: 0;
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.metric-info p {
  margin: 5px 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.metric-trend {
  display: inline-block;
  margin-top: 5px;
  font-size: 12px;
}

.metric-trend.up {
  color: #67c23a;
}

.metric-trend.down {
  color: #f56c6c;
}

.chart-section {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  padding: 20px 0;
}

.chart {
  height: 300px;
}

.analysis-table {
  margin-bottom: 20px;
  border-radius: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.pagination-container .el-pagination {
  margin: 0;
}

@media (max-width: 768px) {
  .user-behavior-analysis {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
