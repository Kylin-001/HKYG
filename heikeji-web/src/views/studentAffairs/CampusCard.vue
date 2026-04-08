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
    active: { text: '正常使用', color: 'text-pine bg-pine/10 border-pine/20' },
    frozen: { text: '已冻结', color: 'text-warning bg-warning/10 border-warning/20' },
    lost: { text: '已挂失', color: 'text-crimson bg-crimson/10 border-crimson/20' }
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
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 标签页导航 -->
    <div class="flex gap-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
      <button v-for="tab in [
        { value: 'overview', label: '卡片概览', icon: CreditCard },
        { value: 'recharge', label: '在线充值', icon: Money },
        { value: 'records', label: '充值记录', icon: Tickets },
        { value: 'consume', label: '消费记录', icon: ShoppingCart },
        { value: 'settings', label: '设置', icon: Setting }
      ]" :key="tab.value"
              @click="activeTab = tab.value"
              :class="['px-5 py-3 text-sm font-medium whitespace-nowrap transition-all relative flex items-center gap-1.5',
                activeTab === tab.value
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary']">
        <el-icon :size="15"><component :is="tab.icon" /></el-icon> {{ tab.label }}
      </button>
    </div>

    <!-- ========== 卡片概览 ========== -->
    <section v-if="activeTab === 'overview'" class="space-y-6">
      <!-- 校园卡信息卡片 -->
      <div v-if="cardInfo" class="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-start justify-between mb-6">
          <div>
            <p class="text-white/70 text-sm mb-1">校园卡余额</p>
            <p class="text-4xl font-bold">¥{{ cardInfo.balance.toFixed(2) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-3 py-1 rounded-full text-xs font-medium border border-white/30', cardStatusText.color.replace('bg-', 'bg-white/').replace('border-', 'border-white/').replace('text-', 'text-white')]">
              {{ cardStatusText.text }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p class="text-white/70 text-xs">卡号</p>
            <p class="font-mono font-semibold mt-1">{{ cardInfo.cardNo }}</p>
          </div>
          <div>
            <p class="text-white/70 text-xs">最后充值</p>
            <p class="mt-1">{{ cardInfo.lastRechargeAt || '-' }}</p>
          </div>
          <div>
            <p class="text-white/70 text-xs">最后消费</p>
            <p class="mt-1">{{ cardInfo.lastConsumeAt || '-' }}</p>
          </div>
          <div>
            <p class="text-white/70 text-xs">密码修改</p>
            <p class="mt-1">{{ cardInfo.passwordLastModified || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button @click="activeTab = 'recharge'"
                class="p-5 rounded-xl bg-gradient-to-br from-gold/10 to-gold-light/10 border border-gold/20 hover:shadow-md transition-all text-center">
          <el-icon :size="28" class="text-gold mb-2 block mx-auto"><Money /></el-icon>
          <p class="text-sm font-semibold text-text-primary">立即充值</p>
        </button>

        <button v-if="isCardActive" @click="handleReportLost"
                class="p-5 rounded-xl bg-gradient-to-br from-crimson/10 to-crimson-light/10 border border-crimson/20 hover:shadow-md transition-all text-center">
          <el-icon :size="28" class="text-crimson mb-2 block mx-auto"><Lock /></el-icon>
          <p class="text-sm font-semibold text-text-primary">挂失</p>
        </button>

        <button v-if="!isCardActive" @click="handleUnfreeze"
                class="p-5 rounded-xl bg-gradient-to-br from-pine/10 to-pine-light/10 border border-pine/20 hover:shadow-md transition-all text-center">
          <el-icon :size="28" class="text-pine mb-2 block mx-auto"><Unlock /></el-icon>
          <p class="text-sm font-semibold text-text-primary">解挂</p>
        </button>

        <button @click="handleReissue"
                class="p-5 rounded-xl bg-gradient-to-br from-info/10 to-info-light/10 border border-info/20 hover:shadow-md transition-all text-center">
          <el-icon :size="28" class="text-info mb-2 block mx-auto"><RefreshRight /></el-icon>
          <p class="text-sm font-semibold text-text-primary">补办 (¥20)</p>
        </button>

        <button @click="activeTab = 'settings'"
                class="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 border border-primary/20 hover:shadow-md transition-all text-center">
          <el-icon :size="28" class="text-primary mb-2 block mx-auto"><Setting /></el-icon>
          <p class="text-sm font-semibold text-text-primary">权限管理</p>
        </button>
      </div>

      <!-- 最近交易 -->
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Timer /> 最近交易记录
        </h3>

        <div class="space-y-3">
          <div v-for="record in consumeRecords.slice(0, 5)" :key="record.id"
               class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" :style="{ backgroundColor: consumeTypeMap[record.type]?.color || '#95A5A6' }">
                <el-icon :size="14"><component :is="consumeTypeMap[record.type]?.icon || CreditCard" /></el-icon>
              </span>
              <div>
                <p class="text-sm font-medium text-text-primary">{{ record.merchant }}</p>
                <p class="text-xs text-text-quaternary">{{ record.location }} · {{ record.createdAt }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-crimson">-¥{{ record.amount.toFixed(2) }}</p>
              <p class="text-xs text-text-quaternary">余额 ¥{{ record.balanceAfter.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 在线充值 ========== -->
    <section v-if="activeTab === 'recharge'" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
        <CreditCard /> 在线充值
      </h2>

      <!-- 当前余额 -->
      <div v-if="cardInfo" class="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p class="text-xs text-text-secondary mb-1">当前余额</p>
        <p class="text-3xl font-bold text-primary">¥{{ cardInfo.balance.toFixed(2) }}</p>
      </div>

      <!-- 快捷金额 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-text-primary mb-3">选择充值金额</label>
        <div class="grid grid-cols-4 gap-3">
          <button v-for="amount in quickAmounts" :key="amount"
                  @click="rechargeForm.rechargeAmount = amount"
                  :class="['py-4 rounded-xl border-2 font-bold text-lg transition-all',
                    rechargeForm.rechargeAmount === amount
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 hover:border-primary/30 text-text-primary']">
            ¥{{ amount }}
          </button>
        </div>
      </div>

      <!-- 自定义金额 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-text-primary mb-3">或输入自定义金额</label>
        <el-input-number v-model="rechargeForm.rechargeAmount" :min="10" :max="1000" :step="10"
                         class="w-full" size="large" :precision="2" controls-position="right" />
        <p class="mt-2 text-xs text-text-quaternary">最低充值 ¥10，最高 ¥1000</p>
      </div>

      <!-- 支付方式 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-text-primary mb-3">选择支付方式</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="method in paymentMethods" :key="method.value"
               @click="rechargeForm.method = method.value as RechargeRecord['method']"
               :class="['p-4 rounded-xl border-2 cursor-pointer transition-all text-center',
                 rechargeForm.method === method.value
                   ? 'border-primary bg-primary/5 shadow-sm'
                   : 'border-gray-200 hover:border-primary/30']">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mx-auto" :style="{ backgroundColor: method.color }">{{ method.short }}</span>
            <p class="text-sm font-medium mt-2" :class="rechargeForm.method === method.value ? 'text-primary' : 'text-text-primary'">{{ method.label }}</p>
          </div>
        </div>
      </div>

      <!-- 确认信息 -->
      <div class="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
        <div class="flex justify-between items-center">
          <span class="text-text-secondary">充值金额：</span>
          <span class="text-2xl font-bold text-gold">¥{{ rechargeForm.rechargeAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button @click="handleRecharge"
              :disabled="loading"
              class="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-base font-bold shadow-gold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
        <Plus v-if="!loading" />
        <Loading v-if="loading" class="animate-spin" />
        {{ loading ? '处理中...' : `确认充值 ¥${rechargeForm.rechargeAmount.toFixed(2)}` }}
      </button>
    </section>

    <!-- ========== 充值记录 ========== -->
    <section v-if="activeTab === 'records'" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <Timer /> 充值记录（最近30天）
      </h2>

      <div v-if="rechargeRecords.length > 0" class="space-y-3">
        <div v-for="record in rechargeRecords" :key="record.id"
             class="p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" :style="{ backgroundColor: methodColorMap[record.method] || '#6B7280' }">
                {{ paymentMethods.find(m => m.value === record.method)?.short || '?' }}
              </span>
              <div>
                <p class="font-semibold text-text-primary">{{ paymentMethods.find(m => m.value === record.method)?.label }}</p>
                <p class="text-xs text-text-quaternary">{{ record.createdAt }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-pine">+¥{{ record.amount.toFixed(2) }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded',
                record.status === 'success' ? 'bg-pine/10 text-pine' : 'bg-crimson/10 text-crimson']">
                {{ record.status === 'success' ? '成功' : '失败' }}
              </span>
            </div>
          </div>
          <div v-if="record.transactionNo" class="pt-2 border-t border-gray-100 text-xs text-text-quaternary">
            交易号：{{ record.transactionNo }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/50 flex items-center justify-center">
          <el-icon :size="24" class="text-primary/40"><Tickets /></el-icon>
        </div>
        <p class="text-text-tertiary text-sm">暂无充值记录</p>
      </div>
    </section>

    <!-- ========== 消费记录 ========== -->
    <section v-if="activeTab === 'consume'" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <ShoppingCart /> 消费记录
      </h2>

      <div v-if="consumeRecords.length > 0" class="space-y-3">
        <div v-for="record in consumeRecords" :key="record.id"
             class="p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" :style="{ backgroundColor: consumeTypeMap[record.type]?.color || '#95A5A6' }">
                <el-icon :size="13"><component :is="consumeTypeMap[record.type]?.icon || CreditCard" /></el-icon>
              </span>
              <div>
                <p class="font-semibold text-text-primary">{{ record.merchant }}</p>
                <p class="text-xs text-text-quaternary">{{ record.location }} · {{ record.createdAt }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-crimson">-¥{{ record.amount.toFixed(2) }}</p>
              <p class="text-xs text-text-quaternary">余额 ¥{{ record.balanceAfter.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-info/10 flex items-center justify-center">
          <el-icon :size="24" class="text-info/40"><ShoppingCart /></el-icon>
        </div>
        <p class="text-text-tertiary text-sm">暂无消费记录</p>
      </div>
    </section>

    <!-- ========== 设置 ========== -->
    <section v-if="activeTab === 'settings'" class="space-y-6">
      <!-- 权限管理 -->
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Lock /> 校园卡权限管理
        </h3>

        <div class="space-y-4">
          <div v-for="(perm, key) in permissions" :key="key"
               class="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-all">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" :style="{ backgroundColor: key === 'accessControl' ? '#E74C3C' : key === 'library' ? '#9B59B6' : key === 'canteen' ? '#E67E22' : '#3498DB' }">
                <el-icon :size="16"><component :is="permissionIconMap[key]?.icon || Setting" /></el-icon>
              </span>
              <div>
                <p class="font-medium text-text-primary">{{ permissionIconMap[key]?.label }}</p>
                <p class="text-xs text-text-tertiary">{{ perm ? '已开启' : '已关闭' }}</p>
              </div>
            </div>
            <button @click="togglePermission(key as keyof typeof permissions)"
                    :class="['relative w-14 h-7 rounded-full transition-colors',
                      perm ? 'bg-primary' : 'bg-gray-300']">
              <span :class="['absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                perm ? 'right-1' : 'left-1']"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- 修改密码 -->
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Key /> 修改密码
        </h3>

        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm text-text-secondary mb-2">当前密码</label>
            <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
          </div>
          <div>
            <label class="block text-sm text-text-secondary mb-2">新密码</label>
            <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码（至少6位）" />
          </div>
          <div>
            <label class="block text-sm text-text-secondary mb-2">确认新密码</label>
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </div>

          <button @click="handleChangePassword"
                  :disabled="loading"
                  class="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-brand hover:shadow-lg disabled:opacity-50 transition-all">
            {{ loading ? '处理中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
