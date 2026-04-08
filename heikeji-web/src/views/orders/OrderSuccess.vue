<template>
  <div class="order-success-page min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <!-- 成功图标动画 -->
      <div class="text-center mb-10">
        <div class="success-icon-wrapper mb-6">
          <div class="success-circle">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#10B981" stroke-width="2"/>
              <path fill="none" stroke="#10B981" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-3">🎉 订单提交成功！</h1>
        <p class="text-lg text-gray-600">感谢您在黑科易购的购买</p>
      </div>

      <!-- 订单信息卡片 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-green-100">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800">订单详情</h2>
          <el-tag type="success" size="large" effect="dark" round>
            {{ orderStatus }}
          </el-tag>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between py-3">
            <span class="text-gray-500">订单编号</span>
            <div class="flex items-center gap-2">
              <span class="font-mono font-semibold text-gray-800">{{ orderNo }}</span>
              <button
                @click="copyOrderNo"
                class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="复制订单号"
              >
                <svg class="w-4 h-4 text-gray-400 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3">
            <span class="text-gray-500">下单时间</span>
            <span class="font-medium text-gray-800">{{ orderTime }}</span>
          </div>

          <div class="flex items-center justify-between py-3">
            <span class="text-gray-500">支付方式</span>
            <span class="font-medium text-gray-800">{{ paymentMethod }}</span>
          </div>

          <div class="flex items-center justify-between py-3">
            <span class="text-gray-500">商品数量</span>
            <span class="font-medium text-gray-800">{{ itemCount }} 件</span>
          </div>

          <div class="border-t border-dashed border-gray-200 my-4"></div>

          <div class="flex items-center justify-between pt-4">
            <span class="text-lg text-gray-700">支付金额</span>
            <span class="text-3xl font-bold text-red-500">¥{{ totalAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 物流信息提示 -->
      <div class="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-blue-900 mb-1">物流提醒</h3>
            <p class="text-sm text-blue-700 leading-relaxed">
              商家将在24小时内发货，届时您可以在此查看物流信息。
              如有疑问，请联系客服。
            </p>
          </div>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <router-link
          :to="`/orders/${orderId}`"
          class="flex items-center justify-center gap-2 px-6 py-4 bg-white rounded-xl font-semibold text-gray-700 shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-green-300 hover:text-green-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          查看订单
        </router-link>

        <router-link
          to="/products"
          class="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          继续购物
        </router-link>
      </div>

      <!-- 推荐商品 -->
      <div v-if="recommendations.length > 0" class="bg-white rounded-2xl p-6 shadow-md">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🔥 猜你喜欢</h3>
        <div class="grid grid-cols-3 gap-4">
          <router-link
            v-for="item in recommendations"
            :key="item.id"
            :to="`/products/${item.id}`"
            class="group bg-gray-50 rounded-xl p-3 hover:bg-green-50 transition-all hover:shadow-md"
          >
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 class="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
              {{ item.name }}
            </h4>
            <p class="text-base font-bold text-red-500 mt-2">¥{{ item.price }}</p>
          </router-link>
        </div>
      </div>

      <!-- 倒计时自动跳转提示 -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          <span id="countdown">{{ countdown }}</span> 秒后自动跳转到
          <router-link to="/orders" class="text-green-600 hover:underline font-medium">订单列表</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const countdown = ref(10)
let timer: ReturnType<typeof setInterval> | null = null

const orderId = computed(() => (route.params.id as string) || 'ORD202604050001')
const orderNo = computed(() => `HK${Date.now().toString().slice(-10)}`)
const orderTime = ref(new Date().toLocaleString('zh-CN'))
const totalAmount = computed(() => {
  const amount = (route.query.amount as string) || '299.00'
  return parseFloat(amount).toFixed(2)
})
const itemCount = computed(() => parseInt((route.query.count as string) || '3'))
const paymentMethod = computed(() => {
  const method: Record<string, string> = {
    wechat: '微信支付',
    alipay: '支付宝',
    campus_card: '校园卡',
    balance: '余额支付'
  }
  return method[(route.query.payMethod as string) || 'wechat'] || '微信支付'
})

const orderStatus = computed(() => {
  if (route.query.paid === 'true') return '已支付'
  if (route.query.status === 'pending') return '待支付'
  return '待处理'
})

const recommendations = [
  { id: 101, name: 'Apple AirPods Pro 2代', price: 1799, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&h=200&fit=crop' },
  { id: 102, name: '小米手环8 NFC版', price: 269, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop' },
  { id: 103, name: '罗技MX Master 3S', price: 799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop' }
]

function copyOrderNo(): void {
  navigator.clipboard?.writeText(orderNo.value).then(() => {
    ElMessage.success('订单号已复制')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

onMounted(() => {
  document.title = '订单成功 - 黑科易购'

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      router.push('/orders')
    }
  }, 1000)

  if (route.query.autoPay === 'true') {
    setTimeout(() => {
      ElMessage.success('模拟支付成功！')
    }, 1500)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.success-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.success-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s ease-out;
}

.checkmark {
  width: 64px;
  height: 64px;
  animation: checkDraw 0.4s ease-out 0.3s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkDraw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
