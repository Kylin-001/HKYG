<template>
  <div class="order-detail-page">
    <div class="detail-container max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <nav class="breadcrumb mb-6">
        <router-link to="/orders" class="breadcrumb-link">我的订单</router-link>
        <span class="separator">/</span>
        <span class="current">订单详情</span>
      </nav>

      <div v-if="!order" class="empty-state glass-effect rounded-2xl p-12 text-center">
        <el-icon class="empty-icon"><Warning /></el-icon>
        <h3>订单不存在</h3>
      </div>

      <div v-else class="detail-layout">
        <main class="detail-main">
          <div class="status-banner glass-effect rounded-2xl p-6" :class="order.status">
            <div class="status-icon-wrap">
              <el-icon class="status-icon"><component :is="statusIcon" /></el-icon>
            </div>
            <div class="status-text">
              <h2>{{ statusTitle }}</h2>
              <p>{{ statusDesc }}</p>
            </div>
          </div>

          <div class="info-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="card-title"><el-icon><Document /></el-icon> 订单信息</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">订单编号</span>
                <span class="value mono">{{ order.orderNo }}</span>
                <button class="copy-btn" @click="copyNo">复制</button>
              </div>
              <div class="info-row">
                <span class="label">下单时间</span>
                <span class="value">{{ formatFullTime(order.createdAt) }}</span>
              </div>
              <div class="info-row">
                <span class="label">支付方式</span>
                <span class="value">{{ order.payMethod || order.paymentMethod || '微信支付' }}</span>
              </div>
              <div class="info-row">
                <span class="label">支付时间</span>
                <span class="value">{{ payTimeFormatted }}</span>
              </div>
            </div>
          </div>

          <div class="product-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="card-title"><el-icon><ShoppingBag /></el-icon> 商品信息</h3>
            <div v-for="(item, idx) in flatItems" :key="idx" class="product-detail-row">
              <img :src="item.productImage" :alt="item.productName" class="pd-img" />
              <div class="pd-info">
                <h4 class="pd-name">{{ item.productName }}</h4>
                <p class="pd-specs">{{ item.specs }}</p>
              </div>
              <div class="pd-price-col">
                <span class="pd-price">¥{{ item.price.toFixed(2) }}</span>
                <span class="pd-qty">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <div v-if="order.status === 'shipped'" class="logistics-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="card-title"><el-icon><Van /></el-icon> 物流信息</h3>
            <div class="logistics-timeline">
              <div
                v-for="(step, idx) in logisticsSteps"
                :key="idx"
                class="timeline-item"
                :class="{ active: idx === 0 }"
              >
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <p class="tl-desc">{{ step.desc }}</p>
                  <span class="tl-time">{{ step.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="address-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="card-title"><el-icon><Location /></el-icon> 收货地址</h3>
            <div class="address-display">
              <div class="addr-tag">收</div>
              <div class="addr-info">
                <p><strong>{{ receiverName }}</strong> {{ receiverPhone }}</p>
                <p>{{ fullAddress }}</p>
              </div>
            </div>
          </div>
        </main>

        <aside class="detail-sidebar">
          <div class="price-card glass-effect rounded-2xl p-6 sticky top-24">
            <h3 class="card-title-sm">价格明细</h3>
            <div class="price-list">
              <div class="price-line">
                <span>商品总价</span>
                <span>¥{{ flatItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) }}</span>
              </div>
              <div v-if="flatItems.some(item => item.originalPrice && item.originalPrice > item.price)" class="price-line discount">
                <span>优惠减免</span>
                <span>-¥{{ flatItems.reduce((sum, item) => ((item.originalPrice || item.price) - item.price) * item.quantity, 0).toFixed(2) }}</span>
              </div>
              <div class="price-line">
                <span>运费</span>
                <span>{{ shippingFee > 0 ? `¥${shippingFee.toFixed(2)}` : '免运费' }}</span>
              </div>
            </div>
            <div class="price-total">
              <span>实付款</span>
              <strong>¥{{ totalAmount.toFixed(2) }}</strong>
            </div>

            <div class="action-area">
              <template v-if="order.status === 'pending' || order.status === 'pending_payment'">
                <button class="action-btn secondary full" @click="$router.back()">返回修改</button>
                <button class="action-btn primary full" @click="goPay">去支付</button>
              </template>
              <template v-if="order.status === 'shipped'">
                <button class="action-btn primary full" @click="confirmReceive">确认收货</button>
              </template>
              <template v-if="order.status === 'completed'">
                <button class="action-btn primary full" @click="buyAgain">再次购买</button>
                <button class="action-btn secondary full" @click="rateProduct">评价商品</button>
              </template>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, ShoppingBag, Location, Van, Warning, Clock, Check, Promotion, CircleCheck } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

interface OrderDetail {
  id: number
  orderNo: string
  productName: string
  productImage: string
  specs: string
  price: number
  originalPrice?: number
  quantity: number
  status: string
  createdAt: string
  payTime?: string
  payMethod?: string
  shipping: number
  receiverName: string
  receiverPhone: string
  address: string
}

const order = computed(() => (orderStore.currentOrder || null) as OrderDetail | null)

// 字段映射：将嵌套结构转换为扁平字段
const flatItems = computed(() => {
  if (!order.value?.items) return []
  return order.value.items.map((item: any) => ({
    ...item,
    productName: item.productName || item.name || '商品',
    productImage: item.productImage || item.image || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
    originalPrice: item.originalPrice || item.price,
    specs: item.specs || ''
  }))
})

// 取第一个商品信息用于显示（兼容单商品展示）
const displayItem = computed(() => flatItems.value[0] || {})

// 地址字段映射
const receiverName = computed(() => order.value?.receiverName || order.value?.shippingAddress?.receiverName || '')
const receiverPhone = computed(() => order.value?.receiverPhone || order.value?.shippingAddress?.receiverPhone || '')
const fullAddress = computed(() => order.value?.address || order.value?.shippingAddress?.fullAddress || '')

// 时间字段映射
const createTimeFormatted = computed(() => formatFullTime(order.value?.createdAt || order.value?.createTime || ''))
const payTimeFormatted = computed(() => order.value?.paymentTime || order.value?.payTime ? formatFullTime(order.value?.paymentTime || order.value?.payTime || '') : '未支付')

// 运费字段映射
const shippingFee = computed(() => order.value?.shippingAmount ?? 0)

const statusIcon = computed(() => {
  if (!order.value) return Document
  const status = order.value.status
  const map: Record<string, any> = { pending: Clock, pending_payment: Clock, paid: Clock, processing: Van, shipped: Promotion, delivered: CircleCheck, completed: Check, cancelled: Warning }
  return map[status] || Document
})

const statusTitle = computed(() => {
  if (!order.value) return ''
  const status = order.value.status
  const map: Record<string, string> = { pending: '等待买家付款', pending_payment: '等待买家付款', paid: '等待商家发货', processing: '商家正在处理', shipped: '包裹正在派送中', delivered: '已送达', completed: '交易完成', cancelled: '订单已取消' }
  return map[status] || ''
})

const statusDesc = computed(() => {
  if (!order.value) return ''
  const status = order.value.status
  const map: Record<string, string> = {
    pending: '请在 29:59 内完成支付，超时订单将自动取消',
    pending_payment: '请在 29:59 内完成支付，超时订单将自动取消',
    paid: '商家正在准备您的商品，请耐心等待',
    processing: '商家已接单，正在打包发货',
    shipped: '预计今天18:00前送达，请保持手机畅通',
    delivered: '您的订单已由本人签收',
    completed: '感谢您在黑科易购的购物体验！',
    cancelled: '该订单已被取消'
  }
  return map[status] || ''
})

// 物流信息（实际项目中应从API获取）
const logisticsSteps = ref([
  { desc: '快递员【李师傅】正在为您派送，电话：139****8899', time: '04-02 14:25' },
  { desc: '快件已到达【哈尔滨南岗营业部】', time: '04-02 08:10' },
  { desc: '快件已从【沈阳中转站】发出', time: '04-01 22:40' },
  { desc: '商家已发货，顺丰速运 SF1234567890', time: '03-31 16:00' },
  { desc: '商家正在打包您的商品', time: '03-31 14:30' },
  { desc: '订单已提交，等待商家处理', time: '03-31 10:30' }
])

const totalAmount = computed(() => {
  if (!order.value) return 0
  const itemsTotal = (order.value.items || []).reduce((sum: number, item: any) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0)
  return Math.max(0, itemsTotal + (order.value.shippingAmount ?? 0))
})

function copyNo() {
  if (!order.value) return
  try {
    navigator.clipboard.writeText(order.value.orderNo)
    ElMessage.success('订单号已复制')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

function formatFullTime(timeStr: string): string {
  return new Date(timeStr).toLocaleString('zh-CN')
}

function goPay() {
  if (!order.value) return
  router.push(`/orders/${order.value.id}/payment`)
}

async function confirmReceive() {
  if (!order.value) return
  try {
    await orderStore.confirmReceive(String(order.value.id))
    ElMessage.success('已确认收货，感谢您的购买！')
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

function buyAgain() {
  ElMessage.success('正在将商品加入购物车...')
}

function rateProduct() {
  ElMessage.info('评价功能开发中')
}

onMounted(async () => {
  const orderId = route.params.id as string
  try {
    await orderStore.fetchOrderDetail(orderId)
  } catch (err: any) {
    ElMessage.error(err.message || '获取订单详情失败')
  }
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.breadcrumb { font-size: 0.875rem; color: #9ca3af; margin-bottom: 1.5rem; }
.breadcrumb-link { color: #0284c7; text-decoration: none; }
.breadcrumb-link:hover { color: #0369a1; }
.separator { margin: 0 0.5rem; }
.current { color: #374151; }

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.status-banner.pending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
.status-banner.paid { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; }
.status-banner.processing { background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #3730a3; }
.status-banner.shipped { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
.status-banner.delivered,
.status-banner.completed { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
.status-banner.cancelled { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #4b5563; }

.status-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-icon { font-size: 1.75rem; }

.status-text h2 {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.status-text p {
  opacity: 0.85;
  font-size: 0.875rem;
}

.info-card, .product-card, .logistics-card, .address-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.info-row .label {
  width: 80px;
  color: #9ca3af;
  flex-shrink: 0;
}

.info-row .value {
  color: #374151;
  font-weight: 500;
}

.info-row .value.mono {
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

.copy-btn:hover { border-color: #0284c7; color: #0284c7; }

.product-detail-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.pd-img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.pd-info { flex: 1; }
.pd-name { font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; }
.pd-specs { font-size: 0.8125rem; color: #9ca3af; }

.pd-price-col {
  text-align: right;
  flex-shrink: 0;
}

.pd-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: #ef4444;
  display: block;
}

.pd-qty {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.logistics-timeline {
  position: relative;
  padding-left: 1.5rem;
}

.logistics-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -1.5rem;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 3px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
  z-index: 1;
}

.timeline-item.active .timeline-dot {
  background: #0284c7;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
}

.tl-desc {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.timeline-item.active .tl-desc {
  font-weight: 600;
  color: #0284c7;
}

.tl-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
  display: block;
}

.address-display {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.addr-tag {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.addr-info p:first-child { font-size: 0.9375rem; color: #1f2937; margin-bottom: 0.125rem; }
.addr-info p:last-child { font-size: 0.8125rem; color: #6b7280; line-height: 1.5; }

.detail-sidebar { display: flex; flex-direction: column; }

.price-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title-sm {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.price-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px dashed #e5e7eb;
  margin-bottom: 0.875rem;
}

.price-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.price-line.discount span:last-child { color: #16a34a; }

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.25rem;
}

.price-total span { font-size: 0.875rem; color: #6b7280; }

.price-total strong {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ef4444;
}

.action-area {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
}

.action-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }

.action-btn.secondary {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover { border-color: #0284c7; color: #0284c7; }
.action-btn.full { width: 100%; }

.empty-state { border: 1px solid rgba(0, 0, 0, 0.05); }
.empty-icon { font-size: 4rem; color: #bae6fd; margin-bottom: 1rem; }
.empty-state h3 { font-size: 1.25rem; color: #374151; }

@media (max-width: 1024px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-sidebar { order: -1; }
}

@media (max-width: 640px) {
  .status-banner { flex-direction: column; text-align: center; }
  .status-icon-wrap { width: 52px; height: 52px; }
  .status-icon { font-size: 1.5rem; }
  .info-row { flex-direction: column; align-items: flex-start; gap: 0.125rem; }
  .info-row .label { width: auto; }
  .pd-img { width: 72px; height: 72px; }
}
</style>
