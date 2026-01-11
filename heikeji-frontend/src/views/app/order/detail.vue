<template>
  <div class="order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="header-title">订单详情</div>
        <div class="header-right"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <i class="el-icon-error"></i>
      <div class="error-message">{{ error }}</div>
      <el-button type="primary" @click="loadOrderDetail">重新加载</el-button>
    </div>

    <!-- 订单内容 -->
    <div v-else>
      <!-- 订单状态 -->
      <div class="order-status-section">
        <div class="status-content">
          <div class="status-text">{{ getStatusText(orderInfo.status) }}</div>
          <div class="status-desc">{{ getStatusDesc(orderInfo.status) }}</div>
        </div>
        <div class="status-progress">
          <div
            v-for="(step, index) in statusSteps"
            :key="step.status"
            class="progress-step"
            :class="{
              'step-done': orderInfo.status >= step.status,
              'step-active': orderInfo.status === step.status,
              'step-current': index === currentStepIndex,
            }"
          >
            <div class="step-circle">
              <i v-if="orderInfo.status >= step.status" class="el-icon-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-text">{{ step.text }}</div>
            <div v-if="index < statusSteps.length - 1" class="step-line"></div>
          </div>
        </div>
      </div>

      <!-- 异常订单处理 -->
      <div v-if="isExceptionOrder" class="exception-section">
        <div class="exception-header">
          <i class="el-icon-warning"></i>
          <span class="exception-title">订单异常</span>
        </div>
        <div class="exception-content">
          <div class="exception-reason">{{ exceptionReason }}</div>
          <div class="exception-actions">
            <el-button
              type="danger"
              @click="handleOrderException('cancel')"
              :loading="exceptionHandling"
            >
              取消订单
            </el-button>
            <el-button
              type="warning"
              @click="handleOrderException('refund')"
              :loading="exceptionHandling"
            >
              申请退款
            </el-button>
            <el-button
              type="primary"
              @click="handleOrderException('retry')"
              :loading="exceptionHandling"
            >
              重试处理
            </el-button>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-info-section">
        <div class="section-title">订单信息</div>
        <div class="info-item">
          <span class="info-label">订单编号</span>
          <span class="info-value">{{ orderInfo.orderSn }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">下单时间</span>
          <span class="info-value">{{ orderInfo.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">支付方式</span>
          <span class="info-value">{{ orderInfo.paymentMethod }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">支付时间</span>
          <span class="info-value">{{ orderInfo.paymentTime || '未支付' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">发货时间</span>
          <span class="info-value">{{ orderInfo.shippingTime || '未发货' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">完成时间</span>
          <span class="info-value">{{ orderInfo.completeTime || '未完成' }}</span>
        </div>
      </div>

      <!-- 收货信息 -->
      <div class="address-section">
        <div class="section-title">收货信息</div>
        <div class="address-content">
          <div class="address-header">
            <span class="consignee">{{ orderInfo.address.consignee }}</span>
            <span class="phone">{{ orderInfo.address.phone }}</span>
          </div>
          <div class="address-text">
            {{ orderInfo.address.province }}{{ orderInfo.address.city
            }}{{ orderInfo.address.district }}{{ orderInfo.address.detail }}
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="goods-section">
        <div class="section-title">商品信息</div>
        <div class="goods-list">
          <div v-for="item in orderInfo.items" :key="item.id" class="goods-item">
            <div class="goods-image">
              <img
                v-lazy="item.mainImage || '/static/images/default-product.png'"
                :alt="item.productName"
              />
            </div>
            <div class="goods-info">
              <div class="goods-name">{{ item.productName }}</div>
              <div class="goods-spec">{{ item.specification }}</div>
              <div class="goods-price">¥{{ item.price }}</div>
            </div>
            <div class="goods-quantity">x{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <!-- 物流信息 -->
      <div v-if="orderInfo.status >= 20" class="logistics-section">
        <div class="section-title">物流信息</div>
        <div v-if="logisticsInfo.length > 0" class="logistics-list">
          <div
            v-for="(log, index) in logisticsInfo"
            :key="index"
            class="logistics-item"
            :class="{ 'first-item': index === 0 }"
          >
            <div class="logistics-time">{{ log.time }}</div>
            <div class="logistics-content">{{ log.content }}</div>
          </div>
        </div>
        <div v-else class="no-logistics">
          <i class="el-icon-truck"></i>
          <span>暂无物流信息</span>
        </div>
      </div>

      <!-- 订单日志 -->
      <div class="logs-section">
        <div class="section-title">订单日志</div>
        <div v-if="logsLoading" class="logs-loading">
          <el-loading-spinner></el-loading-spinner>
          <span>正在加载...</span>
        </div>
        <div v-else-if="orderLogs.length > 0" class="logs-list">
          <div v-for="(log, index) in orderLogs" :key="index" class="log-item">
            <div class="log-time">{{ log.createTime }}</div>
            <div class="log-content">{{ log.content }}</div>
            <div class="log-operator" v-if="log.operator">操作人：{{ log.operator }}</div>
          </div>
        </div>
        <div v-else class="no-logs">
          <i class="el-icon-document"></i>
          <span>暂无订单日志</span>
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="price-section">
        <div class="section-title">价格明细</div>
        <div class="price-item">
          <span class="price-label">商品总价</span>
          <span class="price-value">¥{{ orderInfo.totalAmount }}</span>
        </div>
        <div class="price-item">
          <span class="price-label">运费</span>
          <span class="price-value">{{
            orderInfo.deliveryFee > 0 ? '¥' + orderInfo.deliveryFee : '免费'
          }}</span>
        </div>
        <div class="price-item">
          <span class="price-label">优惠金额</span>
          <span class="price-value discount">-¥{{ orderInfo.discountAmount }}</span>
        </div>
        <div class="price-item total">
          <span class="price-label">实付金额</span>
          <span class="price-value total-price">¥{{ orderInfo.payAmount }}</span>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="action-bar" v-if="showActionBar">
        <div class="action-buttons">
          <button v-if="orderInfo.status === 10" class="action-btn cancel-btn" @click="cancelOrder">
            取消订单
          </button>
          <button v-if="orderInfo.status === 10" class="action-btn pay-btn" @click="goToPay">
            立即支付
          </button>
          <button v-if="orderInfo.status === 20" class="action-btn remind-btn" @click="remindShip">
            提醒发货
          </button>
          <button
            v-if="orderInfo.status === 30"
            class="action-btn confirm-btn"
            @click="confirmReceipt"
          >
            确认收货
          </button>
          <button
            v-if="orderInfo.status === 40"
            class="action-btn evaluate-btn"
            @click="goToEvaluate"
          >
            去评价
          </button>
          <button v-if="orderInfo.status === 50" class="action-btn again-btn" @click="buyAgain">
            再次购买
          </button>
          <button class="action-btn contact-btn" @click="contactSeller">联系卖家</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderDetail,
  cancelOrder as cancelOrderApi,
  confirmReceipt as confirmReceiptApi,
  remindShip as remindShipApi,
  getOrderLogistics,
  getOrderLogs,
  handleExceptionOrder,
} from '@/api/app/order'

// 初始化路由
const router = useRouter()
const route = useRoute()

// 接受props传递的id，用于测试
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})

// 订单ID，优先使用props.id，否则从路由获取
const orderId = ref(props.id || route.params.id || '')

// 加载状态
const loading = ref(true)
const logisticsLoading = ref(false)
const error = ref('')

// 订单信息
const orderInfo = ref({
  id: 0,
  orderSn: '',
  status: 0,
  createTime: '',
  paymentTime: '',
  shippingTime: '',
  completeTime: '',
  paymentMethod: '',
  totalAmount: 0,
  deliveryFee: 0,
  discountAmount: 0,
  payAmount: 0,
  address: {
    consignee: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
  },
  items: [],
})

// 物流信息
const logisticsInfo = ref([])

// 订单日志
const orderLogs = ref([])
const logsLoading = ref(false)

// 异常订单相关
const isExceptionOrder = ref(false)
const exceptionReason = ref('')
const exceptionHandling = ref(false)

// 状态步骤
const statusSteps = [
  { status: 10, text: '待付款' },
  { status: 20, text: '待发货' },
  { status: 30, text: '待收货' },
  { status: 40, text: '待评价' },
  { status: 50, text: '已完成' },
]

// 当前步骤索引
const currentStepIndex = computed(() => {
  const index = statusSteps.findIndex(step => step.status === orderInfo.value.status)
  return index >= 0 ? index : 0
})

// 是否显示操作栏
const showActionBar = computed(() => {
  return [10, 20, 30, 40, 50].includes(orderInfo.value.status)
})

// 根据状态获取状态文本
const getStatusText = (status: number) => {
  const statusMap = {
    10: '待付款',
    20: '待发货',
    30: '待收货',
    40: '待评价',
    50: '已完成',
    60: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 根据状态获取状态描述
const getStatusDesc = (status: number) => {
  const descMap = {
    10: '请在30分钟内完成支付，超时订单将自动取消',
    20: '商家正在处理您的订单',
    30: '商品已发货，请注意查收',
    40: '商品已签收，期待您的评价',
    50: '订单已完成，感谢您的购买',
    60: '订单已取消',
  }
  return descMap[status] || ''
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 取消订单
const cancelOrder = () => {
  ElMessageBox.confirm('确定要取消订单吗？', '取消订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true
      try {
        await cancelOrderApi(orderId.value)
        ElMessage.success('订单取消成功')
        await loadOrderDetail() // 重新加载订单详情
      } catch (err: any) {
        ElMessage.error(err.message || '订单取消失败')
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 去支付
const goToPay = () => {
  router.push(`/app/payment?orderId=${orderId.value}`)
}

// 提醒发货
const remindShip = async () => {
  try {
    await remindShipApi(orderId.value)
    ElMessage.success('提醒发货成功')
  } catch (err: any) {
    ElMessage.error(err.message || '提醒发货失败')
  }
}

// 确认收货
const confirmReceipt = () => {
  ElMessageBox.confirm('确定要确认收货吗？', '确认收货', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true
      try {
        await confirmReceiptApi(orderId.value)
        ElMessage.success('确认收货成功')
        await loadOrderDetail() // 重新加载订单详情
      } catch (err: any) {
        ElMessage.error(err.message || '确认收货失败')
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 去评价
const goToEvaluate = () => {
  router.push(`/app/order/evaluate/${orderId.value}`)
}

// 再次购买
const buyAgain = () => {
  ElMessage.info('再次购买功能开发中')
}

// 联系卖家
const contactSeller = () => {
  ElMessage.info('联系卖家功能开发中')
}

// 加载订单详情
const loadOrderDetail = async () => {
  if (!orderId.value) {
    error.value = '订单ID无效'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await getOrderDetail(orderId.value)
    orderInfo.value = response.data

    // 检测订单是否异常
    checkOrderException()

    // 加载订单日志
    loadOrderLogs()

    // 如果订单状态大于等于20（已发货），加载物流信息
    if (orderInfo.value.status >= 20) {
      loadLogisticsInfo()
    }
  } catch (err: any) {
    error.value = err.message || '加载订单详情失败'
  } finally {
    loading.value = false
  }
}

// 检测订单是否异常
const checkOrderException = () => {
  // 根据订单状态和其他条件判断订单是否异常
  // 例如：支付超时、发货超时、库存不足等
  const exceptionStatuses = [15, 25, 35] // 假设这些状态代表异常状态
  isExceptionOrder.value = exceptionStatuses.includes(orderInfo.value.status)

  // 设置异常原因
  if (isExceptionOrder.value) {
    const exceptionReasons = {
      15: '支付超时',
      25: '发货超时',
      35: '库存不足',
    }
    exceptionReason.value = exceptionReasons[orderInfo.value.status] || '订单异常'
  }
}

// 处理异常订单
const handleOrderException = async (type: string) => {
  try {
    exceptionHandling.value = true
    let reason = ''

    // 根据处理类型获取处理原因
    if (type === 'cancel') {
      reason = await ElMessageBox.prompt('请输入取消原因', '取消订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入取消原因',
        inputValidator: value => {
          if (!value.trim()) {
            return '取消原因不能为空'
          }
        },
      })
      reason = reason.value
    } else if (type === 'refund') {
      reason = await ElMessageBox.prompt('请输入退款原因', '退款处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入退款原因',
        inputValidator: value => {
          if (!value.trim()) {
            return '退款原因不能为空'
          }
        },
      })
      reason = reason.value
    }

    // 调用API处理异常订单
    await handleExceptionOrder(orderId.value, type, reason)

    ElMessage.success('异常订单处理成功')

    // 重新加载订单详情
    await loadOrderDetail()
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '处理失败')
    }
  } finally {
    exceptionHandling.value = false
  }
}

// 加载订单日志
const loadOrderLogs = async () => {
  if (!orderId.value) return

  logsLoading.value = true

  try {
    const response = await getOrderLogs(orderId.value)
    orderLogs.value = response.data || []
  } catch (err: any) {
    console.error('加载订单日志失败:', err)
    // 订单日志加载失败不影响订单详情的显示
  } finally {
    logsLoading.value = false
  }
}

// 加载物流信息
const loadLogisticsInfo = async () => {
  if (!orderId.value) return

  logisticsLoading.value = true

  try {
    const response = await getOrderLogistics(orderId.value)
    logisticsInfo.value = response.data || []
  } catch (err: any) {
    console.error('加载物流信息失败:', err)
    // 物流信息加载失败不显示错误，只显示暂无物流信息
  } finally {
    logisticsLoading.value = false
  }
}

// 订单状态轮询定时器
let statusPollingTimer = null

// 组件挂载时加载订单详情
onMounted(() => {
  loadOrderDetail()
  // 启动订单状态轮询
  startStatusPolling()
})

// 组件卸载时清理资源
onUnmounted(() => {
  // 停止订单状态轮询
  stopStatusPolling()
})

// 启动订单状态轮询
const startStatusPolling = () => {
  // 只有在特定状态下才需要轮询
  const needPollingStatuses = [10, 20, 30]
  if (needPollingStatuses.includes(orderInfo.value.status)) {
    // 每30秒轮询一次订单状态
    statusPollingTimer = setInterval(() => {
      pollOrderStatus()
    }, 30000)
  }
}

// 停止订单状态轮询
const stopStatusPolling = () => {
  if (statusPollingTimer) {
    clearInterval(statusPollingTimer)
    statusPollingTimer = null
  }
}

// 轮询订单状态
const pollOrderStatus = async () => {
  try {
    const response = await getOrderDetail(orderId.value)
    const oldStatus = orderInfo.value.status
    const newStatus = response.data.status

    // 如果订单状态发生变化
    if (oldStatus !== newStatus) {
      // 更新订单信息
      orderInfo.value = response.data

      // 显示状态变更通知
      showStatusChangeNotification(oldStatus, newStatus)

      // 如果状态变化后不再需要轮询，停止轮询
      const needPollingStatuses = [10, 20, 30]
      if (!needPollingStatuses.includes(newStatus)) {
        stopStatusPolling()
      }

      // 如果订单已发货，加载物流信息
      if (newStatus >= 20 && oldStatus < 20) {
        loadLogisticsInfo()
      }
    }
  } catch (error) {
    console.error('轮询订单状态失败:', error)
  }
}

// 显示状态变更通知
const showStatusChangeNotification = (oldStatus, newStatus) => {
  const oldStatusText = getStatusText(oldStatus)
  const newStatusText = getStatusText(newStatus)
  ElMessage({
    message: `订单状态已从 "${oldStatusText}" 更新为 "${newStatusText}"`,
    type: 'success',
    duration: 5000,
  })
}
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 加载状态 */
.loading-container {
  padding: 20px;
  background-color: #fff;
  margin: 8px;
  border-radius: 8px;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: #fff;
  margin: 8px;
  border-radius: 8px;
}

.error-container i {
  font-size: 48px;
  color: #f56c6c;
  margin-bottom: 16px;
}

.error-message {
  font-size: 16px;
  color: #606266;
  margin-bottom: 24px;
}

/* 物流信息加载状态 */
.logistics-loading {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left,
.header-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 订单状态区域 */
.order-status-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 8px;
}

.status-content {
  text-align: center;
  margin-bottom: 24px;
}

.status-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 14px;
  color: #999;
}

.status-progress {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step-text {
  font-size: 12px;
  color: #999;
}

.step-line {
  position: absolute;
  top: 12px;
  left: 50%;
  width: calc(100% - 24px);
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

/* 状态样式 */
.step-done .step-circle {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}

.step-done .step-text {
  color: #67c23a;
}

.step-done .step-line {
  background-color: #67c23a;
}

.step-active .step-circle {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.step-active .step-text {
  color: #409eff;
}

.step-current .step-text {
  font-weight: bold;
}

/* 通用区域样式 */
.order-info-section,
.address-section,
.goods-section,
.logistics-section,
.price-section {
  background-color: #fff;
  margin-bottom: 8px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

/* 订单信息区域 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

/* 收货地址区域 */
.address-content {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 8px;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.consignee {
  font-weight: bold;
  margin-right: 16px;
}

.phone {
  color: #666;
}

.address-text {
  color: #333;
  line-height: 1.5;
}

/* 商品列表区域 */
.goods-list {
  background-color: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-image {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.goods-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.goods-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.goods-quantity {
  font-size: 14px;
  color: #666;
}

/* 物流信息区域 */
.logistics-list {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 12px;
}

.logistics-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 20px;
}

.logistics-item:last-child {
  border-bottom: none;
}

.logistics-item::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
}

.logistics-item.first-item::before {
  width: 12px;
  height: 12px;
  left: 4px;
  top: 14px;
}

.logistics-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.logistics-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.no-logistics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.no-logistics i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* 异常订单区域 */
.exception-section {
  background-color: #fff3f3;
  margin-bottom: 8px;
  padding: 16px;
  border: 1px solid #ffccc7;
  border-radius: 8px;
}

.exception-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.exception-header i {
  color: #f56c6c;
  font-size: 20px;
  margin-right: 8px;
}

.exception-title {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.exception-content {
  margin-left: 28px;
}

.exception-reason {
  color: #e6a23c;
  margin-bottom: 16px;
  font-size: 14px;
}

.exception-actions {
  display: flex;
  gap: 8px;
}

.exception-actions .el-button {
  padding: 6px 12px;
  font-size: 12px;
}

/* 订单日志区域 */
.logs-section {
  background-color: #fff;
  margin-bottom: 8px;
  padding: 16px;
}

.logs-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  color: #999;
}

.logs-loading span {
  margin-left: 8px;
}

.logs-list {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 12px;
}

.log-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 20px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
}

.log-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.log-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 4px;
}

.log-operator {
  font-size: 12px;
  color: #666;
}

.no-logs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.no-logs i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* 价格信息区域 */
.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.price-label {
  color: #666;
}

.price-value {
  color: #333;
}

.price-value.discount {
  color: #f56c6c;
}

.price-item.total {
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  padding-top: 16px;
}

.price-item.total .price-label {
  font-weight: bold;
}

.price-value.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 56px;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 10px 16px;
  z-index: 1000;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
}

.action-btn {
  padding: 0 16px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.cancel-btn {
  color: #909399;
  border-color: #dcdfe6;
}

.pay-btn {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.pay-btn:hover {
  background-color: #f78989;
  border-color: #f78989;
  color: #fff;
}

.confirm-btn {
  color: #409eff;
  border-color: #409eff;
}

.evaluate-btn {
  color: #67c23a;
  border-color: #67c23a;
}

.again-btn {
  color: #e6a23c;
  border-color: #e6a23c;
}

.contact-btn {
  color: #909399;
  border-color: #dcdfe6;
}
</style>
