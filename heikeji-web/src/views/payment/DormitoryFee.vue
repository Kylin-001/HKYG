<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import { House, InfoFilled } from '@element-plus/icons-vue'

const store = usePaymentStore()
const selectedIds = ref<string[]>([])

const dormitoryItems = computed(() =>
  store.items.filter(i => i.type === 'dormitory')
)

const totalSelected = computed(() =>
  dormitoryItems.value
    .filter(i => selectedIds.value.includes(i.id))
    .reduce((sum, i) => sum + i.amount, 0)
)

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function selectAll() {
  const unpaid = dormitoryItems.value.filter(i => i.status !== 'paid')
  if (selectedIds.value.length === unpaid.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = unpaid.map(i => i.id)
  }
}

async function handlePay() {
  if (selectedIds.value.length === 0) return ElMessage.warning('请选择要缴纳的住宿费项目')
  try {
    const res = await store.payItems(selectedIds.value, 'alipay')
    if (res.paymentUrl) window.open(res.paymentUrl, '_blank')
    ElMessage.success('支付订单已创建')
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '创建支付失败')
  }
}

onMounted(() => store.fetchItems())
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <section class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-5">
      <h2 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <el-icon :size="20" class="text-primary"><House /></el-icon> 住宿费缴纳
      </h2>

      <div v-if="dormitoryItems.length > 0" class="space-y-3">
        <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-primary-50/30 transition-colors">
          <input type="checkbox" :checked="selectedIds.length === dormitoryItems.filter(i => i.status !== 'paid').length && dormitoryItems.filter(i => i.status !== 'paid').length > 0"
            @change="selectAll"
            class="w-4 h-4 rounded border-primary-200 text-primary focus:ring-primary" />
          <span class="text-sm text-text-secondary">全选未缴项目</span>
        </label>
        <div v-for="item in dormitoryItems" :key="item.id"
          :class="['flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer',
            item.status === 'paid' ? 'border-pine/15 bg-pine/5 opacity-60' :
            item.status === 'overdue' ? 'border-crimson/30 bg-crimson/5' :
            selectedIds.includes(item.id) ? 'border-gold bg-gold/5' : 'border-primary-50/50 hover:border-primary-200']"
          @click="item.status !== 'paid' && toggleSelect(item.id)">
          
          <input v-if="item.status !== 'paid'" type="checkbox" :checked="selectedIds.includes(item.id)"
            class="w-4 h-4 rounded border-primary-200 text-primary focus:ring-primary shrink-0 pointer-events-none" />
          <div v-else class="w-4 h-4 shrink-0"></div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-text-primary">{{ item.name }}</p>
              <span v-if="item.status === 'paid'" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pine/10 text-pine">已缴</span>
            </div>
            <p class="text-xs text-text-tertiary mt-0.5">{{ item.academicYear }} · 截止 {{ item.dueDate }}</p>
          </div>
          <p class="text-base font-bold shrink-0" :class="item.status === 'paid' ? 'text-pine' : 'text-gold'">
            ¥{{ item.amount.toFixed(2) }}
          </p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/50 flex items-center justify-center">
          <el-icon :size="24" class="text-primary/40"><House /></el-icon>
        </div>
        <p class="text-text-tertiary text-sm">暂无住宿费缴费项目</p>
      </div>

      <div v-if="totalSelected > 0" class="mt-4 pt-4 border-t border-primary-50 flex items-center justify-between">
        <div>
          <span class="text-sm text-text-secondary">已选 {{ selectedIds.length }} 项，合计：</span>
          <span class="text-xl font-bold text-gold ml-1">¥{{ totalSelected.toFixed(2) }}</span>
        </div>
        <button @click="handlePay" :disabled="store.loading"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-sm font-semibold shadow-gold disabled:opacity-50 transition-all">
          支付宝支付
        </button>
      </div>
    </section>

    <section class="bg-info/5 rounded-2xl border border-info/10 p-4">
      <p class="text-xs font-medium text-info mb-1 flex items-center gap-1"><el-icon :size="14"><InfoFilled /></el-icon> 温馨提示</p>
      <ul class="text-xs text-text-tertiary space-y-1 mt-2 list-disc list-inside">
        <li>住宿费按学年缴纳，标准为1200元/年（四人间）</li>
        <li>如需调整宿舍或退宿，请联系后勤管理处</li>
        <li>缴费成功后电子票据将发送至您的校园邮箱</li>
      </ul>
    </section>
  </div>
</template>
