<template>
  <div class="order-list-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <h1 class="page-title">{{ t('order.title') }}</h1>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="tabs-bar glass-effect rounded-2xl p-2 mb-6 inline-flex">
        <button
          v-for="tab in orderTabs"
          :key="tab.value"
          class="order-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <div v-if="filteredOrders.length === 0" class="empty-state glass-effect rounded-2xl p-12 text-center">
        <el-icon class="empty-icon"><DocumentDelete /></el-icon>
        <h3 class="empty-title">暂无{{ currentTabLabel }}订单</h3>
        <p class="empty-desc">去逛逛吧，发现更多好物</p>
        <router-link to="/products" class="empty-action">去购物</router-link>
      </div>

      <div v-else class="orders-container">
        <div
          v-for="group in orderGroups"
          :key="group.date"
          class="order-group"
        >
          <div class="group-header">
            <el-icon><Calendar /></el-icon>
            <span>{{ group.displayDate }}</span>
            <span class="group-count">{{ group.orders.length }} 个订单</span>
          </div>

          <div
            v-for="order in group.orders"
            :key="order.id"
            class="order-card glass-effect rounded-2xl overflow-hidden"
          >
            <div class="card-header">
              <div class="order-meta">
                <span class="order-no">订单号：{{ order.orderNo }}</span>
                <span class="order-time">{{ formatTime(order.createdAt) }}</span>
              </div>
              <span class="status-tag" :class="order.status">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <div class="card-body" @click="$router.push(`/orders/${order.id}`)">
              <img :src="order.items?.[0]?.productImage || ''" :alt="order.items?.[0]?.productName || ''" class="product-img" width="80" height="80" loading="lazy" />
              <div class="product-info">
                <h4 class="product-name">{{ order.items?.[0]?.productName || '商品' }}</h4>
                <p class="product-specs">{{ order.items?.map(i => i.productName).join(' / ') || '' }}</p>
                <div class="price-row">
                  <span class="price">¥{{ (order.items?.[0]?.price ?? 0).toFixed(2) }}</span>
                  <span v-if="order.items?.[0]?.originalPrice" class="original-price">¥{{ order.items?.[0].originalPrice.toFixed(2) }}</span>
                  <span v-if="(order.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0) > 1" class="quantity">x{{ order.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="total-info">
                <span v-if="order.status === 'completed' || order.status === 'delivered'">
                  实付款 <strong>¥{{ (order.finalAmount ?? 0).toFixed(2) }}</strong>
                </span>
                <span v-else>
                  共 <strong>{{ order.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0 }}</strong> 件，合计 <strong>¥{{ (order.finalAmount ?? 0).toFixed(2) }}</strong>
                </span>
              </div>
              <div class="action-btns">
                <template v-if="order.status === 'pending' || order.status === 'pending_payment'">
                  <button class="btn secondary" @click.stop="cancelOrder(order)">取消订单</button>
                  <button class="btn primary" @click.stop="payOrder(order)">去支付</button>
                </template>
                <template v-if="order.status === 'paid' || order.status === 'processing'">
                  <button class="btn secondary" @click.stop="viewLogistics(order)">查看物流</button>
                </template>
                <template v-if="order.status === 'shipped'">
                  <button class="btn secondary" @click.stop="viewLogistics(order)">查看物流</button>
                  <button class="btn primary" @click.stop="confirmReceive(order)">确认收货</button>
                </template>
                <template v-if="order.status === 'completed'">
                  <button class="btn secondary" @click.stop="deleteOrder(order)">删除订单</button>
                  <button class="btn primary" @click.stop="buyAgain(order)">再次购买</button>
                </template>
                <template v-if="order.status === 'cancelled'">
                  <button class="btn secondary" @click.stop="deleteOrder(order)">删除订单</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasMore" class="load-more-section text-center mt-8">
          <button class="load-more-btn" :class="{ loading: loadingMore }" @click="loadMoreOrders">
            {{ loadingMore ? '加载中...' : '加载更多订单' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, DocumentDelete } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const { t } = useI18n()
const orderStore = useOrderStore()

interface Order {
  id: number
  orderNo: string
  productName: string
  productImage: string
  specs: string
  price: number
  originalPrice?: number
  quantity: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
  createdAt: string
}

const activeTab = ref('all')

const orderTabs = computed(() => {
  const tabs = [
    { value: 'all', label: '全部', count: 0 },
    { value: 'pending_payment', label: '待付款', count: 0 },
    { value: 'paid', label: '待发货', count: 0 },
    { value: 'shipped', label: '待收货', count: 0 },
    { value: 'completed', label: '已完成', count: 0 }
  ]

  orderStore.orders.forEach(o => {
    const tab = tabs.find(t => t.value === o.status)
    if (tab) tab.count++
  })

  return tabs
})

const filteredOrders = computed<Order[]>(() => {
  if (activeTab.value === 'all') return orderStore.orders as unknown as Order[]
  return (orderStore.orders as unknown as Order[]).filter((o: Order) => o.status === activeTab.value)
})

const currentTabLabel = computed(() => {
  const tab = orderTabs.value.find(t => t.value === activeTab.value)
  return tab?.label ?? ''
})

const hasMore = computed(() => orderStore.orders.length < orderStore.total)
const loadingMore = ref(false)
const currentPage = ref(1)

const orderGroups = computed(() => {
  const groups: { date: string; displayDate: string; orders: Order[] }[] = []
  const map = new Map<string, Order[]>()

  filteredOrders.forEach(order => {
    const d = new Date(order.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(order)
  })

  map.forEach((ords, key) => {
    const d = new Date(key + 'T00:00:00')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let displayDate = `${d.getMonth() + 1}月${d.getDate()}日`
    if (key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`) displayDate = '今天'
    else if (key === `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}`) displayDate = '昨天'

    groups.push({ date: key, displayDate, orders: ords })
  })

  return groups.sort((a, b) => b.date.localeCompare(a.date))
})

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: t('order.pendingPayment'),
    pending_payment: t('order.pendingPayment'),
    paid: t('order.pendingShipment'),
    processing: t('common.processing') || '处理中',
    shipped: t('order.shipped'),
    delivered: t('common.delivered') || '已送达',
    completed: t('order.completed'),
    cancelled: t('order.cancelled')
  }
  return map[status] || status
}

function formatTime(timeStr: string): string {
  const d = new Date(timeStr)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

async function cancelOrder(order: Order) {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '取消订单', {
      confirmButtonText: '确定取消',
      cancelButtonText: '再想想',
      type: 'warning'
    })
    await orderStore.cancelOrder(String(order.id))
    ElMessage.success('订单已取消')
  } catch {}
}

function payOrder(order: Order) {
  ElMessage.info('正在跳转支付...')
}

function viewLogistics(order: Order) {
  ElMessage.info(`查看 ${order.orderNo} 的物流信息`)
}

async function confirmReceive(order: Order) {
  try {
    await ElMessageBox.confirm('确认已收到商品吗？', '确认收货', {
      confirmButtonText: '确认收货',
      cancelButtonText: '暂不确认',
      type: 'info'
    })
    await orderStore.confirmReceive(String(order.id))
    ElMessage.success('已确认收货，感谢您的购买！')
  } catch {}
}

async function deleteOrder(order: Order) {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？删除后不可恢复', '删除订单', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderStore.deleteOrder(order.id)
    ElMessage.success('订单已删除')
  } catch {}
}

function buyAgain(order: Order) {
  ElMessage.success(`正在将 "${order.items?.[0]?.productName || '商品'}" 加入购物车...`)
}

async function loadMoreOrders() {
  loadingMore.value = true
  try {
    currentPage.value++
    await orderStore.fetchOrders({ page: currentPage.value, pageSize: 20 })
  } catch (err: any) {
    ElMessage.error(err.message || '加载更多订单失败')
    currentPage.value--
  } finally {
    loadingMore.value = false
  }
}

onMounted(async () => {
  try {
    await orderStore.fetchOrders({ page: 1, pageSize: 20 })
  } catch (err: any) {
    ElMessage.error(err.message || '获取订单列表失败')
  }
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.page-header {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  padding: 1.25rem 0;
  color: white;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.tabs-bar {
  background: white;
  border-radius: 14px !important;
  gap: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.order-tab {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.order-tab:hover {
  color: #0284c7;
  background: #f0f9ff;
}

.order-tab.active {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}

.tab-count {
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
}

.order-tab:not(.active) .tab-count {
  background: #fecaca;
  color: #dc2626;
}

.empty-state {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  color: #bae6fd;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.empty-action {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
}

.orders-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.group-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 400;
}

.order-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #fafbfc;
  border-bottom: 1px solid #f3f4f6;
}

.order-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.order-no {
  font-family: monospace;
  letter-spacing: 0.02em;
}

.status-tag {
  padding: 0.1875rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.paid { background: #dbeafe; color: #2563eb; }
.status-tag.processing { background: #e0e7ff; color: #6366f1; }
.status-tag.shipped { background: #fef3c7; color: #b45309; }
.status-tag.delivered { background: #d1fae5; color: #059669; }
.status-tag.completed { background: #ecfdf5; color: #16a34a; }
.status-tag.cancelled { background: #f3f4f6; color: #9ca3af; }

.card-body {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.card-body:hover {
  background: #fafbff;
}

.product-img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-specs {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price {
  font-size: 1.125rem;
  font-weight: 800;
  color: #ef4444;
}

.original-price {
  font-size: 0.8125rem;
  color: #c4b5fd;
  text-decoration: line-through;
}

.quantity {
  font-size: 0.8125rem;
  color: #6b7280;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.total-info {
  font-size: 0.8125rem;
  color: #6b7280;
}

.total-info strong {
  color: #ef4444;
  font-weight: 700;
  font-size: 0.9375rem;
}

.action-btns {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.4375rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn.primary {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.btn.secondary {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn.secondary:hover {
  border-color: #0284c7;
  color: #0284c7;
}

.load-more-btn {
  padding: 0.75rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  border-color: #0284c7;
  color: #0284c7;
}

.load-more-btn.loading {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .tabs-bar {
    overflow-x: auto;
    justify-content: flex-start;
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .card-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .action-btns {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    text-align: center;
  }

  .product-img {
    width: 72px;
    height: 72px;
  }
}
</style>
