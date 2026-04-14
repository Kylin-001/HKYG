<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import IconSet from '@/components/icons/IconSet.vue'

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

const unpaidCount = computed(() => dormitoryItems.value.filter(i => i.status !== 'paid').length)

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
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题区 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200">
          <IconSet name="home" size="xl" color="#f59e0b" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">住宿费缴纳</h2>
          <p class="text-sm text-slate-500">宿舍费用管理</p>
        </div>
      </div>
      <span v-if="unpaidCount > 0" class="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/30 animate-pulse">
        {{ unpaidCount }} 项待缴
      </span>
    </div>

    <!-- 宿舍信息卡片 -->
    <section class="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-6">
      <!-- 装饰背景 -->
      <div class="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/30 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      
      <div class="relative">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <IconSet name="building-office" size="xl" color="white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-amber-900 mb-2">住宿费标准</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-amber-100">
                <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <IconSet name="users" size="md" color="#f59e0b" />
                </div>
                <div>
                  <p class="text-xs text-amber-700">四人间</p>
                  <p class="text-sm font-bold text-amber-900">1200元/年</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-amber-100">
                <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <IconSet name="users" size="md" color="#f59e0b" />
                </div>
                <div>
                  <p class="text-xs text-amber-700">六人间</p>
                  <p class="text-sm font-bold text-amber-900">800元/年</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-amber-100">
                <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <IconSet name="users" size="md" color="#f59e0b" />
                </div>
                <div>
                  <p class="text-xs text-amber-700">八人间</p>
                  <p class="text-sm font-bold text-amber-900">600元/年</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主内容卡片 -->
    <section class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>
      
      <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50/30 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
            <IconSet name="document-text" size="md" color="#f59e0b" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">住宿费项目清单</h3>
            <p class="text-xs text-slate-500 mt-0.5">请选择需要缴纳的项目</p>
          </div>
        </div>
      </div>

      <div v-if="dormitoryItems.length > 0" class="p-6 space-y-4">
        <!-- 全选 -->
        <label class="group flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-colors duration-300 border border-transparent hover:border-amber-200">
          <div class="relative">
            <input type="checkbox" 
              :checked="selectedIds.length === dormitoryItems.filter(i => i.status !== 'paid').length && dormitoryItems.filter(i => i.status !== 'paid').length > 0"
              @change="selectAll"
              class="peer w-5 h-5 rounded-lg border-2 border-slate-300 text-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:ring-offset-0 transition-all cursor-pointer checked:border-amber-500" />
          </div>
          <span class="text-sm font-medium text-slate-700 group-hover:text-amber-700 transition-colors">全选未缴项目</span>
          <span class="ml-auto text-xs text-slate-400">{{ dormitoryItems.filter(i => i.status !== 'paid').length }} 项可选</span>
        </label>

        <!-- 项目列表 -->
        <div class="space-y-3">
          <div v-for="(item, index) in dormitoryItems" :key="item.id"
            :class="['group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
              item.status === 'paid' 
                ? 'border-emerald-100 bg-emerald-50/30 opacity-70' 
                : item.status === 'overdue'
                  ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300 hover:shadow-md hover:shadow-rose-500/10'
                  : selectedIds.includes(item.id)
                    ? 'border-amber-500 bg-amber-50/30 shadow-md shadow-amber-500/10'
                    : 'border-slate-100 hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5']"
            @click="item.status !== 'paid' && toggleSelect(item.id)">
            
            <!-- 选择框 -->
            <div v-if="item.status !== 'paid'" class="relative">
              <input type="checkbox" 
                :checked="selectedIds.includes(item.id)"
                @click.stop
                @change="toggleSelect(item.id)"
                class="peer w-5 h-5 rounded-lg border-2 border-slate-300 text-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:ring-offset-0 transition-all cursor-pointer checked:border-amber-500" />
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
                {{ item.academicYear }}
                <span class="text-slate-300">|</span>
                <IconSet name="clock" size="xs" color="#94a3b8" />
                截止 {{ item.dueDate }}
              </p>
            </div>

            <!-- 金额 -->
            <div class="text-right">
              <p class="text-lg font-bold" :class="item.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'">
                ¥{{ item.amount.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <IconSet name="home" size="2xl" color="#94a3b8" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">暂无住宿费缴费项目</h3>
        <p class="text-slate-500 text-sm">当前学年度没有待缴纳的住宿费项目</p>
      </div>

      <!-- 底部结算栏 -->
      <div v-if="totalSelected > 0" class="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <IconSet name="calculator" size="lg" color="#f59e0b" />
            </div>
            <div>
              <p class="text-sm text-slate-500">已选 <span class="font-semibold text-slate-900">{{ selectedIds.length }}</span> 项</p>
              <p class="text-xs text-slate-400">合计金额</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <p class="text-3xl font-bold text-amber-600 tracking-tight">¥{{ totalSelected.toFixed(2) }}</p>
            <button @click="handlePay" :disabled="store.loading"
              class="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-semibold shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden">
              <!-- 光效动画 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div class="relative flex items-center gap-2">
                <IconSet name="alipay" size="md" color="white" />
                <span>{{ store.loading ? '处理中...' : '支付宝支付' }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 温馨提示 -->
    <section class="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5">
      <!-- 装饰背景 -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div class="relative">
        <p class="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
            <IconSet name="information-circle" size="sm" color="#f59e0b" />
          </div>
          温馨提示
        </p>
        <ul class="text-sm text-amber-800/70 space-y-2">
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
            <span>住宿费按学年缴纳，请在规定时间内完成缴费</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
            <span>如需调整宿舍或退宿，请联系后勤管理处</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
            <span>缴费成功后电子票据将发送至您的校园邮箱</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
            <span>如有疑问请联系后勤处：0451-88036001</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
