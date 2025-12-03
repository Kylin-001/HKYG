<template>
  <div class="merchant-dashboard">
    <!-- 商家头部信息 -->
    <div class="merchant-header">
      <div class="header-content">
        <div class="merchant-avatar">
          <img
            :src="merchantInfo.avatar || '/static/images/default-merchant.jpg'"
            :alt="merchantInfo.name"
          />
        </div>
        <div class="merchant-details">
          <h2>{{ merchantInfo.name }}</h2>
          <p class="merchant-type">{{ merchantInfo.type }}</p>
          <div class="merchant-status">
            <el-tag :type="merchantInfo.status === '营业中' ? 'success' : 'danger'" size="small">
              {{ merchantInfo.status }}
            </el-tag>
            <span class="last-update">最后更新: {{ merchantInfo.lastUpdate }}</span>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="toggleShopStatus">
            {{ merchantInfo.status === '营业中' ? '暂停营业' : '开始营业' }}
          </el-button>
          <el-button @click="editMerchantInfo">编辑店铺信息</el-button>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon primary">
              <i class="el-icon-money"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ todayStats.revenue }}</div>
              <div class="stat-label">今日营收</div>
              <div class="stat-change positive">
                <i class="el-icon-caret-top"></i>
                +12.5%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon success">
              <i class="el-icon-document"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayStats.orders }}</div>
              <div class="stat-label">今日订单</div>
              <div class="stat-change positive">
                <i class="el-icon-caret-top"></i>
                +8
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <i class="el-icon-star-on"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayStats.rating }}</div>
              <div class="stat-label">店铺评分</div>
              <div class="stat-change positive">
                <i class="el-icon-caret-top"></i>
                +0.2
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon info">
              <i class="el-icon-view"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayStats.visitors }}</div>
              <div class="stat-label">今日浏览</div>
              <div class="stat-change negative">
                <i class="el-icon-caret-bottom"></i>
                -3.2%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细统计 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 营收趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template v-slot:header>
            <span>营收趋势</span>
            <div class="chart-actions">
              <el-button-group size="small">
                <el-button
                  :type="revenuePeriod === '7d' ? 'primary' : ''"
                  @click="setRevenuePeriod('7d')"
                  >7天</el-button
                >
                <el-button
                  :type="revenuePeriod === '30d' ? 'primary' : ''"
                  @click="setRevenuePeriod('30d')"
                  >30天</el-button
                >
                <el-button
                  :type="revenuePeriod === '90d' ? 'primary' : ''"
                  @click="setRevenuePeriod('90d')"
                  >90天</el-button
                >
              </el-button-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="revenueChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 订单状态分布 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template v-slot:header>
            <span>订单状态分布</span>
          </template>
          <div class="chart-container">
            <div ref="orderChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作和最近订单 -->
    <el-row :gutter="20" class="content-row">
      <!-- 快速操作 -->
      <el-col :span="8">
        <el-card class="quick-actions-card">
          <template v-slot:header>
            <span>快速操作</span>
          </template>
          <div class="actions-grid">
            <div class="action-item" @click="$router.push('/merchant/products/add')">
              <div class="action-icon primary">
                <i class="el-icon-plus"></i>
              </div>
              <div class="action-label">添加商品</div>
            </div>
            <div class="action-item" @click="$router.push('/merchant/orders')">
              <div class="action-icon success">
                <i class="el-icon-document"></i>
              </div>
              <div class="action-label">管理订单</div>
            </div>
            <div class="action-item" @click="$router.push('/merchant/promotions')">
              <div class="action-icon warning">
                <i class="el-icon-ticket"></i>
              </div>
              <div class="action-label">营销活动</div>
            </div>
            <div class="action-item" @click="viewSalesReport">
              <div class="action-icon info">
                <i class="el-icon-data-analysis"></i>
              </div>
              <div class="action-label">销售报表</div>
            </div>
            <div class="action-item" @click="editBusinessHours">
              <div class="action-icon primary">
                <i class="el-icon-time"></i>
              </div>
              <div class="action-label">营业时间</div>
            </div>
            <div class="action-item" @click="viewCustomerReviews">
              <div class="action-icon success">
                <i class="el-icon-chat-dot-round"></i>
              </div>
              <div class="action-label">客户评价</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 最近订单 -->
      <el-col :span="16">
        <el-card class="recent-orders-card">
          <template v-slot:header>
            <span>最近订单</span>
            <el-button type="text" @click="$router.push('/merchant/orders')">查看全部</el-button>
          </template>

          <div class="orders-list">
            <div v-for="order in recentOrders" :key="order.id" class="order-item">
              <div class="order-main">
                <div class="order-info">
                  <div class="order-number">订单号: {{ order.orderNo }}</div>
                  <div class="order-time">{{ order.createTime }}</div>
                </div>
                <div class="order-amount">¥{{ order.amount }}</div>
              </div>
              <div class="order-status">
                <el-tag :type="getOrderStatusType(order.status)" size="small">
                  {{ order.statusText }}
                </el-tag>
              </div>
              <div class="order-actions">
                <el-button
                  v-if="order.status === '待接单'"
                  type="primary"
                  size="mini"
                  @click="acceptOrder(order.id)"
                >
                  接单
                </el-button>
                <el-button
                  v-if="order.status === '制作中'"
                  type="warning"
                  size="mini"
                  @click="updateOrderStatus(order.id, '已完成制作')"
                >
                  完成制作
                </el-button>
                <el-button size="mini" @click="viewOrderDetail(order.id)">详情</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑店铺信息对话框 -->
    <el-dialog title="编辑店铺信息" v-model="editDialogVisible" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="店铺名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺类型">
          <el-select v-model="editForm.type" placeholder="选择店铺类型">
            <el-option label="中式快餐" value="中式快餐"></el-option>
            <el-option label="西式料理" value="西式料理"></el-option>
            <el-option label="日韩料理" value="日韩料理"></el-option>
            <el-option label="奶茶饮品" value="奶茶饮品"></el-option>
            <el-option label="甜品小吃" value="甜品小吃"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺描述">
          <el-input v-model="editForm.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="起送价格">
          <el-input-number v-model="editForm.minOrderAmount" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input-number v-model="editForm.deliveryFee" :min="0" :step="0.5"></el-input-number>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-input-number v-model="editForm.deliveryTime" :min="15" :step="5"></el-input-number>
          分钟
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMerchantInfo">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import logger from '@/utils/logger'

// 类型定义
interface MerchantInfo {
  name: string
  type: string
  status: string
  lastUpdate: string
  avatar: string
  phone?: string
  description?: string
  minOrderAmount?: number
  deliveryFee?: number
  deliveryTime?: number
}

interface TodayStats {
  revenue: string
  orders: number
  rating: string
  visitors: number
}

interface Order {
  id: number
  orderNo: string
  amount: number
  createTime: string
  status: string
  statusText: string
}

interface EditForm {
  name: string
  type: string
  phone: string
  description: string
  minOrderAmount: number
  deliveryFee: number
  deliveryTime: number
}

// 商家信息
const merchantInfo = reactive<MerchantInfo>({
  name: '兰州拉面',
  type: '中式快餐',
  status: '营业中',
  lastUpdate: '2024-11-21 14:30',
  avatar: ''
})

// 今日数据统计
const todayStats = reactive<TodayStats>({
  revenue: '1,256.80',
  orders: 24,
  rating: '4.8',
  visitors: 156
})

// 营收图表数据
const revenuePeriod = ref('7d')

// 最近订单
const recentOrders = ref<Order[]>([])

// 编辑对话框
const editDialogVisible = ref(false)

// 编辑表单
const editForm = reactive<EditForm>({
  name: '',
  type: '',
  phone: '',
  description: '',
  minOrderAmount: 0,
  deliveryFee: 0,
  deliveryTime: 30
})

// 定时器和事件监听
let refreshTimer: number | null = null
let handleResize: () => void = () => {}

// 路由
const router = useRouter()

// 防抖函数
const debounce = (fn: Function, delay = 300) => {
  let timer: number
  return function (...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  }
}

// 初始化仪表板
const initDashboard = async () => {
  try {
    // 并行加载数据提升性能
    const promises = [loadDashboardData(), loadRecentOrders(), initCharts()]

    await Promise.allSettled(promises)

    // 设置自动刷新
    setupAutoRefresh()
  } catch (error) {
    logger.error('初始化仪表板失败:', error)
    ElMessage.error('仪表板加载失败，请刷新重试')
  }
}

// 设置自动刷新
const setupAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    loadDashboardData()
    loadRecentOrders()
  }, 30000) // 每30秒刷新一次订单数据
} as unknown as number

// 加载仪表板数据
const loadDashboardData = () => {
  // 这里应该从API加载数据
  recentOrders.value = [
    {
      id: 1,
      orderNo: 'TK20241121143001',
      amount: 45.8,
      createTime: '14:30',
      status: '待接单',
      statusText: '待接单'
    },
    {
      id: 2,
      orderNo: 'TK20241121142502',
      amount: 32.5,
      createTime: '14:25',
      status: '制作中',
      statusText: '制作中'
    },
    {
      id: 3,
      orderNo: 'TK20241121142003',
      amount: 68.9,
      createTime: '14:20',
      status: '已完成制作',
      statusText: '已完成制作'
    }
  ]
}

// 加载最近订单
const loadRecentOrders = async () => {
  // 模拟异步加载逻辑
  return new Promise(resolve => {
    setTimeout(() => {
      logger.debug('最近订单加载完成')
      resolve(undefined)
    }, 100)
  })
}

// 初始化图表
const initCharts = async () => {
  // 这里应该初始化图表库，如ECharts
  logger.debug('初始化图表...')
  return new Promise(resolve => {
    setTimeout(() => {
      logger.debug('图表初始化完成')
      resolve(undefined)
    }, 200)
  })
}

// 设置营收图表周期
const setRevenuePeriod = (period: string) => {
  revenuePeriod.value = period
  // 重新加载图表数据
}

// 切换营业状态
const toggleShopStatus = () => {
  merchantInfo.status = merchantInfo.status === '营业中' ? '已打烊' : '营业中'
  ElMessage.success(`店铺状态已更新为: ${merchantInfo.status}`)
}

// 编辑店铺信息
const editMerchantInfo = () => {
  Object.assign(editForm, merchantInfo)
  editDialogVisible.value = true
}

// 保存店铺信息
const saveMerchantInfo = () => {
  // 保存逻辑
  Object.assign(merchantInfo, editForm)
  editDialogVisible.value = false
  ElMessage.success('店铺信息更新成功')
}

// 获取订单状态类型
const getOrderStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    待接单: 'warning',
    制作中: 'primary',
    已完成制作: 'success',
    已取消: 'danger'
  }
  return statusMap[status] || 'info'
}

// 接单
const acceptOrder = (orderId: number) => {
  ElMessageBox.confirm('确定要接单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 更新订单状态
    updateOrderStatus(orderId, '制作中')
  })
}

// 更新订单状态
const updateOrderStatus = (orderId: number, newStatus: string) => {
  const order = recentOrders.value.find(o => o.id === orderId)
  if (order) {
    order.status = newStatus
    order.statusText = newStatus
    ElMessage.success('订单状态已更新')
  }
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/merchant/orders/detail/${orderId}`)
}

// 查看销售报表
const viewSalesReport = () => {
  ElMessage.info('销售报表功能开发中...')
}

// 编辑营业时间
const editBusinessHours = () => {
  ElMessage.info('营业时间设置功能开发中...')
}

// 查看客户评价
const viewCustomerReviews = () => {
  router.push('/merchant/reviews')
}

// 组件挂载时
onMounted(() => {
  initDashboard()
})

// 组件卸载前
onBeforeUnmount(() => {
  // 清理定时器和事件监听
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.merchant-dashboard {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

/* 商家头部 */
.merchant-header {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.merchant-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #409eff;
}

.merchant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.merchant-details {
  flex: 1;
}

.merchant-details h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #333;
}

.merchant-type {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.merchant-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.last-update {
  font-size: 12px;
  color: #999;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 数据统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-icon.primary {
  background: #409eff;
}
.stat-icon.success {
  background: #67c23a;
}
.stat-icon.warning {
  background: #e6a23c;
}
.stat-icon.info {
  background: #909399;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 12px;
  font-weight: bold;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.chart-card .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

/* 内容区域 */
.content-row {
  margin-bottom: 20px;
}

.quick-actions-card,
.recent-orders-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: none;
  height: fit-content;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  margin-bottom: 10px;
}

.action-icon.primary {
  background: #409eff;
}
.action-icon.success {
  background: #67c23a;
}
.action-icon.warning {
  background: #e6a23c;
}
.action-icon.info {
  background: #909399;
}

.action-label {
  font-size: 12px;
  color: #333;
  text-align: center;
}

/* 订单列表 */
.orders-list {
  max-height: 400px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.order-main {
  flex: 1;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-number {
  font-weight: bold;
  color: #333;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-amount {
  font-size: 16px;
  font-weight: bold;
  color: #ff4757;
}

.order-status {
  margin: 0 10px;
}

.order-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .merchant-dashboard {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
