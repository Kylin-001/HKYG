<template>
  <div class="checkout-page">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="goBack" class="back-btn"></el-button>
      <h1>确认订单</h1>
      <div class="placeholder"></div>
    </div>

    <!-- 商家信息 -->
    <div class="section merchant-section">
      <div class="merchant-info">
        <img :src="merchantInfo.logo" :alt="merchantInfo.name" class="merchant-logo" />
        <div class="merchant-details">
          <h2 class="merchant-name">{{ merchantInfo.name }}</h2>
          <div class="delivery-info">
            <span>{{ merchantInfo.deliveryTime }}分钟送达</span>
            <span>配送费¥{{ merchantInfo.deliveryFee }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 收货地址 -->
    <div class="section address-section" @click="selectAddress">
      <div class="address-icon">
        <el-icon><Location /></el-icon>
      </div>
      <div class="address-content" v-if="selectedAddress">
        <div class="address-header">
          <span class="recipient-name">{{ selectedAddress.name }}</span>
          <span class="recipient-phone">{{ selectedAddress.phone }}</span>
        </div>
        <div class="address-detail">{{ selectedAddress.address }}</div>
      </div>
      <div class="address-content" v-else>
        <div class="no-address">请选择收货地址</div>
      </div>
      <div class="address-arrow">
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 商品清单 -->
    <div class="section order-items-section">
      <div class="section-header">商品清单</div>
      <div class="order-items">
        <div v-for="item in cartItems" :key="item.id" class="order-item">
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-bottom">
              <span class="item-price">¥{{ item.price }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配送方式 -->
    <div class="section delivery-section">
      <div class="delivery-title">配送方式</div>
      <div class="delivery-option">
        <input type="radio" id="express" name="delivery" checked />
        <label for="express">快速配送</label>
      </div>
    </div>

    <!-- 备注 -->
    <div class="section remark-section">
      <div class="remark-title">备注</div>
      <el-input
        type="textarea"
        v-model="orderRemark"
        placeholder="选填，请输入备注信息"
        :rows="2"
        class="remark-input"
      ></el-input>
    </div>

    <!-- 订单金额 -->
    <div class="section price-section">
      <div class="price-row">
        <span>商品金额</span>
        <span>¥{{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="price-row">
        <span>配送费</span>
        <span>¥{{ merchantInfo.deliveryFee.toFixed(2) }}</span>
      </div>
      <div class="price-row">
        <span>优惠</span>
        <span class="discount">-¥0.00</span>
      </div>
      <div class="price-row total-row">
        <span>实付金额</span>
        <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="checkout-bar">
      <div class="total-info">
        <span>合计：</span>
        <span class="checkout-total">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
      <el-button type="primary" class="submit-btn" :disabled="!canSubmit" @click="submitOrder">
        提交订单
      </el-button>
    </div>

    <!-- 加载中遮罩 -->
    <div class="loading-mask" v-if="loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <div>订单提交中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import logger from '@/utils/logger'
import { ArrowLeft, Location, ArrowRight, Loading } from '@element-plus/icons-vue'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 响应式状态
const merchantId = ref('')
const loading = ref(false)
const orderRemark = ref('')

// 商家信息
interface MerchantInfo {
  id: string
  name: string
  logo: string
  deliveryTime: number
  deliveryFee: number
}

const merchantInfo = reactive<MerchantInfo>({
  id: '',
  name: '',
  logo: '',
  deliveryTime: 0,
  deliveryFee: 0,
})

// 购物车商品
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cartItems = ref<CartItem[]>([])

// 地址信息
interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

const selectedAddress = ref<Address | null>(null)
const addresses = ref<Address[]>([])

// 计算属性
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalPrice = computed(() => {
  return subtotal.value + merchantInfo.deliveryFee
})

const canSubmit = computed(() => {
  return selectedAddress.value !== null && cartItems.value.length > 0
})

// 组件挂载时执行
onMounted(() => {
  merchantId.value = String(route.params.id)
  loadCheckoutData()
  loadAddresses()
})

// 加载结算数据
const loadCheckoutData = () => {
  // 从sessionStorage获取结算数据
  const cartData = sessionStorage.getItem('takeout_checkout_cart')
  const merchantData = sessionStorage.getItem('takeout_checkout_merchant')

  if (cartData && merchantData) {
    const cartObj = JSON.parse(cartData)
    // 转换为数组格式
    cartItems.value = Object.values(cartObj)
    Object.assign(merchantInfo, JSON.parse(merchantData))
  } else {
    // 如果没有结算数据，返回首页
    ElMessage.warning('请先选择商品')
    router.push('/takeaway')
  }
}

// 加载地址列表
const loadAddresses = () => {
  // 模拟数据，实际应该调用API
  addresses.value = [
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      address: '学生公寓A栋101室',
      isDefault: true,
    },
    {
      id: 2,
      name: '张三',
      phone: '13800138000',
      address: '教学楼B栋505教室',
      isDefault: false,
    },
  ]
  // 默认选择默认地址
  const defaultAddress = addresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    selectedAddress.value = defaultAddress
  }
}

// 选择地址
const selectAddress = () => {
  // 这里应该跳转到地址选择页面
  // 现在简单实现选择第一个地址
  if (addresses.value.length > 0) {
    const currentIndex = selectedAddress.value ? addresses.value.indexOf(selectedAddress.value) : -1
    selectedAddress.value = addresses.value[(currentIndex + 1) % addresses.value.length]
  }
}

// 提交订单
const submitOrder = () => {
  if (!canSubmit.value) {
    ElMessage.warning('请填写完整订单信息')
    return
  }

  loading.value = true

  // 构建订单数据
  const orderData = {
    merchantId: merchantId.value,
    merchantName: merchantInfo.name,
    addressId: selectedAddress.value!.id,
    recipientName: selectedAddress.value!.name,
    recipientPhone: selectedAddress.value!.phone,
    deliveryAddress: selectedAddress.value!.address,
    totalPrice: totalPrice.value,
    subtotal: subtotal.value,
    deliveryFee: merchantInfo.deliveryFee,
    remark: orderRemark.value,
    items: cartItems.value.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  }

  // 模拟API调用
  setTimeout(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('提交订单数据:', orderData)
    }
    loading.value = false

    // 清除购物车
    localStorage.removeItem(`takeout_cart_${merchantId.value}`)
    sessionStorage.removeItem('takeout_checkout_cart')
    sessionStorage.removeItem('takeout_checkout_merchant')

    ElMessage.success('订单提交成功！')
    // 跳转到订单详情页
    router.push(`/takeaway/order/detail/${123456}`) // 假设订单ID为123456
  }, 1500)
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 70px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  padding: 5px;
}

.page-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 40px;
}

.section {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
}

.merchant-section {
  padding: 0;
}

.merchant-info {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.merchant-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.merchant-details {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.merchant-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.delivery-info {
  font-size: 12px;
  color: #666;
}

.delivery-info span {
  margin-right: 15px;
}

.address-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.address-icon {
  color: #ff6b00;
  font-size: 20px;
  margin-right: 15px;
}

.address-content {
  flex: 1;
}

.address-header {
  margin-bottom: 5px;
}

.recipient-name {
  font-weight: 600;
  margin-right: 15px;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.no-address {
  color: #999;
}

.address-arrow {
  color: #999;
}

.section-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  font-size: 14px;
  margin-bottom: 5px;
}

.item-bottom {
  display: flex;
  align-items: center;
}

.item-price {
  margin-right: 15px;
  color: #ff6b00;
  font-weight: 600;
}

.item-quantity {
  color: #666;
}

.delivery-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delivery-title {
  font-size: 15px;
}

.delivery-option {
  display: flex;
  align-items: center;
}

.delivery-option input[type='radio'] {
  margin-right: 5px;
}

.remark-section {
  padding-bottom: 20px;
}

.remark-title {
  font-size: 15px;
  margin-bottom: 10px;
}

.remark-input {
  margin-bottom: 0;
}

.price-section {
  padding: 15px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.discount {
  color: #ff6b00;
}

.total-row {
  font-weight: 600;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.total-price {
  font-size: 18px;
  color: #ff6b00;
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.total-info {
  font-size: 14px;
}

.checkout-total {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b00;
}

.submit-btn {
  min-width: 120px;
  height: 40px;
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 9999;
}

.loading-mask i {
  font-size: 40px;
  margin-bottom: 10px;
}
</style>
