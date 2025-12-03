<template>
  <div class="courier-dashboard">
    <!-- 配送员头部信息 -->
    <div class="courier-header">
      <div class="courier-info">
        <div class="avatar-section">
          <el-avatar :size="60" :src="courierInfo.avatar">
            <i class="el-icon-user-solid"></i>
          </el-avatar>
          <div class="status-badge" :class="courierInfo.onlineStatus">
            {{ courierInfo.onlineStatus === 'online' ? '在线' : '离线' }}
          </div>
        </div>
        <div class="basic-info">
          <h2>{{ courierInfo.name }}</h2>
          <p class="courier-id">配送员ID: {{ courierInfo.id }}</p>
          <p class="join-date">入职时间: {{ courierInfo.joinDate }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-switch
          v-model="courierInfo.onlineStatus"
          active-text="在线接单"
          inactive-text="暂停接单"
          active-value="online"
          inactive-value="offline"
          @change="handleStatusChange"
        ></el-switch>
        <el-button type="primary" @click="handleNavigation">
          <i class="el-icon-map-location"></i> 地图导航
        </el-button>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon today-delivery">
                <i class="el-icon-truck"></i>
              </div>
              <div class="stat-info">
                <h3>{{ stats.todayDeliveries }}</h3>
                <p>今日配送</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon pending-orders">
                <i class="el-icon-time"></i>
              </div>
              <div class="stat-info">
                <h3>{{ stats.pendingOrders }}</h3>
                <p>待取餐</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon today-income">
                <i class="el-icon-money"></i>
              </div>
              <div class="stat-info">
                <h3>¥{{ stats.todayIncome.toFixed(2) }}</h3>
                <p>今日收入</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon rating">
                <i class="el-icon-star-on"></i>
              </div>
              <div class="stat-info">
                <h3>{{ courierInfo.rating.toFixed(1) }}</h3>
                <p>服务评分</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <!-- 待处理订单 -->
      <el-col :span="12">
        <el-card class="pending-orders-card">
          <div slot="header">
            <span>待处理订单</span>
            <el-badge :value="pendingOrders.length" class="badge-item">
              <el-button size="small" type="text" @click="refreshOrders">
                <i class="el-icon-refresh"></i>
              </el-button>
            </el-badge>
          </div>
          <div class="orders-list">
            <div
              v-for="order in pendingOrders"
              :key="order.id"
              class="order-item"
              @click="handleOrderClick(order)"
            >
              <div class="order-info">
                <div class="order-header">
                  <span class="order-no">{{ order.orderNo }}</span>
                  <el-tag :type="getOrderTypeTag(order.type)">
                    {{ getOrderTypeText(order.type) }}
                  </el-tag>
                </div>
                <p class="pickup-address">
                  <i class="el-icon-location-outline"></i>
                  {{ order.pickupAddress }}
                </p>
                <p class="delivery-address">
                  <i class="el-icon-location-outline"></i>
                  {{ order.deliveryAddress }}
                </p>
                <div class="order-meta">
                  <span class="fee">配送费: ¥{{ order.fee }}</span>
                  <span class="distance">{{ order.distance }}km</span>
                  <span class="estimated-time">{{ order.estimatedTime }}</span>
                </div>
              </div>
              <div class="order-actions">
                <el-button
                  type="primary"
                  size="mini"
                  @click.stop="handleAcceptOrder(order)"
                  :disabled="courierInfo.onlineStatus !== 'online'"
                >
                  接单
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 配送统计图表 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header">
            <span>配送统计</span>
          </div>
          <div class="chart-container">
            <div ref="deliveryChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 最近配送记录 -->
      <el-col :span="16">
        <el-card class="recent-orders-card">
          <div slot="header">
            <span>最近配送记录</span>
            <el-button size="small" type="text" @click="router.push('/courier/orders')">
              查看全部
            </el-button>
          </div>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="120">
              <template slot-scope="{ row }">
                <el-link @click="handleOrderClick(row)" type="primary">
                  {{ row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="配送信息" min-width="200">
              <template slot-scope="{ row }">
                <div class="delivery-info">
                  <p><strong>取餐:</strong> {{ row.pickupAddress }}</p>
                  <p><strong>送达:</strong> {{ row.deliveryAddress }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fee" label="配送费" width="80">
              <template slot-scope="{ row }"> ¥{{ row.fee }} </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{ row }">
                <el-tag :type="getStatusTagType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deliveryTime" label="完成时间" width="120"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 收入统计 -->
      <el-col :span="8">
        <el-card class="income-card">
          <div slot="header">
            <span>收入统计</span>
          </div>
          <div class="income-summary">
            <div class="income-item">
              <label>今日收入</label>
              <span class="amount today">¥{{ stats.todayIncome.toFixed(2) }}</span>
            </div>
            <div class="income-item">
              <label>本周收入</label>
              <span class="amount week">¥{{ stats.weekIncome.toFixed(2) }}</span>
            </div>
            <div class="income-item">
              <label>本月收入</label>
              <span class="amount month">¥{{ stats.monthIncome.toFixed(2) }}</span>
            </div>
            <div class="income-item">
              <label>总配送单数</label>
              <span class="count">{{ stats.totalDeliveries }}</span>
            </div>
            <div class="income-chart" ref="incomeChart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-card>
        <div slot="header">
          <span>快捷操作</span>
        </div>
        <div class="action-buttons">
          <el-button @click="handlePhoneCall">
            <i class="el-icon-phone"></i>
            联系客服
          </el-button>
          <el-button @click="handleReportProblem">
            <i class="el-icon-warning"></i>
            问题反馈
          </el-button>
          <el-button @click="handleStatistics">
            <i class="el-icon-data-analysis"></i>
            数据统计
          </el-button>
          <el-button @click="handleSettings">
            <i class="el-icon-setting"></i>
            个人设置
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// TypeScript接口定义
interface CourierInfo {
  id: string
  name: string
  avatar: string
  onlineStatus: 'online' | 'offline'
  joinDate: string
  rating: number
}

interface Order {
  id: string
  orderNo: string
  type: 'takeout' | 'pickup' | 'buy'
  pickupAddress: string
  deliveryAddress: string
  fee: number
  distance: number
  estimatedTime: string
  status: 'pending' | 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled'
}

interface Stats {
  todayDeliveries: number
  pendingOrders: number
  todayIncome: number
  serviceRating: number
  weekIncome: number
  monthIncome: number
  totalDeliveries: number
}

interface DashboardData {
  todayDeliveries: number
  pendingOrders: number
  todayIncome: number
  serviceRating: number
  weekIncome: number
  monthIncome: number
  totalDeliveries: number
}

const store = useStore()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const pendingOrders = ref<Order[]>([])
const recentOrders = ref<Order[]>([])

// 图表相关
const deliveryChart = ref(null)
const incomeChart = ref(null)
const chartOption = reactive({
  title: {
    text: '近7天配送趋势',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '配送单量',
      type: 'line',
      smooth: true,
      data: [8, 12, 15, 10, 18, 14, 12],
      itemStyle: {
        color: '#409EFF',
      },
    },
  ],
})

// 从Vuex获取状态
const courierInfo = computed<CourierInfo>(() => store.getters['courier/courierInfo'])
const dashboardData = computed<DashboardData | null>(() => store.getters['courier/dashboardData'])

// 计算属性
const stats = computed<Stats>(() => {
  return (
    dashboardData.value || {
      todayDeliveries: 0,
      pendingOrders: 0,
      todayIncome: 0,
      serviceRating: 0,
      weekIncome: 0,
      monthIncome: 0,
      totalDeliveries: 0,
    }
  )
})

// 生命周期钩子
onMounted(() => {
  initData()
  initCharts()
})

// 方法
const getDashboardData = () => store.dispatch('courier/getDashboardData')
const updateStatus = (status: 'online' | 'offline') =>
  store.dispatch('courier/updateStatus', status)
const getOrders = () => store.dispatch('courier/getOrders')
const acceptOrderAction = (orderId: string) => store.dispatch('courier/acceptOrder', orderId)

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    // 获取仪表板数据
    await getDashboardData()

    // 获取待处理订单
    const ordersData: any = await getOrders()
    if (ordersData) {
      pendingOrders.value = ordersData.list.filter((order: Order) => order.status === 'pending')
      recentOrders.value = ordersData.list
        .filter((order: Order) => order.status === 'completed')
        .slice(0, 5) // 显示最近5个已完成订单
    }
  } catch (error) {
    logger.error('初始化数据失败', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const initCharts = () => {
  // 这里应该初始化图表，使用ECharts或其他图表库
  logger.log('初始化图表...')
}

const handleStatusChange = async (newStatus: 'online' | 'offline') => {
  try {
    await updateStatus(newStatus)
    const message = newStatus === 'online' ? '您已上线，开始接单' : '您已下线，暂停接单'
    ElMessage.success(message)
  } catch (error) {
    logger.error('更新状态失败', error)
    ElMessage.error('更新状态失败')
  }
}

const handleNavigation = () => {
  ElMessage.info('打开地图导航...')
}

const refreshOrders = async () => {
  try {
    const ordersData: any = await getOrders()
    if (ordersData) {
      pendingOrders.value = ordersData.list.filter((order: Order) => order.status === 'pending')
      recentOrders.value = ordersData.list
        .filter((order: Order) => order.status === 'completed')
        .slice(0, 5)
    }
    ElMessage.success('订单已刷新')
  } catch (error) {
    logger.error('刷新订单失败', error)
    ElMessage.error('刷新订单失败')
  }
}

const handleAcceptOrder = async (order: Order) => {
  try {
    await ElMessageBox.confirm(`确认接取订单 ${order.orderNo} 吗？`, '确认接单', {
      confirmButtonText: '确认接单',
      cancelButtonText: '取消',
      type: 'info',
    })

    await acceptOrderAction(order.id)
    ElMessage.success(`已接取订单 ${order.orderNo}`)
    // 重新获取订单数据
    await refreshOrders()
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('接单失败', error)
      ElMessage.error('接单失败')
    }
  }
}

const handleOrderClick = (order: Order) => {
  router.push(`/courier/orders/detail/${order.id}`)
}

const getOrderTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    takeout: 'danger',
    pickup: 'warning',
    buy: 'success',
  }
  return typeMap[type] || 'info'
}

const getOrderTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    takeout: '外卖配送',
    pickup: '取快递',
    buy: '代购商品',
  }
  return typeMap[type] || '未知'
}

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    accepted: 'primary',
    picking: 'info',
    delivering: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待接单',
    accepted: '已接单',
    picking: '取餐中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || '未知'
}

const handlePhoneCall = () => {
  ElMessage.info('正在拨打客服电话...')
}

const handleReportProblem = () => {
  ElMessage.info('问题反馈功能开发中...')
}

const handleStatistics = () => {
  router.push('/courier/statistics')
}

const handleSettings = () => {
  router.push('/courier/settings')
}
</script>

<style scoped>
.courier-dashboard {
  padding: 20px;
}

.courier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  color: white;
}

.courier-info {
  display: flex;
  align-items: center;
}

.avatar-section {
  position: relative;
  margin-right: 20px;
}

.status-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 2px solid white;
}

.status-badge.online {
  background-color: #67c23a;
}

.status-badge.offline {
  background-color: #f56c6c;
}

.basic-info h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
}

.courier-id,
.join-date {
  margin: 2px 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header-actions .el-switch {
  color: white;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
  color: white;
}

.stat-icon.today-delivery {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pending-orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.today-income {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.rating {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #606266;
  font-size: 14px;
}

.orders-list {
  max-height: 400px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.order-item:hover {
  background-color: #f8f9fa;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-no {
  font-weight: bold;
  color: #303133;
}

.pickup-address,
.delivery-address {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}

.pickup-address i,
.delivery-address i {
  margin-right: 5px;
  color: #409eff;
}

.order-meta {
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.order-meta .fee {
  color: #67c23a;
  font-weight: bold;
}

.chart-card,
.pending-orders-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.delivery-info p {
  margin: 5px 0;
  font-size: 12px;
}

.income-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.income-summary {
  padding: 10px 0;
}

.income-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.income-item:last-child {
  border-bottom: none;
}

.income-item label {
  color: #606266;
  font-size: 14px;
}

.amount {
  font-weight: bold;
  font-size: 16px;
}

.amount.today {
  color: #67c23a;
}

.amount.week {
  color: #409eff;
}

.amount.month {
  color: #e6a23c;
}

.count {
  font-weight: bold;
  color: #909399;
}

.quick-actions {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  flex: 1;
  min-width: 120px;
}

.badge-item {
  float: right;
}
</style>
