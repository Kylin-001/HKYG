<template>
  <div class="product-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">商品列表</div>
        <div class="search-button" @click="goToSearch">
          <i class="el-icon-search"></i>
          <span>搜索</span>
        </div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <div
          v-for="(tab, index) in filterTabs"
          :key="index"
          class="filter-tab"
          :class="{ active: currentTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 排序选项 -->
      <div class="sort-options">
        <div
          v-for="(option, index) in sortOptions"
          :key="index"
          class="sort-item"
          :class="{ active: currentSort === option.value }"
          @click="handleSort(option.value)"
        >
          <span>{{ option.label }}</span>
          <i v-if="option.value === currentSort" class="el-icon-caret-top sort-icon"></i>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-loading-spinner></el-loading-spinner>
      <span>正在加载...</span>
    </div>

    <!-- 商品列表 -->
    <div v-else-if="products.length > 0" class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <div class="product-image">
          <img
            :src="product.mainImage || '/static/images/default-product.png'"
            :alt="product.name"
          />
        </div>
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}</div>
          <div class="product-sales">已售 {{ product.salesCount || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- 无商品状态 -->
    <div v-else class="no-products">
      <img src="/static/images/no-products.png" alt="暂无商品" />
      <p>暂无商品</p>
    </div>

    <!-- 分页 -->
    <div v-if="products.length > 0" class="pagination-container">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>

    <!-- 浮动购物车按钮 -->
    <div class="cart-button" @click="goToCart">
      <i class="el-icon-shopping-cart-full"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 定义类型
interface Product {
  id: number
  name: string
  price: string
  salesCount: number
  mainImage: string
}

interface FilterTab {
  label: string
  value: string
}

interface SortOption {
  label: string
  value: string
}

// 初始化路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const products = ref<Product[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const currentSort = ref('default') // default, sales, price_asc, price_desc
const currentTab = ref('all') // all, new, hot

const filterTabs: FilterTab[] = [
  { label: '全部', value: 'all' },
  { label: '新品', value: 'new' },
  { label: '热销', value: 'hot' },
]

const sortOptions: SortOption[] = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price_asc' },
]

// 加载商品列表
const loadProducts = () => {
  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    const mockProducts: Product[] = []
    const startIndex = (currentPage.value - 1) * pageSize.value

    // 生成模拟数据
    for (let i = 0; i < pageSize.value; i++) {
      const id = startIndex + i + 1
      mockProducts.push({
        id,
        name: `高品质数码商品 ${id} - 最新科技产品，品质保证`,
        price: (Math.random() * 1500 + 100).toFixed(2),
        salesCount: Math.floor(Math.random() * 2000),
        mainImage: `https://picsum.photos/id/${id % 100}/300/300`,
      })
    }

    products.value = mockProducts
    totalCount.value = 120 // 模拟总数据量
    loading.value = false
  }, 800)
}

// 切换标签
const switchTab = (tab: string) => {
  currentTab.value = tab
  currentPage.value = 1
  loadProducts()
}

// 处理排序
const handleSort = (sortType: string) => {
  if (sortType === 'price_asc' && currentSort.value === 'price_asc') {
    currentSort.value = 'price_desc'
  } else {
    currentSort.value = sortType
  }
  loadProducts()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProducts()
}

// 跳转到商品详情
const goToDetail = (productId: number) => {
  router.push(`/app/product/detail/${productId}`)
}

// 跳转到搜索页面
const goToSearch = () => {
  router.push('/app/product/search')
}

// 跳转到购物车
const goToCart = () => {
  router.push('/cart')
}

// 页面挂载时加载商品列表
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.search-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #e0e0e0;
}

.search-button i {
  margin-right: 6px;
  color: #666;
}

.search-button span {
  font-size: 14px;
  color: #666;
}

/* 筛选区域 */
.filter-section {
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.filter-tabs {
  display: flex;
  margin-bottom: 12px;
  overflow-x: auto;
}

.filter-tab {
  padding: 8px 16px;
  margin-right: 12px;
  font-size: 14px;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.filter-tab:hover {
  background-color: #e8e8e8;
}

.filter-tab.active {
  background-color: #409eff;
  color: #fff;
}

.sort-options {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.sort-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.sort-item:hover {
  color: #409eff;
}

.sort-item.active {
  color: #409eff;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-container span {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

/* 商品列表 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 0 16px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 12px;
}

.product-name {
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

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 4px;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

/* 无商品状态 */
.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.no-products img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-products p {
  font-size: 14px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 浮动购物车按钮 */
.cart-button {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 1000;
}

.cart-button:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
}
</style>
