<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import type { LeaveApplication, LeaveFormData } from '@/types/studentAffairs'
import { EditPen, Clock, WarningFilled, Plus, Delete, View, Upload,
  Loading, CircleCheckFilled, CircleCloseFilled, Paperclip,
  DataAnalysis } from '@element-plus/icons-vue'

const store = useStudentAffairsStore()

// ==================== 表单数据 ====================
const form = reactive<LeaveFormData>({
  type: 'sick',
  reason: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  attachments: []
})

// ==================== 表单状态 ====================
const submitting = ref(false)
const showDetailDialog = ref(false)
const currentDetail = ref<LeaveApplication | null>(null)
const statusFilter = ref<string>('all')
const currentPage = ref(1)
const pageSize = ref(10)

// ==================== 配置项 ====================
const typeOptions = [
  { value: 'sick', label: '病假', description: '因病需要休息治疗', requiredDoc: '诊断书/病历' },
  { value: 'personal', label: '事假', description: '因个人事务需要处理', requiredDoc: '相关证明材料' },
  { value: 'official', label: '公假', description: '参加学校组织的活动', requiredDoc: '活动通知/证明' },
  { value: 'other', label: '其他', description: '其他特殊情况', requiredDoc: '情况说明' }
]

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待审批', color: 'text-warning bg-warning/10 border-warning/30', icon: Loading },
  approved: { label: '已通过', color: 'text-pine bg-pine/10 border-pine/30', icon: CircleCheckFilled },
  rejected: { label: '已拒绝', color: 'text-crimson bg-crimson/10 border-crimson/30', icon: CircleCloseFilled },
  cancelled: { label: '已取消', color: 'text-text-quaternary bg-gray-100 border-gray-200', icon: CircleCloseFilled }
}

// 模拟审批人信息
const approverInfo = {
  name: '张老师',
  role: '辅导员',
  phone: '0451-88036000',
  office: '主楼A303室'
}

// ==================== 计算属性 ====================
const reasonLength = computed(() => form.reason.length)

const dateError = computed(() => {
  if (!form.startDate || !form.endDate) return ''
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)

  // 结束时间不能早于开始时间
  if (end < start) return '结束日期不能早于开始日期'

  // 开始时间不能早于当前时间
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (start < today) return '开始日期不能早于今天'

  // 单次请假不超过7天
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  if (diffDays > 7) return '单次请假不能超过7天'

  return ''
})

const daysCount = computed(() => {
  if (!form.startDate || !form.endDate || dateError.value) return 0
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
})

// 学期累计天数（模拟数据）
const semesterTotalDays = computed(() => {
  const baseDays = store.leaveList
    .filter(item => item.status === 'approved')
    .reduce((sum, item) => sum + (item.days || 0), 0)
  return baseDays + daysCount.value
})

const isOverSemesterLimit = computed(() => semesterTotalDays.value > 30)

// 筛选后的列表
const filteredLeaveList = computed(() => {
  if (statusFilter.value === 'all') return store.leaveList
  return store.leaveList.filter(item => item.status === statusFilter.value)
})

// 分页后的列表
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLeaveList.value.slice(start, start + pageSize.value)
})

const totalItems = computed(() => filteredLeaveList.value.length)

// ==================== 方法 ====================
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    // 验证文件类型和大小
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      if (!isValidType) {
        ElMessage.error(`文件 ${file.name} 格式不支持，仅支持JPG/PNG/GIF/PDF`)
        return false
      }
      if (!isValidSize) {
        ElMessage.error(`文件 ${file.name} 超过10MB限制`)
        return false
      }
      return true
    })
    form.attachments = [...(form.attachments || []), ...validFiles]
  }
}

function removeFile(index: number) {
  form.attachments?.splice(index, 1)
}

async function handleSubmit() {
  // 表单验证
  if (!form.type) {
    ElMessage.warning('请选择请假类型')
    return
  }

  if (!form.reason || form.reason.trim().length < 10) {
    ElMessage.warning('请假原因至少需要10个字符')
    return
  }

  if (!form.startDate || !form.endDate) {
    ElMessage.warning('请选择起止日期')
    return
  }

  if (dateError.value) {
    ElMessage.warning(dateError.value)
    return
  }

  if (isOverSemesterLimit.value) {
    ElMessage.warning('学期累计请假不能超过30天')
    return
  }

  // 病假必须上传证明材料
  if (form.type === 'sick' && (!form.attachments || form.attachments.length === 0)) {
    ElMessage.warning('病假必须上传诊断书等证明材料')
    return
  }

  try {
    submitting.value = true

    // 构建提交数据
    const submitData = {
      ...form,
      days: daysCount.value
    }

    await store.submitLeave(submitData)
    ElMessage.success('请假申请已提交，等待审批')

    // 重置表单
    resetForm()
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.type = 'sick'
  form.reason = ''
  form.startDate = ''
  form.endDate = ''
  form.startTime = ''
  form.endTime = ''
  form.attachments = []
}

async function handleCancel(id: string) {
  try {
    await ElMessageBox.confirm(
      '确定要撤销该请假申请吗？撤销后需重新申请',
      '确认撤销',
      {
        confirmButtonText: '确定撤销',
        cancelButtonText: '再想想',
        type: 'warning'
      }
    )

    await store.cancelLeave(id)
    ElMessage.success('请假申请已撤销')
  } catch (err: unknown) {
    // 用户取消操作
    if (err !== 'cancel') {
      ElMessage.error(err instanceof Error ? err.message : '撤销失败')
    }
  }
}

function viewDetail(item: LeaveApplication) {
  currentDetail.value = item
  showDetailDialog.value = true
}

function handleStatusChange(status: string) {
  statusFilter.value = status
  currentPage.value = 1
}

function handlePageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  store.fetchLeaveApplications()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- ========== 申请表单区域 ========== -->
    <section class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
        <el-icon :size="20" class="text-primary"><EditPen /></el-icon>
        请假申请
      </h2>

      <el-form label-position="top" class="max-w-3xl">
        <!-- 请假类型 -->
        <el-form-item label="请假类型" required>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="opt in typeOptions" :key="opt.value"
              @click="form.type = opt.value"
              :class="['p-4 rounded-xl border-2 cursor-pointer transition-all text-center',
                form.type === opt.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 hover:border-primary/30 hover:bg-primary/5']">
              <p class="font-semibold text-sm text-text-primary">{{ opt.label }}</p>
              <p class="text-[11px] text-text-tertiary mt-1">{{ opt.description }}</p>
            </div>
          </div>
          <p v-if="form.type" class="mt-2 text-xs text-text-tertiary">
            所需材料：{{ typeOptions.find(t => t.value === form.type)?.requiredDoc }}
          </p>
        </el-form-item>

        <!-- 请假原因 -->
        <el-form-item label="请假原因" required>
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="4"
            placeholder="请详细说明请假原因（至少10个字符）..."
            show-word-limit
            :maxlength="500"
            class="w-full"
          />
          <div class="mt-1 flex items-center justify-between">
            <span :class="['text-xs', reasonLength >= 10 ? 'text-pine' : 'text-text-quaternary']">
              {{ reasonLength }}/10 字符（最少）
            </span>
          </div>
        </el-form-item>

        <!-- 请假时间 -->
        <el-form-item label="请假时间" required>
          <div class="space-y-4">
            <!-- 日期选择 -->
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-medium text-text-secondary mb-1.5">开始日期</label>
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  class="w-full"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="(time: Date) => time.getTime() < Date.now() - 86400000"
                />
              </div>

              <span class="text-text-tertiary text-sm pt-6">至</span>

              <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-medium text-text-secondary mb-1.5">结束日期</label>
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  class="w-full"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="(time: Date) => form.startDate ? time.getTime() <= new Date(form.startDate).getTime() - 86400000 : false"
                />
              </div>
            </div>

            <!-- 时间段选择 -->
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex-1 min-w-[180px]">
                <label class="block text-xs font-medium text-text-secondary mb-1.5">开始时间（可选）</label>
                <el-time-select
                  v-model="form.startTime"
                  start="08:00"
                  step="00:30"
                  end="22:00"
                  placeholder="开始时间"
                  class="w-full"
                />
              </div>

              <span class="text-text-tertiary text-sm pt-6">至</span>

              <div class="flex-1 min-w-[180px]">
                <label class="block text-xs font-medium text-text-secondary mb-1.5">结束时间（可选）</label>
                <el-time-select
                  v-model="form.endTime"
                  start="08:00"
                  step="00:30"
                  end="22:00"
                  placeholder="结束时间"
                  class="w-full"
                  :min-time="form.startTime"
                />
              </div>
            </div>

            <!-- 错误提示和时长显示 -->
            <div v-if="dateError" class="flex items-center gap-1.5 p-3 rounded-lg bg-crimson/5 border border-crimson/20">
              <el-icon :size="16" class="text-crimson"><WarningFilled /></el-icon>
              <span class="text-sm text-crimson">{{ dateError }}</span>
            </div>
            <div v-else-if="daysCount > 0" class="flex items-center gap-4 p-3 rounded-lg bg-info/5 border border-info/20">
              <div class="flex items-center gap-1.5">
                <el-icon :size="16" class="text-info"><Clock /></el-icon>
                <span class="text-sm font-medium text-info">共 {{ daysCount }} 天</span>
              </div>
              <div class="h-4 w-px bg-gray-300"></div>
              <span class="text-xs text-text-secondary">
                学期累计：<strong :class="isOverSemesterLimit ? 'text-crimson' : 'text-text-primary'">
                  {{ semesterTotalDays }} 天
                </strong>
                <span class="text-text-quaternary"> / 30天</span>
              </span>
              <el-tag v-if="isOverSemesterLimit" size="small" type="danger" effect="dark">
                超出学期限额
              </el-tag>
            </div>
          </div>
        </el-form-item>

        <!-- 上传证明材料 -->
        <el-form-item :label="form.type === 'sick' ? '上传证明材料（必填）' : '上传证明材料（选填）'">
          <div class="space-y-3">
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                 @click="$refs.fileInput?.click()">
              <el-icon :size="32" class="text-text-quaternary mb-2"><Upload /></el-icon>
              <p class="text-sm text-text-secondary">点击或拖拽文件到此处上传</p>
              <p class="text-xs text-text-quaternary mt-1">支持 JPG、PNG、GIF、PDF格式，单个文件不超过10MB</p>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                class="hidden"
                @change="handleFileUpload"
              />
            </div>

            <!-- 已上传文件列表 -->
            <div v-if="form.attachments && form.attachments.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div v-for="(file, index) in form.attachments" :key="index"
                   class="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img v-if="file.type.startsWith('image')" :src="URL.createObjectURL(file)"
                     class="w-full h-24 object-cover" alt="预览" />
                <div v-else class="w-full h-24 flex items-center justify-center bg-gray-100">
                  <el-icon :size="32" class="text-text-quaternary"><EditPen /></el-icon>
                </div>
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button @click.stop="removeFile(index)" class="p-1.5 rounded-lg bg-crimson text-white hover:bg-crimson-light">
                    <el-icon :size="16"><Delete /></el-icon>
                  </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 truncate">
                  {{ file.name }}
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 审批人信息 -->
        <el-form-item label="审批人信息">
          <div class="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-text-tertiary">审批人：</span>
                <span class="font-medium text-text-primary">{{ approverInfo.name }}</span>
                <span class="ml-2 text-text-quaternary">({{ approverInfo.role }})</span>
              </div>
              <div>
                <span class="text-text-tertiary">联系电话：</span>
                <span class="text-text-primary">{{ approverInfo.phone }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-text-tertiary">办公地点：</span>
                <span class="text-text-primary">{{ approverInfo.office }}</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <div class="flex gap-3">
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Loading v-if="submitting" class="animate-spin" />
              {{ submitting ? '提交中...' : '提交申请' }}
            </button>
            <button
              @click="resetForm"
              class="px-6 py-3 rounded-xl border border-gray-300 text-text-secondary text-sm font-medium hover:bg-gray-50 transition-all"
            >
              重置
            </button>
          </div>
        </el-form-item>
      </el-form>
    </section>

    <!-- ========== 历史记录区域 ========== -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <el-icon :size="20" class="text-primary"><Clock /></el-icon>
          请假历史记录
        </h2>

        <!-- 筛选器 -->
        <div class="flex gap-2">
          <button
            v-for="status in [
              { value: 'all', label: '全部' },
              { value: 'pending', label: '待审批' },
              { value: 'approved', label: '已通过' },
              { value: 'rejected', label: '已拒绝' }
            ]"
            :key="status.value"
            @click="handleStatusChange(status.value)"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              statusFilter === status.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200']"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="store.loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-32 rounded-xl bg-gold/10 animate-pulse"></div>
      </div>

      <!-- 记录列表 -->
      <div v-else-if="paginatedList.length > 0" class="space-y-3">
        <div v-for="item in paginatedList" :key="item.id"
             class="bg-white/90 backdrop-blur-md rounded-xl border border-primary-50/50 p-5 hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border',
                statusMap[item.status]?.color]">
                {{ statusMap[item.status]?.icon }} {{ statusMap[item.status]?.label }}
              </span>
              <span class="text-base font-semibold text-text-primary">
                {{ typeOptions.find(t => t.value === item.type)?.label }}假
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-text-quaternary">{{ item.createdAt }}</span>
              <button @click="viewDetail(item)" class="p-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                <el-icon :size="16" class="text-primary"><View /></el-icon>
              </button>
            </div>
          </div>

          <p class="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">{{ item.reason }}</p>

          <div class="flex items-center justify-between text-xs text-text-tertiary">
            <div class="flex items-center gap-4">
              <span>📅 {{ item.startDate }} ~ {{ item.endDate }}</span>
              <span v-if="item.days"><el-icon :size="12"><Clock /></el-icon> {{ item.days }}天</span>
              <span v-if="item.semesterTotalDays"><el-icon :size="12"><DataAnalysis /></el-icon> 本学期累计：{{ item.semesterTotalDays }}天</span>
            </div>
            <div v-if="item.approver">
              <span>审批人：{{ item.approver }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div v-if="item.status === 'pending'" class="mt-4 pt-3 border-t border-gray-100">
            <button @click="handleCancel(item.id)" class="text-sm text-crimson hover:text-crimson-light font-medium transition-colors">
              <el-icon :size="14"><CircleCloseFilled /></el-icon> 撤销申请
            </button>
          </div>

          <!-- 驳回原因 -->
          <div v-if="item.rejectReason" class="mt-3 p-3 rounded-lg bg-crimson/5 border border-crimson/20">
            <p class="text-xs font-medium text-crimson mb-1">驳回原因：</p>
            <p class="text-sm text-crimson/80">{{ item.rejectReason }}</p>
          </div>

          <!-- 附件展示 -->
          <div v-if="item.attachments && item.attachments.length > 0" class="mt-3 flex gap-2">
            <span class="text-xs text-text-tertiary"><el-icon :size="11"><Paperclip /></el-icon> 附件：</span>
            <div class="flex gap-2">
              <span v-for="(url, idx) in item.attachments" :key="idx"
                    class="px-2 py-1 rounded bg-gray-100 text-xs text-primary hover:bg-primary/10 cursor-pointer">
                附件{{ idx + 1 }}
              </span>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalItems > pageSize" class="flex justify-center mt-6">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalItems"
            layout="prev, pager, next"
            @current-change="handlePageChange"
            class="justify-center"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
          <el-icon :size="36" class="text-primary/40"><EditPen /></el-icon>
        </div>
        <p class="text-text-tertiary text-base font-medium mb-2">暂无请假记录</p>
        <p class="text-text-quaternary text-sm">提交请假申请后，记录将显示在此处</p>
      </div>
    </section>

    <!-- ========== 详情弹窗 ========== -->
    <el-dialog v-model="showDetailDialog" title="请假详情" width="600px" :close-on-click-modal="true">
      <div v-if="currentDetail" class="space-y-4">
        <!-- 基本信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-text-tertiary">请假类型</label>
            <p class="text-sm font-medium text-text-primary mt-1">
              {{ typeOptions.find(t => t.value === currentDetail.type)?.label }}
            </p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">状态</label>
            <p class="mt-1">
              <span :class="['px-2 py-1 rounded-full text-xs font-bold border', statusMap[currentDetail.status]?.color]">
                {{ statusMap[currentDetail.status]?.icon }} {{ statusMap[currentDetail.status]?.label }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">开始日期</label>
            <p class="text-sm text-text-primary mt-1">{{ currentDetail.startDate }}</p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">结束日期</label>
            <p class="text-sm text-text-primary mt-1">{{ currentDetail.endDate }}</p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">请假天数</label>
            <p class="text-sm text-text-primary mt-1">{{ currentDetail.days || '-' }} 天</p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">申请时间</label>
            <p class="text-sm text-text-primary mt-1">{{ currentDetail.createdAt }}</p>
          </div>
        </div>

        <!-- 请假原因 -->
        <div>
          <label class="text-xs text-text-tertiary">请假原因</label>
          <p class="text-sm text-text-primary mt-1 leading-relaxed bg-gray-50 p-3 rounded-lg">
            {{ currentDetail.reason }}
          </p>
        </div>

        <!-- 审批信息 -->
        <div v-if="currentDetail.approver">
          <label class="text-xs text-text-tertiary">审批信息</label>
          <div class="mt-1 p-3 rounded-lg bg-pine/5 border border-pine/10 text-sm">
            <p><span class="text-text-tertiary">审批人：</span>{{ currentDetail.approver }}</p>
            <p v-if="currentDetail.approvedAt" class="mt-1">
              <span class="text-text-tertiary">审批时间：</span>{{ currentDetail.approvedAt }}
            </p>
          </div>
        </div>

        <!-- 驳回原因 -->
        <div v-if="currentDetail.rejectReason">
          <label class="text-xs text-text-tertiary">驳回原因</label>
          <p class="text-sm text-crimson mt-1 leading-relaxed bg-crimson/5 p-3 rounded-lg">
            {{ currentDetail.rejectReason }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
