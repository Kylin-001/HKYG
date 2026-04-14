<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Coin, Present, ShoppingBag, TrendCharts,
  Clock, Check, Star, Ticket, Crown,
  Filter, Search, InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 用户积分
const userPoints = ref(2580)

// 积分商品数据
interface PointsProduct {
  id: number
  name: string
  image: string
  points: number
  originalPrice?: number
  category: string
  stock: number
  exchangeCount: number
  isHot?: boolean
  isNew?: boolean
}

const products = ref<PointsProduct[]>([
  {
    id: 1,
    name: '黑科易购 10元优惠券',
    image: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=10元券',
    points: 100,
    originalPrice: 10,
    category: '优惠券',
    stock: 999,
    exchangeCount: 1234,
    isHot: true
  },
  {
    id: 2,
    name: '黑科易购 50元优惠券',
    image: 'https://via.placeholder.com/200x200/ef4444/ffffff?text=50元券',
    points: 450,
    originalPrice: 50,
    category: '优惠券',
    stock: 500,
    exchangeCount: 567,
    isHot: true
  },
  {
    id: 3,
    name: '小米充电宝 20000mAh',
    image: 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=充电宝',
    points: 2800,
    originalPrice: 129,
    category: '数码配件',
    stock: 50,
    exchangeCount: 89,
    isNew: true
  },
  {
    id: 4,
    name: '罗技无线鼠标',
    image: 'https://via.placeholder.com/200x200/10b981/ffffff?text=鼠标',
    points: 1500,
    originalPrice: 79,
    category: '电脑配件',
    stock: 30,
    exchangeCount: 234
  },
  {
    id: 5,
    name: '黑科定制笔记本',
    image: 'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=笔记本',
    points: 300,
    originalPrice: 15,
    category: '文创周边',
    stock: 200,
    exchangeCount: 456,
    isNew: true
  },
  {
    id: 6,
    name: '黑科定制帆布袋',
    image: 'https://via.placeholder.com/200x200/ec4899/ffffff?text=帆布袋',
    points: 500,
    originalPrice: 25,
    category: '文创周边',
    stock: 100,
    exchangeCount: 321
  },
  {
    id: 7,
    name: '蓝牙音箱 mini',
    image: 'https://via.placeholder.com/200x200/06b6d4/ffffff?text=音箱',
    points: 1200,
    originalPrice: 59,
    category: '数码配件',
    stock: 20,
    exchangeCount: 178
  },
  {
    id: 8,
    name: '黑科易购 100元优惠券',
    image: 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=100元券',
    points: 850,
    originalPrice: 100,
    category: '优惠券',
    stock: 200,
    exchangeCount: 234,
    isHot: true
  }
])

// 分类筛选
const categories = ['全部', '优惠券', '数码配件', '电脑配件', '文创周边']
const activeCategory = ref('全部')

// 搜索关键词
const searchKeyword = ref('')

// 排序方式
const sortBy = ref('hot') // hot, points-asc, points-desc, new
const sortOptions = [
  { value: 'hot', label: '最热兑换' },
  { value: 'points-asc', label: '积分从低到高' },
  { value: 'points-desc', label: '积分从高到低' },
  { value: 'new', label: '最新上架' }
]

// 过滤后的商品
const filteredProducts = computed(() => {
  let result = products.value

  // 分类筛选
  if (activeCategory.value !== '全部') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(keyword))
  }

  // 排序
  switch (sortBy.value) {
    case 'hot':
      result = [...result].sort((a, b) => b.exchangeCount - a.exchangeCount)
      break
    case 'points-asc':
      result = [...result].sort((a, b) => a.points - b.points)
      break
    case 'points-desc':
      result = [...result].sort((a, b) => b.points - a.points)
      break
    case 'new':
      result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
  }

  return result
})

// 兑换记录
const exchangeHistory = ref([
  { id: 1, productName: '黑科易购 10元优惠券', points: 100, date: '2024-01-15', status: '已使用' },
  { id: 2, productName: '黑科定制笔记本', points: 300, date: '2024-01-10', status: '已发货' },
  { id: 3, productName: '黑科易购 50元优惠券', points: 450, date: '2024-01-05', status: '已使用' }
])

// 兑换商品
const exchangeProduct = (product: PointsProduct) => {
  if (userPoints.value < product.points) {
    ElMessage.warning('积分不足，无法兑换')
    return
  }

  if (product.stock <= 0) {
    ElMessage.warning('该商品已兑完')
    return
  }

  ElMessageBox.confirm(
    `确定要使用 ${product.points} 积分兑换 ${product.name} 吗？`,
    '确认兑换',
    {
      confirmButtonText: '确认兑换',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 扣除积分
    userPoints.value -= product.points
    // 减少库存
    product.stock--
    product.exchangeCount++
    // 添加到兑换记录
    exchangeHistory.value.unshift({
      id: Date.now(),
      productName: product.name,
      points: product.points,
      date: new Date().toISOString().split('T')[0],
      status: '待发货'
    })
    ElMessage.success('兑换成功！')
  })
}

// 积分规则说明
const showRules = () => {
  ElMessageBox.alert(
    `<div style="line-height: 1.8;">
      <h4 style="margin: 0 0 12px 0; color: #1e293b;">积分获取规则</h4>
      <p>1. 每日签到：+10积分</p>
      <p>2. 购物消费：每消费1元 +1积分</p>
      <p>3. 评价商品：+20积分</p>
      <p>4. 分享商品：+5积分（每日上限50）</p>
      <p>5. 完善资料：+50积分（一次性）</p>
      <br>
      <h4 style="margin: 0 0 12px 0; color: #1e293b;">积分使用规则</h4>
      <p>1. 积分可用于兑换积分商城商品</p>
      <p>2. 积分可抵扣订单金额（100积分=1元）</p>
      <p>3. 积分有效期为获得之日起2年</p>
      <p>4. 退换货将扣除相应积分</p>
    </div>`,
    '积分规则',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '我知道了'
    }
  )
}

// 从本地存储加载积分
onMounted(() => {
  const savedPoints = localStorage.getItem('userPoints')
  if (savedPoints) {
    userPoints.value = parseInt(savedPoints)
  }
})
</script>

<template>
  <div class="points-mall-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </button>
          <div class="header-text">
            <h1>积分商城</h1>
            <p>积分当钱花，好礼兑不停</p>
          </div>
        </div>
        <button class="rules-btn" @click="showRules">
          <el-icon><InfoFilled /></el-icon>
          积分规则
        </button>
      </div>

      <!-- 积分卡片 -->
      <div class="points-card">
        <div class="points-display">
          <div class="points-icon">
            <el-icon :size="40"><Coin /></el-icon>
          </div>
          <div class="points-info">
            <div class="points-label">我的积分</div>
            <div class="points-value">{{ userPoints }}</div>
          </div>
        </div>
        <div class="points-actions">
          <div class="action-item">
            <el-icon><TrendCharts /></el-icon>
            <span>今日 +50</span>
          </div>
          <div class="action-item">
            <el-icon><Clock /></el-icon>
            <span>兑换记录</span>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-section">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            class="tab-btn"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- 搜索和排序 -->
        <div class="filter-bar">
          <div class="search-box">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索商品..."
              class="search-input"
            />
          </div>
          <el-select v-model="sortBy" class="sort-select">
            <el-option
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-if="filteredProducts.length > 0" class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          :class="{ 'can-exchange': userPoints >= product.points && product.stock > 0 }"
        >
          <!-- 标签 -->
          <div class="product-badges">
            <span v-if="product.isHot" class="badge hot">
              <el-icon><Fire /></el-icon>
              热门
            </span>
            <span v-if="product.isNew" class="badge new">NEW</span>
          </div>

          <!-- 商品图片 -->
          <div class="product-image">
            <img :src="product.image" :alt="product.name" width="260" height="180" loading="lazy" />
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span class="points">{{ product.points }}</span>
              <span class="unit">积分</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
            </div>
            <div class="product-stats">
              <span>已兑 {{ product.exchangeCount }}</span>
              <span>剩余 {{ product.stock }}</span>
            </div>
          </div>

          <!-- 兑换按钮 -->
          <button
            class="exchange-btn"
            :class="{
              'can-exchange': userPoints >= product.points && product.stock > 0,
              'cannot-exchange': userPoints < product.points || product.stock <= 0
            }"
            :disabled="userPoints < product.points || product.stock <= 0"
            @click="exchangeProduct(product)"
          >
            <template v-if="product.stock <= 0">
              已兑完
            </template>
            <template v-else-if="userPoints < product.points">
              积分不足
            </template>
            <template v-else>
              <el-icon><Present /></el-icon>
              立即兑换
            </template>
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <el-icon :size="64"><Present /></el-icon>
        </div>
        <h3>暂无商品</h3>
        <p>敬请期待更多积分好礼</p>
      </div>

      <!-- 兑换记录 -->
      <div v-if="exchangeHistory.length > 0" class="history-section">
        <h2 class="section-title">
          <el-icon><Clock /></el-icon>
          兑换记录
        </h2>
        <div class="history-list">
          <div
            v-for="item in exchangeHistory"
            :key="item.id"
            class="history-item"
          >
            <div class="history-info">
              <div class="history-name">{{ item.productName }}</div>
              <div class="history-date">{{ item.date }}</div>
            </div>
            <div class="history-points">-{{ item.points }} 积分</div>
            <div class="history-status" :class="item.status">
              {{ item.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.points-mall-page {
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

.rules-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.rules-btn:hover {
  background: #dbeafe;
}

/* 积分卡片 */
.points-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
  color: #fff;
}

.points-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.points-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.points-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.points-actions {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: #fff;
  border-color: #e2e8f0;
}

.tab-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.filter-bar {
  display: flex;
  gap: 16px;
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
}

.search-icon {
  color: #94a3b8;
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

.sort-select {
  width: 150px;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.product-card.can-exchange {
  border-color: #3b82f6;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 1;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge.hot {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: #fff;
}

.badge.new {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #fff;
}

.product-image {
  position: relative;
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
  padding: 20px;
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
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.product-price .points {
  font-size: 24px;
  font-weight: 800;
  color: #ef4444;
}

.product-price .unit {
  font-size: 13px;
  color: #64748b;
}

.product-price .original-price {
  margin-left: 8px;
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
}

.product-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.exchange-btn {
  width: 100%;
  padding: 14px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.exchange-btn.can-exchange {
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.exchange-btn.can-exchange:hover {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.exchange-btn.cannot-exchange {
  color: #94a3b8;
  background: #f1f5f9;
  cursor: not-allowed;
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
  margin-bottom: 40px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 32px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
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
  margin: 0;
}

/* 兑换记录 */
.history-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.section-title .el-icon {
  color: #3b82f6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s;
}

.history-item:hover {
  background: #f1f5f9;
}

.history-info {
  flex: 1;
}

.history-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.history-date {
  font-size: 12px;
  color: #94a3b8;
}

.history-points {
  font-size: 14px;
  font-weight: 700;
  color: #ef4444;
  margin-right: 16px;
}

.history-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.history-status.待发货 {
  background: #fef3c7;
  color: #f59e0b;
}

.history-status.已发货 {
  background: #dbeafe;
  color: #3b82f6;
}

.history-status.已使用 {
  background: #d1fae5;
  color: #10b981;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .points-card {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-bar {
    flex-direction: column;
  }
}
</style>
