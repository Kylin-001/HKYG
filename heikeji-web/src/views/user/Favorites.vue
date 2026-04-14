<template>
  <div class="favorites-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-title">
          <div class="header-icon">
            <el-icon :size="28" color="#fff"><Star /></el-icon>
          </div>
          <div class="header-text">
            <h1>我的收藏</h1>
            <p>共 {{ favorites.length }} 件宝贝</p>
          </div>
        </div>
        <button v-if="favorites.length > 0" @click="isEditMode = !isEditMode" class="edit-btn">
          {{ isEditMode ? '完成' : '批量管理' }}
        </button>
      </div>

      <!-- 分类标签 -->
      <div v-if="favorites.length > 0" class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 筛选栏 -->
      <div v-if="favorites.length > 0 && !isEditMode" class="filter-bar">
        <div class="filter-left">
          <button @click="toggleFilter('priceDrop')" :class="['filter-btn', { active: activeFilters.priceDrop }]">
            有降价
          </button>
          
          <div class="dropdown-wrapper">
            <button @click="toggleDropdown('category')" :class="['filter-btn', { active: showDropdown === 'category' || activeFilters.category }]">
              {{ activeFilters.category ? categoryOptions.find(c => c.key === activeFilters.category)?.label : '宝贝分类' }}
              <el-icon :class="['arrow-icon', { rotate: showDropdown === 'category' }]"><ArrowDown /></el-icon>
            </button>
            <div v-if="showDropdown === 'category'" class="dropdown-menu">
              <button v-for="opt in categoryOptions" :key="opt.key" @click="selectFilter('category', opt.key)" :class="['dropdown-item', { active: activeFilters.category === opt.key }]">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="dropdown-wrapper">
            <button @click="toggleDropdown('status')" :class="['filter-btn', { active: showDropdown === 'status' || activeFilters.status }]">
              {{ activeFilters.status ? statusOptions.find(s => s.key === activeFilters.status)?.label : '宝贝状态' }}
              <el-icon :class="['arrow-icon', { rotate: showDropdown === 'status' }]"><ArrowDown /></el-icon>
            </button>
            <div v-if="showDropdown === 'status'" class="dropdown-menu">
              <button v-for="opt in statusOptions" :key="opt.key" @click="selectFilter('status', opt.key)" :class="['dropdown-item', { active: activeFilters.status === opt.key }]">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="dropdown-wrapper">
            <button @click="toggleDropdown('time')" :class="['filter-btn', { active: showDropdown === 'time' || activeFilters.time }]">
              {{ activeFilters.time ? timeOptions.find(t => t.key === activeFilters.time)?.label : '收藏时间' }}
              <el-icon :class="['arrow-icon', { rotate: showDropdown === 'time' }]"><ArrowDown /></el-icon>
            </button>
            <div v-if="showDropdown === 'time'" class="dropdown-menu">
              <button v-for="opt in timeOptions" :key="opt.key" @click="selectFilter('time', opt.key)" :class="['dropdown-item', { active: activeFilters.time === opt.key }]">
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="dropdown-wrapper">
          <button @click="toggleDropdown('sort')" :class="['filter-btn', { active: showDropdown === 'sort' }]">
            {{ sortOptions.find(s => s.key === activeSort)?.label }}
            <el-icon :class="['arrow-icon', { rotate: showDropdown === 'sort' }]"><ArrowDown /></el-icon>
          </button>
          <div v-if="showDropdown === 'sort'" class="dropdown-menu right">
            <button v-for="opt in sortOptions" :key="opt.key" @click="selectSort(opt.key)" :class="['dropdown-item', { active: activeSort === opt.key }]">
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 二级筛选标签 -->
      <div v-if="favorites.length > 0 && !isEditMode && showCategoryTags" class="tag-bar">
        <button v-for="tag in categoryTags" :key="tag.key" @click="selectCategoryTag(tag.key)" :class="['tag-btn', { active: activeCategoryTag === tag.key }]">
          {{ tag.label }}
        </button>
      </div>

      <div v-if="favorites.length > 0 && !isEditMode && showStatusTags" class="tag-bar">
        <button v-for="tag in statusTags" :key="tag.key" @click="selectStatusTag(tag.key)" :class="['tag-btn', { active: activeStatusTag === tag.key }]">
          {{ tag.label }}
        </button>
      </div>

      <div v-if="favorites.length > 0 && !isEditMode && showTimeTags" class="tag-bar">
        <button v-for="tag in timeTags" :key="tag.key" @click="selectTimeTag(tag.key)" :class="['tag-btn', { active: activeTimeTag === tag.key }]">
          {{ tag.label }}
        </button>
      </div>

      <!-- 编辑模式提示 -->
      <div v-if="isEditMode" class="edit-bar">
        <div class="edit-info">
          <el-icon :size="16" color="#f97316"><InfoFilled /></el-icon>
          <span>已选择 {{ selectedIds.length }} 件商品</span>
        </div>
        <div class="edit-actions">
          <button @click="selectAll" class="select-all-btn">{{ isAllSelected ? '取消全选' : '全选' }}</button>
          <button v-if="selectedIds.length > 0" @click="batchDelete" class="delete-btn">删除</button>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-if="filteredFavorites.length > 0" class="product-grid">
        <div v-for="item in filteredFavorites" :key="item.id" class="product-card" @click="toggleSelect(item.id)">
          <!-- 图片区域 -->
          <div class="product-image-wrapper">
            <img :src="item.image" :alt="item.name" class="product-image" />

            <!-- 选中状态 -->
            <div v-if="selectedIds.includes(item.id)" class="selected-overlay">
              <div class="selected-icon">
                <el-icon :size="20" color="#fff"><Check /></el-icon>
              </div>
            </div>

            <!-- 删除按钮 -->
            <button v-if="!isEditMode" @click.stop="removeFavorite(item)" class="delete-icon-btn">
              <el-icon :size="12" color="#fff"><Delete /></el-icon>
            </button>

            <!-- 选中勾选框 -->
            <div v-if="isEditMode" :class="['select-box', { selected: selectedIds.includes(item.id) }]">
              <el-icon v-if="selectedIds.includes(item.id)" :size="12" color="#fff"><Check /></el-icon>
            </div>

            <!-- 促销标签 -->
            <div v-if="item.promotion" class="promotion-tag">{{ item.promotion }}</div>

            <!-- 状态标签 -->
            <div v-if="item.status === 'low_stock' && !item.promotion" class="status-tag low-stock">库存紧张</div>
            <div v-if="item.status === 'invalid' && !item.promotion" class="status-tag invalid">已失效</div>

            <!-- 悬停遮罩 -->
            <div v-if="!isEditMode" class="hover-overlay">
              <button @click.stop="enterShop(item)" class="overlay-btn">进入店铺</button>
              <button @click.stop="findSimilar(item)" class="overlay-btn">按图找相似</button>
            </div>
          </div>

          <!-- 信息区域 -->
          <div class="product-info">
            <h3 class="product-name">{{ item.name }}</h3>
            <p class="product-sold">{{ item.soldCount }}人付款</p>
            <div class="product-price">
              <span :class="['price', { 'price-drop': item.price < item.originalPrice }]">¥{{ item.price }}</span>
              <span v-if="item.price < item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 无筛选结果 -->
      <div v-else-if="favorites.length > 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="40" color="#d1d5db"><Search /></el-icon>
        </div>
        <h3>没有找到相关商品</h3>
        <p>试试其他筛选条件</p>
        <button @click="clearFilters" class="clear-btn">清除筛选</button>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <el-icon :size="40" color="#d1d5db"><Star /></el-icon>
        </div>
        <h3>还没有收藏任何商品</h3>
        <p>看到喜欢的商品就收藏起来吧</p>
        <button @click="$router.push('/products')" class="primary-btn">去逛逛</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Check, Delete, InfoFilled, ArrowDown, Search } from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const communityStore = useCommunityStore()

const isEditMode = ref(false)
const selectedIds = ref<number[]>([])
const activeTab = ref('all')
const showDropdown = ref<string | null>(null)

const activeFilters = ref({
  priceDrop: false,
  category: '',
  status: '',
  time: ''
})

const activeCategoryTag = ref('')
const activeStatusTag = ref('')
const activeTimeTag = ref('')
const activeSort = ref('newest')

const tabs = [
  { key: 'all', label: '全部宝贝' },
  { key: 'list', label: '宝贝清单' },
  { key: 'shop', label: '同店宝贝' }
]

const categoryOptions = [
  { key: '', label: '全部' },
  { key: 'digital', label: '数码产品' },
  { key: 'clothing', label: '服饰内衣' },
  { key: 'beauty', label: '美妆护肤' },
  { key: 'food', label: '食品生鲜' },
  { key: 'home', label: '家居日用' },
  { key: 'sports', label: '运动户外' },
  { key: 'books', label: '图书文具' }
]

const categoryTags = [
  { key: 'underwear', label: '内衣 4' },
  { key: 'bags', label: '箱包 1' },
  { key: 'beauty', label: '美妆 1' },
  { key: 'care', label: '洗护 6' },
  { key: 'food', label: '食品 1' },
  { key: 'medical', label: '医疗 4' },
  { key: 'electronics', label: '电子 3' },
  { key: 'entertainment', label: '文娱 1' },
  { key: 'home', label: '家居 2' },
  { key: 'others', label: '其它 4' }
]

const statusOptions = [
  { key: '', label: '全部' },
  { key: 'bought', label: '已买过' },
  { key: 'low_stock', label: '低库存' },
  { key: 'invalid', label: '已失效' }
]

const statusTags = [
  { key: 'bought', label: '已买过' },
  { key: 'low_stock', label: '低库存' },
  { key: 'invalid', label: '已失效' }
]

const timeOptions = [
  { key: '', label: '全部时间' },
  { key: '7days', label: '7天内' },
  { key: '30days', label: '30天内' },
  { key: '90days', label: '90天内' },
  { key: 'half_year', label: '半年前' },
  { key: 'one_year', label: '一年前' }
]

const timeTags = [
  { key: '7days', label: '7天内' },
  { key: '30days', label: '30天内' },
  { key: '90days', label: '90天内' },
  { key: 'half_year', label: '半年前' },
  { key: 'one_year', label: '一年前' }
]

const sortOptions = [
  { key: 'newest', label: '最近收藏在前' },
  { key: 'oldest', label: '最早收藏在前' },
  { key: 'price_asc', label: '价格从低到高' },
  { key: 'price_desc', label: '价格从高到低' }
]

const favorites = computed(() => communityStore.favorites)

const showCategoryTags = computed(() => activeFilters.value.category === 'category')
const showStatusTags = computed(() => activeFilters.value.status === 'status')
const showTimeTags = computed(() => activeFilters.value.time === 'time')

const filteredFavorites = computed(() => {
  let result = [...favorites.value]

  if (activeFilters.value.priceDrop) {
    result = result.filter(item => item.price < item.originalPrice)
  }

  if (activeCategoryTag.value) {
    result = result.filter((_, index) => index % 3 === 0)
  }

  if (activeStatusTag.value) {
    result = result.filter(item => item.status === activeStatusTag.value)
  }

  if (activeTimeTag.value) {
    const now = Date.now()
    const timeMap: Record<string, number> = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '90days': 90 * 24 * 60 * 60 * 1000,
      'half_year': 180 * 24 * 60 * 60 * 1000,
      'one_year': 365 * 24 * 60 * 60 * 1000
    }
    const timeLimit = timeMap[activeTimeTag.value]
    if (timeLimit) {
      result = result.filter(item => {
        const itemTime = new Date(item.createdAt).getTime()
        return now - itemTime <= timeLimit
      })
    }
  }

  if (activeSort.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (activeSort.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (activeSort.value === 'price_asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (activeSort.value === 'price_desc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

const isAllSelected = computed(() => {
  return filteredFavorites.value.length > 0 && selectedIds.value.length === filteredFavorites.value.length
})

function toggleDropdown(type: string) {
  showDropdown.value = showDropdown.value === type ? null : type
}

function toggleFilter(type: string) {
  if (type === 'priceDrop') {
    activeFilters.value.priceDrop = !activeFilters.value.priceDrop
  }
}

function selectFilter(type: string, value: string) {
  if (type === 'category') {
    activeFilters.value.category = activeFilters.value.category === value ? '' : value
    activeCategoryTag.value = ''
  } else if (type === 'status') {
    activeFilters.value.status = activeFilters.value.status === value ? '' : value
    activeStatusTag.value = ''
  } else if (type === 'time') {
    activeFilters.value.time = activeFilters.value.time === value ? '' : value
    activeTimeTag.value = ''
  }
  showDropdown.value = null
}

function selectCategoryTag(key: string) {
  activeCategoryTag.value = activeCategoryTag.value === key ? '' : key
}

function selectStatusTag(key: string) {
  activeStatusTag.value = activeStatusTag.value === key ? '' : key
}

function selectTimeTag(key: string) {
  activeTimeTag.value = activeTimeTag.value === key ? '' : key
}

function selectSort(key: string) {
  activeSort.value = key
  showDropdown.value = null
}

function clearFilters() {
  activeFilters.value = {
    priceDrop: false,
    category: '',
    status: '',
    time: ''
  }
  activeCategoryTag.value = ''
  activeStatusTag.value = ''
  activeTimeTag.value = ''
}

function selectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredFavorites.value.map(item => item.id)
  }
}

function toggleSelect(id: number) {
  if (!isEditMode.value) return
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

async function removeFavorite(item: any) {
  try {
    await ElMessageBox.confirm(`确定取消收藏 "${item.name.substring(0, 20)}..." 吗？`, '取消收藏', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await communityStore.removeFavorite(item.id)
    ElMessage.success('已取消收藏')
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error(err.message || '取消收藏失败')
  }
}

async function batchDelete() {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个商品吗？`, '批量删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    for (const id of selectedIds.value) {
      await communityStore.removeFavorite(id)
    }
    selectedIds.value = []
    isEditMode.value = false
    ElMessage.success('批量删除成功')
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error(err.message || '批量删除失败')
  }
}

function enterShop(item: any) {
  ElMessage.info(`进入 ${item.shopName || '店铺'} 的店铺`)
}

function findSimilar(item: any) {
  ElMessage.info('正在搜索相似商品...')
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-wrapper')) {
    showDropdown.value = null
  }
}

onMounted(async () => {
  try {
    await communityStore.fetchFavorites()
  } catch (err: any) {
    ElMessage.error(err.message || '获取收藏列表失败')
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 32px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 页面标题 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.3);
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.edit-btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

/* 标签栏 */
.tab-bar {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 12px 4px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #111827;
}

.tab-btn.active {
  color: #f97316;
  border-bottom-color: #f97316;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 13px;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  color: #111827;
  background: #f3f4f6;
}

.filter-btn.active {
  color: #f97316;
  font-weight: 500;
}

.arrow-icon {
  transition: transform 0.2s;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-menu.right {
  left: auto;
  right: 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  text-align: left;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item.active {
  color: #f97316;
  font-weight: 500;
}

/* 二级标签 */
.tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: #6b7280;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: #f97316;
}

.tag-btn.active {
  color: #fff;
  background: #f97316;
  border-color: #f97316;
}

/* 编辑栏 */
.edit-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.edit-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #c2410c;
}

.edit-actions {
  display: flex;
  gap: 12px;
}

.select-all-btn {
  font-size: 13px;
  color: #f97316;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.select-all-btn:hover {
  color: #ea580c;
}

.delete-btn {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  color: #dc2626;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* 商品卡片 */
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #f3f4f6;
  overflow: hidden;
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 选中遮罩 */
.selected-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-icon {
  width: 40px;
  height: 40px;
  background: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 删除按钮 */
.delete-icon-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-card:hover .delete-icon-btn {
  opacity: 1;
}

.delete-icon-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 选择框 */
.select-box {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-box.selected {
  background: #f97316;
  border-color: #f97316;
}

/* 标签 */
.promotion-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  padding: 4px 8px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 10px;
  padding: 4px 8px;
  text-align: center;
}

.status-tag.low-stock {
  background: rgba(249, 115, 22, 0.9);
  color: #fff;
}

.status-tag.invalid {
  background: rgba(107, 114, 128, 0.9);
  color: #fff;
}

/* 悬停遮罩 */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-card:hover .hover-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 6px 16px;
  font-size: 12px;
  color: #374151;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.overlay-btn:hover {
  background: #f3f4f6;
}

/* 商品信息 */
.product-info {
  padding: 12px;
}

.product-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.5;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sold {
  font-size: 11px;
  color: #9ca3af;
  margin: 0 0 6px 0;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.price.price-drop {
  color: #f97316;
}

.original-price {
  font-size: 11px;
  color: #9ca3af;
  text-decoration: line-through;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.clear-btn {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #f97316;
  background: none;
  border: none;
  cursor: pointer;
}

.clear-btn:hover {
  color: #ea580c;
}

.primary-btn {
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
  transition: box-shadow 0.2s;
}

.primary-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
}
</style>