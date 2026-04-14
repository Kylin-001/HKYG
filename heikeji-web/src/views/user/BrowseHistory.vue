<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Clock, Delete, ShoppingCart, View,
  TrendCharts, Calendar, Filter, Search, Close
} from '@element-plus/icons-vue'

const router = useRouter()

// 浏览历史数据
interface BrowseItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  originalPrice?: number
  category: string
  browseTime: string
  browseDate: string
  isNew?: boolean
}

const browseHistory = ref<BrowseItem[]>([
  {
    id: 1,
    productId: 101,
    productName: 'Apple AirPods Pro 2代',
    productImage: 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=AirPods',
    price: 1899,
    originalPrice: 1999,
    category: '数码电子',
    browseTime: '10:30',
    browseDate: '今天',
    isNew: true
  },
  {
    id: 2,
    productId: 102,
    productName: '小米手环 8 Pro',
    productImage: 'https://via.placeholder.com/200x200/10b981/ffffff?text=手环',
    price: 399,
    category: '智能穿戴',
    browseTime: '09:15',
    browseDate: '今天',
    isNew: true
  },
  {
    id: 3,
    productId: 103,
    productName: '罗技 MX Master 3S',
    productImage: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=鼠标',
    price: 699,
    originalPrice: 799,
    category: '电脑配件',
    browseTime: '18:45',
    browseDate: '昨天'
  },
  {
    id: 4,
    productId: 104,
    productName: 'Keychron K2 机械键盘',
    productImage: 'https://via.placeholder.com/200x200/ec4899/ffffff?text=键盘',
    price: 568,
    category: '电脑配件',
    browseTime: '14:20',
    browseDate: '昨天'
  },
  {
    id: 5,
    productId: 105,
    productName: '小米空气净化器 4 Pro',
    productImage: 'https://via.placeholder.com/200x200/06b6d4/ffffff?text=净化器',
    price: 1299,
    originalPrice: 1499,
    category: '家用电器',
    browseTime: '11:00',
    browseDate: '3天前'
  },
  {
    id: 6,
    productId: 106,
    productName: 'Sony WH-1000XM5',
    productImage: 'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=耳机',
    price: 2499,
    category: '数码电子',
    browseTime: '20:30',
    browseDate: '3天前'
  }
])

// 搜索关键词
const searchKeyword = ref('')

// 筛选日期
const filterDate = ref('all')
const dateOptions = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'week', label: '最近7天' },
  { value: 'month', label: '最近30天' }
]

// 过滤后的历史记录
const filteredHistory = computed(() => {
  let result = browseHistory.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      item.productName.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    )
  }

  // 日期过滤
  if (filterDate.value !== 'all') {
    result = result.filter(item => {
      switch (filterDate.value) {
        case 'today':
          return item.browseDate === '今天'
        case 'yesterday':
          return item.browseDate === '昨天'
        case 'week':
          return ['今天', '昨天', '3天前', '4天前', '5天前', '6天前', '7天前'].includes(item.browseDate)
        case 'month':
          return !item.browseDate.includes('个月')
        default:
          return true
      }
    })
  }

  return result
})

// 按日期分组
const groupedHistory = computed(() => {
  const groups: Record<string, BrowseItem[]> = {}
  filteredHistory.value.forEach(item => {
    if (!groups[item.browseDate]) {
      groups[item.browseDate] = []
    }
    groups[item.browseDate].push(item)
  })
  return groups
})

// 统计信息
const stats = computed(() => ({
  total: browseHistory.value.length,
  today: browseHistory.value.filter(item => item.browseDate === '今天').length,
  week: browseHistory.value.filter(item =>
    ['今天', '昨天', '3天前', '4天前', '5天前', '6天前', '7天前'].includes(item.browseDate)
  ).length
}))

// 删除单条记录
const deleteItem = (item: BrowseItem) => {
  ElMessageBox.confirm(
    '确定要删除这条浏览记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = browseHistory.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      browseHistory.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  })
}

// 清空历史
const clearAllHistory = () => {
  ElMessageBox.confirm(
    '确定要清空所有浏览记录吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    browseHistory.value = []
    ElMessage.success('浏览记录已清空')
  })
}

// 添加到购物车
const addToCart = (item: BrowseItem) => {
  ElMessage.success(`已将 ${item.productName} 添加到购物车`)
}

// 查看商品详情
const viewProduct = (item: BrowseItem) => {
  router.push(`/products/${item.productId}`)
}

// 格式化价格
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// 从本地存储加载浏览历史
onMounted(() => {
  const saved = localStorage.getItem('browseHistory')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        browseHistory.value = parsed
      }
    } catch (e) {
      console.error('加载浏览历史失败:', e)
    }
  }
})
</script>

<template>
  <div class="browse-history-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </button>
          <div class="header-text">
            <h1>浏览历史</h1>
            <p>共 {{ stats.total }} 条记录，今日浏览 {{ stats.today }} 件商品</p>
          </div>
        </div>
        <button
          v-if="browseHistory.length > 0"
          class="clear-btn"
          @click="clearAllHistory"
        >
          <el-icon><Delete /></el-icon>
          清空历史
        </button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon blue">
            <el-icon><View /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总浏览</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.today }}</div>
            <div class="stat-label">今日浏览</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.week }}</div>
            <div class="stat-label">本周浏览</div>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索商品名称..."
            class="search-input"
          />
          <el-icon
            v-if="searchKeyword"
            class="clear-icon"
            @click="searchKeyword = ''"
          >
            <Close />
          </el-icon>
        </div>
        <div class="filter-options">
          <el-select v-model="filterDate" placeholder="时间筛选">
            <el-option
              v-for="option in dateOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 浏览历史列表 -->
      <div v-if="filteredHistory.length > 0" class="history-content">
        <div
          v-for="(items, date) in groupedHistory"
          :key="date"
          class="history-group"
        >
          <div class="group-header">
            <el-icon><Clock /></el-icon>
            <span>{{ date }}</span>
            <span class="group-count">{{ items.length }} 件商品</span>
          </div>

          <div class="product-grid">
            <div
              v-for="item in items"
              :key="item.id"
              class="product-card"
              @click="viewProduct(item)"
            >
              <div v-if="item.isNew" class="new-badge">NEW</div>
              <div class="product-image">
                <img :src="item.productImage" :alt="item.productName" width="280" height="200" loading="lazy" />
              </div>
              <div class="product-info">
                <div class="product-category">{{ item.category }}</div>
                <h3 class="product-name">{{ item.productName }}</h3>
                <div class="product-price">
                  <span class="current-price">¥{{ formatPrice(item.price) }}</span>
                  <span v-if="item.originalPrice" class="original-price">
                    ¥{{ formatPrice(item.originalPrice) }}
                  </span>
                </div>
                <div class="product-time">
                  <el-icon><Clock /></el-icon>
                  {{ item.browseTime }}
                </div>
              </div>
              <div class="product-actions">
                <button
                  class="action-btn cart"
                  @click.stop="addToCart(item)"
                >
                  <el-icon><ShoppingCart /></el-icon>
                </button>
                <button
                  class="action-btn delete"
                  @click.stop="deleteItem(item)"
                >
                  <el-icon><Delete /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <el-icon :size="64"><Clock /></el-icon>
        </div>
        <h3>暂无浏览记录</h3>
        <p>浏览过的商品会显示在这里，方便您随时找回</p>
        <button class="browse-btn" @click="router.push('/products')">
          去逛逛
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.browse-history-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: #f1f5f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #e2e8f0;
  transform: translateX(-2px);
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  background: #fef2f2;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #fee2e2;
  transform: translateY(-2px);
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: #fff;
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #fff;
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #94a3b8;
  font-size: 18px;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: #1e293b;
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-icon {
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-icon:hover {
  color: #64748b;
}

/* 历史内容 */
.history-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.history-group {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.group-header .el-icon {
  color: #3b82f6;
}

.group-count {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.new-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
  z-index: 1;
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f8fafc;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 16px;
}

.product-category {
  display: inline-block;
  padding: 4px 10px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
}

.original-price {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
}

.product-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.product-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.action-btn.cart {
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.action-btn.cart:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-btn.delete {
  color: #64748b;
  background: #f1f5f9;
}

.action-btn.delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 32px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.browse-btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .filter-bar {
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
