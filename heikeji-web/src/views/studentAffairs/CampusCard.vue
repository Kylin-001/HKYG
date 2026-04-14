<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import type { CampusCardInfo, RechargeRecord, ConsumeRecord, CampusCardFormData } from '@/types/studentAffairs'
import { CreditCard, Plus, Warning, Lock, Unlock, Key, Timer, ShoppingCart,
  Money, Wallet, Tickets, DocumentChecked, Setting, RefreshRight, Loading,
  CircleCheckFilled, Bowl, Shop, Reading, Switch } from '@element-plus/icons-vue'

const store = useStudentAffairsStore()

// ==================== 状态管理 ====================
const cardInfo = ref<CampusCardInfo | null>(null)
const rechargeRecords = ref<RechargeRecord[]>([])
const consumeRecords = ref<ConsumeRecord[]>([])
const activeTab = ref('overview') // 'overview' | 'recharge' | 'records' | 'consume' | 'settings'
const loading = ref(false)

// 充值表单
const rechargeForm = reactive<CampusCardFormData>({
  rechargeAmount: 50,
  method: 'wechat',
  newPassword: '',
  oldPassword: ''
})

const quickAmounts = [50, 100, 200, 500]

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 权限管理
const permissions = reactive({
  accessControl: true,
  library: true,
  canteen: true,
  supermarket: true
})

// ==================== 配置项 ====================
const paymentMethods = [
  { value: 'wechat', label: '微信支付', color: '#07C160', short: '微' },
  { value: 'alipay', label: '支付宝', color: '#1677FF', short: '支' },
  { value: 'bank', label: '银行卡', color: '#F5A623', short: '银' },
  { value: 'campus_card', label: '现金充值', color: '#D4A843', short: '现' }
]

const methodColorMap: Record<string, string> = {
  wechat: '#07C160',
  alipay: '#1677FF',
  bank: '#F5A623',
  campus_card: '#D4A843'
}

const consumeTypeMap: Record<string, { icon: any; label: string; color: string }> = {
  canteen: { icon: Bowl, label: '食堂', color: '#E67E22' },
  supermarket: { icon: Shop, label: '超市', color: '#3498DB' },
  library: { icon: Reading, label: '图书馆', color: '#9B59B6' },
  other: { icon: CreditCard, label: '其他', color: '#95A5A6' }
}

const permissionIconMap: Record<string, { icon: any; label: string }> = {
  accessControl: { icon: Switch, label: '门禁系统' },
  library: { icon: Reading, label: '图书馆' },
  canteen: { icon: Bowl, label: '食堂消费' },
  supermarket: { icon: Shop, label: '超市购物' }
}

// 模拟数据（实际应从API获取）
const mockCardInfo: CampusCardInfo = {
  cardNo: '2024001234',
  balance: 256.80,
  status: 'active',
  lastRechargeAt: '2026-04-01 14:30',
  lastConsumeAt: '2026-04-05 12:15',
  permissions: {
    accessControl: true,
    library: true,
    canteen: true,
    supermarket: true
  },
  passwordLastModified: '2025-09-01'
}

const mockRechargeRecords: RechargeRecord[] = [
  { id: '1', amount: 100, method: 'wechat', status: 'success', transactionNo: 'WX202604011430001', createdAt: '2026-04-01 14:30' },
  { id: '2', amount: 50, method: 'alipay', status: 'success', transactionNo: 'ALI20260325100002', createdAt: '2026-03-25 10:00' },
  { id: '3', amount: 200, method: 'bank', status: 'success', transactionNo: 'BK202603150930003', createdAt: '2026-03-15 09:30' }
]

const mockConsumeRecords: ConsumeRecord[] = [
  { id: '1', amount: 15.50, merchant: '第一食堂', location: '一食堂2楼', type: 'canteen', balanceAfter: 241.30, createdAt: '2026-04-05 12:15' },
  { id: '2', amount: 8.00, merchant: '校园超市', location: '学生活动中心1楼', type: 'supermarket', balanceAfter: 256.80, createdAt: '2026-04-05 08:30' },
  { id: '3', amount: 25.00, merchant: '图书馆复印', location: '图书馆1楼', type: 'library', balanceAfter: 264.80, createdAt: '2026-04-04 16:20' }
]

// ==================== 计算属性 ====================
const cardStatusText = computed(() => {
  if (!cardInfo.value) return { text: '未知', color: '' }
  const map: Record<string, { text: string; color: string }> = {
    active: { text: '正常使用', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    frozen: { text: '已冻结', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    lost: { text: '已挂失', color: 'text-rose-600 bg-rose-50 border-rose-200' }
  }
  return map[cardInfo.value.status] || { text: '未知', color: '' }
})

const isCardActive = computed(() => cardInfo.value?.status === 'active')

// ==================== 方法 ====================
async function fetchCardData() {
  try {
    loading.value = true
    // 实际应该调用API：await store.fetchCampusCard()
    cardInfo.value = mockCardInfo
    rechargeRecords.value = mockRechargeRecords
    consumeRecords.value = mockConsumeRecords
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '获取校园卡信息失败')
  } finally {
    loading.value = false
  }
}

async function handleRecharge() {
  if (rechargeForm.rechargeAmount <= 0) {
    ElMessage.warning('请输入有效的充值金额')
    return
  }

  if (rechargeForm.rechargeAmount < 10) {
    ElMessage.warning('最低充值金额为10元')
    return
  }

  if (rechargeForm.rechargeAmount > 1000) {
    ElMessage.warning('单次最高充值1000元')
    return
  }

  try {
    loading.value = true

    // 调用充值接口
    await store.rechargeCard(rechargeForm.rechargeAmount, rechargeForm.method)

    ElMessage.success(`成功充值 ¥${rechargeForm.rechargeAmount}`)
    rechargeForm.rechargeAmount = 50
    await fetchCardData()
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '充值失败')
  } finally {
    loading.value = false
  }
}

async function handleReportLost() {
  try {
    await ElMessageBox.confirm(
      '挂失后校园卡将立即冻结，所有功能暂停使用。确定要挂失吗？',
      '确认挂失',
      {
        confirmButtonText: '确定挂失',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    )

    await store.reportLost()
    ElMessage.success('校园卡已挂失')
    await fetchCardData()
  } catch (err: unknown) {
    if (err !== 'cancel') {
      ElMessage.error(err instanceof Error ? err.message : '操作失败')
    }
  }
}

async function handleUnfreeze() {
  try {
    await ElMessageBox.confirm('确定要解冻校园卡吗？解冻后将恢复所有功能。', '确认解冻', {
      confirmButtonText: '确定解冻',
      cancelButtonText: '取消',
      type: 'info'
    })

    // 调用解冻接口
    ElMessage.success('校园卡已解冻')
    await fetchCardData()
  } catch (err: unknown) {
    if (err !== 'cancel') {
      ElMessage.error(err instanceof Error ? err.message : '操作失败')
    }
  }
}

async function handleReissue() {
  try {
    await ElMessageBox.confirm(
      '补办新卡需要支付工本费 ¥20，原卡将自动作废。确定要补办吗？',
      '补办校园卡',
      {
        confirmButtonText: '确定补办 (¥20)',
        cancelButtonText: '再想想',
        type: 'info'
      }
    )

    // 调用补办接口
    ElMessage.success('补办申请已提交，请于3个工作日后到卡务中心领取新卡')
  } catch (err: unknown) {
    // 用户取消
  }
}

async function handleChangePassword() {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整的密码信息')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于6位')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  try {
    loading.value = true
    // 调用修改密码接口
    ElMessage.success('密码修改成功')

    // 重置表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '密码修改失败')
  } finally {
    loading.value = false
  }
}

function togglePermission(key: keyof typeof permissions) {
  permissions[key] = !permissions[key]
  ElMessage.info(`${key === 'accessControl' ? '门禁' : key === 'library' ? '图书馆' : key === 'canteen' ? '食堂' : '超市'}权限已${permissions[key] ? '开启' : '关闭'}`)
}

onMounted(() => {
  fetchCardData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">校园卡服务</h1>
        <p class="text-gray-500">管理您的校园一卡通账户</p>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <div class="flex gap-1 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in [
              { value: 'overview', label: '卡片概览', icon: CreditCard },
              { value: 'recharge', label: '在线充值', icon: Money },
              { value: 'records', label: '充值记录', icon: Tickets },
              { value: 'consume', label: '消费记录', icon: ShoppingCart },
              { value: 'settings', label: '设置', icon: Setting }
            ]"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab.value
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <el-icon :size="16"><component :is="tab.icon" /></el-icon>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ========== 卡片概览 ========== -->
      <section v-if="activeTab === 'overview'" class="space-y-6">
        <!-- 校园卡信息卡片 -->
        <div
          v-if="cardInfo"
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white shadow-2xl shadow-emerald-200"
        >
          <!-- 装饰背景 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-8">
              <div>
                <p class="text-emerald-100 text-sm font-medium mb-1">校园卡余额</p>
                <p class="text-5xl font-bold tracking-tight">¥{{ cardInfo.balance.toFixed(2) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-4 py-1.5 rounded-full text-xs font-semibold border border-white/30 bg-white/20 backdrop-blur-sm">
                  {{ cardStatusText.text }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p class="text-emerald-100 text-xs mb-1">卡号</p>
                <p class="font-mono font-semibold text-lg">{{ cardInfo.cardNo }}</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p class="text-emerald-100 text-xs mb-1">最后充值</p>
                <p class="font-medium">{{ cardInfo.lastRechargeAt || '-' }}</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p class="text-emerald-100 text-xs mb-1">最后消费</p>
                <p class="font-medium">{{ cardInfo.lastConsumeAt || '-' }}</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p class="text-emerald-100 text-xs mb-1">密码修改</p>
                <p class="font-medium">{{ cardInfo.passwordLastModified || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            @click="activeTab = 'recharge'"
            class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-amber-100 hover:border-amber-200 transition-all duration-300 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform duration-300">
              <el-icon :size="24" class="text-white"><Money /></el-icon>
            </div>
            <p class="text-sm font-semibold text-gray-800">立即充值</p>
            <p class="text-xs text-gray-400 mt-1">快速到账</p>
          </button>

          <button
            v-if="isCardActive"
            @click="handleReportLost"
            class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-100 hover:border-rose-200 transition-all duration-300 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform duration-300">
              <el-icon :size="24" class="text-white"><Lock /></el-icon>
            </div>
            <p class="text-sm font-semibold text-gray-800">挂失</p>
            <p class="text-xs text-gray-400 mt-1">冻结账户</p>
          </button>

          <button
            v-if="!isCardActive"
            @click="handleUnfreeze"
            class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100 hover:border-emerald-200 transition-all duration-300 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
              <el-icon :size="24" class="text-white"><Unlock /></el-icon>
            </div>
            <p class="text-sm font-semibold text-gray-800">解挂</p>
            <p class="text-xs text-gray-400 mt-1">恢复使用</p>
          </button>

          <button
            @click="handleReissue"
            class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 transition-all duration-300 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <el-icon :size="24" class="text-white"><RefreshRight /></el-icon>
            </div>
            <p class="text-sm font-semibold text-gray-800">补办</p>
            <p class="text-xs text-gray-400 mt-1">工本费 ¥20</p>
          </button>

          <button
            @click="activeTab = 'settings'"
            class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-100 hover:border-purple-200 transition-all duration-300 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
              <el-icon :size="24" class="text-white"><Setting /></el-icon>
            </div>
            <p class="text-sm font-semibold text-gray-800">权限管理</p>
            <p class="text-xs text-gray-400 mt-1">功能开关</p>
          </button>
        </div>

        <!-- 最近交易 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <el-icon :size="18" class="text-gray-600"><Timer /></el-icon>
            </div>
            最近交易记录
          </h3>

          <div class="space-y-3">
            <div
              v-for="record in consumeRecords.slice(0, 5)"
              :key="record.id"
              class="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                  :style="{ backgroundColor: consumeTypeMap[record.type]?.color || '#95A5A6' }"
                >
                  <el-icon :size="20"><component :is="consumeTypeMap[record.type]?.icon || CreditCard" /></el-icon>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ record.merchant }}</p>
                  <p class="text-xs text-gray-500">{{ record.location }} · {{ record.createdAt }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-rose-500 text-lg">-¥{{ record.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-400">余额 ¥{{ record.balanceAfter.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 在线充值 ========== -->
      <section v-if="activeTab === 'recharge'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <el-icon :size="22" class="text-white"><CreditCard /></el-icon>
          </div>
          <h2 class="text-xl font-bold text-gray-900">在线充值</h2>
        </div>

        <!-- 当前余额 -->
        <div
          v-if="cardInfo"
          class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-center"
        >
          <p class="text-sm text-emerald-600 font-medium mb-2">当前余额</p>
          <p class="text-4xl font-bold text-emerald-600">¥{{ cardInfo.balance.toFixed(2) }}</p>
        </div>

        <!-- 快捷金额 -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-4">选择充值金额</label>
          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              @click="rechargeForm.rechargeAmount = amount"
              :class="[
                'py-4 rounded-xl border-2 font-bold text-lg transition-all duration-300',
                rechargeForm.rechargeAmount === amount
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'border-gray-200 hover:border-emerald-300 text-gray-700 hover:bg-emerald-50'
              ]"
            >
              ¥{{ amount }}
            </button>
          </div>
        </div>

        <!-- 自定义金额 -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-4">或输入自定义金额</label>
          <el-input-number
            v-model="rechargeForm.rechargeAmount"
            :min="10"
            :max="1000"
            :step="10"
            class="w-full"
            size="large"
            :precision="2"
            controls-position="right"
          />
          <p class="mt-3 text-xs text-gray-400">最低充值 ¥10，最高 ¥1000</p>
        </div>

        <!-- 支付方式 -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-4">选择支付方式</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              v-for="method in paymentMethods"
              :key="method.value"
              @click="rechargeForm.method = method.value as RechargeRecord['method']"
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center hover:shadow-md',
                rechargeForm.method === method.value
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300'
              ]"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-2 shadow-md"
                :style="{ backgroundColor: method.color }"
              >
                {{ method.short }}
              </div>
              <p
                class="text-sm font-medium"
                :class="rechargeForm.method === method.value ? 'text-emerald-600' : 'text-gray-700'"
              >
                {{ method.label }}
              </p>
            </div>
          </div>
        </div>

        <!-- 确认信息 -->
        <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">充值金额：</span>
            <span class="text-3xl font-bold text-amber-500">¥{{ rechargeForm.rechargeAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button
          @click="handleRecharge"
          :disabled="loading"
          class="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white text-lg font-bold shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus v-if="!loading" />
          <Loading v-if="loading" class="animate-spin" />
          {{ loading ? '处理中...' : `确认充值 ¥${rechargeForm.rechargeAmount.toFixed(2)}` }}
        </button>
      </section>

      <!-- ========== 充值记录 ========== -->
      <section v-if="activeTab === 'records'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
            <el-icon :size="22" class="text-white"><Timer /></el-icon>
          </div>
          <h2 class="text-xl font-bold text-gray-900">充值记录（最近30天）</h2>
        </div>

        <div v-if="rechargeRecords.length > 0" class="space-y-4">
          <div
            v-for="record in rechargeRecords"
            :key="record.id"
            class="p-5 rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 bg-gray-50/50"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                  :style="{ backgroundColor: methodColorMap[record.method] || '#6B7280' }"
                >
                  {{ paymentMethods.find(m => m.value === record.method)?.short || '?' }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ paymentMethods.find(m => m.value === record.method)?.label }}</p>
                  <p class="text-xs text-gray-400">{{ record.createdAt }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-emerald-500">+¥{{ record.amount.toFixed(2) }}</p>
                <span
                  :class="[
                    'text-xs px-3 py-1 rounded-full font-medium',
                    record.status === 'success'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-rose-100 text-rose-600'
                  ]"
                >
                  {{ record.status === 'success' ? '成功' : '失败' }}
                </span>
              </div>
            </div>
            <div v-if="record.transactionNo" class="pt-3 border-t border-gray-200 text-xs text-gray-400">
              交易号：{{ record.transactionNo }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <el-icon :size="32" class="text-gray-300"><Tickets /></el-icon>
          </div>
          <p class="text-gray-400 text-sm">暂无充值记录</p>
        </div>
      </section>

      <!-- ========== 消费记录 ========== -->
      <section v-if="activeTab === 'consume'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
            <el-icon :size="22" class="text-white"><ShoppingCart /></el-icon>
          </div>
          <h2 class="text-xl font-bold text-gray-900">消费记录</h2>
        </div>

        <div v-if="consumeRecords.length > 0" class="space-y-4">
          <div
            v-for="record in consumeRecords"
            :key="record.id"
            class="p-5 rounded-xl border border-gray-100 hover:border-rose-300 hover:shadow-md transition-all duration-300 bg-gray-50/50"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  :style="{ backgroundColor: consumeTypeMap[record.type]?.color || '#95A5A6' }"
                >
                  <el-icon :size="18"><component :is="consumeTypeMap[record.type]?.icon || CreditCard" /></el-icon>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ record.merchant }}</p>
                  <p class="text-xs text-gray-400">{{ record.location }} · {{ record.createdAt }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-rose-500">-¥{{ record.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-400">余额 ¥{{ record.balanceAfter.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <el-icon :size="32" class="text-gray-300"><ShoppingCart /></el-icon>
          </div>
          <p class="text-gray-400 text-sm">暂无消费记录</p>
        </div>
      </section>

      <!-- ========== 设置 ========== -->
      <section v-if="activeTab === 'settings'" class="space-y-6">
        <!-- 权限管理 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <el-icon :size="22" class="text-white"><Lock /></el-icon>
            </div>
            <h3 class="text-lg font-bold text-gray-900">校园卡权限管理</h3>
          </div>

          <div class="space-y-4">
            <div
              v-for="(perm, key) in permissions"
              :key="key"
              class="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-gray-50/30"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                  :style="{
                    backgroundColor: key === 'accessControl' ? '#E74C3C' : key === 'library' ? '#9B59B6' : key === 'canteen' ? '#E67E22' : '#3498DB'
                  }"
                >
                  <el-icon :size="22"><component :is="permissionIconMap[key]?.icon || Setting" /></el-icon>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ permissionIconMap[key]?.label }}</p>
                  <p class="text-xs text-gray-500">{{ perm ? '已开启' : '已关闭' }}</p>
                </div>
              </div>
              <button
                @click="togglePermission(key as keyof typeof permissions)"
                :class="[
                  'relative w-14 h-8 rounded-full transition-colors duration-300',
                  perm ? 'bg-emerald-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300',
                    perm ? 'right-1 translate-x-0' : 'left-1 translate-x-0'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- 修改密码 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
              <el-icon :size="22" class="text-white"><Key /></el-icon>
            </div>
            <h3 class="text-lg font-bold text-gray-900">修改密码</h3>
          </div>

          <div class="space-y-5 max-w-md">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">当前密码</label>
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
                size="large"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">新密码</label>
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码（至少6位）"
                size="large"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">确认新密码</label>
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
                size="large"
              />
            </div>

            <button
              @click="handleChangePassword"
              :disabled="loading"
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-50 transition-all duration-300"
            >
              {{ loading ? '处理中...' : '确认修改' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
