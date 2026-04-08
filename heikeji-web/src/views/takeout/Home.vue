<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useTakeoutStore } from '@/stores/takeout'

const router = useRouter()
const { t } = useI18n()
const takeoutStore = useTakeoutStore()

const loading = ref(false)

// 商家分类
const categories = ref([
  { id: 'all', name: '全部', icon: '🍽️' },
  { id: 'food', name: '美食', icon: '🍔' },
  { id: 'drink', name: '饮品', icon: '🧋' },
  { id: 'dessert', name: '甜点', icon: '🍰' },
  { id: 'fruit', name: '水果', icon: '🍎' },
  { id: 'supermarket', name: '超市便利', icon: '🏪' },
])

const selectedCategory = ref('all')
const searchQuery = ref('')

// 配送时间选择器状态
const deliveryTimeType = ref<'immediate' | 'scheduled'>('immediate')
const showTimeSlots = ref(false)
const selectedTimeSlot = ref<string | null>(null)

// 生成预约时间段选项（每30分钟一个，从当前时间开始到今晚22:00）
const timeSlots = computed(() => {
  const slots: Array<{ value: string; label: string }> = []
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 从下一个30分钟整点开始
  let startHour = currentHour
  let startMinute = currentMinute < 30 ? 30 : 0
  if (currentMinute >= 30) {
    startHour += 1
  }
  
  // 生成时间段直到22:00
  for (let hour = startHour; hour < 22; hour++) {
    for (let minute of [0, 30]) {
      if (hour === startHour && minute < startMinute) continue
      
      const endMinute = minute + 30
      const endHour = endMinute >= 60 ? hour + 1 : hour
      const endMin = endMinute >= 60 ? endMinute - 60 : endMinute
      
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
      
      slots.push({
        value: `${startTime}-${endTime}`,
        label: `${startTime}-${endTime}`,
      })
      
      // 每小时只生成两个时段（:00 和 :30），如果已经生成了 :00 的下一个时段就停止
      if (minute === 30 && endHour >= 22) break
    }
    
    if (startHour >= 21 && startMinute === 30) break
  }
  
  return slots.slice(0, 12) // 最多显示12个时间段
})

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId
  loadMerchants()
}

function selectDeliveryType(type: 'immediate' | 'scheduled') {
  deliveryTimeType.value = type
  
  if (type === 'scheduled') {
    showTimeSlots.value = true
    // 默认选择第一个时间段
    if (timeSlots.value.length > 0 && !selectedTimeSlot.value) {
      selectedTimeSlot.value = timeSlots.value[0].value
    }
  } else {
    showTimeSlots.value = false
    selectedTimeSlot.value = null
  }
  
  loadMerchants()
}

function selectTimeSlot(timeSlot: string) {
  selectedTimeSlot.value = timeSlot
  loadMerchants()
}

function goToMerchant(merchantId: string) {
  router.push(`/takeout/merchant/${merchantId}`)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    loadMerchants()
  }
}

async function loadMerchants() {
  loading.value = true
  try {
    await takeoutStore.fetchMerchants({
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      keyword: searchQuery.value || undefined,
      deliveryType: deliveryTimeType.value,
      scheduledTime: selectedTimeSlot.value || undefined,
    })
  } catch {
    ElMessage.error('获取商家列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化月销量
function formatMonthlySales(sales: number): string {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万+`
  } else if (sales >= 1000) {
    return `${Math.floor(sales / 1000)}k+`
  }
  return `${sales}+`
}

onMounted(() => {
  loadMerchants()
})
</script>

<template>
  <div class="takeout-page">
    <!-- 头部Banner -->
    <section class="hero-section bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        <!-- 标题 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-3 flex items-center justify-center gap-3">
            🍔 {{ t('takeout.title') }}
          </h1>
          <p class="text-text-secondary text-lg">美食送到宿舍，美味无需等待</p>
        </div>

        <!-- 搜索框 -->
        <div class="max-w-xl mx-auto mb-8">
          <div class="search-box relative">
            <el-icon class="search-icon" :size="22"><Search /></el-icon>
            <input 
              v-model="searchQuery"
              type="text"
              :placeholder="t('takeout.merchantList') || '搜索商家或菜品...'"
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="quick-stats max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="stat-card bg-surface rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-primary">{{ takeoutStore.merchants.length }}</div>
            <div class="text-sm text-text-secondary mt-1">入驻商家</div>
          </div>
          <div class="stat-card bg-surface rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-success">15min</div>
            <div class="text-sm text-text-secondary mt-1">最快送达</div>
          </div>
          <div class="stat-card bg-surface rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-warning">98%</div>
            <div class="text-sm text-text-secondary mt-1">好评率</div>
          </div>
          <div class="stat-card bg-surface rounded-xl p-4 shadow-sm">
            <div class="text-3xl font-bold text-error">24h</div>
            <div class="text-sm text-text-secondary mt-1">全天营业</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类导航 + 配送时间选择器 -->
    <div class="filter-nav sticky top-16 z-20 bg-surface border-b border-divider">
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8">
        <!-- 分类标签 -->
        <div class="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['category-btn', { 'category-btn--active': selectedCategory === cat.id }]"
            @click="selectCategory(cat.id)"
          >
            <span>{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        </div>

        <!-- 配送时间选择器 -->
        <div class="delivery-time-selector pb-4 border-t border-divider pt-3 mt-2">
          <div class="flex items-center gap-6">
            <span class="selector-label text-sm font-medium text-text-secondary flex-shrink-0">
              配送时间：
            </span>
            
            <div class="delivery-type-options flex items-center gap-3">
              <button 
                :class="['delivery-type-btn', { 'delivery-type-btn--active': deliveryTimeType === 'immediate' }]"
                @click="selectDeliveryType('immediate')"
              >
                <el-icon><Timer /></el-icon>
                立即配送
                <span class="type-hint">约25-40分钟</span>
              </button>
              
              <button 
                :class="['delivery-type-btn', { 'delivery-type-btn--active': deliveryTimeType === 'scheduled' }]"
                @click="selectDeliveryType('scheduled')"
              >
                <el-icon><Clock /></el-icon>
                预约送达
                <el-icon 
                  class="expand-icon transition-transform duration-200" 
                  :class="{ 'rotate-180': showTimeSlots }"
                ><ArrowDown /></el-icon>
              </button>
            </div>
          </div>

          <!-- 时间段选择面板 -->
          <transition name="slide-down">
            <div v-if="showTimeSlots" class="time-slots-panel mt-3">
              <div class="slots-grid">
                <button 
                  v-for="slot in timeSlots" 
                  :key="slot.value"
                  :class="['time-slot-btn', { 'time-slot-btn--active': selectedTimeSlot === slot.value }]"
                  @click="selectTimeSlot(slot.value)"
                >
                  {{ slot.label }}
                </button>
              </div>
              
              <div v-if="selectedTimeSlot" class="selected-time-hint mt-2 text-sm text-primary font-medium">
                <el-icon><Check /></el-icon>
                已选择 {{ selectedTimeSlot }} 送达
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 商家列表 -->
    <main class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 pb-24">
      <h2 class="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <span class="w-1 h-6 bg-gradient-to-r from-warning to-error rounded-full"></span>
        推荐商家
        <span v-if="deliveryTimeType === 'scheduled' && selectedTimeSlot" class="ml-2 text-sm font-normal text-primary">
          (可按时送达)
        </span>
      </h2>

      <div class="merchant-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" v-loading="loading">
        <div
          v-for="merchant in takeoutStore.merchants" 
          :key="merchant.id"
          class="merchant-card bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg 
                 transition-all duration-300 cursor-pointer group"
          @click="goToMerchant(merchant.id)"
        >
          <!-- 商家头部 -->
          <div class="merchant-header relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <!-- Logo占位 -->
            <div class="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
              🏪
            </div>
            
            <!-- 配送信息徽章 -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-2">
              <span class="delivery-badge delivery-badge--fast">
                ⚡ {{ merchant.deliveryTime || '25-35分钟' }}
              </span>
              <span v-if="merchant.deliveryFee === 0" class="delivery-badge delivery-badge--free">
                免配送费
              </span>
              <span v-if="merchant.rating >= 4.8" class="delivery-badge delivery-badge--top">
                🏆 品质优选
              </span>
            </div>

            <!-- 距离 -->
            <div class="absolute bottom-3 right-3 text-sm font-medium text-white bg-black/40 backdrop-blur-sm 
                        px-3 py-1 rounded-full">
              {{ merchant.distance || '1.2km' }}
            </div>
            
            <!-- 新店/优惠标识 -->
            <div v-if="merchant.isNew" class="absolute top-3 right-3 new-badge">
              新店
            </div>
          </div>

          <!-- 商家信息 -->
          <div class="merchant-info p-5">
            <!-- 名称和评分 -->
            <div class="flex items-start justify-between mb-3">
              <h3 class="merchant-name font-semibold text-lg text-text-primary leading-tight line-clamp-1 flex-1 mr-2">
                {{ merchant.name }}
              </h3>
              
              <!-- 评分组件 -->
              <div class="rating-wrapper flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                <span class="rating-star text-base">⭐</span>
                <span class="rating-value font-bold text-base text-orange-600">{{ merchant.rating || '4.8' }}</span>
              </div>
            </div>

            <!-- 月售单量 + 配送时间 + 价格信息 -->
            <div class="merchant-meta-row flex items-center flex-wrap gap-x-4 gap-y-2 text-sm mb-3">
              <!-- 月售单量 -->
              <span class="meta-item meta-item--sales">
                <el-icon class="meta-icon"><TrendCharts /></el-icon>
                月售{{ formatMonthlySales(merchant.monthlySales || 1200) }}
              </span>
              
              <!-- 配送时间范围 -->
              <span class="meta-item meta-item--time">
                <el-icon class="meta-icon"><Van /></el-icon>
                {{ merchant.deliveryTime || '25-35分钟' }}
              </span>
            </div>

            <!-- 起送价 + 配送费 -->
            <div class="price-info-row flex items-center gap-3 text-sm mb-4 py-2 px-3 bg-gray-50 rounded-lg">
              <span class="price-tag price-tag--min">
                ¥{{ merchant.minOrder || 20 }}起送
              </span>
              <span class="price-divider">·</span>
              <span :class="['price-tag', { 'price-tag--free': merchant.deliveryFee === 0 }]">
                配送¥{{ merchant.deliveryFee || 3 }}
              </span>
              <span v-if="merchant.avgPrice" class="price-tag price-tag--avg ml-auto">
                人均¥{{ merchant.avgPrice }}
              </span>
            </div>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in (merchant.tags || ['好评如潮', '准时达']).slice(0, 3)" 
                :key="tag"
                class="merchant-tag"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 优惠活动 -->
            <div v-if="merchant.promotions?.length || merchant.promotionText" class="promotions space-y-2">
              <template v-if="Array.isArray(merchant.promotions) && merchant.promotions.length">
                <div 
                  v-for="(promo, index) in merchant.promotions.slice(0, 2)" 
                  :key="index"
                  class="promo-item"
                >
                  <span class="promo-tag" :class="`promo-tag--${promo.type}`">
                    {{ promo.type === 'discount' ? '减' : promo.type === 'gift' ? '赠' : '惠' }}
                  </span>
                  <span class="promo-text">{{ promo.text }}</span>
                </div>
              </template>
              <div v-else class="promo-item">
                <span class="promo-tag promo-tag--discount">惠</span>
                <span class="promo-text">{{ merchant.promotionText || '新用户立减5元' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-12">
        <button class="load-more-btn">
          查看更多商家
          <el-icon><ArrowDown /></el-icon>
        </button>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Search, ArrowDown, Timer, Clock, Check, Van, TrendCharts } from '@element-plus/icons-vue'

export default {
  components: { Search, ArrowDown, Timer, Clock, Check, Van, TrendCharts },
}
</script>

<style scoped>
/* Hero区域 */
.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

.search-input {
  width: 100%;
  height: 52px;
  padding-left: 48px;
  padding-right: 120px;
  border-radius: var(--radius-xl);
  border: 2px solid transparent;
  background: white;
  box-shadow: var(--shadow-apple);
  font-size: var(--font-size-base);
  transition: all 0.25s ease-out;
  
  &:focus {
    outline: none;
    border-color: #003B80;
    box-shadow: 0 4px 20px rgba(0, 59, 128, 0.15);
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

.search-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  height: 40px;
  padding: 0 24px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #003B80 0%, #0052b3 100%);
  color: white;
  font-weight: 600;
  font-size: var(--font-size-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-md);
  }
}

/* 分类导航 */
.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  white-space: nowrap;
  
  &:hover {
    background: rgba(0, 59, 128, 0.06);
    color: #003B80;
  }
  
  &--active {
    background: #003B80;
    color: white;
    font-weight: 600;
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* ========== 配送时间选择器 ========== */
.delivery-time-selector {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.selector-label {
  letter-spacing: 0.02em;
}

.delivery-type-options {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.delivery-type-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: 1.5px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.25s ease-out;
  white-space: nowrap;
  
  .el-icon {
    font-size: 16px;
  }
  
  .type-hint {
    font-size: 12px;
    color: var(--color-text-tertiary);
    font-weight: 400;
    margin-left: 2px;
  }
  
  .expand-icon {
    font-size: 12px;
    margin-left: 2px;
    color: inherit;
  }
  
  &:hover {
    border-color: #003B80;
    color: #003B80;
    background: rgba(0, 59, 128, 0.04);
  }
  
  &--active {
    background: #003B80;
    color: white;
    border-color: #003B80;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 59, 128, 0.2);
    
    .type-hint {
      color: rgba(255, 255, 255, 0.85);
    }
    
    .expand-icon {
      color: white;
    }
  }
}

/* 时间段选择面板 */
.time-slots-panel {
  background: #fafbfc;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(0, 59, 128, 0.08);
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.time-slot-btn {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: white;
  border: 1.5px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    border-color: #003B80;
    color: #003B80;
    background: rgba(0, 59, 128, 0.03);
  }
  
  &--active {
    background: linear-gradient(135deg, #003B80, #0052b3);
    color: white;
    border-color: #003B80;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 59, 128, 0.25);
  }
}

.selected-time-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active {
  animation: slideDownIn 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDownOut 0.2s ease-in;
}

@keyframes slideDownIn {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
}

@keyframes slideDownOut {
  from {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
}

/* ========== 商家卡片 ========== */
.merchant-card {
  &:hover {
    transform: translateY(-4px);
    
    .merchant-header::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 59, 128, 0.05);
    }
    
    .merchant-name {
      color: #003B80;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(0.99);
  }
}

.delivery-badge {
  padding: 5px 11px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(8px);
  
  &--fast {
    background: linear-gradient(135deg, rgba(52, 199, 89, 0.95), rgba(46, 182, 125, 0.95));
    color: white;
  }
  
  &--free {
    background: linear-gradient(135deg, rgba(0, 59, 128, 0.95), rgba(0, 82, 179, 0.95));
    color: white;
  }
  
  &--top {
    background: linear-gradient(135deg, rgba(255, 149, 0, 0.95), rgba(255, 167, 38, 0.95));
    color: white;
  }
}

.new-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 评分组件 */
.rating-wrapper {
  transition: all 0.2s ease-out;
  
  .group:hover & {
    transform: scale(1.05);
  }
}

.rating-value {
  line-height: 1;
}

/* 商家元数据行 */
.merchant-meta-row {
  line-height: 1.6;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
  
  .meta-icon {
    font-size: 14px;
    color: #003B80;
  }
  
  &--sales {
    .meta-icon {
      color: #52c41a;
    }
  }
  
  &--time {
    .meta-icon {
      color: #fa8c16;
    }
  }
}

/* 价格信息行 */
.price-info-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.price-tag {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  
  &--min {
    color: #003B80;
    font-weight: 600;
  }
  
  &--free {
    color: #52c41a;
    font-weight: 600;
  }
  
  &--avg {
    color: var(--color-text-tertiary);
    font-size: 12px;
  }
}

.price-divider {
  color: var(--color-divider);
  font-weight: 400;
}

.merchant-name {
  transition: color 0.2s ease-out;
}

.merchant-tag {
  padding: 5px 11px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  background: rgba(0, 59, 128, 0.06);
  color: #003B80;
  border: 1px solid rgba(0, 59, 128, 0.1);
  transition: all 0.2s ease-out;
  
  &:hover {
    background: rgba(0, 59, 128, 0.1);
    border-color: rgba(0, 59, 128, 0.2);
  }
}

.promo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
}

.promo-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
  flex-shrink: 0;
  
  &--discount {
    background: rgba(255, 77, 79, 0.08);
    color: #ff4d4f;
  }
  
  &--gift {
    background: rgba(0, 59, 128, 0.08);
    color: #003B80;
  }
}

.promo-text {
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 14px 32px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.25s ease-out;
  
  &:hover {
    border-color: #003B80;
    color: #003B80;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 59, 128, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .merchant-card .merchant-header {
    height: 140px;
  }
  
  .delivery-type-options {
    gap: 8px;
  }
  
  .delivery-type-btn {
    padding: 8px 14px;
    font-size: 13px;
    
    .type-hint {
      display: none;
    }
  }
  
  .slots-grid {
    gap: 8px;
  }
  
  .time-slot-btn {
    padding: 7px 13px;
    font-size: 12px;
  }
  
  .merchant-meta-row {
    gap: 8px;
  }
  
  .price-info-row {
    gap: 6px;
    font-size: 12px;
  }
}
</style>
