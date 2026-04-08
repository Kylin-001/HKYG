<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-text-primary mb-6">我的优惠券</h1>

      <!-- 优惠券分类 Tab -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
          :class="['px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 relative',
            activeTab === tab.value
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500']">
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1 opacity-80">({{ tab.count }})</span>
        </button>
      </div>

      <!-- 优惠券列表 -->
      <div v-if="filteredCoupons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="coupon in filteredCoupons" :key="coupon.id"
          :class="['relative rounded-2xl overflow-hidden transition-all duration-300 group coupon-card', couponClass(coupon)]">

          <!-- 即将过期标签 -->
          <div v-if="isExpiringSoon(coupon)" class="absolute top-0 right-0 z-20 expiring-badge">
            <span class="expiring-text">即将过期</span>
          </div>

          <!-- 已使用/已过期戳记 -->
          <div v-if="coupon.status === 'expired' || coupon.status === 'used'" class="absolute inset-0 z-10 flex items-center justify-center">
            <span class="stamp-mark">{{ coupon.status === 'expired' ? '已过期' : '已使用' }}</span>
          </div>

          <div class="flex">
            <!-- 左侧金额区域 - 根据类型显示不同颜色 -->
            <div :class="['w-36 shrink-0 flex flex-col items-center justify-center p-4 text-white relative coupon-left-side']"
              :style="{ background: getTypeGradient(coupon) }">

              <div class="type-icon mb-1">
                <el-icon v-if="coupon.type === 'cash'" :size="20"><Money /></el-icon>
                <el-icon v-else-if="coupon.type === 'discount'" :size="20"><Percentage /></el-icon>
                <el-icon v-else :size="20"><Van /></el-icon>
              </div>

              <template v-if="coupon.type === 'cash'">
                <span class="text-xs opacity-90 mb-[-4px]">¥</span>
                <span class="text-4xl font-bold tracking-tight">{{ coupon.value }}</span>
              </template>
              <template v-else-if="coupon.type === 'discount'">
                <span class="text-4xl font-bold tracking-tight">{{ coupon.value }}</span>
                <span class="text-lg font-medium">折</span>
              </template>
              <template v-else>
                <span class="text-xl font-bold">免运费</span>
              </template>

              <p class="text-[10px] opacity-80 mt-1 text-center leading-tight">
                {{ coupon.minOrder > 0 ? `满${coupon.minOrder}可用` : '无门槛' }}
              </p>
            </div>

            <!-- 右侧信息区域 -->
            <div class="flex-1 p-4 bg-white min-w-0 relative">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <el-tag :type="getTypeTagType(coupon)" size="small" effect="light" round>
                    {{ getTypeLabel(coupon) }}
                  </el-tag>
                  <h3 class="font-semibold text-text-primary text-sm line-clamp-1 pr-2">{{ coupon.name }}</h3>
                </div>
              </div>

              <p class="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{{ coupon.desc || coupon.description }}</p>

              <div class="space-y-1 text-[11px] text-gray-400">
                <div class="flex items-center gap-1">
                  <el-icon :size="12"><Clock /></el-icon>
                  <span>有效期: {{ formatDateRange(coupon) }}</span>
                </div>
                <div v-if="coupon.status === 'used' && coupon.usedAt" class="flex items-center gap-1 text-blue-500">
                  <el-icon :size="12"><CircleCheck /></el-icon>
                  <span>使用时间: {{ coupon.usedAt }}</span>
                </div>
                <div v-if="isExpiringSoon(coupon)" class="flex items-center gap-1 text-orange-500 font-medium">
                  <el-icon :size="12"><WarningFilled /></el-icon>
                  <span>{{ daysLeft(coupon) }}天后过期</span>
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-dashed border-gray-100">
                <p class="text-[11px] text-gray-300">{{ coupon.scope || coupon.desc || '全场通用' }}</p>
              </div>

              <!-- 操作按钮 -->
              <div v-if="coupon.status === 'available'" class="mt-3 flex gap-2">
                <button @click.stop="useCoupon(coupon)"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-md transition-shadow">
                  立即使用
                </button>
                <button @click.stop="shareCoupon(coupon)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors">
                  分享给好友
                </button>
              </div>
            </div>
          </div>

          <!-- 锯齿边缘装饰 -->
          <div class="absolute left-36 top-0 bottom-0 w-3 overflow-hidden pointer-events-none">
            <div class="absolute top-[-12px] left-0 w-6 h-6 bg-gray-50 rounded-full"></div>
            <div class="absolute bottom-[-12px] left-0 w-6 h-6 bg-gray-50 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 py-20 text-center">
        <div class="w-28 h-28 mx-auto mb-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center">
          <el-icon :size="48" class="text-orange-300"><Ticket /></el-icon>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">
          {{ emptyText }}
        </h3>
        <p class="text-sm text-gray-400 mb-6" v-if="activeTab !== 'available'">快去领取新券吧~</p>
        <el-button type="warning" round class="!rounded-full !px-8" @click="$router.push('/')" v-if="activeTab === 'available'">去购物</el-button>
      </div>

      <!-- 领取中心 -->
      <div class="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6">
        <h3 class="font-bold text-orange-700 mb-3 flex items-center gap-2">
          <el-icon><Present /></el-icon>
          领取中心
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="item in claimableCoupons" :key="item.id"
            class="bg-white rounded-xl p-4 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group cursor-pointer"
            @click="claimCoupon(item)">
            <div class="flex items-baseline gap-1 mb-1">
              <span class="text-2xl font-bold" :class="item.type === 'cash' ? 'text-red-500' : item.type === 'discount' ? 'text-green-500' : 'text-blue-500'">
                {{ item.type === 'cash' ? `¥${item.value}` : item.type === 'discount' ? `${item.value}折` : '免运费' }}
              </span>
              <span class="text-xs text-gray-400">{{ item.condition >= 0 ? `满${item.condition}` : '无门槛' }}</span>
            </div>
            <p class="text-xs text-gray-500 line-clamp-1">{{ item.name }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-[10px] text-gray-400">剩余 {{ item.remaining }} 张</span>
              <span class="text-xs text-orange-500 font-medium group-hover:text-orange-600 transition-colors">领取 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Ticket, Money, DataLine, Van, Clock, CircleCheck,
  WarningFilled, Present
} from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const router = useRouter()
const route = useRoute()
const communityStore = useCommunityStore()

const activeTab = ref('available')

// Tab 配置，包含即将过期
const tabs = computed(() => {
  const coupons = communityStore.coupons
  const now = new Date()

  return [
    { label: '全部可用', value: 'available', count: coupons.filter(c => c.status === 'available').length },
    {
      label: '即将过期',
      value: 'expiring_soon',
      count: coupons.filter(c => {
        if (c.status !== 'available') return false
        const expDate = new Date(c.expireDate || c.validTo)
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 3 && diffDays > 0
      }).length
    },
    { label: '已使用', value: 'used', count: coupons.filter(c => c.status === 'used').length },
    { label: '已过期', value: 'expired', count: coupons.filter(c => c.status === 'expired').length }
  ]
})

const coupons = computed(() => communityStore.coupons)

// 可领取的优惠券
const claimableCoupons = [
  { id: 101, name: '限时抢购 ¥50券', type: 'cash', value: 50, condition: 299, remaining: 128 },
  { id: 102, name: '周末特惠 8.5折券', type: 'discount', value: 8.5, condition: 99, remaining: 56 },
  { id: 103, name: '新用户礼包 ¥10券', type: 'cash', value: 10, condition: 49, remaining: 342 },
  { id: 104, name: '免运费专享券', type: 'free_shipping', value: 0, condition: 0, remaining: 89 },
  { id: 105, name: '数码品类 ¥100券', type: 'cash', value: 100, condition: 599, remaining: 45 }
]

// 过滤后的优惠券列表
const filteredCoupons = computed(() => {
  const now = new Date()
  let result = coupons.value

  if (activeTab.value === 'expiring_soon') {
    // 即将过期：可用且剩余天数 <= 3天
    result = result.filter(c => {
      if (c.status !== 'available') return false
      const expDate = new Date(c.expireDate || c.validTo)
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays > 0
    })
  } else {
    result = result.filter(c => c.status === activeTab.value)
  }

  return result
})

// 空状态文本
const emptyText = computed(() => {
  switch (activeTab.value) {
    case 'available': return '暂无可用优惠券'
    case 'expiring_soon': return '暂无即将过期的优惠券'
    case 'used': return '暂无已使用优惠券'
    case 'expired': return '暂无已过期优惠券'
    default: return '暂无优惠券'
  }
})

// 判断是否即将过期（<= 3天）
function isExpiringSoon(coupon: any): boolean {
  if (coupon.status !== 'available') return false
  const expDate = new Date(coupon.expireDate || coupon.validTo)
  const now = new Date()
  const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

// 获取剩余天数
function daysLeft(coupon: any): number {
  const now = new Date()
  const exp = new Date(coupon.expireDate || coupon.validTo)
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

// 优惠券卡片样式类
function couponClass(coupon: any): string {
  if (coupon.status === 'expired') return 'opacity-60 grayscale-[30%]'
  if (coupon.status === 'used') return 'opacity-70 grayscale-[20%]'
  if (isExpiringSoon(coupon)) return 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer expiring-pulse'
  return 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
}

// 根据类型获取渐变背景
function getTypeGradient(coupon: any): string {
  if (coupon.type === 'cash') {
    return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' // 红色主题
  } else if (coupon.type === 'discount') {
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // 绿色主题
  } else if (coupon.type === 'free_shipping') {
    return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' // 蓝色主题
  }
  return 'linear-gradient(135deg, #f97316, #ea580c)' // 默认橙色
}

// 获取类型标签文本
function getTypeLabel(coupon: any): string {
  if (coupon.type === 'cash') return '现金券'
  if (coupon.type === 'discount') return '折扣券'
  if (coupon.type === 'free_shipping') return '免运费券'
  return '通用券'
}

// 获取标签类型
function getTypeTagType(coupon: any): 'danger' | 'success' | 'primary' | 'info' {
  if (coupon.type === 'cash') return 'danger'
  if (coupon.type === 'discount') return 'success'
  if (coupon.type === 'free_shipping') return 'primary'
  return 'info'
}

// 格式化日期范围
function formatDateRange(coupon: any): string {
  try {
    const from = new Date(coupon.validFrom)
    const to = new Date(coupon.expireDate || coupon.validTo)
    const format = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    return `${format(from)}-${format(to)}`
  } catch {
    return coupon.expireDate || coupon.validTo || ''
  }
}

// 使用优惠券
function useCoupon(coupon: any) {
  const orderId = route.query.orderId
  if (orderId) {
    // 如果有订单ID参数，直接核销
    ElMessage.success(`正在使用「${coupon.name}」核销订单 ${orderId}...`)
  } else {
    // 否则跳转到商品页带上couponId
    ElMessage.success(`正在跳转使用「${coupon.name}」...`)
    router.push({ path: '/products', query: { couponId: coupon.id } })
  }
}

// 分享优惠券
function shareCoupon(coupon: any) {
  ElMessage.success(`分享功能开发中：「${coupon.name}」`)
}

// 领取优惠券
async function claimCoupon(item: any) {
  try {
    await communityStore.claimCoupon(item.id)
    ElMessage.success(`成功领取「${item.name}」！`)
    await communityStore.fetchCoupons()
  } catch (err: any) {
    ElMessage.error(err.message || '领取失败')
  }
}

onMounted(async () => {
  try {
    await communityStore.fetchCoupons()
  } catch (err: any) {
    ElMessage.error(err.message || '获取优惠券列表失败')
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ========== 即将过期脉冲动画 ========== */
.expiring-pulse {
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(249, 115, 22, 0);
  }
}

/* ========== 即将过期标签 ========== */
.expiring-badge {
  background: linear-gradient(135deg, #f97316, #ea580c);
  padding: 8px 32px;
  transform: rotate(45deg) translate(30%, -150%);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
}

.expiring-text {
  color: white;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
}

/* ========== 戳记效果 ========== */
.stamp-mark {
  font-size: 24px;
  font-weight: bold;
  color: rgba(156, 163, 175, 0.9);
  background: rgba(229, 231, 235, 0.7);
  padding: 12px 28px;
  border-radius: 8px;
  transform: rotate(-12deg);
  border: 3px solid rgba(156, 163, 175, 0.5);
  letter-spacing: 4px;
  backdrop-filter: blur(4px);
}

/* ========== 类型图标 ========== */
.type-icon {
  opacity: 0.9;
}

/* ========== 左侧样式 ========== */
.coupon-left-side {
  position: relative;
  overflow: hidden;
}

.coupon-left-side::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  pointer-events: none;
}
</style>
