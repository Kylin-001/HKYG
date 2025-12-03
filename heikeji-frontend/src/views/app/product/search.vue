<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-input-container">
        <i class="el-icon-search search-icon"></i>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索商品"
          @keyup.enter="handleSearch"
          ref="searchInput"
        />
        <i v-if="searchKeyword" class="el-icon-circle-close clear-icon" @click="clearSearch"></i>
      </div>
      <div class="search-action" @click="handleSearch">搜索</div>
    </div>

    <!-- 搜索前显示搜索历史和热门搜索 -->
    <div v-if="!hasSearched" class="search-pre-content">
      <!-- 搜索历史 -->
      <div class="search-history">
        <div class="history-header">
          <span>搜索历史</span>
          <i
            v-if="searchHistory.length > 0"
            class="el-icon-delete clear-history"
            @click="clearHistory"
          ></i>
        </div>
        <div v-if="searchHistory.length > 0" class="history-tags">
          <span
            v-for="(item, index) in searchHistory"
            :key="index"
            class="history-tag"
            @click="searchByHistory(item)"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="hot-search">
        <div class="hot-header">热门搜索</div>
        <div class="hot-tags">
          <span
            v-for="(item, index) in hotKeywords"
            :key="index"
            class="hot-tag"
            :class="{ 'hot-tag-top': index < 3 }"
            @click="searchByHot(item.text)"
          >
            <span v-if="index < 3" class="hot-rank">{{ index + 1 }}</span>
            {{ item.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div v-else class="search-results">
      <!-- 搜索结果头部 -->
      <div class="result-header">
        <div class="result-info">
          <span class="search-keyword">"{{ searchKeyword }}"</span>
          <span class="result-count">找到 {{ totalCount }} 件商品</span>
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

      <!-- 搜索结果列表 -->
      <div v-else-if="products.length > 0" class="product-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-item"
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

      <!-- 无结果状态 -->
      <div v-else class="no-results">
        <img src="/static/images/no-results.png" alt="无结果" />
        <p>抱歉，没有找到相关商品</p>
        <el-button type="primary" @click="resetSearch">换个关键词试试</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchProducts, getHotSearchWords } from '@/api/app/product'

// 定义类型
interface Product {
  id: number
  name: string
  price: string
  salesCount: number
  mainImage: string
}

interface HotKeyword {
  text: string
}

interface SortOption {
  label: string
  value: string
}

// 初始化路由
const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const searchHistory = ref<string[]>([])
const hotKeywords = ref<HotKeyword[]>([])
const hasSearched = ref(false)
const loading = ref(false)
const products = ref<Product[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const currentSort = ref('default') // default, sales, price_asc, price_desc

const searchInput = ref<HTMLInputElement | null>(null)

const sortOptions: SortOption[] = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price_asc' },
]

// 执行搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  // 保存搜索历史
  saveToHistory(searchKeyword.value.trim())

  // 标记已搜索
  hasSearched.value = true
  // 重置页码
  currentPage.value = 1
  // 加载搜索结果
  loadSearchResults()
}

// 清空搜索框
const clearSearch = () => {
  searchKeyword.value = ''
  searchInput.value?.focus()
}

// 清空搜索历史
const clearHistory = () => {
  ElMessageBox.confirm('确定要清空搜索历史吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      searchHistory.value = []
      localStorage.removeItem('searchHistory')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 根据历史记录搜索
const searchByHistory = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 根据热门关键词搜索
const searchByHot = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 重置搜索
const resetSearch = () => {
  hasSearched.value = false
  searchKeyword.value = ''
  products.value = []
  totalCount.value = 0
  searchInput.value?.focus()
}

// 保存到搜索历史
const saveToHistory = (keyword: string) => {
  // 去重，如果已经存在则移到最前面
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }

  // 添加到最前面
  searchHistory.value.unshift(keyword)

  // 最多保存10条记录
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  // 保存到localStorage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 从localStorage加载搜索历史
const loadSearchHistory = () => {
  const history = localStorage.getItem('searchHistory')
  if (history) {
    try {
      searchHistory.value = JSON.parse(history)
    } catch (error) {
      console.error('加载搜索历史失败:', error)
      searchHistory.value = []
    }
  }
}

// 加载搜索结果
const loadSearchResults = async () => {
  loading.value = true

  try {
    // 准备搜索参数
    const params = {
      keyword: searchKeyword.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    }

    // 根据排序类型添加排序参数
    if (currentSort.value === 'default') {
      params.sortBy = 'score'
      params.order = 'desc'
    } else if (currentSort.value === 'sales') {
      params.sortBy = 'salesCount'
      params.order = 'desc'
    } else if (currentSort.value === 'price_asc') {
      params.sortBy = 'price'
      params.order = 'asc'
    } else if (currentSort.value === 'price_desc') {
      params.sortBy = 'price'
      params.order = 'desc'
    }

    // 调用实际的搜索API
    const response = await searchProducts(params)

    // 更新搜索结果
    products.value = response.data.list || []
    totalCount.value = response.data.total || 0
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
    products.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 处理排序
const handleSort = (sortType: string) => {
  if (sortType === 'price_asc' && currentSort.value === 'price_asc') {
    // 如果当前是升序，则切换为降序
    currentSort.value = 'price_desc'
  } else {
    currentSort.value = sortType
  }

  // 重置页码并重新加载数据
  currentPage.value = 1
  loadSearchResults()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadSearchResults()
}

// 跳转到商品详情
const goToDetail = (productId: number) => {
  router.push(`/app/product/detail/${productId}`)
}

// 跳转到购物车
const goToCart = () => {
  router.push('/cart')
}

// 加载热门搜索词
const loadHotKeywords = async () => {
  try {
    const response = await getHotSearchWords({ limit: 10 })
    hotKeywords.value = response.data.map((item: any) => ({ text: item.word }))
  } catch (error) {
    console.error('获取热门搜索词失败:', error)
    // 如果API调用失败，使用默认数据
    hotKeywords.value = [
      { text: '手机' },
      { text: '笔记本电脑' },
      { text: '耳机' },
      { text: '智能手表' },
      { text: '平板电脑' },
    ]
  }
}

// 生命周期钩子
onMounted(() => {
  // 页面加载时自动聚焦搜索框
  searchInput.value?.focus()
  // 从localStorage加载搜索历史
  loadSearchHistory()
  // 加载热门搜索词
  loadHotKeywords()
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input-container {
  flex: 1;
  position: relative;
  margin-right: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 40px 0 36px;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #409eff;
}

.clear-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  cursor: pointer;
}

.search-action {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 4px;
}

/* 搜索前内容 */
.search-pre-content {
  background-color: #fff;
  margin-top: 8px;
  padding: 16px;
}

/* 搜索历史 */
.search-history,
.hot-search {
  margin-bottom: 24px;
}

.history-header,
.hot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.clear-history {
  color: #999;
  cursor: pointer;
}

.history-tags,
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag,
.hot-tag {
  display: inline-block;
  padding: 6px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.history-tag:hover,
.hot-tag:hover {
  background-color: #e0e0e0;
  color: #333;
}

.hot-tag-top {
  position: relative;
  background-color: #fff2e8;
  color: #fa541c;
  padding-left: 20px;
}

.hot-rank {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: bold;
}

/* 搜索结果 */
.search-results {
  background-color: #fff;
  margin-top: 8px;
}

/* 结果头部 */
.result-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.result-info {
  margin-bottom: 12px;
}

.search-keyword {
  color: #333;
  font-weight: 500;
}

.result-count {
  color: #999;
  font-size: 13px;
  margin-left: 8px;
}

/* 排序选项 */
.sort-options {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.sort-item {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.sort-item.active {
  color: #409eff;
}

.sort-icon {
  position: absolute;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  font-size: 10px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.loading-container span {
  margin-top: 12px;
  font-size: 14px;
}

/* 商品列表 */
.product-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
}

.product-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background-color: #f5f5f5;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 8px;
}

.product-name {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 36px;
}

.product-price {
  font-size: 16px;
  color: #ff6b81;
  font-weight: bold;
  margin-bottom: 2px;
}

.product-sales {
  font-size: 11px;
  color: #999;
}

/* 无结果状态 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
}

.no-results img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.no-results p {
  margin-bottom: 24px;
  font-size: 14px;
}

/* 分页 */
.pagination-container {
  padding: 20px 16px;
  display: flex;
  justify-content: center;
}

/* 购物车按钮 */
.cart-button {
  position: fixed;
  bottom: 30px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ff6b81;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(255, 107, 129, 0.4);
  cursor: pointer;
  transition:
    transform 0.3s,
    background-color 0.3s;
  z-index: 99;
}

.cart-button:hover {
  transform: scale(1.1);
  background-color: #ff526b;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
