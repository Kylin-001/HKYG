<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import type { AidApplication, FamilyMember, AidFormData } from '@/types/studentAffairs'
import { Money, Plus, Delete, Upload, DocumentChecked, Clock, CircleCheck, Warning,
  OfficeBuilding as SchoolBuilding, WarningFilled, Document, Wallet, User, EditPen, Search,
  Promotion, CircleCheckFilled, CircleCloseFilled, QuestionFilled, Connection,
  Promotion as Handshake, Star } from '@element-plus/icons-vue'

const store = useStudentAffairsStore()

// ==================== 表单数据 ====================
const form = reactive<AidFormData>({
  type: 'national',
  familyInfo: {
    members: [],
    annualIncome: 0,
    perCapitaIncome: 0,
    specialTypes: []
  },
  documents: []
})

// ==================== 表单状态 ====================
const submitting = ref(false)
const currentStep = ref(0)
const showDetailDialog = ref(false)
const currentDetail = ref<AidApplication | null>(null)
const activeTab = ref('apply') // 'apply' | 'records'

// ==================== 配置项 ====================
const typeOptions = [
  {
    value: 'national' as const,
    label: '国家助学金',
    description: '中央和地方政府共同出资设立的助学金',
    amountRange: '2000-4000元/年',
    deadline: '每年9月30日',
    icon: '🏛️'
  },
  {
    value: 'school' as const,
    label: '校内助学金',
    description: '学校设立的助学金项目',
    amountRange: '1000-3000元/年',
    deadline: '每年10月15日',
    icon: '🏛️'
  },
  {
    value: 'temporary' as const,
    label: '临时困难补助',
    description: '针对突发性、临时性困难的补助',
    amountRange: '500-2000元/次',
    deadline: '随时可申请',
    icon: '⚠️'
  }
]

const difficultyLevels = [
  { value: 'first', label: '一等困难', amount: 4000, color: 'text-crimson bg-crimson/10 border-crimson/20', desc: '特别困难' },
  { value: 'second', label: '二等困难', amount: 3000, color: 'text-warning bg-warning/10 border-warning/20', desc: '困难' },
  { value: 'third', label: '三等困难', amount: 2000, color: 'text-info bg-info/10 border-info/20', desc: '一般困难' }
]

const specialDifficultyTypes = [
  { value: '建档立卡贫困户', label: '建档立卡贫困户', icon: '📄' },
  { value: '低保户', label: '低保家庭', icon: '💰' },
  { value: '残疾', label: '残疾学生/残疾人子女', icon: '⚠️' },
  { value: '单亲', label: '单亲家庭', icon: '🏆' },
  { value: '孤儿', label: '孤儿/事实无人抚养', icon: '🏆' },
  { value: '烈士子女', label: '烈士子女', icon: '⭐' },
  { value: '特困供养', label: '特困供养人员', icon: '⭐' },
  { value: '其他', label: '其他特殊情况', icon: '⚠️' }
]

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  submitted: { label: '已提交', color: 'text-primary bg-primary/10 border-primary/20', icon: '✏️' },
  reviewing: { label: '审核中', color: 'text-warning bg-warning/10 border-warning/20', icon: '⏳' },
  publicized: { label: '公示中', color: 'text-info bg-info/10 border-info/20', icon: '⏳' },
  approved: { label: '已批准', color: 'text-pine bg-pine/10 border-pine/20', icon: '✅' },
  rejected: { label: '已拒绝', color: 'text-crimson bg-crimson/10 border-crimson/20', icon: '❌' },
  issued: { label: '已发放', color: 'text-gold bg-gold/10 border-gold/20', icon: '✅' }
}

// 步骤配置
const steps = [
  { title: '选择类型', description: '选择助学金类型' },
  { title: '填写信息', description: '家庭经济情况' },
  { title: '上传材料', description: '证明材料' },
  { title: '确认提交', description: '核对信息' }
]

// ==================== 计算属性 ====================
// 自动计算困难等级
const calculatedLevel = computed(() => {
  const specialCount = form.familyInfo.specialTypes.length
  const income = form.familyInfo.annualIncome

  if (specialCount >= 3 || income < 10000) return 'first'
  if (specialCount >= 2 || income < 30000) return 'second'
  if (specialCount >= 1 || income < 50000) return 'third'
  return null
})

const calculatedAmount = computed(() => {
  if (!calculatedLevel.value) return 0
  return difficultyLevels.find(l => l.value === calculatedLevel.value)?.amount || 0
})

// 计算人均年收入
const calculatePerCapita = () => {
  if (form.familyInfo.members.length > 0 && form.familyInfo.annualIncome > 0) {
    form.familyInfo.perCapitaIncome = Math.round(form.familyInfo.annualIncome / (form.familyInfo.members.length + 1))
  }
}

// 预计发放时间
const expectedIssueDate = computed(() => {
  if (form.type === 'temporary') return '审核通过后7个工作日内'
  const now = new Date()
  const year = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() + 1
  return `${year}年12月底前`
})

// ==================== 方法 ====================
function addFamilyMember() {
  const newMember: FamilyMember = {
    id: Date.now().toString(),
    name: '',
    relation: '',
    age: undefined,
    occupation: '',
    income: undefined,
    healthStatus: ''
  }
  form.familyInfo.members.push(newMember)
}

function removeFamilyMember(index: number) {
  form.familyInfo.members.splice(index, 1)
  calculatePerCapita()
}

function handleSpecialTypeChange(value: string[]) {
  form.familyInfo.specialTypes = value
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024
      if (!isValidType) {
        ElMessage.error(`文件 ${file.name} 格式不支持`)
        return false
      }
      if (!isValidSize) {
        ElMessage.error(`文件 ${file.name} 超过10MB`)
        return false
      }
      return true
    })
    form.documents = [...(form.documents || []), ...validFiles]
  }
}

function removeDocument(index: number) {
  form.documents?.splice(index, 1)
}

function nextStep() {
  // 验证当前步骤
  if (currentStep.value === 0 && !form.type) {
    ElMessage.warning('请选择申请类型')
    return
  }

  if (currentStep.value === 1) {
    if (form.familyInfo.members.length === 0) {
      ElMessage.warning('请至少添加一名家庭成员')
      return
    }
    if (!form.familyInfo.annualIncome || form.familyInfo.annualIncome <= 0) {
      ElMessage.warning('请填写家庭年收入')
      return
    }
  }

  if (currentStep.value === 2 && (!form.documents || form.documents.length === 0)) {
    ElMessage.warning('请上传证明材料')
    return
  }

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function handleSubmit() {
  try {
    submitting.value = true

    const submitData = {
      ...form,
      difficultyLevel: calculatedLevel.value as AidApplication['difficultyLevel'],
      amount: calculatedAmount.value
    }

    await store.submitAid(submitData)
    ElMessage.success('助学金申请已提交')

    // 重置表单并切换到记录标签
    resetForm()
    activeTab.value = 'records'
    await store.fetchAidApplications()
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '提交失败')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.type = 'national'
  form.familyInfo = {
    members: [],
    annualIncome: 0,
    perCapitaIncome: 0,
    specialTypes: []
  }
  form.documents = []
  currentStep.value = 0
}

function viewDetail(item: AidApplication) {
  currentDetail.value = item
  showDetailDialog.value = true
}

onMounted(() => {
  store.fetchAidApplications()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 标签页切换 -->
    <div class="flex gap-4 border-b border-gray-200">
      <button @click="activeTab = 'apply'"
              :class="['px-6 py-3 text-sm font-medium transition-all relative',
                activeTab === 'apply'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary']">
        <el-icon><EditPen /></el-icon> 申请助学金
      </button>
      <button @click="activeTab = 'records'"
              :class="['px-6 py-3 text-sm font-medium transition-all relative',
                activeTab === 'records'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary']">
        <el-icon><Document /></el-icon> 申请记录
      </button>
    </div>

    <!-- ========== 申请表单区域 ========== -->
    <section v-if="activeTab === 'apply'" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <!-- 步骤条 -->
      <el-steps :active="currentStep" align-center class="mb-8">
        <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description" />
      </el-steps>

      <!-- 步骤1：选择申请类型 -->
      <div v-show="currentStep === 0" class="space-y-6">
        <h3 class="text-base font-semibold text-text-primary">选择助学金类型</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="opt in typeOptions" :key="opt.value"
               @click="form.type = opt.value"
               :class="['p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md',
                 form.type === opt.value
                   ? 'border-primary bg-primary/5 shadow-sm'
                   : 'border-gray-200 hover:border-primary/30']">
            <div class="text-3xl mb-3">{{ opt.icon }}</div>
            <h4 class="font-semibold text-text-primary mb-2">{{ opt.label }}</h4>
            <p class="text-xs text-text-secondary mb-3">{{ opt.description }}</p>
            <div class="space-y-1 text-xs">
              <p><span class="text-text-tertiary">金额范围：</span><span class="font-medium text-gold">{{ opt.amountRange }}</span></p>
              <p><span class="text-text-tertiary">截止日期：</span>{{ opt.deadline }}</p>
            </div>
          </div>
        </div>

        <div v-if="form.type" class="flex justify-end">
          <button @click="nextStep"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg transition-all">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤2：填写家庭信息 -->
      <div v-show="currentStep === 1" class="space-y-6">
        <h3 class="text-base font-semibold text-text-primary">家庭经济情况调查</h3>

        <!-- 家庭成员信息 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-text-primary">家庭成员信息</label>
            <button @click="addFamilyMember"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
              <el-icon :size="14"><Plus /></el-icon> 添加成员
            </button>
          </div>

          <div v-if="form.familyInfo.members.length > 0" class="space-y-3">
            <div v-for="(member, index) in form.familyInfo.members" :key="member.id"
                 class="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div class="flex items-start justify-between mb-3">
                <h5 class="text-sm font-medium text-text-primary">家庭成员 {{ index + 1 }}</h5>
                <button @click="removeFamilyMember(index)"
                        class="p-1 rounded hover:bg-crimson/10 text-crimson transition-colors">
                  <el-icon :size="16"><Delete /></el-icon>
                </button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">姓名 *</label>
                  <el-input v-model="member.name" placeholder="姓名" size="small" />
                </div>
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">关系 *</label>
                  <el-select v-model="member.relation" placeholder="选择关系" size="small" class="w-full">
                    <el-option label="父亲" value="父亲" />
                    <el-option label="母亲" value="母亲" />
                    <el-option label="兄弟" value="兄弟" />
                    <el-option label="姐妹" value="姐妹" />
                    <el-option label="祖父" value="祖父" />
                    <el-option label="祖母" value="祖母" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </div>
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">年龄</label>
                  <el-input-number v-model="member.age" :min="0" :max="120" size="small" class="w-full" />
                </div>
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">职业</label>
                  <el-input v-model="member.occupation" placeholder="职业" size="small" />
                </div>
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">年收入（元）</label>
                  <el-input-number v-model="member.income" :min="0" :precision="2" size="small" class="w-full" />
                </div>
                <div>
                  <label class="block text-xs text-text-tertiary mb-1">健康状况</label>
                  <el-select v-model="member.healthStatus" placeholder="健康状况" size="small" class="w-full">
                    <el-option label="健康" value="健康" />
                    <el-option label="一般" value="一般" />
                    <el-option label="较差" value="较差" />
                    <el-option label="患病" value="患病" />
                    <el-option label="残疾" value="残疾" />
                  </el-select>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <p class="text-text-tertiary text-sm">暂无家庭成员信息，点击上方按钮添加</p>
          </div>
        </div>

        <!-- 家庭收入 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">家庭年总收入（元）*</label>
            <el-input-number v-model="form.familyInfo.annualIncome" :min="0" :precision="2"
                             class="w-full" @change="calculatePerCapita"
                             placeholder="请输入家庭年总收入" :controls="true" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">人均年收入（元）</label>
            <el-input :model-value="form.familyInfo.perCapitaIncome.toFixed(2)" disabled
                     class="w-full" placeholder="自动计算">
              <template #prefix>📊</template>
            </el-input>
          </div>
        </div>

        <!-- 特殊困难类型 -->
        <div>
          <label class="block text-sm font-medium text-text-primary mb-3">特殊困难类型（可多选）</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="type in specialDifficultyTypes" :key="type.value"
                 @click="handleSpecialTypeChange(
                   form.familyInfo.specialTypes.includes(type.value)
                     ? form.familyInfo.specialTypes.filter(t => t !== type.value)
                     : [...form.familyInfo.specialTypes, type.value]
                 )"
                 :class="['p-3 rounded-xl border-2 cursor-pointer transition-all text-center',
                   form.familyInfo.specialTypes.includes(type.value)
                     ? 'border-warning bg-warning/5'
                     : 'border-gray-200 hover:border-warning/30']">
              <span class="text-xl">{{ type.icon }}</span>
              <p class="text-xs font-medium text-text-primary mt-1">{{ type.label }}</p>
            </div>
          </div>
        </div>

        <!-- 困难等级预览 -->
        <div v-if="calculatedLevel" class="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-gold-light/10 border border-gold/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-text-primary">系统评估困难等级</p>
              <p class="text-xs text-text-secondary mt-1">根据您填写的家庭情况自动计算</p>
            </div>
            <div :class="['px-4 py-2 rounded-lg border-2 text-center', difficultyLevels.find(l => l.value === calculatedLevel)?.color]">
              <p class="text-lg font-bold">{{ difficultyLevels.find(l => l.value === calculatedLevel)?.amount }} 元</p>
              <p class="text-xs mt-1">{{ difficultyLevels.find(l => l.value === calculatedLevel)?.desc }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <button @click="prevStep"
                  class="px-6 py-2.5 rounded-xl border border-gray-300 text-text-secondary text-sm font-medium hover:bg-gray-50 transition-all">
            ← 上一步
          </button>
          <button @click="nextStep"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg transition-all">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤3：上传材料 -->
      <div v-show="currentStep === 2" class="space-y-6">
        <h3 class="text-base font-semibold text-text-primary">上传证明材料</h3>

        <div class="p-4 rounded-xl bg-warning/5 border border-warning/20">
          <p class="text-sm text-text-secondary"><strong>所需材料清单：</strong></p>
          <ul class="mt-2 space-y-1 text-xs text-text-secondary list-disc list-inside">
            <li>身份证正反面复印件</li>
            <li>家庭经济情况调查表（盖章）</li>
            <li v-if="form.familyInfo.specialTypes.includes('低保户')">低保证明</li>
            <li v-if="form.familyInfo.specialTypes.includes('残疾')">残疾证</li>
            <li>其他相关证明材料</li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
               @click="$refs.fileInput?.click()">
            <el-icon :size="40" class="text-text-quaternary mb-3"><Upload /></el-icon>
            <p class="text-base text-text-secondary font-medium">点击或拖拽文件到此处上传</p>
            <p class="text-xs text-text-quaternary mt-2">支持 JPG、PNG、GIF、PDF格式，单个文件不超过10MB，最多上传10个文件</p>
            <input ref="fileInput" type="file" multiple accept=".jpg,.jpeg,.png,.gif,.pdf"
                   class="hidden" @change="handleFileUpload" />
          </div>

          <!-- 已上传文件列表 -->
          <div v-if="form.documents && form.documents.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div v-for="(file, index) in form.documents" :key="index"
                 class="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img v-if="file.type.startsWith('image')" :src="URL.createObjectURL(file)"
                   class="w-full h-28 object-cover" alt="预览" />
              <div v-else class="w-full h-28 flex flex-col items-center justify-center bg-gray-100">
                <el-icon :size="32" class="text-text-quaternary"><DocumentChecked /></el-icon>
                <span class="text-[10px] text-text-quaternary mt-1">PDF文件</span>
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button @click.stop="removeDocument(index)" class="p-1.5 rounded-lg bg-crimson text-white hover:bg-crimson-light">
                  <el-icon :size="16"><Delete /></el-icon>
                </button>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 truncate">
                {{ file.name }}
              </div>
            </div>
          </div>

          <p v-if="form.documents" class="text-xs text-text-tertiary">
            已上传 {{ form.documents.length }}/10 个文件
          </p>
        </div>

        <div class="flex justify-between pt-4">
          <button @click="prevStep"
                  class="px-6 py-2.5 rounded-xl border border-gray-300 text-text-secondary text-sm font-medium hover:bg-gray-50 transition-all">
            ← 上一步
          </button>
          <button @click="nextStep"
                  class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg transition-all">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤4：确认提交 -->
      <div v-show="currentStep === 3" class="space-y-6">
        <h3 class="text-base font-semibold text-text-primary">确认申请信息</h3>

        <!-- 信息汇总 -->
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Money /> 基本信息
            </h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div><span class="text-text-tertiary">申请类型：</span>{{ typeOptions.find(t => t.value === form.type)?.label }}</div>
              <div><span class="text-text-tertiary">困难等级：</span>{{ difficultyLevels.find(l => l.value === calculatedLevel)?.label }}</div>
              <div><span class="text-text-tertiary">预计金额：</span><strong class="text-gold">¥{{ calculatedAmount }}</strong></div>
              <div><span class="text-text-tertiary">预计发放：</span>{{ expectedIssueDate }}</div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 class="text-sm font-semibold text-text-primary mb-3">👨‍👩‍👧 家庭情况</h4>
            <div class="text-sm space-y-2">
              <p><span class="text-text-tertiary">家庭成员数：</span>{{ form.familyInfo.members.length }} 人</p>
              <p><span class="text-text-tertiary">家庭年收入：</span>¥{{ form.familyInfo.annualIncome.toLocaleString() }}</p>
              <p><span class="text-text-tertiary">人均年收入：</span>¥{{ form.familyInfo.perCapitaIncome.toLocaleString() }}</p>
              <p><span class="text-text-tertiary">特殊困难：</span>{{ form.familyInfo.specialTypes.join('、') || '无' }}</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1"><el-icon :size="14"><Upload /></el-icon> 上传材料</h4>
            <p class="text-sm text-text-primary">共 {{ form.documents?.length || 0 }} 个文件</p>
          </div>
        </div>

        <!-- 承诺书 -->
        <div class="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p class="text-xs text-text-secondary leading-relaxed">
            本人承诺以上所填信息真实有效，如有虚假，愿意承担相应责任。本人同意学校对本人的家庭经济情况进行核实。
          </p>
        </div>

        <div class="flex justify-between pt-4">
          <button @click="prevStep"
                  class="px-6 py-2.5 rounded-xl border border-gray-300 text-text-secondary text-sm font-medium hover:bg-gray-50 transition-all">
            ← 上一步
          </button>
          <button @click="handleSubmit"
                  :disabled="submitting"
                  class="px-8 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-sm font-semibold shadow-gold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            <Loading v-if="submitting" class="animate-spin" />
            {{ submitting ? '提交中...' : '确认提交申请' }}
          </button>
        </div>
      </div>
    </section>

    <!-- ========== 申请记录区域 ========== -->
    <section v-if="activeTab === 'records'" class="space-y-4">
      <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
        <el-icon :size="20" class="text-primary"><Clock /></el-icon>
        历史申请记录
      </h2>

      <!-- 加载状态 -->
      <div v-if="store.loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-gold/10 animate-pulse"></div>
      </div>

      <!-- 记录列表 -->
      <div v-else-if="store.aidList.length > 0" class="space-y-4">
        <div v-for="item in store.aidList" :key="item.id"
             class="bg-white/90 backdrop-blur-md rounded-xl border border-primary-50/50 p-5 hover:shadow-md transition-all cursor-pointer"
             @click="viewDetail(item)">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border', statusMap[item.status]?.color]">
                {{ statusMap[item.status]?.icon }} {{ statusMap[item.status]?.label }}
              </span>
              <span class="text-base font-semibold text-text-primary">
                {{ typeOptions.find(t => t.value === item.type)?.label }}
              </span>
            </div>
            <span class="text-xs text-text-quaternary">{{ item.submittedAt }}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p class="text-xs text-text-tertiary">申请金额</p>
              <p class="font-semibold text-gold">¥{{ item.amount.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary">困难等级</p>
              <p class="font-medium text-text-primary">{{ difficultyLevels.find(l => l.value === item.difficultyLevel)?.label }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary">预计发放</p>
              <p class="text-text-primary">{{ item.expectedIssueDate || '-' }}</p>
            </div>
            <div v-if="item.issuedAt">
              <p class="text-xs text-text-tertiary">实际发放</p>
              <p class="text-pine font-medium">{{ item.issuedAt }}</p>
            </div>
          </div>

          <!-- 审批意见 -->
          <div v-if="item.reviewerComment" class="mt-3 p-3 rounded-lg bg-info/5 border border-info/20">
            <p class="text-xs font-medium text-info mb-1">审批意见：</p>
            <p class="text-sm text-text-secondary">{{ item.reviewerComment }}</p>
          </div>

          <!-- 驳回原因 -->
          <div v-if="item.rejectReason" class="mt-3 p-3 rounded-lg bg-crimson/5 border border-crimson/20">
            <p class="text-xs font-medium text-crimson mb-1">驳回原因：</p>
            <p class="text-sm text-crimson/80">{{ item.rejectReason }}</p>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
          <el-icon :size="36" class="text-primary/40"><Money /></el-icon>
        </div>
        <p class="text-text-tertiary text-base font-medium mb-2">暂无申请记录</p>
        <p class="text-text-quaternary text-sm">提交助学金申请后，记录将显示在此处</p>
        <button @click="activeTab = 'apply'; resetForm()"
                class="mt-4 px-6 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all">
          立即申请
        </button>
      </div>
    </section>

    <!-- ========== 详情弹窗 ========== -->
    <el-dialog v-model="showDetailDialog" title="申请详情" width="700px" :close-on-click-modal="true">
      <div v-if="currentDetail" class="space-y-5">
        <!-- 进度时间线 -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-3">申请进度</h4>
          <el-timeline>
            <el-timeline-item :timestamp="currentDetail.submittedAt" placement="top" type="primary"
                              :hollow="currentDetail.status !== 'submitted'">
              <p class="font-medium">已提交</p>
              <p class="text-xs text-text-secondary">申请已提交至学院审核</p>
            </el-timeline-item>
            <el-timeline-item v-if="['reviewing', 'publicized', 'approved', 'rejected', 'issued'].includes(currentDetail.status)"
                              timestamp="" placement="top" type="warning"
                              :hollow="!['reviewing'].includes(currentDetail.status)">
              <p class="font-medium">学院审核</p>
              <p class="text-xs text-text-secondary">学院正在审核您的申请材料</p>
            </el-timeline-item>
            <el-timeline-item v-if="['publicized', 'approved', 'rejected', 'issued'].includes(currentDetail.status)"
                              timestamp="" placement="top" type="info"
                              :hollow="!['publicized'].includes(currentDetail.status)">
              <p class="font-medium">公示期</p>
              <p class="text-xs text-text-secondary">正在全校范围内进行公示</p>
            </el-timeline-item>
            <el-timeline-item v-if="['approved', 'issued'].includes(currentDetail.status)"
                              timestamp="" placement="top" type="success"
                              :hollow="!['approved'].includes(currentDetail.status)">
              <p class="font-medium">学校批准</p>
              <p class="text-xs text-text-secondary">申请已获学校批准</p>
            </el-timeline-item>
            <el-timeline-item v-if="currentDetail.status === 'issued'"
                              :timestamp="currentDetail.issuedAt" placement="top" type="success">
              <p class="font-medium">已发放</p>
              <p class="text-xs text-text-secondary">助学金已发放至您的账户</p>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-text-tertiary">申请类型</label>
            <p class="text-sm font-medium text-text-primary mt-1">
              {{ typeOptions.find(t => t.value === currentDetail.type)?.label }}
            </p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">困难等级</label>
            <p class="text-sm font-medium text-text-primary mt-1">
              {{ difficultyLevels.find(l => l.value === currentDetail.difficultyLevel)?.label }}
            </p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">申请金额</label>
            <p class="text-sm font-bold text-gold mt-1">¥{{ currentDetail.amount.toLocaleString() }}</p>
          </div>
          <div>
            <label class="text-xs text-text-tertiary">状态</label>
            <p class="mt-1">
              <span :class="['px-2 py-1 rounded-full text-xs font-bold border', statusMap[currentDetail.status]?.color]">
                {{ statusMap[currentDetail.status]?.icon }} {{ statusMap[currentDetail.status]?.label }}
              </span>
            </p>
          </div>
        </div>

        <!-- 家庭情况 -->
        <div>
          <label class="text-xs text-text-tertiary">家庭经济情况</label>
          <div class="mt-1 p-3 rounded-lg bg-gray-50 text-sm space-y-1">
            <p><span class="text-text-tertiary">年收入：</span>¥{{ currentDetail.familyInfo.annualIncome?.toLocaleString() }}</p>
            <p><span class="text-text-tertiary">人均收入：</span>¥{{ currentDetail.familyInfo.perCapitaIncome?.toLocaleString() }}</p>
            <p><span class="text-text-tertiary">特殊困难：</span>{{ currentDetail.familyInfo.specialTypes.join('、') || '无' }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
