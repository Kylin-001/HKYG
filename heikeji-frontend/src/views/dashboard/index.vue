<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">欢迎使用黑科易购校园服务平台管理系统</h2>
      <p class="dashboard-subtitle">为校园师生提供便捷的外卖、跑腿等服务管理</p>
    </div>
    <div class="dashboard-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="4" animated />
      </div>

      <!-- 统计卡片 -->
      <div class="stats-card-group">
        <StatsCard
          v-for="item in statsList"
          :key="item.id"
          :icon="item.icon"
          :title="item.title"
          :value="item.value"
          :trend="item.trend"
          :trend-icon="item.trendIcon"
          :trend-text="item.trendText"
          :href="item.href"
        />
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">服务趋势分析</h3>
            <el-radio-group v-model="serviceTrendPeriod" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content">
            <ve-chart :option="serviceTrendOption" autoresize />
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">服务类型统计</h3>
          </div>
          <div class="chart-content">
            <ve-chart :option="serviceTypeOption" autoresize />
          </div>
        </div>
      </div>

      <!-- 最近服务请求 -->
      <div class="recent-requests-container">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">最近服务请求</h3>
            <div style="display: flex; gap: 10px">
              <el-button type="text" size="small" @click="goToTakeawayOrderList">
                外卖订单 <i class="el-icon-arrow-right"></i>
              </el-button>
              <el-button type="text" size="small" @click="goToErrandRequestList">
                跑腿请求 <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
          </div>
          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="外卖订单" name="takeaway">
              <div class="order-table-container">
                <el-table :data="recentTakeawayOrders" stripe border size="small">
                  <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
                  <el-table-column prop="userName" label="用户" width="100"></el-table-column>
                  <el-table-column prop="merchantName" label="商家" width="120">
                    <template #default="scope">
                      {{ scope.row.merchantName || '未指定' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalAmount" label="金额" width="100">
                    <template #default="scope">¥{{ scope.row.totalAmount.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="orderStatusText" label="状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getTakeawayOrderStatusType(scope.row.orderStatus)"
                        size="small"
                      >
                        {{ scope.row.orderStatusText }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                  <el-table-column label="操作" width="80" fixed="right">
                    <template #default="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="viewTakeawayOrderDetail(scope.row.id)"
                        >详情</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="跑腿请求" name="errand">
              <div class="order-table-container">
                <el-table :data="recentErrandRequests" stripe border size="small">
                  <el-table-column prop="requestNo" label="请求编号" width="180"></el-table-column>
                  <el-table-column prop="userName" label="用户" width="100"></el-table-column>
                  <el-table-column prop="serviceTypeText" label="服务类型" width="100">
                    <template #default="scope">
                      <el-tag :type="getServiceTypeTagType(scope.row.serviceType)" size="small">
                        {{ scope.row.serviceTypeText }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="rewardAmount" label="报酬" width="100">
                    <template #default="scope">¥{{ scope.row.rewardAmount.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="requestStatusText" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getRequestStatusType(scope.row.requestStatus)" size="small">
                        {{ scope.row.requestStatusText }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                  <el-table-column label="操作" width="80" fixed="right">
                    <template #default="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="viewErrandRequestDetail(scope.row.id)"
                        >详情</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="quick-entry-container">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">校园服务快捷入口</h3>
          </div>
          <div class="quick-entry">
            <div class="entry-item" @click="$router.push('/campus/list')">
              <div class="entry-icon primary">
                <i class="el-icon-location"></i>
              </div>
              <div class="entry-name">校区管理</div>
              <div class="entry-desc">管理校园各个校区</div>
            </div>
            <div class="entry-item" @click="$router.push('/campus/building')">
              <div class="entry-icon success">
                <i class="el-icon-office-building"></i>
              </div>
              <div class="entry-name">楼栋管理</div>
              <div class="entry-desc">管理校内建筑楼栋</div>
            </div>
            <div class="entry-item" @click="$router.push('/campus/locker')">
              <div class="entry-icon warning">
                <i class="el-icon-box"></i>
              </div>
              <div class="entry-name">外卖柜管理</div>
              <div class="entry-desc">智能外卖存取柜</div>
            </div>
            <div class="entry-item" @click="$router.push('/campus/station')">
              <div class="entry-icon danger">
                <i class="el-icon-map-location"></i>
              </div>
              <div class="entry-name">站点管理</div>
              <div class="entry-desc">校园服务站点</div>
            </div>
            <div class="entry-item" @click="$router.push('/takeout/order')">
              <div class="entry-icon info">
                <i class="el-icon-shopping-cart"></i>
              </div>
              <div class="entry-name">外卖订单</div>
              <div class="entry-desc">校园外卖管理</div>
            </div>
            <div class="entry-item" @click="$router.push('/errand/request')">
              <div class="entry-icon primary">
                <i class="el-icon-document"></i>
              </div>
              <div class="entry-name">跑腿服务</div>
              <div class="entry-desc">校园跑腿代购</div>
            </div>
            <div class="entry-item" @click="$router.push('/delivery/request')">
              <div class="entry-icon success">
                <i class="el-icon-truck"></i>
              </div>
              <div class="entry-name">配送管理</div>
              <div class="entry-desc">校园配送服务</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import StatsCard from '@/components/StatsCard.vue'
import logger from '@/utils/logger'
import { useDashboardStore } from '@/store/modules/dashboard'

// 路由实例
const router = useRouter()

// Store实例
const dashboardStore = useDashboardStore()

// 加载状态
const loading = ref(false)

// 服务趋势分析周期
const serviceTrendPeriod = ref('week')

// 活跃标签页
const activeTab = ref('takeaway')

// 统计卡片数据
const statsList = ref([
  {
    id: 1,
    icon: 'el-icon-user',
    title: '总用户数',
    value: '0',
    trend: 0,
    trendIcon: '',
    trendText: '',
    href: '/user/list',
  },
  {
    id: 2,
    icon: 'el-icon-document',
    title: '今日订单',
    value: '0',
    trend: 0,
    trendIcon: '',
    trendText: '',
    href: '/order/list',
  },
  {
    id: 3,
    icon: 'el-icon-shopping-cart',
    title: '商家数量',
    value: '0',
    trend: 0,
    trendIcon: '',
    trendText: '',
    href: '/merchant/list',
  },
  {
    id: 4,
    icon: 'el-icon-money',
    title: '今日营收',
    value: '¥ 0',
    trend: 0,
    trendIcon: '',
    trendText: '',
    href: '/finance/overview',
  },
])

// 服务趋势图表配置
const serviceTrendOption = ref({
  // 图表配置将在数据加载后更新
})

// 服务类型统计图表配置
const serviceTypeOption = ref({
  // 图表配置将在数据加载后更新
})

// 最近外卖订单
const recentTakeawayOrders = ref([])

// 最近跑腿请求
const recentErrandRequests = ref([])

// 防抖函数
function debounce(fn: Function, delay: number = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 窗口大小变化处理
const handleWindowResize = debounce(() => {
  // 图表自适应大小将由ve-chart的autoresize属性处理
}, 300)

// 定时刷新计时器
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null

// 获取外卖订单状态类型
function getTakeawayOrderStatusType(status: number): string {
  const statusMap: Record<number, string> = {
    1: 'warning', // 待支付
    2: 'info', // 待发货
    3: 'primary', // 配送中
    4: 'success', // 已完成
    5: 'danger', // 已取消
  }
  return statusMap[status] || 'default'
}

// 获取服务类型标签类型
function getServiceTypeTagType(type: number): string {
  const typeMap: Record<number, string> = {
    1: 'primary', // 代购
    2: 'success', // 取送
    3: 'warning', // 排队
    4: 'info', // 其他
    5: 'danger', // 紧急
  }
  return typeMap[type] || 'default'
}

// 获取请求状态类型
function getRequestStatusType(status: number): string {
  const statusMap: Record<number, string> = {
    1: 'warning', // 待接单
    2: 'primary', // 进行中
    3: 'success', // 已完成
    4: 'danger', // 已取消
  }
  return statusMap[status] || 'default'
}

// 初始化数据
async function initData() {
  await fetchData()
}

// 刷新数据
const refreshData = debounce(async () => {
  await fetchData()
}, 1000)

// 获取数据
async function fetchData() {
  try {
    loading.value = true
    // 并行执行多个API请求，提升性能
    const promises = [
      dashboardStore.getDashboardData(),
      getRecentTakeawayOrders(),
      getRecentErrandRequests(),
    ]

    await Promise.allSettled(promises)

    // 批量更新统计数据
    updateStats()
  } catch (error) {
    logger.error('获取仪表板数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
    // 即使API调用失败，也使用模拟数据展示
    showMockData()
  } finally {
    loading.value = false
  }
}

// 更新统计数据
function updateStats() {
  const { dashboardData } = dashboardStore

  // 更新统计卡片数据
  statsList.value[0].value = dashboardData.totalUsers?.toString() || '0'
  statsList.value[1].value = dashboardData.dailyOrders?.toString() || '0'
  statsList.value[2].value = dashboardData.totalMerchants?.toString() || '0'
  statsList.value[3].value = `¥ ${dashboardData.dailyRevenue?.toFixed(2) || '0'}`
}

// 显示模拟数据作为后备方案
function showMockData() {
  statsList.value[0].value = '156'
  statsList.value[0].trend = 12
  statsList.value[0].trendIcon = 'el-icon-caret-top'
  statsList.value[0].trendText = '较昨日'

  statsList.value[1].value = '28'
  statsList.value[1].trend = -5
  statsList.value[1].trendIcon = 'el-icon-caret-bottom'
  statsList.value[1].trendText = '较昨日'

  statsList.value[2].value = '8'

  statsList.value[3].value = '¥ 1,248'
  statsList.value[3].trend = 8
  statsList.value[3].trendIcon = 'el-icon-caret-top'
  statsList.value[3].trendText = '较昨日'

  // 生成模拟的最近订单数据
  recentTakeawayOrders.value = [
    {
      id: '1',
      orderNo: 'TK20251112001',
      userName: '张三',
      totalAmount: 25.5,
      orderStatusText: '配送中',
      createTime: '2025-11-12 18:30:25',
    },
  ]

  recentErrandRequests.value = [
    {
      id: '1',
      requestNo: 'PT20251112001',
      userName: '李四',
      serviceTypeText: '代购',
      rewardAmount: 10,
      requestStatusText: '进行中',
      createTime: '2025-11-12 17:45:12',
    },
  ]
}

// 获取最近外卖订单
async function getRecentTakeawayOrders() {
  try {
    // 这里应该调用API获取真实数据
    // const response = await dashboardApi.getRecentTakeawayOrders()
    // recentTakeawayOrders.value = response.data

    // 暂时使用模拟数据
    recentTakeawayOrders.value = [
      {
        id: '1',
        orderNo: 'TK20251112001',
        userName: '张三',
        merchantName: '兰州拉面',
        totalAmount: 25.5,
        orderStatus: 3,
        orderStatusText: '配送中',
        createTime: '2025-11-12 18:30:25',
      },
      {
        id: '2',
        orderNo: 'TK20251112002',
        userName: '李四',
        merchantName: '黄焖鸡米饭',
        totalAmount: 32.8,
        orderStatus: 4,
        orderStatusText: '已完成',
        createTime: '2025-11-12 18:25:30',
      },
    ]
  } catch (error) {
    logger.error('获取最近外卖订单失败:', error)
    recentTakeawayOrders.value = []
  }
}

// 获取最近跑腿请求
async function getRecentErrandRequests() {
  try {
    // 这里应该调用API获取真实数据
    // const response = await dashboardApi.getRecentErrandRequests()
    // recentErrandRequests.value = response.data

    // 暂时使用模拟数据
    recentErrandRequests.value = [
      {
        id: '1',
        requestNo: 'PT20251112001',
        userName: '王五',
        serviceType: 1,
        serviceTypeText: '代购',
        rewardAmount: 10,
        requestStatus: 2,
        requestStatusText: '进行中',
        createTime: '2025-11-12 17:45:12',
      },
      {
        id: '2',
        requestNo: 'PT20251112002',
        userName: '赵六',
        serviceType: 2,
        serviceTypeText: '取送',
        rewardAmount: 8,
        requestStatus: 3,
        requestStatusText: '已完成',
        createTime: '2025-11-12 17:30:45',
      },
    ]
  } catch (error) {
    logger.error('获取最近跑腿请求失败:', error)
    recentErrandRequests.value = []
  }
}

// 查看外卖订单详情
function viewTakeawayOrderDetail(id: string) {
  router.push(`/takeout/order/detail/${id}`)
}

// 查看跑腿请求详情
function viewErrandRequestDetail(id: string) {
  router.push(`/errand/request/detail/${id}`)
}

// 跳转到外卖订单列表
function goToTakeawayOrderList() {
  router.push('/takeout/order')
}

// 跳转到跑腿请求列表
function goToErrandRequestList() {
  router.push('/errand/request')
}

// 组件挂载时
onMounted(() => {
  // 初始化数据
  initData()

  // 监听窗口大小变化
  window.addEventListener('resize', handleWindowResize)

  // 设置定时刷新（5分钟）
  autoRefreshTimer = setInterval(() => {
    if (!loading.value) {
      refreshData()
    }
  }, 300000)
})

// 组件卸载前
onBeforeUnmount(() => {
  // 清理定时器和事件监听
  window.removeEventListener('resize', handleWindowResize)
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
  }
})
</script>

<style scoped lang="scss">
// 样式将从原组件迁移并适配Vue 3
.dashboard-container {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  font-size: 14px;
  color: #666;
}

.loading-container {
  margin-bottom: 20px;
}

.stats-card-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.chart-content {
  height: 300px;
}

.recent-requests-container {
  margin-bottom: 20px;
}

.quick-entry-container {
  margin-bottom: 20px;
}

.quick-entry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.entry-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 12px;
  color: #fff;

  &.primary {
    background: #409eff;
  }

  &.success {
    background: #67c23a;
  }

  &.warning {
    background: #e6a23c;
  }

  &.danger {
    background: #f56c6c;
  }

  &.info {
    background: #909399;
  }
}

.entry-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 12px;
  color: #909399;
}

.order-table-container {
  overflow-x: auto;
}
</style>
