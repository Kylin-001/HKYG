<template>
  <div class="takeaway-container">
    <!-- 顶部导航栏 -->
    <div class="takeaway-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商家或商品"
        prefix-icon="Search"
        class="search-input"
      ></el-input>
      <el-button type="primary" :icon="MapLocation">
        {{ currentLocation }}
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </div>

    <!-- 商家列表 -->
    <div class="merchant-list">
      <div class="section-title">
        <h2>推荐商家</h2>
        <el-button type="text" size="small">查看更多</el-button>
      </div>
      <div class="merchant-grid">
        <div
          v-for="merchant in merchantList"
          :key="merchant.id"
          class="merchant-card"
          @click="goToMerchantDetail(merchant.id)"
        >
          <div class="merchant-image">
            <img :src="merchant.logo" :alt="merchant.name" />
          </div>
          <div class="merchant-info">
            <h3 class="merchant-name">{{ merchant.name }}</h3>
            <div class="merchant-rating">
              <i class="el-icon-StarFilled"></i>
              <span>{{ merchant.rating }}</span>
            </div>
            <div class="merchant-delivery">
              <span>{{ merchant.deliveryTime }}分钟送达</span>
              <span>¥{{ merchant.minOrderAmount }}起送</span>
              <span>配送费¥{{ merchant.deliveryFee }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="section-title">
        <h2>商家分类</h2>
      </div>
      <div class="category-list">
        <el-tag
          v-for="category in categoryList"
          :key="category.id"
          :type="selectedCategory === category.id ? 'primary' : 'default'"
          @click="selectCategory(category.id)"
          class="category-tag"
        >
          {{ category.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, MapLocation, StarFilled } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 响应式状态
const searchKeyword = ref('')
const currentLocation = ref('黑龙江科技大学西区')
const selectedCategory = ref('')
const merchantList = ref<any[]>([])
const categoryList = ref<any[]>([])
const loading = ref(false)

// 商家接口定义
interface Merchant {
  id: number
  name: string
  logo: string
  rating: number
  deliveryTime: number
  minOrderAmount: number
  deliveryFee: number
}

// 分类接口定义
interface Category {
  id: number
  name: string
}

// 加载商家列表
const loadMerchants = () => {
  loading.value = true
  // 模拟数据，实际应该调用API
  setTimeout(() => {
    merchantList.value = [
      {
        id: 1,
        name: '校园美食城',
        logo: 'https://via.placeholder.com/200',
        rating: 4.8,
        deliveryTime: 30,
        minOrderAmount: 20,
        deliveryFee: 5,
      },
      {
        id: 2,
        name: '快乐炸鸡',
        logo: 'https://via.placeholder.com/200',
        rating: 4.6,
        deliveryTime: 25,
        minOrderAmount: 15,
        deliveryFee: 4,
      },
      {
        id: 3,
        name: '味美寿司',
        logo: 'https://via.placeholder.com/200',
        rating: 4.9,
        deliveryTime: 35,
        minOrderAmount: 25,
        deliveryFee: 6,
      },
      {
        id: 4,
        name: '麻辣烫小店',
        logo: 'https://via.placeholder.com/200',
        rating: 4.7,
        deliveryTime: 28,
        minOrderAmount: 18,
        deliveryFee: 5,
      },
    ]
    loading.value = false
  }, 500)
}

// 加载分类列表
const loadCategories = () => {
  // 模拟数据，实际应该调用API
  categoryList.value = [
    { id: 1, name: '快餐便当' },
    { id: 2, name: '汉堡披萨' },
    { id: 3, name: '面食小吃' },
    { id: 4, name: '甜点饮品' },
    { id: 5, name: '生鲜果蔬' },
  ]
}

// 选择分类
const selectCategory = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? '' : categoryId
  // 根据分类筛选商家
  loadMerchants()
}

// 前往商家详情
const goToMerchantDetail = (merchantId: number) => {
  router.push(`/takeaway/merchant/${merchantId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadMerchants()
  loadCategories()
})
</script>

<style scoped>
.takeaway-container {
  padding-bottom: 60px;
}

.takeaway-header {
  padding: 15px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-input {
  width: 200px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.section-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.merchant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  padding: 0 15px;
}

.merchant-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.merchant-card:hover {
  transform: translateY(-2px);
}

.merchant-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.merchant-info {
  padding: 12px;
}

.merchant-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.merchant-rating {
  color: #ff6b00;
  margin-bottom: 8px;
}

.merchant-delivery {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 15px 15px;
}

.category-tag {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
