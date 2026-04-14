<script setup lang="ts">
/**
 * 黑科易购 - 全新首页设计 v4.0
 * 
 * 设计理念：
 * - 现代简约风格，突出校园特色
 * - 卡片式布局，信息层次清晰
 * - 微交互动画，提升用户体验
 * - 完全响应式，适配各种设备
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, ArrowRight, Timer, Clock, StarFilled, 
  ShoppingCart, Notebook, MapLocation, ChatDotRound,
  School, Money, CollectionTag, ArrowRightBold
} from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CampusMapBg from '@/components/CampusMapBg.vue'
import StudyElementsBg from '@/components/StudyElementsBg.vue'
import HeroThemeDecoration from '@/components/HeroThemeDecoration.vue'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

// ==================== 响应式状态 ====================
const currentHeroSlide = ref(0)
const isScrolled = ref(false)
const searchKeyword = ref('')
let heroTimer: ReturnType<typeof setInterval> | null = null

// ==================== Hero 轮播数据 ====================
// 校园标志性图片 - 使用黑龙江科技大学官网真实图片
// 新版设计：左侧固定深色区域显示文字，右侧显示校园图片
const heroSlides = [
  {
    id: 1,
    title: '黑科易购',
    subtitle: '一站式校园服务平台',
    description: '外卖 · 购物 · 学工 · 缴费',
    tag: '开学季',
    bgImage: '/images/campus-1.jpg',
    bgPosition: 'center',
    themeColor: 'primary',
    themeDecoration: 'shopping' as const
  },
  {
    id: 2,
    title: '校园外卖',
    subtitle: '满30减5 · 满50减10',
    description: '30分钟送达校园任意角落',
    tag: '热门',
    bgImage: '/images/campus-2.jpg',
    bgPosition: 'center',
    themeColor: 'orange',
    themeDecoration: 'food' as const
  },
  {
    id: 3,
    title: 'AI智慧课堂',
    subtitle: '16门精品课程免费学',
    description: '知识图谱驱动个性化学习',
    tag: '新品',
    bgImage: '/images/campus-3.jpg',
    bgPosition: 'center',
    themeColor: 'violet',
    themeDecoration: 'education' as const
  },
  {
    id: 4,
    title: '智慧校园',
    subtitle: '数字化服务 · 便捷生活',
    description: '课表查询 · 成绩管理 · 图书馆预约',
    tag: '推荐',
    bgImage: '/images/campus-4.jpg',
    bgPosition: 'center',
    themeColor: 'emerald',
    themeDecoration: 'campus' as const
  }
]

// ==================== 快捷入口数据 ====================
const quickActions = [
  { id: 'takeout', name: '校园外卖', icon: '🍔', color: 'bg-orange-50 text-orange-600', path: '/takeout', badge: '满减' },
  { id: 'products', name: '校园商城', icon: '🛍️', color: 'bg-blue-50 text-blue-600', path: '/products', badge: null },
  { id: 'secondhand', name: '二手市场', icon: '♻️', color: 'bg-green-50 text-green-600', path: '/secondhand', badge: null },
  { id: 'affairs', name: '学工办理', icon: '📋', color: 'bg-indigo-50 text-indigo-600', path: '/student-affairs', badge: '在线' },
  { id: 'payment', name: '缴费中心', icon: '💳', color: 'bg-emerald-50 text-emerald-600', path: '/payment', badge: null },
  { id: 'campus', name: '智慧校园', icon: '🏫', color: 'bg-cyan-50 text-cyan-600', path: '/campus/schedule', badge: null },
  { id: 'community', name: '校园社区', icon: '💬', color: 'bg-purple-50 text-purple-600', path: '/community/forum', badge: '99+' },
  { id: 'announcement', name: '通知公告', icon: '📢', color: 'bg-rose-50 text-rose-600', path: '/announcements', badge: null },
]

// ==================== 限时秒杀数据 ====================
const flashSaleProducts = [
  { id: 1, name: '蓝牙耳机 Pro', price: 99, originalPrice: 299, image: '', sold: 85, total: 100 },
  { id: 2, name: '机械键盘 RGB', price: 199, originalPrice: 499, image: '', sold: 62, total: 80 },
  { id: 3, name: '充电宝 20000mAh', price: 59, originalPrice: 129, image: '', sold: 156, total: 200 },
  { id: 4, name: '护眼台灯', price: 79, originalPrice: 199, image: '', sold: 43, total: 60 },
]

// ==================== 校园服务数据 ====================
const campusServices = [
  { 
    id: 'schedule', 
    name: '课表查询', 
    desc: '实时查看课程安排',
    icon: '📅', 
    color: 'from-blue-500 to-cyan-400',
    path: '/campus/schedule'
  },
  { 
    id: 'library', 
    name: '图书馆', 
    desc: '座位预约 · 借阅查询',
    icon: '📚', 
    color: 'from-emerald-500 to-teal-400',
    path: '/campus/library'
  },
  { 
    id: 'grades', 
    name: '成绩查询', 
    desc: 'GPA计算 · 学业分析',
    icon: '📊', 
    color: 'from-violet-500 to-purple-400',
    path: '/campus/grades'
  },
  { 
    id: 'map', 
    name: '校园地图', 
    desc: '3D导航 · 路线规划',
    icon: '🗺️', 
    color: 'from-orange-500 to-amber-400',
    path: '/campus/map'
  },
]

// ==================== 倒计时计算 ====================
const countdown = ref({ hours: 2, minutes: 34, seconds: 15 })

// ==================== 方法 ====================
function startHeroAutoPlay() {
  heroTimer = setInterval(() => {
    currentHeroSlide.value = (currentHeroSlide.value + 1) % heroSlides.length
  }, 5000)
}

function stopHeroAutoPlay() {
  if (heroTimer) {
    clearInterval(heroTimer)
    heroTimer = null
  }
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push(`/products?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

function handleAddToCart(product: any) {
  cartStore.addItem({
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image || '',
    quantity: 1
  })
  ElMessage.success(`已将「${product.name}」加入购物车`)
}

function updateCountdown() {
  if (countdown.value.seconds > 0) {
    countdown.value.seconds--
  } else if (countdown.value.minutes > 0) {
    countdown.value.minutes--
    countdown.value.seconds = 59
  } else if (countdown.value.hours > 0) {
    countdown.value.hours--
    countdown.value.minutes = 59
    countdown.value.seconds = 59
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

// 获取主题色
function getThemeColor(theme: string): string {
  const colors: Record<string, string> = {
    primary: '#000ab0',  // 蓝色
    orange: '#ea580c',   // 橙色
    violet: '#7c3aed',   // 紫色
    emerald: '#059669'   // 绿色
  }
  return colors[theme] || colors.primary
}

// ==================== 生命周期 ====================
onMounted(() => {
  startHeroAutoPlay()
  productStore.fetchHotProducts()
  window.addEventListener('scroll', handleScroll, { passive: true })
  setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  stopHeroAutoPlay()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <main class="home-page">
    <!-- ==================== Hero Section ==================== -->
    <section class="hero-section">
      <div class="hero-slider">
        <TransitionGroup name="hero-slide">
          <div 
            v-for="(slide, index) in heroSlides" 
            :key="slide.id"
            v-show="currentHeroSlide === index"
            class="hero-slide hero-split"
          >
            <!-- 左侧：固定深色背景 + 文字内容 -->
            <div class="hero-left" :style="{ backgroundColor: getThemeColor(slide.themeColor) }">
              <!-- 主题装饰背景 - 根据轮播内容显示不同主题 -->
              <HeroThemeDecoration :theme="slide.themeDecoration" :animated="true" />
              <div class="hero-left-content">
                <span class="hero-tag">{{ slide.tag }}</span>
                <h1 class="hero-title">{{ slide.title }}</h1>
                <p class="hero-subtitle">{{ slide.subtitle }}</p>
                <p class="hero-description">{{ slide.description }}</p>
                <div class="hero-actions">
                  <BaseButton variant="brand" size="lg" @click="$router.push('/products')">
                    立即探索
                    <template #icon><ArrowRight /></template>
                  </BaseButton>
                  <BaseButton variant="outline" size="lg" class="!border-white/50 !text-white hover:!bg-white/20 hover:!border-white">
                    了解更多
                  </BaseButton>
                </div>
                
                <!-- 浮动卡片移到左侧底部 -->
                <div class="hero-cards">
                  <div class="floating-card-mini">
                    <span class="text-xl">🎓</span>
                    <span class="text-xs">学业</span>
                  </div>
                  <div class="floating-card-mini">
                    <span class="text-xl">🍔</span>
                    <span class="text-xs">外卖</span>
                  </div>
                  <div class="floating-card-mini">
                    <span class="text-xl">🛍️</span>
                    <span class="text-xs">商城</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右侧：校园图片 -->
            <div class="hero-right">
              <div class="hero-bg-image" :style="{ backgroundImage: `url(${slide.bgImage})`, backgroundPosition: slide.bgPosition }"></div>
            </div>
          </div>
        </TransitionGroup>
        
        <!-- 轮播指示器 -->
        <div class="hero-indicators">
          <button 
            v-for="(_, index) in heroSlides" 
            :key="index"
            class="indicator"
            :class="{ active: currentHeroSlide === index }"
            @click="currentHeroSlide = index; stopHeroAutoPlay(); startHeroAutoPlay()"
          />
        </div>
      </div>
    </section>

    <!-- ==================== 搜索栏 ==================== -->
    <section class="search-section" :class="{ 'is-sticky': isScrolled }">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input 
            v-model="searchKeyword"
            type="text" 
            placeholder="搜索商品、外卖、校园服务..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <BaseButton variant="brand" size="md" @click="handleSearch">
            搜索
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- ==================== 快捷入口 ==================== -->
    <section class="quick-actions-section">
      <!-- 校园地图背景 -->
      <CampusMapBg primary-color="#000ab0" secondary-color="#3b82f6" :animated="true" />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="quick-actions-grid">
          <div 
            v-for="action in quickActions" 
            :key="action.id"
            class="action-card"
            @click="$router.push(action.path)"
          >
            <span v-if="action.badge" class="action-badge">{{ action.badge }}</span>
            <div class="action-icon" :class="action.color">
              <span class="text-2xl">{{ action.icon }}</span>
            </div>
            <span class="action-name">{{ action.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 限时秒杀 ==================== -->
    <section class="flash-sale-section">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flash-sale-card">
          <!-- 头部 -->
          <div class="flash-header">
            <div class="flex items-center gap-3">
              <div class="flash-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div>
                <h2 class="flash-title">限时秒杀</h2>
                <p class="flash-subtitle">每日10点/20点准时开抢</p>
              </div>
            </div>
            <div class="countdown">
              <span class="countdown-label">距结束</span>
              <div class="countdown-item">{{ String(countdown.hours).padStart(2, '0') }}</div>
              <span class="countdown-sep">:</span>
              <div class="countdown-item">{{ String(countdown.minutes).padStart(2, '0') }}</div>
              <span class="countdown-sep">:</span>
              <div class="countdown-item">{{ String(countdown.seconds).padStart(2, '0') }}</div>
            </div>
          </div>
          
          <!-- 商品列表 -->
          <div class="flash-products">
            <div 
              v-for="product in flashSaleProducts" 
              :key="product.id"
              class="flash-product"
              @click="$router.push(`/products/${product.id}`)"
            >
              <div class="product-image">
                <div class="product-placeholder">
                  <span class="text-3xl">📦</span>
                </div>
                <div class="discount-badge">-{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%</div>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${(product.sold / product.total) * 100}%` }"></div>
                  <span class="progress-text">已抢{{ product.sold }}件</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 热门推荐 ==================== -->
    <section class="hot-products-section">
      <!-- 学习元素背景 -->
      <StudyElementsBg primary-color="#000ab0" secondary-color="#3b82f6" :animated="true" />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-gradient-to-br from-amber-400 to-orange-500">
              <el-icon class="text-white"><StarFilled /></el-icon>
            </div>
            <div>
              <h2 class="section-title">热门推荐</h2>
              <p class="section-subtitle">精选校园好物，品质保证</p>
            </div>
          </div>
          <BaseButton variant="ghost" size="sm" @click="$router.push('/products')">
            查看全部
            <template #icon><ArrowRightBold /></template>
          </BaseButton>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in (productStore.hotProducts || []).slice(0, 8)" 
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </section>

    <!-- ==================== 校园服务 ==================== -->
    <section class="campus-services-section">
      <!-- 校园地图背景 - 使用不同配色 -->
      <CampusMapBg primary-color="#059669" secondary-color="#10b981" :animated="true" />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-gradient-to-br from-emerald-400 to-teal-500">
              <el-icon class="text-white"><School /></el-icon>
            </div>
            <div>
              <h2 class="section-title">校园服务</h2>
              <p class="section-subtitle">便捷校园生活，一键触达</p>
            </div>
          </div>
        </div>
        
        <div class="services-grid">
          <div 
            v-for="service in campusServices" 
            :key="service.id"
            class="service-card"
            @click="$router.push(service.path)"
          >
            <div class="service-bg" :class="`bg-gradient-to-br ${service.color}`"></div>
            <div class="service-content">
              <span class="service-icon">{{ service.icon }}</span>
              <h3 class="service-name">{{ service.name }}</h3>
              <p class="service-desc">{{ service.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 特色功能 ==================== -->
    <section class="features-section">
      <!-- 学习元素背景 - 使用暖色调 -->
      <StudyElementsBg primary-color="#dc2626" secondary-color="#f97316" :animated="true" />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="features-grid">
          <div class="feature-card feature-primary">
            <div class="feature-content">
              <span class="feature-icon">📋</span>
              <h3 class="feature-title">学工办理</h3>
              <p class="feature-desc">请假 · 助学金 · 校园卡</p>
              <BaseButton variant="brand" size="sm" @click="$router.push('/student-affairs')">
                立即办理
              </BaseButton>
            </div>
            <div class="feature-decoration"></div>
          </div>
          
          <div class="feature-card feature-secondary">
            <div class="feature-content">
              <span class="feature-icon">💰</span>
              <h3 class="feature-title">缴费中心</h3>
              <p class="feature-desc">学费 · 住宿费 · 水电费</p>
              <BaseButton variant="brand" size="sm" @click="$router.push('/payment')">
                立即缴费
              </BaseButton>
            </div>
            <div class="feature-decoration"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 校训展示 ==================== -->
    <section class="motto-section">
      <div class="motto-bg"></div>
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="motto-content">
          <p class="motto-en">Heilongjiang University of Science & Technology</p>
          <h2 class="motto-text">厚德博学 · 强吾兴邦</h2>
          <div class="motto-divider"></div>
          <p class="motto-sub">自强不息求发展 · 创业创新创特色</p>
          
          <div class="motto-stats">
            <div class="stat-item">
              <span class="stat-number">77+</span>
              <span class="stat-label">办学年限</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">21000+</span>
              <span class="stat-label">在校学生</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">57</span>
              <span class="stat-label">本科专业</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ==================== 基础变量 ==================== */
.home-page {
  --section-gap: 3rem;
  --card-radius: 1rem;
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== Hero Section ==================== */
.hero-section {
  position: relative;
  height: calc(100vh - 64px);
  min-height: 500px;
  max-height: 600px;
  overflow: hidden;
  margin-top: -64px;
  padding-top: 64px;
}

.hero-slider {
  position: relative;
  height: 100%;
}

/* 新版左右分栏布局 */
.hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
}

.hero-split {
  display: flex;
  flex-direction: row;
}

/* 左侧：固定宽度深色背景区域 */
.hero-left {
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
  overflow: hidden;
}

/* 确保内容在建筑剪影之上 */
.hero-left-content {
  position: relative;
  z-index: 2;
}

.hero-left-content {
  max-width: 480px;
  color: white;
  text-align: left;
}

/* 右侧：校园图片区域 */
.hero-right {
  width: 55%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.hero-right .hero-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-repeat: no-repeat;
}

/* 响应式：移动端改为上下布局 */
@media (max-width: 1024px) {
  .hero-split {
    flex-direction: column;
  }
  
  .hero-left {
    width: 100%;
    height: 60%;
    padding: 1.5rem;
  }
  
  .hero-right {
    width: 100%;
    height: 40%;
  }
  
  .hero-left-content {
    text-align: center;
  }
}

/* 浮动小卡片 */
.hero-cards {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.floating-card-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  min-width: 80px;
  min-height: 70px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.floating-card-mini::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.floating-card-mini:hover {
  background: rgba(255,255,255,0.35);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1);
  border-color: rgba(255,255,255,0.6);
}

.floating-card-mini:hover::before {
  opacity: 1;
}

.floating-card-mini:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

.floating-card-mini span:first-child {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.floating-card-mini:hover span:first-child {
  transform: scale(1.2);
}

.floating-card-mini span:first-child {
  font-size: 1.5rem;
}

/* 背景图案 - 保留作为备用 */
.hero-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  z-index: 2;
}

.pattern-dots {
  background-image: radial-gradient(circle, white 1px, transparent 1px);
  background-size: 20px 20px;
}

.pattern-lines {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.1) 10px,
    rgba(255,255,255,0.1) 20px
  );
}

.pattern-grid {
  background-image: 
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.hero-tag {
  display: inline-block;
  padding: 0.375rem 1rem;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: fadeInUp 0.6s ease-out;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 0.75rem;
  animation: fadeInUp 0.6s ease-out 0.1s both;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.hero-description {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease-out 0.3s both;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}





/* Hero Indicators - 优化轮播指示器 */
.hero-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 20;
  padding: 0.75rem 1.25rem;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.indicator {
  width: 2.5rem;
  height: 0.4rem;
  background: rgba(255,255,255,0.3);
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.indicator::before {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  border-radius: 9999px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.indicator.active {
  background: rgba(255,255,255,0.5);
  width: 3rem;
}

.indicator.active::before {
  transform: scaleX(1);
  animation: indicatorProgress 5s linear;
}

@keyframes indicatorProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Hero Transitions - 优化轮播切换效果 */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slide-enter-from {
  opacity: 0;
}

.hero-slide-leave-to {
  opacity: 0;
}

/* 左侧内容单独动画 */
.hero-slide-enter-active .hero-left-content,
.hero-slide-leave-active .hero-left-content {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slide-enter-from .hero-left-content {
  opacity: 0;
  transform: translateY(20px);
}

.hero-slide-leave-to .hero-left-content {
  opacity: 0;
  transform: translateY(-20px);
}

/* 右侧图片单独动画 */
.hero-slide-enter-active .hero-right,
.hero-slide-leave-active .hero-right {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slide-enter-from .hero-right {
  opacity: 0;
  transform: scale(1.05);
}

.hero-slide-leave-to .hero-right {
  opacity: 0;
  transform: scale(0.95);
}

/* ==================== Search Section ==================== */
.search-section {
  padding: 1.5rem 0;
  background: white;
  transition: var(--transition-smooth);
}

.search-section.is-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 2px solid transparent;
  transition: var(--transition-smooth);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0,10,176,0.1);
}

.search-icon {
  margin-left: 0.75rem;
  color: #94a3b8;
  font-size: 1.25rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem 0;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* ==================== Quick Actions ==================== */
.quick-actions-section {
  position: relative;
  padding: 2rem 0;
  background: white;
  overflow: hidden;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .quick-actions-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.action-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.action-card:hover {
  background: #f8fafc;
  transform: translateY(-4px);
}

.action-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  border-radius: 9999px;
}

.action-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  transition: var(--transition-smooth);
}

.action-card:hover .action-icon {
  transform: scale(1.1);
}

.action-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* ==================== Flash Sale ==================== */
.flash-sale-section {
  padding: var(--section-gap) 0;
  background: linear-gradient(135deg, #fef3f2 0%, #fff5eb 100%);
}

.flash-sale-card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(239,68,68,0.1);
}

.flash-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.flash-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ef4444, #f97316);
  border-radius: 1rem;
  color: white;
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.flash-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.flash-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.countdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.countdown-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-right: 0.5rem;
}

.countdown-item {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111827;
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  border-radius: 0.5rem;
}

.countdown-sep {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.flash-products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .flash-products {
    grid-template-columns: repeat(4, 1fr);
  }
}

.flash-product {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 1rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.flash-product:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.product-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  border-radius: 0.75rem;
}

.discount-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 9999px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ef4444;
}

.original-price {
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.progress-bar {
  position: relative;
  height: 1.25rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #ef4444, #f97316);
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.progress-text {
  position: relative;
  z-index: 1;
  display: block;
  text-align: center;
  font-size: 0.625rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.25rem;
}

/* ==================== Hot Products ==================== */
.hot-products-section {
  position: relative;
  padding: var(--section-gap) 0;
  background: white;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ==================== Campus Services ==================== */
.campus-services-section {
  position: relative;
  padding: var(--section-gap) 0;
  background: #f8fafc;
  overflow: hidden;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.service-card {
  position: relative;
  height: 180px;
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.service-bg {
  position: absolute;
  inset: 0;
  opacity: 0.9;
}

.service-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: white;
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.service-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.service-desc {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* ==================== Features Section ==================== */
.features-section {
  position: relative;
  padding: var(--section-gap) 0;
  background: white;
  overflow: hidden;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feature-card {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: center;
}

.feature-primary {
  background: linear-gradient(135deg, #000ab0 0%, #3b82f6 100%);
  color: white;
}

.feature-secondary {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
}

.feature-content {
  position: relative;
  z-index: 1;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-desc {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.feature-decoration {
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

/* ==================== Motto Section ==================== */
.motto-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
}

.motto-bg {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(245,158,11,0.1) 0%, transparent 50%);
}

.motto-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.motto-en {
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1rem;
}

.motto-text {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.motto-divider {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #fbbf24, transparent);
  margin: 0 auto 1.5rem;
}

.motto-sub {
  font-size: 1.125rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 3rem;
}

.motto-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.6);
}

.stat-divider {
  width: 1px;
  height: 3rem;
  background: rgba(255,255,255,0.2);
}

/* ==================== Animations ==================== */
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

/* ==================== Responsive ==================== */

/* 平板端适配 */
@media (max-width: 1024px) {
  .hero-section {
    height: auto;
    min-height: 400px;
    max-height: none;
  }
  
  .hero-split {
    flex-direction: column;
  }
  
  .hero-left {
    width: 100%;
    height: 55%;
    min-height: 280px;
    padding: 1.5rem;
  }
  
  .hero-right {
    width: 100%;
    height: 45%;
    min-height: 200px;
  }
  
  .hero-left-content {
    text-align: center;
    max-width: 100%;
  }
  
  .hero-cards {
    justify-content: center;
  }
  
  .hero-title {
    font-size: clamp(2rem, 6vw, 3rem);
  }
  
  .hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.3rem);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
    margin-top: -56px;
    padding-top: 56px;
  }
  
  .hero-left {
    height: 65%;
    min-height: 350px;
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 4rem;
  }
  
  .hero-right {
    height: 35%;
    min-height: 180px;
  }
  
  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-description {
    font-size: 0.875rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .hero-actions .el-button {
    width: 100%;
    justify-content: center;
  }
  
  .hero-cards {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .floating-card-mini {
    min-width: 70px;
    min-height: 60px;
    padding: 0.75rem 1rem;
  }
  
  .floating-card-mini span:first-child {
    font-size: 1.25rem;
  }
  
  .floating-card-mini span:last-child {
    font-size: 0.75rem;
  }
  
  .hero-indicators {
    bottom: 1rem;
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }
  
  .indicator {
    width: 2rem;
    height: 0.35rem;
  }
  
  .indicator.active {
    width: 2.5rem;
  }
  
  .flash-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .motto-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-divider {
    width: 3rem;
    height: 1px;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }
  
  .action-card {
    padding: 0.75rem 0.25rem;
  }
  
  .action-icon {
    width: 3rem;
    height: 3rem;
  }
  
  .action-name {
    font-size: 0.75rem;
  }
}

/* 小屏手机适配 */
@media (max-width: 480px) {
  .hero-left {
    padding-top: 3.5rem;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .hero-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
  
  .hero-cards {
    gap: 0.5rem;
  }
  
  .floating-card-mini {
    min-width: 60px;
    min-height: 50px;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
  }
  
  .floating-card-mini span:first-child {
    font-size: 1.1rem;
  }
  
  .floating-card-mini span:last-child {
    font-size: 0.7rem;
  }
}
</style>
