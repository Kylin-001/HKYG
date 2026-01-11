<template>
  <div class="order-success-container">
    <!-- 成功状态图标 -->
    <div class="success-icon">
      <el-icon class="success-icon-inner" :size="80">
        <i class="el-icon-circle-check"></i>
      </el-icon>
    </div>

    <!-- 成功信息 -->
    <div class="success-message">
      <h1>订单提交成功！</h1>
      <p class="order-number">订单号：{{ orderNo }}</p>
      <p class="delivery-info">预计30分钟内送达</p>
    </div>

    <!-- 订单详情卡片 -->
    <el-card class="order-detail-card">
      <template v-slot:header>
        <span><i class="el-icon-document"></i> 订单详情</span>
      </template>

      <div class="order-detail-content">
        <!-- 收货信息 -->
        <div class="detail-section">
          <h4><i class="el-icon-location"></i> 收货信息</h4>
          <div class="address-info">
            <div class="receiver">{{ mockOrder.address.name }} {{ mockOrder.address.phone }}</div>
            <div class="address">{{ mockOrder.address.fullAddress }}</div>
          </div>
        </div>

        <!-- 送达时间 -->
        <div class="detail-section">
          <h4><i class="el-icon-time"></i> 送达时间</h4>
          <div class="delivery-time">
            {{ mockOrder.deliveryTime }}
          </div>
        </div>

        <!-- 支付信息 -->
        <div class="detail-section">
          <h4><i class="el-icon-money"></i> 支付信息</h4>
          <div class="payment-info">
            <div class="payment-method">
              <span>支付方式：</span>
              <span>{{ mockOrder.paymentMethod }}</span>
            </div>
            <div class="payment-amount">
              <span>实付金额：</span>
              <span class="amount">¥{{ mockOrder.totalAmount }}</span>
            </div>
          </div>
        </div>

        <!-- 商品清单 -->
        <div class="detail-section">
          <h4><i class="el-icon-shopping-cart-2"></i> 商品清单</h4>
          <div class="products-list">
            <div
              v-for="merchant in mockOrder.merchants"
              :key="merchant.id"
              class="merchant-section"
            >
              <div class="merchant-header">
                <h5>{{ merchant.name }}</h5>
                <span class="merchant-delivery">{{ merchant.deliveryFee }}元配送费</span>
              </div>
              <div class="products">
                <div v-for="product in merchant.products" :key="product.id" class="product-item">
                  <div class="product-info">
                    <span class="product-name">{{ product.name }}</span>
                    <span v-if="product.spec" class="product-spec">{{ product.spec }}</span>
                  </div>
                  <div class="product-quantity">×{{ product.quantity }}</div>
                  <div class="product-price">¥{{ product.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="viewOrderDetail" size="large" icon="el-icon-view">
        查看订单详情
      </el-button>
      <el-button @click="continueShopping" size="large" icon="el-icon-shopping-cart-2">
        继续购物
      </el-button>
    </div>

    <!-- 温馨提示 -->
    <el-card class="tips-card">
      <template v-slot:header>
        <span><i class="el-icon-info-filled"></i> 温馨提示</span>
      </template>
      <div class="tips-content">
        <ul>
          <li>商家正在准备您的订单，请耐心等待</li>
          <li>如有疑问，请联系客服：400-888-9999</li>
          <li>配送员接单后，您可以通过订单详情页面实时跟踪配送进度</li>
          <li>请保持电话畅通，方便配送员联系您</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入Vue 3组合式API
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'

// 定义类型
interface Address {
  name: string
  phone: string
  fullAddress: string
}

interface Product {
  id: number
  name: string
  spec: string
  quantity: number
  price: number
}

interface Merchant {
  id: number
  name: string
  deliveryFee: number
  products: Product[]
}

interface Order {
  address: Address
  deliveryTime: string
  paymentMethod: string
  totalAmount: number
  merchants: Merchant[]
}

// 响应式数据
const orderNo = ref('')
const mockOrder = reactive<Order>({
  address: {
    name: '张三',
    phone: '138****8000',
    fullAddress: '北京市海淀区中关村大街1号北京大学学生公寓',
  },
  deliveryTime: '尽快送达（预计30分钟内）',
  paymentMethod: '微信支付',
  totalAmount: 45.8,
  merchants: [
    {
      id: 1,
      name: '川香小厨',
      deliveryFee: 2,
      products: [
        {
          id: 1,
          name: '宫保鸡丁',
          spec: '微辣',
          quantity: 1,
          price: 28.0,
        },
        {
          id: 2,
          name: '白米饭',
          spec: '',
          quantity: 1,
          price: 3.0,
        },
      ],
    },
    {
      id: 2,
      name: '奶茶工坊',
      deliveryFee: 1.5,
      products: [
        {
          id: 3,
          name: '珍珠奶茶',
          spec: '少糖',
          quantity: 1,
          price: 15.8,
        },
      ],
    },
  ],
})

// 使用路由和状态管理
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 查看订单详情
const viewOrderDetail = () => {
  router.push({
    path: '/takeout/orderDetail',
    query: { orderNo: orderNo.value },
  })
}

// 继续购物
const continueShopping = async () => {
  // 清空购物车并跳转到首页
  try {
    await cartStore.clearCart()
    router.push('/takeout/merchantList')
  } catch (error) {
    console.error('清空购物车失败:', error)
    router.push('/takeout/merchantList')
  }
}

// 页面加载时执行
onMounted(() => {
  // 获取订单号
  orderNo.value = (route.query.orderNo as string) || `TK${Date.now()}`
})
</script>

<style scoped>
.order-success-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* 成功图标 */
.success-icon {
  margin: 40px 0 30px 0;
}

.success-icon-inner {
  color: #52c41a;
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 成功信息 */
.success-message {
  color: white;
  margin-bottom: 30px;
}

.success-message h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: bold;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.order-number {
  font-size: 16px;
  margin-bottom: 8px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.delivery-info {
  font-size: 14px;
  opacity: 0.9;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 订单详情卡片 */
.order-detail-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.order-detail-content {
  text-align: left;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-section h4 i {
  color: #409eff;
}

/* 收货信息 */
.address-info {
  padding-left: 20px;
}

.receiver {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.address {
  color: #666;
  line-height: 1.5;
}

/* 送达时间 */
.delivery-time {
  padding-left: 20px;
  color: #333;
  font-weight: 500;
}

/* 支付信息 */
.payment-info {
  padding-left: 20px;
}

.payment-method,
.payment-amount {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #333;
}

.payment-amount .amount {
  font-weight: bold;
  color: #ff4757;
  font-size: 18px;
}

/* 商品清单 */
.products-list {
  padding-left: 20px;
}

.merchant-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.merchant-section:last-child {
  margin-bottom: 0;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
}

.merchant-header h5 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.merchant-delivery {
  color: #666;
  font-size: 14px;
}

.products {
  padding-left: 10px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  flex: 1;
}

.product-name {
  color: #333;
  margin-right: 10px;
}

.product-spec {
  color: #666;
  font-size: 12px;
}

.product-quantity {
  color: #666;
  margin: 0 10px;
}

.product-price {
  font-weight: bold;
  color: #ff4757;
}

/* 操作按钮 */
.action-buttons {
  margin-bottom: 30px;
  animation: fadeInUp 0.8s ease-out 1s both;
}

.action-buttons .el-button {
  margin: 0 8px;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 25px;
}

.action-buttons .el-button--primary {
  background: linear-gradient(45deg, #409eff, #36c1fc);
  border: none;
}

.action-buttons .el-button--primary:hover {
  background: linear-gradient(45deg, #36c1fc, #409eff);
}

/* 温馨提示 */
.tips-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out 1.2s both;
}

.tips-card .el-card__header {
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.tips-content {
  text-align: left;
}

.tips-content ul {
  margin: 0;
  padding-left: 20px;
}

.tips-content li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.6;
}

.tips-content li:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-success-container {
    padding: 15px;
  }

  .success-message h1 {
    font-size: 24px;
  }

  .order-detail-card,
  .tips-card {
    margin-bottom: 20px;
  }

  .action-buttons .el-button {
    display: block;
    width: 100%;
    margin: 8px 0;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .merchant-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
