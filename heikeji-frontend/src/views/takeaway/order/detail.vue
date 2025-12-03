<template>
  <div class="order-detail-page">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="goBack" class="back-btn"></el-button>
      <h1>订单详情</h1>
      <div class="placeholder"></div>
    </div>

    <!-- 订单状态 -->
    <div class="section status-section">
      <div class="status-icon" :class="getStatusIconClass(orderStatus)">
        <el-icon>
          <component :is="getStatusIcon(orderStatus)" />
        </el-icon>
      </div>
      <div class="status-info">
        <div class="status-text">{{ getStatusText(orderStatus) }}</div>
        <div class="status-desc">{{ statusDescription }}</div>
      </div>
    </div>

    <!-- 配送信息 -->
    <div class="section delivery-section">
      <div class="delivery-header">
        <el-icon>
          <Location />
        </el-icon>
        <span class="header-title">配送信息</span>
      </div>
      <div class="delivery-content">
        <div class="recipient-info">
          <span class="recipient-name">{{ orderInfo.recipientName }}</span>
          <span class="recipient-phone">{{ orderInfo.recipientPhone }}</span>
        </div>
        <div class="recipient-address">{{ orderInfo.deliveryAddress }}</div>
        <div class="delivery-time">预计送达时间：{{ estimatedDeliveryTime }}</div>
      </div>
    </div>

    <!-- 商家信息 -->
    <div class="section merchant-section">
      <div class="merchant-header">
        <el-icon>
          <ShoppingBag />
        </el-icon>
        <span class="header-title">商家信息</span>
      </div>
      <div class="merchant-content">
        <div class="merchant-name">{{ orderInfo.merchantName }}</div>
        <div class="order-number">订单编号：{{ orderInfo.orderNo }}</div>
        <div class="order-time">下单时间：{{ formatDate(orderInfo.createTime) }}</div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="section items-section">
      <div class="items-header">
        <el-icon>
          <Goods />
        </el-icon>
        <span class="header-title">商品信息</span>
      </div>
      <div class="items-content">
        <div v-for="item in orderInfo.items" :key="item.productId" class="order-item">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-price-quantity">
            <span class="item-price">¥{{ item.price }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 费用明细 -->
    <div class="section price-section">
      <div class="price-header">
        <el-icon>
          <Document />
        </el-icon>
        <span class="header-title">费用明细</span>
      </div>
      <div class="price-content">
        <div class="price-row">
          <span>商品金额</span>
          <span>¥{{ orderInfo.subtotal.toFixed(2) }}</span>
        </div>
        <div class="price-row">
          <span>配送费</span>
          <span>¥{{ orderInfo.deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="price-row">
          <span>优惠</span>
          <span class="discount">-¥{{ orderInfo.discount.toFixed(2) }}</span>
        </div>
        <div class="price-row total-row">
          <span>实付金额</span>
          <span class="total-price">¥{{ orderInfo.totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 订单备注 -->
    <div class="section remark-section" v-if="orderInfo.remark">
      <div class="remark-header">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span class="header-title">订单备注</span>
      </div>
      <div class="remark-content">{{ orderInfo.remark }}</div>
    </div>

    <!-- 底部操作栏 -->
    <div class="order-actions" v-if="showActions">
      <div class="action-buttons">
        <el-button
          v-if="orderStatus === 'pending_payment'"
          type="default"
          class="action-btn cancel-btn"
          @click="cancelOrder"
        >
          取消订单
        </el-button>
        <el-button
          v-if="orderStatus === 'pending_payment'"
          type="primary"
          class="action-btn pay-btn"
          @click="payOrder"
        >
          去支付
        </el-button>
        <el-button
          v-if="orderStatus === 'delivered'"
          type="primary"
          class="action-btn confirm-btn"
          @click="confirmReceipt"
        >
          确认收货
        </el-button>
        <el-button
          v-if="orderStatus === 'completed'"
          type="default"
          class="action-btn review-btn"
          @click="reviewOrder"
        >
          评价订单
        </el-button>
        <el-button v-if="canRebuy" type="default" class="action-btn rebuy-btn" @click="rebuy">
          再来一单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Location,
  ShoppingBag,
  Goods,
  Document,
  ChatDotRound,
  Time,
  Success,
  Loading,
  Truck,
  Bell,
  CircleCheck,
  CircleClose,
  Help,
} from '@element-plus/icons-vue'

interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
}

interface OrderInfo {
  orderNo: string
  merchantName: string
  recipientName: string
  recipientPhone: string
  deliveryAddress: string
  createTime: string
  subtotal: number
  deliveryFee: number
  discount: number
  totalPrice: number
  remark: string
  items: OrderItem[]
}

// 路由相关
const route = useRoute()
const router = useRouter()

// 状态管理
const orderId = ref('')
const orderStatus = ref('pending_payment') // pending_payment, paid, preparing, delivering, delivered, completed, cancelled
const statusDescription = ref('商家正在确认订单，请耐心等待')
const estimatedDeliveryTime = ref('')

const orderInfo = reactive<OrderInfo>({
  orderNo: '',
  merchantName: '',
  recipientName: '',
  recipientPhone: '',
  deliveryAddress: '',
  createTime: '',
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  totalPrice: 0,
  remark: '',
  items: [],
})

// 计算属性
const showActions = computed(() => {
  return ['pending_payment', 'delivered', 'completed', 'cancelled'].includes(orderStatus.value)
})

const canRebuy = computed(() => {
  return ['completed', 'cancelled'].includes(orderStatus.value)
})

// 生命周期钩子
onMounted(() => {
  orderId.value = route.params.id as string
  loadOrderDetail()
})

// 加载订单详情
const loadOrderDetail = () => {
  // 模拟数据，实际应该调用API
  setTimeout(() => {
    const mockDate = new Date()
    const orderTime = mockDate.toISOString()

    // 计算预计送达时间（当前时间+30分钟）
    const deliveryDate = new Date(mockDate.getTime() + 30 * 60 * 1000)
    estimatedDeliveryTime.value = `${deliveryDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${deliveryDate.getMinutes().toString().padStart(2, '0')}`

    Object.assign(orderInfo, {
      orderNo: `TK${Date.now().toString().slice(-8)}`,
      merchantName: '校园美食城',
      recipientName: '张三',
      recipientPhone: '138****8000',
      deliveryAddress: '学生公寓A栋101室',
      createTime: orderTime,
      subtotal: 40,
      deliveryFee: 5,
      discount: 0,
      totalPrice: 45,
      remark: '多放辣，谢谢',
      items: [
        { productId: 1, productName: '宫保鸡丁盖饭', price: 18, quantity: 1 },
        { productId: 2, productName: '鱼香肉丝盖饭', price: 16, quantity: 1 },
        { productId: 9, productName: '可乐', price: 3, quantity: 2 },
      ],
    })
  }, 500)
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending_payment: '待支付',
    paid: '已支付',
    preparing: '商家准备中',
    delivering: '配送中',
    delivered: '已送达',
    completed: '订单完成',
    cancelled: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 获取状态图标
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, any> = {
    pending_payment: Time,
    paid: Success,
    preparing: Loading,
    delivering: Truck,
    delivered: Bell,
    completed: CircleCheck,
    cancelled: CircleClose,
  }
  return iconMap[status] || Help
}

// 获取状态图标样式
const getStatusIconClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending_payment: 'status-warning',
    paid: 'status-info',
    preparing: 'status-info',
    delivering: 'status-info',
    delivered: 'status-warning',
    completed: 'status-success',
    cancelled: 'status-danger',
  }
  return classMap[status] || ''
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 取消订单
const cancelOrder = () => {
  ElMessageBox.confirm('确定要取消订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        orderStatus.value = 'cancelled'
        statusDescription.value = '订单已取消'
        ElMessage.success('订单已取消')
      }, 500)
    })
    .catch(() => {
      // 取消操作
    })
}

// 支付订单
const payOrder = () => {
  ElMessage.success('跳转到支付页面')
  // 模拟支付成功
  setTimeout(() => {
    orderStatus.value = 'paid'
    statusDescription.value = '支付成功，商家正在准备中'
  }, 1000)
}

// 确认收货
const confirmReceipt = () => {
  ElMessageBox.confirm('确认已收到商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
  })
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        orderStatus.value = 'completed'
        statusDescription.value = '订单已完成，感谢您的购买'
        ElMessage.success('已确认收货')
      }, 500)
    })
    .catch(() => {
      // 取消操作
    })
}

// 评价订单
const reviewOrder = () => {
  ElMessage.success('跳转到评价页面')
}

// 再来一单
const rebuy = () => {
  // 将订单商品添加到购物车
  const merchantId = '1' // 假设商家ID为1
  const cartItems: Record<string, any> = {}

  orderInfo.items.forEach(item => {
    cartItems[item.productId] = {
      id: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
    }
  })

  // 保存到本地存储
  localStorage.setItem(`takeout_cart_${merchantId}`, JSON.stringify(cartItems))

  ElMessage.success('已将商品添加到购物车')
  // 跳转到商家页面
  router.push(`/takeaway/merchant/${merchantId}`)
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 70px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  padding: 5px;
}

.page-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 40px;
}

.section {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
}

/* 订单状态样式 */
.status-section {
  display: flex;
  align-items: center;
  padding: 20px 15px;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-right: 15px;
}

.status-warning {
  background-color: #fff3cd;
  color: #ff6b00;
}

.status-info {
  background-color: #d1ecf1;
  color: #1890ff;
}

.status-success {
  background-color: #d4edda;
  color: #52c41a;
}

.status-danger {
  background-color: #f8d7da;
  color: #f5222d;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.status-desc {
  color: #666;
  font-size: 14px;
}

/* 通用头部样式 */
.delivery-header,
.merchant-header,
.items-header,
.price-header,
.remark-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
}

.header-title {
  margin-left: 5px;
  font-weight: 500;
}

/* 配送信息样式 */
.delivery-content {
  padding-left: 25px;
}

.recipient-info {
  margin-bottom: 8px;
}

.recipient-name {
  font-weight: 600;
  margin-right: 15px;
}

.recipient-address {
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}

.delivery-time {
  color: #666;
  font-size: 14px;
}

/* 商家信息样式 */
.merchant-content {
  padding-left: 25px;
}

.merchant-name {
  font-weight: 600;
  margin-bottom: 8px;
}

.order-number,
.order-time {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

/* 商品信息样式 */
.items-content {
  padding-left: 25px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-name {
  flex: 1;
}

.item-price-quantity {
  display: flex;
  align-items: center;
}

.item-price {
  margin-right: 10px;
  color: #ff6b00;
}

/* 费用明细样式 */
.price-content {
  padding-left: 25px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.discount {
  color: #ff6b00;
}

.total-row {
  font-weight: 600;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.total-price {
  font-size: 16px;
  color: #ff6b00;
}

/* 备注样式 */
.remark-content {
  padding-left: 25px;
  color: #666;
}

/* 底部操作栏样式 */
.order-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  min-width: 90px;
}
</style>
