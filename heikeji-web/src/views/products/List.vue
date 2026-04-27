<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locales'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const productStore = useProductStore()
const cartStore = useCartStore()

// 筛选条件
const sortBy = ref('default')
const selectedCategory = ref<string | null>(null)
const showFilters = ref(false)
const searchKeyword = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// 分类数据
const categories = ref([
  { id: 'all', name: '全部商品', icon: '\u{1F3EA}', color: 'from-blue-500 to-violet-500' },
  { id: 'food', name: '食品零食', icon: '\u{1F35C}', color: 'from-orange-400 to-rose-500' },
  { id: 'electronics', name: '数码电子', icon: '\u{1F4F1}', color: 'from-cyan-400 to-blue-500' },
  { id: 'stationery', name: '文具用品', icon: '\u{270F}\u{FE0F}', color: 'from-emerald-400 to-teal-500' },
  { id: 'daily', name: '日用百货', icon: '\u{1F3E0}', color: 'from-amber-400 to-orange-500' },
  { id: 'books', name: '图书教材', icon: '\u{1F4DA}', color: 'from-violet-400 to-purple-500' },
  { id: 'clothing', name: '服饰鞋包', icon: '\u{1F455}', color: 'from-pink-400 to-rose-500' },
  { id: 'beauty', name: '美妆护肤', icon: '\u{1F484}', color: 'from-fuchsia-400 to-pink-500' },
])

// 热门搜索标签
const hotKeywords = ['耳机', '笔记本', '零食', '洗发水', '充电器', '水杯']

const hasMore = computed(() => productStore.list.length < productStore.total)
const page = ref(1)

// 排序选项
const sortOptions = [
  { value: 'default', label: '综合排序', icon: 'Swap' },
  { value: 'sales', label: '销量优先', icon: 'TrendCharts' },
  { value: 'price-asc', label: '价格从低到高', icon: 'SortUp' },
  { value: 'price-desc', label: '价格从高到低', icon: 'SortDown' },
  { value: 'newest', label: '最新上架', icon: 'Clock' },
]

// 当前分类信息
const currentCategory = computed(() => {
  if (!selectedCategory.value) return categories.value[0]
  return categories.value.find(c => c.id === selectedCategory.value) || categories.value[0]
})

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId === 'all' ? null : categoryId
  page.value = 1
  
  // 更新 URL
  if (categoryId === 'all') {
    router.replace({ path: '/products' })
  } else {
    router.replace({ path: '/products', query: { category: categoryId } })
  }
  
  loadProducts()
}

function handleSearch() {
  page.value = 1
  loadProducts()
}

function handleKeywordClick(keyword: string) {
  searchKeyword.value = keyword
  handleSearch()
}

function clearSearch() {
  searchKeyword.value = ''
  handleSearch()
}

async function handleAddToCart(product: any) {
  try {
    await cartStore.addItem(product.id, 1)
    ElMessage.success({
      message: `${product.name} 已加入购物车`,
      type: 'success',
      plain: true,
    })
  } catch (err: any) {
    ElMessage.error(err.message || '添加购物车失败')
  }
}

async function loadProducts() {
  try {
    await productStore.fetchList({
      page: page.value,
      pageSize: 20,
      category: selectedCategory.value || undefined,
      keyword: searchKeyword.value || undefined,
      sortBy: sortBy.value !== 'default' ? sortBy.value : undefined
    })
  } catch (err: any) {
    ElMessage.error(err.message || '获取商品列表失败')
  }
}

async function loadMore() {
  if (productStore.loading || !hasMore.value) return
  page.value++
  await loadProducts()
}

onMounted(() => {
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword as string
  }
  loadProducts()
})

watch(sortBy, () => {
  page.value = 1
  loadProducts()
})

watch(() => route.query.category, (newCategory) => {
  selectedCategory.value = newCategory as string | null
  page.value = 1
  loadProducts()
})
</script>

<template>
  <div class="product-list-page">
    <!-- 页面头部 - 动态渐变背景 -->
    <div class="relative overflow-hidden rounded-3xl mb-8">
      <div :class="`absolute inset-0 bg-gradient-to-r ${currentCategory.color} opacity-10`"></div>
      <div class="relative px-6 py-8 lg:py-10">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">{{ currentCategory.icon }}</span>
              <h1 class="text-2xl lg:text-3xl font-bold text-slate-900">
                {{ currentCategory.name }}
              </h1>
            </div>
            <p class="text-slate-500">
              共找到 <span class="font-semibold text-slate-900">{{ productStore.total }}</span> 件精选商品
            </p>
          </div>
          
          <!-- 视图切换 -->
          <div class="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              <el-icon><Grid /></el-icon>
              <span class="hidden sm:inline">网格</span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              <el-icon><List /></el-icon>
              <span class="hidden sm:inline">列表</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-6 lg:gap-8">
      <!-- 左侧分类导航 - 现代化卡片设计 -->
      <aside class="hidden lg:block w-64 flex-shrink-0">
        <div class="space-y-6">
          <!-- 分类导航 -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <el-icon class="text-blue-500"><Menu /></el-icon>
              商品分类
            </h3>
            <nav class="space-y-1">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="selectCategory(cat.id)"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  (!selectedCategory && cat.id === 'all') || selectedCategory === cat.id
                    ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                ]"
              >
                <span class="text-lg">{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
                <el-icon v-if="(!selectedCategory && cat.id === 'all') || selectedCategory === cat.id" class="ml-auto">
                  <ArrowRight />
                </el-icon>
              </button>
            </nav>
          </div>

          <!-- 促销信息卡片 -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 p-5 text-white">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-3">
                <el-icon class="text-2xl"><Present /></el-icon>
                <span class="font-bold text-lg">限时特惠</span>
              </div>
              <p class="text-white/90 text-sm mb-4">新用户首单立减 ¥20</p>
              <button class="w-full py-2.5 bg-white text-rose-500 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors">
                立即领取
              </button>
            </div>
          </div>

          <!-- 价格区间筛选 -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <el-icon class="text-blue-500"><Money /></el-icon>
              价格区间
            </h3>
            <div class="space-y-2">
              <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                ¥0 - ¥50
              </button>
              <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                ¥50 - ¥100
              </button>
              <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                ¥100 - ¥200
              </button>
              <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                ¥200 以上
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 min-w-0">
        <!-- 搜索栏 - 现代化设计 -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="flex-1 relative">
                <el-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"><Search /></el-icon>
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="搜索你心仪的商品..."
                  class="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  @keyup.enter="handleSearch"
                />
                <button 
                  v-if="searchKeyword"
                  @click="clearSearch"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <el-icon><CircleClose /></el-icon>
                </button>
              </div>
              <button
                @click="handleSearch"
                class="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-95 transition-all duration-200 shadow-lg shadow-slate-900/20"
              >
                搜索
              </button>
            </div>
            
            <!-- 热门搜索 -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-slate-400 text-sm">热门搜索：</span>
              <button
                v-for="keyword in hotKeywords"
                :key="keyword"
                @click="handleKeywordClick(keyword)"
                class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {{ keyword }}
              </button>
            </div>
          </div>
        </div>

        <!-- 筛选栏 - 胶囊式设计 -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 mb-6 sticky top-20 z-30">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- 排序选择 -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button 
                v-for="option in sortOptions" 
                :key="option.value"
                :class="[
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                  sortBy === option.value
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                ]"
                @click="sortBy = option.value"
              >
                <span>{{ option.label }}</span>
              </button>
            </div>

            <!-- 移动端筛选按钮 -->
            <button 
              class="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              @click="showFilters = !showFilters"
            >
              <el-icon><Filter /></el-icon>
              <span>筛选</span>
            </button>
          </div>

          <!-- 展开的筛选面板（移动端） -->
          <transition name="slide-down">
            <div v-if="showFilters" class="mt-4 pt-4 border-t border-slate-100">
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200',
                    (!selectedCategory && cat.id === 'all') || selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                  ]"
                  @click="selectCategory(cat.id)"
                >
                  <span>{{ cat.icon }}</span>
                  <span>{{ cat.name }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- 商品网格/列表 -->
        <div 
          :class="[
            'grid gap-4 md:gap-6',
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          ]"
        >
          <ProductCard
            v-for="(product, index) in productStore.list"
            :key="product.id"
            :product="product"
            :variant="viewMode === 'list' ? 'horizontal' : 'default'"
            :style="{ animationDelay: `${index * 50}ms` }"
            class="animate-fade-in-up"
            @add-to-cart="handleAddToCart(product)"
          />
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="mt-12 text-center">
          <button 
            @click="loadMore"
            :disabled="productStore.loading"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:border-slate-900 hover:text-slate-900 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <el-icon v-if="productStore.loading" class="animate-spin"><Loading /></el-icon>
            <span>{{ productStore.loading ? '加载中...' : '加载更多商品' }}</span>
          </button>
        </div>

        <!-- 已到底部提示 -->
        <div v-if="!hasMore && productStore.list.length > 0" class="mt-12 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-full">
            <el-icon class="text-slate-400"><Check /></el-icon>
            <span class="text-slate-500 text-sm">已加载全部商品</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!productStore.loading && productStore.list.length === 0" class="py-20 text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <el-icon class="text-4xl text-slate-300"><Search /></el-icon>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">暂无商品</h3>
          <p class="text-slate-500 mb-6">试试其他关键词或分类</p>
          <button 
            @click="selectCategory('all'); searchKeyword = ''; handleSearch()"
            class="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            查看全部商品
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条隐藏 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

/* 筛选面板动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  max-height: 300px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding-top: 0;
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
  }
}
</style>
