<template>
  <div class="cart-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1><i class="el-icon-shopping-cart-2"></i> 购物车</h1>
      </div>
      <div class="header-right">
        <el-button v-if="cartProducts.length > 0" type="danger" size="mini" @click="clearCart">
          <i class="el-icon-delete"></i> 清空购物车
        </el-button>
      </div>
    </div>

    <!-- 购物车内容 -->
    <div class="cart-content" v-if="cartProducts.length > 0">
      <!-- 商家分组 -->
      <div
        v-for="merchantGroup in groupedCartProducts"
        :key="merchantGroup.merchantId"
        class="merchant-group"
      >
        <el-card class="merchant-header">
          <div class="merchant-info">
            <h3>{{ merchantGroup.merchantName }}</h3>
            <div class="merchant-meta">
              <span class="delivery-fee">配送费 ¥{{ merchantGroup.deliveryFee }}</span>
              <span class="min-order">起送 ¥{{ merchantGroup.minOrderAmount }}</span>
            </div>
          </div>
          <div class="merchant-actions">
            <el-button
              size="mini"
              type="primary"
              @click="continueShopping(merchantGroup.merchantId)"
            >
              <i class="el-icon-plus"></i> 继续购物
            </el-button>
          </div>
        </el-card>

        <!-- 商品列表 -->
        <el-table :data="merchantGroup.products" border size="small" class="cart-table">
          <el-table-column label="商品信息" width="300">
            <template slot-scope="{ row }">
              <div class="product-info">
                <img
                  :src="row.mainImage || '/static/images/default-product.jpg'"
                  class="product-image"
                />
                <div class="product-details">
                  <h4 class="product-name">{{ row.productName }}</h4>
                  <p v-if="row.specification" class="product-spec">{{ row.specification }}</p>
                  <p v-if="row.stock <= 10" class="stock-warning">
                    <i class="el-icon-warning"></i> 仅剩 {{ row.stock }} 件
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="100" align="center">
            <template slot-scope="{ row }">
              <span class="price">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="140" align="center">
            <template slot-scope="{ row }">
              <div class="quantity-controls">
                <el-button
                  size="mini"
                  circle
                  @click="decreaseQuantity(row)"
                  :disabled="row.quantity <= 1"
                >
                  <i class="el-icon-minus"></i>
                </el-button>
                <span class="quantity-display">{{ row.quantity }}</span>
                <el-button
                  size="mini"
                  circle
                  @click="increaseQuantity(row)"
                  :disabled="row.quantity >= row.stock"
                >
                  <i class="el-icon-plus"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="100" align="center">
            <template slot-scope="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeFromCart(row)"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 空购物车 -->
    <div v-else class="empty-cart">
      <div class="empty-icon">
        <i class="el-icon-shopping-cart-2"></i>
      </div>
      <h3>购物车空空如也</h3>
      <p>快去挑选心仪的商品吧</p>
      <el-button type="primary" @click="goToHome"> <i class="el-icon-shop"></i> 去逛逛 </el-button>
    </div>

    <!-- 底部结算栏 -->
    <div v-if="cartProducts.length > 0" class="checkout-bar">
      <div class="checkout-info">
        <div class="total-info">
          <span class="total-label">合计：</span>
          <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
          <span class="total-detail">
            (商品 ¥{{ goodsAmount.toFixed(2) }} + 配送费 ¥{{ totalDeliveryFee.toFixed(2) }})
          </span>
        </div>
        <div v-if="!meetsMinOrderRequirement" class="min-order-warning">
          <i class="el-icon-warning"></i>
          还差 ¥{{ (minOrderAmount - totalAmount).toFixed(2) }} 即可起送
        </div>
        <div v-else class="delivery-info"><i class="el-icon-check"></i> 满足起送条件</div>
      </div>
      <div class="checkout-actions">
        <el-button
          type="primary"
          size="large"
          :disabled="!meetsMinOrderRequirement"
          @click="proceedToCheckout"
        >
          去结算 ({{ totalCount }}件)
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/store/modules/cart'

// 获取 Pinia store 实例
const cartStore = useCartStore()
const router = useRouter()

// 最小起送金额
const minOrderAmount = ref(15)

// 计算属性
const cartProducts = computed(() => cartStore.products)
const totalCount = computed(() => cartStore.totalCount)
const totalAmount = computed(() => cartStore.totalAmount)
const goodsAmount = computed(() => cartStore.goodsAmount)
const totalDeliveryFee = computed(() => cartStore.totalDeliveryFee)
const meetsMinOrderRequirement = computed(() => cartStore.meetsMinOrderRequirement)

// 按商家分组的购物车商品
const groupedCartProducts = computed(() => {
  const groups: Record<
    number,
    {
      merchantId: number
      merchantName: string
      deliveryFee: number
      minOrderAmount: number
      products: any[]
    }
  > = {}

  cartProducts.value.forEach(product => {
    const { merchantId, merchantName } = product

    if (!groups[merchantId]) {
      groups[merchantId] = {
        merchantId,
        merchantName,
        deliveryFee: 2, // 模拟配送费
        minOrderAmount: minOrderAmount.value,
        products: [],
      }
    }

    groups[merchantId].products.push(product)
  })

  return Object.values(groups)
})

// 生命周期钩子：页面加载时获取购物车数据
onMounted(() => {
  fetchCartData()
})

// 获取购物车数据
const fetchCartData = async () => {
  try {
    await cartStore.fetchCartList()
  } catch (error) {
    ElMessage.error('获取购物车数据失败')
  }
}

// 增加商品数量
const increaseQuantity = (product: any) => {
  cartStore.updateQuantity(product.id, product.quantity + 1)
}

// 减少商品数量
const decreaseQuantity = (product: any) => {
  if (product.quantity > 1) {
    cartStore.updateQuantity(product.id, product.quantity - 1)
  }
}

// 从购物车移除商品
const removeFromCart = (product: any) => {
  ElMessageBox.confirm(`确定要从购物车中移除"${product.productName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.removeProduct(product.id)
      ElMessage.success('已从购物车中移除')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 清空购物车
const clearCart = () => {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.clearCart()
      ElMessage.success('购物车已清空')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 继续购物
const continueShopping = (merchantId: number) => {
  router.push(`/app/product/list`)
}

// 去结算
const proceedToCheckout = () => {
  router.push('/app/order/confirm')
}

// 去首页
const goToHome = () => {
  router.push('/app/product/list')
}
</script>

<style scoped>
.cart-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px; /* 为底部导航栏留出空间 */
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

/* 购物车内容 */
.cart-content {
  margin-bottom: 20px;
}

.merchant-group {
  margin-bottom: 20px;
}

.merchant-header {
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.merchant-header .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.merchant-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.merchant-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  opacity: 0.9;
}

/* 商品信息 */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.product-spec {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #666;
}

.stock-warning {
  margin: 0;
  font-size: 12px;
  color: #ff9500;
}

/* 数量控制 */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

/* 价格显示 */
.price,
.subtotal {
  font-weight: bold;
  color: #ff4757;
}

/* 空购物车 */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-icon i {
  font-size: 80px;
  color: #ddd;
}

.empty-cart h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.empty-cart p {
  margin: 0 0 30px 0;
  color: #999;
}

/* 底部结算栏 */
.checkout-bar {
  position: fixed;
  bottom: 56px; /* 为底部导航栏留出空间 */
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.checkout-info {
  flex: 1;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.total-label {
  font-size: 16px;
  color: #333;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff4757;
}

.total-detail {
  font-size: 12px;
  color: #999;
}

.min-order-warning {
  color: #ff9500;
  font-size: 12px;
}

.delivery-info {
  color: #5cb85c;
  font-size: 12px;
}

.checkout-actions .el-button {
  padding: 12px 30px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-container {
    padding: 10px;
    padding-bottom: 80px;
  }

  .page-header {
    padding: 10px 15px;
  }

  .merchant-header .el-card__body {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .checkout-bar {
    padding: 10px 15px;
  }

  .total-detail {
    display: none;
  }
}
</style>
