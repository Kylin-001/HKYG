<template>
  <div class="category-page">
    <!-- 顶部导航 -->
    <div class="category-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </div>
        <h1 class="page-title">商品分类</h1>
        <div class="search-btn" @click="goSearch">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 分类内容区 -->
    <div v-else class="category-content">
      <!-- 左侧一级分类导航 -->
      <div class="category-left">
        <div
          v-for="(category, index) in levelOneCategories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategoryId === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="category-name">{{ category.name }}</span>
          <span v-if="category.icon" class="category-icon" :class="category.icon"></span>
        </div>
      </div>

      <!-- 右侧二三级分类和商品展示 -->
      <div class="category-right">
        <!-- 当前分类下的二级分类 -->
        <div class="level-two-section">
          <div
            v-for="subCategory in currentSubCategories"
            :key="subCategory.id"
            class="sub-category-item"
          >
            <div class="sub-category-header" @click="toggleSubCategory(subCategory.id)">
              <h3 class="sub-category-name">{{ subCategory.name }}</h3>
              <i
                class="el-icon-arrow-right"
                :class="{ expanded: expandedSubCategories.includes(subCategory.id) }"
              ></i>
            </div>

            <!-- 三级分类 -->
            <div
              v-if="
                subCategory.children &&
                subCategory.children.length > 0 &&
                expandedSubCategories.includes(subCategory.id)
              "
              class="level-three-section"
            >
              <div
                v-for="thirdCategory in subCategory.children"
                :key="thirdCategory.id"
                class="third-category-item"
              >
                <div class="third-category-info" @click="viewCategoryProducts(thirdCategory.id)">
                  <div class="third-category-icon">
                    <img
                      v-if="thirdCategory.image"
                      :src="thirdCategory.image"
                      :alt="thirdCategory.name"
                      class="category-image"
                    />
                    <span v-else class="category-placeholder">{{
                      thirdCategory.name.charAt(0)
                    }}</span>
                  </div>
                  <span class="third-category-name">{{ thirdCategory.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门商品推荐 -->
        <div v-if="hotProducts.length > 0" class="hot-products-section">
          <h3 class="section-title">热门推荐</h3>
          <div class="hot-products-list">
            <div
              v-for="product in hotProducts"
              :key="product.id"
              class="product-card"
              @click="goToProductDetail(product.id)"
            >
              <div class="product-image">
                <img
                  :src="
                    product.mainImage ||
                    'https://via.placeholder.com/120x120/e9ecef/495057?text=商品'
                  "
                  :alt="product.name"
                  class="product-img"
                />
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">¥{{ product.price }}</div>
                <div class="product-sales">月销{{ product.sales || 0 }}件</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="currentSubCategories.length === 0 && hotProducts.length === 0"
          class="empty-state"
        >
          <el-empty description="暂无分类信息" />
        </div>
      </div>
    </div>

    <!-- 浮动购物车按钮 -->
    <div class="cart-float-btn" @click="goToCart">
      <i class="el-icon-shopping-cart-full"></i>
      <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 定义类型接口
interface Category {
  id: number
  name: string
  level: number
  icon?: string
  image?: string
  children?: Category[]
}

interface Product {
  id: number
  name: string
  price: number
  sales?: number
  mainImage?: string
}

// 响应式数据
const loading = ref(true)
const categoryTree = ref<Category[]>([])
const levelOneCategories = ref<Category[]>([])
const activeCategoryId = ref<number | null>(null)
const expandedSubCategories = ref<number[]>([])
const cartItemCount = ref(0)

const router = useRouter()

// 计算属性
const currentSubCategories = computed(() => {
  if (!activeCategoryId.value) return []

  const activeCategory = levelOneCategories.value.find(cat => cat.id === activeCategoryId.value)
  if (!activeCategory || !activeCategory.children) return []

  return activeCategory.children
})

const hotProducts = computed(() => {
  // 这里模拟数据，实际应该根据分类ID从API获取
  // 为了演示，返回一些模拟数据
  return [
    {
      id: 1,
      name: '智能手表 Pro Max',
      price: 1299,
      sales: 256,
      mainImage: 'https://via.placeholder.com/120x120/e9ecef/495057?text=智能手表',
    },
    {
      id: 2,
      name: '无线蓝牙耳机',
      price: 299,
      sales: 1432,
      mainImage: 'https://via.placeholder.com/120x120/e9ecef/495057?text=蓝牙耳机',
    },
    {
      id: 3,
      name: '移动电源 20000mAh',
      price: 129,
      sales: 892,
      mainImage: 'https://via.placeholder.com/120x120/e9ecef/495057?text=移动电源',
    },
  ]
})

// 导航方法
function goBack() {
  router.back()
}

function goSearch() {
  router.push('/app/product/search')
}

function goToCart() {
  router.push('/app/cart')
}

function goToProductDetail(productId: number) {
  router.push(`/app/product/detail/${productId}`)
}

function viewCategoryProducts(categoryId: number) {
  router.push(`/app/product/list?categoryId=${categoryId}`)
}

// 分类选择方法
function selectCategory(categoryId: number) {
  activeCategoryId.value = categoryId
  // 默认展开第一个二级分类
  const activeCategory = levelOneCategories.value.find(cat => cat.id === categoryId)
  if (activeCategory && activeCategory.children && activeCategory.children.length > 0) {
    expandedSubCategories.value = [activeCategory.children[0].id]
  } else {
    expandedSubCategories.value = []
  }
}

function toggleSubCategory(subCategoryId: number) {
  if (expandedSubCategories.value.includes(subCategoryId)) {
    expandedSubCategories.value = expandedSubCategories.value.filter(id => id !== subCategoryId)
  } else {
    expandedSubCategories.value.push(subCategoryId)
  }
}

// 数据获取方法
async function fetchCategoryData() {
  try {
    loading.value = true
    // 实际项目中应该调用API获取分类数据
    // const response = await store.dispatch('category/getCategoryTree')
    // categoryTree.value = response.data || []

    // 模拟分类数据
    categoryTree.value = getMockCategoryData()
    levelOneCategories.value = categoryTree.value.filter(cat => cat.level === 1)

    // 默认选中第一个分类
    if (levelOneCategories.value.length > 0) {
      selectCategory(levelOneCategories.value[0].id)
    }
  } catch (error) {
    console.error('获取分类数据失败:', error)
    ElMessage.error('获取分类数据失败')
  } finally {
    loading.value = false
  }
}

function fetchCartCount() {
  // 实际项目中应该从API获取购物车数量
  cartItemCount.value = 0
}

// 模拟分类数据
function getMockCategoryData() {
  return [
    {
      id: 1,
      name: '手机数码',
      level: 1,
      icon: 'el-icon-mobile-phone',
      children: [
        {
          id: 11,
          name: '手机',
          level: 2,
          children: [
            {
              id: 111,
              name: '苹果',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=苹果',
            },
            {
              id: 112,
              name: '华为',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=华为',
            },
            {
              id: 113,
              name: '小米',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=小米',
            },
          ],
        },
        {
          id: 12,
          name: '耳机音箱',
          level: 2,
          children: [
            {
              id: 121,
              name: '蓝牙耳机',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=蓝牙',
            },
            {
              id: 122,
              name: '有线耳机',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=有线',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '电脑办公',
      level: 1,
      icon: 'el-icon-laptop',
      children: [
        {
          id: 21,
          name: '笔记本',
          level: 2,
          children: [
            {
              id: 211,
              name: '游戏本',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=游戏',
            },
            {
              id: 212,
              name: '轻薄本',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=轻薄',
            },
          ],
        },
        {
          id: 22,
          name: '配件',
          level: 2,
          children: [
            {
              id: 221,
              name: '鼠标',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=鼠标',
            },
            {
              id: 222,
              name: '键盘',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=键盘',
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: '家用电器',
      level: 1,
      icon: 'el-icon-s-cooperation',
      children: [
        {
          id: 31,
          name: '空调',
          level: 2,
          children: [
            {
              id: 311,
              name: '挂机空调',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=挂机',
            },
            {
              id: 312,
              name: '柜机空调',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=柜机',
            },
          ],
        },
        {
          id: 32,
          name: '冰箱',
          level: 2,
          children: [
            {
              id: 321,
              name: '双门冰箱',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=双门',
            },
            {
              id: 322,
              name: '三门冰箱',
              level: 3,
              image: 'https://via.placeholder.com/40x40/e9ecef/495057?text=三门',
            },
          ],
        },
      ],
    },
  ]
}

// 组件挂载时初始化数据
onMounted(async () => {
  await fetchCategoryData()
  fetchCartCount()
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.category-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn,
.search-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 加载状态 */
.loading-container {
  padding: 20px;
  background-color: #fff;
}

/* 分类内容区 */
.category-content {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 10px auto;
  width: 100%;
  gap: 10px;
}

/* 左侧一级分类导航 */
.category-left {
  width: 120px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.category-item {
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.category-item.active {
  background-color: #f0f9ff;
  border-left-color: #409eff;
  font-weight: 600;
  color: #409eff;
}

.category-item:hover:not(.active) {
  background-color: #f5f5f5;
}

.category-name {
  display: block;
  font-size: 14px;
  line-height: 1.4;
}

.category-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 4px;
}

/* 右侧二三级分类和商品展示 */
.category-right {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

/* 二级分类 */
.sub-category-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.sub-category-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.sub-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.sub-category-header:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding-left: 4px;
  padding-right: 4px;
}

.sub-category-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.el-icon-arrow-right {
  transition: transform 0.3s ease;
  font-size: 14px;
  color: #999;
}

.el-icon-arrow-right.expanded {
  transform: rotate(90deg);
  color: #409eff;
}

/* 三级分类 */
.level-three-section {
  margin-top: 12px;
  padding-left: 8px;
}

.third-category-item {
  margin-bottom: 12px;
}

.third-category-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.third-category-info:hover {
  background-color: #f0f9ff;
  transform: translateX(2px);
}

.third-category-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-placeholder {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.third-category-name {
  font-size: 14px;
  color: #666;
}

/* 热门商品推荐 */
.hot-products-section {
  margin-top: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
  display: inline-block;
}

.hot-products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 120px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-info {
  padding: 8px;
  background-color: #fff;
}

.product-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
  height: 40px;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 2px;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

/* 浮动购物车按钮 */
.cart-float-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
}

.cart-float-btn:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: #f56c6c;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-content {
    flex-direction: column;
  }

  .category-left {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }

  .category-item {
    display: inline-block;
    width: 100px;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .category-item.active {
    border-left-color: transparent;
    border-bottom-color: #409eff;
  }

  .hot-products-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-card {
    font-size: 12px;
  }

  .cart-float-btn {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style>
