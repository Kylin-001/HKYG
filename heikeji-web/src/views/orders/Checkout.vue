<template>
  <div class="checkout-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <router-link to="/cart" class="back-link"><el-icon><ArrowLeft /></el-icon> 返回购物车</router-link>
        <h1 class="page-title">确认订单</h1>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="checkout-layout">
        <main class="checkout-main">
          <!-- 地址选择区域 -->
          <section class="address-section glass-effect rounded-2xl p-6 mb-6">
            <h3 class="section-title">
              <el-icon><Location /></el-icon>
              收货地址
              <el-button type="primary" text size="small" @click="showAddressModal = true">
                {{ addresses.length > 0 ? '更换地址' : '添加新地址' }}
              </el-button>
            </h3>

            <!-- 已选地址展示 -->
            <div v-if="selectedAddress" class="selected-address-card" @click="showAddressModal = true">
              <div class="address-info">
                <div class="address-header">
                  <span class="receiver-name">{{ selectedAddress.name }}</span>
                  <span class="receiver-phone">{{ selectedAddress.phone }}</span>
                  <el-tag v-if="selectedAddress.isDefault" size="small" type="primary" effect="dark" class="default-tag">默认</el-tag>
                </div>
                <p class="address-detail">{{ selectedAddress.fullAddress }}</p>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>

            <!-- 无地址提示 -->
            <div v-else class="no-address-card" @click="showAddressModal = true">
              <el-icon :size="24"><Plus /></el-icon>
              <span>点击添加收货地址</span>
            </div>

            <!-- 地址列表快捷选择 -->
            <div v-if="addresses.length > 1" class="address-quick-list">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                class="address-item"
                :class="{ active: selectedAddress?.id === addr.id }"
                @click="selectAddress(addr)"
              >
                <el-icon v-if="selectedAddress?.id === addr.id" color="#003B80"><CircleCheckFilled /></el-icon>
                <span class="addr-text">{{ addr.name }} {{ addr.phone }}</span>
                <el-tag v-if="addr.isDefault && selectedAddress?.id !== addr.id" size="small" type="info">默认</el-tag>
              </div>
            </div>
          </section>

          <!-- 商品清单 -->
          <section class="goods-section glass-effect rounded-2xl p-6 mb-6">
            <h3 class="section-title">
              <el-icon><ShoppingCart /></el-icon>
              商品清单
              <span class="goods-count">{{ cartItems.length }} 件商品</span>
            </h3>
            <div class="goods-list">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="good-item"
              >
                <img :src="item.image" :alt="item.name" class="good-img" />
                <div class="good-info">
                  <h4 class="good-name">{{ item.name }}</h4>
                  <p class="good-specs">{{ item.specs }}</p>
                  <div class="good-bottom">
                    <span class="good-price">¥{{ item.price.toFixed(2) }}</span>
                    <span class="good-qty">x{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 优惠券选择 -->
          <section class="coupon-section glass-effect rounded-2xl p-6 mb-6">
            <h3 class="section-title">
              <el-icon><Ticket /></el-icon>
              优惠券
              <el-tag v-if="availableCoupons.length > 0" size="small" type="danger" effect="dark" round class="coupon-count">
                {{ availableCoupons.length }}张可用
              </el-tag>
            </h3>

            <div class="coupon-selector">
              <!-- 不使用优惠券选项 -->
              <div
                class="coupon-option"
                :class="{ active: !selectedCoupon }"
                @click="selectCoupon(null)"
              >
                <el-icon v-if="!selectedCoupon" color="#003B80"><CircleCheckFilled /></el-icon>
                <el-icon v-else><Aim /></el-icon>
                <span>不使用优惠券</span>
              </div>

              <!-- 可用优惠券列表 -->
              <div
                v-for="coupon in availableCoupons"
                :key="coupon.id"
                class="coupon-option coupon-card"
                :class="{ active: selectedCoupon?.id === coupon.id }"
                @click="selectCoupon(coupon)"
              >
                <div class="coupon-left">
                  <div class="coupon-value">
                    <template v-if="coupon.type === 'cash'">
                      <span class="currency">¥</span>
                      <span class="amount">{{ coupon.value }}</span>
                    </template>
                    <template v-else-if="coupon.type === 'discount'">
                      <span class="amount">{{ coupon.value }}</span>
                      <span class="unit">折</span>
                    </template>
                    <template v-else>
                      <span class="amount">{{ coupon.value }}</span>
                    </template>
                  </div>
                  <div class="coupon-condition">
                    {{ coupon.minOrder > 0 ? `满${coupon.minOrder}可用` : '无门槛' }}
                  </div>
                </div>
                <div class="coupon-right">
                  <div class="coupon-name">{{ coupon.name || coupon.desc }}</div>
                  <div class="coupon-desc">{{ coupon.desc || '全场通用' }}</div>
                  <div class="coupon-validity">有效期至 {{ formatDate(coupon.validTo) }}</div>
                </div>
                <el-icon v-if="selectedCoupon?.id === coupon.id" class="check-icon" color="#003B80"><CircleCheckFilled /></el-icon>
              </div>

              <!-- 无可用优惠券提示 -->
              <div v-if="availableCoupons.length === 0" class="no-coupon-tip">
                <el-icon :size="32" color="#d9d9d9"><Ticket /></el-icon>
                <p>暂无可用优惠券</p>
                <el-button type="primary" text size="small" @click="$router.push('/user/coupons')">
                  去领取优惠券 →
                </el-button>
              </div>
            </div>

            <!-- 已选优惠券信息 -->
            <div v-if="selectedCoupon" class="selected-coupon-info">
              <el-icon color="#003B80"><SuccessFilled /></el-icon>
              <span>已选优惠：{{ getCouponDiscountText(selectedCoupon) }}</span>
              <el-button type="danger" text size="small" @click="selectCoupon(null)">取消使用</el-button>
            </div>
          </section>

          <!-- 积分抵扣 -->
          <section class="points-section glass-effect rounded-2xl p-6 mb-6">
            <h3 class="section-title">
              <el-icon><Coin /></el-icon>
              积分抵扣
              <el-tag size="small" type="warning" effect="dark" round class="points-tag">
                可用 {{ availablePoints }} 积分
              </el-tag>
            </h3>

            <div class="points-content">
              <div class="points-info-card">
                <label class="points-checkbox">
                  <el-checkbox v-model="usePoints" :disabled="availablePoints === 0">
                    使用积分抵扣
                  </el-checkbox>
                </label>

                <div v-if="usePoints" class="points-details">
                  <div class="points-row">
                    <span class="points-label">可用积分</span>
                    <span class="points-value">{{ availablePoints.toLocaleString() }} 分</span>
                  </div>
                  <div class="points-row">
                    <span class="points-label">可抵扣金额（最多30%）</span>
                    <span class="points-value highlight">¥{{ maxPointsDiscount.toFixed(2) }}</span>
                  </div>
                  <div class="points-row">
                    <span class="points-label">本次使用积分</span>
                    <div class="points-input-wrapper">
                      <el-input-number
                        v-model="pointsToUse"
                        :min="0"
                        :max="maxUsablePoints"
                        :step="100"
                        size="small"
                        controls-position="right"
                        class="points-input"
                      />
                      <span class="points-unit">积分 (≈¥{{ (pointsToUse / 100).toFixed(2) }})</span>
                    </div>
                  </div>
                  <div class="points-tip">
                    <el-icon :size="14" class="text-orange-500"><InfoFilled /></el-icon>
                    <span>100 积分 = 1 元，最多可抵扣订单金额的 30%</span>
                  </div>
                </div>
              </div>

              <!-- 已选积分信息 -->
              <div v-if="usePoints && pointsToUse > 0" class="selected-points-info">
                <el-icon color="#F59E0B"><SuccessFilled /></el-icon>
                <span>已选积分抵扣：-¥{{ pointsDiscount.toFixed(2) }}（使用 {{ pointsToUse }} 积分）</span>
                <el-button type="danger" text size="small" @click="usePoints = false; pointsToUse = 0">取消使用</el-button>
              </div>
            </div>
          </section>

          <!-- 订单备注 -->
          <section class="remark-section glass-effect rounded-2xl p-6 mb-6">
            <h3 class="section-title">
              <el-icon><EditPen /></el-icon>
              订单备注
            </h3>
            <el-input
              v-model="orderRemark"
              type="textarea"
              placeholder="选填：给商家的留言（如：需要发票、包装要求等）"
              :rows="3"
              maxlength="200"
              show-word-limit
              resize="vertical"
            />
          </section>

          <!-- 支付方式选择 -->
          <section class="pay-method-section glass-effect rounded-2xl p-6">
            <h3 class="section-title">
              <el-icon><CreditCard /></el-icon>
              支付方式
            </h3>
            <el-radio-group v-model="selectedPayMethod" class="pay-method-group">
              <div
                v-for="method in payMethods"
                :key="method.value"
                class="pay-option-card"
                :class="{ active: selectedPayMethod === method.value }"
              >
                <el-radio :value="method.value" :label="method.value" size="large">
                  <div class="pay-option-content">
                    <span class="pay-icon">{{ method.icon }}</span>
                    <span class="pay-name">{{ method.name }}</span>
                    <el-tag v-if="method.discount" size="small" type="warning" effect="light" class="discount-tag">
                      {{ method.discount }}
                    </el-tag>
                  </div>
                </el-radio>
              </div>
            </el-radio-group>
          </section>
        </main>

        <!-- 订单摘要侧边栏 -->
        <aside class="checkout-sidebar">
          <div class="summary-card glass-effect rounded-2xl p-6 sticky top-24">
            <h3 class="summary-title">订单摘要</h3>
            <div class="summary-list">
              <div class="sum-row">
                <span class="sum-label">商品金额</span>
                <span class="sum-value">¥{{ goodsTotal.toFixed(2) }}</span>
              </div>
              <div class="sum-row discount-row">
                <span class="sum-label">
                  优惠减免
                  <el-tooltip v-if="selectedCoupon" :content="`已使用：${getCouponDiscountText(selectedCoupon)}`" placement="top">
                    <el-icon class="info-icon"><InfoFilled /></el-icon>
                  </el-tooltip>
                </span>
                <span class="sum-value discount-value">-¥{{ couponDiscount.toFixed(2) }}</span>
              </div>
              <div class="sum-row">
                <span class="sum-label">
                  运费
                  <el-tooltip v-if="shippingFee > 0" content="满99元免运费" placement="top">
                    <el-icon class="info-icon"><InfoFilled /></el-icon>
                  </el-tooltip>
                </span>
                <span class="sum-value" :class="{ free: shippingFee === 0 }">
                  {{ shippingFee > 0 ? `¥${shippingFee.toFixed(2)}` : '免运费' }}
                </span>
              </div>
            </div>

            <!-- 优惠明细 -->
            <div v-if="selectedCoupon" class="coupon-breakdown">
              <div class="breakdown-item">
                <el-icon color="#003B80"><Ticket /></el-icon>
                <span>{{ selectedCoupon.name || selectedCoupon.desc }}</span>
                <span class="breakdown-value">-¥{{ couponDiscount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 积分抵扣明细 -->
            <div v-if="usePoints && pointsToUse > 0" class="points-breakdown">
              <div class="breakdown-item">
                <el-icon color="#F59E0B"><Coin /></el-icon>
                <span>积分抵扣（{{ pointsToUse }} 积分）</span>
                <span class="breakdown-value">-¥{{ pointsDiscount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="sum-total">
              <span class="total-label">应付总额</span>
              <strong class="total-value">¥{{ finalTotal.toFixed(2) }}</strong>
            </div>

            <!-- 价格明细展开 -->
            <el-collapse v-model="priceDetailExpanded" class="price-collapse">
              <el-collapse-item name="detail">
                <template #title>
                  <span class="collapse-title">价格明细</span>
                </template>
                <div class="detail-list">
                  <div class="detail-row">
                    <span>商品小计</span>
                    <span>¥{{ goodsTotal.toFixed(2) }}</span>
                  </div>
                  <div v-if="couponDiscount > 0" class="detail-row highlight">
                    <span>优惠券抵扣</span>
                    <span>-¥{{ couponDiscount.toFixed(2) }}</span>
                  </div>
                  <div class="detail-row">
                    <span>运费</span>
                    <span>{{ shippingFee > 0 ? `+¥${shippingFee.toFixed(2)}` : '+¥0.00 (免运费)' }}</span>
                  </div>
                  <div class="detail-row total">
                    <span>合计</span>
                    <strong>¥{{ finalTotal.toFixed(2) }}</strong>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>

            <div class="submit-area">
              <el-checkbox v-model="agreedTerms" class="agree-checkbox">
                我已阅读并同意<a href="#" class="agreement-link" @click.prevent>《用户购买协议》</a>
              </el-checkbox>
              <el-button
                type="primary"
                size="large"
                class="submit-btn"
                :disabled="!canSubmit || submitting"
                :loading="submitting"
                @click="handleSubmit"
              >
                {{ submitting ? '提交中...' : `提交订单 ¥${finalTotal.toFixed(2)}` }}
              </el-button>
              <p v-if="!selectedAddress" class="submit-warning">
                <el-icon><WarningFilled /></el-icon>
                请先选择收货地址
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- 地址选择弹窗 -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showAddressModal" class="modal-overlay" @click.self="showAddressModal = false">
          <div class="address-modal glass-effect rounded-2xl overflow-hidden">
            <div class="modal-head">
              <h3>选择收货地址</h3>
              <el-button :icon="Close" circle size="small" @click="showAddressModal = false" />
            </div>
            <div class="modal-body-p">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                class="addr-card-item"
                :class="{ active: selectedAddress?.id === addr.id, default: addr.isDefault }"
                @click="selectAddress(addr); showAddressModal = false"
              >
                <div class="addr-check">
                  <el-icon v-if="selectedAddress?.id === addr.id" color="#003B80"><CircleCheckFilled /></el-icon>
                  <el-icon v-else><Aim /></el-icon>
                </div>
                <div class="addr-content">
                  <p class="aci-name">
                    <strong>{{ addr.name }}</strong>
                    <span class="aci-phone">{{ addr.phone }}</span>
                    <el-tag v-if="addr.isDefault" size="small" type="primary" effect="dark">默认</el-tag>
                  </p>
                  <p class="aci-addr">{{ addr.fullAddress }}</p>
                </div>
              </div>
              <button class="add-new-addr-btn" @click="handleAddNewAddress">
                <el-icon><Plus /></el-icon>
                添加新地址
              </button>
              <div v-if="addresses.length === 0" class="empty-address-tip">
                <el-icon :size="48" color="#d9d9d9"><Location /></el-icon>
                <p>暂无收货地址</p>
                <p class="tip-sub">请添加收货地址以便我们为您配送商品</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Location, ShoppingCart, EditPen, CreditCard, ArrowLeft, Plus,
  Close, ArrowRight, CircleCheckFilled, Aim, Ticket,
  SuccessFilled, InfoFilled, WarningFilled, Coin
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useCommunityStore } from '@/stores/community'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const communityStore = useCommunityStore()

// ==================== 接口定义 ====================
interface CartItem {
  id: number | string
  name: string
  image: string
  specs: string
  price: number
  quantity: number
}

interface Address {
  id: number | string
  name: string
  phone: string
  city: string
  detail: string
  fullAddress: string
  isDefault: boolean
}

interface Coupon {
  id: string | number
  name?: string
  desc?: string
  type: 'cash' | 'discount' | 'free_shipping'
  value: number
  minOrder: number
  status: string
  validFrom?: string
  validTo?: string
  expireDate?: string
}

// ==================== 响应式状态 ====================
const showAddressModal = ref(false)
const orderRemark = ref('')
const selectedPayMethod = ref<string>('wechat')
const agreedTerms = ref(true)
const submitting = ref(false)
const priceDetailExpanded = ref<string[]>([])
const selectedAddress = ref<Address | null>(null)
const selectedCoupon = ref<Coupon | null>(null)

// 积分抵扣相关
const usePoints = ref(false)
const pointsToUse = ref(0)
const availablePoints = ref(2580) // 可用积分余额（可从用户信息获取）

// ==================== 购物车商品数据 ====================
const cartItems = computed<CartItem[]>(() => {
  return cartStore.items
    .filter(item => item.selected !== false)
    .map(item => ({
      id: item.id,
      name: item.name || item.productName || '',
      image: item.image || item.productImage || '',
      specs: item.spec || item.skuName || '',
      price: item.price,
      quantity: item.quantity
    }))
})

// ==================== 地址数据 ====================
const addresses = computed<Address[]>(() => {
  return orderStore.addresses.map(addr => ({
    id: addr.id,
    name: addr.recipientName || addr.receiverName || addr.name || '',
    phone: addr.phone || '',
    city: addr.city || addr.province + addr.city || '',
    detail: addr.detailAddress || addr.detail || addr.address || '',
    fullAddress: addr.fullAddress || addr.address || (addr.province + addr.city + addr.district + (addr.detailAddress || addr.detail || '')),
    isDefault: addr.isDefault ?? false
  }))
})

// 初始化默认选中地址
function initDefaultAddress() {
  if (addresses.value.length > 0) {
    const defaultAddr = addresses.value.find(a => a.isDefault) || addresses.value[0]
    selectedAddress.value = defaultAddr
  }
}

// 选择地址
function selectAddress(addr: Address) {
  selectedAddress.value = addr
}

// ==================== 优惠券数据 ====================
const availableCoupons = computed<Coupon[]>(() => {
  const allCoupons = communityStore.coupons || []
  return allCoupons
    .filter((c: any) => c.status === 'available')
    .map((c: any): Coupon => ({
      id: c.id,
      name: c.name,
      desc: c.desc || c.description,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder ?? 0,
      status: c.status,
      validFrom: c.validFrom,
      validTo: c.validTo,
      expireDate: c.expireDate || c.validTo
    }))
    .filter(coupon => {
      // 过滤出满足使用条件的优惠券（商品金额 >= 最低消费）
      return goodsTotal.value >= coupon.minOrder
    })
})

// 选择/取消优惠券
function selectCoupon(coupon: Coupon | null) {
  if (coupon === null) {
    selectedCoupon.value = null
    ElMessage.info('已取消使用优惠券')
  } else {
    // 验证是否满足使用条件
    if (goodsTotal.value < coupon.minOrder) {
      ElMessage.warning(`该优惠券需满${coupon.minOrder}元可用`)
      return
    }
    selectedCoupon.value = coupon
    const discountText = getCouponDiscountText(coupon)
    ElMessage.success(`已选择优惠券：${discountText}`)
  }
}

// 获取优惠券折扣文本
function getCouponDiscountText(coupon: Coupon): string {
  if (coupon.type === 'cash') {
    return `¥${coupon.value}满减券`
  } else if (coupon.type === 'discount') {
    return `${coupon.value}折折扣券`
  } else if (coupon.type === 'free_shipping') {
    return '免运费券'
  }
  return `${coupon.value}元优惠券`
}

// 格式化日期
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch {
    return dateStr
  }
}

// ==================== 支付方式配置 ====================
const payMethods = [
  { value: 'wechat', icon: '\u{1F49A}', name: '微信支付', discount: '' },
  { value: 'alipay', icon: '\u{1F499}', name: '支付宝', discount: '' },
  { value: 'campus_card', icon: '\u{1F3AB}', name: '校园卡支付', discount: '满50减3' },
  { value: 'balance', icon: '\u{1F6B0}', name: '余额支付', discount: '' }
]

// ==================== 金额计算 ====================
// 商品总金额
const goodsTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 优惠券折扣金额
const couponDiscount = computed(() => {
  if (!selectedCoupon.value) return 0

  const coupon = selectedCoupon.value
  if (coupon.type === 'cash') {
    // 满减券：直接返回面值
    return Math.min(coupon.value, goodsTotal.value)
  } else if (coupon.type === 'discount') {
    // 折扣券：计算折扣金额
    return Math.round(goodsTotal.value * (1 - coupon.value / 10) * 100) / 100
  } else if (coupon.type === 'free_shipping') {
    // 免运费券：返回当前运费金额
    return shippingFee.value
  }

  return 0
})

// 积分相关计算
const maxPointsDiscount = computed(() => {
  // 最多可抵扣订单金额的30%（商品总额 - 优惠券）
  const baseAmount = goodsTotal.value - couponDiscount.value
  return Math.round(baseAmount * 0.3 * 100) / 100
})

const maxUsablePoints = computed(() => {
  // 可用积分和最大可抵扣积分取最小值
  const maxByAmount = maxPointsDiscount.value * 100 // 转换为积分
  return Math.min(availablePoints.value, Math.floor(maxByAmount))
})

const pointsDiscount = computed(() => {
  if (!usePoints.value || pointsToUse.value <= 0) return 0
  // 积分抵扣金额（100积分=1元）
  return Math.min(pointsToUse.value / 100, maxPointsDiscount.value)
})

// 运费计算（满99免运费）
const FREE_SHIPPING_THRESHOLD = 99
const SHIPPING_FEE = 10
const shippingFee = computed(() => {
  // 如果使用了免运费券，则运费为0
  if (selectedCoupon.value?.type === 'free_shipping') {
    return 0
  }
  return goodsTotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
})

// 最终应付金额
const finalTotal = computed(() => {
  const total = goodsTotal.value - couponDiscount.value - pointsDiscount.value + shippingFee.value
  return Math.max(0, Math.round(total * 100) / 100) // 确保精度为两位小数且不为负数
})

// 是否可以提交订单
const canSubmit = computed(() => {
  return !!selectedAddress.value && agreedTerms.value && cartItems.value.length > 0
})

// ==================== 操作方法 ====================
// 添加新地址
function handleAddNewAddress() {
  showAddressModal.value = false
  ElMessage.info('请前往个人中心添加收货地址')
  router.push('/user/address')
}

// 提交订单
async function handleSubmit() {
  // 表单验证
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  if (!agreedTerms.value) {
    ElMessage.warning('请先阅读并同意购买协议')
    return
  }
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空，无法提交订单')
    return
  }

  submitting.value = true

  try {
    // 构建订单数据
    const orderData = await orderStore.createOrder({
      addressId: String(selectedAddress.value.id),
      items: cartItems.value.map(item => ({
        productId: String(item.id),
        quantity: item.quantity
      })),
      remark: orderRemark.value,
      payMethod: selectedPayMethod.value,
      couponId: selectedCoupon.value ? String(selectedCoupon.value.id) : undefined
    })

    if (orderData?.id || orderData?.orderNo) {
      const orderId = orderData.id || orderData.orderNo
      ElMessage.success('订单提交成功！正在跳转到支付页面...')

      // 跳转到支付页面
      setTimeout(() => {
        router.push(`/orders/payment/${orderId}`)
      }, 500)
    } else {
      ElMessage.success('订单提交成功')
      router.push('/orders/checkout/success')
    }
  } catch (err: any) {
    console.error('订单提交失败:', err)
    ElMessage.error(err.message || '订单提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  try {
    // 并行加载所有必要数据
    await Promise.all([
      cartStore.fetchCart(),
      orderStore.fetchAddresses(),
      communityStore.fetchCoupons('available') // 只加载可用优惠券
    ])

    // 初始化默认地址
    initDefaultAddress()

    // 如果有可用的最优优惠券，自动选中（可选）
    if (availableCoupons.value.length > 0) {
      // 默认不自动选择，让用户手动选择
      // 可以根据业务需求调整此逻辑
    }
  } catch (err: any) {
    console.error('加载数据失败:', err)
    ElMessage.error(err.message || '加载数据失败，请刷新页面重试')
  }
})
</script>

<style scoped>
/* ==================== 页面布局 ==================== */
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6efff 100%);
}

.page-header {
  background: linear-gradient(135deg, #003B80 0%, #0052b4 100%);
  padding: 1.25rem 0;
  color: white;
  box-shadow: 0 2px 12px rgba(0, 59, 128, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover { color: white; }

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 59, 128, 0.08);
  box-shadow: 0 4px 20px rgba(0, 59, 128, 0.06);
  backdrop-filter: blur(10px);
}

/* ==================== 区域标题 ==================== */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f5ff;
}

/* ==================== 地址选择区域 ==================== */
.selected-address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(0, 59, 128, 0.03) 0%, rgba(0, 82, 180, 0.03) 100%);
  border-radius: 12px;
  border: 1.5px solid rgba(0, 59, 128, 0.12);
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-address-card:hover {
  border-color: #003B80;
  box-shadow: 0 4px 16px rgba(0, 59, 128, 0.1);
  transform: translateY(-1px);
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
}

.receiver-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.receiver-phone {
  font-size: 0.9375rem;
  color: #6b7280;
}

.default-tag {
  margin-left: auto;
}

.address-detail {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.arrow-icon {
  color: #9ca3af;
  font-size: 1.125rem;
}

.no-address-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.no-address-card:hover {
  border-color: #003B80;
  color: #003B80;
  background: rgba(0, 59, 128, 0.02);
}

.address-quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e5e7eb;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  color: #6b7280;
}

.address-item:hover {
  border-color: #003B80;
  color: #003B80;
}

.address-item.active {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.04);
  color: #003B80;
}

.addr-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==================== 商品清单 ==================== */
.goods-count {
  margin-left: auto;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #9ca3af;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.good-item {
  display: flex;
  gap: 1rem;
  padding: 0.875rem;
  background: #fafbff;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.good-item:hover {
  background: #f0f5ff;
  border-color: rgba(0, 59, 128, 0.08);
}

.good-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.good-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.good-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.good-specs {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.good-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.good-price {
  font-size: 1rem;
  font-weight: 800;
  color: #ef4444;
}

.good-qty {
  font-size: 0.8125rem;
  color: #9ca3af;
}

/* ==================== 优惠券选择区域 ==================== */
.coupon-count {
  margin-left: 0.5rem;
}

/* ==================== 积分抵扣区域 ==================== */
.points-tag {
  margin-left: 0.5rem;
}

.points-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.points-info-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1.5px solid #fcd34d;
  border-radius: 12px;
  padding: 1.25rem;
}

.points-checkbox {
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1f2937;
  cursor: pointer;
  margin-bottom: 0;
}

.points-details {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.points-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.points-label {
  color: #6b7280;
}

.points-value {
  color: #374151;
  font-weight: 500;
}

.points-value.highlight {
  color: #F59E0B;
  font-weight: 700;
  font-size: 1rem;
}

.points-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.points-input {
  width: 160px !important;
}

.points-input :deep(.el-input__inner) {
  text-align: center;
  font-weight: 600;
  color: #F59E0B;
  border-color: #fcd34d;
}

.points-input :deep(.el-input__inner:focus) {
  border-color: #F59E0B;
}

.points-unit {
  color: #92400e;
  font-size: 0.8125rem;
  font-weight: 500;
}

.points-tip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 0.875rem;
  background: rgba(245, 158, 11, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #92400e;
  line-height: 1.4;
}

.selected-points-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(245, 158, 11, 0.04);
  border: 1.5px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  color: #92400e;
  font-weight: 500;
}

/* 积分明细 */
.points-breakdown {
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.coupon-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coupon-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.coupon-option:hover {
  border-color: #003B80;
  box-shadow: 0 2px 8px rgba(0, 59, 128, 0.08);
}

.coupon-option.active {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.03);
  border-width: 2px;
}

.coupon-card {
  position: relative;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #fff9f0 0%, #fff 100%);
  border-color: #ffe4c4;
}

.coupon-card:hover {
  border-color: #ff9800;
  background: linear-gradient(135deg, #fff5eb 0%, #fff 100%);
}

.coupon-card.active {
  border-color: #003B80;
  background: linear-gradient(135deg, rgba(0, 59, 128, 0.03) 0%, #fff 100%);
}

.coupon-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4500 100%);
  color: white;
  border-radius: 10px;
  min-width: 100px;
}

.coupon-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.coupon-value .currency {
  font-size: 0.875rem;
  font-weight: 600;
}

.coupon-value .amount {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
}

.coupon-value .unit {
  font-size: 0.875rem;
  font-weight: 600;
}

.coupon-condition {
  font-size: 0.6875rem;
  opacity: 0.95;
  margin-top: 0.25rem;
}

.coupon-right {
  flex: 1;
  min-width: 0;
}

.coupon-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.coupon-desc {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 0.375rem;
}

.coupon-validity {
  font-size: 0.6875rem;
  color: #d97706;
}

.check-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.no-coupon-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #9ca3af;
  text-align: center;
}

.no-coupon-tip p {
  margin: 0;
  font-size: 0.9375rem;
}

.selected-coupon-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(0, 59, 128, 0.04);
  border-radius: 8px;
  font-size: 0.875rem;
  color: #003B80;
}

/* ==================== 订单备注 ==================== */
.remark-textarea :deep(.el-textarea__inner) {
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  transition: all 0.2s ease;
}

.remark-textarea :deep(.el-textarea__inner:focus) {
  border-color: #003B80;
  box-shadow: 0 0 0 3px rgba(0, 59, 128, 0.06);
}

/* ==================== 支付方式选择 ==================== */
.pay-method-group {
  width: 100%;
  display: block;
}

.pay-option-card {
  margin-bottom: 0.75rem;
  padding: 0.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: white;
}

.pay-option-card:last-child {
  margin-bottom: 0;
}

.pay-option-card:hover {
  border-color: #003B80;
  box-shadow: 0 2px 8px rgba(0, 59, 128, 0.06);
}

.pay-option-card.active {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.02);
  border-width: 2px;
}

.pay-option-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pay-icon {
  font-size: 1.375rem;
}

.pay-name {
  flex: 1;
  font-weight: 500;
  color: #374151;
  font-size: 0.9375rem;
}

.discount-tag {
  font-size: 0.6875rem;
}

/* ==================== 订单摘要侧边栏 ==================== */
.summary-card {
  border: 1px solid rgba(0, 59, 128, 0.08);
}

.summary-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid #f0f5ff;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #e5e7eb;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.sum-label {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.info-icon {
  font-size: 0.875rem;
  color: #9ca3af;
  cursor: help;
}

.sum-value {
  color: #374151;
  font-weight: 500;
}

.sum-value.free {
  color: #16a34a;
  font-weight: 600;
}

.discount-row .sum-value.discount-value {
  color: #16a34a;
  font-weight: 600;
}

/* 优惠明细 */
.coupon-breakdown {
  background: rgba(22, 163, 74, 0.04);
  border: 1px solid rgba(22, 163, 74, 0.15);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #16a34a;
}

.breakdown-value {
  margin-left: auto;
  font-weight: 600;
}

/* 总计金额 */
.sum-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.25rem;
  padding: 1rem 0;
  border-top: 2px solid #f0f5ff;
}

.total-label {
  font-size: 0.9375rem;
  color: #6b7280;
  font-weight: 500;
}

.total-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ef4444;
}

/* 价格明细折叠 */
.price-collapse {
  margin-bottom: 1rem;
}

.price-collapse :deep(.el-collapse-item__header) {
  height: auto;
  min-height: 32px;
  font-size: 0.8125rem;
  color: #003B80;
  border-bottom: none;
  padding: 0;
}

.collapse-title {
  cursor: pointer;
}

.detail-list {
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #6b7280;
}

.detail-row.highlight {
  color: #16a34a;
}

.detail-row.total {
  font-size: 0.9375rem;
  color: #1f2937;
  font-weight: 600;
  padding-top: 0.5rem;
  border-top: 1px dashed #e5e7eb;
  margin-top: 0.25rem;
}

/* 提交区域 */
.submit-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agree-checkbox {
  font-size: 0.8125rem;
  color: #6b7280;
}

.agree-checkbox :deep(.el-checkbox__label) {
  color: inherit;
}

.agreement-link {
  color: #003B80;
  text-decoration: none;
  font-weight: 500;
}

.agreement-link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1.0625rem;
  font-weight: 700;
  border-radius: 14px;
  background: linear-gradient(135deg, #003B80 0%, #0052b4 100%);
  border: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 59, 128, 0.2);
}

.submit-btn:hover:not(:disabled):not(.is-loading) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 59, 128, 0.3);
  background: linear-gradient(135deg, #004a9e 0%, #0062cc 100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #f59e0b;
  margin: -0.5rem 0 0;
}

/* ==================== 弹窗样式 ==================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.address-modal {
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  animation: modalIn 0.3s ease;
  background: white;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.modal-head h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-body-p {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.addr-card-item {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  text-align: left;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.addr-card-item:hover {
  border-color: #003B80;
  box-shadow: 0 2px 12px rgba(0, 59, 128, 0.08);
}

.addr-card-item.active {
  border-color: #003B80;
  background: rgba(0, 59, 128, 0.03);
  border-width: 2px;
}

.addr-check {
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
  color: #9ca3af;
}

.addr-check .is-active {
  color: #003B80;
}

.addr-content {
  flex: 1;
  min-width: 0;
}

.aci-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #1f2937;
  margin-bottom: 0.375rem;
  flex-wrap: wrap;
}

.aci-phone {
  color: #6b7280;
  font-weight: normal;
}

.aci-addr {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
}

.add-new-addr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #003B80;
  border-radius: 12px;
  background: transparent;
  color: #003B80;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-new-addr-btn:hover {
  background: rgba(0, 59, 128, 0.04);
  border-style: solid;
  box-shadow: 0 2px 8px rgba(0, 59, 128, 0.1);
}

.empty-address-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: #9ca3af;
}

.empty-address-tip p {
  margin: 0;
}

.tip-sub {
  font-size: 0.8125rem !important;
  color: #d1d5db !important;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active {
  transition: opacity 0.3s ease;
}

.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-sidebar {
    order: -1; /* 移动端时摘要栏在上方 */
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem 0;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .checkout-layout {
    gap: 1rem;
  }

  .glass-effect {
    padding: 1.25rem !important;
  }

  .pay-options {
    grid-template-columns: 1fr;
  }

  .good-img {
    width: 64px;
    height: 64px;
  }

  .coupon-card {
    grid-template-columns: 90px 1fr;
    gap: 0.75rem;
  }

  .coupon-card .check-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .address-modal {
    max-height: 90vh;
    border-radius: 16px;
  }

  .total-value {
    font-size: 1.5rem;
  }

  .submit-btn {
    height: 44px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .section-title {
    font-size: 0.9375rem;
  }

  .address-quick-list {
    flex-direction: column;
  }

  .address-item {
    width: 100%;
  }
}
</style>
