<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, Search, View, ChatDotRound, Star } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'
import { useCommunityStore } from '@/stores/community'
import BaseButton from '@/components/base/BaseButton.vue'
import ProductCard from '@/components/ProductCard.vue'
// 导入设计令牌系统
import { lightColorTokens, gradients as gradientPresets, shadows as shadowPresets } from '@/tokens/colors'
import { typographyTokens } from '@/tokens/typography'
import { transitionPresets } from '@/tokens/animation'
import { borderRadiusTokens } from '@/tokens/spacing'

const router = useRouter()
const productStore = useProductStore()
const communityStore = useCommunityStore()

// Banner 自动轮播
const currentBanner = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | null = null

// 搜索功能
const searchKeyword = ref('')

function handleSearch() {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push(`/products?keyword=${encodeURIComponent(keyword)}`)
  }
}

function handleKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

// 商品跳转
function goToProduct(productId: number | string) {
  router.push(`/products/${productId}`)
}

// 加入购物车
function handleAddToCart(product: any) {
  ElMessage.success(`已将「${product.name}」加入购物车`)
}

// Banner 数据 - 使用品牌渐变色
const banners = ref([
  {
    id: 1,
    image: '',
    title: '黑科易购 — 一站式校园服务平台',
    link: '/products',
    tag: '开学季',
    gradient: gradientPresets.light.primary,
    accent: 'text-white',
    subtitle: '厚德博学 · 强吾兴邦',
    highlight: '学工办理 + 缴费中心全新上线'
  },
  {
    id: 2,
    image: '',
    title: '校园外卖满减季 — 满30减5，满50减10',
    link: '/takeout',
    tag: '热门',
    gradient: gradientPresets.light.crimson,
    accent: 'text-white',
    subtitle: '30分钟内送达校园任意角落',
    highlight: '支持校园卡支付'
  },
  {
    id: 3,
    image: '',
    title: 'AI智慧慕课上线 — 16门精品课程免费学',
    link: '/campus/ai-courses',
    tag: '新品',
    gradient: 'linear-gradient(135deg, #7E22CE 0%, #A855F7 50%, #EC4899 100%)',
    accent: 'text-white',
    subtitle: '知识图谱驱动个性化学习路径',
    highlight: '对接课程资源云平台'
  },
])

// 快捷入口数据
const quickEntries = [
  { icon: '🍔', name: '外卖', path: '/takeout', color: `bg-[${lightColorTokens.crimson.light}] text-[${lightColorTokens.crimson.DEFAULT}]` },
  { icon: '📚', name: '商品', path: '/products', color: `bg-[${lightColorTokens.primary[25]}] text-[${lightColorTokens.primary[500]}]` },
  { icon: '♻️', name: '二手', path: '/secondhand', color: `bg-[${lightColorTokens.pine.light}] text-[${lightColorTokens.pine.DEFAULT}]` },
  { icon: '📋', name: '学工', path: '/student-affairs', color: `bg-[${lightColorTokens.primary[25]}] text-[${lightColorTokens.primary[500]}]` },
  { icon: '💰', name: '缴费', path: '/payment', color: `bg-[${lightColorTokens.gold.bg}] text-[${lightColorTokens.gold.DEFAULT}]` },
  { icon: '🏫', name: '校园', path: '/campus/schedule', color: `bg-[${lightColorTokens.primary[50]}] text-[${lightColorTokens.primary[400]}]` },
  { icon: '💬', name: '社区', path: '/community/forum', color: `bg-[${lightColorTokens.info.light}] text-[${lightColorTokens.info.DEFAULT}]` },
  { icon: '📢', name: '公告', path: '/announcements', color: `bg-[${lightColorTokens.crimson.light}] text-[${lightColorTokens.crimson.dark}]` },
]

// 校园服务数据
const campusServices = [
  {
    icon: '📅',
    name: '课表查询',
    desc: '实时查看本周课程安排，支持周视图和日视图切换',
    path: '/campus/schedule',
    bg: `from-[${lightColorTokens.primary[25]}] to-[${lightColorTokens.primary[50]}]`,
    accent: `text-[${lightColorTokens.primary[500]}]`
  },
  {
    icon: '📚',
    name: '图书馆',
    desc: '书籍搜索、座位预约、借阅记录一站式服务',
    path: '/campus/library',
    bg: `from-[${lightColorTokens.pine.light}] to-[${lightColorTokens.pine.bg}]`,
    accent: `text-[${lightColorTokens.pine.DEFAULT}]`
  },
  {
    icon: '🤖',
    name: 'AI慕课',
    desc: '16门智慧慕课，知识图谱，个性化学习路径推荐',
    path: '/campus/ai-courses',
    bg: 'from-indigo-500/8 to-purple-500/8',
    accent: 'text-indigo-600'
  },
  {
    icon: '🎓',
    name: 'AI教学',
    desc: '无感开课、语音签到、课堂录像回看、AI课堂报告',
    path: '/campus/ai-teaching',
    bg: 'from-violet-500/8 to-fuchsia-500/8',
    accent: 'text-violet-600'
  },
  {
    icon: '🗺️',
    name: '校园地图',
    desc: '3D校园导航，建筑信息查询，路线规划',
    path: '/campus/map',
    bg: `from-[${lightColorTokens.gold.bg}] to-[${lightColorTokens.gold.light}]`,
    accent: `text-[${lightColorTokens.gold.dark}]`
  },
  {
    icon: '🎓',
    name: '成绩查询',
    desc: 'GPA计算、成绩分布分析、学业预警提醒',
    path: '/campus/grades',
    bg: `from-[${lightColorTokens.crimson.light}] to-[${lightColorTokens.crimson.bg}]`,
    accent: `text-[${lightColorTokens.crimson.dark}]`
  },
]

// Banner 自动轮播
function startBannerAutoPlay() {
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 5000)
}

function stopBannerAutoPlay() {
  if (bannerTimer) {
    clearInterval(bannerTimer)
    bannerTimer = null
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchHotProducts(),
      communityStore.fetchPosts({ page: 1, pageSize: 3 })
    ])
    // 启动自动轮播
    startBannerAutoPlay()
  } catch (err: any) {
    ElMessage.error(err.message || '首页数据加载失败')
  }
})

onUnmounted(() => {
  stopBannerAutoPlay()
})
</script>

<template>
  <main class="page min-h-screen" role="main">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

      <!-- ==================== Hero Banner 区域 ==================== -->
      <section class="relative mb-8 group" aria-label="首页横幅">
        <div
          :class="[
            'aspect-[21/7] sm:aspect-[28/9] relative overflow-hidden rounded-2xl',
            'transition-all duration-300'
          ]"
          :style="{ background: banners[currentBanner].gradient }"
        >
          <!-- 装饰性背景元素 -->
          <div class="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          <div class="absolute top-1/2 right-1/3 w-24 h-24 bg-gold/10 rounded-full -translate-y-1/2 pointer-events-none"></div>

          <!-- Banner 内容 -->
          <div class="absolute inset-0 flex items-center">
            <div class="px-8 sm:px-12 max-w-xl">
              <!-- 标签和学校名称 -->
              <div class="flex items-center gap-2 mb-4">
                <span
                  :class="[
                    'inline-block px-3 py-1.5 rounded-full backdrop-blur-sm text-white font-semibold tracking-wider uppercase',
                    'text-xs transition-transform hover:scale-105'
                  ]"
                  :style="{ backgroundColor: 'rgba(217, 119, 6, 0.9)' }"
                >
                  {{ banners[currentBanner].tag }}
                </span>
                <span class="text-white/60 text-xs font-medium">|</span>
                <span class="text-white/70 text-xs font-medium">黑龙江科技大学</span>
              </div>

              <!-- 主标题 - 使用展示字体层级 -->
              <h2
                :class="['text-white mb-3 tracking-tight leading-tight']"
                :style="{
                  fontSize: typographyTokens.textHierarchy.display.fontSize,
                  fontWeight: typographyTokens.textHierarchy.display.fontWeight,
                  lineHeight: String(typographyTokens.textHierarchy.display.lineHeight),
                  letterSpacing: typographyTokens.textHierarchy.display.letterSpacing
                }"
              >
                {{ banners[currentBanner].title }}
              </h2>

              <!-- 副标题 -->
              <p class="text-white/80 text-base mb-2 leading-relaxed font-normal">{{ banners[currentBanner].subtitle }}</p>

              <!-- 高亮信息 -->
              <p
                :class="['font-medium mb-6 flex items-center gap-2']"
                :style="{ color: '#FBBF24' }"
              >
                <span class="inline-block animate-pulse">✨</span>
                {{ banners[currentBanner].highlight }}
              </p>

              <!-- CTA 按钮 - 使用 BaseButton 组件 -->
              <BaseButton
                variant="brand"
                size="md"
                :aria-label="'立即查看详情'"
                class="!shadow-lg hover:!shadow-xl !border !border-white/20 !backdrop-blur-sm"
                @click="$router.push(banners[currentBanner].link)"
              >
                立即查看 →
              </BaseButton>
            </div>
          </div>

          <!-- Banner 切换指示器 -->
          <nav class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5" aria-label="横幅导航">
            <button
              v-for="(b, i) in banners"
              :key="b.id"
              @click="currentBanner = i; stopBannerAutoPlay(); startBannerAutoPlay()"
              :class="[
                'rounded-full transition-all duration-300 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-white/50',
                currentBanner === i ? 'w-7 h-2.5 bg-gold' : 'w-2 h-2.5 bg-white/40 hover:bg-white/60 hover:w-3'
              ]"
              :aria-label="`切换到第 ${i + 1} 个横幅`"
              :aria-current="currentBanner === i ? 'true' : 'false'"
            ></button>
          </nav>
        </div>
      </section>

      <!-- ==================== 搜索栏区域 ==================== -->
      <section class="mb-10" aria-label="商品搜索">
        <div class="relative max-w-2xl mx-auto">
          <div
            :class="[
              'flex items-center overflow-hidden',
              'rounded-2xl border',
              'transition-shadow duration-200',
              'focus-within:shadow-brand focus-within:border-primary-300'
            ]"
            :style="{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              boxShadow: shadowPresets.light.sm,
              borderColor: lightColorTokens.border.subtle,
              borderRadius: borderRadiusTokens['2xl']
            }"
          >
            <!-- 搜索图标 -->
            <el-icon class="ml-5 shrink-0" :style="{ color: lightColorTokens.text.tertiary }" :size="20"><Search /></el-icon>

            <!-- 搜索输入框 -->
            <input
              v-model="searchKeyword"
              type="search"
              placeholder="搜索商品、数码好物、校园服务..."
              :class="[
                'flex-1 px-4 py-4 outline-none bg-transparent',
                'placeholder:text-text-tertiary'
              ]"
              :style="{
                fontSize: typographyTokens.textHierarchy.body.fontSize
              }"
              @keyup="handleKeyup"
              aria-label="搜索关键词"
            />

            <!-- 搜索按钮 - 使用 BaseButton 组件 -->
            <BaseButton
              variant="brand"
              size="md"
              :aria-label="'执行搜索'"
              @click="handleSearch"
            >
              搜索
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- ==================== 快捷入口区域 ==================== -->
      <section class="mb-10" aria-label="快捷服务入口">
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          <button
            v-for="entry in quickEntries"
            :key="entry.name"
            @click="$router.push(entry.path)"
            :class="[
              'flex flex-col items-center gap-2 p-3 sm:p-4',
              'rounded-2xl cursor-pointer group',
              'hover:bg-primary-50/60 active:scale-[0.97]',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-inset',
              'min-h-[88px] sm:min-h-[100px]'
            ]"
            :style="{ borderRadius: borderRadiusTokens['2xl'] }"
            :aria-label="`进入${entry.name}`"
          >
            <!-- 图标容器 -->
            <span
              :class="[
                entry.color,
                'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center',
                'text-2xl sm:text-3xl shadow-sm',
                'group-hover:scale-110 group-hover:shadow-md',
                'transition-all duration-200 ease-out'
              ]"
              :style="{ borderRadius: borderRadiusTokens.xl }"
            >
              {{ entry.icon }}
            </span>

            <!-- 名称文字 -->
            <span
              :class="[
                'font-medium group-hover:text-text-primary',
                'transition-colors duration-150'
              ]"
              :style="{
                color: lightColorTokens.text.secondary,
                fontSize: typographyTokens.textHierarchy.overline.fontSize
              }"
            >
              {{ entry.name }}
            </span>
          </button>
        </div>
      </section>

      <!-- ==================== 限时秒杀横幅 ==================== -->
      <section
        class="mb-10 relative overflow-hidden rounded-2xl p-6 text-white"
        :style="{
          background: gradientPresets.light.warm,
          borderRadius: borderRadiusTokens['2xl']
        }"
        aria-label="限时秒杀活动"
      >
        <!-- 装饰元素 -->
        <div class="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div class="absolute bottom-0 left-1/4 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 pointer-events-none"></div>

        <div class="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <!-- 左侧信息 -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl animate-pulse" aria-hidden="true">⚡</span>
              <h3
                :class="['font-bold']"
                :style="{
                  fontSize: typographyTokens.textHierarchy.h3.fontSize,
                  fontWeight: typographyTokens.textHierarchy.h3.fontWeight
                }"
              >
                限时秒杀
              </h3>
              <span
                class="px-2.5 py-1 rounded-lg font-bold tracking-wide uppercase"
                :style="{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: typographyTokens.textHierarchy.overline.fontSize
                }"
              >
                距结束 02:34:15
              </span>
            </div>
            <p class="text-white/85 text-base font-normal mt-2">每日10点/20点开抢 · 先到先得</p>
          </div>

          <!-- 右侧按钮 - 使用 BaseButton 组件 -->
          <BaseButton
            variant="ghost"
            size="md"
            :aria-label="'去抢购秒杀商品'"
            class="!text-white !border-white/20 hover:!bg-white/25"
            @click="$router.push('/products')"
          >
            去抢购 →
          </BaseButton>
        </div>
      </section>

      <!-- ==================== 热门推荐商品区域 ==================== -->
      <section class="mb-10" aria-labelledby="hot-products-heading">
        <!-- 区块标题 -->
        <header class="flex items-center justify-between mb-6">
          <h2
            id="hot-products-heading"
            :class="['flex items-center gap-3']"
            :style="{
              color: lightColorTokens.text.primary,
              fontSize: typographyTokens.textHierarchy.h2.fontSize,
              fontWeight: typographyTokens.textHierarchy.h2.fontWeight,
              letterSpacing: typographyTokens.textHierarchy.h2.letterSpacing
            }"
          >
            <span
              class="w-1.5 h-7 rounded-full"
              :style="{
                background: gradientPresets.light.primary,
                borderRadius: borderRadiusTokens.full
              }"
            ></span>
            热门推荐
          </h2>
          <BaseButton
            variant="ghost"
            size="sm"
            :aria-label="'查看所有热门商品'"
            @click="$router.push('/products')"
          >
            查看全部
            <template #icon><el-icon :size="16"><ArrowRight /></el-icon></template>
          </BaseButton>
        </header>

        <!-- 商品网格 - 使用 ProductCard 组件 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          <ProductCard
            v-for="product in productStore.hotProducts"
            :key="product.id"
            :product="{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              sales: product.sales,
              isHot: product.isHot,
              isNew: product.isNew
            }"
            variant="default"
            :show-actions="true"
            :show-sales="true"
            :lazy-image="true"
            :clickable="true"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- ==================== 校园服务区域 ==================== -->
      <section class="mb-10" aria-labelledby="campus-services-heading">
        <!-- 区块标题 -->
        <header class="flex items-center justify-between mb-6">
          <h2
            id="campus-services-heading"
            :class="['flex items-center gap-3']"
            :style="{
              color: lightColorTokens.text.primary,
              fontSize: typographyTokens.textHierarchy.h2.fontSize,
              fontWeight: typographyTokens.textHierarchy.h2.fontWeight,
              letterSpacing: typographyTokens.textHierarchy.h2.letterSpacing
            }"
          >
            <span
              class="w-1.5 h-7 rounded-full"
              :style="{
                background: gradientPresets.light.pine,
                borderRadius: borderRadiusTokens.full
              }"
            ></span>
            校园服务
          </h2>
          <BaseButton
            variant="ghost"
            size="sm"
            :aria-label="'查看所有校园服务'"
            @click="$router.push('/campus/schedule')"
          >
            全部服务
            <template #icon><el-icon :size="16"><ArrowRight /></el-icon></template>
          </BaseButton>
        </header>

        <!-- 服务卡片网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <article
            v-for="service in campusServices"
            :key="service.name"
            @click="$router.push(service.path)"
            :class="[
              'group cursor-pointer p-5',
              'rounded-2xl border bg-gradient-to-br',
              'hover:shadow-lg hover:-translate-y-0.5',
              'transition-all duration-300 ease-out',
              'focus-within:ring-2 focus-within:ring-pine-300',
              service.bg
            ]"
            :style="{
              borderColor: lightColorTokens.border.subtle,
              borderRadius: borderRadiusTokens['2xl']
            }"
            tabindex="0"
            role="button"
            :aria-label="`进入${service.name}`"
          >
            <!-- 图标 -->
            <div
              :class="[
                'w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-3',
                'shadow-sm group-hover:scale-110 group-hover:shadow-md',
                'transition-all duration-200 ease-out'
              ]"
              :style="{ borderRadius: borderRadiusTokens.xl }"
            >
              {{ service.icon }}
            </div>

            <!-- 服务名称 -->
            <h4
              :class="[service.accent, 'mb-1.5']"
              :style="{
                fontSize: typographyTokens.textHierarchy.h4.fontSize,
                fontWeight: typographyTokens.textHierarchy.h4.fontWeight
              }"
            >
              {{ service.name }}
            </h4>

            <!-- 描述文字 -->
            <p
              class="line-clamp-2 leading-relaxed"
              :style="{
                color: lightColorTokens.text.tertiary,
                fontSize: typographyTokens.textHierarchy.caption.fontSize,
                lineHeight: String(typographyTokens.textHierarchy.caption.lineHeight)
              }"
            >
              {{ service.desc }}
            </p>
          </article>
        </div>
      </section>

      <!-- ==================== 学工办理 & 缴费中心快捷入口 ==================== -->
      <section class="mb-10" aria-label="学工与缴费服务">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- 学工办理卡片 -->
          <article
            @click="$router.push('/student-affairs')"
            :class="[
              'group relative overflow-hidden cursor-pointer p-6 text-white',
              'rounded-2xl hover:shadow-xl',
              'transition-all duration-300 ease-out',
              'focus-within:ring-2 focus-within:ring-white/50'
            ]"
            :style="{
              background: gradientPresets.light.primaryDeep,
              borderRadius: borderRadiusTokens['2xl']
            }"
            tabindex="0"
            role="button"
            aria-label="进入学工办理"
          >
            <!-- 装饰元素 -->
            <div class="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div class="relative z-10 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl" aria-hidden="true">📋</span>
                  <h3
                    :class="['font-bold']"
                    :style="{
                      fontSize: typographyTokens.textHierarchy.h3.fontSize,
                      fontWeight: typographyTokens.textHierarchy.h3.fontWeight
                    }"
                  >
                    学工办理
                  </h3>
                </div>
                <p
                  class="mt-2 font-normal"
                  :style="{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: typographyTokens.textHierarchy.caption.fontSize
                  }"
                >
                  请假 · 助学金 · 军训服装 · 校园卡
                </p>
              </div>
              <span
                :class="[
                  'text-2xl group-hover:translate-x-1',
                  'transition-transform duration-200'
                ]"
                :style="{ color: 'rgba(255, 255, 255, 0.4)' }"
                aria-hidden="true"
              >→</span>
            </div>
          </article>

          <!-- 缴费中心卡片 -->
          <article
            @click="$router.push('/payment')"
            :class="[
              'group relative overflow-hidden cursor-pointer p-6 text-white',
              'rounded-2xl hover:shadow-xl',
              'transition-all duration-300 ease-out',
              'focus-within:ring-2 focus-within:ring-white/50'
            ]"
            :style="{
              background: 'linear-gradient(135deg, #B45309 0%, #D97706 45%, #DC2626 100%)',
              borderRadius: borderRadiusTokens['2xl']
            }"
            tabindex="0"
            role="button"
            aria-label="进入缴费中心"
          >
            <!-- 装饰元素 -->
            <div class="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div class="relative z-10 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl" aria-hidden="true">💰</span>
                  <h3
                    :class="['font-bold']"
                    :style="{
                      fontSize: typographyTokens.textHierarchy.h3.fontSize,
                      fontWeight: typographyTokens.textHierarchy.h3.fontWeight
                    }"
                  >
                    缴费中心
                  </h3>
                </div>
                <p
                  class="mt-2 font-normal"
                  :style="{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: typographyTokens.textHierarchy.caption.fontSize
                  }"
                >
                  学费 · 住宿费 · 缴费记录 · 绿色通道
                </p>
              </div>
              <span
                :class="[
                  'text-2xl group-hover:translate-x-1',
                  'transition-transform duration-200'
                ]"
                :style="{ color: 'rgba(255, 255, 255, 0.4)' }"
                aria-hidden="true"
              >→</span>
            </div>
          </article>
        </div>
      </section>

      <!-- ==================== 社区动态区域 ==================== -->
      <section class="mb-10" aria-labelledby="community-heading">
        <!-- 区块标题 -->
        <header class="flex items-center justify-between mb-6">
          <h2
            id="community-heading"
            :class="['flex items-center gap-3']"
            :style="{
              color: lightColorTokens.text.primary,
              fontSize: typographyTokens.textHierarchy.h2.fontSize,
              fontWeight: typographyTokens.textHierarchy.h2.fontWeight,
              letterSpacing: typographyTokens.textHierarchy.h2.letterSpacing
            }"
          >
            <span
              class="w-1.5 h-7 rounded-full"
              :style="{
                background: gradientPresets.light.gold,
                borderRadius: borderRadiusTokens.full
              }"
            ></span>
            社区动态
          </h2>
          <BaseButton
            variant="ghost"
            size="sm"
            :aria-label="'进入社区论坛'"
            @click="$router.push('/community/forum')"
          >
            进入论坛
            <template #icon><el-icon :size="16"><ArrowRight /></el-icon></template>
          </BaseButton>
        </header>

        <!-- 帖子列表 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="post in communityStore.posts"
            :key="post.id"
            @click="$router.push('/community/forum')"
            :class="[
              'group cursor-pointer p-5',
              'rounded-2xl border bg-white/95 backdrop-blur-md',
              'hover:border-gold/30 hover:shadow-lg',
              'transition-all duration-300 ease-out',
              'focus-within:ring-2 focus-within:ring-gold-400'
            ]"
            :style="{
              borderColor: lightColorTokens.border.subtle,
              borderRadius: borderRadiusTokens['2xl']
            }"
            tabindex="0"
            role="button"
            :aria-label="`查看帖子：${post.title}`"
          >
            <!-- 用户头像和信息 -->
            <div class="flex items-start gap-3 mb-4">
              <img
                :src="post.avatar"
                :alt="`${post.author}的头像`"
                loading="lazy"
                class="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-primary-50"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="font-medium truncate"
                    :style="{
                      color: lightColorTokens.text.primary,
                      fontSize: typographyTokens.textHierarchy.body.fontSize
                    }"
                  >
                    {{ post.author }}
                  </span>
                  <span
                    :class="['px-2 py-0.5 rounded font-medium shrink-0']"
                    :style="{
                      backgroundColor: lightColorTokens.gold.bg,
                      color: lightColorTokens.gold.DEFAULT,
                      fontSize: '0.6875rem',
                      borderRadius: borderRadiusTokens.md
                    }"
                  >
                    {{ post.board }}
                  </span>
                </div>
                <time
                  :style="{
                    color: lightColorTokens.text.tertiary,
                    fontSize: typographyTokens.textHierarchy.overline.fontSize
                  }"
                >
                  {{ post.time }}
                </time>
              </div>
            </div>

            <!-- 帖子标题 -->
            <h4
              :class="[
                'line-clamp-2 mb-3 leading-snug',
                'group-hover:text-primary transition-colors duration-200'
              ]"
              :style="{
                color: lightColorTokens.text.primary,
                fontSize: typographyTokens.textHierarchy.h4.fontSize,
                fontWeight: typographyTokens.textHierarchy.h4.fontWeight
              }"
            >
              {{ post.title }}
            </h4>

            <!-- 互动数据 -->
            <div
              class="flex items-center gap-4"
              :style="{ color: lightColorTokens.text.tertiary }"
            >
              <span class="flex items-center gap-1" :style="{ fontSize: typographyTokens.textHierarchy.overline.fontSize }">
                <el-icon :size="14"><View /></el-icon>{{ post.views }}
              </span>
              <span class="flex items-center gap-1" :style="{ fontSize: typographyTokens.textHierarchy.overline.fontSize }">
                <el-icon :size="14"><ChatDotRound /></el-icon>{{ post.comments }}
              </span>
              <span class="flex items-center gap-1" :style="{ fontSize: typographyTokens.textHierarchy.overline.fontSize }">
                <el-icon :size="14"><Star /></el-icon>{{ post.likes }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- ==================== 校训展示区 ==================== -->
      <section
        class="mb-10 relative overflow-hidden rounded-2xl p-10 sm:p-12 text-white"
        :style="{
          background: gradientPresets.light.primary,
          borderRadius: borderRadiusTokens['2xl']
        }"
        aria-label="校训与学校信息"
      >
        <!-- 装饰元素 -->
        <div class="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div class="relative z-10 text-center">
          <!-- 英文名称 -->
          <p
            class="uppercase tracking-[0.35em] mb-4 font-light"
            :style="{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: typographyTokens.textHierarchy.overline.fontSize,
              letterSpacing: '0.35em'
            }"
          >
            Heilongjiang University of Science & Technology
          </p>

          <!-- 校训主标题 - 使用展示字体 -->
          <h2
            class="motto-text inline-block mb-4"
            :style="{
              fontSize: typographyTokens.textHierarchy.display.fontSize,
              fontWeight: typographyTokens.textHierarchy.display.fontWeight,
              lineHeight: String(typographyTokens.textHierarchy.display.lineHeight),
              letterSpacing: '0.15em'
            }"
          >
            厚德博学 · 强吾兴邦
          </h2>

          <!-- 学校简介 -->
          <p
            class="mt-5 mx-auto max-w-2xl leading-relaxed font-normal"
            :style="{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: typographyTokens.textHierarchy.bodyLarge.fontSize,
              lineHeight: String(typographyTokens.textHierarchy.bodyLarge.lineHeight)
            }"
          >
            自强不息求发展 · 创业创新创特色 —— 始于1947年
          </p>

          <!-- 统计数据 -->
          <div class="flex items-center justify-center gap-8 sm:gap-12 mt-8">
            <div class="text-center">
              <p
                class="font-bold"
                :style="{
                  color: '#FDE68A',
                  fontSize: typographyTokens.textHierarchy['3xl'].fontSize,
                  fontWeight: typographyTokens.textHierarchy['3xl'].fontWeight
                }"
              >
                77+
              </p>
              <p
                class="mt-1.5"
                :style="{
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: typographyTokens.textHierarchy.overline.fontSize
                }"
              >
                办学年限
              </p>
            </div>

            <div class="w-px h-10 bg-white/15" aria-hidden="true"></div>

            <div class="text-center">
              <p
                class="font-bold"
                :style="{
                  color: '#FDE68A',
                  fontSize: typographyTokens.textHierarchy['3xl'].fontSize,
                  fontWeight: typographyTokens.textHierarchy['3xl'].fontWeight
                }"
              >
                21000+
              </p>
              <p
                class="mt-1.5"
                :style="{
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: typographyTokens.textHierarchy.overline.fontSize
                }"
              >
                在校学生
              </p>
            </div>

            <div class="w-px h-10 bg-white/15" aria-hidden="true"></div>

            <div class="text-center">
              <p
                class="font-bold"
                :style="{
                  color: '#FDE68A',
                  fontSize: typographyTokens.textHierarchy['3xl'].fontSize,
                  fontWeight: typographyTokens.textHierarchy['3xl'].fontWeight
                }"
              >
                57
              </p>
              <p
                class="mt-1.5"
                :style="{
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: typographyTokens.textHierarchy.overline.fontSize
                }"
              >
                本科专业
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* 文本截断工具类 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 校训特殊样式 */
.motto-text {
  position: relative;
}

.motto-text::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 65%;
  height: 2.5px;
  background: linear-gradient(90deg, transparent, #FBBF24, transparent);
  border-radius: 2px;
}

/* 自定义焦点样式增强 */
*:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
