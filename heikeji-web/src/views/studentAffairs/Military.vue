<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import type { MilitaryUniformOrder, MilitaryOrderItem, SizeChart } from '@/types/studentAffairs'
import { Medal, ShoppingCart, Delete, Plus, Check, CircleClose,
  UserFilled, Goods as Hat, Connection, Goods as Shoes, Goods as TShirt,
  Shop, Box, CreditCard, Wallet, Loading, Document,
  EditPen as Ruler } from '@element-plus/icons-vue'

const store = useStudentAffairsStore()

// ==================== 类型定义 ====================
interface DeliveryOption {
  value: 'pickup' | 'dormitory'
  label: string
  icon: any
  desc: string
  fee: number
}

interface PaymentMethod {
  value: 'campus_card' | 'wechat' | 'alipay'
  label: string
  icon: any
  color: string
  short: string
}

// ==================== 表单数据 ====================
const form = reactive({
  items: [] as MilitaryOrderItem[],
  deliveryMethod: 'pickup' as 'pickup' | 'dormitory',
  paymentMethod: 'campus_card' as 'campus_card' | 'wechat' | 'alipay'
})

// ==================== 状态管理 ====================
const submitting = ref(false)
const showSizeChart = ref(false)
const activeTab = ref('order') // 'order' | 'history'

// ==================== 配置项 ====================
const clothingTypes = [
  { value: 'uniform', label: '迷彩服套装', unitPrice: 120, icon: UserFilled, description: '含上衣+裤子' },
  { value: 'hat', label: '迷彩帽', unitPrice: 25, icon: Hat, description: '标准军帽' },
  { value: 'belt', label: '外腰带', unitPrice: 15, icon: Connection, description: '编织腰带' },
  { value: 'shoes', label: '作训鞋', unitPrice: 45, icon: Shoes, description: '防滑耐磨' },
  { value: 'tshirt', label: 'T恤', unitPrice: 35, icon: TShirt, description: '纯棉短袖' }
]

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

const sizeChartData: SizeChart[] = [
  { size: 'S', height: '160-165cm', weight: '50-55kg', chest: '84-88cm', waist: '68-72cm' },
  { size: 'M', height: '165-170cm', weight: '55-60kg', chest: '88-92cm', waist: '72-76cm' },
  { size: 'L', height: '170-175cm', weight: '60-65kg', chest: '92-96cm', waist: '76-80cm' },
  { size: 'XL', height: '175-180cm', weight: '65-70kg', chest: '96-100cm', waist: '80-84cm' },
  { size: 'XXL', height: '180-185cm', weight: '70-75kg', chest: '100-104cm', waist: '84-88cm' }
]

const deliveryOptions: DeliveryOption[] = [
  { value: 'pickup', label: '自取', icon: Shop, desc: '到指定地点领取', fee: 0 },
  { value: 'dormitory', label: '配送到宿舍', icon: Box, desc: '送货上门（需填写宿舍地址）', fee: 5 }
]

const paymentMethods: PaymentMethod[] = [
  { value: 'campus_card', label: '校园卡支付', icon: CreditCard, color: '#000AB0', short: '卡' },
  { value: 'wechat', label: '微信支付', icon: Wallet, color: '#07C160', short: '微' },
  { value: 'alipay', label: '支付宝', icon: Wallet, color: '#1677FF', short: '支' }
]

const statusMap: Record<string, { label: string; color: string }> = {
  ordered: { label: '待付款', color: 'text-warning bg-warning/10 border-warning/20' },
  paid: { label: '已付款', color: 'text-primary bg-primary/10 border-primary/20' },
  ready: { label: '可领取', color: 'text-info bg-info/10 border-info/20' },
  picked_up: { label: '已领取', color: 'text-pine bg-pine/10 border-pine/20' },
  cancelled: { label: '已取消', color: 'text-text-quaternary bg-gray-100 border-gray-200' }
}

// ==================== 辅助函数 ====================
function findItemByType(type: string): MilitaryOrderItem | undefined {
  return form.items.find((item: MilitaryOrderItem) => item.type === type)
}

function findItemIndexByType(type: string): number {
  return form.items.findIndex((item: MilitaryOrderItem) => item.type === type)
}

// ==================== 计算属性 ====================
const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + item.totalPrice, 0)
})

const deliveryFee = computed(() => {
  return deliveryOptions.find(d => d.value === form.deliveryMethod)?.fee || 0
})

const finalAmount = computed(() => totalAmount.value + deliveryFee.value)

// ==================== 方法 ====================
function addItem(type: MilitaryOrderItem['type']) {
  const existingIndex = form.items.findIndex(item => item.type === type)
  if (existingIndex >= 0) {
    form.items[existingIndex].quantity++
    form.items[existingIndex].totalPrice = form.items[existingIndex].quantity * form.items[existingIndex].unitPrice
    return
  }

  const clothingType = clothingTypes.find(c => c.value === type)
  if (!clothingType) return

  const newItem: MilitaryOrderItem = {
    type,
    size: 'M',
    quantity: 1,
    unitPrice: clothingType.unitPrice,
    totalPrice: clothingType.unitPrice
  }
  form.items.push(newItem)
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function updateQuantity(index: number, delta: number) {
  const item = form.items[index]
  if (!item) return

  const newQty = item.quantity + delta
  if (newQty < 1) {
    ElMessage.warning('数量不能小于1')
    return
  }
  if (newQty > 5) {
    ElMessage.warning('单件商品最多购买5件')
    return
  }

  item.quantity = newQty
  item.totalPrice = item.quantity * item.unitPrice
}

function updateSize(index: number, size: string) {
  const item = form.items[index]
  if (item) {
    item.size = size as MilitaryOrderItem['size']
  }
}

async function handleSubmit() {
  if (form.items.length === 0) {
    ElMessage.warning('请至少选择一件服装')
    return
  }

  try {
    submitting.value = true

    await store.submitMilitaryOrder({
      studentName: '当前用户',
      studentId: '2024001',
      items: form.items,
      totalAmount: finalAmount.value,
      deliveryMethod: form.deliveryMethod,
      paymentMethod: form.paymentMethod
    })

    ElMessage.success('预定成功！')
    resetForm()
    activeTab.value = 'history'
    await store.fetchMilitaryOrders()
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '预定失败')
  } finally {
    submitting.value = false
  }
}

async function handleCancelOrder(id: string) {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '确认取消', {
      confirmButtonText: '确定取消',
      cancelButtonText: '再想想',
      type: 'warning'
    })

    // 调用取消接口（需要添加到store）
    ElMessage.success('订单已取消')
    await store.fetchMilitaryOrders()
  } catch (err: unknown) {
    if (err !== 'cancel') {
      ElMessage.error(err instanceof Error ? err.message : '操作失败')
    }
  }
}

function resetForm() {
  form.items = []
  form.deliveryMethod = 'pickup'
  form.paymentMethod = 'campus_card'
}

onMounted(() => {
  store.fetchMilitaryOrders()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 标签页 -->
    <div class="flex gap-4 border-b border-gray-200">
      <button @click="activeTab = 'order'"
              :class="['px-6 py-3 text-sm font-medium transition-all relative',
                activeTab === 'order' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary']">
        <el-icon><ShoppingCart /></el-icon> 预定服装
      </button>
      <button @click="activeTab = 'history'"
              :class="['px-6 py-3 text-sm font-medium transition-all relative',
                activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary']">
        <el-icon><Document /></el-icon> 预定记录
      </button>
    </div>

    <!-- ========== 预定表单 ========== -->
    <section v-if="activeTab === 'order'" class="space-y-6">
      <!-- 服装选择 -->
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <el-icon :size="20" class="text-primary"><Medal /></el-icon>
          选择军训服装
          <button @click="showSizeChart = !showSizeChart"
                  class="ml-auto text-xs text-primary hover:text-primary-light flex items-center gap-1">
            <el-icon :size="14"><Ruler /></el-icon> 尺码对照表 {{ showSizeChart ? '▲' : '▼' }}
          </button>
        </h2>

        <!-- 尺码对照表 -->
        <div v-if="showSizeChart" class="mb-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-blue-200">
                <th class="py-2 px-3 text-left text-primary font-semibold">尺码</th>
                <th class="py-2 px-3 text-left text-primary font-semibold">身高</th>
                <th class="py-2 px-3 text-left text-primary font-semibold">体重</th>
                <th class="py-2 px-3 text-left text-primary font-semibold">胸围</th>
                <th class="py-2 px-3 text-left text-primary font-semibold">腰围</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chart in sizeChartData" :key="chart.size" class="border-b border-blue-100">
                <td class="py-2 px-3 font-bold text-primary">{{ chart.size }}</td>
                <td class="py-2 px-3">{{ chart.height }}</td>
                <td class="py-2 px-3">{{ chart.weight }}</td>
                <td class="py-2 px-3">{{ chart.chest }}</td>
                <td class="py-2 px-3">{{ chart.waist }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 商品列表 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cloth in clothingTypes" :key="cloth.value"
               class="p-5 rounded-xl border-2 transition-all"
               :class="form.items.some((i: MilitaryOrderItem) => i.type === cloth.value)
                 ? 'border-primary bg-primary/5'
                 : 'border-gray-200 hover:border-primary/30'">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <el-icon :size="22" class="text-primary"><component :is="cloth.icon" /></el-icon>
              </div>
              <span class="text-lg font-bold text-gold">¥{{ cloth.unitPrice }}</span>
            </div>

            <h3 class="font-semibold text-text-primary mb-1">{{ cloth.label }}</h3>
            <p class="text-xs text-text-tertiary mb-4">{{ cloth.description }}</p>

            <div v-if="form.items.some((i: MilitaryOrderItem) => i.type === cloth.value)" class="space-y-3">
              <!-- 已选中的商品 -->
              <div class="pt-3 border-t border-primary/20">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs text-text-secondary">尺码</label>
                  <select :value="findItemByType(cloth.value)?.size"
                          @change="updateSize(findItemIndexByType(cloth.value), ($event.target as HTMLSelectElement).value)"
                          class="text-xs border border-gray-300 rounded px-2 py-1">
                    <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>

                <div class="flex items-center justify-between">
                  <label class="text-xs text-text-secondary">数量</label>
                  <div class="flex items-center gap-2">
                    <button @click="updateQuantity(findItemIndexByType(cloth.value), -1)"
                            class="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                      −
                    </button>
                    <span class="w-8 text-center font-medium text-sm">
                      {{ findItemByType(cloth.value)?.quantity }}
                    </span>
                    <button @click="addItem(cloth.value as MilitaryOrderItem['type'])"
                            class="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors">
                      +
                    </button>
                  </div>
                </div>

                <div class="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span class="text-xs text-text-tertiary">小计</span>
                  <span class="font-bold text-gold">¥{{ findItemByType(cloth.value)?.totalPrice }}</span>
                </div>
              </div>
            </div>

            <button v-else @click="addItem(cloth.value as MilitaryOrderItem['type'])"
                    class="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium hover:shadow-md transition-all">
              <Plus /> 添加
            </button>
          </div>
        </div>
      </div>

      <!-- 已选商品汇总 -->
      <div v-if="form.items.length > 0" class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <ShoppingCart /> 已选商品（{{ form.items.length }}件）
        </h3>

        <div class="space-y-3 mb-4">
          <div v-for="(item, index) in form.items" :key="index"
               class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <el-icon :size="15" class="text-primary"><component :is="clothingTypes.find(c => c.value === item.type)?.icon || UserFilled" /></el-icon>
              </span>
              <div>
                <p class="text-sm font-medium text-text-primary">
                  {{ clothingTypes.find(c => c.value === item.type)?.label }} ({{ item.size }}码)
                </p>
                <p class="text-xs text-text-tertiary">¥{{ item.unitPrice }} × {{ item.quantity }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-gold">¥{{ item.totalPrice }}</span>
              <button @click="removeItem(index)" class="p-1.5 rounded hover:bg-crimson/10 text-crimson transition-colors">
                <Delete />
              </button>
            </div>
          </div>
        </div>

        <!-- 配送方式 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-text-primary mb-3">配送方式</label>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="option in deliveryOptions" :key="option.value"
                 @click="form.deliveryMethod = option.value"
                 :class="['p-4 rounded-xl border-2 cursor-pointer transition-all text-center',
                   form.deliveryMethod === option.value
                     ? 'border-primary bg-primary/5'
                     : 'border-gray-200 hover:border-primary/30']">
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <el-icon :size="22" class="text-text-secondary"><component :is="option.icon" /></el-icon>
              </div>
              <p class="text-sm font-medium text-text-primary mt-2">{{ option.label }}</p>
              <p class="text-xs text-text-tertiary">{{ option.desc }}</p>
              <p v-if="option.fee > 0" class="text-xs text-gold mt-1">配送费 ¥{{ option.fee }}</p>
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-text-primary mb-3">支付方式</label>
          <div class="flex gap-3">
            <div v-for="method in paymentMethods" :key="method.value"
                 @click="form.paymentMethod = method.value"
                 :class="['flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center',
                   form.paymentMethod === method.value
                     ? 'border-primary bg-primary/5'
                     : 'border-gray-200 hover:border-primary/30']">
              <span class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto" :style="{ backgroundColor: method.color }">{{ method.short }}</span>
              <p class="text-xs font-medium text-text-primary mt-1" :class="method.color">{{ method.label }}</p>
            </div>
          </div>
        </div>

        <!-- 价格汇总 -->
        <div class="p-4 rounded-xl bg-gold/5 border border-gold/20 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary">商品总价</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-secondary">配送费</span>
            <span>{{ deliveryFee > 0 ? `¥${deliveryFee}` : '免费' }}</span>
          </div>
          <div class="border-t border-gold/30 pt-2 flex justify-between">
            <span class="font-semibold text-text-primary">应付总额</span>
            <span class="text-xl font-bold text-gold">¥{{ finalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button @click="handleSubmit"
                :disabled="submitting"
                class="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-white text-base font-bold shadow-gold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
          <Check v-if="!submitting" />
          <Loading v-if="submitting" class="animate-spin" />
          {{ submitting ? '处理中...' : `确认预定并支付 ¥${finalAmount.toFixed(2)}` }}
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
          <el-icon :size="36" class="text-primary/40"><ShoppingCart /></el-icon>
        </div>
        <p class="text-text-tertiary text-base font-medium mb-2">暂未选择任何商品</p>
        <p class="text-text-quaternary text-sm">请在上方选择需要的军训服装</p>
      </div>
    </section>

    <!-- ========== 历史记录 ========== -->
    <section v-if="activeTab === 'history'" class="space-y-4">
      <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
        <el-icon :size="20" class="text-primary"><Medal /></el-icon>
        预定历史记录
      </h2>

      <div v-if="store.militaryOrders.length > 0" class="space-y-4">
        <div v-for="order in store.militaryOrders" :key="order.id"
             class="bg-white/90 backdrop-blur-md rounded-xl border border-primary-50/50 p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border', statusMap[order.status]?.color]">
                {{ statusMap[order.status]?.label }}
              </span>
              <div>
                <p class="text-sm font-semibold text-text-primary">订单号：{{ order.id.slice(-8) }}</p>
                <p class="text-xs text-text-quaternary">{{ order.orderDate }}</p>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex flex-wrap gap-2">
              <span v-for="item in order.items" :key="item.type"
                    class="px-2 py-1 rounded bg-gray-100 text-xs text-text-secondary">
                {{ clothingTypes.find(c => c.value === item.type)?.label }} ×{{ item.quantity }} ({{ item.size }})
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="text-sm">
              <span class="text-text-tertiary">总计：</span>
              <span class="font-bold text-gold">¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div v-if="order.status === 'ordered'" class="flex gap-2">
              <button @click="handleCancelOrder(order.id)"
                      class="px-4 py-1.5 rounded-lg text-xs text-crimson border border-crimson/30 hover:bg-crimson/5 transition-colors">
                取消订单
              </button>
            </div>
            <div v-if="order.verificationCode && order.status === 'ready'" class="flex items-center gap-2">
              <span class="text-xs text-text-tertiary">取货码：</span>
              <span class="px-3 py-1 rounded-lg bg-primary text-white font-mono font-bold tracking-widest">
                {{ order.verificationCode }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/50 flex items-center justify-center">
          <el-icon :size="24" class="text-primary/40"><Medal /></el-icon>
        </div>
        <p class="text-text-tertiary text-base font-medium mb-2">暂无预定记录</p>
        <p class="text-text-quaternary text-sm">完成预定后，记录将显示在此处</p>
      </div>
    </section>
  </div>
</template>
