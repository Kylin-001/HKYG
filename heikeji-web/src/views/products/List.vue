<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/ProductCard.vue'
import Skeleton from '@/components/Skeleton.vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const { t } = useI18n()
const productStore = useProductStore()
const cartStore = useCartStore()

// 筛选条件
const sortBy = ref('default')
const priceRange = ref<[number, number] | null>(null)
const selectedCategory = ref<string | null>(null)
const showFilters = ref(false)
const searchKeyword = ref('')

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: '🏪' },
  { id: 'food', name: '食品零食', icon: '🍿' },
  { id: 'electronics', name: '数码电子', icon: '📱' },
  { id: 'stationery', name: '文具用品', icon: '✏️' },
  { id: 'daily', name: '日用百货', icon: '🧴' },
  { id: 'books', name: '图书教材', icon: '📚' },
  { id: 'clothing', name: '服饰鞋包', icon: '👕' },
  { id: 'beauty', name: '美妆护肤', icon: '💄' },
])

const hasMore = computed(() => productStore.list.length < productStore.total)
const page = ref(1)

// 排序选项
const sortOptions = [
  { value: 'default', label: '综合排序' },
  { value: 'sales', label: '销量优先' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'newest', label: '最新上架' },
]

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId === 'all' ? null : categoryId
  page.value = 1
  loadProducts()
}

function handleSearch() {
  page.value = 1
  loadProducts()
}

function handleProductClick(product: any) {
  // 路由跳转由 ProductCard 或模板处理
}

async function handleAddToCart(product: any) {
  try {
    await cartStore.addItem(product.id, 1)
    ElMessage.success(`${product.name} 已加入购物车`)
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
  if (route.params.categoryId) {
    selectedCategory.value = route.params.categoryId as string
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
</script>

<template>
  <div class="product-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
        <h1 class="text-2xl font-bold text-text-primary mb-2">
          {{ selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : t('product.categories') }}
        </h1>
        <p class="text-text-secondary text-sm">
          共找到 <span class="font-semibold text-text-primary">{{ productStore.total }}</span> 件商品
        </p>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 pb-20">
      <div class="flex gap-6 lg:gap-8">
        <!-- 左侧分类导航 -->
        <aside class="hidden lg:block w-56 flex-shrink-0">
          <div class="category-sidebar sticky top-24 bg-surface rounded-2xl shadow-sm p-4">
            <h3 class="font-semibold text-text-primary mb-4 px-2">商品分类</h3>
            <nav class="space-y-1">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                :class="[
                  'category-item',
                  { 'category-item--active': (!selectedCategory && cat.id === 'all') || selectedCategory === cat.id }
                ]"
                @click="selectCategory(cat.id)"
              >
                <span class="mr-2">{{ cat.icon }}</span>
                {{ cat.name }}
              </button>
            </nav>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="flex-1 min-w-0">
          <!-- 搜索栏 -->
          <div class="bg-surface rounded-2xl shadow-sm p-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="flex-1 relative">
                <el-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"><Search /></el-icon>
                <input
                  v-model="searchKeyword"
                  type="text"
                  :placeholder="t('nav.search') || '搜索商品...'"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors text-sm"
                  @keyup.enter="handleSearch"
                />
              </div>
              <button
                @click="handleSearch"
                class="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-light transition-colors"
              >
                {{ t('common.search') || '搜索' }}
              </button>
            </div>
          </div>

          <!-- 筛选栏 -->
          <div class="filter-bar bg-surface rounded-2xl shadow-sm p-4 mb-6 sticky top-16 z-10">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <!-- 排序选择 -->
              <div class="flex items-center gap-2 overflow-x-auto pb-1">
                <button 
                  v-for="option in sortOptions" 
                  :key="option.value"
                  :class="['sort-btn', { 'sort-btn--active': sortBy === option.value }]"
                  @click="sortBy = option.value"
                >
                  {{ option.label }}
                </button>
              </div>

              <!-- 移动端筛选按钮 -->
              <button 
                class="lg:hidden filter-toggle-btn"
                @click="showFilters = !showFilters"
              >
                <el-icon><Filter /></el-icon>
                <span>{{ t('product.filter') || '筛选' }}</span>
              </button>

              <!-- 视图切换 -->
              <div class="hidden md:flex items-center gap-2 text-text-tertiary">
                <button class="view-btn active">
                  <el-icon><Grid /></el-icon>
                </button>
                <button class="view-btn">
                  <el-icon><List /></el-icon>
                </button>
              </div>
            </div>

            <!-- 展开的筛选面板（移动端） -->
            <transition name="slide-down">
              <div v-if="showFilters" class="mt-4 pt-4 border-t border-divider">
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="cat in categories.slice(1)" 
                    :key="cat.id"
                    :class="[
                      'filter-tag',
                      { 'filter-tag--active': selectedCategory === cat.id }
                    ]"
                    @click="selectCategory(cat.id)"
                  >
                    {{ cat.icon }} {{ cat.name }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- 商品网格 -->
          <div class="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <ProductCard
              v-for="product in productStore.list"
              :key="product.id"
              :product="product"
              size="medium"
              :hoverable="true"
              :show-sales="true"
              @click="handleProductClick(product)"
              @add-to-cart="handleAddToCart(product)"
            />
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore" class="load-more-wrapper mt-12 text-center">
            <button 
              class="load-more-btn"
              :class="{ 'loading': productStore.loading }"
              @click="loadMore"
              :disabled="productStore.loading"
            >
              <span v-if="!productStore.loading">{{ t('common.viewAll') || '加载更多商品' }}</span>
              <span v-else>{{ t('common.loading') || '加载中...' }}</span>
            </button>
          </div>

          <!-- 已到底部提示 -->
          <div v-if="!hasMore && productStore.list.length > 0" class="end-hint mt-12 text-center">
            <p class="text-text-tertiary text-sm">— {{ t('common.viewAll') || '已经到底了' }} —</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Filter, Grid, List, Search } from '@element-plus/icons-vue'

export default {
  components: { Filter, Grid, List, Search },
}
</script>

<style scoped>
/* 分类侧边栏 */
.category-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    background: rgba(0, 122, 255, 0.06);
    color: var(--color-text-primary);
  }
  
  &--active {
    background: rgba(0, 122, 255, 0.1);
    color: var(--color-primary);
    font-weight: 600;
  }
}

/* 筛选栏 */
.sort-btn {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    border-color: var(--color-primary-light);
    color: var(--color-primary);
  }
  
  &--active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:active {
    transform: scale(0.97);
  }
}

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  transition: all 0.2s ease-out;
  
  &:hover,
  &.active {
    background: rgba(0, 122, 255, 0.08);
    color: var(--color-primary);
  }
}

.filter-tag {
  padding: 7px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &--active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
}

/* 加载更多按钮 */
.load-more-btn {
  min-width: 200px;
  height: 48px;
  padding: 0 32px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  
  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }
  
  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}

/* 动画 */
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

@media (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
