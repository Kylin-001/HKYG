<template>
  <div class="page min-h-screen" v-loading="takeoutStore.loading">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">配送跟踪</h1>
        <span class="text-sm text-text-secondary">订单号：{{ takeoutStore.deliveryTrack?.orderId }}</span>
        <el-button round class="!rounded-full !px-5" @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
      </div>

      <div class="max-w-2xl mx-auto space-y-5">
        <!-- 订单状态卡片 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6">
          <div class="flex items-center gap-4">
            <img :src="takeoutStore.deliveryTrack?.merchantLogo" :alt="takeoutStore.deliveryTrack?.merchantName" class="w-16 h-16 rounded-xl object-cover" />
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-text-primary">{{ takeoutStore.deliveryTrack?.merchantName }}</h2>
              <p class="text-sm text-text-secondary mt-1">订单号：{{ takeoutStore.deliveryTrack?.orderId }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-text-primary">配送进度</h3>
            <span :class="['px-3 py-1 rounded-full text-sm font-semibold', currentStatusStyle]">
              {{ currentStatusText }}
            </span>
          </div>

          <div class="relative pl-8">
            <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>

            <div v-for="(step, index) in deliverySteps" :key="index" class="relative pb-8 last:pb-0">
              <div :class="['absolute left-[-17px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10',
                step.done ? 'bg-emerald-500 border-emerald-500' : step.active ? 'bg-white border-emerald-400 ring-4 ring-emerald-100' : 'bg-gray-100 border-gray-200']">
                <svg v-if="step.done" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <div v-else-if="step.active" class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>

              <div :class="['ml-4 p-4 rounded-xl transition-all', step.active ? 'bg-emerald-50 border border-emerald-200' : '']">
                <div class="flex items-start justify-between mb-1">
                  <div>
                    <p :class="['font-medium text-sm', step.done ? 'text-text-primary' : step.active ? 'text-emerald-700' : 'text-gray-400']">
                      {{ step.title }}
                    </p>
                    <p v-if="step.desc" :class="['text-xs mt-0.5', step.active ? 'text-emerald-600' : 'text-gray-400']">{{ step.desc }}</p>
                  </div>
                  <span :class="['text-xs shrink-0 ml-3', step.active ? 'text-emerald-600 font-medium' : 'text-gray-400']">{{ step.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6">
          <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span class="w-1 h-5 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></span>骑手信息
          </h3>
          <div class="flex items-center gap-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=15&size=80" class="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100" />
            <div class="flex-1">
              <p class="font-semibold text-text-primary">{{ riderInfo.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">好评率 {{ riderInfo.rating }}% · 配送 {{ riderInfo.totalDelivers }}单</p>
            </div>
            <button class="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1">
              <el-icon><Phone /></el-icon>联系骑手
            </button>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6">
          <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span class="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></span>预计送达
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-emerald-500">{{ orderInfo.eta }}</p>
              <p class="text-sm text-gray-400 mt-1">距离您约 {{ orderInfo.distance }}km</p>
            </div>
            <div class="w-24 h-24 relative">
              <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" stroke-width="8"
                  stroke-dasharray="264" stroke-dashoffset="66" stroke-linecap="round"
                  class="transition-all duration-1000"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-emerald-600">75%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 text-center cursor-pointer hover:border-blue-200 transition-colors">
            <div class="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-xl flex items-center justify-center">
              <el-icon class="text-blue-500 text-xl"><Phone /></el-icon>
            </div>
            <p class="text-sm font-medium text-text-primary">联系商家</p>
          </div>
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 text-center cursor-pointer hover:border-red-200 transition-colors">
            <div class="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-xl flex items-center justify-center">
              <el-icon class="text-red-500 text-xl"><Warning /></el-icon>
            </div>
            <p class="text-sm font-medium text-text-primary">遇到问题</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Phone, Warning } from '@element-plus/icons-vue'
import { useTakeoutStore } from '@/stores/takeout'

const route = useRoute()
const router = useRouter()
const takeoutStore = useTakeoutStore()

const orderId = computed(() => route.params.orderId as string)

const orderInfo = computed(() => ({
  merchantName: takeoutStore.deliveryTrack?.merchantName || '',
  items: takeoutStore.deliveryTrack?.items || [],
  itemCount: takeoutStore.deliveryTrack?.items?.length || 0,
  eta: takeoutStore.deliveryTrack?.estimatedTime || '',
  distance: takeoutStore.deliveryTrack?.distance || ''
}))

const riderInfo = computed(() => ({
  name: takeoutStore.deliveryTrack?.riderName || '',
  rating: takeoutStore.deliveryTrack?.riderRating || 98.5,
  totalDelivers: takeoutStore.deliveryTrack?.riderDeliveries || 12680,
  phone: takeoutStore.deliveryTrack?.riderPhone || ''
}))

const deliverySteps = computed(() => {
  const track = takeoutStore.deliveryTrack
  if (!track) return []
  
  return [
    { title: '商家已接单', desc: '商家正在准备您的餐品', time: track.orderTime || '', done: true, active: false },
    { title: '骑手已取餐', desc: '骑手已取到您的餐品，正在赶来', time: track.pickupTime || '', done: track.status !== 'preparing', active: false },
    { title: '配送中', desc: track.status === 'delivering' ? `骑手距离您还有约${track.distance}公里` : '', time: track.deliveringTime || '', done: ['completed'].includes(track.status), active: track.status === 'delivering' },
    { title: '即将送达', desc: '', time: '', done: false, active: false },
    { title: '已送达', desc: '', time: track.completedTime || '', done: track.status === 'completed', active: false }
  ]
})

const currentStatusText = computed(() => {
  const active = deliverySteps.value.find(s => s.active)
  return active?.title || '配送中'
})

const currentStatusStyle = computed(() => {
  const status = takeoutStore.deliveryTrack?.status
  if (status === 'completed') return 'bg-gray-100 text-gray-700'
  if (status === 'delivering') return 'bg-emerald-100 text-emerald-700'
  return 'bg-blue-100 text-blue-700'
})

function goBack() {
  router.back()
}

function contactRider() {
  ElMessage.info('正在连接骑手电话...')
}

function cancelOrder() {
  ElMessageBox.confirm(
    '确定要取消此订单吗？取消后无法恢复',
    '取消订单',
    {
      confirmButtonText: '确定取消',
      cancelButtonText: '再想想',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('订单已取消')
    router.push('/orders')
  }).catch(() => {})
}

function viewOrderDetail() {
  router.push(`/orders/${orderId.value}`)
}

onMounted(async () => {
  try {
    await takeoutStore.fetchDeliveryTrack(orderId.value)
  } catch {
    ElMessage.error('获取配送信息失败')
  }
})
</script>
