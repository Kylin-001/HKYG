<script setup lang="ts">
/**
 * 商品详情页 - 电商级产品展示体验 v3.0
 * 应用新设计令牌系统，打造视觉冲击力强、交互流畅的商品详情页
 * 符合 WCAG 2.1 AA 标准，支持响应式布局和键盘导航
 */
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { gsap } from 'gsap'
import Skeleton from '@/components/Skeleton.vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

// ====== 设计令牌导入 ======
import { lightColorTokens as colors } from '@/tokens/colors'
import { typographyTokens } from '@/tokens/typography'
import { borderRadiusTokens, shadowTokens } from '@/tokens/spacing'
import { transitionPresets } from '@/tokens/animation'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

// ====== 响应式状态 ======
const currentImageIndex = ref(0)
const selectedQuantity = ref(1)
const selectedSpecKey = ref<string>('')
const selectedSpecValue = ref<string>('')
const activeTab = ref('detail')
const expandedFaq = ref<number[]>([])
const showLightbox = ref(false)
const cartBtnRef = ref<HTMLElement | null>(null)
const isAddingToCart = ref(false)
const showBackToTop = ref(false)
const isFavorite = ref(false)
const showShareMenu = ref(false)
const imageZoomPosition = ref({ x: 0, y: 0 })
const isImageZoomed = ref(false)

// 滚动相关状态
const scrollY = ref(0)
const showMobileActionBar = ref(false)

// 接口定义
interface SpecOption {
  label: string
  value: string
  price?: number
  stock?: number
}

interface Review {
  id: number
  user: string
  avatar: string
  rating: number
  date: string
  content: string
  images?: string[]
  spec: string
  helpful: number
}

// 动态规格：优先从商品数据读取，fallback 到默认
const dynamicSpecs = computed<Record<string, SpecOption[]>>(() => {
  const p = product.value
  if (p?.specs && Object.keys(p.specs).length > 0) {
    return p.specs as unknown as Record<string, SpecOption[]>
  }
  return {
    '规格': [
      { label: '默认', value: 'default', price: p?.price || 0 },
    ]
  }
})

const specKeys = computed(() => Object.keys(dynamicSpecs.value))

// 当前选中规格对应的价格（联动）
const currentPrice = computed(() => {
  if (!product.value) return 0
  if (!selectedSpecKey.value || !selectedSpecValue.value) return product.value.price
  const options = dynamicSpecs.value[selectedSpecKey.value]
  const found = options?.find(o => o.value === selectedSpecValue.value)
  return found?.price || product.value.price
})

// 当前库存
const currentStock = computed(() => {
  if (!product.value) return 0
  if (!selectedSpecKey.value || !selectedSpecValue.value) return product.value.stock ?? 999
  const options = dynamicSpecs.value[selectedSpecKey.value]
  const found = options?.find(o => o.value === selectedSpecValue.value)
  return found?.stock ?? product.value.stock ?? 999
})

const inStock = computed(() => currentStock.value > 0)

// 库存紧张提示（<10件时显示）
const isLowStock = computed(() => currentStock.value > 0 && currentStock.value < 10)

// 折扣计算
const discount = computed(() => {
  if (!product.value || !product.value.originalPrice) return 0
  return Math.round((1 - currentPrice.value / product.value.originalPrice) * 100)
})

// 省钱金额
const savingsAmount = computed(() => {
  if (!product.value || !product.value.originalPrice || currentPrice.value >= product.value.originalPrice) return 0
  return product.value.originalPrice - currentPrice.value
})

// 评价数据
const reviewBars = [
  { stars: 5, percent: 78, count: 998 },
  { stars: 4, percent: 15, count: 192 },
  { stars: 3, percent: 5, count: 64 },
  { stars: 2, percent: 1.5, count: 19 },
  { stars: 1, percent: 0.5, count: 7 }
]

const reviews = ref<Review[]>([
  { id: 1, user: '数码爱好者小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11&size=80', rating: 5, date: '2026-03-28', content: '降噪效果非常棒！在图书馆学习完全听不到周围的声音。通透模式也很自然，戴着走路不会觉得闷。续航比上一代有明显提升，充电盒手感也很好。强烈推荐！', images: [], spec: '默认', helpful: 234 },
  { id: 2, user: '音乐发烧友', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5&size=80', rating: 5, date: '2026-03-20', content: '音质提升明显，低频更有质感了。空间音频看电影和听歌都很震撼，感觉声音是从四面八方传来的。H2芯片确实不是盖的，值得升级！', spec: '默认', helpful: 189 },
  { id: 3, user: '考研党小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8&size=80', rating: 4, date: '2026-03-15', content: '整体很满意，降噪效果一流。唯一的小缺点是佩戴时间超过4小时耳朵会有些许不适，建议每隔一段时间摘下来休息一下。其他方面完美！', spec: '默认', helpful: 156 },
  { id: 4, user: '运动达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15&size=80', rating: 5, date: '2026-03-08', content: '跑步时戴着完全不会掉，IPX4防水出汗也不怕。触控操作很方便，不用掏手机就能切歌调音量。已经推荐给身边好几个朋友了~', spec: '默认', helpful: 98 },
])

// 常见问题
const faqList = [
  { q: '这个商品有保修吗？', a: '本平台所有商品均享受官方正品保障，支持7天无理由退换货，具体保修政策以商品详情页说明为准。' },
  { q: '配送需要多长时间？', a: '校园内订单通常1-2小时内送达，校外订单根据距离2-5天不等。支持到店自取和快递配送两种方式。' },
  { q: '可以货到付款吗？', a: '目前支持在线支付（微信/支付宝）和货到付款两种方式，下单时可选。' },
  { q: '如何申请退款？', a: '在"我的订单"中找到对应订单，点击"申请退款"，填写退款原因即可。审核通过后1-3个工作日原路退回。' },
  { q: '支持以旧换新吗？', a: '部分电子产品支持以旧换新服务，可在商品详情页查看是否支持及具体折抵金额。' },
]

// 商品数据和加载状态
const product = computed(() => productStore.detail)
const loading = computed(() => productStore.loading)

// ====== 图片操作函数 ======

/**
 * 选择缩略图并切换主图
 */
function selectImage(index: number) {
  if (index === currentImageIndex.value) return
  currentImageIndex.value = index
}

/**
 * 切换上一张/下一张图片
 */
function changeImage(direction: 'prev' | 'next') {
  if (!product.value?.images) return
  const total = product.value.images.length
  if (direction === 'prev') {
    currentImageIndex.value = (currentImageIndex.value - 1 + total) % total
  } else {
    currentImageIndex.value = (currentImageIndex.value + 1) % total
  }
}

/**
 * 打开图片灯箱
 */
function openLightbox() {
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

/**
 * 关闭图片灯箱
 */
function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
}

/**
 * 鼠标悬停放大效果
 */
function handleImageZoom(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  imageZoomPosition.value = { x, y }
}

// ====== 规格选择函数 ======

/**
 * 选择商品规格
 */
function selectSpec(key: string, option: SpecOption) {
  if ((option.stock ?? 999) <= 0) return
  selectedSpecKey.value = key
  selectedSpecValue.value = option.value

  // 规格选择动画反馈
  nextTick(() => {
    // 可以添加弹性动画效果
  })
}

// ====== 数量控制函数 ======

/**
 * 减少数量
 */
function decreaseQuantity() {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--
  }
}

/**
 * 增加数量
 */
function increaseQuantity() {
  const maxStock = Math.min(currentStock.value, 99)
  if (selectedQuantity.value < maxStock) {
    selectedQuantity.value++
  }
}

// ====== 购物车操作 ======

/**
 * 添加到购物车（带飞入动画）
 */
async function addToCart(event: MouseEvent) {
  if (!product.value || isAddingToCart.value) return
  if (!inStock.value) { ElMessage.warning('该规格暂无库存'); return }

  isAddingToCart.value = true

  try {
    await cartStore.addItem(product.value.id, selectedQuantity.value)

    // 飞入购物车动画
    const btn = (event.currentTarget as HTMLElement)
    const rect = btn.getBoundingClientRect()
    const flyEl = document.createElement('div')
    flyEl.innerHTML = '<span style="font-size:18px;font-weight:bold;color:#000AB0">🛍</span>'
    flyEl.style.cssText = `position:fixed;z-index:99999;left:${rect.left + rect.width / 2}px;top:${rect.top}px;pointer-events:none;`
    document.body.appendChild(flyEl)

    const cartIcon = document.querySelector('.header-cart-icon') as HTMLElement
    const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { right: window.innerWidth - 40, top: 16 }

    gsap.to(flyEl, {
      x: targetRect.right - rect.left - rect.width / 2,
      y: targetRect.top - rect.top,
      scale: 0.3,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.in',
      onComplete: () => {
        flyEl.remove()
        if (cartIcon) {
          gsap.fromTo(cartIcon, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
        }
      }
    })

    ElMessage.success(`${product.value.name} 已加入购物车`)
  } catch (err: any) {
    ElMessage.error(err.message || '添加购物车失败')
  } finally {
    setTimeout(() => { isAddingToCart.value = false }, 700)
  }
}

/**
 * 立即购买
 */
function buyNow() {
  router.push('/orders/checkout')
}

// ====== 收藏功能 ======

/**
 * 切换收藏状态
 */
function toggleFavorite() {
  isFavorite.value = !isFavorite.value

  // 保存到 localStorage
  const favorites = JSON.parse(localStorage.getItem('product_favorites') || '[]')
  if (isFavorite.value && product.value) {
    if (!favorites.includes(product.value.id)) {
      favorites.push(product.value.id)
    }
    ElMessage.success('已添加到收藏')
  } else if (product.value) {
    const index = favorites.indexOf(product.value.id)
    if (index > -1) {
      favorites.splice(index, 1)
    }
    ElMessage.info('已取消收藏')
  }
  localStorage.setItem('product_favorites', JSON.stringify(favorites))

  // 心形动画
  nextTick(() => {
    // 可以添加心跳动画
  })
}

// ====== 分享功能 ======

/**
 * 切换分享菜单
 */
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value
}

/**
 * 复制链接
 */
async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
    showShareMenu.value = false
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

/**
 * 分享到微信（模拟）
 */
function shareToWechat() {
  ElMessage.info('请截图分享给好友')
  showShareMenu.value = false
}

// ====== FAQ 操作 ======

/**
 * 切换FAQ展开/收起
 */
function toggleFaq(index: number) {
  const idx = expandedFaq.value.indexOf(index)
  if (idx >= 0) expandedFaq.value.splice(idx, 1)
  else expandedFaq.value.push(index)
}

// ====== 滚动处理 ======

/**
 * 处理滚动事件
 */
function handleScroll() {
  scrollY.value = window.scrollY
  showBackToTop.value = scrollY.value > 300
  showMobileActionBar.value = scrollY.value > 400
}

/**
 * 返回顶部
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 滚动到客服区域
 */
function scrollToCustomerService(): void {
  const serviceEl = document.querySelector('.contact-service-card')
  if (serviceEl) {
    serviceEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
}

// ====== 浏览历史记录 ======

/**
 * 保存浏览历史到localStorage
 */
function saveBrowsingHistory() {
  if (!product.value) return

  const history = JSON.parse(localStorage.getItem('browsing_history') || '[]')
  const existingIndex = history.findIndex((item: any) => item.id === product.value!.id)

  if (existingIndex > -1) {
    history.splice(existingIndex, 1)
  }

  history.unshift({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images[0],
    timestamp: Date.now()
  })

  // 只保留最近50条记录
  if (history.length > 50) {
    history.pop()
  }

  localStorage.setItem('browsing_history', JSON.stringify(history))
}

// ====== Tab 切换带滑动动画 ======

/**
 * 切换Tab
 */
function switchTab(tab: string) {
  activeTab.value = tab
}

// ====== 页面入场动画 ======

/**
 * 执行页面入场动画
 */
function playEntranceAnimation() {
  // 使用 GSAP 创建 staggered 入场动画
  gsap.from('.breadcrumb', {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.out'
  })

  gsap.from('.product-gallery', {
    opacity: 0,
    x: -30,
    duration: 0.6,
    delay: 0.1,
    ease: 'power2.out'
  })

  gsap.from('.product-info', {
    opacity: 0,
    x: 30,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out'
  })

  gsap.from('.detail-tabs-container', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.3,
    ease: 'power2.out'
  })
}

// ====== 生命周期钩子 ======

onMounted(async () => {
  const productId = route.params.id as string

  try {
    await productStore.fetchDetail(productId)

    // 自动选择第一个规格
    if (specKeys.value.length > 0) {
      const firstKey = specKeys.value[0]
      const options = dynamicSpecs.value[firstKey]
      if (options?.length > 0) {
        selectedSpecKey.value = firstKey
        selectedSpecValue.value = options[0].value
      }
    }

    // 检查是否已收藏
    if (product.value) {
      const favorites = JSON.parse(localStorage.getItem('product_favorites') || '[]')
      isFavorite.value = favorites.includes(product.value.id)

      // 保存浏览历史
      saveBrowsingHistory()

      // 播放入场动画
      nextTick(() => {
        playEntranceAnimation()
      })
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取商品详情失败')
  }

  // 监听滚动事件
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 恢复body滚动
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="product-detail-page-v3">
    <!-- ====== 骨架屏加载状态 ====== -->
    <div v-if="loading" class="detail-container">
      <div class="grid-layout">
        <Skeleton type="image" class="gallery-skeleton" />
        <div class="info-skeleton space-y-6">
          <Skeleton type="heading" width="80%" height="32px" />
          <Skeleton :rows="2" />
          <div class="flex gap-4">
            <Skeleton type="button" width="160px" height="52px" />
            <Skeleton type="button" width="120px" height="52px" />
          </div>
          <Skeleton type="paragraph" :rows="4" />
        </div>
      </div>
    </div>

    <!-- ====== 主内容区域 ====== -->
    <template v-else-if="product">
      <div class="detail-container">

        <!-- ========== 面包屑导航 ========== -->
        <nav class="breadcrumb" aria-label="面包屑导航">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">首页</router-link>
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">/</li>
            <li class="breadcrumb-item">
              <router-link to="/products" class="breadcrumb-link">全部商品</router-link>
            </li>
            <li v-if="product.category" class="breadcrumb-separator" aria-hidden="true">/</li>
            <li v-if="product.category" class="breadcrumb-item">
              <router-link :to="`/products?category=${product.category}`" class="breadcrumb-link">{{ product.category }}</router-link>
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">/</li>
            <li class="breadcrumb-item breadcrumb-item--current" aria-current="page">
              {{ product.name }}
            </li>
          </ol>
        </nav>

        <!-- ========== 主体两栏布局 ========== -->
        <div class="grid-layout">

          <!-- 左侧：商品图片展示区 (50-55%宽度) -->
          <section class="product-gallery" aria-label="商品图片展示">

            <!-- 主图展示区 -->
            <div
              class="gallery-main"
              @mouseenter="isImageZoomed = true"
              @mouseleave="isImageZoomed = false"
              @mousemove="handleImageZoom"
              @click="openLightbox"
              role="button"
              tabindex="0"
              aria-label="点击查看大图"
            >
              <!-- 图片容器 -->
              <div class="image-wrapper">
                <img
                  :src="product.images[currentImageIndex]"
                  :alt="`${product.name} - 第${currentImageIndex + 1}张`"
                  loading="lazy"
                  :class="['main-image', { 'image-zoomed': isImageZoomed }]"
                  :style="isImageZoomed ? {
                    transformOrigin: `${imageZoomPosition.x}% ${imageZoomPosition.y}%`
                  } : {}"
                />

                <!-- Shimmer 骨架屏加载效果 -->
                <div class="shimmer-overlay"></div>
              </div>

              <!-- 折扣标签 -->
              <div v-if="discount > 0" class="discount-badge" aria-label="折扣{{ discount }}%">
                {{ discount }}% OFF
              </div>

              <!-- 库存紧张标签 -->
              <div v-if="isLowStock" class="low-stock-badge" aria-label="库存紧张">
                仅剩 {{ currentStock }} 件
              </div>

              <!-- 图片切换按钮 -->
              <button
                v-if="product.images.length > 1"
                class="gallery-nav gallery-nav--prev"
                @click.stop="changeImage('prev')"
                aria-label="上一张图片"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <button
                v-if="product.images.length > 1"
                class="gallery-nav gallery-nav--next"
                @click.stop="changeImage('next')"
                aria-label="下一张图片"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              <!-- 图片计数器 -->
              <div v-if="product.images.length > 1" class="image-counter" aria-live="polite">
                {{ currentImageIndex + 1 }} / {{ product.images.length }}
              </div>

              <!-- 放大提示 -->
              <div class="zoom-hint" v-show="!isImageZoomed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                  <path d="M11 8v6M8 11h6"/>
                </svg>
                <span>悬停放大</span>
              </div>
            </div>

            <!-- 缩略图列表 -->
            <div v-if="product.images.length > 1" class="thumbnail-container">
              <div class="thumbnail-list" role="tablist" aria-label="商品图片列表">
                <button
                  v-for="(image, index) in product.images.slice(0, 6)"
                  :key="index"
                  :class="['thumbnail-item', { 'thumbnail-item--active': index === currentImageIndex }]"
                  :role="'tab'"
                  :aria-selected="index === currentImageIndex"
                  :aria-label="`查看第${index + 1}张图片`"
                  @click="selectImage(index)"
                >
                  <img
                    :src="image"
                    :alt="`缩略图 ${index + 1}`"
                    loading="lazy"
                    class="thumbnail-image"
                  />
                </button>
              </div>

              <!-- 缩略图左右箭头（超过可见数量时显示） -->
              <button
                v-if="product.images.length > 6"
                class="thumbnail-arrow thumbnail-arrow--left"
                aria-label="向左滚动"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                v-if="product.images.length > 6"
                class="thumbnail-arrow thumbnail-arrow--right"
                aria-label="向右滚动"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </section>

          <!-- 右侧：商品信息区 (45-50%宽度) -->
          <aside class="product-info" aria-label="商品信息">

            <!-- 操作按钮组（收藏/分享） -->
            <div class="action-toolbar">
              <button
                :class="['toolbar-btn', { 'toolbar-btn--active': isFavorite }]"
                @click="toggleFavorite"
                :aria-label="isFavorite ? '取消收藏' : '添加收藏'"
                :aria-pressed="isFavorite"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>

              <div class="share-menu-wrapper">
                <button
                  class="toolbar-btn"
                  @click="toggleShareMenu"
                  aria-label="分享商品"
                  aria-haspopup="true"
                  :aria-expanded="showShareMenu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>

                <!-- 下拉分享菜单 -->
                <Transition name="dropdown">
                  <div v-if="showShareMenu" class="share-dropdown" role="menu">
                    <button class="share-option" @click="shareToWechat" role="menuitem">
                      <span class="share-icon wechat-icon">微</span>
                      <span>分享到微信</span>
                    </button>
                    <button class="share-option" @click="copyShareLink" role="menuitem">
                      <span class="share-icon link-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      </span>
                      <span>复制链接</span>
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- 商品标题（使用 h1 语义标签） -->
            <h1 class="product-title" data-testid="product-name">
              {{ product.name }}
            </h1>

            <!-- 评分和销量信息 -->
            <div class="product-meta">
              <div class="rating-section">
                <div class="star-rating" :aria-label="`评分 ${product.rating} 星`">
                  <svg v-for="i in 5" :key="i"
                       width="16" height="16"
                       viewBox="0 0 24 24"
                       :fill="i <= Math.floor(product.rating) ? '#F59E0B' : 'none'"
                       stroke="#F59E0B"
                       stroke-width="2"
                       class="star-icon">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <span class="rating-value">{{ product.rating }}</span>
                <span class="review-count">({{ product.reviewCount }}条评价)</span>
              </div>

              <div class="sales-info">
                已售 {{ product.sales > 10000 ? `${(product.sales / 10000).toFixed(1)}万` : product.sales }}
              </div>
            </div>

            <!-- 价格区域（重点视觉强化） -->
            <div class="price-section" aria-label="价格信息">
              <div class="price-main">
                <span class="currency-symbol">¥</span>
                <span class="current-price">{{ currentPrice.toFixed(2) }}</span>

                <!-- 原价（使用 del 标签） -->
                <del v-if="product.originalPrice && currentPrice < product.originalPrice" class="original-price">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </del>

                <!-- 折扣标签（pill形状） -->
                <span v-if="discount > 0" class="discount-tag">
                  省¥{{ savingsAmount.toFixed(0) }}
                </span>
              </div>

              <!-- 优惠信息标签 -->
              <div class="promo-tags">
                <span class="promo-tag promo-tag--free-shipping">包邮</span>
                <span class="promo-tag promo-tag--guarantee">正品保证</span>
                <span class="promo-tag promo-tag--return">7天退换</span>
                <span v-if="discount >= 20" class="promo-tag promo-tag--sale">限时特惠</span>
              </div>

              <!-- 库存信息 -->
              <div class="stock-info">
                <span :class="['stock-status', { 'stock-status--low': isLowStock, 'stock-status--out': !inStock }]">
                  {{ inStock ? (isLowStock ? `⚠️ 库存紧张，仅剩 ${currentStock} 件` : `✅ 库存充足 (${currentStock}件)`) : '❌ 暂无库存' }}
                </span>
              </div>
            </div>

            <!-- 规格选择（动态渲染） -->
            <div
              v-for="key in specKeys"
              :key="key"
              class="spec-section"
              role="radiogroup"
              :aria-label="`选择${key}`"
            >
              <h4 class="spec-title">{{ key }}</h4>
              <div class="spec-options">
                <button
                  v-for="option in dynamicSpecs[key]"
                  :key="option.value"
                  :class="[
                    'spec-option',
                    {
                      'spec-option--selected': selectedSpecValue === option.value,
                      'spec-option--disabled': (option.stock ?? 999) <= 0
                    }
                  ]"
                  role="radio"
                  :aria-checked="selectedSpecValue === option.value"
                  :disabled="(option.stock ?? 999) <= 0"
                  @click="selectSpec(key, option)"
                >
                  <span class="spec-option-label">{{ option.label }}</span>
                  <span v-if="option.price !== undefined" class="spec-option-price">¥{{ option.price }}</span>

                  <!-- 选中状态的勾选图标 -->
                  <svg
                    v-if="selectedSpecValue === option.value"
                    class="check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>

                  <!-- 缺货标记 -->
                  <span v-if="option.stock !== undefined && option.stock <= 0" class="out-of-stock-mark">缺货</span>
                </button>
              </div>
            </div>

            <!-- 数量选择器 -->
            <div class="quantity-section">
              <label for="quantity-input" class="quantity-label">数量</label>
              <div class="quantity-selector" role="group" aria-label="商品数量">
                <button
                  class="qty-btn qty-btn--decrease"
                  :disabled="selectedQuantity <= 1"
                  @click="decreaseQuantity"
                  aria-label="减少数量"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>

                <input
                  id="quantity-input"
                  type="number"
                  :value="selectedQuantity"
                  :min="1"
                  :max="Math.min(currentStock, 99)"
                  class="qty-input"
                  aria-label="商品数量"
                  readonly
                />

                <button
                  class="qty-btn qty-btn--increase"
                  :disabled="selectedQuantity >= Math.min(currentStock, 99)"
                  @click="increaseQuantity"
                  aria-label="增加数量"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
              <span class="quantity-hint">(库存{{ Math.min(currentStock, 99) }}件)</span>
            </div>

            <!-- 主要操作按钮组 -->
            <div class="action-buttons">
              <!-- 加入购物车按钮（次要按钮） -->
              <button
                ref="cartBtnRef"
                :class="['btn-action btn-add-cart', { 'btn-action--loading': isAddingToCart }]"
                :disabled="!inStock || isAddingToCart"
                @click="addToCart($event)"
                aria-label="加入购物车"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'animate-bounce': isAddingToCart }">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span>{{ isAddingToCart ? '添加中...' : (inStock ? '加入购物车' : '暂无库存') }}</span>
              </button>

              <!-- 立即购买按钮（主按钮 - 品牌渐变） -->
              <button
                :class="['btn-action btn-buy-now']"
                :disabled="!inStock"
                @click="buyNow"
                aria-label="立即购买"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>立即购买</span>
              </button>
            </div>

            <!-- 商品保障信息（图标列表） -->
            <div class="service-guarantees" aria-label="服务保障">
              <div class="guarantee-item">
                <div class="guarantee-icon guarantee-icon--authentic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <span class="guarantee-text">正品保证</span>
              </div>

              <div class="guarantee-item">
                <div class="guarantee-icon guarantee-icon--return">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                  </svg>
                </div>
                <span class="guarantee-text">7天无理由退换</span>
              </div>

              <div class="guarantee-item">
                <div class="guarantee-icon guarantee-icon--shipping">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <span class="guarantee-text">极速发货</span>
              </div>

              <div class="guarantee-item">
                <div class="guarantee-icon guarantee-icon--service">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <span class="guarantee-text">售后保障</span>
              </div>
            </div>

            <!-- 商品举报链接 -->
            <div class="report-link">
              <button class="report-btn" aria-label="举报此商品">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>举报商品</span>
              </button>
            </div>
          </aside>
        </div>

        <!-- ========== 底部Tab内容区 ========== -->
        <div class="detail-tabs-container">

          <!-- Tab导航栏 -->
          <nav class="tabs-nav" role="tablist" aria-label="商品详情选项卡">
            <button
              v-for="tab in [
                { key: 'detail', label: '商品详情', icon: 'detail' },
                { key: 'reviews', label: `用户评价(${product.reviewCount}+)`, icon: 'reviews' },
                { key: 'after-sale', label: '售后服务', icon: 'service' }
              ]"
              :key="tab.key"
              :class="['tab-button', { 'tab-button--active': activeTab === tab.key }]"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :aria-controls="`tabpanel-${tab.key}`"
              :id="`tab-${tab.key}`"
              @click="switchTab(tab.key)"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <!-- 下划线指示器 -->
              <span v-if="activeTab === tab.key" class="tab-indicator"></span>
            </button>
          </nav>

          <!-- Tab内容区域 -->
          <div class="tab-content-wrapper">

            <!-- 商品详情 TabPanel -->
            <section
              v-show="activeTab === 'detail'"
              id="tabpanel-detail"
              role="tabpanel"
              aria-labelledby="tab-detail"
              class="tab-panel"
            >
              <div class="rich-content" v-html="product.description"></div>
            </section>

            <!-- 用户评价 TabPanel -->
            <section
              v-show="activeTab === 'reviews'"
              id="tabpanel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              class="tab-panel"
            >
              <!-- 评分统计卡片 -->
              <div class="review-summary-card">
                <div class="rating-overview">
                  <div class="rating-score">{{ product.rating }}</div>
                  <div class="star-display">
                    <svg v-for="i in 5" :key="i"
                         width="20" height="20"
                         viewBox="0 0 24 24"
                         :fill="i <= Math.floor(product.rating) ? '#F59E0B' : 'none'"
                         stroke="#F59E0B"
                         stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div class="total-reviews">{{ product.reviewCount }}条评价</div>
                </div>

                <div class="rating-bars">
                  <div v-for="bar in reviewBars" :key="bar.stars" class="rating-bar-row">
                    <span class="bar-label">{{ bar.stars }}星</span>
                    <div class="bar-track">
                      <div class="bar-fill" :style="{ width: bar.percent + '%' }"></div>
                    </div>
                    <span class="bar-count">{{ bar.count }}</span>
                  </div>
                </div>
              </div>

              <!-- 评价筛选 -->
              <div class="review-filters">
                <button
                  v-for="filter in ['全部', '好评', '中评', '差评']"
                  :key="filter"
                  :class="['filter-btn']"
                >
                  {{ filter }}
                </button>
              </div>

              <!-- 评价列表 -->
              <div class="reviews-list">
                <article v-for="review in reviews" :key="review.id" class="review-card">
                  <header class="review-header">
                    <img :src="review.avatar" :alt="`${review.user}的头像`" class="reviewer-avatar" width="40" height="40" />
                    <div class="reviewer-info">
                      <div class="reviewer-name">{{ review.user }}</div>
                      <div class="review-date">{{ review.date }}</div>
                    </div>
                    <div class="review-rating-stars">
                      <svg v-for="i in 5" :key="i"
                           width="14" height="14"
                           viewBox="0 0 24 24"
                           :fill="i <= review.rating ? '#F59E0B' : 'none'"
                           stroke="#F59E0B"
                           stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                  </header>

                  <div class="review-content">{{ review.content }}</div>

                  <div v-if="review.images && review.images.length" class="review-images">
                    <img
                      v-for="(img, i) in review.images"
                      :key="i"
                      :src="img"
                      :alt="`评价图片${i + 1}`"
                      class="review-image"
                      loading="lazy"
                    />
                  </div>

                  <footer class="review-footer">
                    <span class="review-spec">规格: {{ review.spec }}</span>
                    <span class="review-helpful">{{ review.helpful }}人觉得有用</span>
                  </footer>
                </article>
              </div>

              <!-- 加载更多按钮 -->
              <div class="load-more-container">
                <button class="load-more-btn">加载更多评价</button>
              </div>
            </section>

            <!-- 售后服务 TabPanel -->
            <section
              v-show="activeTab === 'after-sale'"
              id="tabpanel-after-sale"
              role="tabpanel"
              aria-labelledby="tab-after-sale"
              class="tab-panel"
            >
              <!-- 退换货政策说明 -->
              <div class="after-sale-content">
                <div class="policy-card">
                  <h3 class="policy-title">退换货政策</h3>
                  <ul class="policy-list">
                    <li class="policy-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span><strong>7天无理由退换：</strong>收到商品之日起7天内，可申请无理由退货或换货</span>
                    </li>
                    <li class="policy-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span><strong>15天质量问题换货：</strong>如出现质量问题，15天内免费更换新品</span>
                    </li>
                    <li class="policy-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span><strong>正品保障：</strong>所有商品均为官方正品，假一赔十</span>
                    </li>
                    <li class="policy-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span><strong>极速退款：</strong>审核通过后1-3个工作日原路退回</span>
                    </li>
                  </ul>
                </div>

                <!-- 联系客服入口 -->
                <div class="contact-service-card">
                  <div class="service-icon-large">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div class="service-info">
                    <h4 class="service-title">需要帮助？</h4>
                    <p class="service-desc">我们的客服团队随时为您提供帮助</p>
                  </div>
                  <button class="contact-btn" aria-label="联系在线客服">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span>联系客服</span>
                  </button>
                </div>

                <!-- 常见问题FAQ -->
                <div class="faq-section">
                  <h3 class="faq-heading">常见问题</h3>
                  <div class="faq-list">
                    <div
                      v-for="(item, index) in faqList"
                      :key="index"
                      class="faq-item"
                    >
                      <button
                        class="faq-question"
                        @click="toggleFaq(index)"
                        :aria-expanded="expandedFaq.includes(index)"
                      >
                        <span class="question-text">Q: {{ item.q }}</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          :class="['chevron-icon', { 'chevron-icon--expanded': expandedFaq.includes(index) }]"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      <Transition name="expand">
                        <div v-show="expandedFaq.includes(index)" class="faq-answer">
                          A: {{ item.a }}
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </template>

    <!-- ====== 图片 Lightbox 全屏预览 ====== -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLightbox && product"
          class="lightbox-overlay"
          @click.self="closeLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
        >
          <button
            @click="closeLightbox"
            class="lightbox-close"
            aria-label="关闭预览"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div class="lightbox-content">
            <img
              :src="product.images[currentImageIndex]"
              :alt="`${product.name} - 第${currentImageIndex + 1}张大图`"
              class="lightbox-image"
              @click.stop
            />
          </div>

          <!-- Lightbox 导航点 -->
          <div v-if="product.images.length > 1" class="lightbox-dots">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              :class="['lightbox-dot', { 'lightbox-dot--active': currentImageIndex === idx }]"
              :aria-label="`切换到第${idx + 1}张图片`"
              @click="currentImageIndex = idx"
            ></button>
          </div>

          <!-- Lightbox 左右箭头 -->
          <button
            v-if="product.images.length > 1"
            class="lightbox-nav lightbox-nav--prev"
            @click="changeImage('prev')"
            aria-label="上一张"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            v-if="product.images.length > 1"
            class="lightbox-nav lightbox-nav--next"
            @click="changeImage('next')"
            aria-label="下一张"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ====== 移动端固定底部操作栏 ====== -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showMobileActionBar && product" class="mobile-action-bar" role="complementary" aria-label="快捷操作">
          <div class="mobile-bar-left">
            <button class="mobile-tool-btn" @click="toggleFavorite" :aria-label="isFavorite ? '取消收藏' : '收藏'">
              <svg width="24" height="24" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button class="mobile-tool-btn" aria-label="购物车">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            <button class="mobile-tool-btn" @click="scrollToCustomerService" aria-label="客服">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
          <div class="mobile-bar-right">
            <button
              class="mobile-btn mobile-btn--cart"
              :disabled="!inStock"
              @click="addToCart($event)"
            >
              加入购物车
            </button>
            <button
              class="mobile-btn mobile-btn--buy"
              :disabled="!inStock"
              @click="buyNow"
            >
              立即购买
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ====== 返回顶部按钮 ====== -->
    <Transition name="fade-scale">
      <button
        v-if="showBackToTop"
        class="back-to-top-btn"
        @click="scrollToTop"
        aria-label="返回顶部"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </Transition>

    <!-- ====== 空状态：商品不存在 ====== -->
    <div v-if="!product || !product.id" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h3 class="empty-title">商品不存在或已下架</h3>
        <p class="empty-desc">该商品可能已被删除或暂时不可用</p>
        <router-link to="/products" class="empty-action-btn">
          返回商品列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   商品详情页样式 - 应用设计令牌系统 v3.0
   ============================================ */

/* ====== CSS变量定义（设计令牌）====== */
.product-detail-page-v3 {
  --color-primary: #000AB0;
  --color-primary-light: #60A5FA;
  --color-primary-50: #DBEAFE;
  --color-primary-100: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-crimson: #DC2626;
  --color-gold: #D97706;
  --color-pine: #16A34A;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-tertiary: #6B7280;
  --color-text-quaternary: #9CA3AF;
  --color-border-default: #E5E7EB;
  --color-border-subtle: #F3F4F6;
  --color-surface-elevated: #FFFFFF;
  --color-surface-tertiary: #F3F4F6;

  /* 圆角令牌 */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* 阴影令牌 */
  --shadow-sm: 0 1px 3px rgba(17, 24, 39, 0.06);
  --shadow-md: 0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.06);
  --shadow-lg: 0 8px 16px rgba(17, 24, 39, 0.12), 0 4px 8px rgba(17, 24, 39, 0.08);
  --shadow-xl: 0 16px 32px rgba(17, 24, 39, 0.16);

  /* 字体大小令牌 */
  --font-xs: 0.75rem;
  --font-sm: 0.875rem;
  --font-base: 1rem;
  --font-lg: 1.125rem;
  --font-xl: 1.25rem;
  --font-2xl: 1.5rem;
  --font-3xl: clamp(1.75rem, 4vw, 1.875rem);

  min-height: 100vh;
  background: var(--color-surface-tertiary);
  padding-bottom: 80px; /* 为移动端底部操作栏留空间 */

  @media (min-width: 1024px) {
    padding-bottom: 0;
  }
}

/* ====== 容器和布局 ====== */
.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: 768px) {
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    padding: 40px 32px;
  }

  @media (min-width: 1400px) {
    padding: 48px 48px;
  }
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 45%) minmax(0, 55%);
    gap: 28px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 52%) minmax(0, 48%);
    gap: 48px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: minmax(0, 55%) minmax(0, 45%);
    gap: 64px;
  }
}

/* ====== 面包屑导航 ====== */
.breadcrumb {
  margin-bottom: 24px;
  animation: fadeInDown 0.5s ease-out;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.breadcrumb-item {
  font-size: var(--font-xs);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.breadcrumb-link {
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color 0.2s ease-out;

  &:hover {
    color: var(--color-primary);
  }
}

.breadcrumb-separator {
  color: var(--color-text-quaternary);
  font-size: var(--font-xs);
}

.breadcrumb-item--current {
  color: var(--color-text-secondary);
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ====== 商品图片展示区 ====== */
.product-gallery {
  position: sticky;
  top: 24px;
  align-self: start;
}

.gallery-main {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: zoom-in;
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.3s ease-out;

  &:hover {
    box-shadow: var(--shadow-lg);
  }

  @media (min-width: 1400px) {
    aspect-ratio: 1;
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: fadeIn 0.5s ease-out;

  &.image-zoomed {
    transform: scale(1.5);
  }
}

/* Shimmer 骨架屏加载效果 */
.shimmer-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;

  .gallery-main:hover & {
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 折扣标签 */
.discount-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-crimson) 0%, #EF4444 100%);
  color: white;
  font-size: var(--font-sm);
  font-weight: 700;
  border-radius: var(--radius-full);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  letter-spacing: 0.02em;
}

/* 库存紧张标签 */
.low-stock-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  color: #92400E;
  font-size: var(--font-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  z-index: 2;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 图片导航按钮 */
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  opacity: 0;
  transition: all 0.25s ease-out;
  box-shadow: var(--shadow-md);
  z-index: 2;

  .gallery-main:hover & {
    opacity: 1;
  }

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.08);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(-50%) scale(0.96);
  }

  &--prev {
    left: 12px;
  }

  &--next {
    right: 12px;
  }
}

/* 图片计数器 */
.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  color: white;
  font-size: var(--font-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  z-index: 2;
}

/* 放大提示 */
.zoom-hint {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  color: white;
  font-size: var(--font-xs);
  border-radius: var(--radius-full);
  z-index: 2;
  opacity: 0.9;
  transition: opacity 0.3s;

  svg {
    width: 16px;
    height: 16px;
  }
}

/* ====== 缩略图列表 ====== */
.thumbnail-container {
  position: relative;
  margin-top: 16px;
}

.thumbnail-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  background: var(--color-surface-elevated);
  padding: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  @media (max-width: 767px) {
    width: 64px;
    height: 64px;
  }

  &:hover {
    border-color: var(--color-text-quaternary);
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  &--active {
    border-color: var(--color-primary);
    box-shadow:
      0 0 0 2px rgba(0, 10, 176, 0.15),
      var(--shadow-md);
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-default);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  z-index: 2;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-out;

  &:hover {
    background: var(--color-primary-50);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &--left {
    left: -8px;
  }

  &--right {
    right: -8px;
  }
}

/* ====== 商品信息区 ====== */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

/* 操作工具栏（收藏/分享） */
.action-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-elevated);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all 0.25s ease-out;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-50);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &--active {
    color: var(--color-crimson);
    border-color: var(--color-crimson);
    background: #FEE2E2;

    svg {
      animation: heartBeat 0.6s ease-in-out;
    }
  }
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.1);
  }
}

.share-menu-wrapper {
  position: relative;
}

.share-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: 8px;
  z-index: 100;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  text-align: left;
  transition: background 0.2s ease-out;

  &:hover {
    background: var(--color-surface-tertiary);
  }
}

.share-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xs);
  font-weight: 600;
  flex-shrink: 0;

  &.wechat-icon {
    background: #07C160;
    color: white;
  }

  &.link-icon {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }
}

/* 商品标题 */
.product-title {
  font-size: var(--font-2xl);
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 90px; /* 为工具栏留空间 */

  @media (min-width: 768px) {
    font-size: clamp(1.5rem, 3vw, 1.875rem);
  }
}

/* 评分和销量元信息 */
.product-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star-rating {
  display: flex;
  gap: 2px;
}

.star-icon {
  display: block;
}

.rating-value {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.review-count {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
}

.sales-info {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
}

/* ====== 价格区域（重点视觉强化）====== */
.price-section {
  background: linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%);
  border: 1px solid rgba(220, 38, 38, 0.1);
  border-radius: var(--radius-2xl);
  padding: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.currency-symbol {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-crimson);
}

.current-price {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--color-crimson);
  line-height: 1;
  letter-spacing: -0.02em;
}

.original-price {
  font-size: var(--font-base);
  color: var(--color-text-quaternary);
  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

.discount-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--color-gold) 0%, #F59E0B 100%);
  color: white;
  font-size: var(--font-xs);
  font-weight: 700;
  border-radius: var(--radius-full);
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
}

/* 优惠标签 */
.promo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.promo-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: var(--font-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;

  &--free-shipping {
    background: #DCFCE7;
    color: #166534;
    border-color: #BBF7D0;
  }

  &--guarantee {
    background: #DBEAFE;
    color: #1E40AF;
    border-color: #BFDBFE;
  }

  &--return {
    background: #FEF3C7;
    color: #92400E;
    border-color: #FDE68A;
  }

  &--sale {
    background: #FEE2E2;
    color: #991B1B;
    border-color: #FECACA;
  }
}

/* 库存信息 */
.stock-info {
  position: relative;
  z-index: 1;
}

.stock-status {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-pine);
  display: flex;
  align-items: center;
  gap: 6px;

  &--low {
    color: var(--color-crimson);
    font-weight: 600;
    animation: pulse 2s ease-in-out infinite;
  }

  &--out {
    color: var(--color-crimson);
  }
}

/* ====== 规格选择 ====== */
.spec-section {
  margin-bottom: 8px;
}

.spec-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: var(--color-surface-elevated);
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  min-height: 44px;

  &:hover:not(:disabled) {
    border-color: var(--color-primary-300);
    background: var(--color-primary-50);
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--selected {
    border-color: var(--color-primary);
    background: var(--color-primary-50);
    color: var(--color-primary);
    font-weight: 600;
    box-shadow: 0 0 0 3px rgba(0, 10, 176, 0.1);

    .spec-option-label {
      color: var(--color-primary);
    }
  }

  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: line-through;
    background: var(--color-surface-tertiary);

    &:hover {
      transform: none;
      border-color: var(--color-border-default);
      background: var(--color-surface-tertiary);
    }
  }
}

.spec-option-label {
  color: inherit;
}

.spec-option-price {
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-left: auto;
}

.check-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.out-of-stock-mark {
  font-size: var(--font-xs);
  color: var(--color-crimson);
  font-weight: 600;
  margin-left: 4px;
}

/* ====== 数量选择器 ====== */
.quantity-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-label {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  min-width: 42px;
}

.quantity-selector {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface-elevated);
  transition: border-color 0.2s ease-out;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 10, 176, 0.1);
  }
}

.qty-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-elevated);
  border: none;
  border-right: 1px solid var(--color-border-default);
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.15s ease-out;

  &:last-child {
    border-right: none;
    border-left: 1px solid var(--color-border-default);
  }

  &:hover:not(:disabled) {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }
}

.qty-input {
  width: 64px;
  height: 48px;
  text-align: center;
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  border: none;
  background: transparent;
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.quantity-hint {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}

/* ====== 操作按钮组 ====== */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 56px;
  border-radius: var(--radius-xl);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  @media (max-width: 767px) {
    height: 52px;
    font-size: var(--font-sm);
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

/* 加入购物车按钮 */
.btn-add-cart {
  color: var(--color-primary);
  background: var(--color-surface-elevated);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
    box-shadow:
      0 8px 24px rgba(0, 10, 176, 0.25),
      0 0 0 1px rgba(0, 10, 176, 0.1);
  }

  &--loading {
    pointer-events: none;
  }
}

/* 立即购买按钮（品牌渐变） */
.btn-buy-now {
  color: white;
  background: linear-gradient(135deg, var(--color-primary) 0%, #3B82F6 50%, #60A5FA 100%);
  border: none;
  box-shadow:
    0 4px 14px rgba(0, 10, 176, 0.25),
    0 0 0 1px rgba(0, 10, 176, 0.1);

  &:hover:not(:disabled) {
    box-shadow:
      0 8px 28px rgba(0, 10, 176, 0.35),
      0 0 0 2px rgba(0, 10, 176, 0.15);
    background: linear-gradient(135deg, #000880 0%, var(--color-primary) 50%, #3B82F6 100%);
  }
}

/* ====== 服务保障 ====== */
.service-guarantees {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border-subtle);
  margin-top: 8px;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.guarantee-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--authentic {
    background: #DCFCE7;
    color: var(--color-pine);
  }

  &--return {
    background: #DBEAFE;
    color: var(--color-primary);
  }

  &--shipping {
    background: #FEF3C7;
    color: var(--color-gold);
  }

  &--service {
    background: #FCE7F3;
    color: #DB2777;
  }
}

.guarantee-text {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* 举报链接 */
.report-link {
  padding-top: 12px;
  border-top: 1px solid var(--color-border-subtle);
}

.report-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--font-xs);
  color: var(--color-text-quaternary);
  transition: color 0.2s ease-out;

  &:hover {
    color: var(--color-text-tertiary);
  }
}

/* ====== 底部Tab内容区 ====== */
.detail-tabs-container {
  margin-top: 48px;
  border-top: 2px solid var(--color-border-subtle);
  padding-top: 32px;
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

/* Tab导航栏 */
.tabs-nav {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--color-border-subtle);
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-button {
  position: relative;
  padding: 16px 28px;
  font-size: var(--font-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.25s ease-out;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: var(--color-text-primary);
  }

  &--active {
    color: var(--color-primary);
    font-weight: 600;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
    border-radius: var(--radius-sm);
  }
}

.tab-label {
  position: relative;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: 3px 3px 0 0;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Tab内容区域 */
.tab-content-wrapper {
  margin-top: 32px;
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-out;
}

/* 富文本内容 */
.rich-content {
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--color-text-secondary);

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    margin: 16px 0;
    box-shadow: var(--shadow-sm);
  }

  :deep(h2),
  :deep(h3) {
    color: var(--color-text-primary);
    margin-top: 32px;
    margin-bottom: 16px;
  }

  :deep(p) {
    margin-bottom: 16px;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 24px;
    margin-bottom: 16px;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;

    th,
    td {
      border: 1px solid var(--color-border-default);
      padding: 12px;
      text-align: left;
    }

    th {
      background: var(--color-surface-tertiary);
      font-weight: 600;
    }
  }
}

/* ====== 用户评价区域 ====== */
.review-summary-card {
  display: flex;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-2xl);
  margin-bottom: 24px;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 20px;
  }
}

.rating-overview {
  text-align: center;
  flex-shrink: 0;
}

.rating-score {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: 8px;
}

.star-display {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 8px;
}

.total-reviews {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  min-width: 36px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: var(--color-surface-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%);
  border-radius: var(--radius-full);
  transition: width 0.5s ease-out;
}

.bar-count {
  font-size: var(--font-xs);
  color: var(--color-text-quaternary);
  min-width: 32px;
  text-align: right;
}

/* 评价筛选 */
.review-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  background: var(--color-surface-elevated);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

/* 评价列表 */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  padding: 24px;
  transition: all 0.25s ease-out;

  &:hover {
    border-color: var(--color-border-default);
    box-shadow: var(--shadow-sm);
  }
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.reviewer-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
  min-width: 0;
}

.reviewer-name {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.review-date {
  font-size: var(--font-xs);
  color: var(--color-text-quaternary);
}

.review-rating-stars {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.review-content {
  font-size: var(--font-base);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  background: var(--color-surface-tertiary);
  cursor: pointer;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.05);
  }
}

.review-footer {
  display: flex;
  gap: 16px;
  font-size: var(--font-xs);
  color: var(--color-text-quaternary);
  padding-top: 16px;
  border-top: 1px solid var(--color-border-subtle);
}

.review-spec {
  color: var(--color-text-tertiary);
}

.review-helpful {
  margin-left: auto;
}

/* 加载更多 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.load-more-btn {
  padding: 12px 40px;
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-full);
  background: var(--color-surface-elevated);
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.25s ease-out;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-50);
  }
}

/* ====== 售后服务区域 ====== */
.after-sale-content {
  max-width: 900px;
  margin: 0 auto;
}

.policy-card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-2xl);
  padding: 32px;
  margin-bottom: 24px;
}

.policy-title {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(180deg, var(--color-pine) 0%, #22C55E 100%);
    border-radius: 2px;
  }
}

.policy-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: var(--font-base);
  line-height: 1.6;
  color: var(--color-text-secondary);

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  strong {
    color: var(--color-text-primary);
  }
}

/* 联系客服卡片 */
.contact-service-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, #EFF6FF 100%);
  border: 2px solid var(--color-primary-100);
  border-radius: var(--radius-2xl);
  margin-bottom: 32px;

  @media (max-width: 767px) {
    flex-direction: column;
    text-align: center;
  }
}

.service-icon-large {
  color: var(--color-primary);
  flex-shrink: 0;
}

.service-info {
  flex: 1;
}

.service-title {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.service-desc {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease-out;
  box-shadow: 0 4px 14px rgba(0, 10, 176, 0.25);
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 10, 176, 0.35);
    background: #000880;
  }
}

/* FAQ部分 */
.faq-section {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-2xl);
  padding: 28px;
}

.faq-heading {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 20px 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.2s ease-out;

  &:hover {
    border-color: var(--color-primary-100);
  }
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--color-text-primary);
  transition: background 0.2s ease-out;

  &:hover {
    background: var(--color-surface-tertiary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
}

.question-text {
  flex: 1;
}

.chevron-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease-out;
  color: var(--color-text-quaternary);

  &--expanded {
    transform: rotate(180deg);
    color: var(--color-primary);
  }
}

.faq-answer {
  padding: 0 20px 18px 20px;
  font-size: var(--font-base);
  line-height: 1.7;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border-subtle);
  padding-top: 16px;
}

/* ====== Lightbox 全屏预览 ====== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease-out;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
}

.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  position: relative;
}

.lightbox-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.lightbox-dots {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.lightbox-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-out;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  &--active {
    width: 32px;
    background: white;
  }
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.25s ease-out;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &--prev {
    left: 24px;
  }

  &--next {
    right: 24px;
  }
}

/* ====== 移动端固定底部操作栏 ====== */
.mobile-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  background: var(--color-surface-elevated);
  border-top: 1px solid var(--color-border-default);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);

  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-bar-left {
  display: flex;
  gap: 16px;
}

.mobile-tool-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease-out;

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-50);
  }
}

.mobile-bar-right {
  display: flex;
  gap: 10px;
  flex: 1;
}

.mobile-btn {
  flex: 1;
  height: 46px;
  border-radius: var(--radius-xl);
  border: none;
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease-out;

  &--cart {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
  }

  &--buy {
    background: linear-gradient(135deg, var(--color-primary) 0%, #3B82F6 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 10, 176, 0.3);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ====== 返回顶部按钮 ====== */
.back-to-top-btn {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-lg);
  z-index: 1100;
  transition: all 0.25s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    background: #000880;
  }

  @media (max-width: 767px) {
    bottom: 80px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
}

/* ====== 空状态 ====== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 48px 24px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  color: var(--color-text-quaternary);
  margin-bottom: 24px;
}

.empty-title {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.empty-desc {
  font-size: var(--font-base);
  color: var(--color-text-tertiary);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #3B82F6 100%);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-base);
  font-weight: 600;
  transition: all 0.25s ease-out;
  box-shadow: 0 4px 14px rgba(0, 10, 176, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 10, 176, 0.35);
  }
}

/* ====== 过渡动画 ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* 页面入场动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* ====== 骨架屏样式 ====== */
.gallery-skeleton {
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
}

.info-skeleton {
  padding: 20px 0;
}
</style>
