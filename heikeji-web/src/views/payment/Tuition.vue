<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import { Notebook, InfoFilled } from '@element-plus/icons-vue'

const store = usePaymentStore()
const selectedIds = ref<string[]>([])

const tuitionItems = computed(() =>
  store.items.filter(i => i.type === 'tuition')
)

const totalSelected = computed(() =>
  tuitionItems.value
    .filter(i => selectedIds.value.includes(i.id))
    .reduce((sum, i) => sum + i.amount, 0)
)

const unpaidCount = computed(() => tuitionItems.value.filter(i => i.status !== 'paid').length)

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function selectAll() {
  const unpaid = tuitionItems.value.filter(i => i.status !== 'paid')
  if (selectedIds.value.length === unpaid.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = unpaid.map(i => i.id)
  }
}

async function handlePay() {
  if (selectedIds.value.length === 0) return ElMessage.warning('请选择要缴纳的学费项目')
  try {
    const res = await store.payItems(selectedIds.value, 'wechat')
    if (res.paymentUrl) {
      window.open(res.paymentUrl, '_blank')
    }
    ElMessage.success('支付订单已创建，请在支付页面完成付款')
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
        <el-icon :size="20" class="text-gold"><Notebook /></el-icon> 学费缴纳 — {{ new Date().getFullYear() - 1 }}-{{ String(new Date().getFullYear()).slice(2) }} 学年
        <span v-if="unpaidCount > 0" class="ml-auto px-2 py-0.5 rounded-full bg-crimson/10 text-crimson text-xs font-bold">{{ unpaidCount }} 项待缴</span>
      </h2>

      <div v-if="tuitionItems.length > 0" class="space-y-3">
        <!-- 全选 -->
        <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-primary-50/30 transition-colors">
          <input type="checkbox" :checked="selectedIds.length === tuitionItems.filter(i => i.status !== 'paid').length && tuitionItems.filter(i => i.status !== 'paid').length > 0"
            @change="selectAll"
            class="w-4 h-4 rounded border-primary-200 text-primary focus:ring-primary" />
          <span class="text-sm text-text-secondary">全选（仅显示未缴项目）</span>
        </label>

        <div v-for="item in tuitionItems" :key="item.id"
          :class="['flex items-center gap-3 p-4 rounded-xl border transition-all',
            item.status === 'paid' ? 'border-pine/15 bg-pine/5 opacity-60' :
            item.status === 'overdue' ? 'border-crimson/30 bg-crimson/5' :
            'border-primary-50/50 hover:border-primary-200']">
          
          <input v-if="item.status !== 'paid'" type="checkbox" :checked="selectedIds.includes(item.id)"
            @change="toggleSelect(item.id)"
            class="w-4 h-4 rounded border-primary-200 text-primary focus:ring-primary shrink-0" />
          <div v-else class="w-4 h-4 shrink-0"></div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-text-primary truncate">{{ item.name }}</p>
              <span v-if="item.status === 'paid'" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pine/10 text-pine">已缴</span>
              <span v-else-if="item.status === 'overdue'" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-crimson text-white">逾期</span>
            </div>
            <p class="text-xs text-text-tertiary mt-0.5">{{ item.description || item.semester || '' }} · 截止 {{ item.dueDate }}</p>
          </div>
          <p class="text-base font-bold shrink-0" :class="item.status === 'paid' ? 'text-pine' : 'text-gold'">
            ¥{{ item.amount.toFixed(2) }}
          </p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
          <el-icon :size="24" class="text-gold/40"><Notebook /></el-icon>
        </div>
        <p class="text-text-tertiary text-sm">暂无学费缴费项目</p>
      </div>

      <!-- 底部结算栏 -->
      <div v-if="totalSelected > 0" class="mt-4 pt-4 border-t border-primary-50 flex items-center justify-between">
        <div>
          <span class="text-sm text-text-secondary">已选 {{ selectedIds.length }} 项，合计：</span>
          <span class="text-xl font-bold text-gold ml-1">¥{{ totalSelected.toFixed(2) }}</span>
        </div>
        <button @click="handlePay" :disabled="store.loading"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-sm font-semibold shadow-gold hover:shadow-lg disabled:opacity-50 transition-all">
          {{ store.loading ? '处理中...' : '微信支付' }}
        </button>
      </div>
    </section>

    <!-- 温馨提示 -->
    <section class="bg-info/5 rounded-2xl border border-info/10 p-4">
      <p class="text-xs font-medium text-info mb-1 flex items-center gap-1"><el-icon :size="14"><InfoFilled /></el-icon> 温馨提示</p>
      <ul class="text-xs text-text-tertiary space-y-1 mt-2 list-disc list-inside">
        <li>学费缴纳对接学校财务处微信公众号支付接口，安全可靠</li>
        <li>支持微信支付和支付宝两种方式</li>
        <li>如需申请缓缴或减免，请前往「绿色通道」提交申请</li>
        <li>如有疑问请联系财务处：0451-88036000</li>
      </ul>
    </section>
  </div>
</template>
