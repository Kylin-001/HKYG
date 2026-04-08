<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import { ArrowRight, Warning, CircleCheck, Clock } from '@element-plus/icons-vue'

const router = useRouter()
const store = usePaymentStore()

onMounted(async () => {
  await Promise.all([store.fetchItems(), store.fetchSummary()])
})

const unpaidItems = computed(() => store.items.filter(i => i.status === 'unpaid' || i.status === 'overdue'))
const paidItems = computed(() => store.items.filter(i => i.status === 'paid'))
const overdueCount = computed(() => store.items.filter(i => i.status === 'overdue').length)

function formatAmount(amount: number): string {
  return amount.toFixed(2)
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 骨架屏加载 -->
    <div v-if="store.loading" class="space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="p-4 rounded-2xl bg-gold/10 animate-pulse">
          <div class="h-3 w-16 bg-white/40 rounded mb-2 mx-auto"></div>
          <div class="h-7 w-20 bg-white/30 rounded mx-auto"></div>
        </div>
      </div>
      <div class="h-40 rounded-2xl bg-gold/10 animate-pulse"></div>
      <div class="h-48 rounded-2xl bg-gold/10 animate-pulse"></div>
    </div>

    <template v-else>
    <!-- 汇总卡片 -->
    <section v-if="store.summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-4 text-center">
        <p class="text-[11px] text-text-tertiary mb-1">待缴总额</p>
        <p class="text-xl font-bold text-crimson">¥{{ formatAmount(store.summary.totalDue) }}</p>
      </div>
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-4 text-center">
        <p class="text-[11px] text-text-tertiary mb-1">已缴金额</p>
        <p class="text-xl font-bold text-pine">¥{{ formatAmount(store.summary.totalPaid) }}</p>
      </div>
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-4 text-center">
        <p class="text-[11px] text-text-tertiary mb-1">逾期未缴</p>
        <p class="text-xl font-bold" :class="overdueCount > 0 ? 'text-crimson' : 'text-pine'">¥{{ formatAmount(store.summary.totalOverdue) }}</p>
      </div>
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-4 text-center">
        <p class="text-[11px] text-text-tertiary mb-1">待缴项目</p>
        <p class="text-xl font-bold text-primary">{{ store.summary.itemCounts.unpaid }}</p>
      </div>
    </section>

    <!-- 待缴费项目 -->
    <section v-if="unpaidItems.length > 0">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <el-icon :size="20" class="text-warning"><Warning /></el-icon>待缴费
          <span v-if="overdueCount > 0" class="px-1.5 py-0.5 rounded-full bg-crimson text-white text-[10px] font-bold">{{ overdueCount }}项逾期</span>
        </h2>
      </div>
      <div class="space-y-3">
        <div v-for="item in unpaidItems" :key="item.id"
          @click="router.push(item.type === 'tuition' ? '/payment/tuition' : '/payment/dormitory-fee')"
          class="bg-white/90 backdrop-blur-md rounded-xl border p-4 cursor-pointer hover:border-gold/30 hover:shadow-md transition-all"
          :class="item.status === 'overdue' ? 'border-crimson/30 bg-crimson/5' : 'border-primary-50/50'">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-sm text-text-primary">{{ item.name }}</span>
                <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold',
                  item.status === 'overdue' ? 'bg-crimson text-white' : 'bg-warning/10 text-warning']">
                  {{ item.status === 'overdue' ? '逾期' : '待缴' }}
                </span>
              </div>
              <p class="text-xs text-text-tertiary">{{ item.academicYear }}{{ item.semester ? ` · ${item.semester}` : '' }}</p>
            </div>
            <p class="text-lg font-bold" :class="item.status === 'overdue' ? 'text-crimson' : 'text-gold'">¥{{ formatAmount(item.amount) }}</p>
          </div>
          <p class="text-[11px] text-text-quaternary mt-2">截止日期：{{ item.dueDate }}</p>
        </div>
      </div>
      
      <button @click="router.push('/payment/tuition')" 
        class="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-sm font-semibold shadow-gold hover:shadow-lg transition-all">
        去缴费 →
      </button>
    </section>

    <!-- 已完成缴费 -->
    <section v-if="paidItems.length > 0">
      <h2 class="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
        <el-icon :size="18" class="text-pine"><CircleCheck /></el-icon>已完成
      </h2>
      <div class="space-y-2">
        <div v-for="item in paidItems.slice(0, 3)" :key="item.id"
          class="flex items-center justify-between p-3 rounded-xl bg-pine/5 border border-pine/10">
          <div>
            <p class="text-sm font-medium text-text-primary">{{ item.name }}</p>
            <p class="text-[11px] text-text-quaternary">{{ item.academicYear }}</p>
          </div>
          <p class="text-sm font-bold text-pine">¥{{ formatAmount(item.amount) }} ✓</p>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <div v-if="!store.loading && store.items.length === 0" class="text-center py-12">
      <p class="text-4xl mb-3">💳</p>
      <p class="text-text-tertiary text-sm">暂无缴费项目</p>
    </div>

    <!-- 快捷入口 -->
    <section class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div @click="router.push('/payment/green-channel')"
        class="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-pine/8 to-pine-light/8 border border-pine/15 cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">🌿</span>
        <div>
          <p class="text-sm font-semibold text-text-primary">绿色通道</p>
          <p class="text-[11px] text-text-tertiary">缓缴申请</p>
        </div>
      </div>
      <div @click="router.push('/payment/records')"
        class="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-primary/8 to-primary-light/8 border border-primary/15 cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">📋</span>
        <div>
          <p class="text-sm font-semibold text-text-primary">缴费记录</p>
          <p class="text-[11px] text-text-tertiary">历史查询</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-gold/8 to-gold-light/8 border border-gold/15 cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">📞</span>
        <div>
          <p class="text-sm font-semibold text-text-primary">咨询帮助</p>
          <p class="text-[11px] text-text-tertiary">财务处</p>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>
