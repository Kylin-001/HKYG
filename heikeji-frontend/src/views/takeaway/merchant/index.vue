<template>
  <div class="merchant-detail">
    <!-- 商家头部信息 -->
    <div class="merchant-header">
      <div class="merchant-basic-info">
        <img :src="merchantInfo.logo" :alt="merchantInfo.name" class="merchant-logo" />
        <div class="info-content">
          <h2 class="merchant-name">{{ merchantInfo.name }}</h2>
          <div class="merchant-rating">
            <i class="el-icon-StarFilled"></i>
            <span>{{ merchantInfo.rating }}</span>
            <span class="sales">月售{{ merchantInfo.monthlySales }}单</span>
          </div>
          <div class="merchant-meta">
            <span>{{ merchantInfo.deliveryTime }}分钟送达</span>
            <span>¥{{ merchantInfo.deliveryFee }}配送费</span>
            <span>¥{{ merchantInfo.minOrderAmount }}起送</span>
          </div>
        </div>
      </div>
      <div class="back-button">
        <el-button :icon="ArrowLeft" @click="goBack"></el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-container">
      <!-- 左侧商品分类 -->
      <div class="category-list">
        <div
          v-for="category in categoryList"
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- 右侧商品列表 -->
      <div class="product-list">
        <div
          v-for="category in categoryList"
          :key="category.id"
          v-show="selectedCategory === category.id"
          class="product-category"
        >
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="product-items">
            <div
              v-for="product in getProductsByCategory(category.id)"
              :key="product.id"
              class="product-item"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-bottom">
                  <span class="product-price">¥{{ product.price }}</span>
                  <div class="quantity-control">
                    <button
                      v-if="cartItems[product.id] && cartItems[product.id].quantity > 0"
                      class="quantity-btn decrease"
                      @click="decreaseQuantity(product)"
                    >
                      -
                    </button>
                    <span
                      v-if="cartItems[product.id] && cartItems[product.id].quantity > 0"
                      class="quantity"
                    >
                      {{ cartItems[product.id].quantity }}
                    </span>
                    <button class="quantity-btn increase" @click="addToCart(product)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <div class="cart-bar" v-if="totalQuantity > 0">
      <div class="cart-info">
        <div class="total-price">
          总计: <span>¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="delivery-info">
          {{
            isMinOrder
              ? '已达起送价'
              : `还差¥${(merchantInfo.minOrderAmount - totalPrice).toFixed(2)}起送`
          }}
        </div>
      </div>
      <el-button type="primary" class="checkout-btn" :disabled="!isMinOrder" @click="goToCheckout">
        去结算({{ totalQuantity }})
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, StarFilled } from '@element-plus/icons-vue'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 响应式状态
const merchantId = ref('')
const loading = ref(false)

// 商家信息
interface MerchantInfo {
  id: string
  name: string
  logo: string
  rating: number
  monthlySales: number
  deliveryTime: number
  deliveryFee: number
  minOrderAmount: number
}

const merchantInfo = reactive<MerchantInfo>({
  id: '',
  name: '',
  logo: '',
  rating: 0,
  monthlySales: 0,
  deliveryTime: 0,
  deliveryFee: 0,
  minOrderAmount: 0,
})

// 分类列表
interface Category {
  id: number
  name: string
}

const categoryList = ref<Category[]>([])

// 商品列表
interface Product {
  id: number
  categoryId: number
  name: string
  description: string
  price: number
  image: string
}

const productList = ref<Product[]>([])

// 选中的分类
const selectedCategory = ref('')

// 购物车商品
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cartItems = reactive<Record<number, CartItem>>({})

// 计算属性
const totalQuantity = computed(() => {
  return Object.values(cartItems).reduce((total, item) => total + item.quantity, 0)
})

const totalPrice = computed(() => {
  return Object.values(cartItems).reduce((total, item) => total + item.price * item.quantity, 0)
})

const isMinOrder = computed(() => {
  return totalPrice.value >= merchantInfo.minOrderAmount
})

// 组件挂载时执行
onMounted(() => {
  merchantId.value = String(route.params.id)
  loadMerchantInfo()
  loadProducts()
})

// 加载商家信息
const loadMerchantInfo = () => {
  loading.value = true
  // 模拟数据，实际应该调用API
  setTimeout(() => {
    Object.assign(merchantInfo, {
      id: merchantId.value,
      name: '校园美食城',
      logo: 'https://via.placeholder.com/200',
      rating: 4.8,
      monthlySales: 1280,
      deliveryTime: 30,
      deliveryFee: 5,
      minOrderAmount: 20,
    })
    loading.value = false
  }, 300)
}

// 加载商品数据
const loadProducts = () => {
  // 模拟数据，实际应该调用API
  categoryList.value = [
    { id: 1, name: '热销推荐' },
    { id: 2, name: '盖浇饭' },
    { id: 3, name: '面食类' },
    { id: 4, name: '小吃类' },
    { id: 5, name: '饮品' },
  ]
  productList.value = [
    // 热销推荐
    {
      id: 1,
      categoryId: 1,
      name: '宫保鸡丁盖饭',
      description: '经典川菜，口味香辣',
      price: 18,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      categoryId: 1,
      name: '鱼香肉丝盖饭',
      description: '酸甜可口，开胃下饭',
      price: 16,
      image: 'https://via.placeholder.com/100',
    },
    // 盖浇饭
    {
      id: 3,
      categoryId: 2,
      name: '西红柿鸡蛋盖饭',
      description: '家常口味，营养丰富',
      price: 14,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 4,
      categoryId: 2,
      name: '红烧肉盖饭',
      description: '肥而不腻，入口即化',
      price: 22,
      image: 'https://via.placeholder.com/100',
    },
    // 面食类
    {
      id: 5,
      categoryId: 3,
      name: '牛肉拉面',
      description: '劲道拉面，牛肉香浓',
      price: 18,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 6,
      categoryId: 3,
      name: '西红柿鸡蛋面',
      description: '酸甜可口，汤鲜味美',
      price: 15,
      image: 'https://via.placeholder.com/100',
    },
    // 小吃类
    {
      id: 7,
      categoryId: 4,
      name: '香辣鸡翅',
      description: '外酥里嫩，香辣可口',
      price: 12,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 8,
      categoryId: 4,
      name: '薯条',
      description: '金黄酥脆，美味可口',
      price: 8,
      image: 'https://via.placeholder.com/100',
    },
    // 饮品
    {
      id: 9,
      categoryId: 5,
      name: '可乐',
      description: '冰爽可口',
      price: 3,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 10,
      categoryId: 5,
      name: '雪碧',
      description: '清爽解渴',
      price: 3,
      image: 'https://via.placeholder.com/100',
    },
  ]
  // 默认选中第一个分类
  if (categoryList.value.length > 0) {
    selectedCategory.value = categoryList.value[0].id
  }
}

// 选择分类
const selectCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
}

// 根据分类获取商品
const getProductsByCategory = (categoryId: number) => {
  return productList.value.filter(product => product.categoryId === categoryId)
}

// 添加到购物车
const addToCart = (product: Product) => {
  if (!cartItems[product.id]) {
    cartItems[product.id] = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 0,
    }
  }
  cartItems[product.id].quantity++
  // 保存到本地存储
  saveCartToStorage()
}

// 减少数量
const decreaseQuantity = (product: Product) => {
  if (cartItems[product.id] && cartItems[product.id].quantity > 0) {
    cartItems[product.id].quantity--
    if (cartItems[product.id].quantity === 0) {
      delete cartItems[product.id]
    }
    // 保存到本地存储
    saveCartToStorage()
  }
}

// 保存购物车到本地存储
const saveCartToStorage = () => {
  localStorage.setItem(`takeout_cart_${merchantId.value}`, JSON.stringify(cartItems))
}

// 前往结算页
const goToCheckout = () => {
  // 将购物车信息保存到sessionStorage，用于结算页面
  sessionStorage.setItem('takeout_checkout_cart', JSON.stringify(cartItems))
  sessionStorage.setItem('takeout_checkout_merchant', JSON.stringify(merchantInfo))
  router.push(`/takeaway/checkout/${merchantId.value}`)
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.merchant-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.merchant-header {
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.merchant-basic-info {
  display: flex;
  align-items: center;
}

.merchant-logo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.info-content {
  margin-left: 15px;
  flex: 1;
}

.merchant-name {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
}

.merchant-rating {
  color: #ff6b00;
  margin-bottom: 8px;
}

.sales {
  color: #666;
  margin-left: 10px;
}

.merchant-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.back-button {
  position: absolute;
  top: 15px;
  right: 15px;
}

.content-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-list {
  width: 100px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.category-item {
  padding: 15px 10px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
}

.category-item.active {
  background-color: #fff;
  color: #ff6b00;
  font-weight: 600;
}

.product-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f9f9f9;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.product-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-image img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
}

.product-description {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #999;
  flex: 1;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b00;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.quantity-btn.increase {
  background-color: #ff6b00;
  color: #fff;
  border-color: #ff6b00;
}

.quantity {
  margin: 0 8px;
  min-width: 20px;
  text-align: center;
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.cart-info {
  flex: 1;
}

.total-price {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.total-price span {
  color: #ff6b00;
}

.delivery-info {
  font-size: 12px;
  color: #999;
}

.checkout-btn {
  min-width: 120px;
  height: 40px;
}
</style>
