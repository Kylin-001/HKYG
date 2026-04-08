<template>
  <div class="payment-page">
    <div class="payment-container max-w-screen-lg mx-auto px-4 lg:px-8 py-6">
      <!-- 支付中/初始状态 -->
      <div v-if="paymentStatus === 'pending'" class="payment-layout">
        <main class="pay-main">
          <div class="order-info-card glass-effect rounded-2xl p-6 mb-6">
            <h3 class="card-title">订单信息</h3>
            <div class="oi-row">
              <span class="oi-label">订单编号</span>
              <span class="oi-value mono">{{ orderNo }}</span>
              <button class="copy-btn" @click="copyNo">复制</button>
            </div>
            <div class="oi-row">
              <span class="oi-label">商品数量</span>
              <span class="oi-value">{{ currentOrder?.items?.length || 3 }} 件商品</span>
            </div>
            <div class="oi-row">
              <span class="oi-label">收货地址</span>
              <span class="oi-value">{{ currentOrder?.receiverName || '张同学' }} {{ currentOrder?.receiverPhone || '138****5678' }} {{ currentOrder?.address ? currentOrder.address.substring(0, 15) + '...' : '黑龙江省哈尔滨市...' }}</span>
            </div>
          </div>

          <div class="pay-method-card glass-effect rounded-2xl p-6">
            <h3 class="card-title">选择支付方式</h3>
            <div class="pm-list">
              <label
                v-for="method in payMethods"
                :key="method.value"
                class="pm-item"
                :class="{ active: selectedMethod === method.value }"
              >
                <input type="radio" name="payMethod" :value="method.value" v-model="selectedMethod" />
                <span class="pm-icon">{{ method.icon }}</span>
                <span class="pm-name">{{ method.name }}</span>
                <span class="pm-recommend" v-if="method.recommend">{{ method.recommend }}</span>
              </label>
            </div>

            <div v-if="selectedMethod === 'campus_card' || selectedMethod === 'balance'" class="password-section mt-6 pt-5 border-t border-gray-100">
              <label class="pw-label">支付密码</label>
              <div class="pw-dots-container" @click="focusPasswordInput">
                <div
                  v-for="(dot, index) in 6"
                  :key="index"
                  class="pw-dot"
                  :class="{ filled: index < payPassword.length, active: index === payPassword.length }"
                >
                  <span v-if="index < payPassword.length" class="dot-filled"></span>
                </div>
                <input
                  ref="passwordInputRef"
                  v-model="payPassword"
                  type="password"
                  maxlength="6"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  placeholder=""
                  class="pw-hidden-input"
                  @input="handlePasswordInput"
                />
              </div>
              <p class="pw-hint">忘记密码？<router-link to="/settings/security">去设置</router-link></p>
            </div>
          </div>
        </main>

        <aside class="pay-sidebar">
          <div class="amount-card glass-effect rounded-2xl p-6 sticky top-24">
            <h3 class="amount-title">支付金额</h3>
            <div class="amount-display">
              <span class="currency">¥</span>
              <span class="amount-num">{{ totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
            </div>
            <div class="amount-breakdown">
              <div class="ab-line">
                <span>商品总额</span>
                <span>\u00A5{{ originalTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="ab-line discount">
                <span>优惠减免</span>
                <span>-\u00A5{{ discountAmount > 0 ? discountAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00' }}</span>
              </div>
              <div class="ab-line">
                <span>运费</span>
                <span>免运费</span>
              </div>
            </div>
            <button
              class="confirm-pay-btn"
              :disabled="!canPay"
              :class="{ loading: isPaying }"
              @click="handlePay"
            >
              {{ isPaying ? '正在支付...' : `确认支付 \u00A5${totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }}
            </button>
            <p class="security-hint">
              <el-icon><Lock /></el-icon>
              支付环境安全，您的信息已加密保护
            </p>
          </div>
        </aside>
      </div>

      <!-- 支付成功状态 -->
      <div v-else-if="paymentStatus === 'success'" class="result-view success-view glass-effect rounded-2xl overflow-hidden text-center py-16 px-6">
        <div class="success-icon-wrap">
          <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        </div>
        <h2 class="result-title success-title">支付成功！</h2>
        <p class="countdown-hint">{{ countdown }} 秒后自动跳转订单详情...</p>

        <div class="result-info-card">
          <div class="info-row">
            <span class="info-label">订单编号</span>
            <span class="info-value mono">{{ orderNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付金额</span>
            <span class="info-value amount-highlight">\u00A5{{ totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付方式</span>
            <span class="info-value">{{ getMethodName(selectedMethod) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付时间</span>
            <span class="info-value">{{ paymentTime }}</span>
          </div>
        </div>

        <div class="result-actions">
          <router-link :to="`/orders/${route.params.id}`" class="action-btn primary">查看订单详情</router-link>
          <router-link to="/products" class="action-btn secondary">继续购物</router-link>
        </div>
      </div>

      <!-- 支付失败状态 -->
      <div v-else-if="paymentStatus === 'failed'" class="result-view failed-view glass-effect rounded-2xl overflow-hidden text-center py-16 px-6">
        <div class="failed-icon-wrap">
          <el-icon class="failed-icon"><CircleCloseFilled /></el-icon>
        </div>
        <h2 class="result-title failed-title">支付失败</h2>
        <p class="failed-desc">{{ errorMessage || '支付过程中出现异常，请重试' }}</p>

        <div class="result-actions">
          <button class="action-btn primary retry-btn" @click="retryPayment">
            <el-icon><RefreshRight /></el-icon>
            重新支付
          </button>
          <router-link to="/orders" class="action-btn secondary">返回订单列表</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Lock, CircleCheckFilled, CircleCloseFilled, RefreshRight } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// 支付状态管理
const paymentStatus = ref<'pending' | 'success' | 'failed'>('pending')
const errorMessage = ref('')
const paymentTime = ref('')

// 倒计时相关
const countdown = ref(5)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 原有状态
const selectedMethod = ref('wechat')
const payPassword = ref('')
const isPaying = ref(false)
const passwordInputRef = ref<HTMLInputElement | null>(null)

// 从 orderStore 获取当前订单信息
const currentOrder = computed(() => orderStore.currentOrder)
const orderNo = computed(() => currentOrder.value?.orderNo || route.params.id as string || '')
const orderId = computed(() => route.params.id as string)
const totalAmount = computed(() => {
  if (!currentOrder.value) return 0
  return (currentOrder.value.price || 0) * (currentOrder.value.quantity || 1)
})
const originalTotal = computed(() => {
  if (!currentOrder.value) return 0
  const price = currentOrder.value.originalPrice || currentOrder.value.price || 0
  return price * (currentOrder.value.quantity || 1)
})
const discountAmount = computed(() => {
  if (!currentOrder.value || !currentOrder.value.originalPrice) return 0
  return (currentOrder.value.originalPrice - currentOrder.value.price) * (currentOrder.value.quantity || 1)
})

const payMethods = [
  { value: 'wechat', icon: '\u{1F49A}', name: '微信支付', recommend: '' },
  { value: 'alipay', icon: '\u{1F499}', name: '支付宝', recommend: '' },
  { value: 'campus_card', icon: '\u{1F3AB}', name: '校园卡支付', recommend: '推荐' },
  { value: 'balance', icon: '\u{1F6B0}', name: `余额支付（余额 \u00A515,230.00）`, recommend: '' }
]

const canPay = computed(() => {
  if (selectedMethod.value === 'campus_card' || selectedMethod.value === 'balance') {
    return payPassword.value.length >= 6
  }
  return true
})

// 获取支付方式名称
function getMethodName(methodValue: string): string {
  const method = payMethods.find(m => m.value === methodValue)
  return method ? method.name : methodValue
}

function copyNo() {
  navigator.clipboard.writeText(orderNo.value)
  ElMessage.success('订单号已复制')
}

// 密码输入相关方法
function focusPasswordInput() {
  passwordInputRef.value?.focus()
}

function handlePasswordInput() {
  // 自动限制为6位数字
  payPassword.value = payPassword.value.replace(/\D/g, '').slice(0, 6)
}

// 开始倒计时
function startCountdown() {
  countdown.value = 5
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      stopCountdown()
      router.push(`/orders/${orderId.value}`)
    }
  }, 1000)
}

// 停止倒计时
function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 获取当前时间格式化字符串
function getCurrentTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function handlePay() {
  if (!canPay.value) {
    if (selectedMethod.value === 'campus_card' || selectedMethod.value === 'balance') {
      ElMessage.warning('请输入正确的支付密码')
    }
    return
  }

  isPaying.value = true

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在处理支付，请稍候...',
    background: 'rgba(0, 59, 128, 0.85)'
  })

  try {
    await orderStore.payOrder(orderId.value, selectedMethod.value, payPassword.value)
    // 支付成功
    paymentStatus.value = 'success'
    paymentTime.value = getCurrentTime()
    ElMessage.success('支付成功！')
    // 启动倒计时自动跳转
    startCountdown()
  } catch (err: any) {
    console.error('支付失败:', err)
    // 支付失败
    paymentStatus.value = 'failed'
    errorMessage.value = err.message || '支付失败，请重试'
    ElMessage.error(errorMessage.value)
  } finally {
    loadingInstance.close()
    isPaying.value = false
  }
}

// 重试支付
function retryPayment() {
  paymentStatus.value = 'pending'
  errorMessage.value = ''
  payPassword.value = ''
}

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCountdown()
})

onMounted(async () => {
  const id = orderId.value
  if (id) {
    try {
      await orderStore.fetchOrderDetail(id)
    } catch (err: any) {
      ElMessage.error(err.message || '获取订单信息失败')
    }
  }
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
}

.payment-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
}

.glass-effect { border: 1px solid rgba(0,0,0,0.05); }

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.oi-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0;
  font-size: 0.875rem;
}

.oi-label {
  width: 80px;
  color: #9ca3af;
  flex-shrink: 0;
}

.oi-value { color: #374151; font-weight: 500; flex: 1; }

.oi-value.mono {
  font-family: monospace;
  letter-spacing: 0.03em;
}

.copy-btn {
  padding: 0.125rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 0.6875rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.copy-btn:hover { border-color: #003B80; color: #003B80; }

.pm-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pm-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.pm-item:hover { border-color: #93c5fd; }

.pm-item.active {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.03);
  border-width: 2px;
}

.pm-item input[type="radio"] { accent-color: #003B80; width: 18px; height: 18px; }

.pm-icon { font-size: 1.5rem; }

.pm-name {
  flex: 1;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9375rem;
}

.pm-recommend {
  padding: 0.125rem 0.5625rem;
  background: #dbeafe;
  color: #003B80;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
}

/* 密码圆点输入样式 */
.pw-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.pw-dots-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 1.25rem;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  position: relative;
  cursor: text;
  transition: all 0.2s;
}

.pw-dots-container:focus-within {
  border-color: #003B80;
  box-shadow: 0 0 0 3px rgba(0, 59, 128, 0.08);
}

.pw-dot {
  width: 44px;
  height: 50px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.pw-dot.filled {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.04);
}

.pw-dot.active {
  border-color: #003B80;
  animation: dotPulse 1s ease-in-out infinite;
}

.dot-filled {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #003B80;
  animation: dotAppear 0.15s ease-out;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 59, 128, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(0, 59, 128, 0.1); }
}

@keyframes dotAppear {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.pw-hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  padding: 0;
  border: none;
  outline: none;
}

.pw-hint {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
}

.pw-hint a {
  color: #003B80;
  text-decoration: none;
  font-weight: 500;
}

.pw-hint a:hover { text-decoration: underline; }

.amount-card { border: 1px solid rgba(0,0,0,0.05); }

.amount-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
}

.amount-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.125rem;
  margin-bottom: 1.25rem;
  padding: 1.5rem 0;
  background: linear-gradient(135deg, rgba(0, 59, 128, 0.04) 0%, rgba(147, 197, 253, 0.04) 100%);
  border-radius: 14px;
}

.currency {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ef4444;
}

.amount-num {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ef4444;
  letter-spacing: -0.02em;
}

.amount-breakdown {
  padding: 0.875rem 0;
  border-top: 1px dashed #e5e7eb;
  border-bottom: 1px dashed #e5e7eb;
  margin-bottom: 1.25rem;
}

.ab-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #6b7280;
  padding: 0.25rem 0;
}

.ab-line.discount span:last-child { color: #003B80; font-weight: 600; }

.confirm-pay-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #003B80 0%, #0052cc 50%, #003B80 100%);
  background-size: 200% auto;
  color: white;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: gradientShift 3s ease infinite;
}

.confirm-pay-btn:hover:not(:disabled):not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 59, 128, 0.35);
}

.confirm-pay-btn:disabled { opacity: 0.45; cursor: not-allowed; animation: none; }

@keyframes gradientShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.security-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

/* 结果视图通用样式 */
.result-view {
  max-width: 520px;
  margin: 0 auto;
  animation: resultIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes resultIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.result-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

/* 成功视图样式 */
.success-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon {
  font-size: 2.5rem;
  color: #16a34a;
}

.success-title { color: #1f2937; }

.countdown-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(22, 163, 74, 0.06);
  border-radius: 8px;
  display: inline-block;
}

/* 结果信息卡片 */
.result-info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem;
  margin: 1.5rem auto 2rem;
  max-width: 400px;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  border-bottom: 1px dashed #e5e7eb;
}

.info-row:last-child { border-bottom: none; }

.info-label { color: #9ca3af; }

.info-value { color: #374151; font-weight: 500; }

.info-value.mono { font-family: monospace; letter-spacing: 0.02em; }

.info-value.amount-highlight {
  color: #ef4444;
  font-weight: 700;
  font-size: 1.0625rem;
}

/* 失败视图样式 */
.failed-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.failed-icon {
  font-size: 2.5rem;
  color: #dc2626;
}

.failed-title { color: #dc2626; }

.failed-desc {
  font-size: 0.9375rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* 操作按钮区域 */
.result-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #003B80 0%, #0052cc 100%);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 59, 128, 0.3);
}

.retry-btn {
  min-width: 140px;
  justify-content: center;
}

.action-btn.secondary {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover { border-color: #003B80; color: #003B80; }

@media (max-width: 1024px) {
  .payment-layout { grid-template-columns: 1fr; }
  .pay-sidebar { order: -1; }
}

@media (max-width: 640px) {
  .amount-num { font-size: 2rem; }
  .currency { font-size: 1.25rem; }
  .result-actions { flex-direction: column; }
  .action-btn { text-align: center; justify-content: center; }
  .pw-dot { width: 38px; height: 44px; }
  .pw-dots-container { gap: 8px; padding: 1rem; }
}
</style>
