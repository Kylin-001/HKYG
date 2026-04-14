<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import IconSet from '@/components/icons/IconSet.vue'

const store = usePaymentStore()

const showForm = ref(false)
const form = reactive({
  studentName: '',
  studentId: '',
  reason: '',
  supportingDocuments: [] as string[],
})

const statusMap: Record<string, { label: string; bg: string; text: string; icon: string; border: string }> = {
  pending: { 
    label: '审核中', 
    bg: 'bg-amber-50', 
    text: 'text-amber-700',
    icon: '#f59e0b',
    border: 'border-amber-200'
  },
  approved: { 
    label: '已批准', 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700',
    icon: '#10b981',
    border: 'border-emerald-200'
  },
  rejected: { 
    label: '未通过', 
    bg: 'bg-rose-50', 
    text: 'text-rose-700',
    icon: '#f43f5e',
    border: 'border-rose-200'
  },
}

const reasonLength = computed(() => form.reason.length)
const progressPercent = computed(() => Math.min((reasonLength.value / 500) * 100, 100))

async function handleSubmit() {
  if (!form.studentName || !form.studentName.trim()) return ElMessage.warning('请输入真实姓名')
  if (!form.studentId || !form.studentId.trim()) return ElMessage.warning('请输入学号')
  if (!form.reason || form.reason.trim().length < 20) {
    return ElMessage.warning('申请理由至少需要20个字符，请详细描述家庭经济困难情况')
  }
  try {
    await store.submitGreenChannel(form)
    ElMessage.success('绿色通道申请已提交')
    form.reason = ''
    form.studentName = ''
    form.studentId = ''
    showForm.value = false
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '提交失败')
  }
}

onMounted(() => store.fetchGreenChannelApps())
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题区 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200">
          <IconSet name="shield-check" size="xl" color="#10b981" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">绿色通道</h2>
          <p class="text-sm text-slate-500">学费缓缴申请</p>
        </div>
      </div>
      <button v-if="!showForm" @click="showForm = true"
        class="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <div class="relative flex items-center gap-2">
          <IconSet name="plus" size="sm" color="white" />
          <span>申请缓缴</span>
        </div>
      </button>
    </div>

    <!-- 绿色通道说明卡片 -->
    <section class="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-6">
      <!-- 装饰背景 -->
      <div class="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-teal-100/30 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      
      <div class="relative">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <IconSet name="heart" size="xl" color="white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-emerald-900 mb-2">什么是绿色通道？</h3>
            <p class="text-sm text-emerald-800/70 leading-relaxed">
              家庭经济特别困难的学生，可申请通过"绿色通道"办理入学手续，暂缓缴纳学费和住宿费。学校将在审核通过后为您安排分期还款或减免方案，确保每一位学生都不会因经济困难而失学。
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              <div class="flex items-center gap-1.5 text-xs text-emerald-700">
                <IconSet name="check-circle" size="xs" color="#10b981" />
                <span>快速审核</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-emerald-700">
                <IconSet name="check-circle" size="xs" color="#10b981" />
                <span>隐私保护</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-emerald-700">
                <IconSet name="check-circle" size="xs" color="#10b981" />
                <span>灵活还款</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 申请表单 -->
    <section v-if="showForm" class="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
      
      <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/30 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <IconSet name="pencil-square" size="md" color="#10b981" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">填写申请信息</h3>
          </div>
          <button @click="showForm = false" class="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <IconSet name="x-mark" size="md" color="#64748b" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-5">
        <!-- 姓名 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            真实姓名 <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSet name="user" size="sm" color="#94a3b8" />
            </div>
            <input v-model="form.studentName" 
              placeholder="请输入您的真实姓名"
              class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all" />
          </div>
        </div>

        <!-- 学号 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            学号 <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSet name="identification" size="sm" color="#94a3b8" />
            </div>
            <input v-model="form.studentId" 
              placeholder="请输入学号（如：2024010001）"
              class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all" />
          </div>
        </div>

        <!-- 申请理由 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            申请理由 <span class="text-rose-500">*</span>
            <span class="text-slate-400 font-normal ml-2">{{ reasonLength }}/500 字</span>
          </label>
          <div class="relative">
            <textarea v-model="form.reason" 
              :rows="5" 
              placeholder="请详细描述家庭经济困难情况及申请缓缴原因（至少20个字符）..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm resize-none transition-all"
              :maxlength="500"></textarea>
            <!-- 进度条 -->
            <div class="absolute bottom-3 right-3 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                :style="{ width: `${progressPercent}%` }"></div>
            </div>
          </div>
          <p v-if="reasonLength > 0 && reasonLength < 20" class="mt-2 text-xs text-rose-500 flex items-center gap-1">
            <IconSet name="exclamation-triangle" size="xs" color="#f43f5e" />
            至少需要20个字符
          </p>
        </div>

        <!-- 证明材料 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">证明材料（可选）</label>
          <div class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <IconSet name="cloud-arrow-up" size="xl" color="#94a3b8" class="group-hover:text-emerald-500 transition-colors" />
            </div>
            <p class="text-slate-600 text-sm font-medium">点击上传证明材料</p>
            <p class="text-slate-400 text-xs mt-1">支持 JPG/PNG/PDF，单文件不超过10MB</p>
            <p class="text-slate-400 text-xs">低保证明、贫困证明、残疾证等</p>
          </div>
        </div>

        <!-- 按钮组 -->
        <div class="flex gap-3 pt-2">
          <button @click="handleSubmit" :disabled="store.loading"
            class="group relative flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div class="relative flex items-center justify-center gap-2">
              <IconSet v-if="store.loading" name="arrow-path" size="sm" color="white" class="animate-spin" />
              <IconSet v-else name="paper-airplane" size="sm" color="white" />
              <span>{{ store.loading ? '提交中...' : '提交申请' }}</span>
            </div>
          </button>
          <button @click="showForm = false" 
            class="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
            取消
          </button>
        </div>
      </div>
    </section>

    <!-- 申请记录 -->
    <section v-if="store.greenChannelApps.length > 0">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
          <IconSet name="clock" size="md" color="#6366f1" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">我的申请记录</h3>
      </div>
      
      <div class="space-y-4">
        <div v-for="(app, index) in store.greenChannelApps" :key="app.id"
          class="group relative overflow-hidden bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
          :class="statusMap[app.status]?.border || 'border-slate-200'"
          :style="{ animationDelay: `${index * 100}ms` }">
          
          <!-- 状态条 -->
          <div class="absolute top-0 left-0 w-1 h-full" 
            :class="app.status === 'approved' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'"></div>
          
          <div class="p-5 pl-6">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5',
                  statusMap[app.status]?.bg,
                  statusMap[app.status]?.text]">
                  <IconSet name="shield-check" size="xs" :color="statusMap[app.status]?.icon" />
                  {{ statusMap[app.status]?.label }}
                </span>
              </div>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <IconSet name="calendar" size="xs" color="#94a3b8" />
                {{ app.submittedAt }}
              </span>
            </div>
            
            <p class="text-sm text-slate-700 leading-relaxed line-clamp-3">{{ app.reason }}</p>
            
            <!-- 审核意见 -->
            <div v-if="app.reviewerComment" class="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p class="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <IconSet name="chat-bubble-left" size="xs" color="#94a3b8" />
                审核意见
              </p>
              <p class="text-sm text-slate-700">{{ app.reviewerComment }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 无记录提示 -->
    <div v-else-if="!showForm" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <IconSet name="inbox" size="2xl" color="#94a3b8" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">暂无申请记录</h3>
      <p class="text-slate-500 text-sm mb-4">您还没有提交过绿色通道申请</p>
      <button @click="showForm = true"
        class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all">
        立即申请
      </button>
    </div>
  </div>
</template>
