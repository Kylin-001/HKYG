<template>
  <div class="secondhand-list-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon><Shop /></el-icon>
            二手市场
          </h1>
          <p class="page-subtitle">校园闲置好物，循环利用更环保</p>
        </div>
        <div class="header-actions">
          <router-link to="/secondhand/publish" class="publish-btn">
            <el-icon><Plus /></el-icon>
            发布闲置
          </router-link>
        </div>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="search-filter-bar glass-effect rounded-2xl p-4 mb-6">
        <div class="search-row">
          <div class="search-input-wrapper flex-1">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索二手商品..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">
              <el-icon><Close /></el-icon>
            </button>
          </div>
          <button class="filter-toggle-btn" :class="{ active: showFilters }" @click="showFilters = !showFilters">
            <el-icon><Filter /></el-icon>
            筛选
            <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
          </button>
        </div>

        <transition name="expand">
          <div v-show="showFilters" class="filter-panel mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="filter-row">
              <div class="filter-item">
                <label class="filter-label">分类</label>
                <div class="filter-options">
                  <button
                    v-for="cat in categories"
                    :key="cat.value"
                    class="filter-chip"
                    :class="{ active: selectedCategory === cat.value }"
                    @click="selectedCategory = cat.value"
                  >
                    {{ cat.label }}
                  </button>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">成色</label>
                <div class="filter-options">
                  <button
                    v-for="cond in conditions"
                    :key="cond.value"
                    class="filter-chip"
                    :class="{ active: selectedCondition === cond.value }"
                    @click="selectedCondition = cond.value"
                  >
                    {{ cond.label }}
                  </button>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">价格区间</label>
                <div class="price-range-inputs">
                  <input v-model.number="priceMin" type="number" placeholder="最低价" class="price-input" />
                  <span class="price-separator">-</span>
                  <input v-model.number="priceMax" type="number" placeholder="最高价" class="price-input" />
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">排序</label>
                <div class="sort-options">
                  <button
                    v-for="sort in sortOptions"
                    :key="sort.value"
                    class="sort-chip"
                    :class="{ active: sortBy === sort.value }"
                    @click="sortBy = sort.value"
                  >
                    {{ sort.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="filter-actions">
              <button class="reset-btn" @click="resetFilters">重置</button>
              <button class="apply-btn" @click="applyFilters">应用筛选</button>
            </div>
          </div>
        </transition>
      </div>

      <div class="content-layout">
        <aside class="category-sidebar hidden lg:block">
          <div class="sidebar-card glass-effect rounded-2xl p-4 sticky top-24">
            <h3 class="sidebar-title">商品分类</h3>
            <nav class="category-nav">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="category-item"
                :class="{ active: selectedCategory === cat.value }"
                @click="selectCategory(cat.value)"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-label">{{ cat.label }}</span>
                <span class="cat-count">{{ cat.count }}</span>
              </button>
            </nav>
          </div>

          <div class="sidebar-card glass-effect rounded-2xl p-4 mt-4">
            <h3 class="sidebar-title">快速筛选</h3>
            <div class="quick-filters">
              <label class="checkbox-item">
                <input v-model="onlyNegotiable" type="checkbox" />
                <span>仅可议价</span>
              </label>
              <label class="checkbox-item">
                <input v-model="onlyWithImages" type="checkbox" />
                <span>有图商品</span>
              </label>
              <label class="checkbox-item">
                <input v-model="onlyNearby" type="checkbox" />
                <span>附近商品</span>
              </label>
            </div>
          </div>
        </aside>

        <main class="items-main">
          <div class="toolbar">
            <div class="view-toggle">
              <button
                class="view-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <el-icon><Grid /></el-icon>
              </button>
              <button
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <el-icon><List /></el-icon>
              </button>
            </div>
            <div class="result-count">
              共 <strong>{{ filteredItems.length }}</strong> 件商品
            </div>
          </div>

          <div v-if="secondhandStore.loading" class="items-grid grid-view">
            <Skeleton v-for="i in 8" :key="i" type="card" />
          </div>

          <div v-else-if="filteredItems.length === 0" class="empty-state glass-effect rounded-2xl p-12 text-center">
            <el-icon class="empty-icon"><Box /></el-icon>
            <h3 class="empty-title">暂无相关商品</h3>
            <p class="empty-desc">试试调整筛选条件或发布你的闲置物品吧</p>
            <router-link to="/secondhand/publish" class="empty-action">
              发布闲置
            </router-link>
          </div>

          <div v-else class="items-grid" :class="viewMode + '-view'">
            <article
              v-for="item in filteredItems"
              :key="item.id"
              class="item-card glass-effect"
              @click="$router.push(`/secondhand/${item.id}`)"
            >
              <div class="item-image-wrapper">
                <img :src="item.images[0]" :alt="item.title" class="item-image" loading="lazy" />
                <span v-if="item.condition !== 'brand_new'" class="condition-badge" :class="item.condition">
                  {{ getConditionLabel(item.condition) }}
                </span>
                <span v-if="item.isNegotiable" class="negotiable-badge">可议价</span>
                <button class="favorite-btn" @click.stop="toggleFavorite(item.id)">
                  <el-icon :class="{ 'is-favorite': item.isFavorite ?? false }"><StarFilled v-if="item.isFavorite ?? false" /><Star v-else /></el-icon>
                </button>
              </div>
              <div class="item-info">
                <h3 class="item-title">{{ item.title }}</h3>
                <p class="item-desc">{{ item.description }}</p>
                <div class="item-meta">
                  <span class="item-price">
                    <span class="price-symbol">¥</span>{{ item.price }}
                    <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
                  </span>
                </div>
                <div class="item-footer">
                  <span class="item-location">
                    <el-icon><Location /></el-icon>
                    {{ item.location }}
                  </span>
                  <span class="item-time">{{ formatTime(item.publishedAt || item.publishTime || '') }}</span>
                </div>
              </div>
            </article>
          </div>

          <div v-if="filteredItems.length > 0 && !loading" class="load-more-section">
            <button v-if="hasMore" class="load-more-btn" :class="{ loading: loadingMore }" @click="loadMore">
              <template v-if="!loadingMore">加载更多</template>
              <template v-else><el-icon class="is-loading"><Loading /></el-icon> 加载中...</template>
            </button>
            <p v-else class="no-more-text">—— 已经到底啦 ——</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Shop, Search, Close, Filter, Plus, Grid, List, Star, StarFilled, Location, Box, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSecondhandStore } from '@/stores/secondhand'

const secondhandStore = useSecondhandStore()

const searchKeyword = ref('')
const showFilters = ref(false)
const selectedCategory = ref('all')
const selectedCondition = ref('all')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const onlyNegotiable = ref(false)
const onlyWithImages = ref(false)
const onlyNearby = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)

const categories = [
  { value: 'all', label: '全部', icon: '📦', count: 128 },
  { value: 'electronics', label: '数码产品', icon: '📱', count: 35 },
  { value: 'books', label: '图书教材', icon: '📚', count: 42 },
  { value: 'sports', label: '运动户外', icon: '⚽', count: 15 },
  { value: 'daily', label: '生活用品', icon: '🏠', count: 18 },
  { value: 'clothing', label: '服饰鞋包', icon: '👕', count: 28 },
  { value: 'food', label: '食品零食', icon: '🍎', count: 12 },
  { value: 'other', label: '其他', icon: '🎁', count: 10 }
]

const conditions = [
  { value: 'all', label: '不限' },
  { value: 'brand_new', label: '全新' },
  { value: 'like_new', label: '几乎全新' },
  { value: 'good', label: '良好' },
  { value: 'fair', label: '一般' }
]

const sortOptions = [
  { value: 'newest', label: '最新发布' },
  { value: 'priceLow', label: '价格从低到高' },
  { value: 'priceHigh', label: '价格从高到低' },
  { value: 'popular', label: '最多浏览' }
]

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'all') count++
  if (selectedCondition.value !== 'all') count++
  if (priceMin.value || priceMax.value) count++
  if (onlyNegotiable.value) count++
  if (onlyWithImages.value) count++
  if (onlyNearby.value) count++
  return count
})

const filteredItems = computed(() => {
  let result = [...secondhandStore.list]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    )
  }

  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  if (selectedCondition.value !== 'all') {
    result = result.filter(item => item.condition === selectedCondition.value)
  }

  if (priceMin.value !== null) {
    result = result.filter(item => item.price >= priceMin.value!)
  }

  if (priceMax.value !== null) {
    result = result.filter(item => item.price <= priceMax.value!)
  }

  if (onlyNegotiable.value) {
    result = result.filter(item => item.isNegotiable)
  }

  if (onlyWithImages.value) {
    result = result.filter(item => item.images.length > 0)
  }

  switch (sortBy.value) {
    case 'priceLow':
      result.sort((a, b) => a.price - b.price)
      break
    case 'priceHigh':
      result.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      result.sort((a, b) => b.views - a.views)
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.publishedAt || b.publishTime).getTime() - new Date(a.publishedAt || a.publishTime).getTime())
      break
  }

  return result
})

function getConditionLabel(condition: string): string {
  const map: Record<string, string> = {
    brand_new: '全新',
    like_new: '几乎全新',
    good: '良好',
    fair: '一般'
  }
  return map[condition] || condition
}

function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}-${date.getDate()}`
}

function selectCategory(value: string) {
  selectedCategory.value = value
}

function handleSearch() {
  loadItems()
}

function resetFilters() {
  selectedCategory.value = 'all'
  selectedCondition.value = 'all'
  priceMin.value = null
  priceMax.value = null
  sortBy.value = 'newest'
  onlyNegotiable.value = false
  onlyWithImages.value = false
  onlyNearby.value = false
}

function applyFilters() {
  showFilters.value = false
}

async function toggleFavorite(id: number) {
  try {
    const item = secondhandStore.list.find(i => i.id === id)
    if (item) {
      if (item.isFavorite) {
        await secondhandStore.unlikeItem(String(id))
      } else {
        await secondhandStore.likeItem(String(id))
      }
    }
  } catch {
    ElMessage.error('操作失败')
  }
}

function loadMore() {
  loadingMore.value = true
  setTimeout(() => {
    loadingMore.value = false
    hasMore.value = false
  }, 800)
}

async function loadItems() {
  try {
    await secondhandStore.fetchList({
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      keyword: searchKeyword.value || undefined,
    })
  } catch {
    ElMessage.error('获取商品列表失败')
  }
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
.secondhand-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-subtitle {
  margin-top: 0.25rem;
  opacity: 0.85;
  font-size: 0.9rem;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.search-filter-bar {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.search-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1.125rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #374151;
}

.filter-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.filter-toggle-btn.active {
  border-color: #667eea;
  color: #667eea;
  background: #f0efff;
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 0.6875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.filter-panel {
  animation: fadeInDown 0.3s ease;
}

.filter-row {
  display: grid;
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip,
.sort-chip {
  padding: 0.375rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 0.8125rem;
  color: #6b7280;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover,
.sort-chip:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-chip.active,
.sort-chip.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.price-range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  width: 120px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.price-input:focus {
  border-color: #667eea;
}

.price-separator {
  color: #9ca3af;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.reset-btn {
  padding: 0.5rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f9fafb;
}

.apply-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.content-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
}

.sidebar-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 10px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #4b5563;
  width: 100%;
}

.category-item:hover {
  background: #f3f4f6;
}

.category-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}

.cat-icon {
  font-size: 1.125rem;
}

.cat-label {
  flex: 1;
}

.cat-count {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.quick-filters {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  accent-color: #667eea;
  width: 16px;
  height: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 10px;
}

.view-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.result-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.result-count strong {
  color: #667eea;
  font-weight: 700;
}

.items-grid {
  display: grid;
  gap: 1.25rem;
}

.items-grid.grid-view {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.items-grid.list-view {
  grid-template-columns: 1fr;
}

.item-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
}

.item-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f3f4f6;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.condition-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.condition-badge.brand_new {
  background: #10b981;
}

.condition-badge.like_new {
  background: #3b82f6;
}

.condition-badge.good {
  background: #f59e0b;
}

.condition-badge.fair {
  background: #9ca3af;
}

.negotiable-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  backdrop-filter: blur(4px);
}

.favorite-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  color: #9ca3af;
}

.favorite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-btn .is-favorite {
  color: #ef4444;
}

.item-info {
  padding: 1rem;
}

.item-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-desc {
  font-size: 0.8125rem;
  color: #9ca3af;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  margin-bottom: 0.75rem;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ef4444;
}

.price-symbol {
  font-size: 0.875rem;
  font-weight: 700;
}

.original-price {
  font-size: 0.8125rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 0.375rem;
  font-weight: 400;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
}

.item-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.empty-action {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.load-more-section {
  text-align: center;
  padding: 2rem 0;
}

.load-more-btn {
  padding: 0.75rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  color: #667eea;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover:not(.loading) {
  border-color: #667eea;
  background: #f0efff;
}

.no-more-text {
  color: #9ca3af;
  font-size: 0.875rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .category-sidebar {
    display: none;
  }

  .items-grid.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .page-title {
    font-size: 1.5rem;
    justify-content: center;
  }

  .search-row {
    flex-direction: column;
  }

  .filter-toggle-btn {
    width: 100%;
    justify-content: center;
  }

  .items-grid.grid-view {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .item-info {
    padding: 0.75rem;
  }

  .item-title {
    font-size: 0.8125rem;
  }

  .item-price {
    font-size: 1.125rem;
  }

  .filter-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
    padding: 1.5rem;
    overflow-y: auto;
    border-radius: 0;
  }

  .filter-actions {
    position: sticky;
    bottom: 0;
    background: white;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
