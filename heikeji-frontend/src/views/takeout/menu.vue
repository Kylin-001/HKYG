<template>
  <div class="menu-container">
    <!-- 页面头部 -->
    <div class="menu-header">
      <div class="header-left">
        <el-button @click="goBack" icon="el-icon-arrow-left" circle></el-button>
        <div class="merchant-info">
          <h2>{{ merchant.name }}</h2>
          <p>{{ merchant.description }}</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="$router.push('/takeout/cart')" class="cart-button">
          <i class="el-icon-shopping-cart-2"></i>
          购物车 <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </el-button>
      </div>
    </div>

    <!-- 商家信息卡片 -->
    <el-card class="merchant-detail-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="merchant-image">
            <img
              :src="merchant.image || '/static/images/default-merchant.jpg'"
              :alt="merchant.name"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="merchant-stats">
            <div class="stat-item">
              <span class="label">评分</span>
              <div class="value">
                <el-rate
                  v-model="merchant.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                  :max="5"
                  :allow-half="true"
                  :size="16"
                ></el-rate>
              </div>
            </div>
            <div class="stat-item">
              <span class="label">月销量</span>
              <span class="value">{{ merchant.monthlySales }}+</span>
            </div>
            <div class="stat-item">
              <span class="label">起送价</span>
              <span class="value">¥{{ merchant.minOrderAmount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">配送费</span>
              <span class="value">¥{{ merchant.deliveryFee }}</span>
            </div>
            <div class="stat-item">
              <span class="label">配送时间</span>
              <span class="value">{{ merchant.deliveryTime }}分钟</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 分类导航 -->
    <el-card class="category-nav">
      <el-tabs v-model="activeCategory" type="card" @tab-click="handleCategoryChange">
        <el-tab-pane
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :name="category.id.toString()"
        >
          <div class="menu-content">
            <!-- 菜品网格 -->
            <div class="menu-grid">
              <el-row :gutter="20">
                <el-col
                  v-for="product in currentProducts"
                  :key="product.id"
                  :xs="24"
                  :sm="12"
                  :md="8"
                  :lg="6"
                >
                  <el-card class="product-card" @click.native="selectProduct(product)">
                    <!-- 产品图片 -->
                    <div class="product-image">
                      <img
                        v-lazy="product.image || '/static/images/default-product.jpg'"
                        :alt="product.name"
                      />
                      <div class="product-badges">
                        <span v-if="product.isRecommended" class="badge recommended">推荐</span>
                        <span v-if="product.isSpicy" class="badge spicy">辣</span>
                        <span v-if="product.isVegetarian" class="badge vegetarian">素</span>
                      </div>
                    </div>

                    <!-- 产品信息 -->
                    <div class="product-info">
                      <h4 class="product-name">{{ product.name }}</h4>
                      <p class="product-desc">{{ product.description }}</p>

                      <div class="product-stats">
                        <div class="price-info">
                          <span class="current-price">¥{{ product.price }}</span>
                          <span
                            v-if="product.originalPrice && product.originalPrice > product.price"
                            class="original-price"
                          >
                            ¥{{ product.originalPrice }}
                          </span>
                        </div>
                        <div class="sales-info">月销 {{ product.monthlySales }}</div>
                      </div>

                      <!-- 添加到购物车按钮 -->
                      <div class="product-actions">
                        <el-button
                          type="primary"
                          size="mini"
                          @click.stop="addToCart(product)"
                          :disabled="product.stock <= 0"
                        >
                          {{ product.stock > 0 ? '加入购物车' : '已售完' }}
                        </el-button>
                        <el-button
                          v-if="getCartQuantity(product.id) > 0"
                          size="mini"
                          @click.stop="showCartQuantity(product.id)"
                          class="quantity-btn"
                        >
                          购物车中 {{ getCartQuantity(product.id) }} 份
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 产品详情对话框 -->
    <el-dialog
      :title="selectedProduct && selectedProduct.name"
      :visible.sync="productDialogVisible"
      width="600px"
    >
      <div v-if="selectedProduct" class="product-detail">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="detail-image">
              <img
                :src="selectedProduct.image || '/static/images/default-product.jpg'"
                :alt="selectedProduct.name"
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="detail-info">
              <h3>{{ selectedProduct.name }}</h3>
              <p class="detail-desc">{{ selectedProduct.description }}</p>

              <div class="detail-stats">
                <div class="price-section">
                  <span class="detail-price">¥{{ selectedProduct.price }}</span>
                  <span
                    v-if="
                      selectedProduct.originalPrice &&
                      selectedProduct.originalPrice > selectedProduct.price
                    "
                    class="detail-original-price"
                  >
                    ¥{{ selectedProduct.originalPrice }}
                  </span>
                </div>
                <div class="detail-meta">
                  <span>月销 {{ selectedProduct.monthlySales }}+</span>
                  <span v-if="selectedProduct.stock > 0">库存 {{ selectedProduct.stock }}</span>
                  <span v-else style="color: #ff4757">已售完</span>
                </div>
              </div>

              <!-- 规格选择（如果有） -->
              <div
                v-if="selectedProduct.specs && selectedProduct.specs.length > 0"
                class="spec-selection"
              >
                <h4>选择规格</h4>
                <el-radio-group v-model="selectedSpec" size="small">
                  <el-radio-button
                    v-for="spec in selectedProduct.specs"
                    :key="spec.id"
                    :label="spec.id"
                    :disabled="spec.stock <= 0"
                  >
                    {{ spec.name }} ¥{{ spec.price }}
                  </el-radio-button>
                </el-radio-group>
              </div>

              <!-- 数量选择 -->
              <div class="quantity-selection">
                <h4>数量</h4>
                <el-input-number
                  v-model="selectedQuantity"
                  :min="1"
                  :max="Math.max(1, selectedProduct.stock)"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmAddToCart"
          :disabled="!selectedProduct || selectedProduct.stock <= 0"
        >
          加入购物车 ¥{{ getTotalPrice() }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'
import { ElMessage } from 'element-plus'

// 初始化路由和状态管理
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 商家信息
const merchant = ref({
  id: 0,
  name: '',
  description: '',
  rating: 0,
  monthlySales: 0,
  minOrderAmount: 0,
  deliveryFee: 0,
  deliveryTime: 0,
  image: '',
})

// 分类
const categories = ref([
  { id: 1, name: '招牌主食' },
  { id: 2, name: '热销菜品' },
  { id: 3, name: '汤品小食' },
  { id: 4, name: '饮品甜点' },
])

// 当前选中的分类
const activeCategory = ref('1')

// 菜品列表
const products = ref([])

// 产品详情对话框
const productDialogVisible = ref(false)
const selectedProduct = ref(null)
const selectedSpec = ref(null)
const selectedQuantity = ref(1)

// 购物车商品数量
const cartItemCount = ref(0)

// 当前分类的菜品
const currentProducts = computed(() => {
  return products.value.filter(
    (product: any) => product.categoryId.toString() === activeCategory.value
  )
})

// 从 Pinia 获取购物车商品
const cartProducts = computed(() => cartStore.products)

// 监听购物车变化，更新购物车数量
watchEffect(() => {
  updateCartCount()
})

// 加载商家信息
const loadMerchantInfo = () => {
  const { merchantId } = route.params
  // 模拟商家数据
  const mockMerchant = {
    id: merchantId,
    name: '兰州拉面',
    description: '正宗兰州拉面，香味浓郁，汤汁鲜美',
    rating: 4.5,
    monthlySales: 1200,
    minOrderAmount: 15,
    deliveryFee: 2,
    deliveryTime: 25,
    image: '/static/images/default-merchant.jpg',
  }
  merchant.value = mockMerchant
}

// 加载菜品
const loadProducts = () => {
  // 模拟菜品数据
  products.value = generateMockProducts()
}

// 生成模拟菜品数据
const generateMockProducts = () => {
  const categories = [1, 2, 3, 4]
  const productNames = {
    1: ['牛肉拉面', '羊肉拉面', '鸡蛋拉面', '酸菜牛肉面', '红烧牛肉面'],
    2: ['宫保鸡丁', '麻婆豆腐', '回锅肉', '鱼香肉丝', '青椒肉丝'],
    3: ['紫菜蛋花汤', '冬瓜排骨汤', '酸辣汤', '小笼包', '蒸饺'],
    4: ['柠檬蜂蜜茶', '红豆奶茶', '布丁', '双皮奶', '杨枝甘露'],
  }

  const products = []
  let productId = 1

  for (const categoryId of categories) {
    const names = productNames[categoryId as keyof typeof productNames]
    for (const name of names) {
      const price = 8 + Math.random() * 20
      const originalPrice = price + 3 + Math.random() * 5

      products.push({
        id: productId++,
        name,
        description: `精选${name}，新鲜制作，口感丰富`,
        price: Math.round(price * 100) / 100,
        originalPrice: Math.round(originalPrice * 100) / 100,
        categoryId,
        monthlySales: Math.floor(Math.random() * 500) + 50,
        stock: Math.floor(Math.random() * 50) + 10,
        image: '/static/images/default-product.jpg',
        isRecommended: Math.random() < 0.3,
        isSpicy: Math.random() < 0.4,
        isVegetarian: Math.random() < 0.2,
        specs:
          categoryId === 1
            ? [
                { id: 1, name: '小份', price: price - 2, stock: 20 },
                { id: 2, name: '中份', price, stock: 30 },
                { id: 3, name: '大份', price: price + 3, stock: 25 },
              ]
            : [],
      })
    }
  }

  return products
}

// 分类切换
const handleCategoryChange = () => {
  // 可以在这里添加分类切换的逻辑
}

// 选择产品
const selectProduct = (product: any) => {
  selectedProduct.value = product
  selectedSpec.value = product.specs && product.specs.length > 0 ? product.specs[0].id : null
  selectedQuantity.value = 1
  productDialogVisible.value = true
}

// 添加到购物车
const addToCart = async (product: any) => {
  if (product.specs && product.specs.length > 0) {
    selectProduct(product)
  } else {
    await addProductToCart(product, 1)
  }
}

// 确认添加到购物车
const confirmAddToCart = async () => {
  if (!selectedProduct.value) return

  const spec =
    selectedProduct.value.specs && selectedProduct.value.specs.length > 0
      ? selectedProduct.value.specs.find((s: any) => s.id === selectedSpec.value)
      : null

  const cartProduct = {
    productId: selectedProduct.value.id,
    quantity: selectedQuantity.value,
    specification: spec ? spec.name : '',
  }

  try {
    await cartStore.addProduct(cartProduct)
    productDialogVisible.value = false
    ElMessage.success('商品已加入购物车')
  } catch (error) {
    ElMessage.error('添加到购物车失败')
    console.error('添加到购物车失败:', error)
  }
}

// 添加商品到购物车（Pinia action）
const addProductToCart = async (product: any, quantity: number) => {
  try {
    await cartStore.addProduct({
      productId: product.id,
      quantity,
      specification: '',
    })
    ElMessage.success('商品已加入购物车')
  } catch (error) {
    ElMessage.error('添加到购物车失败')
    console.error('添加到购物车失败:', error)
  }
}

// 获取购物车中商品数量
const getCartQuantity = (productId: number) => {
  const product = cartProducts.value.find((p: any) => p.productId === productId)
  return product ? product.quantity : 0
}

// 获取总价
const getTotalPrice = () => {
  if (!selectedProduct.value) return 0

  let basePrice = selectedProduct.value.price
  if (selectedProduct.value.specs && selectedProduct.value.specs.length > 0 && selectedSpec.value) {
    const spec = selectedProduct.value.specs.find((s: any) => s.id === selectedSpec.value)
    if (spec) basePrice = spec.price
  }

  return (basePrice * selectedQuantity.value).toFixed(2)
}

// 显示购物车数量
const showCartQuantity = (productId: number) => {
  const quantity = getCartQuantity(productId)
  ElMessage.info(`购物车中已有 ${quantity} 份`)
}

// 更新购物车数量
const updateCartCount = () => {
  // 计算购物车商品总数
  cartItemCount.value = cartProducts.value.reduce((total: number, product: any) => {
    return total + product.quantity
  }, 0)
}

// 返回
const goBack = () => {
  router.push('/takeout/merchants')
}

// 组件挂载时执行
onMounted(() => {
  loadMerchantInfo()
  loadProducts()
  updateCartCount()
})

// 监听购物车变化
watchEffect(() => {
  updateCartCount()
})
</script>

<style scoped>
.menu-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 页面头部 */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.merchant-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.merchant-info p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.cart-button {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
}

/* 商家详情卡片 */
.merchant-detail-card {
  margin-bottom: 20px;
}

.merchant-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.merchant-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item .label {
  color: #666;
  font-size: 14px;
}

.stat-item .value {
  color: #333;
  font-weight: bold;
}

/* 分类导航 */
.category-nav {
  margin-bottom: 20px;
}

.menu-content {
  padding: 20px 0;
}

/* 菜品网格 */
.menu-grid {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 产品图片 */
.product-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.badge.recommended {
  background: #ff6b6b;
}

.badge.spicy {
  background: #ff9500;
}

.badge.vegetarian {
  background: #5cb85c;
}

/* 产品信息 */
.product-info {
  padding: 12px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.product-desc {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.sales-info {
  font-size: 12px;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.quantity-btn {
  background: #f5f7fa;
  border-color: #dcdfe6;
  color: #606266;
}

/* 产品详情对话框 */
.product-detail {
  padding: 20px 0;
}

.detail-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-info h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}

.detail-desc {
  color: #666;
  margin-bottom: 15px;
}

.detail-stats {
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
}

.detail-original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.detail-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.spec-selection,
.quantity-selection {
  margin-bottom: 20px;
}

.spec-selection h4,
.quantity-selection h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .menu-container {
    padding: 10px;
  }

  .menu-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .merchant-stats {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }

  .stat-item {
    flex: 1;
    min-width: 120px;
  }
}
</style>
