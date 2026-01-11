<template>
  <div class="payment-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="header-title">订单支付</div>
        <div class="header-right"></div>
      </div>
    </div>

    <!-- 支付状态提示 -->
    <div v-if="paymentStatus" class="payment-status-tip" :class="paymentStatus.toLowerCase()">
      <i :class="getStatusIcon(paymentStatus)"></i>
      <span>{{ getStatusText(paymentStatus) }}</span>
    </div>

    <!-- 订单信息 -->
    <div class="order-info-section" v-if="orderInfo">
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
        <span class="info-label">应付金额</span>
        <span class="info-value total-price">¥{{ orderInfo.payAmount }}</span>
      </div>
    </div>

    <!-- 支付方式选择 -->
    <div class="payment-methods-section">
      <div class="section-title">选择支付方式</div>
      <div class="methods-list">
        <div
          v-for="method in availablePaymentMethods"
          :key="method.id"
          class="method-item"
          :class="{ active: selectedPaymentMethod === method.id }"
          @click="selectPaymentMethod(method.id)"
        >
          <div class="method-icon">
            <i :class="getPaymentIcon(method.id)"></i>
          </div>
          <div class="method-info">
            <div class="method-name">{{ method.name }}</div>
            <div class="method-desc">{{ method.desc }}</div>
          </div>
          <div class="method-select">
            <el-radio v-model="selectedPaymentMethod" :label="method.id" border></el-radio>
          </div>
        </div>
      </div>
    </div>

    <!-- 余额支付密码输入 -->
    <div v-if="selectedPaymentMethod === 'BALANCE'" class="balance-password-section">
      <div class="section-title">支付密码</div>
      <div class="password-input">
        <el-input
          v-model="balancePassword"
          type="password"
          placeholder="请输入支付密码"
          show-password
        ></el-input>
      </div>
    </div>

    <!-- 支付按钮 -->
    <div class="action-section">
      <div class="total-amount">
        <span class="amount-label">实付金额：</span>
        <span class="amount-value">¥{{ orderInfo?.payAmount || 0 }}</span>
      </div>
      <el-button
        type="primary"
        :loading="processingPayment"
        :disabled="!selectedPaymentMethod || processingPayment"
        @click="handlePayment"
        class="pay-button"
      >
        {{ processingPayment ? '处理中...' : '立即支付' }}
      </el-button>
    </div>

    <!-- 微信支付二维码 -->
    <div v-if="wechatPayInfo" class="wechat-qrcode-section">
      <div class="qrcode-title">微信支付</div>
      <div class="qrcode-content">
        <img :src="wechatPayInfo.qrcode" alt="微信支付二维码" class="qrcode-image" />
        <div class="qrcode-desc">请使用微信扫描二维码支付</div>
      </div>
      <div class="polling-status" v-if="pollingPayment">
        <el-icon class="el-icon-loading"></el-icon>
        <span>正在查询支付结果...</span>
      </div>
    </div>

    <!-- 支付宝支付二维码 -->
    <div v-if="alipayInfo" class="alipay-qrcode-section">
      <div class="qrcode-title">支付宝支付</div>
      <div class="qrcode-content">
        <img :src="alipayInfo.qrcode" alt="支付宝支付二维码" class="qrcode-image" />
        <div class="qrcode-desc">请使用支付宝扫描二维码支付</div>
      </div>
      <div class="polling-status" v-if="pollingPayment">
        <el-icon class="el-icon-loading"></el-icon>
        <span>正在查询支付结果...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/app/order'
import { getAvailablePaymentMethods, createPayment, pollPaymentResult } from '@/api/app/payment'

// 初始化路由
const router = useRouter()
const route = useRoute()

// 订单ID
const orderId = ref(route.query.orderId || '')

// 加载状态
const loading = ref(true)
const processingPayment = ref(false)
const pollingPayment = ref(false)
const error = ref('')

// 订单信息
const orderInfo = ref<any>(null)

// 支付方式相关
const availablePaymentMethods = ref([
  { id: 'WECHAT_PAY', name: '微信支付', desc: '微信安全支付' },
  { id: 'ALIPAY', name: '支付宝', desc: '支付宝安全支付' },
  { id: 'BALANCE', name: '余额支付', desc: '使用账户余额支付' },
])
const selectedPaymentMethod = ref('WECHAT_PAY')
const balancePassword = ref('')

// 支付结果相关
const paymentStatus = ref('')
const wechatPayInfo = ref<any>(null)
const alipayInfo = ref<any>(null)

// 获取支付状态图标
const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    SUCCESS: 'el-icon-circle-check success',
    FAIL: 'el-icon-circle-close fail',
    PROCESSING: 'el-icon-loading processing',
  }
  return icons[status] || 'el-icon-question'
}

// 获取支付状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    SUCCESS: '支付成功',
    FAIL: '支付失败',
    PROCESSING: '支付处理中',
  }
  return texts[status] || '未知状态'
}

// 获取支付方式图标
const getPaymentIcon = (methodId: string) => {
  const icons: Record<string, string> = {
    WECHAT_PAY: 'el-icon-chat-dot-round wechat',
    ALIPAY: 'el-icon-connection alipay',
    BALANCE: 'el-icon-wallet balance',
  }
  return icons[methodId] || 'el-icon-question'
}

// 选择支付方式
const selectPaymentMethod = (methodId: string) => {
  selectedPaymentMethod.value = methodId
  // 重置支付结果
  paymentStatus.value = ''
  wechatPayInfo.value = null
  alipayInfo.value = null
}

// 加载订单信息
const loadOrderInfo = async () => {
  if (!orderId.value) {
    error.value = '订单ID无效'
    loading.value = false
    return
  }

  try {
    // 获取订单详情
    const orderResponse = await getOrderDetail(orderId.value)
    orderInfo.value = orderResponse.data

    // 获取可用支付方式
    const methodsResponse = await getAvailablePaymentMethods(orderId.value)
    if (methodsResponse.data && methodsResponse.data.length > 0) {
      availablePaymentMethods.value = methodsResponse.data
      selectedPaymentMethod.value = methodsResponse.data[0].id
    }
  } catch (err: any) {
    error.value = err.message || '加载订单信息失败'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 处理支付
const handlePayment = async () => {
  if (!orderId.value) {
    ElMessage.error('订单ID无效')
    return
  }

  if (!selectedPaymentMethod.value) {
    ElMessage.error('请选择支付方式')
    return
  }

  // 余额支付需要验证密码
  if (selectedPaymentMethod.value === 'BALANCE' && !balancePassword.value) {
    ElMessage.error('请输入支付密码')
    return
  }

  processingPayment.value = true
  error.value = ''

  try {
    // 创建支付订单
    const paymentData = {
      orderId: orderId.value,
      paymentMethod: selectedPaymentMethod.value,
      amount: orderInfo.value?.payAmount || 0,
      password: balancePassword.value,
    }

    const response = await createPayment(paymentData)

    // 根据支付方式处理不同的支付流程
    if (selectedPaymentMethod.value === 'WECHAT_PAY') {
      // 微信支付 - 显示二维码
      wechatPayInfo.value = response.data
      startPollingPayment()
    } else if (selectedPaymentMethod.value === 'ALIPAY') {
      // 支付宝支付 - 显示二维码
      alipayInfo.value = response.data
      startPollingPayment()
    } else if (selectedPaymentMethod.value === 'BALANCE') {
      // 余额支付 - 直接处理结果
      handlePaymentResult(response)
    }
  } catch (err: any) {
    error.value = err.message || '创建支付订单失败'
    ElMessage.error(error.value)
    processingPayment.value = false
  }
}

// 开始轮询支付结果
const startPollingPayment = async () => {
  pollingPayment.value = true

  try {
    const result = await pollPaymentResult(orderId.value)
    handlePaymentResult(result)
  } catch (err: any) {
    ElMessage.error('支付超时，请检查订单状态')
    pollingPayment.value = false
    processingPayment.value = false
  }
}

// 处理支付结果
const handlePaymentResult = (result: any) => {
  pollingPayment.value = false
  processingPayment.value = false

  if (result.status === 'SUCCESS') {
    paymentStatus.value = 'SUCCESS'
    ElMessage.success('支付成功')

    // 支付成功后跳转到订单详情页
    setTimeout(() => {
      router.push(`/app/order/detail/${orderId.value}`)
    }, 2000)
  } else if (result.status === 'FAIL') {
    paymentStatus.value = 'FAIL'
    ElMessage.error(`支付失败：${result.message || '未知错误'}`)
  } else {
    paymentStatus.value = 'PROCESSING'
    ElMessage.warning('支付处理中，请稍后查看订单状态')
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrderInfo()
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 20px;
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

/* 支付状态提示 */
.payment-status-tip {
  background-color: #fff;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.payment-status-tip i {
  margin-right: 8px;
  font-size: 20px;
}

.payment-status-tip.success {
  color: #67c23a;
}

.payment-status-tip.fail {
  color: #f56c6c;
}

.payment-status-tip.processing {
  color: #409eff;
}

/* 通用区域样式 */
.order-info-section,
.payment-methods-section,
.balance-password-section {
  background-color: #fff;
  margin: 8px;
  padding: 16px;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

/* 订单信息 */
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

.info-value.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

/* 支付方式选择 */
.methods-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-item:hover {
  border-color: #409eff;
}

.method-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.method-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.method-icon i.wechat {
  color: #67c23a;
}

.method-icon i.alipay {
  color: #409eff;
}

.method-icon i.balance {
  color: #e6a23c;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.method-desc {
  font-size: 12px;
  color: #999;
}

.method-select {
  margin-left: 16px;
}

/* 余额支付密码 */
.password-input {
  margin-top: 8px;
}

/* 操作区域 */
.action-section {
  background-color: #fff;
  margin: 8px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.total-amount {
  display: flex;
  align-items: baseline;
}

.amount-label {
  font-size: 16px;
  color: #666;
  margin-right: 8px;
}

.amount-value {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.pay-button {
  width: 120px;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
}

/* 二维码支付 */
.wechat-qrcode-section,
.alipay-qrcode-section {
  background-color: #fff;
  margin: 8px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 16px;
}

.qrcode-desc {
  font-size: 14px;
  color: #666;
}

.polling-status {
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #409eff;
}

.polling-status i {
  margin-right: 8px;
}
</style>
