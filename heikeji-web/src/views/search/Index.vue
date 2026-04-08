<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <!-- 搜索栏 -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1 relative">
          <el-input
            v-model="keyword"
            size="large"
            placeholder="搜索商品、外卖、二手好物、校园服务..."
            prefix-icon="Search"
            clearable
            class="!h-12 !rounded-xl search-input"
            @keyup.enter="handleSearch"
            @clear="handleClear"
          />
        </div>
        <button
          @click="handleSearch"
          class="px-6 h-12 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all hidden sm:block search-btn"
        >
          搜索
        </button>
      </div>

      <!-- 未搜索状态：热搜 + 历史记录 -->
      <div v-if="!hasSearched" class="py-10">
        <div class="w-28 h-28 mx-auto mb-5 rounded-full flex items-center justify-center icon-bg">
          <el-icon :size="48" class="text-[#003B80] opacity-60"><Search /></el-icon>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2 text-center">发现更多精彩</h3>
        <p class="text-sm text-gray-400 mb-8 text-center">输入关键词开始搜索吧</p>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="max-w-2xl mx-auto mb-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <el-icon><Clock /></el-icon>
              搜索历史
            </p>
            <button
              @click="clearAllHistory"
              class="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              清空全部
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, index) in searchHistory"
              :key="index"
              class="history-tag group"
              @click="keyword = item.keyword; handleSearch()"
            >
              {{ item.keyword }}
              <span
                class="delete-btn"
                @click.stop="removeHistory(index)"
              >&times;</span>
            </span>
          </div>
        </div>

        <!-- 热搜榜增强 -->
        <div class="max-w-2xl mx-auto">
          <p class="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
            <el-icon><TrendCharts /></el-icon>
            热搜榜
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="hot in hotSearches"
              :key="hot.rank"
              class="hot-item cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-3 py-2.5 flex items-center gap-3"
              @click="keyword = hot.keyword; handleSearch()"
            >
              <span
                :class="['rank-badge', `rank-${hot.rank}`]"
                class="w-6 h-6 flex items-center justify-center text-xs font-bold rounded"
              >{{ hot.rank }}</span>
              <div class="flex-1 min-w-0">
                <span
                  :class="['truncate block', hot.hot ? 'font-bold text-red-500' : 'text-text-primary']"
                >
                  {{ hot.keyword }}
                  <span v-if="hot.hot" class="text-red-500 ml-1">🔥</span>
                </span>
              </div>
              <span class="text-xs text-gray-400 shrink-0">{{ formatCount(hot.count) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果区域 -->
      <template v-else>
        <!-- 分类Tab切换 -->
        <div class="mb-5 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 p-1">
          <div class="flex items-center overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.value ? 'tab-active' : 'text-gray-600 hover:text-text-primary hover:bg-gray-50'
              ]"
            >
              {{ tab.label }}
              <span v-if="tab.count !== undefined" :class="['ml-1 text-xs px-1.5 py-0.5 rounded-full', activeTab === tab.value ? 'bg-white/30' : 'bg-gray-100 text-gray-500']">
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- 结果统计 -->
        <div class="mb-5 flex items-center justify-between">
          <p class="text-sm text-gray-500">
            找到 <span class="font-semibold text-text-primary">{{ filteredResults.length }}</span> 个相关结果
            <span v-if="activeTab !== 'all'" class="ml-2">
              （共 {{ allResults.length }} 个）
            </span>
          </p>
          <div v-if="loading" class="flex items-center gap-2 text-sm text-[#003B80]">
            <el-icon class="is-loading"><Loading /></el-icon>
            搜索中...
          </div>
        </div>

        <!-- 搜索结果列表 -->
        <div v-if="filteredResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div
            v-for="item in filteredResults"
            :key="`${item.type}-${item.id}`"
            :class="['group bg-white/80 backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl result-card', typeCardClass(item.type)]"
            @click="goToItem(item)"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                :src="item.image || defaultImage(item.type)"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span :class="['absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium type-badge', typeBadge(item.type)]">
                {{ typeLabel(item.type) }}
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-medium text-sm text-text-primary line-clamp-2 group-hover:text-[#003B80] transition-colors mb-2" v-html="highlightKeyword(item.title, keyword)"></h3>
              <div class="flex items-baseline justify-between">
                <span v-if="item.price !== undefined" class="font-bold text-base" :class="item.type === 'product' || item.type === 'secondhand' ? 'text-red-500' : 'text-text-primary'">
                  {{ item.type === 'secondhand' || item.type === 'product' ? '¥' : '' }}{{ item.price }}
                </span>
                <span v-else-if="item.meta" class="text-sm text-gray-400">{{ item.meta }}</span>
                <span class="text-xs text-gray-400 truncate max-w-[80px]" v-if="item.source">{{ item.source }}</span>
              </div>
              <div v-if="item.extraInfo" class="mt-2 text-xs text-gray-400 line-clamp-1">
                {{ item.extraInfo }}
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态优化 -->
        <div v-else class="py-20 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/50">
          <el-icon :size="56" class="text-gray-300 mb-4"><Search /></el-icon>
          <p class="text-gray-500 mb-2 font-medium">没有找到相关结果</p>
          <p class="text-sm text-gray-400 mb-6">换个关键词试试吧~</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="suggest in suggestKeywords"
              :key="suggest"
              @click="keyword = suggest; handleSearch()"
              class="px-4 py-1.5 rounded-full bg-[#003B80]/10 text-[#003B80] text-sm hover:bg-[#003B80]/20 transition-colors"
            >
              {{ suggest }}
            </button>
          </div>
        </div>
      </template>

      <!-- 推荐内容 -->
      <div v-if="hasSearched && filteredResults.length > 0" class="mt-10">
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-100 p-6">
          <h3 class="font-bold text-text-primary mb-4">你可能还喜欢</h3>
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              v-for="rec in recommendations"
              :key="rec.id"
              class="shrink-0 w-44 cursor-pointer group"
              @click="$router.push(rec.path)"
            >
              <div class="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                <img
                  :src="rec.image"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p class="text-xs font-medium text-text-primary line-clamp-1 group-hover:text-[#003B80]">{{ rec.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Clock, TrendCharts, Loading } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useTakeoutStore } from '@/stores/takeout'
import { useSecondhandStore } from '@/stores/secondhand'
import { useCommunityStore } from '@/stores/community'

// ==================== 类型定义 ====================
interface SearchResult {
  id: string | number
  type: 'product' | 'takeout' | 'secondhand' | 'post' | 'activity'
  title: string
  price?: string | number
  image?: string
  source?: string
  meta?: string
  extraInfo?: string
}

interface SearchHistoryItem {
  keyword: string
  time: number
}

interface HotSearchItem {
  rank: number
  keyword: string
  hot: boolean
  count: number
}

// ==================== Store 初始化 ====================
const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const takeoutStore = useTakeoutStore()
const secondhandStore = useSecondhandStore()
const communityStore = useCommunityStore()

// ==================== 响应式状态 ====================
const keyword = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const activeTab = ref('all')
const allResults = ref<SearchResult[]>([])
const searchHistory = ref<SearchHistoryItem[]>([])

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ==================== 热搜榜数据（增强版）====================
const hotSearches: HotSearchItem[] = [
  { rank: 1, keyword: 'AirPods Pro', hot: true, count: 2847 },
  { rank: 2, keyword: '机械键盘', hot: false, count: 1923 },
  { rank: 3, keyword: '考研资料', hot: true, count: 1567 },
  { rank: 4, keyword: '麻辣烫', hot: false, count: 1342 },
  { rank: 5, keyword: '二手笔记本', hot: true, count: 1123 },
  { rank: 6, keyword: '宿舍神器', hot: false, count: 987 },
  { rank: 7, keyword: '编程书籍', hot: false, count: 856 },
  { rank: 8, keyword: '运动鞋', hot: false, count: 743 },
  { rank: 9, keyword: '校园歌手大赛', hot: true, count: 621 },
  { rank: 10, keyword: '图书馆座位', hot: false, count: 512 }
]

// 推荐搜索词（空状态时显示）
const suggestKeywords = ['AirPods', '机械键盘', '考研资料', '麻辣烫', '二手笔记本']

// 推荐内容
const recommendations = [
  { id: 1, name: '春季校园歌手大赛', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', path: '/community/activities' },
  { id: 2, name: '图书馆座位预约', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', path: '/campus/library' },
  { id: 3, name: '失物招领', image: 'https://images.unsplash.com/photo-1534353436294-0cfed4f6a45d?w=200&h=200&fit=crop', path: '/community/lostfound' },
  { id: 4, name: '成绩查询', image: 'https://images.unsplash.com/photo-1434030216411-0b79d3dd1e85?w=200&h=200&fit=crop', path: '/campus/grades' },
  { id: 5, name: '优惠券中心', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop', path: '/user/coupons' },
  { id: 6, name: '社团活动', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd616ff?w=200&h=200&fit=crop', path: '/community/activities' }
]

// ==================== 计算属性 ====================

// 分类Tab配置（带数量统计）
const tabs = computed(() => {
  const counts = {
    all: allResults.value.length,
    product: allResults.value.filter(r => r.type === 'product').length,
    takeout: allResults.value.filter(r => r.type === 'takeout').length,
    secondhand: allResults.value.filter(r => r.type === 'secondhand').length,
    post: allResults.value.filter(r => r.type === 'post').length,
    activity: allResults.value.filter(r => r.type === 'activity').length
  }

  return [
    { label: '全部', value: 'all', count: counts.all },
    { label: '商品', value: 'product', count: counts.product },
    { label: '外卖', value: 'takeout', count: counts.takeout },
    { label: '二手', value: 'secondhand', count: counts.secondhand },
    { label: '帖子', value: 'post', count: counts.post },
    { label: '活动', value: 'activity', count: counts.activity }
  ]
})

// 根据当前Tab过滤结果
const filteredResults = computed(() => {
  if (activeTab.value === 'all') {
    return allResults.value
  }
  return allResults.value.filter(item => item.type === activeTab.value)
})

// ==================== 搜索历史管理 ====================
const HISTORY_KEY = 'heikeji-search-history'
const MAX_HISTORY = 10

function loadSearchHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      searchHistory.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('加载搜索历史失败:', e)
    searchHistory.value = []
  }
}

function saveSearchHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
  } catch (e) {
    console.error('保存搜索历史失败:', e)
  }
}

function addSearchHistory(kw: string) {
  const trimmedKw = kw.trim()
  if (!trimmedKw) return

  // 去重：移除已存在的相同关键词
  searchHistory.value = searchHistory.value.filter(item => item.keyword !== trimmedKw)

  // 添加到最前面
  searchHistory.value.unshift({
    keyword: trimmedKw,
    time: Date.now()
  })

  // 限制最多10条
  if (searchHistory.value.length > MAX_HISTORY) {
    searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY)
  }

  saveSearchHistory()
}

function removeHistory(index: number) {
  searchHistory.value.splice(index, 1)
  saveSearchHistory()
}

function clearAllHistory() {
  searchHistory.value = []
  saveSearchHistory()
  ElMessage.success('搜索历史已清空')
}

// ==================== 联合搜索核心逻辑 ====================
async function handleSearch() {
  if (!keyword.value.trim()) return

  hasSearched.value = true
  loading.value = true

  // 添加到搜索历史
  addSearchHistory(keyword.value)

  try {
    // 并行执行所有搜索任务
    const results: SearchResult[] = []

    const promises = [
      // 1. 商品搜索（使用真实API）
      searchProducts(keyword.value),
      // 2. 外卖搜索（Mock或API）
      searchTakeout(keyword.value),
      // 3. 二手搜索（Mock或API）
      searchSecondhand(keyword.value),
      // 4. 社区帖子搜索（Mock或API）
      searchPosts(keyword.value),
      // 5. 活动搜索（Mock或API）
      searchActivities(keyword.value)
    ]

    const searchResultsArray = await Promise.allSettled(promises)

    // 合并所有成功的结果
    searchResultsArray.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(...result.value)
      }
    })

    allResults.value = results

  } catch (err: any) {
    console.error('搜索失败:', err)
    ElMessage.error(err.message || '搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 商品搜索
async function searchProducts(kw: string): Promise<SearchResult[]> {
  try {
    await productStore.search(kw)
    return (productStore.list || []).map((item: any) => ({
      id: item.id,
      type: 'product' as const,
      title: item.name || item.title || '',
      price: item.price ? Number(item.price).toFixed(2) : undefined,
      image: item.image || item.cover || item.img,
      source: item.category || item.brand || '',
      extraInfo: item.salesCount ? `已售${item.salesCount}件` : undefined
    }))
  } catch (err) {
    console.warn('商品搜索失败，使用Mock数据:', err)
    return []
  }
}

// 外卖搜索（Mock：从商家列表过滤）
async function searchTakeout(kw: string): Promise<SearchResult[]> {
  try {
    // 尝试使用fetchMerchants带keyword参数
    await takeoutStore.fetchMerchants({ keyword: kw })
    const merchants = takeoutStore.merchants || []

    if (merchants.length > 0) {
      return merchants.map((m: any) => ({
        id: m.id,
        type: 'takeout' as const,
        title: m.name || m.merchantName || '',
        price: m.minPrice ? `¥${m.minPrice}起` : undefined,
        image: m.logo || m.image || m.cover || '',
        source: m.category || m.cuisineType || '美食',
        meta: m.rating ? `${m.rating}分` : undefined,
        extraInfo: m.deliveryTime ? `约${m.deliveryTime}分钟送达` : undefined
      }))
    }

    // 如果没有结果，尝试从nearbyMerchants/hotMerchants过滤
    let allMerchants = [...(takeoutStore.nearbyMerchants || []), ...(takeoutStore.hotMerchants || [])]
    if (allMerchants.length === 0) {
      // 如果都没有，先获取数据再过滤
      await Promise.allSettled([
        takeoutStore.fetchNearbyMerchants(),
        takeoutStore.fetchHotMerchants()
      ])
      allMerchants = [...(takeoutStore.nearbyMerchants || []), ...(takeoutStore.hotMerchants || [])]
    }

    const filtered = allMerchants.filter((m: any) =>
      (m.name || m.merchantName || '').toLowerCase().includes(kw.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(kw.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(kw.toLowerCase())
    )

    return filtered.map((m: any) => ({
      id: m.id,
      type: 'takeout' as const,
      title: m.name || m.merchantName || '',
      price: m.minPrice ? `¥${m.minPrice}起` : undefined,
      image: m.logo || m.image || m.cover || '',
      source: m.category || m.cuisineType || '美食',
      meta: m.rating ? `${m.rating}分` : undefined
    }))
  } catch (err) {
    console.warn('外卖搜索失败:', err)
    return mockTakeoutSearch(kw)
  }
}

// 二手搜索（Mock：从列表过滤）
async function searchSecondhand(kw: string): Promise<SearchResult[]> {
  try {
    await secondhandStore.fetchList({ keyword: kw })
    const items = secondhandStore.list || []

    if (items.length > 0) {
      return items.map((item: any) => ({
        id: item.id,
        type: 'secondhand' as const,
        title: item.title || item.name || '',
        price: item.price ? Number(item.price).toFixed(2) : undefined,
        image: item.images?.[0] || item.image || item.cover || '',
        source: item.category || item.condition || '',
        meta: item.condition ? `${item.condition}成新` : undefined,
        extraInfo: item.location ? `位置: ${item.location}` : undefined
      }))
    }

    // Mock：从现有列表过滤
    return mockSecondhandSearch(kw)
  } catch (err) {
    console.warn('二手搜索失败:', err)
    return mockSecondhandSearch(kw)
  }
}

// 社区帖子搜索（Mock：从帖子列表过滤）
async function searchPosts(kw: string): Promise<SearchResult[]> {
  try {
    await communityStore.fetchPosts()
    const posts = communityStore.posts || []

    const filtered = posts.filter((p: any) =>
      (p.title || '').toLowerCase().includes(kw.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(kw.toLowerCase()) ||
      (p.tags || []).some((t: string) => t.toLowerCase().includes(kw.toLowerCase()))
    )

    return filtered.map((p: any) => ({
      id: p.id,
      type: 'post' as const,
      title: p.title || '社区帖子',
      image: p.cover || p.images?.[0] || '',
      source: p.boardName || p.author?.nickname || '社区',
      meta: p.viewCount ? `${p.viewCount}次浏览` : undefined,
      extraInfo: p.commentCount ? `${p.commentCount}条评论` : undefined
    }))
  } catch (err) {
    console.warn('帖子搜索失败:', err)
    return []
  }
}

// 活动搜索（Mock：从活动列表过滤）
async function searchActivities(kw: string): Promise<SearchResult[]> {
  try {
    await communityStore.fetchActivities()
    const activities = communityStore.activities || []

    const filtered = activities.filter((a: any) =>
      (a.title || a.name || '').toLowerCase().includes(kw.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(kw.toLowerCase()) ||
      (a.tags || []).some((t: string) => t.toLowerCase().includes(kw.toLowerCase()))
    )

    return filtered.map((a: any) => ({
      id: a.id,
      type: 'activity' as const,
      title: a.title || a.name || '校园活动',
      image: a.poster || a.cover || a.image || '',
      source: a.category || a.organizer || '活动',
      meta: a.startTime ? formatDate(a.startTime) : undefined,
      extraInfo: a.currentParticipants !== undefined
        ? `${a.currentParticipants}/${a.maxParticipants || '?'}人参与`
        : undefined
    }))
  } catch (err) {
    console.warn('活动搜索失败:', err)
    return []
  }
}

// ==================== Mock 数据函数 ====================
function mockTakeoutSearch(kw: string): SearchResult[] {
  const mockMerchants = [
    { id: 't1', name: '老乡鸡快餐', category: '快餐', rating: 4.8, minPrice: 15, deliveryTime: 25, logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop' },
    { id: 't2', name: '杨国福麻辣烫', category: '麻辣烫', rating: 4.6, minPrice: 20, deliveryTime: 30, logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5a6f8?w=300&h=200&fit=crop' },
    { id: 't3', name: '蜜雪冰城', category: '饮品', rating: 4.7, minPrice: 8, deliveryTime: 15, logo: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop' },
    { id: 't4', name: '沙县小吃', category: '小吃', rating: 4.5, minPrice: 12, deliveryTime: 20, logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' },
    { id: 't5', name: '黄焖鸡米饭', category: '米饭', rating: 4.4, minPrice: 18, deliveryTime: 25, logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop' }
  ]

  return mockMerchants
    .filter(m =>
      m.name.includes(kw) ||
      m.category.includes(kw)
    )
    .map(m => ({
      id: m.id,
      type: 'takeout' as const,
      title: m.name,
      price: `¥${m.minPrice}起`,
      image: m.logo,
      source: m.category,
      meta: `${m.rating}分`,
      extraInfo: `约${m.deliveryTime}分钟送达`
    }))
}

function mockSecondhandSearch(kw: string): SearchResult[] {
  const mockItems = [
    { id: 's1', title: 'MacBook Pro 2023款 M2芯片', price: 8500, condition: 95, category: '数码', location: '西区宿舍', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop'] },
    { id: 's2', title: 'iPad Air 5代 几乎全新', price: 3200, condition: 98, category: '数码', location: '北区宿舍', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop'] },
    { id: 's3', title: '考研数学复习全书', price: 35, condition: 80, category: '书籍', location: '图书馆', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop'] },
    { id: 's4', title: '机械键盘 Cherry轴', price: 280, condition: 90, category: '数码', location: '东区宿舍', images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&h=200&fit=crop'] },
    { id: 's5', title: 'AirPods Pro 2代', price: 1200, condition: 92, category: '数码', location: '南区宿舍', images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=200&fit=crop'] }
  ]

  return mockItems
    .filter(item =>
      item.title.includes(kw) ||
      item.category.includes(kw)
    )
    .map(item => ({
      id: item.id,
      type: 'secondhand' as const,
      title: item.title,
      price: item.price.toFixed(2),
      image: item.images?.[0],
      source: item.category,
      meta: `${item.condition}成新`,
      extraInfo: `位置: ${item.location}`
    }))
}

// ==================== 关键词高亮 ====================
function highlightKeyword(text: string, kw: string): string {
  if (!kw || !text) return text
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="highlight-keyword">$1</mark>')
}

// ==================== 工具函数 ====================
function goToItem(item: SearchResult) {
  switch (item.type) {
    case 'product':
      router.push(`/products/${item.id}`)
      break
    case 'takeout':
      router.push(`/takeout/merchant/${item.id}`)
      break
    case 'secondhand':
      router.push(`/secondhand/item/${item.id}`)
      break
    case 'post':
      router.push(`/community/post/${item.id}`)
      break
    case 'activity':
      router.push(`/community/activity/${item.id}`)
      break
    default:
      break
  }
}

function typeBadge(type: string): string {
  const map: Record<string, string> = {
    product: 'bg-[#003B80]/90 text-white',
    takeout: 'bg-orange-500/90 text-white',
    secondhand: 'bg-purple-500/90 text-white',
    post: 'bg-teal-500/90 text-white',
    activity: 'bg-pink-500/90 text-white'
  }
  return map[type] || 'bg-gray-500/90 text-white'
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    product: '商品',
    takeout: '外卖',
    secondhand: '二手',
    post: '帖子',
    activity: '活动'
  }
  return map[type] || type
}

function typeCardClass(type: string): string {
  const map: Record<string, string> = {
    product: 'border-gray-100 hover:border-blue-200',
    takeout: 'border-orange-100 hover:border-orange-300',
    secondhand: 'border-purple-100 hover:border-purple-300',
    post: 'border-teal-100 hover:border-teal-300',
    activity: 'border-pink-100 hover:border-pink-300'
  }
  return map[type] || 'border-gray-100 hover:border-gray-200'
}

function defaultImage(type: string): string {
  const map: Record<string, string> = {
    product: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
    takeout: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
    secondhand: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
    post: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=200&fit=crop',
    activity: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop'
  }
  return map[type] || ''
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return String(count)
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  } catch {
    return dateStr
  }
}

function handleClear() {
  hasSearched.value = false
  allResults.value = []
  activeTab.value = 'all'
}

// ==================== 防抖搜索 ====================
watch(keyword, (val) => {
  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 如果已经搜索过且输入不为空，启动防抖
  if (hasSearched.value && val.trim()) {
    debounceTimer = setTimeout(() => {
      handleSearch()
    }, 300)
  }
})

// ==================== 路由参数处理（支持从其他页面跳转过来带关键词）====================
onMounted(() => {
  loadSearchHistory()

  // 检查URL是否有搜索关键词参数
  const queryKeyword = route.query.q as string
  if (queryKeyword) {
    keyword.value = queryKeyword
    handleSearch()
  }
})
</script>

<style scoped>
/* 基础样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 品牌色主题 */
.search-btn {
  background: linear-gradient(135deg, #003B80 0%, #0052A3 100%);
  box-shadow: 0 4px 14px rgba(0, 59, 128, 0.3);
}
.search-btn:hover {
  box-shadow: 0 6px 20px rgba(0, 59, 128, 0.4);
  transform: translateY(-1px);
}

.icon-bg {
  background: linear-gradient(135deg, #E8F0FE 0%, #D4E4F7 100%);
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: 0 2px 12px rgba(0, 59, 128, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}
.search-input :deep(.el-input__wrapper:hover) {
  border-color: #003B80;
  box-shadow: 0 4px 16px rgba(0, 59, 128, 0.12);
}
.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #003B80;
  box-shadow: 0 4px 20px rgba(0, 59, 128, 0.18);
}

/* Tab样式 */
.tab-active {
  background: #003B80;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 59, 128, 0.25);
}

/* 结果卡片 */
.result-card {
  transform: translateY(0);
}
.result-card:hover {
  transform: translateY(-4px);
}

/* 关键词高亮 */
.highlight-keyword {
  background: #fef08a;
  color: #854d0e;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 搜索历史标签 */
.history-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #F5F7FA;
  border-radius: 20px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E4E7ED;
}
.history-tag:hover {
  background: #ECF5FF;
  border-color: #003B80;
  color: #003B80;
}
.delete-btn {
  display: none;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  background: #C0C4CC;
  color: white;
  font-size: 14px;
  cursor: pointer;
}
.history-group:hover .delete-btn,
.history-tag:hover .delete-btn {
  display: inline-block;
}
.delete-btn:hover {
  background: #F56C6C;
}

/* 热搜排名徽章 */
.rank-badge {
  min-width: 24px;
  font-family: 'DIN Alternate', sans-serif;
}
.rank-1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #fff;
}
.rank-2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  color: #fff;
}
.rank-3 {
  background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
  color: #fff;
}
.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: #F5F7FA;
  color: #909399;
}

/* 热搜项 */
.hot-item {
  border: 1px solid transparent;
}
.hot-item:hover {
  border-color: #003B80;
  background: #F5F8FF;
}

/* 类型标签 */
.type-badge {
  backdrop-filter: blur(4px);
}

/* 响应式优化 */
@media (max-width: 640px) {
  .search-btn {
    display: none;
  }
}
</style>
