<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaymentStore } from '@/stores/payment'
import { Document, Upload, InfoFilled } from '@element-plus/icons-vue'

const store = usePaymentStore()

const showForm = ref(false)
const form = reactive({
  studentName: '',
  studentId: '',
  reason: '',
  supportingDocuments: [] as string[],
})

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '审核中', color: 'text-warning bg-warning/10' },
  approved: { label: '已批准', color: 'text-pine bg-pine/10' },
  rejected: { label: '未通过', color: 'text-crimson bg-crimson/10' },
}

const reasonLength = computed(() => form.reason.length)

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
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 绿色通道说明 -->
    <section class="bg-gradient-to-br from-pine/8 to-pine-light/8 rounded-2xl border border-pine/15 p-6">
      <h2 class="text-lg font-bold text-pine mb-2 flex items-center gap-2">
        <el-icon :size="20"><Document /></el-icon> 绿色通道 — 延期缓缴申请
      </h2>
      <p class="text-sm text-text-secondary leading-relaxed mb-4">
        家庭经济特别困难的学生，可申请通过"绿色通道"办理入学手续，暂缓缴纳学费和住宿费。学校将在审核通过后为您安排分期还款或减免方案。
      </p>
      <button v-if="!showForm"
        @click="showForm = true"
        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pine to-pine-light text-white text-sm font-semibold hover:shadow-lg transition-all">
        申请绿色通道
      </button>
    </section>

    <!-- 申请表单 -->
    <section v-if="showForm" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-5">
      <h3 class="text-base font-bold text-text-primary mb-4">填写申请信息</h3>
      <div class="space-y-4 max-w-lg">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">姓名 <span class="text-crimson">*</span></label>
          <input v-model="form.studentName" placeholder="请输入真实姓名"
            class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">学号 <span class="text-crimson">*</span></label>
          <input v-model="form.studentId" placeholder="请输入学号（如：2024010001）"
            class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">
            申请理由 <span class="text-crimson">*</span>
            <span v-if="reasonLength > 0" class="text-text-quaternary font-normal ml-1">{{ reasonLength }}/500</span>
          </label>
          <textarea v-model="form.reason" :rows="4" placeholder="请详细描述家庭经济困难情况及申请缓缴原因（至少20个字符）..."
            class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm resize-none" :maxlength="500"></textarea>
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">证明材料（可选）</label>
          <div class="border-2 border-dashed border-primary-150 rounded-xl p-6 text-center cursor-pointer hover:border-pine hover:bg-pine/5 transition-colors group">
            <el-icon :size="28" class="text-text-quaternary group-hover:text-pine transition-colors mb-1"><Upload /></el-icon>
            <p class="text-text-tertiary text-sm">上传家庭经济困难证明、低保证明等材料</p>
            <p class="text-text-quaternary text-[11px] mt-1">支持 JPG/PNG/PDF，单文件不超过10MB</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="handleSubmit" :disabled="store.loading"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pine to-pine-light text-white text-sm font-semibold disabled:opacity-50 transition-all">
            {{ store.loading ? '提交中...' : '提交申请' }}
          </button>
          <button @click="showForm = false" class="px-4 py-2.5 rounded-xl border border-primary-100 text-text-secondary text-sm hover:bg-primary-50 transition-colors">取消</button>
        </div>
      </div>
    </section>

    <!-- 申请记录 -->
    <section v-if="store.greenChannelApps.length > 0">
      <h2 class="text-lg font-bold text-text-primary mb-3">我的申请记录</h2>
      <div class="space-y-3">
        <div v-for="app in store.greenChannelApps" :key="app.id"
          class="bg-white/90 backdrop-blur-md rounded-xl border border-primary-50/50 p-4">
          <div class="flex items-center justify-between mb-2">
            <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', statusMap[app.status]?.color]">
              {{ statusMap[app.status]?.label }}
            </span>
            <span class="text-[11px] text-text-quaternary">{{ app.submittedAt }}</span>
          </div>
          <p class="text-sm text-text-secondary mt-2 line-clamp-2">{{ app.reason }}</p>
          <p v-if="app.reviewerComment" class="text-xs text-text-tertiary mt-2 p-2 rounded-lg bg-gray-50">
            审核意见：{{ app.reviewerComment }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
