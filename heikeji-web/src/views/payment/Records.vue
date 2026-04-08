<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment'
import { Document, Download, Wallet } from '@element-plus/icons-vue'

const store = usePaymentStore()

const filterType = ref('')

const filteredRecords = () => {
  let records = store.records
  if (filterType.value) {
    records = records.filter(r => r.method === filterType.value)
  }
  return records
}

const methodLabel: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  bank: '银行转账',
  offline: '线下缴费',
}

const methodColor: Record<string, string> = {
  wechat: '#07C160',
  alipay: '#1677FF',
  bank: '#F5A623',
  offline: '#8B5CF6',
}

const statusLabel: Record<string, { text: string; color: string }> = {
  success: { text: '成功', color: 'text-pine' },
  failed: { text: '失败', color: 'text-crimson' },
  pending: { text: '处理中', color: 'text-warning' },
  refunded: { text: '已退款', color: 'text-text-quaternary' },
}

onMounted(() => store.fetchRecords())
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <section class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <el-icon :size="20"><Document /></el-icon>缴费记录
        </h2>
        <select v-model="filterType"
          class="px-3 py-1.5 rounded-lg border border-primary-100 text-xs outline-none focus:border-primary bg-white">
          <option value="">全部方式</option>
          <option value="wechat">微信支付</option>
          <option value="alipay">支付宝</option>
          <option value="bank">银行转账</option>
          <option value="offline">线下缴费</option>
        </select>
      </div>

      <div v-if="filteredRecords().length > 0" class="space-y-2">
        <div v-for="record in filteredRecords()" :key="record.id"
          class="flex items-center justify-between p-4 rounded-xl border border-primary-50/50 hover:border-primary-100 transition-colors">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" :style="{ backgroundColor: methodColor[record.method] || '#6B7280' }">
              {{ (methodLabel[record.method] || record.method).charAt(0) }}
            </span>
            <div>
              <p class="text-sm font-medium text-text-primary">{{ methodLabel[record.method] || record.method }}</p>
              <p class="text-[11px] text-text-quaternary">{{ record.paidAt }} · {{ record.transactionNo.slice(-8) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-pine">¥{{ record.amount.toFixed(2) }}</p>
            <span :class="['text-[10px]', statusLabel[record.status]?.color]">{{ statusLabel[record.status]?.text }}</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
          <el-icon :size="24" class="text-primary/40"><Document /></el-icon>
        </div>
        <p class="text-text-tertiary text-sm">暂无缴费记录</p>
      </div>
    </section>
  </div>
</template>
