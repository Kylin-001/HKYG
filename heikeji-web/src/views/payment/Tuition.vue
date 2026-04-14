<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import IconSet from '@/components/icons/IconSet.vue'

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
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题区 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
          <IconSet name="academic-cap" size="xl" color="#3b82f6" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">学费缴纳</h2>
          <p class="text-sm text-slate-500">{{ new Date().getFullYear() - 1 }}-{{ String(new Date().getFullYear()).slice(2) }} 学年</p>
        </div>
      </div>
      <span v-if="unpaidCount > 0" class="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/30 animate-pulse">
        {{ unpaidCount }} 项待缴
      </span>
    </div>

    <!-- 主内容卡片 -->
    <section class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
      
      <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/30 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <IconSet name="document-text" size="md" color="#3b82f6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">学费项目清单</h3>
            <p class="text-xs text-slate-500 mt-0.5">请选择需要缴纳的项目</p>
          </div>
        </div>
      </div>

      <div v-if="tuitionItems.length > 0" class="p-6 space-y-4">
        <!-- 全选 -->
        <label class="group flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors duration-300 border border-transparent hover:border-blue-200">
          <div class="relative">
            <input type="checkbox" 
              :checked="selectedIds.length === tuitionItems.filter(i => i.status !== 'paid').length && tuitionItems.filter(i => i.status !== 'paid').length > 0"
              @change="selectAll"
              class="peer w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all cursor-pointer checked:border-blue-600" />
            <div class="absolute inset-0 rounded-lg bg-blue-600 scale-0 peer-checked:scale-100 transition-transform duration-200 -z-10"></div>
          </div>
          <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">全选未缴项目</span>
          <span class="ml-auto text-xs text-slate-400">{{ tuitionItems.filter(i => i.status !== 'paid').length }} 项可选</span>
        </label>

        <!-- 项目列表 -->
        <div class="space-y-3">
          <div v-for="(item, index) in tuitionItems" :key="item.id"
            :class="['group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
              item.status === 'paid' 
                ? 'border-emerald-100 bg-emerald-50/30 opacity-70' 
                : item.status === 'overdue'
                  ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300 hover:shadow-md hover:shadow-rose-500/10'
                  : selectedIds.includes(item.id)
                    ? 'border-blue-500 bg-blue-50/30 shadow-md shadow-blue-500/10'
                    : 'border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5']"
            @click="item.status !== 'paid' && toggleSelect(item.id)">
            
            <!-- 选择框 -->
            <div v-if="item.status !== 'paid'" class="relative">
              <input type="checkbox" 
                :checked="selectedIds.includes(item.id)"
                @click.stop
                @change="toggleSelect(item.id)"
                class="peer w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all cursor-pointer checked:border-blue-600" />
            </div>
            <div v-else class="w-5 h-5 flex items-center justify-center">
              <div class="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center">
                <IconSet name="check" size="xs" color="#10b981" />
              </div>
            </div>

            <!-- 内容区 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
                <span v-if="item.status === 'paid'" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  已缴
                </span>
                <span v-else-if="item.status === 'overdue'" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                  逾期
                </span>
                <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                  待缴
                </span>
              </div>
              <p class="text-xs text-slate-500 flex items-center gap-2">
                <IconSet name="calendar" size="xs" color="#94a3b8" />
                {{ item.description || item.semester || '' }}
                <span class="text-slate-300">|</span>
                <IconSet name="clock" size="xs" color="#94a3b8" />
                截止 {{ item.dueDate }}
              </p>
            </div>

            <!-- 金额 -->
            <div class="text-right">
              <p class="text-lg font-bold" :class="item.status === 'paid' ? 'text-emerald-600' : 'text-blue-600'">
                ¥{{ item.amount.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <IconSet name="document-text" size="2xl" color="#94a3b8" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">暂无学费缴费项目</h3>
        <p class="text-slate-500 text-sm">当前学年度没有待缴纳的学费项目</p>
      </div>

      <!-- 底部结算栏 -->
      <div v-if="totalSelected > 0" class="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <IconSet name="calculator" size="lg" color="#3b82f6" />
            </div>
            <div>
              <p class="text-sm text-slate-500">已选 <span class="font-semibold text-slate-900">{{ selectedIds.length }}</span> 项</p>
              <p class="text-xs text-slate-400">合计金额</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <p class="text-3xl font-bold text-blue-600 tracking-tight">¥{{ totalSelected.toFixed(2) }}</p>
            <button @click="handlePay" :disabled="store.loading"
              class="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white font-semibold shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden">
              <!-- 光效动画 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div class="relative flex items-center gap-2">
                <IconSet name="wechat" size="md" color="white" />
                <span>{{ store.loading ? '处理中...' : '微信支付' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 温馨提示 -->
    <section class="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-5">
      <!-- 装饰背景 -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div class="relative">
        <p class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
            <IconSet name="information-circle" size="sm" color="#3b82f6" />
          </div>
          温馨提示
        </p>
        <ul class="text-sm text-blue-800/70 space-y-2">
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
            <span>学费缴纳对接学校财务处微信公众号支付接口，安全可靠</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
            <span>支持微信支付和支付宝两种方式</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
            <span>如需申请缓缴或减免，请前往「绿色通道」提交申请</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
            <span>如有疑问请联系财务处：0451-88036000</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
