<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import IconSet from '@/components/icons/IconSet.vue'

const router = useRouter()
const store = usePaymentStore()

onMounted(async () => {
  await Promise.all([store.fetchItems(), store.fetchSummary()])
})

const unpaidItems = computed(() => store.items.filter(i => i.status === 'unpaid' || i.status === 'overdue'))
const paidItems = computed(() => store.items.filter(i => i.status === 'paid'))
const overdueCount = computed(() => store.items.filter(i => i.status === 'overdue').length)

function formatAmount(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return '0.00'
  }
  return amount.toFixed(2)
}
</script>

<template>
  <div class="space-y-8">
    <!-- 骨架屏加载 - 现代化设计 -->
    <div v-if="store.loading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="relative overflow-hidden p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent skeleton-shimmer"></div>
          <div class="h-4 w-20 bg-slate-200 rounded mb-3"></div>
          <div class="h-8 w-28 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div class="h-48 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden relative">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent skeleton-shimmer"></div>
      </div>
      <div class="h-64 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden relative">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent skeleton-shimmer"></div>
      </div>
    </div>

    <template v-else>
      <!-- 汇总卡片 - 现代化财务风格设计 -->
      <section v-if="store.summary" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 待缴总额 -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-20 h-20 bg-rose-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center border border-rose-200/50 group-hover:scale-110 transition-transform duration-300">
                <IconSet name="currency-dollar" size="md" color="#f43f5e" />
              </div>
              <span class="text-sm text-slate-500 font-medium">待缴总额</span>
            </div>
            <p class="text-2xl font-bold text-rose-600 tracking-tight">¥{{ formatAmount(store.summary.totalDue) }}</p>
            <div class="mt-2 flex items-center gap-1 text-xs text-rose-500/70">
              <IconSet name="arrow-trending-up" size="xs" color="#f43f5e" />
              <span>需尽快处理</span>
            </div>
          </div>
        </div>

        <!-- 已缴金额 -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-20 h-20 bg-emerald-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
                <IconSet name="check-circle" size="md" color="#10b981" />
              </div>
              <span class="text-sm text-slate-500 font-medium">已缴金额</span>
            </div>
            <p class="text-2xl font-bold text-emerald-600 tracking-tight">¥{{ formatAmount(store.summary.totalPaid) }}</p>
            <div class="mt-2 flex items-center gap-1 text-xs text-emerald-500/70">
              <IconSet name="shield-check" size="xs" color="#10b981" />
              <span>缴费正常</span>
            </div>
          </div>
        </div>

        <!-- 逾期未缴 -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-20 h-20 bg-amber-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200/50 group-hover:scale-110 transition-transform duration-300">
                <IconSet name="clock" size="md" color="#f59e0b" />
              </div>
              <span class="text-sm text-slate-500 font-medium">逾期未缴</span>
            </div>
            <p class="text-2xl font-bold" :class="overdueCount > 0 ? 'text-amber-600' : 'text-emerald-600'">
              ¥{{ formatAmount(store.summary.totalOverdue) }}
            </p>
            <div class="mt-2 flex items-center gap-1 text-xs" :class="overdueCount > 0 ? 'text-amber-500/70' : 'text-emerald-500/70'">
              <IconSet name="exclamation-circle" size="xs" :color="overdueCount > 0 ? '#f59e0b' : '#10b981'" />
              <span>{{ overdueCount > 0 ? '请尽快处理' : '无逾期' }}</span>
            </div>
          </div>
        </div>

        <!-- 待缴项目 -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-20 h-20 bg-blue-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                <IconSet name="clipboard-document" size="md" color="#3b82f6" />
              </div>
              <span class="text-sm text-slate-500 font-medium">待缴项目</span>
            </div>
            <p class="text-2xl font-bold text-blue-600 tracking-tight">{{ store.summary.itemCounts?.unpaid ?? 0 }}</p>
            <div class="mt-2 flex items-center gap-1 text-xs text-blue-500/70">
              <IconSet name="document-text" size="xs" color="#3b82f6" />
              <span>待处理账单</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 待缴费项目 - 现代化卡片设计 -->
      <section v-if="unpaidItems.length > 0" class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400"></div>
        
        <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                <IconSet name="bell" size="md" color="#f43f5e" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">待缴费项目</h2>
                <p class="text-xs text-slate-500 mt-0.5">请及时完成缴费，避免影响学业</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="overdueCount > 0" class="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/30 animate-pulse">
                {{ overdueCount }}项逾期
              </span>
              <span class="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">共 {{ unpaidItems.length }} 项</span>
            </div>
          </div>
        </div>

        <div class="divide-y divide-slate-100">
          <div v-for="(item, index) in unpaidItems" :key="item.id"
            @click="router.push(item.type === 'tuition' ? '/payment/tuition' : '/payment/dormitory-fee')"
            class="group relative p-6 cursor-pointer hover:bg-slate-50/80 transition-all duration-300"
            :class="item.status === 'overdue' ? 'bg-rose-50/30' : ''"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <!-- 悬停效果背景 -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <div class="relative flex items-start justify-between">
              <div class="flex items-start gap-4">
                <div :class="[
                  'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md',
                  item.status === 'overdue' 
                    ? 'bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200' 
                    : 'bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200'
                ]">
                  <IconSet :name="item.type === 'tuition' ? 'academic-cap' : 'home'" 
                    size="lg" 
                    :color="item.status === 'overdue' ? '#f43f5e' : '#f59e0b'" />
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-semibold text-slate-900 text-base">{{ item.name }}</span>
                    <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide',
                      item.status === 'overdue' 
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm' 
                        : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700']">
                      {{ item.status === 'overdue' ? '已逾期' : '待缴费' }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 flex items-center gap-2">
                    <IconSet name="calendar" size="xs" color="#94a3b8" />
                    {{ item.academicYear }}{{ item.semester ? ` · ${item.semester}` : '' }}
                  </p>
                  <p class="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <IconSet name="clock" size="xs" color="#cbd5e1" />
                    截止日期：{{ item.dueDate }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold tracking-tight" :class="item.status === 'overdue' ? 'text-rose-600' : 'text-amber-600'">
                  ¥{{ formatAmount(item.amount) }}
                </p>
                <div class="mt-2 flex items-center justify-end gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span class="text-xs font-medium">去缴费</span>
                  <IconSet name="chevron-right" size="sm" color="currentColor" class="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
          <button @click="router.push('/payment/tuition')" 
            class="group relative w-full py-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-semibold shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-[1.01] transition-all duration-300 overflow-hidden">
            <!-- 光效动画 -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div class="relative flex items-center justify-center gap-2">
              <IconSet name="currency-dollar" size="md" color="white" />
              <span>立即缴费</span>
              <IconSet name="arrow-right" size="sm" color="white" class="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      <!-- 已完成缴费 - 现代化设计 -->
      <section v-if="paidItems.length > 0" class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400"></div>
        
        <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/30 to-transparent">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <IconSet name="check-circle" size="md" color="#10b981" />
            </div>
            <h2 class="text-lg font-bold text-slate-900">已完成缴费</h2>
          </div>
        </div>

        <div class="divide-y divide-slate-100">
          <div v-for="(item, index) in paidItems.slice(0, 3)" :key="item.id"
            class="group p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-300">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
                <IconSet :name="item.type === 'tuition' ? 'academic-cap' : 'home'" size="md" color="#10b981" />
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <IconSet name="calendar" size="xs" color="#94a3b8" />
                  {{ item.academicYear }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-lg font-bold text-emerald-600">¥{{ formatAmount(item.amount) }}</p>
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <IconSet name="check" size="xs" color="#059669" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="paidItems.length > 3" class="p-4 border-t border-slate-100 text-center bg-gradient-to-r from-slate-50/30 to-transparent">
          <button @click="router.push('/payment/records')" 
            class="group text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5">
            查看全部 {{ paidItems.length }} 条记录
            <IconSet name="arrow-right" size="xs" color="currentColor" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <!-- 空状态 - 现代化设计 -->
      <div v-if="!store.loading && store.items.length === 0" class="relative text-center py-20">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
            <IconSet name="clipboard-document" size="2xl" color="#94a3b8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">暂无缴费项目</h3>
          <p class="text-slate-500">当前没有待缴费或已缴费的项目</p>
        </div>
      </div>

      <!-- 快捷入口 - 现代化渐变卡片 -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- 绿色通道 -->
        <div @click="router.push('/payment/green-channel')"
          class="group relative overflow-hidden rounded-2xl p-6 cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative flex items-start justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <IconSet name="shield-check" size="xl" color="white" />
              </div>
              <p class="text-xl font-bold text-white mb-1">绿色通道</p>
              <p class="text-sm text-emerald-100">学费缓缴申请</p>
            </div>
            <IconSet name="arrow-right" size="lg" color="white" class="opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
          </div>
        </div>

        <!-- 缴费记录 -->
        <div @click="router.push('/payment/records')"
          class="group relative overflow-hidden rounded-2xl p-6 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative flex items-start justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <IconSet name="clipboard-document" size="xl" color="white" />
              </div>
              <p class="text-xl font-bold text-white mb-1">缴费记录</p>
              <p class="text-sm text-blue-100">历史缴费查询</p>
            </div>
            <IconSet name="arrow-right" size="lg" color="white" class="opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
          </div>
        </div>

        <!-- 咨询帮助 -->
        <div class="group relative overflow-hidden rounded-2xl p-6 cursor-pointer shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative flex items-start justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <IconSet name="headphones" size="xl" color="white" />
              </div>
              <p class="text-xl font-bold text-white mb-1">咨询帮助</p>
              <p class="text-sm text-slate-300">联系财务处</p>
            </div>
            <IconSet name="arrow-right" size="lg" color="white" class="opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* 骨架屏闪光动画 */
@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-shimmer {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

/* 柔和脉冲动画 */
@keyframes pulse-soft {
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 4s ease-in-out infinite;
}

/* 弹跳进入动画 */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

/* 列表项进入动画 */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式优化 */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer,
  .animate-pulse-soft,
  .animate-bounce-in,
  .group-hover\:scale-110,
  .group-hover\:translate-x-1,
  .group-hover\:translate-x-2,
  .group-hover\:translate-x-\[100\%\],
  .group-hover\:opacity-100 {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .group:active {
    transform: scale(0.98);
  }
}
</style>
