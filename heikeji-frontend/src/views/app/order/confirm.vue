<template>
  <div class="order-confirm-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">确认订单</div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="order-info">
      <!-- 收货地址 -->
      <div class="address-section">
        <div class="section-title">收货地址</div>
        <div class="address-content" @click="selectAddress">
          <div v-if="selectedAddress" class="address-detail">
            <div class="address-header">
              <span class="consignee">{{ selectedAddress.consignee }}</span>
              <span class="phone">{{ selectedAddress.phone }}</span>
            </div>
            <div class="address-text">
              {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district
              }}{{ selectedAddress.detail }}
            </div>
          </div>
          <div v-else class="no-address">
            <i class="el-icon-plus"></i>
            <span>添加收货地址</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="goods-section">
        <div class="section-title">商品信息</div>
        <div class="goods-list">
          <div v-for="item in orderGoods" :key="item.id" class="goods-item">
            <div class="goods-image">
              <img
                v-lazy="item.mainImage || '/static/images/default-product.png'"
                :alt="item.productName"
              />
            </div>
            <div class="goods-info">
              <div class="goods-name">{{ item.productName }}</div>
              <div class="goods-spec">{{ item.specification }}</div>
              <div class="goods-price">¥{{ item.price }}</div>
            </div>
            <div class="goods-quantity">x{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="delivery-section">
        <div class="section-title">配送方式</div>
        <div class="delivery-options">
          <div
            v-for="option in deliveryOptions"
            :key="option.id"
            class="delivery-option"
            :class="{ active: selectedDelivery === option.id }"
            @click="selectedDelivery = option.id"
          >
            <div class="option-info">
              <div class="option-name">{{ option.name }}</div>
              <div class="option-desc">{{ option.desc }}</div>
            </div>
            <div class="option-price">{{ option.price === 0 ? '免费' : `¥${option.price}` }}</div>
            <el-radio v-model="selectedDelivery" :label="option.id" size="small"></el-radio>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="section-title">支付方式</div>
        <div class="payment-options">
          <div
            v-for="option in paymentOptions"
            :key="option.id"
            class="payment-option"
            :class="{ active: selectedPayment === option.id }"
            @click="selectedPayment = option.id"
          >
            <div class="option-info">
              <i :class="option.icon"></i>
              <span>{{ option.name }}</span>
            </div>
            <el-radio v-model="selectedPayment" :label="option.id" size="small"></el-radio>
          </div>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="coupon-section">
        <div class="section-title">优惠券</div>
        <div class="coupon-content" @click="selectCoupon">
          <div class="coupon-info">
            <span v-if="selectedCoupon"
              >已选择：{{ selectedCoupon.name }} -¥{{ selectedCoupon.value }}</span
            >
            <span v-else>请选择优惠券</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="remark-section">
        <div class="section-title">订单备注</div>
        <el-input
          v-model="orderRemark"
          placeholder="请输入订单备注"
          type="textarea"
          :rows="2"
        ></el-input>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="checkout-bar">
      <!-- 价格信息 -->
      <div class="price-info">
        <div class="total-price">
          合计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="other-fees">
          <span v-if="deliveryFee > 0">运费：¥{{ deliveryFee.toFixed(2) }}</span>
          <span v-if="couponDiscount > 0">优惠：-¥{{ couponDiscount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交订单按钮 -->
      <button class="submit-btn" :loading="submitting" @click="submitOrder">提交订单</button>
    </div>

    <!-- 地址选择弹窗 -->
    <el-dialog v-model="showAddressDialog" title="选择收货地址" width="90%" max-height="80vh">
      <div class="address-dialog-content">
        <!-- 加载状态 -->
        <div v-if="loadingAddress" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>

        <!-- 地址列表 -->
        <div v-else>
          <div
            v-for="address in addressList"
            :key="address.id"
            class="address-item"
            :class="{ active: selectedAddress && selectedAddress.id === address.id }"
            @click="selectAddressItem(address)"
          >
            <div class="address-header">
              <span class="consignee">{{ address.consignee }}</span>
              <span class="phone">{{ address.phone }}</span>
              <span v-if="address.isDefault" class="default-tag">默认</span>
            </div>
            <div class="address-text">
              {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="addressList.length === 0" class="empty-address">
            <i class="el-icon-location-outline"></i>
            <span>暂无收货地址</span>
          </div>

          <!-- 添加新地址按钮 -->
          <div class="add-address-btn" @click="addNewAddress">
            <i class="el-icon-plus"></i>
            <span>添加新地址</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 优惠券选择弹窗 -->
    <el-dialog v-model="showCouponDialog" title="选择优惠券" width="90%" max-height="80vh">
      <div class="coupon-dialog-content">
        <!-- 加载状态 -->
        <div v-if="loadingCoupon" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        <!-- 优惠券列表 -->
        <div v-else>
          <div
            v-for="coupon in couponList"
            :key="coupon.id"
            class="coupon-item"
            :class="{ active: selectedCoupon && selectedCoupon.id === coupon.id }"
            @click="selectCouponItem(coupon)"
          >
            <div class="coupon-left">
              <div class="coupon-value">¥{{ coupon.value }}</div>
              <div class="coupon-min">满{{ coupon.minAmount }}元可用</div>
            </div>
            <div class="coupon-right">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-desc">{{ coupon.desc }}</div>
              <div class="coupon-time">{{ coupon.startTime }} - {{ coupon.endTime }}</div>
            </div>
          </div>
          <div class="no-coupon" v-if="couponList.length === 0">
            <i class="el-icon-tickets"></i>
            <span>暂无可用优惠券</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getAddressList, getDefaultAddress } from '@/api/app/address'
import {
  submitOrder as submitOrderApi,
  preCreateOrder as preCreateOrderApi,
  cancelPreOrder as cancelPreOrderApi,
} from '@/api/app/order'
import { getOrderAvailableCoupons } from '@/api/app/coupon'

// 初始化路由
const router = useRouter()

// 提交状态
const submitting = ref(false)
// 地址加载状态
const loadingAddress = ref(false)

// 地址相关
const selectedAddress = ref(null)
const addressList = ref([])
const showAddressDialog = ref(false)

// 商品列表
const orderGoods = ref([])

// 初始化商品列表（从路由参数或购物车获取）
const initOrderGoods = () => {
  // 这里可以从路由参数获取商品信息（立即购买场景）
  // 或者从购物车获取选中的商品（购物车结算场景）
  // 目前使用模拟数据
  orderGoods.value = [
    {
      id: 1,
      productId: 1001,
      productName: '高品质数码商品 1 - 最新科技产品，品质保证',
      specification: '颜色：黑色，容量：128GB',
      price: 1299.0,
      quantity: 1,
      mainImage: 'https://picsum.photos/id/1/300/300',
    },
    {
      id: 2,
      productId: 1002,
      productName: '高品质数码商品 2 - 最新科技产品，品质保证',
      specification: '颜色：白色，容量：256GB',
      price: 1599.0,
      quantity: 2,
      mainImage: 'https://picsum.photos/id/2/300/300',
    },
  ]
}

// 加载地址列表
const loadAddressList = async () => {
  loadingAddress.value = true
  try {
    const response = await getAddressList()
    addressList.value = response.data || []

    // 如果有默认地址，自动选中
    const defaultAddress = addressList.value.find(addr => addr.isDefault)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
    }
  } catch (error) {
    console.error('获取地址列表失败:', error)
    ElMessage.error('获取地址列表失败')
    addressList.value = []
  } finally {
    loadingAddress.value = false
  }
}

// 加载默认地址
const loadDefaultAddress = async () => {
  try {
    const response = await getDefaultAddress()
    if (response.data) {
      selectedAddress.value = response.data
    }
  } catch (error) {
    console.error('获取默认地址失败:', error)
    // 失败时不处理，继续使用地址列表中的默认地址
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  initOrderGoods()
  await loadAddressList()
  if (!selectedAddress.value) {
    await loadDefaultAddress()
  }
  // 加载可用优惠券
  await loadAvailableCoupons()
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 清除预订单超时定时器
  if (preOrderTimeout) {
    clearTimeout(preOrderTimeout)
    preOrderTimeout = null
  }
})

// 配送方式
const deliveryOptions = ref([
  { id: 1, name: '普通快递', desc: '预计3-5天送达', price: 10.0 },
  { id: 2, name: '加急快递', desc: '预计1-2天送达', price: 20.0 },
  { id: 3, name: '同城配送', desc: '预计当天送达', price: 15.0 },
])
const selectedDelivery = ref(1)

// 支付方式
const paymentOptions = ref([
  { id: 1, name: '微信支付', icon: 'el-icon-wechat' },
  { id: 2, name: '支付宝', icon: 'el-icon-alipay' },
  { id: 3, name: '银行卡支付', icon: 'el-icon-credit-card' },
])
const selectedPayment = ref(1)

// 优惠券
const couponList = ref([])
const selectedCoupon = ref(null)
const showCouponDialog = ref(false)
const loadingCoupon = ref(false)

// 加载可用优惠券
const loadAvailableCoupons = async () => {
  loadingCoupon.value = true
  try {
    // 获取商品ID列表
    const productIds = orderGoods.value.map(item => item.productId)
    // 调用API获取可用优惠券
    const response = await getOrderAvailableCoupons({
      productIds,
      totalAmount: goodsTotal.value,
    })
    couponList.value = response.data || []
  } catch (error) {
    console.error('获取可用优惠券失败:', error)
    couponList.value = []
    ElMessage.error('获取可用优惠券失败')
  } finally {
    loadingCoupon.value = false
  }
}

// 订单备注
const orderRemark = ref('')

// 计算商品总价
const goodsTotal = computed(() => {
  return orderGoods.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 计算配送费
const deliveryFee = computed(() => {
  const selectedOption = deliveryOptions.value.find(option => option.id === selectedDelivery.value)
  return selectedOption ? selectedOption.price : 0
})

// 计算优惠券优惠
const couponDiscount = computed(() => {
  return selectedCoupon.value ? selectedCoupon.value.value : 0
})

// 计算总价格
const totalPrice = computed(() => {
  return goodsTotal.value + deliveryFee.value - couponDiscount.value
})

// 选择地址
const selectAddress = () => {
  showAddressDialog.value = true
}

// 选择地址项
const selectAddressItem = address => {
  selectedAddress.value = address
  showAddressDialog.value = false
}

// 添加新地址
const addNewAddress = () => {
  ElMessage.info('添加新地址功能开发中')
  showAddressDialog.value = false
}

// 选择优惠券
const selectCoupon = () => {
  showCouponDialog.value = true
}

// 选择优惠券项
const selectCouponItem = coupon => {
  selectedCoupon.value = coupon
  showCouponDialog.value = false
}

// 预订单ID
const preOrderId = ref(null)
// 预订单超时定时器
let preOrderTimeout = null

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  if (orderGoods.value.length === 0) {
    ElMessage.warning('订单商品不能为空')
    return
  }

  submitting.value = true

  try {
    // 1. 预创建订单（锁定库存）
    ElMessage.info('正在锁定库存...')
    const preOrderParams = {
      addressId: selectedAddress.value.id,
      deliveryId: selectedDelivery.value,
      couponId: selectedCoupon.value?.id,
      remark: orderRemark.value,
      items: orderGoods.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        specification: item.specification,
      })),
    }

    const preOrderResponse = await preCreateOrderApi(preOrderParams)
    preOrderId.value = preOrderResponse.data.preOrderId

    // 设置预订单超时处理（30分钟后自动取消）
    if (preOrderTimeout) {
      clearTimeout(preOrderTimeout)
    }
    preOrderTimeout = setTimeout(
      () => {
        handlePreOrderTimeout()
      },
      30 * 60 * 1000
    ) // 30分钟

    // 2. 提交正式订单
    ElMessage.info('正在提交订单...')
    const submitParams = {
      preOrderId: preOrderResponse.data.preOrderId,
      paymentMethodId: selectedPayment.value,
    }

    const submitResponse = await submitOrderApi(submitParams)

    ElMessage.success('订单提交成功')
    submitting.value = false

    // 清除超时定时器
    if (preOrderTimeout) {
      clearTimeout(preOrderTimeout)
      preOrderTimeout = null
    }

    // 跳转到支付页面
    router.push({
      path: '/app/payment',
      query: { orderId: submitResponse.data.orderId },
    })
  } catch (error: any) {
    console.error('订单提交失败:', error)
    ElMessage.error(error.message || '订单提交失败')
    submitting.value = false

    // 清除超时定时器
    if (preOrderTimeout) {
      clearTimeout(preOrderTimeout)
      preOrderTimeout = null
    }
  }
}

// 处理预订单超时
const handlePreOrderTimeout = async () => {
  if (preOrderId.value) {
    try {
      await cancelPreOrderApi(preOrderId.value)
      ElMessage.warning('订单已超时，请重新下单')
      preOrderId.value = null
    } catch (error) {
      console.error('取消超时预订单失败:', error)
    }
  }
}
</script>

<style scoped>
.order-confirm-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 订单信息 */
.order-info {
  background-color: #fff;
  margin: 12px 0;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* 收货地址 */
.address-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
}

.address-detail {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.consignee {
  font-weight: bold;
  margin-right: 16px;
}

.phone {
  color: #666;
}

.default-tag {
  margin-left: auto;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.address-text {
  color: #666;
  line-height: 1.5;
}

.no-address {
  flex: 1;
  display: flex;
  align-items: center;
  color: #999;
}

.no-address i {
  margin-right: 8px;
  font-size: 18px;
}

/* 商品列表 */
.goods-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-image {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.goods-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.goods-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.goods-quantity {
  font-size: 14px;
  color: #666;
}

/* 配送方式 */
.delivery-options {
  padding: 16px;
}

.delivery-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.delivery-option:last-child {
  margin-bottom: 0;
}

.delivery-option.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.option-info {
  flex: 1;
}

.option-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #999;
}

.option-price {
  margin-right: 12px;
  color: #f56c6c;
}

/* 支付方式 */
.payment-options {
  padding: 16px;
}

.payment-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:last-child {
  margin-bottom: 0;
}

.payment-option.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.payment-option .option-info {
  display: flex;
  align-items: center;
}

.payment-option i {
  font-size: 24px;
  margin-right: 12px;
}

/* 优惠券 */
.coupon-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
}

.coupon-info {
  flex: 1;
  color: #666;
}

/* 订单备注 */
.remark-section {
  padding: 16px;
}

/* 底部结算栏 */
.checkout-bar {
  position: fixed;
  bottom: 56px;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
}

.price-info {
  flex: 1;
}

.total-price {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.total-price .price {
  color: #f56c6c;
  font-size: 18px;
}

.other-fees {
  display: flex;
  font-size: 12px;
  color: #999;
}

.other-fees span {
  margin-right: 12px;
}

.submit-btn {
  padding: 0 24px;
  height: 40px;
  background-color: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #f78989;
}

.submit-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

/* 地址弹窗 */
.address-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}

.address-dialog-content .address-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-dialog-content .address-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.address-dialog-content .add-address-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  color: #409eff;
  cursor: pointer;
  transition: all 0.3s;
}

.address-dialog-content .add-address-btn:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.address-dialog-content .add-address-btn i {
  margin-right: 8px;
}

/* 优惠券弹窗 */
.coupon-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}

/* 加载状态 */
.loading-container {
  padding: 16px 0;
}

/* 空状态 */
.empty-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty-address i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item.active {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.coupon-left {
  width: 120px;
  text-align: center;
  padding-right: 16px;
  border-right: 1px dashed #e0e0e0;
}

.coupon-value {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.coupon-min {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.coupon-right {
  flex: 1;
  padding-left: 16px;
}

.coupon-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.coupon-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.coupon-time {
  font-size: 12px;
  color: #999;
}

.no-coupon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.no-coupon i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>
