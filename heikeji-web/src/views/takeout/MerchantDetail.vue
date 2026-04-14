<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTakeoutStore } from '@/stores/takeout'

const route = useRoute()
const router = useRouter()
const takeoutStore = useTakeoutStore()

// 菜单分类
const categories = ref([
  { id: 'hot', name: '🔥 热销推荐', icon: '🔥' },
  { id: 'malatang', name: '🍲 麻辣烫系列', icon: '🍲' },
  { id: 'noodle', name: '🍜 面食米线', icon: '🍜' },
  { id: 'drink', name: '🧋 饮品甜点', icon: '🧋' },
  { id: 'snack', name: '🍿 小吃零食', icon: '🍿' },
  { id: 'set', name: '📦 超值套餐', icon: '📦' },
])

// 购物车
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  spec?: string
}

const cart = reactive({
  items: [] as CartItem[],
  total: computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
  totalCount: computed(() => cart.items.reduce((sum, item) => sum + item.quantity, 0)),
})

// 购物车浮层状态
const showCartPanel = ref(false)
const highlightItemId = ref<string | null>(null)

// 动画相关
const animatedTotal = ref(0)
let totalAnimationTimer: ReturnType<typeof setTimeout> | null = null

// 选中的分类
const activeCategory = ref('hot')

// 收藏状态
const isFavorite = ref(false)

// 评论数据
const reviews = ref([
  { id: 1, user: '小明同学', avatar: '/avatars/user1.jpg', rating: 5, date: '3天前', content: '味道超赞！麻辣烫很入味，分量也很足，下次还会再来！', images: [], likes: 128 },
  { id: 2, user: '吃货小李', avatar: '/avatars/user2.jpg', rating: 4, date: '1周前', content: '整体不错，就是配送稍微慢了点，等了35分钟。', images: [], likes: 45 },
  { id: 3, user: '学姐A', avatar: '/avatars/user3.jpg', rating: 5, date: '2周前', content: '最爱他家的番茄麻辣烫，酸甜开胃，强烈推荐！', images: [], likes: 89 },
])

function selectCategory(categoryId: string) {
  activeCategory.value = categoryId
}

function addToCart(item: any) {
  const existingItem = cart.items.find(i => i.id === item.id)
  
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    })
  }
  
  // 触发高亮动画
  highlightItem(item.id)
  // 触发总金额滚动动画
  animateTotal()
  
  ElMessage.success(`已添加「${item.name}」到购物车`)
}

function removeFromCart(itemId: string) {
  const index = cart.items.findIndex(i => i.id === itemId)
  if (index > -1) {
    // 触发高亮动画
    highlightItem(itemId)
    
    if (cart.items[index].quantity > 1) {
      cart.items[index].quantity--
      // 触发总金额滚动动画
      animateTotal()
    } else {
      cart.items.splice(index, 1)
      nextTick(() => {
        animateTotal()
      })
    }
  }
}

function highlightItem(itemId: string) {
  highlightItemId.value = itemId
  setTimeout(() => {
    highlightItemId.value = null
  }, 600)
}

function animateTotal() {
  const targetTotal = cart.total
  let currentTotal = animatedTotal.value
  const step = Math.ceil((targetTotal - currentTotal) / 15)
  
  if (totalAnimationTimer) {
    clearInterval(totalAnimationTimer)
  }
  
  totalAnimationTimer = setInterval(() => {
    currentTotal += step
    if ((step > 0 && currentTotal >= targetTotal) || (step < 0 && currentTotal <= targetTotal)) {
      animatedTotal.value = targetTotal
      if (totalAnimationTimer) {
        clearInterval(totalAnimationTimer)
        totalAnimationTimer = null
      }
    } else {
      animatedTotal.value = currentTotal
    }
  }, 30)
}

function clearCart() {
  cart.items = []
  showCartPanel.value = false
  animateTotal()
  ElMessage.success('购物车已清空')
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已收藏商家' : '已取消收藏')
}

function goToCheckout() {
  if (cart.totalCount === 0) {
    ElMessage.warning('请先选择商品')
    return
  }
  
  showCartPanel.value = false
  router.push('/orders/checkout')
}

function toggleCartPanel() {
  showCartPanel.value = !showCartPanel.value
}

function callMerchant() {
  window.open(`tel:${takeoutStore.merchantDetail?.phone}`)
}

function shareMerchant() {
  if (navigator.share) {
    navigator.share({
      title: takeoutStore.merchantDetail?.name,
      text: `推荐一家超好吃的店：${takeoutStore.merchantDetail?.name}，评分${takeoutStore.merchantDetail?.rating}分`,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
  }
}

// 计算打包费和配送费
const packingFee = computed(() => cart.totalCount > 0 ? 2 : 0)
const deliveryFee = computed(() => cart.totalCount > 0 ? (takeoutStore.merchantDetail?.deliveryFee || 3) : 0)
const finalTotal = computed(() => cart.total + packingFee.value + deliveryFee.value)

onMounted(async () => {
  const merchantId = route.params.merchantId as string
  try {
    await takeoutStore.fetchMerchantDetail(merchantId)
    animatedTotal.value = 0
  } catch {
    ElMessage.error('获取商家详情失败')
  }
})
</script>

<template>
  <div class="merchant-detail-page">
    <!-- 顶部导航栏 -->
    <div class="merchant-nav sticky top-16 z-30 bg-surface/95 backdrop-blur-xl border-b border-divider">
      <div class="max-w-screen-lg mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        <button class="back-btn touch-target" @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </button>
        
        <div class="flex items-center gap-4">
          <button 
            :class="['action-btn', { 'action-btn--active': isFavorite }]"
            @click="toggleFavorite"
          >
            <el-icon><StarFilled v-if="isFavorite" /><Star v-else /></el-icon>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </button>
          <button class="action-btn" @click="shareMerchant">
            <el-icon><Share /></el-icon>
            分享
          </button>
          <button class="cart-btn touch-target relative" @click="toggleCartPanel">
            <el-icon :size="22"><ShoppingCart /></el-icon>
            <span v-if="cart.totalCount > 0" class="cart-badge">{{ cart.totalCount }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 商家头部信息 -->
    <section class="merchant-header bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div class="max-w-screen-lg mx-auto px-4 lg:px-8 py-6">
        <!-- Banner图片 -->
        <div class="banner-wrapper aspect-[21/9] rounded-2xl overflow-hidden mb-6 shadow-md">
          <img :src="takeoutStore.merchantDetail?.bannerImage || takeoutStore.merchantDetail?.banner" :alt="takeoutStore.merchantDetail?.name" class="w-full h-full object-cover" width="800" height="340" />
          
          <!-- 商家名称浮层 -->
          <div class="merchant-info-overlay absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <div class="flex items-end justify-between">
              <div>
                <h1 class="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow">{{ takeoutStore.merchantDetail?.name }}</h1>
                <div class="flex items-center gap-4 text-white/90 text-sm">
                  <span class="flex items-center gap-1">
                    <el-icon color="#FFD700"><StarFilled /></el-icon>
                    <span class="font-semibold">{{ takeoutStore.merchantDetail?.rating }}</span>
                  </span>
                  <span>{{ takeoutStore.merchantDetail?.reviewCount || 0 }}条评价</span>
                  <span>月售{{ takeoutStore.merchantDetail?.monthlySales }}</span>
                </div>
              </div>
              
              <!-- 快捷操作 -->
              <div class="flex items-center gap-3">
                <button class="quick-action-btn bg-white/20 backdrop-blur-sm" @click="callMerchant">
                  <el-icon><Phone /></el-icon>
                </button>
                <button class="quick-action-btn bg-white/20 backdrop-blur-sm" @click="shareMerchant">
                  <el-icon><Location /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 配送信息卡片 -->
        <div class="info-cards grid grid-cols-3 gap-4 mt-4">
          <div class="info-card bg-surface rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div class="icon-wrap bg-primary/10 text-primary rounded-xl p-2.5">
              <el-icon :size="24"><Van /></el-icon>
            </div>
            <div>
              <div class="text-xs text-text-secondary">配送时间</div>
              <div class="font-semibold text-text-primary">{{ takeoutStore.merchantDetail?.deliveryTime }}</div>
            </div>
          </div>
          
          <div class="info-card bg-surface rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div class="icon-wrap bg-success/10 text-success rounded-xl p-2.5">
              <el-icon :size="24"><Clock /></el-icon>
            </div>
            <div>
              <div class="text-xs text-text-secondary">营业时间</div>
              <div class="font-semibold text-text-primary">{{ takeoutStore.merchantDetail?.businessHours }}</div>
            </div>
          </div>
          
          <div class="info-card bg-surface rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div class="icon-wrap bg-warning/10 text-warning rounded-xl p-2.5">
              <el-icon :size="24"><Ticket /></el-icon>
            </div>
            <div>
              <div class="text-xs text-text-secondary">起送价 / 配送费</div>
              <div class="font-semibold text-text-primary">¥{{ takeoutStore.merchantDetail?.minOrder }} / ¥{{ takeoutStore.merchantDetail?.deliveryFee }}</div>
            </div>
          </div>
        </div>

        <!-- 优惠活动 -->
        <div v-if="takeoutStore.merchantDetail?.promotions?.length" class="promotions-bar flex gap-3 mt-4 overflow-x-auto pb-2">
          <div 
            v-for="(promo, index) in takeoutStore.merchantDetail.promotions" 
            :key="index"
            class="promo-tag whitespace-nowrap"
          >
            <span class="promo-icon">{{ promo.type === 'discount' ? '减' : promo.type === 'gift' ? '赠' : '惠' }}</span>
            <span>{{ promo.text }}</span>
          </div>
        </div>

        <!-- 商家简介 -->
        <p class="mt-4 text-sm text-text-secondary leading-relaxed line-clamp-2">
            {{ takeoutStore.merchantDetail?.description }}
          </p>
      </div>
    </section>

    <!-- 主内容区：菜单 + 购物车 -->
    <main class="max-w-screen-lg mx-auto px-4 lg:px-8 py-8 pb-32 md:pb-24 lg:pb-8" v-loading="takeoutStore.loading">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- 左侧：菜单列表 -->
        <div class="lg:col-span-2">
          <!-- 分类标签 -->
          <div class="category-tabs sticky top-28 z-20 bg-surface rounded-xl shadow-sm p-2 mb-6">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                :class="['category-tab', { 'category-tab--active': activeCategory === cat.id }]"
                @click="selectCategory(cat.id)"
              >
                {{ cat.icon }} {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- 菜品列表 -->
          <div class="menu-section space-y-4">
            <div 
              v-for="category in (takeoutStore.merchantDetail?.categories || takeoutStore.merchantDetail?.menuItems)" 
              :key="category.id || category.category"
              v-show="activeCategory === (category.id || category.category)"
              class="menu-category"
            >
              <h3 class="category-title flex items-center gap-2 mb-4">
                <span class="w-1 h-5 bg-gradient-to-r from-warning to-error rounded-full"></span>
                {{ categories.find(c => c.id === (category.id || category.category))?.name }}
                <span class="text-xs font-normal text-text-tertiary ml-auto">
                  共{{ (category.items || category.products || []).length }}道菜品
                </span>
              </h3>
              
              <div class="space-y-3">
                <div 
                  v-for="item in (category.items || category.products || [])" 
                  :key="item.id"
                  class="menu-item bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md 
                         transition-all duration-200 cursor-pointer group"
                >
                  <!-- 图片 -->
                  <div class="menu-item-image bg-gradient-to-br from-gray-100 to-gray-200 aspect-square flex-shrink-0 w-24 md:w-28 relative overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                      🍽️
                    </div>
                    
                    <!-- 标签 -->
                    <div v-if="item.tags?.length" class="absolute top-2 left-2 flex gap-1">
                      <span 
                        v-for="tag in item.tags.slice(0, 2)" 
                        :key="tag"
                        class="food-tag"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 信息 -->
                  <div class="menu-item-info flex-1 min-w-0 p-4">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <h4 class="font-medium text-text-primary text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {{ item.name }}
                      </h4>
                      <div class="flex items-baseline gap-2 flex-shrink-0">
                        <span class="text-lg font-bold text-error">¥{{ item.price }}</span>
                        <span v-if="item.originalPrice" class="text-sm text-text-tertiary line-through">¥{{ item.originalPrice }}</span>
                      </div>
                    </div>
                    
                    <p class="text-xs text-text-secondary line-clamp-1">{{ item.description || item.desc || '' }}</p>
                    
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-divider/50">
                      <span class="text-xs text-text-tertiary">月售{{ item.monthSales > 1000 ? `${(item.monthSales / 1000).toFixed(1)}k` : item.monthSales }}</span>
                      
                      <!-- 数量控制按钮 -->
                      <div class="quantity-control flex items-center gap-2">
                        <template v-if="cart.items.find(i => i.id === item.id)?.quantity > 0">
                          <button 
                            class="qty-btn qty-btn--minus" 
                            @click.stop="removeFromCart(item.id)"
                          >-</button>
                          <span class="qty-value">{{ cart.items.find(i => i.id === item.id)?.quantity }}</span>
                        </template>
                        <button 
                          class="qty-btn qty-btn--plus" 
                          @click.stop="addToCart(item)"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：购物车（桌面端显示） -->
        <aside class="hidden lg:block">
          <div 
            :class="['cart-sidebar sticky top-28 bg-surface rounded-2xl shadow-md overflow-hidden transition-all duration-300']"
          >
            <!-- 购物车头部 -->
            <div class="cart-header p-5 border-b border-divider">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-text-primary flex items-center gap-2">
                  <el-icon :size="20" class="text-primary"><ShoppingCart /></el-icon>
                  购物车
                  <span v-if="cart.totalCount > 0" class="cart-count-badge">{{ cart.totalCount }}</span>
                </h3>
                <button 
                  v-if="cart.items.length > 0"
                  class="clear-btn text-xs text-text-tertiary hover:text-error transition-colors"
                  @click="clearCart"
                >
                  清空
                </button>
              </div>
            </div>

            <!-- 购物车内容 -->
            <div v-if="cart.items.length > 0" class="cart-items p-4 max-h-80 overflow-y-auto">
              <transition-group name="list" tag="div" class="space-y-3">
                <div 
                  v-for="item in cart.items" 
                  :key="item.id"
                  :class="['cart-item flex items-center gap-3 p-3 bg-background rounded-xl transition-all duration-300', { 'cart-item--highlight': highlightItemId === item.id }]"
                >
                  <div class="flex-1 min-w-0">
                    <h5 class="font-medium text-sm text-text-primary truncate">{{ item.name }}</h5>
                    <p class="text-xs text-text-secondary mt-0.5">¥{{ item.price }} × {{ item.quantity }}</p>
                  </div>
                  
                  <div class="quantity-control flex items-center gap-2">
                    <button class="qty-btn-sm" @click="removeFromCart(item.id)">-</button>
                    <span class="qty-value-sm w-8 text-center font-medium">{{ item.quantity }}</span>
                    <button class="qty-btn-sm" @click="addToCart({ id: item.id, name: item.name, price: item.price })">+</button>
                  </div>
                  
                  <div class="font-semibold text-error ml-2">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </transition-group>
            </div>

            <!-- 空购物车 -->
            <div v-else class="empty-cart py-12 text-center">
              <div class="text-5xl mb-4 opacity-40">🛒</div>
              <p class="text-text-secondary text-sm">购物车是空的</p>
              <p class="text-text-tertiary text-xs mt-2">快去选择美味吧~</p>
            </div>

            <!-- 结算区域 -->
            <div v-if="cart.items.length > 0" class="cart-footer p-5 border-t border-divider space-y-4">
              <!-- 价格明细 -->
              <div class="price-details space-y-2 text-sm">
                <div class="flex justify-between text-text-secondary">
                  <span>商品金额</span>
                  <span>¥{{ cart.total.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-text-secondary">
                  <span>打包费</span>
                  <span>¥{{ packingFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-text-secondary">
                  <span>配送费</span>
                  <span>¥{{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold text-lg text-text-primary pt-2 border-t border-divider">
                  <span>合计</span>
                  <span class="text-error">¥{{ finalTotal.toFixed(2) }}</span>
                </div>
              </div>

              <!-- 结算按钮 -->
              <button 
                class="checkout-btn w-full h-13 rounded-xl text-white font-bold text-base
                       hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                :disabled="cart.totalCount === 0"
                @click="goToCheckout"
              >
                去结算 ({{ cart.totalCount }}件)
              </button>
              
              <p class="text-center text-xs text-text-tertiary mt-3">
                起送价 ¥{{ takeoutStore.merchantDetail?.minOrder }} · 配送约{{ takeoutStore.merchantDetail?.deliveryTime?.split('-')[0] }}分钟送达
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- 底部固定购物车栏（始终显示） -->
    <div 
      :class="['fixed-bottom-cart-bar fixed bottom-0 left-0 right-0 z-40 safe-area-bottom', { 'cart-bar--empty': cart.totalCount === 0 }]"
    >
      <div class="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        <!-- 左侧：购物车信息 -->
        <div class="cart-info-section flex items-center gap-3 cursor-pointer" @click="toggleCartPanel">
          <div class="cart-icon-wrapper relative">
            <div class="cart-icon-circle">
              <el-icon :size="26"><ShoppingCart /></el-icon>
            </div>
            <span v-if="cart.totalCount > 0" class="cart-count-badge">{{ cart.totalCount }}</span>
          </div>
          
          <div v-if="cart.totalCount > 0" class="price-info">
            <div class="total-price-wrapper">
              <span class="currency-symbol">¥</span>
              <span class="total-price-number">{{ animatedTotal.toFixed(2) }}</span>
            </div>
            <div class="price-hint text-xs text-text-tertiary">
              另需配送费¥{{ deliveryFee }}
            </div>
          </div>
          <div v-else class="empty-hint text-text-tertiary text-sm">
            购物车是空的
          </div>
        </div>

        <!-- 右侧：结算按钮 -->
        <button 
          :class="['checkout-button', { 'checkout-button--disabled': cart.totalCount === 0 }]"
          :disabled="cart.totalCount === 0"
          @click="goToCheckout"
        >
          {{ cart.totalCount > 0 ? '去结算' : '¥20起送' }}
        </button>
      </div>
    </div>

    <!-- 购物车详情浮层（向上滑出） -->
    <transition name="cart-panel">
      <div 
        v-if="showCartPanel && cart.totalCount > 0" 
        class="cart-panel-overlay fixed inset-0 z-50"
        @click.self="showCartPanel = false"
      >
        <div class="cart-panel-container">
          <!-- 面板头部 -->
          <div class="cart-panel-header">
            <h3 class="panel-title">已选商品</h3>
            <button class="clear-all-btn" @click="clearCart">
              <el-icon><Delete /></el-icon>
              清空
            </button>
          </div>

          <!-- 商品列表 -->
          <div class="cart-panel-items">
            <transition-group name="cart-list" tag="div" class="items-list">
              <div 
                v-for="item in cart.items" 
                :key="item.id"
                :class="['cart-panel-item', { 'cart-panel-item--highlight': highlightItemId === item.id }]"
              >
                <div class="item-name-price">
                  <h5 class="item-name">{{ item.name }}</h5>
                  <span class="item-unit-price">¥{{ item.price }}</span>
                </div>
                
                <div class="item-right">
                  <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
                  <div class="item-quantity-control">
                    <button class="item-qty-btn" @click="removeFromCart(item.id)">-</button>
                    <span class="item-qty-value">{{ item.quantity }}</span>
                    <button class="item-qty-btn" @click="addToCart({ id: item.id, name: item.name, price: item.price })">+</button>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- 面板底部：价格明细 + 结算 -->
          <div class="cart-panel-footer">
            <div class="footer-pricing">
              <div class="pricing-row">
                <span class="pricing-label">打包费</span>
                <span class="pricing-value">¥{{ packingFee.toFixed(2) }}</span>
              </div>
              <div class="pricing-row">
                <span class="pricing-label">配送费</span>
                <span class="pricing-value">¥{{ deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="pricing-row pricing-row--total">
                <span class="pricing-label">合计</span>
                <span class="pricing-total-value">¥{{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
            
            <button 
              class="panel-checkout-btn"
              @click="goToCheckout"
            >
              去结算 ({{ cart.totalCount }}件商品)
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 遮罩层（购物车展开时显示） -->
    <transition name="fade">
      <div 
        v-if="showCartPanel" 
        class="cart-mask fixed inset-0 z-[45] bg-black/40"
        @click="showCartPanel = false"
      ></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ArrowLeft, Star, StarFilled, ShoppingCart, Van, Clock, Ticket, Phone, Share, Location, Delete } from '@element-plus/icons-vue'

export default {
  components: { ArrowLeft, Star, StarFilled, ShoppingCart, Van, Clock, Ticket, Phone, Share, Location, Delete },
}
</script>

<style scoped>
/* 导航栏 */
.merchant-nav {
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text-primary);
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--color-divider);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &--active {
    color: var(--color-warning);
    border-color: var(--color-warning);
    background: rgba(255, 149, 0, 0.08);
  }
  
  &:hover:not(.action-btn--active) {
    border-color: var(--color-text-quaternary);
    background: rgba(0, 0, 0, 0.03);
  }
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    background: rgba(0, 59, 128, 0.08);
    color: #003B80;
  }
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #003B80;
  color: white;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 快捷操作 */
.quick-action-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.08);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

/* 分类标签 */
.category-tabs {
  scrollbar-hide::-webkit-scrollbar { display: none; }
}

.category-tab {
  flex-shrink: 0;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-out;
  
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

/* 菜单项 */
.menu-item {
  display: flex;
  &:hover {
    .menu-item-image img {
      transform: scale(1.05);
    }
  }
}

.food-tag {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  
  &:first-child {
    background: #003B80;
    color: white;
  }
  
  &:last-child {
    background: rgba(0, 59, 128, 0.9);
    color: white;
  }
}

/* 数量控制按钮 */
.qty-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-out;
  
  &--minus {
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e8e8e8;
      color: #333;
    }
  }
  
  &--plus {
    background: linear-gradient(135deg, #003B80, #0052b3);
    color: white;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 59, 128, 0.25);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.qty-value {
  min-width: 28px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text-primary);
}

/* 购物车侧边栏 */
.cart-sidebar {
  max-height: calc(100vh - 140px);
}

.cart-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9px;
  background: #003B80;
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.clear-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cart-item {
  animation: fadeInUp 0.3s ease-out both;
  
  &--highlight {
    animation: highlightFlash 0.6s ease-out;
    background: rgba(0, 59, 128, 0.04);
    box-shadow: 0 0 0 2px rgba(0, 59, 128, 0.1);
  }
}

@keyframes highlightFlash {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 2px rgba(0, 59, 128, 0.3);
    background: rgba(0, 59, 128, 0.08);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 12px rgba(0, 59, 128, 0.2);
    background: rgba(0, 59, 128, 0.12);
  }
  100% {
    transform: scale(1);
    box-shadow: none;
    background: transparent;
  }
}

.qty-btn-sm,
.qty-value-sm {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-background);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.15s ease-out;
  
  &:hover:not(:disabled) {
    background: rgba(0, 59, 128, 0.06);
    border-color: #003B80;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.checkout-btn {
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #003B80, #0052b3);
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 16px rgba(0, 59, 128, 0.35);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #ccc;
  }
}

/* ========== 底部固定购物车栏 ========== */
.fixed-bottom-cart-bar {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
  
  &--empty {
    .cart-info-section {
      opacity: 0.6;
    }
  }
}

.cart-info-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.cart-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #003B80, #0052b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 59, 128, 0.3);
  transition: all 0.3s ease-out;
  
  .fixed-bottom-cart-bar:hover & {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 59, 128, 0.4);
  }
}

.cart-count-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency-symbol {
  font-size: 14px;
  font-weight: 700;
  color: #ff4d4f;
}

.total-price-number {
  font-size: 22px;
  font-weight: 800;
  color: #ff4d4f;
  line-height: 1;
  letter-spacing: -0.02em;
}

.empty-hint {
  font-weight: 500;
}

/* 结算按钮 */
.checkout-button {
  flex-shrink: 0;
  height: 48px;
  padding: 0 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, #003B80, #0052b3);
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.25s ease-out;
  box-shadow: 0 4px 12px rgba(0, 59, 128, 0.3);
  
  &:hover:not(.checkout-button--disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 59, 128, 0.4);
  }
  
  &:active:not(.checkout-button--disabled) {
    transform: translateY(0) scale(0.98);
  }
  
  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background: #999;
    box-shadow: none;
  }
}

/* ========== 购物车详情浮层 ========== */
.cart-panel-overlay {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.cart-panel-container {
  position: relative;
  background: white;
  border-radius: 20px 20px 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .cart-panel-container {
    max-height: 60vh;
  }
}

.cart-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.panel-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  
  &:hover {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.06);
  }
}

.cart-panel-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
  -webkit-overflow-scrolling: touch;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-panel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease-out;
  
  &--highlight {
    animation: panelHighlightFlash 0.6s ease-out;
  }
}

@keyframes panelHighlightFlash {
  0% {
    transform: translateX(0);
    background: rgba(0, 59, 128, 0.1);
    box-shadow: 0 0 0 2px rgba(0, 59, 128, 0.2);
  }
  50% {
    transform: translateX(4px);
    background: rgba(0, 59, 128, 0.15);
    box-shadow: 0 0 16px rgba(0, 59, 128, 0.15);
  }
  100% {
    transform: translateX(0);
    background: #fafafa;
    box-shadow: none;
  }
}

.item-name-price {
  flex: 1;
  min-width: 0;
  margin-right: 16px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-unit-price {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.item-subtotal {
  font-size: 15px;
  font-weight: 700;
  color: #ff4d4f;
}

.item-quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.15s ease-out;
  
  &:hover {
    border-color: #003B80;
    color: #003B80;
    background: rgba(0, 59, 128, 0.04);
  }
  
  &:active {
    transform: scale(0.92);
  }
}

.item-qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  color: var(--color-text-primary);
}

/* 面板底部 */
.cart-panel-footer {
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.footer-pricing {
  margin-bottom: 14px;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  
  &--total {
    padding-top: 10px;
    margin-top: 6px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 16px;
    font-weight: 700;
  }
}

.pricing-label {
  color: var(--color-text-secondary);
}

.pricing-value {
  color: var(--color-text-secondary);
}

.pricing-total-value {
  color: #ff4d4f;
  font-size: 19px;
  font-weight: 800;
}

.panel-checkout-btn {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #003B80, #0052b3);
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.25s ease-out;
  box-shadow: 0 4px 12px rgba(0, 59, 128, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 59, 128, 0.4);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
}

/* 遮罩层 */
.cart-mask {
  backdrop-filter: blur(2px);
}

/* 动画 */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-enter-active {
  animation: fadeInUp 0.3s ease-out both;
}

.list-leave-active {
  animation: fadeOutDown 0.2s ease-in both;
  position: absolute;
}

@keyframes fadeOutDown {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
}

.cart-list-enter-active {
  animation: cartListIn 0.3s ease-out both;
}

.cart-list-leave-active {
  animation: cartListOut 0.2s ease-in both;
}

@keyframes cartListIn {
  from { 
    opacity: 0; 
    transform: translateX(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

@keyframes cartListOut {
  from { 
    opacity: 1; 
    transform: translateX(0); 
  }
  to { 
    opacity: 0; 
    transform: translateX(20px); 
  }
}

/* 浮层面板动画 */
.cart-panel-enter-active {
  animation: cartPanelSlideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cart-panel-leave-active {
  animation: cartPanelSlideDown 0.25s ease-in;
}

@keyframes cartPanelSlideUp {
  from { 
    transform: translateY(100%); 
    opacity: 0;
  }
  to { 
    transform: translateY(0); 
    opacity: 1;
  }
}

@keyframes cartPanelSlideDown {
  from { 
    transform: translateY(0); 
    opacity: 1;
  }
  to { 
    transform: translateY(100%); 
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
