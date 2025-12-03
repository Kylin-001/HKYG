<template>
  <div class="order-detail" v-if="order">
    <el-row :gutter="20">
      <!-- 订单基本信息 -->
      <el-col :span="14">
        <el-card class="info-card">
          <div slot="header">
            <span>订单信息</span>
            <el-tag :type="getStatusTagType(order.status)" style="float: right">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>

          <div class="order-info">
            <el-form :model="order" label-width="100px">
              <el-form-item label="订单号">
                <span class="order-no">{{ order.orderNo }}</span>
              </el-form-item>
              <el-form-item label="订单类型">
                <el-tag :type="getOrderTypeTag(order.type)">
                  {{ getOrderTypeText(order.type) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="创建时间">
                {{ order.createTime }}
              </el-form-item>
              <el-form-item label="配送费">
                <span class="fee">¥{{ order.fee }}</span>
              </el-form-item>
              <el-form-item label="距离"> {{ order.distance }}km </el-form-item>
              <el-form-item label="预计时长">
                {{ order.estimatedTime }}
              </el-form-item>
              <el-form-item label="实际时长" v-if="order.actualTime">
                {{ order.actualTime }}
              </el-form-item>
              <el-form-item label="完成时间" v-if="order.deliveryTime">
                {{ order.deliveryTime }}
              </el-form-item>
              <el-form-item label="订单备注" v-if="order.notes">
                <div class="notes">{{ order.notes }}</div>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <!-- 地址信息 -->
        <el-card class="address-card">
          <div slot="header">
            <span>地址信息</span>
          </div>

          <div class="address-section">
            <div class="address-item pickup">
              <div class="address-icon">
                <i class="el-icon-location-outline"></i>
              </div>
              <div class="address-content">
                <h4>取货地址</h4>
                <p>{{ order.pickupAddress }}</p>
                <p v-if="order.pickupContact">联系人：{{ order.pickupContact }}</p>
                <p v-if="order.pickupPhone">电话：{{ order.pickupPhone }}</p>
                <div class="address-actions">
                  <el-button size="mini" type="primary" @click="openMaps('pickup')">
                    <i class="el-icon-map-location"></i>
                    导航
                  </el-button>
                  <el-button
                    size="mini"
                    @click="callPhone(order.pickupPhone)"
                    v-if="order.pickupPhone"
                  >
                    <i class="el-icon-phone"></i>
                    拨打电话
                  </el-button>
                </div>
              </div>
            </div>

            <div class="address-arrow">
              <i class="el-icon-arrow-down"></i>
            </div>

            <div class="address-item delivery">
              <div class="address-icon">
                <i class="el-icon-location-outline"></i>
              </div>
              <div class="address-content">
                <h4>送达地址</h4>
                <p>{{ order.deliveryAddress }}</p>
                <p v-if="order.deliveryContact">联系人：{{ order.deliveryContact }}</p>
                <p v-if="order.deliveryPhone">电话：{{ order.deliveryPhone }}</p>
                <div class="address-actions">
                  <el-button size="mini" type="primary" @click="openMaps('delivery')">
                    <i class="el-icon-map-location"></i>
                    导航
                  </el-button>
                  <el-button
                    size="mini"
                    @click="callPhone(order.deliveryPhone)"
                    v-if="order.deliveryPhone"
                  >
                    <i class="el-icon-phone"></i>
                    拨打电话
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 订单商品详情（外卖订单） -->
        <el-card class="products-card" v-if="order.type === 'takeout' && order.products">
          <div slot="header">
            <span>商品详情</span>
          </div>

          <div class="products-list">
            <div v-for="product in order.products" :key="product.id" class="product-item">
              <div class="product-info">
                <img :src="product.image" class="product-image" />
                <div class="product-details">
                  <h5>{{ product.name }}</h5>
                  <p>{{ product.specifications }}</p>
                  <p>数量：{{ product.quantity }}</p>
                </div>
              </div>
              <div class="product-price">¥{{ product.price }}</div>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>商品总价</span>
              <span>¥{{ order.subtotal }}</span>
            </div>
            <div class="summary-row">
              <span>配送费</span>
              <span>¥{{ order.fee }}</span>
            </div>
            <div class="summary-row total">
              <span>订单总价</span>
              <span>¥{{ order.total }}</span>
            </div>
          </div>
        </el-card>

        <!-- 配送状态跟踪 -->
        <el-card class="timeline-card">
          <div slot="header">
            <span>配送状态</span>
          </div>

          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in orderStatusTimeline"
              :key="index"
              :timestamp="item.time"
              :type="item.type"
              :icon="item.icon"
            >
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :span="10">
        <!-- 操作面板 -->
        <el-card class="action-card">
          <div slot="header">
            <span>操作面板</span>
          </div>

          <div class="action-buttons">
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              size="large"
              block
              @click="acceptOrder"
            >
              <i class="el-icon-check"></i>
              接取订单
            </el-button>

            <el-button
              v-if="order.status === 'accepted'"
              type="warning"
              size="large"
              block
              @click="startPicking"
            >
              <i class="el-icon-truck"></i>
              开始取货
            </el-button>

            <el-button
              v-if="order.status === 'picking'"
              type="primary"
              size="large"
              block
              @click="startDelivering"
            >
              <i class="el-icon-truck"></i>
              开始配送
            </el-button>

            <el-button
              v-if="order.status === 'delivering'"
              type="success"
              size="large"
              block
              @click="completeOrder"
            >
              <i class="el-icon-check"></i>
              完成配送
            </el-button>

            <el-button
              v-if="['accepted', 'picking', 'delivering'].includes(order.status)"
              type="danger"
              size="large"
              block
              @click="cancelOrder"
            >
              <i class="el-icon-close"></i>
              取消订单
            </el-button>
          </div>
        </el-card>

        <!-- 客户信息 -->
        <el-card class="customer-card" v-if="order.customerInfo">
          <div slot="header">
            <span>客户信息</span>
          </div>

          <div class="customer-info">
            <div class="customer-avatar">
              <el-avatar :size="60" :src="order.customerInfo.avatar">
                <i class="el-icon-user-solid"></i>
              </el-avatar>
            </div>
            <div class="customer-details">
              <h4>{{ order.customerInfo.name }}</h4>
              <p>{{ order.customerInfo.phone }}</p>
              <div class="customer-stats">
                <el-rate
                  v-model="order.customerInfo.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}分"
                  :max="5"
                >
                </el-rate>
              </div>
            </div>
          </div>

          <div class="customer-actions">
            <el-button size="small" type="primary" @click="callPhone(order.deliveryPhone)">
              <i class="el-icon-phone"></i>
              联系客户
            </el-button>
            <el-button size="small" @click="sendMessage(order.customerInfo.phone)">
              <i class="el-icon-chat-dot-round"></i>
              发送消息
            </el-button>
          </div>
        </el-card>

        <!-- 商家信息 -->
        <el-card class="merchant-card" v-if="order.merchantInfo">
          <div slot="header">
            <span>商家信息</span>
          </div>

          <div class="merchant-info">
            <h4>{{ order.merchantInfo.name }}</h4>
            <p><i class="el-icon-location-outline"></i> {{ order.merchantInfo.address }}</p>
            <p><i class="el-icon-phone"></i> {{ order.merchantInfo.phone }}</p>
            <div class="merchant-rating">
              <el-rate
                v-model="order.merchantInfo.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}分"
                :max="5"
              >
              </el-rate>
            </div>
          </div>

          <div class="merchant-actions">
            <el-button size="small" type="primary" @click="callPhone(order.pickupPhone)">
              <i class="el-icon-phone"></i>
              联系商家
            </el-button>
            <el-button size="small" @click="openMaps('pickup')">
              <i class="el-icon-map-location"></i>
              导航到商家
            </el-button>
          </div>
        </el-card>

        <!-- 配送路线 -->
        <el-card class="route-card">
          <div slot="header">
            <span>配送路线</span>
          </div>

          <div class="route-info">
            <div class="route-summary">
              <div class="route-item">
                <label>总距离</label>
                <span>{{ order.distance }}km</span>
              </div>
              <div class="route-item">
                <label>预计时间</label>
                <span>{{ order.estimatedTime }}</span>
              </div>
              <div class="route-item">
                <label>配送费</label>
                <span class="fee">¥{{ order.fee }}</span>
              </div>
            </div>

            <div class="route-actions">
              <el-button type="primary" block @click="startNavigation">
                <i class="el-icon-map-location"></i>
                开始导航
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// TypeScript接口定义
interface Product {
  id: string
  name: string
  image: string
  specifications: string
  quantity: number
  price: number
}

interface CustomerInfo {
  name: string
  phone: string
  avatar: string
  rating: number
}

interface MerchantInfo {
  name: string
  phone: string
  address: string
  rating: number
}

interface Order {
  id: string
  orderNo: string
  type: 'takeout' | 'pickup' | 'buy'
  status: 'pending' | 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled'
  createTime: string
  fee: number
  distance: number
  estimatedTime: string
  actualTime?: string
  deliveryTime?: string
  notes?: string
  pickupAddress: string
  pickupContact?: string
  pickupPhone?: string
  deliveryAddress: string
  deliveryContact?: string
  deliveryPhone?: string
  acceptedTime?: string
  pickingStartTime?: string
  deliveringStartTime?: string
  customerInfo?: CustomerInfo
  merchantInfo?: MerchantInfo
  products?: Product[]
  subtotal?: number
  total?: number
}

interface TimelineItem {
  title: string
  description: string
  time: string
  type: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  icon: string
}

// 定义Props
const props = defineProps<{
  order: Order
}>()

// 定义Emits
const emit = defineEmits<{
  'status-change': [status: 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled']
}>()

// 计算属性
const orderStatusTimeline = computed<TimelineItem[]>(() => {
  const timeline: TimelineItem[] = []

  // 订单创建
  timeline.push({
    title: '订单创建',
    description: '订单已创建，等待配送员接取',
    time: props.order.createTime,
    type: 'primary',
    icon: 'el-icon-document',
  })

  // 根据订单状态添加后续状态
  if (props.order.status !== 'pending') {
    timeline.push({
      title: '订单已接取',
      description: '配送员已接取订单',
      time: props.order.acceptedTime || '2024-01-15 14:35:00',
      type: 'success',
      icon: 'el-icon-check',
    })
  }

  if (['picking', 'delivering', 'completed'].includes(props.order.status)) {
    timeline.push({
      title: '开始取货',
      description: '配送员已开始取货',
      time: props.order.pickingStartTime || '2024-01-15 14:45:00',
      type: 'warning',
      icon: 'el-icon-truck',
    })
  }

  if (['delivering', 'completed'].includes(props.order.status)) {
    timeline.push({
      title: '开始配送',
      description: '配送员已开始配送',
      time: props.order.deliveringStartTime || '2024-01-15 15:00:00',
      type: 'info',
      icon: 'el-icon-truck',
    })
  }

  if (props.order.status === 'completed') {
    timeline.push({
      title: '配送完成',
      description: '订单已成功配送完成',
      time: props.order.deliveryTime || '2024-01-15 15:16:00',
      type: 'success',
      icon: 'el-icon-check',
    })
  }

  return timeline
})

// 方法
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

const acceptOrder = () => {
  ElMessageBox.confirm('确认接取此订单吗？', '确认接单', {
    confirmButtonText: '确认接单',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    emit('status-change', 'accepted')
    ElMessage.success('订单已接取')
  })
}

const startPicking = () => {
  emit('status-change', 'picking')
  ElMessage.success('已开始取货')
}

const startDelivering = () => {
  emit('status-change', 'delivering')
  ElMessage.success('已开始配送')
}

const completeOrder = () => {
  ElMessageBox.confirm('确认已完成配送吗？', '确认完成', {
    confirmButtonText: '确认完成',
    cancelButtonText: '取消',
    type: 'success',
  }).then(() => {
    emit('status-change', 'completed')
    ElMessage.success('配送完成！')
  })
}

const cancelOrder = () => {
  ElMessageBox.confirm('确认取消此订单吗？', '取消订单', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'warning',
  }).then(() => {
    emit('status-change', 'cancelled')
    ElMessage.info('订单已取消')
  })
}

const openMaps = (type: 'pickup' | 'delivery') => {
  const address = type === 'pickup' ? props.order.pickupAddress : props.order.deliveryAddress
  ElMessage.info(`打开地图导航到：${address}`)
}

const callPhone = (phone?: string) => {
  if (phone) {
    ElMessage.info(`拨打：${phone}`)
  }
}

const sendMessage = (phone?: string) => {
  if (phone) {
    ElMessage.info(`发送消息到：${phone}`)
  }
}

const startNavigation = () => {
  ElMessage.info('开始导航...')
}
</script>

<style scoped>
.order-detail {
  padding: 10px;
}

.info-card,
.address-card,
.products-card,
.timeline-card,
.action-card,
.customer-card,
.merchant-card,
.route-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.order-info .order-no {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.order-info .fee {
  font-size: 16px;
  font-weight: bold;
  color: #67c23a;
}

.order-info .notes {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  border-left: 4px solid #409eff;
  color: #606266;
  line-height: 1.5;
}

.address-section {
  padding: 10px 0;
}

.address-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.address-item.pickup {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #667eea;
}

.address-item.delivery {
  background: linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%);
  border-left: 4px solid #f5576c;
}

.address-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.address-content h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.address-content p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.address-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.address-arrow {
  text-align: center;
  color: #909399;
  font-size: 24px;
  margin: -10px 0;
}

.products-list {
  margin-bottom: 15px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
}

.product-details h5 {
  margin: 0 0 5px 0;
  color: #303133;
}

.product-details p {
  margin: 2px 0;
  color: #606266;
  font-size: 12px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #67c23a;
}

.order-summary {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #606266;
}

.summary-row.total {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  border-top: 1px solid #ebeef5;
  padding-top: 8px;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.customer-info,
.merchant-info {
  text-align: center;
  margin-bottom: 15px;
}

.customer-avatar {
  margin-bottom: 10px;
}

.customer-details h4,
.merchant-info h4 {
  margin: 8px 0 5px 0;
  color: #303133;
}

.customer-details p,
.merchant-info p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.customer-stats,
.merchant-rating {
  margin-top: 10px;
}

.customer-actions,
.merchant-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.route-summary {
  margin-bottom: 15px;
}

.route-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.route-item:last-child {
  border-bottom: none;
}

.route-item label {
  color: #606266;
  font-size: 14px;
}

.route-item span {
  color: #303133;
  font-weight: bold;
}

.route-item .fee {
  color: #67c23a;
}

.route-actions {
  margin-top: 15px;
}
</style>
