<template>
  <div class="courier-orders">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-truck"></i>
          我的订单
        </h1>
        <p>管理您的所有配送订单</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="refreshOrders">
          <i class="el-icon-refresh"></i>
          刷新订单
        </el-button>
      </div>
    </div>

    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单状态">
          <el-select
            v-model="filterForm.status"
            placeholder="选择状态"
            @change="handleFilterChange"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="待接单" value="pending"></el-option>
            <el-option label="已接单" value="accepted"></el-option>
            <el-option label="取餐中" value="picking"></el-option>
            <el-option label="配送中" value="delivering"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="filterForm.type" placeholder="选择类型" @change="handleFilterChange">
            <el-option label="全部" value=""></el-option>
            <el-option label="外卖配送" value="takeout"></el-option>
            <el-option label="取快递" value="pickup"></el-option>
            <el-option label="代购商品" value="buy"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilterChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计信息 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon total">
                <i class="el-icon-document"></i>
              </div>
              <div class="stat-text">
                <h3>{{ orderStats.total }}</h3>
                <p>总订单</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon pending">
                <i class="el-icon-time"></i>
              </div>
              <div class="stat-text">
                <h3>{{ orderStats.pending }}</h3>
                <p>待处理</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon processing">
                <i class="el-icon-truck"></i>
              </div>
              <div class="stat-text">
                <h3>{{ orderStats.processing }}</h3>
                <p>配送中</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon completed">
                <i class="el-icon-check"></i>
              </div>
              <div class="stat-text">
                <h3>{{ orderStats.completed }}</h3>
                <p>已完成</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon income">
                <i class="el-icon-money"></i>
              </div>
              <div class="stat-text">
                <h3>¥{{ orderStats.totalIncome.toFixed(2) }}</h3>
                <p>总收入</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-item">
            <div class="stat-content">
              <div class="stat-icon avg-delivery">
                <i class="el-icon-data-analysis"></i>
              </div>
              <div class="stat-text">
                <h3>{{ orderStats.avgDeliveryTime }}分钟</h3>
                <p>平均时长</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <el-card class="orders-card">
      <div slot="header">
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-right">
            <el-button :type="showMap ? 'primary' : 'default'" size="mini" @click="toggleMapView">
              <i class="el-icon-map-location"></i>
              {{ showMap ? '列表视图' : '地图视图' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="!showMap" class="orders-list">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
          :class="getOrderCardClass(order)"
          @click="handleOrderClick(order)"
        >
          <div class="order-header">
            <div class="order-main-info">
              <div class="order-title">
                <span class="order-no">#{{ order.orderNo }}</span>
                <el-tag :type="getOrderTypeTag(order.type)">
                  {{ getOrderTypeText(order.type) }}
                </el-tag>
              </div>
              <div class="order-time">{{ order.createTime }}</div>
            </div>
            <div class="order-status">
              <el-tag :type="getStatusTagType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
          </div>

          <div class="order-content">
            <div class="address-info">
              <div class="pickup-address">
                <div class="address-icon pickup">
                  <i class="el-icon-location-outline"></i>
                </div>
                <div class="address-text">
                  <label>取货地址</label>
                  <p>{{ order.pickupAddress }}</p>
                </div>
              </div>
              <div class="delivery-address">
                <div class="address-icon delivery">
                  <i class="el-icon-location-outline"></i>
                </div>
                <div class="address-text">
                  <label>送达地址</label>
                  <p>{{ order.deliveryAddress }}</p>
                </div>
              </div>
            </div>

            <div class="order-details">
              <div class="detail-item">
                <label>配送费</label>
                <span class="fee">¥{{ order.fee }}</span>
              </div>
              <div class="detail-item">
                <label>距离</label>
                <span>{{ order.distance }}km</span>
              </div>
              <div class="detail-item">
                <label>预计时长</label>
                <span>{{ order.estimatedTime }}</span>
              </div>
              <div class="detail-item" v-if="order.actualTime">
                <label>实际时长</label>
                <span>{{ order.actualTime }}</span>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <el-button-group>
              <el-button
                v-if="order.status === 'pending'"
                type="primary"
                size="mini"
                @click.stop="acceptOrder(order)"
              >
                接单
              </el-button>
              <el-button
                v-if="order.status === 'accepted'"
                type="warning"
                size="mini"
                @click.stop="startPicking(order)"
              >
                开始取货
              </el-button>
              <el-button
                v-if="order.status === 'picking'"
                type="primary"
                size="mini"
                @click.stop="startDelivering(order)"
              >
                开始配送
              </el-button>
              <el-button
                v-if="order.status === 'delivering'"
                type="success"
                size="mini"
                @click.stop="completeOrder(order)"
              >
                完成配送
              </el-button>
              <el-button type="info" size="mini" @click.stop="viewOrderDetail(order)">
                详情
              </el-button>
              <el-button type="warning" size="mini" @click.stop="contactCustomer(order)">
                联系顾客
              </el-button>
            </el-button-group>
          </div>

          <div class="order-footer" v-if="order.notes">
            <div class="notes">
              <i class="el-icon-chat-dot-round"></i>
              <span>{{ order.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 地图视图 -->
      <div v-else class="map-view">
        <div class="map-container">
          <!-- 这里应该集成地图组件，显示订单位置 -->
          <div class="map-placeholder">
            <i class="el-icon-map-location"></i>
            <p>地图视图开发中...</p>
          </div>
        </div>
        <div class="map-orders-list">
          <div
            v-for="order in activeOrdersOnMap"
            :key="order.id"
            class="map-order-item"
            :class="{ active: selectedMapOrder && selectedMapOrder.id === order.id }"
            @click="selectMapOrder(order)"
          >
            <div class="map-order-header">
              <span class="order-no">#{{ order.orderNo }}</span>
              <el-tag :type="getStatusTagType(order.status)" size="mini">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
            <div class="map-order-info">
              <p><strong>取:</strong> {{ order.pickupAddress }}</p>
              <p><strong>送:</strong> {{ order.deliveryAddress }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="!showMap">
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

    <!-- 订单详情对话框 -->
    <el-dialog
      :title="`订单详情 - ${selectedOrder && selectedOrder.orderNo}`"
      v-model="orderDetailVisible"
      width="80%"
    >
      <OrderDetail v-if="orderDetailVisible" :order="selectedOrder" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderDetail from './OrderDetail.vue'

// TypeScript接口定义
interface Order {
  id: number | string
  orderNo: string
  type: 'takeout' | 'pickup' | 'buy'
  status: 'pending' | 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled'
  pickupAddress: string
  deliveryAddress: string
  fee: number
  distance: number
  estimatedTime: string
  createTime: string
  actualTime?: string
  deliveryTime?: string
  notes?: string
  customerPhone?: string
}

interface OrderStats {
  total: number
  pending: number
  processing: number
  completed: number
  totalIncome: number
  avgDeliveryTime: number
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface FilterForm {
  status: string
  type: string
  dateRange: Date[]
}

// 响应式数据
const showMap = ref(false)
const selectedMapOrder = ref<Order | null>(null)

const filterForm = reactive<FilterForm>({
  status: '',
  type: '',
  dateRange: [],
})

const orderStats = reactive<OrderStats>({
  total: 156,
  pending: 3,
  processing: 2,
  completed: 145,
  totalIncome: 1245.8,
  avgDeliveryTime: 18,
})

const pagination = reactive<Pagination>({
  page: 1,
  pageSize: 20,
  total: 156,
})

const orders = reactive<Order[]>([
  {
    id: 1,
    orderNo: 'TK2024011510001',
    type: 'takeout',
    status: 'pending',
    pickupAddress: '老北京炸酱面 - 东门分店',
    deliveryAddress: '东北校区第一宿舍楼A座101',
    fee: 4.5,
    distance: 1.2,
    estimatedTime: '15分钟',
    createTime: '2024-01-15 14:30:25',
  },
  {
    id: 2,
    orderNo: 'TK2024011510002',
    type: 'pickup',
    status: 'accepted',
    pickupAddress: '学校南门快递柜',
    deliveryAddress: '西南校区第二宿舍楼C座302',
    fee: 3.0,
    distance: 2.1,
    estimatedTime: '20分钟',
    createTime: '2024-01-15 13:45:12',
    notes: '易碎物品，请小心配送',
  },
  {
    id: 3,
    orderNo: 'TK2024011510003',
    type: 'buy',
    status: 'picking',
    pickupAddress: '学校超市',
    deliveryAddress: '行政楼人事部',
    fee: 5.0,
    distance: 0.8,
    estimatedTime: '10分钟',
    createTime: '2024-01-15 12:20:33',
  },
  {
    id: 4,
    orderNo: 'TK2024011510004',
    type: 'takeout',
    status: 'delivering',
    pickupAddress: '川香麻辣烫',
    deliveryAddress: '东北校区第三宿舍楼B座205',
    fee: 4.5,
    distance: 1.5,
    estimatedTime: '18分钟',
    createTime: '2024-01-15 11:15:20',
    actualTime: '16分钟',
  },
  {
    id: 5,
    orderNo: 'TK2024011510005',
    type: 'pickup',
    status: 'completed',
    pickupAddress: '韵达快递点',
    deliveryAddress: '东北校区第二宿舍楼A座401',
    fee: 3.0,
    distance: 1.8,
    estimatedTime: '15分钟',
    actualTime: '12分钟',
    createTime: '2024-01-15 10:30:15',
    deliveryTime: '2024-01-15 10:42:15',
  },
])

const selectedOrder = ref<Order | null>(null)
const orderDetailVisible = ref(false)

// 计算属性
const filteredOrders = computed(() => {
  let result = [...orders]

  if (filterForm.status) {
    result = result.filter(order => order.status === filterForm.status)
  }

  if (filterForm.type) {
    result = result.filter(order => order.type === filterForm.type)
  }

  // 日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.dateRange
    result = result.filter(order => {
      const orderDate = new Date(order.createTime.split(' ')[0])
      return orderDate >= startDate && orderDate <= endDate
    })
  }

  return result
})

const activeOrdersOnMap = computed(() => {
  return orders.filter(order =>
    ['pending', 'accepted', 'picking', 'delivering'].includes(order.status)
  )
})

// 方法
const refreshOrders = () => {
  ElMessage.success('订单已刷新')
  // 实际应用中这里会重新获取订单数据
}

const handleFilterChange = () => {
  pagination.page = 1
}

const resetFilter = () => {
  filterForm.status = ''
  filterForm.type = ''
  filterForm.dateRange = []
  pagination.page = 1
}

const toggleMapView = () => {
  showMap.value = !showMap.value
}

const selectMapOrder = (order: Order) => {
  selectedMapOrder.value = order
}

const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.page = 1
}

const handleCurrentChange = (newPage: number) => {
  pagination.page = newPage
}

const acceptOrder = (order: Order) => {
  ElMessageBox.confirm(`确认接取订单 ${order.orderNo} 吗？`, '确认接单', {
    confirmButtonText: '确认接单',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    order.status = 'accepted'
    ElMessage.success(`已接取订单 ${order.orderNo}`)
    updateOrderStats()
  })
}

const startPicking = (order: Order) => {
  order.status = 'picking'
  ElMessage.success(`已开始取货 - 订单 ${order.orderNo}`)
}

const startDelivering = (order: Order) => {
  order.status = 'delivering'
  ElMessage.success(`已开始配送 - 订单 ${order.orderNo}`)
}

const completeOrder = (order: Order) => {
  order.status = 'completed'
  order.deliveryTime = formatDateTime(new Date())
  order.actualTime = calculateActualTime(order.createTime, order.deliveryTime)
  ElMessage.success(`订单 ${order.orderNo} 已完成配送！`)
  updateOrderStats()
}

const viewOrderDetail = (order: Order) => {
  selectedOrder.value = order
  orderDetailVisible.value = true
}

const contactCustomer = (order: Order) => {
  ElMessage.info(`联系顾客：${order.customerPhone || '联系信息保密'}`)
}

const handleOrderClick = (order: Order) => {
  viewOrderDetail(order)
}

const getOrderCardClass = (order: Order) => {
  return {
    'order-pending': order.status === 'pending',
    'order-accepted': order.status === 'accepted',
    'order-picking': order.status === 'picking',
    'order-delivering': order.status === 'delivering',
    'order-completed': order.status === 'completed',
  }
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

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const calculateActualTime = (startTime: string, endTime: string): string => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  return `${diffMinutes}分钟`
}

const updateOrderStats = () => {
  // 更新统计数据
  const completed = orders.filter(o => o.status === 'completed').length
  const pending = orders.filter(o => o.status === 'pending').length
  const processing = orders.filter(o =>
    ['accepted', 'picking', 'delivering'].includes(o.status)
  ).length

  orderStats.completed = completed
  orderStats.pending = pending
  orderStats.processing = processing
  orderStats.total = orders.length
}
</script>

<style scoped>
.courier-orders {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.filter-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.filter-form {
  margin-bottom: 0;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-item {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.processing {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.income {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.avg-delivery {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-text h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.stat-text p {
  margin: 2px 0 0 0;
  color: #606266;
  font-size: 12px;
}

.orders-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-card {
  border: 2px solid #ebeef5;
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.order-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.order-pending {
  border-left: 5px solid #e6a23c;
}

.order-accepted {
  border-left: 5px solid #409eff;
}

.order-picking {
  border-left: 5px solid #909399;
}

.order-delivering {
  border-left: 5px solid #f56c6c;
}

.order-completed {
  border-left: 5px solid #67c23a;
  opacity: 0.8;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.order-main-info {
  flex: 1;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.order-no {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.order-time {
  color: #909399;
  font-size: 12px;
}

.address-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.pickup-address,
.delivery-address {
  display: flex;
  align-items: flex-start;
}

.address-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  color: white;
  font-size: 14px;
}

.address-icon.pickup {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.address-icon.delivery {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.address-text label {
  display: block;
  font-size: 12px;
  color: #606266;
  margin-bottom: 2px;
}

.address-text p {
  margin: 0;
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
}

.order-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.detail-item label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.detail-item span {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.fee {
  color: #67c23a !important;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.order-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

.notes {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 12px;
}

.notes i {
  margin-right: 5px;
  color: #409eff;
}

.map-view {
  display: flex;
  height: 500px;
}

.map-container {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: #909399;
}

.map-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.map-orders-list {
  width: 300px;
  overflow-y: auto;
}

.map-order-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-order-item:hover {
  background: #f8f9fa;
}

.map-order-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.map-order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.map-order-header .order-no {
  font-weight: bold;
  font-size: 14px;
}

.map-order-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #606266;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
