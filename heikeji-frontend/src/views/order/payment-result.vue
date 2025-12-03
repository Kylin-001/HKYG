<template>
  <div class="payment-result-container">
    <!-- 结果状态区域 -->
    <div class="result-status-section">
      <div class="result-icon" :class="resultStatusClass">
        <el-icon :size="80">
          <i v-if="paymentStatus === 'success'" class="el-icon-circle-check"></i>
          <i v-else-if="paymentStatus === 'pending'" class="el-icon-loading"></i>
          <i v-else class="el-icon-circle-close"></i>
        </el-icon>
      </div>

      <div class="result-message">
        <h1>{{ resultTitle }}</h1>
        <p class="result-subtitle">{{ resultSubtitle }}</p>
        <p class="order-number" v-if="orderInfo">订单号：{{ orderInfo.orderNo }}</p>
        <p class="payment-amount" v-if="orderInfo">
          支付金额：¥{{ orderInfo.actualAmount?.toFixed(2) || '0.00' }}
        </p>
      </div>
    </div>

    <!-- 订单信息卡片 -->
    <el-card v-if="orderInfo" class="order-info-card">
      <div slot="header" class="card-header">
        <span><i class="el-icon-document"></i> 订单信息</span>
      </div>

      <div class="order-info-content">
        <!-- 商品概览 -->
        <div class="info-section">
          <h4><i class="el-icon-shopping-cart-2"></i> 商品信息</h4>
          <div class="product-overview">
            <div v-for="(item, index) in displayedItems" :key="index" class="product-item">
              <el-image
                v-if="item.productImage"
                :src="item.productImage"
                fit="cover"
                style="width: 60px; height: 60px"
              ></el-image>
              <div class="product-details">
                <div class="product-name">{{ item.productName }}</div>
                <div v-if="item.skuAttributes" class="product-spec">{{ item.skuAttributes }}</div>
                <div class="product-quantity-price">
                  <span>×{{ item.quantity }}</span>
                  <span>¥{{ item.price?.toFixed(2) || '0.00' }}</span>
                </div>
              </div>
            </div>
            <div v-if="hiddenItemsCount > 0" class="more-items">
              还有{{ hiddenItemsCount }}件商品
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="info-section">
          <h4><i class="el-icon-money"></i> 支付信息</h4>
          <div class="payment-info">
            <div class="info-row">
              <span>支付方式：</span>
              <span>{{ orderInfo.paymentInfo?.paymentMethodText || '待支付' }}</span>
            </div>
            <div class="info-row">
              <span>交易流水：</span>
              <span>{{ orderInfo.paymentInfo?.transactionId || '-' }}</span>
            </div>
            <div class="info-row">
              <span>支付时间：</span>
              <span>{{
                orderInfo.paymentTime ? formatDateTime(orderInfo.paymentTime) : '未支付'
              }}</span>
            </div>
          </div>
        </div>

        <!-- 订单状态跟踪 -->
        <div v-if="paymentStatus === 'success'" class="info-section">
          <h4><i class="el-icon-time"></i> 订单进度</h4>
          <div class="order-timeline">
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">支付成功</p>
                <p class="timeline-time">
                  {{
                    orderInfo.paymentTime
                      ? formatDateTime(orderInfo.paymentTime)
                      : formatDateTime(new Date())
                  }}
                </p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 2 }">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">商家备货</p>
                <p class="timeline-time">
                  {{ orderInfo.shipTime ? formatDateTime(orderInfo.shipTime) : '待发货' }}
                </p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 3 }">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <p class="timeline-title">商品配送</p>
                <p class="timeline-time">
                  {{ orderInfo.shipTime ? formatDateTime(orderInfo.shipTime) : '待发货' }}
                </p>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: orderInfo.orderStatus >= 4 }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <p class="timeline-title">订单完成</p>
                <p class="timeline-time">
                  {{ orderInfo.completeTime ? formatDateTime(orderInfo.completeTime) : '待完成' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button
        v-if="paymentStatus === 'success'"
        type="primary"
        @click="viewOrderDetail"
        size="large"
        icon="el-icon-view"
      >
        查看订单详情
      </el-button>
      <el-button
        v-if="paymentStatus === 'pending' || paymentStatus === 'failed'"
        type="primary"
        @click="goToPayment"
        size="large"
        icon="el-icon-reload"
      >
        {{ paymentStatus === 'pending' ? '继续支付' : '重新支付' }}
      </el-button>
      <el-button
        v-if="paymentStatus === 'failed'"
        @click="contactService"
        size="large"
        icon="el-icon-headset"
      >
        联系客服
      </el-button>
      <el-button @click="continueShopping" size="large" icon="el-icon-shopping-cart-2">
        继续购物
      </el-button>
    </div>

    <!-- 温馨提示 -->
    <el-card class="tips-card">
      <div slot="header" class="card-header">
        <span><i class="el-icon-info-filled"></i> 温馨提示</span>
      </div>
      <div class="tips-content">
        <ul>
          <li v-if="paymentStatus === 'success'">支付成功！我们将尽快为您发货，请耐心等待</li>
          <li v-if="paymentStatus === 'pending'">
            您的支付尚未完成，请尽快完成支付，超时订单将自动取消
          </li>
          <li v-if="paymentStatus === 'failed'">支付失败！建议检查支付账户余额或网络连接后重试</li>
          <li>如有疑问，请联系客服：400-888-9999</li>
          <li>订单支付成功后，您可以在订单详情页面查看实时物流信息</li>
          <li>请妥善保管订单号，以便查询订单状态</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
// 导入日志工具
import logger from '@/utils/logger'
import notificationService from '@/utils/notification-service'

export default {
  name: 'PaymentResultPage',
  data() {
    return {
      loading: true,
      orderInfo: null,
      orderId: '',
      paymentStatus: 'pending', // success, failed, pending
      errorMessage: '',
    }
  },

  computed: {
    // 结果标题
    resultTitle() {
      const titles = {
        success: '支付成功！',
        failed: '支付失败',
        pending: '等待支付',
      }
      return titles[this.paymentStatus] || '支付处理中'
    },

    // 结果副标题
    resultSubtitle() {
      const subtitles = {
        success: '感谢您的购买，我们将尽快为您发货',
        failed: this.errorMessage || '请稍后重试或选择其他支付方式',
        pending: '请尽快完成支付，以确保订单正常处理',
      }
      return subtitles[this.paymentStatus] || '支付正在处理中...'
    },

    // 结果图标样式类
    resultStatusClass() {
      const classes = {
        success: 'success',
        failed: 'failed',
        pending: 'pending',
      }
      return classes[this.paymentStatus] || ''
    },

    // 显示的商品项（最多显示3个）
    displayedItems() {
      if (!this.orderInfo || !this.orderInfo.orderItems) return []
      return this.orderInfo.orderItems.slice(0, 3)
    },

    // 隐藏的商品数量
    hiddenItemsCount() {
      if (!this.orderInfo || !this.orderInfo.orderItems) return 0
      return Math.max(0, this.orderInfo.orderItems.length - 3)
    },
  },

  mounted() {
    // 获取订单ID和支付状态
    this.orderId = this.$route.params.id || this.$route.query.id
    this.paymentStatus = this.$route.query.status || 'pending'
    this.errorMessage = this.$route.query.message || ''

    // 如果有订单ID，获取订单详情
    if (this.orderId) {
      this.fetchOrderDetail()
    } else {
      this.loading = false
    }
  },

  methods: {
    // 获取订单详情
    async fetchOrderDetail() {
      this.loading = true
      try {
        this.orderInfo = await this.$store.dispatch('order/getOrderDetail', this.orderId)

        // 根据订单状态更新支付状态
        if (this.orderInfo.orderStatus === 1) {
          this.paymentStatus = 'pending'
        } else if (this.orderInfo.orderStatus >= 2) {
          this.paymentStatus = 'success'
          // 发送支付成功通知
          notificationService.sendPaymentSuccessNotification({
            orderId: this.orderId,
            amount: this.orderInfo.actualAmount,
            paymentMethod: this.orderInfo.paymentInfo?.paymentMethodText,
            paymentTime: this.orderInfo.paymentTime,
          })
        }

        // 发送订单状态变更通知
        this.handleOrderStatusChange(this.paymentStatus)
      } catch (error) {
        logger.error('获取订单详情失败', error)
        this.errorMessage = '获取订单信息失败'
        this.loading = false
      } finally {
        this.loading = false
      }
    },

    /**
     * 处理订单状态变更并发送通知
     * @param {string} newStatus - 新的订单状态
     */
    handleOrderStatusChange(newStatus) {
      const statusTextMap = {
        success: '支付成功',
        failed: '支付失败',
        pending: '等待支付',
      }

      notificationService.sendOrderStatusChangeNotification({
        orderId: this.orderId,
        status: statusTextMap[newStatus] || newStatus,
        orderInfo: this.orderInfo,
      })
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '--'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },

    // 查看订单详情
    viewOrderDetail() {
      this.$router.push(`/order/detail/${this.orderId}`)
    },

    // 前往支付页面
    goToPayment() {
      this.$router.push(`/order/payment/${this.orderId}`)
    },

    // 联系客服
    contactService() {
      this.$message.info('正在为您转接客服，请稍候...')
      // 这里可以添加联系客服的逻辑，比如打开客服聊天窗口
      // 发送客服联系通知
      notificationService.sendServiceContactNotification({
        orderId: this.orderId,
        userId: this.$store.state.user?.id,
        contactTime: new Date(),
      })
    },

    // 继续购物
    continueShopping() {
      // 判断是否是外卖订单，如果是则返回外卖商家列表，否则返回首页
      if (this.orderInfo && this.orderInfo.orderType === 'takeout') {
        this.$router.push('/takeout/merchantList')
      } else {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style scoped>
.payment-result-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

/* 结果状态区域 */
.result-status-section {
  text-align: center;
  padding: 40px 0;
  margin-bottom: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.result-icon {
  margin-bottom: 20px;
  animation: scaleIn 0.6s ease-out;
}

.result-icon.success .el-icon {
  color: #52c41a;
}

.result-icon.failed .el-icon {
  color: #f56c6c;
}

.result-icon.pending .el-icon {
  color: #e6a23c;
  animation: rotate 2s linear infinite;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.result-message h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #303133;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.result-subtitle {
  font-size: 16px;
  color: #606266;
  margin-bottom: 15px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.order-number,
.payment-amount {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.payment-amount {
  font-size: 18px;
  font-weight: bold;
  color: #e6a23c;
  margin-top: 10px;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 订单信息卡片 */
.order-info-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #303133;
}

.card-header i {
  color: #409eff;
}

.order-info-content {
  padding: 0;
}

.info-section {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.info-section:last-child {
  border-bottom: none;
}

.info-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.info-section h4 i {
  color: #409eff;
}

/* 商品概览 */
.product-overview {
  max-height: 200px;
  overflow: hidden;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  margin-left: 15px;
}

.product-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.product-quantity-price {
  display: flex;
  justify-content: space-between;
  color: #606266;
}

.more-items {
  text-align: center;
  padding: 10px;
  color: #909399;
  font-size: 14px;
}

/* 支付信息 */
.payment-info .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #606266;
}

.payment-info .info-row:last-child {
  margin-bottom: 0;
}

/* 订单进度时间线 */
.order-timeline {
  position: relative;
  padding: 10px 0;
}

.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 25px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 8px;
  top: 5px;
  width: 12px;
  height: 12px;
  background-color: #dcdfe6;
  border-radius: 50%;
  transition: all 0.3s;
}

.timeline-line {
  position: absolute;
  left: 13px;
  top: 20px;
  width: 2px;
  height: calc(100% + 10px);
  background-color: #dcdfe6;
  transition: all 0.3s;
}

.timeline-item.active .timeline-dot {
  background-color: #409eff;
}

.timeline-item.active .timeline-line {
  background-color: #409eff;
}

.timeline-content {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s;
}

.timeline-item.active .timeline-content {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.timeline-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}

.timeline-time {
  font-size: 12px;
  color: #909399;
}

/* 操作按钮区域 */
.action-buttons {
  margin-bottom: 30px;
  text-align: center;
  animation: fadeInUp 0.8s ease-out 1s both;
}

.action-buttons .el-button {
  margin: 0 8px;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 25px;
}

.action-buttons .el-button--primary {
  background: linear-gradient(45deg, #409eff, #36c1fc);
  border: none;
}

.action-buttons .el-button--primary:hover {
  background: linear-gradient(45deg, #36c1fc, #409eff);
}

/* 温馨提示 */
.tips-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out 1.2s both;
}

.tips-content ul {
  margin: 0;
  padding-left: 20px;
}

.tips-content li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}

.tips-content li:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .payment-result-container {
    padding: 15px;
  }

  .result-message h1 {
    font-size: 24px;
  }

  .action-buttons .el-button {
    display: block;
    width: 100%;
    margin: 8px 0;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .product-details {
    margin-left: 0;
    width: 100%;
  }

  .product-quantity-price {
    justify-content: flex-start;
    gap: 20px;
  }
}
</style>
