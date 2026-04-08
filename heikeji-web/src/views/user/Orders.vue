<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-text-primary mb-6">我的订单</h1>

      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
        <div class="border-b border-gray-100">
          <div class="flex px-2 pt-4 gap-1 overflow-x-auto scrollbar-hide">
            <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
              :class="['px-5 py-3 text-sm font-medium rounded-t-xl whitespace-nowrap transition-all relative',
                activeTab === tab.value
                  ? 'text-indigo-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']">
              {{ tab.label }}
              <span v-if="tab.count > 0"
                :class="['ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab.value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500']">
                {{ tab.count }}
              </span>
              <span v-if="activeTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-full"></span>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div v-for="order in filteredOrders" :key="order.id"
            class="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group">
            <div class="flex items-center justify-between px-5 py-3 bg-gray-50/80">
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>订单号：{{ order.orderNo }}</span>
                <span>{{ order.date }}</span>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold', statusStyle(order.status)]">
                {{ statusText(order.status) }}
              </span>
            </div>

            <div class="p-5">
              <div class="flex gap-4 mb-4">
                <img :src="order.product?.image || ''" class="w-24 h-24 rounded-xl object-cover shrink-0" />
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-text-primary line-clamp-2 leading-snug">{{ order.product?.name || '商品' }}</h3>
                  <p class="text-sm text-gray-400 mt-1">{{ order.product?.spec || '' }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="font-bold text-lg" :class="order.status === 'cancelled' ? 'text-gray-400' : 'text-red-500'">¥{{ (order.product?.price ?? 0).toFixed(2) }}</span>
                    <span class="text-sm text-gray-400">x{{ order.product?.quantity ?? 1 }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div class="text-sm text-gray-400">
                  共{{ order.product?.quantity ?? 1 }}件商品，实付
                  <span class="text-base font-bold text-text-primary ml-1">¥{{ (order.totalAmount ?? 0).toFixed(2) }}</span>
                </div>
                <div class="flex gap-2">
                  <button v-if="order.status === 'pending_payment'" @click="cancelOrder(order)"
                    class="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    取消订单
                  </button>
                  <button v-if="order.status === 'pending_payment'" @click="payOrder(order)"
                    class="px-4 py-1.5 rounded-full text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all">
                    去付款
                  </button>
                  <button v-if="order.status === 'shipped'" @click="viewLogistics(order)"
                    class="px-4 py-1.5 rounded-full text-sm border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors">
                    查看物流
                  </button>
                  <button v-if="order.status === 'shipped'" @click="confirmReceive(order)"
                    class="px-4 py-1.5 rounded-full text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all">
                    确认收货
                  </button>
                  <button v-if="order.status === 'completed'" @click="buyAgain(order)"
                    class="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    再次购买
                  </button>
                  <button v-if="order.status === 'completed'" @click="deleteOrder(order)"
                    class="px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-red-500 transition-colors">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredOrders.length === 0" class="py-16 text-center">
            <div class="w-24 h-24 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <el-icon :size="44" class="text-gray-300"><Document /></el-icon>
            </div>
            <p class="text-gray-400 mb-1">暂无相关订单</p>
            <p class="text-gray-300 text-sm">去逛逛吧~</p>
            <el-button type="primary" round class="mt-4 !rounded-full !px-8" @click="$router.push('/')">去购物</el-button>
          </div>

          <div v-if="filteredOrders.length > 0 && filteredOrders.length >= 3" class="text-center pt-2">
            <button class="px-8 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-indigo-300 hover:text-indigo-500 transition-all duration-300">
              加载更多
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

const activeTab = ref('all')

const tabs = computed(() => {
  const orders = orderStore.orders
  return [
    { label: '全部', value: 'all', count: orders.length },
    { label: '待付款', value: 'pending_payment', count: orders.filter(o => o.status === 'pending_payment').length },
    { label: '待发货', value: 'pending_shipment', count: orders.filter(o => o.status === 'pending_shipment').length },
    { label: '待收货', value: 'shipped', count: orders.filter(o => o.status === 'shipped').length },
    { label: '已完成', value: 'completed', count: orders.filter(o => o.status === 'completed').length }
  ]
})

const orders = computed(() => orderStore.orders)

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

function statusText(status: string): string {
  const map: Record<string, string> = {
    pending_payment: '待付款', pending_shipment: '待发货',
    shipped: '待收货', completed: '已完成', cancelled: '已取消'
  }
  return map[status] || status
}

function statusStyle(status: string): string {
  const map: Record<string, string> = {
    pending_payment: 'bg-orange-100 text-orange-600',
    pending_shipment: 'bg-blue-100 text-blue-600',
    shipped: 'bg-emerald-100 text-emerald-600',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-gray-100 text-gray-400'
  }
  return map[status] || ''
}

async function cancelOrder(order: any) {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', { confirmButtonText: '确认取消', cancelButtonText: '再想想', type: 'warning' })
    await orderStore.cancelOrder(order.id)
    ElMessage.success('订单已取消')
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '取消失败')
    }
  }
}

function payOrder(order: any) {
  ElMessage.info('跳转到支付页面...')
}

function viewLogistics(order: any) {
  ElMessage.info('查看物流详情...')
}

async function confirmReceive(order: any) {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '提示', { confirmButtonText: '确认收货', cancelButtonText: '取消', type: 'info' })
    await orderStore.confirmReceive(order.id)
    ElMessage.success('已确认收货')
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '操作失败')
    }
  }
}

function buyAgain(order: any) {
  ElMessage.success('已加入购物车')
}

onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (err: any) {
    ElMessage.error(err.message || '获取订单列表失败')
  }
})
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
