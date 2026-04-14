﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import {
  Search, ShoppingCart, Menu, HomeFilled, Goods, Bowl,
  ChatDotRound, User, Bell, Close, Grid, Promotion,
  Service, Reading, CirclePlus, Tickets, Setting, RefreshRight,
  Trophy, Star, QuestionFilled
} from '@element-plus/icons-vue'
import BackToTop from '@/components/global/BackToTop.vue'
import NotificationPanel from '@/components/global/NotificationPanel.vue'
import ErrorBoundary from '@/components/global/ErrorBoundary.vue'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import LangSwitch from '@/components/LangSwitch.vue'
import ThemeSwitcher from '@/components/base/ThemeSwitcher.vue'
import SearchBar from '@/components/SearchBar.vue'
import USTHLogo from '@/components/global/USTHLogo.vue'

// ============================================
// 响应式状态管理
// ============================================
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const cartStore = useCartStore()

// UI 状态
const showMobileMenu = ref(false)
const showSearchBar = ref(false)
const searchKeyword = ref('')
const showNotificationPanel = ref(false)
const isScrolled = ref(false)
const headerHeight = ref(64)

// 主题状态
const currentTheme = ref<'light' | 'dark' | 'system'>(
  (localStorage.getItem('heikeji-theme') as 'light' | 'dark' | 'system') || 'system'
)

// 监听主题变化，应用到 DOM
watch(currentTheme, (newTheme) => {
  const root = document.documentElement
  const effectiveTheme = newTheme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : newTheme

  root.setAttribute('data-theme', effectiveTheme)
  root.classList.toggle('dark', effectiveTheme === 'dark')
  localStorage.setItem('heikeji-theme', newTheme)

  // 更新 meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', effectiveTheme === 'dark' ? '#1a1a2e' : '#F5F7FA')
  }
}, { immediate: true })

// Ref 引用
const searchInputRef = ref<HTMLInputElement | null>(null)
const mobileSearchInputRef = ref<HTMLInputElement | null>(null)
const mobileMenuId = `mobile-menu-${Date.now()}`

// ============================================
// 计算属性
// ============================================

// Element Plus 语言包动态切换
const elementLocale = computed(() => locale.value === 'zh-CN' ? zhCn : en)

// 购物车商品数量
const cartCount = computed(() => cartStore.items.reduce((sum, item) => sum + (item.quantity || 1), 0))

// 通知未读数量
const notificationCount = ref(0)

// 是否显示布局（排除登录、注册等页面）
const showLayout = computed(() => {
  const noLayoutRoutes = ['Login', 'ForgotPassword', 'NotFound']
  return !noLayoutRoutes.includes(route.name as string)
})

// ============================================
// 导航配置 - 使用 i18n 国际化
// ============================================

// 主导航菜单项
const navItems = computed(() => [
  { label: t('nav.home'), path: '/', icon: HomeFilled },
  { label: t('nav.products'), path: '/products', icon: Goods },
  { label: t('nav.takeout'), path: '/takeout', icon: Bowl },
  { label: '学工办理', path: '/student-affairs', icon: Service },
  { label: t('campus.title'), path: '/campus/schedule', icon: Reading },
  { label: t('secondhand.title'), path: '/secondhand', icon: RefreshRight },
  { label: t('community.title'), path: '/community/forum', icon: ChatDotRound },
  { label: '帮助中心', path: '/help', icon: QuestionFilled },
])

// 移动端底部导航
const mobileNavItems = computed(() => [
  { label: t('nav.home'), path: '/', icon: HomeFilled },
  { label: t('nav.products'), path: '/products', icon: Goods },
  { label: t('nav.takeout'), path: '/takeout', icon: Bowl },
  { label: t('community.title'), path: '/community/forum', icon: ChatDotRound },
  { label: t('nav.user'), path: '/user/profile', icon: User },
])

// 快捷服务链接
const quickLinks = computed(() => [
  { label: t('user.myOrders'), path: '/user/orders', icon: '📦' },
  { label: t('user.favorites'), path: '/user/favorites', icon: '❤️' },
  { label: t('user.coupons'), path: '/user/coupons', icon: '🎫' },
  { label: t('nav.address'), path: '/user/addresses', icon: '📍' },
  { label: t('campus.schedule'), path: '/campus/schedule', icon: '📅' },
  { label: t('campus.library'), path: '/campus/library', icon: '📚' },
  { label: t('campus.grades'), path: '/campus/grades', icon: '🎓' },
  { label: t('community.activities'), path: '/community/activities', icon: '🎯' },
])

// ============================================
// 导航激活状态判断
// ============================================
function isNavActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path.split('/').slice(0, 2).join('/'))
}

// ============================================
// 搜索功能
// ============================================
function openSearch() {
  showSearchBar.value = true
  // 等待 DOM 更新后自动聚焦搜索框
  nextTick(() => {
    if (window.innerWidth >= 768) {
      searchInputRef.value?.focus()
    } else {
      mobileSearchInputRef.value?.focus()
    }
  })
}

function handleSearch(keyword?: string) {
  const value = (keyword || searchKeyword.value).trim()
  if (value) {
    router.push({ path: '/search', query: { q: value } })
    closeSearch()
  }
}

function handleSearchInput(value: string) {
  // 实时输入回调，可用于搜索建议等
  // 当前保持空实现，未来可扩展自动补全功能
}

function closeSearch() {
  showSearchBar.value = false
  searchKeyword.value = ''
}

// ============================================
// 通知面板
// ============================================
function toggleNotification() {
  showNotificationPanel.value = !showNotificationPanel.value
}

// ============================================
// 移动端菜单
// ============================================
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  // 打开时锁定滚动
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}

// ============================================
// 导航跳转
// ============================================
function navigate(path: string) {
  router.push(path)
  closeMobileMenu()
}

// ============================================
// 滚动监听 - 动态阴影效果
// ============================================
function handleScroll() {
  isScrolled.value = window.scrollY > 60
  const searchExpanded = showSearchBar.value && window.innerWidth < 768
  headerHeight.value = searchExpanded ? 120 : (isScrolled.value ? 56 : 64)
}

// ============================================
// 生命周期钩子
// ============================================
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // ESC 键关闭所有弹出层
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showMobileMenu.value) closeMobileMenu()
      if (showSearchBar.value) closeSearch()
      if (showNotificationPanel.value) showNotificationPanel.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)

  // 监听系统主题变化（当用户选择 system 模式时自动跟随）
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (currentTheme.value === 'system') {
      const root = document.documentElement
      const effectiveTheme = e.matches ? 'dark' : 'light'
      root.setAttribute('data-theme', effectiveTheme)
      root.classList.toggle('dark', effectiveTheme === 'dark')
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.setAttribute('content', effectiveTheme === 'dark' ? '#1a1a2e' : '#F5F7FA')
      }
    }
  }
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = '' // 清理滚动锁定
})
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <div id="app" class="app-container">
    <!-- Skip Link - 键盘导航可访问性 (WCAG 2.1 AA) -->
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white">
      {{ t('a11y.skipToContent') || '跳转到主要内容' }}
    </a>

    <template v-if="showLayout">
      <!-- ============================================
           顶部导航栏 - Design System v3.0
           高度: 64px(桌面) | 56px(移动)
           背景: 白色 + 毛玻璃 + 动态阴影
           固定定位 + 滚动增强
           ============================================ -->
      <header role="banner"
              :class="[
                'fixed top-0 left-0 right-0 z-[var(--z-nav-header)] transition-all duration-300 ease-out',
                'bg-white/95 backdrop-blur-xl border-b',
                isScrolled
                  ? 'h-14 shadow-md shadow-black/5 border-border-subtle'
                  : 'h-16 shadow-sm shadow-black/3 border-transparent'
              ]"
              :style="{ willChange: 'transform, box-shadow' }">
        <nav aria-label="主导航" class="max-w-screen-2xl mx-auto px-4 lg:px-8">
          <div :class="['flex items-center justify-between transition-all duration-300', isScrolled ? 'h-14' : 'h-16']">

            <!-- ====== 左侧区域：品牌 Logo ====== -->
            <div class="flex items-center gap-2 shrink-0">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-50 hover:bg-primary-100 transition-all duration-200">
                <USTHLogo size="sm" :show-text="false" class="hover:scale-105 transition-transform duration-200" />
              </div>
              <span class="hidden sm:block font-bold text-base text-text-primary">黑科易购</span>
            </div>

            <!-- ====== 中间区域：主导航菜单（桌面端 ≥1024px）====== -->
            <nav class="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl mx-8"
                 aria-label="主菜单">
              <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                :aria-current="isNavActive(item.path) ? 'page' : undefined"
                :class="[
                  'relative px-4 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200 ease-out',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isNavActive(item.path)
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-primary hover:bg-primary-50/60'
                ]">
                {{ item.label }}
                <!-- 选中态下划线指示器 -->
                <span v-if="isNavActive(item.path)"
                      class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full transition-all duration-300"></span>
              </router-link>
            </nav>

            <!-- ====== 右侧区域：操作按钮组 ====== -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">

              <!-- 语言切换器 -->
              <LangSwitch />

              <!-- 搜索框（紧凑版 → 展开版） - 使用 SearchBar 组件 -->
              <div class="relative group/search">
                <button v-if="!showSearchBar"
                        @click="openSearch"
                        aria-label="打开搜索"
                        aria-haspopup="dialog"
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-text-tertiary hover:text-primary hover:bg-primary-50/80 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <el-icon :size="18"><Search /></el-icon>
                </button>

                <!-- 展开的搜索框（桌面端） - 使用 SearchBar 组件 -->
                <Transition name="search-expand">
                  <div v-if="showSearchBar"
                       class="hidden md:flex items-center absolute right-0 top-1/2 -translate-y-1/2 animate-fade-in"
                       style="min-width: 280px;">
                    <SearchBar
                      v-model="searchKeyword"
                      :placeholder="t('nav.search') || '搜索商品、外卖、二手好物...'"
                      size="sm"
                      variant="rounded"
                      :clearable="true"
                      :show-button="false"
                      :autofocus="true"
                      @search="handleSearch"
                      @input="handleSearchInput"
                    />
                    <button @click="closeSearch"
                            aria-label="关闭搜索"
                            class="ml-2 w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-gray-100 transition-colors shrink-0">
                      <el-icon :size="14"><Close /></el-icon>
                    </button>
                  </div>
                </Transition>
              </div>

              <!-- 通知铃铛（带未读标记） -->
              <button @click="toggleNotification"
                      :aria-label="`通知${notificationCount > 0 ? `，${notificationCount}条未读` : ''}`"
                      :aria-haspopup="true"
                      :aria-expanded="showNotificationPanel"
                      :class="[
                        'relative w-9 h-9 rounded-xl flex items-center justify-center',
                        'transition-all duration-200',
                        'text-text-tertiary hover:text-gold hover:bg-gold/10',
                        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'
                      ]">
                <el-icon :size="18"><Bell /></el-icon>
                <!-- 未读数量角标 -->
                <span v-if="notificationCount > 0"
                      class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white animate-pulse-once"
                      :aria-label="`${notificationCount}条未读通知`">
                  {{ notificationCount > 99 ? '99+' : notificationCount }}
                </span>
              </button>

              <!-- 购物车图标（带数量角标） -->
              <router-link to="/cart"
                           :aria-label="`购物车，${cartCount}件商品`"
                           :class="[
                             'relative w-9 h-9 rounded-xl flex items-center justify-center',
                             'transition-all duration-200',
                             'text-text-tertiary hover:text-crimson hover:bg-crimson/10',
                             'focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2'
                           ]">
                <el-icon :size="18"><ShoppingCart /></el-icon>
                <span v-if="cartCount > 0"
                      class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                  {{ cartCount > 99 ? '99+' : cartCount }}
                </span>
              </router-link>

              <!-- 主题切换器（紧凑图标模式） -->
              <ThemeSwitcher
                v-model="currentTheme"
                mode="icon-only"
                size="sm"
              />

              <!-- 用户头像 / 登录注册按钮 -->
              <template v-if="userStore.isAuthenticated">
                <router-link to="/user/profile"
                             :aria-label="`${userStore.user?.nickname || '用户'}的个人中心`"
                             class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-primary-50/80 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <img :src="userStore.userAvatar"
                       alt=""
                       class="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100 transition-transform hover:scale-105"
                       style="width: 32px; height: 32px; max-width: 32px; max-height: 32px;"
                       @error="$event.target.src='https://api.dicebear.com/7.x/avataaars/svg?seed=fallback&size=80'" />
                  <span class="text-sm font-medium text-text-primary hidden xl:block">{{ userStore.user?.nickname || '用户' }}</span>
                </router-link>
              </template>
              <template v-else>
                <router-link to="/auth/login"
                             aria-label="登录或注册账户"
                             :class="[
                               'px-4 py-2 rounded-xl text-sm font-semibold',
                               'bg-gradient-to-r from-primary to-primary-400 text-white',
                               'shadow-brand hover:shadow-lg hover:scale-[1.02]',
                               'active:scale-[0.98] transition-all duration-200',
                               'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                             ]">
                  {{ t('auth.login') || '登录' }}
                </router-link>
              </template>

              <!-- 移动端汉堡菜单按钮 (<1024px) -->
              <button @click="toggleMobileMenu"
                      :aria-expanded="showMobileMenu"
                      :aria-controls="mobileMenuId"
                      aria-label="打开导航菜单"
                      :class="[
                        'lg:hidden w-9 h-9 rounded-xl flex items-center justify-center',
                        'text-text-secondary hover:text-primary hover:bg-primary-50/80',
                        'transition-all duration-200',
                        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                      ]">
                <el-icon :size="20"><Menu /></el-icon>
              </button>
            </div>
          </div>
        </nav>

        <!-- 移动端展开的搜索栏 - 使用 SearchBar 组件 -->
        <Transition name="slide-down">
          <div v-if="showSearchBar"
               role="search"
               aria-label="站内搜索（移动端）"
               class="md:hidden px-4 pb-3 border-t border-border-subtle bg-white/95 backdrop-blur-xl">
            <div class="max-w-screen-xl mx-auto flex items-center gap-2">
              <SearchBar
                v-model="searchKeyword"
                :placeholder="t('nav.search') || '搜索商品、外卖、二手好物...'"
                size="sm"
                variant="rounded"
                :clearable="true"
                :show-button="false"
                :autofocus="true"
                @search="handleSearch"
                @input="handleSearchInput"
              />
              <button @click="closeSearch"
                      aria-label="关闭搜索"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-gray-100 transition-colors shrink-0">
                <el-icon :size="16"><Close /></el-icon>
              </button>
            </div>
          </div>
        </Transition>
      </header>

      <!-- 主内容区域 -->
      <main id="main-content" :class="['min-h-screen bg-surface-secondary', 'pb-20 md:pb-8']" :style="{ paddingTop: headerHeight + 'px' }" role="main" aria-label="主要内容">
        <ErrorLayout>
          <RouterView v-slot="{ Component, route: currentRoute }">
            <keep-alive :include="['Home', 'ProductList', 'CommunityForum']" v-if="currentRoute.meta.keepAlive">
              <component :is="Component" :key="currentRoute.fullPath" />
            </keep-alive>
            <component :is="Component" :key="currentRoute.fullPath" v-else />
          </RouterView>
        </ErrorLayout>
      </main>

      <!-- 移动端底部导航 - 科大蓝品牌色 -->
      <nav aria-label="底部导航" class="md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-nav-header)] bg-white/95 backdrop-blur-xl border-t border-primary-50/60">
        <div class="flex items-center justify-around h-16 max-w-lg mx-auto safe-area-inset-bottom">
          <router-link v-for="item in mobileNavItems" :key="item.path" :to="item.path"
            :aria-current="route.path === item.path ? 'page' : undefined"
            :class="['flex flex-col items-center justify-center flex-1 h-full transition-colors',
              route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))
                ? 'text-primary' : 'text-text-tertiary']">
            <el-icon :size="22"><component :is="item.icon" /></el-icon>
            <span class="text-[10px] mt-0.5 font-medium">{{ item.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- 移动端侧边抽屉菜单 -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 z-[var(--z-drawer)]">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeMobileMenu"></div>
            <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="导航菜单"
              class="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-left overflow-y-auto">
              <!-- 抽屉头部 - 黑科大校徽品牌区 -->
              <div class="p-5 border-b border-primary-50 flex items-center justify-between bg-gradient-to-br from-primary/5 to-primary-light/5">
                <USTHLogo size="sm" :show-text="true" :clickable="false" />
                <button @click="closeMobileMenu" class="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-gray-100 transition-colors">
                  <el-icon><Close /></el-icon>
                </button>
              </div>

              <!-- 校训展示 -->
              <div class="mx-5 mt-4 py-3 px-4 bg-gradient-to-r from-gold/8 to-gold-light/8 rounded-xl border border-gold/15">
                <p class="text-xs font-semibold text-gold text-center motto-text">厚德博学 · 强吾兴邦</p>
              </div>

              <!-- 用户信息（未登录显示登录入口）-->
              <div v-if="userStore.isAuthenticated" class="p-5 border-b border-primary-50">
                <div class="flex items-center gap-3">
                  <img :src="userStore.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=80'"
                       class="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                       style="width: 48px; height: 48px; max-width: 48px; max-height: 48px;" />
                  <div>
                    <p class="font-semibold text-text-primary">{{ userStore.user?.nickname || '用户' }}</p>
                    <p class="text-xs text-text-tertiary">{{ t('common.welcome') || '欢迎来到黑科大~' }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="p-5 border-b border-primary-50">
                <router-link to="/auth/login" @click="closeMobileMenu"
                  class="block w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center text-sm font-semibold shadow-brand">
                  登录 / 注册
                </router-link>
              </div>

              <!-- 导航链接 -->
              <div class="py-3">
                <p class="px-5 pt-2 pb-1 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">导航</p>
                <router-link v-for="item in navItems" :key="item.path" :to="item.path" @click="closeMobileMenu"
                  :aria-current="route.path === item.path ? 'page' : undefined"
                  :class="['flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors',
                    route.path.startsWith(item.path) ? 'text-primary bg-primary-50' : 'text-text-secondary hover:bg-primary-50/50']">
                  <el-icon :size="18"><component :is="item.icon" /></el-icon>
                  {{ item.label }}
                </router-link>
              </div>

              <!-- 快捷入口 -->
              <div class="py-3 border-t border-primary-50">
                <p class="px-5 pt-2 pb-1 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">快捷服务</p>
                <button v-for="link in quickLinks" :key="link.path" @click="navigate(link.path)"
                  class="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-text-secondary hover:bg-primary-50/50 transition-colors text-left">
                  <span class="text-base w-5 text-center">{{ link.icon }}</span>
                  {{ link.label }}
                </button>
              </div>

              <!-- 设置 & 校园信息 -->
              <div class="p-5 border-t border-primary-50 space-y-2">
                <button @click="navigate('/user/settings')"
                  class="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-primary-50/50 rounded-xl transition-colors">
                  <el-icon :size="17"><Setting /></el-icon>设置
                </button>
                <div class="pt-2 border-t border-dashed border-primary-100">
                  <p class="text-[10px] text-text-quaternary text-center leading-relaxed">
                    <span class="font-medium text-text-tertiary">黑龙江科技大学</span> · 始于1947
                  </p>
                  <p class="text-[9px] text-text-quaternary text-center mt-1">自强不息 · 创业创新</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>

    <!-- 无布局页面 -->
    <template v-else>
      <RouterView />
    </template>

    <!-- 全局组件 -->
    <BackToTop />
    <NotificationPanel v-model="showNotificationPanel" />

    <!-- 新增：全局增强组件（暂时禁用以修复构建问题） -->
    <!-- <SkipLinks show-nav-link show-footer-link /> -->
    <!-- <OfflineBanner position="top" :dismissible="true" :show-cache-info="true" /> -->
    <!-- <PWAInstallPrompt variant="banner" :auto-show-delay="5000" /> -->
    <!-- <PerformancePanel v-if="showPerformancePanel" /> -->
    </div>
  </el-config-provider>
</template>

<style scoped>
/* ============================================
   动画系统 - Design System v3.0
   ============================================ */

/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

/* 从右侧滑入（移动端抽屉） */
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-left {
  animation: slideLeft 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

/* 向下滑动（搜索栏展开） */
.slide-down-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 搜索框展开动画 */
.search-expand-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.search-expand-leave-active {
  transition: all 0.2s ease-in;
}
.search-expand-enter-from,
.search-expand-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(10px);
}

/* 页面切换过渡 - fade 效果 */
.page-fade-enter-active {
  transition: all 0.3s ease-out;
}
.page-fade-leave-active {
  transition: all 0.2s ease-in;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* page-slide 由 global.css 统一提供 */

/* 移动端抽屉过渡 */
.drawer-enter-active .drawer-overlay,
.drawer-leave-active .drawer-overlay {
  transition: opacity 0.25s ease;
}
.drawer-enter-from .drawer-overlay,
.drawer-leave-to .drawer-overlay {
  opacity: 0;
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from > div:last-child {
  transform: translateX(100%);
}
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}

/* 脉冲动画（未读标记） */
@keyframes pulseOnce {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.animate-pulse-once {
  animation: pulseOnce 0.3s ease-out;
}

/* ============================================
   响应式优化
   ============================================ */

/* 大屏幕优化 */
@media (min-width: 1536px) {
  nav[aria-label="主导航"] {
    max-width: 56rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button,
  a[role="button"] {
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.97);
      transition: transform 0.1s ease-out;
    }
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .page-fade-enter-active,
  .page-fade-leave-active,
  .page-slide-enter-active,
  .page-slide-leave-active,
  .drawer-enter-active,
  .drawer-leave-active,
  .search-expand-enter-active,
  .search-expand-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition-duration: 0.01ms !important;
  }

  header {
    will-change: auto;
  }
}
</style>

