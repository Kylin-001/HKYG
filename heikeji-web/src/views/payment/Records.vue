<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import IconSet from '@/components/icons/IconSet.vue'

const store = usePaymentStore()

const filterType = ref('')
const filterStatus = ref('')

const filteredRecords = computed(() => {
  let records = store.records
  if (filterType.value) {
    records = records.filter(r => r.method === filterType.value)
  }
  if (filterStatus.value) {
    records = records.filter(r => r.status === filterStatus.value)
  }
  return records
})

const methodLabel: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  bank: '银行转账',
  offline: '线下缴费',
}

const methodColor: Record<string, { bg: string; text: string; icon: string }> = {
  wechat: { bg: 'bg-emerald-500', text: 'text-emerald-600', icon: '#10b981' },
  alipay: { bg: 'bg-blue-500', text: 'text-blue-600', icon: '#3b82f6' },
  bank: { bg: 'bg-amber-500', text: 'text-amber-600', icon: '#f59e0b' },
  offline: { bg: 'bg-purple-500', text: 'text-purple-600', icon: '#8b5cf6' },
}

const statusLabel: Record<string, { text: string; bg: string; textColor: string; icon: string }> = {
  success: { text: '成功', bg: 'bg-emerald-100', textColor: 'text-emerald-700', icon: '#10b981' },
  failed: { text: '失败', bg: 'bg-rose-100', textColor: 'text-rose-700', icon: '#f43f5e' },
  pending: { text: '处理中', bg: 'bg-amber-100', textColor: 'text-amber-700', icon: '#f59e0b' },
  refunded: { text: '已退款', bg: 'bg-slate-100', textColor: 'text-slate-600', icon: '#64748b' },
}

const totalAmount = computed(() => {
  return filteredRecords.value
    .filter(r => r.status === 'success')
    .reduce((sum, r) => sum + r.amount, 0)
})

onMounted(() => store.fetchRecords())
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题区 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center border border-indigo-200">
          <IconSet name="clipboard-document-list" size="xl" color="#6366f1" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">缴费记录</h2>
          <p class="text-sm text-slate-500">查看历史缴费明细</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
        <IconSet name="currency-dollar" size="sm" color="#10b981" />
        <span class="text-sm text-emerald-700">
          累计缴费 <span class="font-bold">¥{{ totalAmount.toFixed(2) }}</span>
        </span>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
      <div class="flex items-center gap-2">
        <IconSet name="funnel" size="sm" color="#64748b" />
        <span class="text-sm font-medium text-slate-600">筛选：</span>
      </div>
      <select v-model="filterType"
        class="px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer">
        <option value="">全部方式</option>
        <option value="wechat">微信支付</option>
        <option value="alipay">支付宝</option>
        <option value="bank">银行转账</option>
        <option value="offline">线下缴费</option>
      </select>
      <select v-model="filterStatus"
        class="px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer">
        <option value="">全部状态</option>
        <option value="success">成功</option>
        <option value="pending">处理中</option>
        <option value="failed">失败</option>
        <option value="refunded">已退款</option>
      </select>
      <button v-if="filterType || filterStatus" @click="filterType = ''; filterStatus = ''"
        class="ml-auto px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
        清除筛选
      </button>
    </div>

    <!-- 记录列表 -->
    <section class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
      
      <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/30 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
              <IconSet name="receipt" size="md" color="#6366f1" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">缴费明细</h3>
              <p class="text-xs text-slate-500 mt-0.5">共 {{ filteredRecords.length }} 条记录</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredRecords.length > 0" class="divide-y divide-slate-100">
        <div v-for="(record, index) in filteredRecords" :key="record.id"
          class="group p-5 hover:bg-slate-50/80 transition-all duration-300"
          :style="{ animationDelay: `${index * 30}ms` }">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- 支付方式图标 -->
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110',
                methodColor[record.method]?.bg || 'bg-slate-500']">
                <IconSet 
                  :name="record.method === 'wechat' ? 'wechat' : record.method === 'alipay' ? 'alipay' : 'banknote'" 
                  size="lg" 
                  color="white" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-sm font-semibold text-slate-900">{{ methodLabel[record.method] || record.method }}</p>
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold',
                    statusLabel[record.status]?.bg,
                    statusLabel[record.status]?.textColor]">
                    {{ statusLabel[record.status]?.text }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 flex items-center gap-2">
                  <IconSet name="calendar" size="xs" color="#94a3b8" />
                  {{ record.paidAt }}
                  <span class="text-slate-300">|</span>
                  <IconSet name="hashtag" size="xs" color="#94a3b8" />
                  流水号 {{ record.transactionNo.slice(-8) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold" :class="record.status === 'success' ? 'text-emerald-600' : 'text-slate-600'">
                {{ record.status === 'refunded' ? '-' : '+' }}¥{{ record.amount.toFixed(2) }}
              </p>
              <button class="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <IconSet name="document-search" size="2xl" color="#94a3b8" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">暂无缴费记录</h3>
        <p class="text-slate-500 text-sm">
          {{ filterType || filterStatus ? '当前筛选条件下没有记录，请尝试其他筛选条件' : '您还没有任何缴费记录' }}
        </p>
      </div>
    </section>

    <!-- 统计卡片 -->
    <div v-if="filteredRecords.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="group p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <IconSet name="check-circle" size="sm" color="#10b981" />
          </div>
          <span class="text-xs text-slate-500">成功</span>
        </div>
        <p class="text-lg font-bold text-emerald-600">
          {{ filteredRecords.filter(r => r.status === 'success').length }}
        </p>
      </div>
      <div class="group p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <IconSet name="clock" size="sm" color="#f59e0b" />
          </div>
          <span class="text-xs text-slate-500">处理中</span>
        </div>
        <p class="text-lg font-bold text-amber-600">
          {{ filteredRecords.filter(r => r.status === 'pending').length }}
        </p>
      </div>
      <div class="group p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
            <IconSet name="x-circle" size="sm" color="#f43f5e" />
          </div>
          <span class="text-xs text-slate-500">失败</span>
        </div>
        <p class="text-lg font-bold text-rose-600">
          {{ filteredRecords.filter(r => r.status === 'failed').length }}
        </p>
      </div>
      <div class="group p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <IconSet name="arrow-uturn-left" size="sm" color="#64748b" />
          </div>
          <span class="text-xs text-slate-500">已退款</span>
        </div>
        <p class="text-lg font-bold text-slate-600">
          {{ filteredRecords.filter(r => r.status === 'refunded').length }}
        </p>
      </div>
    </div>
  </div>
</template>
