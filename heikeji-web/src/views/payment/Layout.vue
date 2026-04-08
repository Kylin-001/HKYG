<template>
  <!-- ============================================
       缴费中心布局 - Design System v3.0
       品牌头部（金色主题）+ 功能标签导航 + 主内容区
       ============================================ -->
  <div class="min-h-screen">

    <!-- ====== 品牌头部区域（金色主题）====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-gold-dark via-gold to-gold-light">
      <!-- 装饰性背景 -->
      <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span>&#x1F4B0;</span> 缴费中心
          </h1>
          <p class="text-white/70 text-sm mt-1">学费 · 住宿费 · 缴费记录 · 绿色通道</p>
        </div>

        <!-- 右侧：缴费统计 -->
        <div class="hidden sm:flex items-center gap-3 text-white/80 text-xs">
          <span class="flex items-center gap-1">
            <el-icon :size="14"><Wallet /></el-icon>
            待缴费: 2项
          </span>
          <span class="w-px h-4 bg-white/20"></span>
          <span class="flex items-center gap-1">
            <el-icon :size="14"><Document /></el-icon>
            已缴清: 3项
          </span>
        </div>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="缴费中心导航">
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :aria-current="isTabActive(tab) ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-1.5 px-4 py-3.5',
              'text-sm font-medium whitespace-nowrap rounded-t-lg',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
              isTabActive(tab)
                ? 'text-gold font-semibold bg-gold/5'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]">

            <!-- 图标 -->
            <span class="text-base">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>

            <!-- 未读角标 -->
            <span
              v-if="tab.badge"
              :class="[
                'ml-1 min-w-[18px] h-[18px] px-1.5',
                'text-[10px] font-bold rounded-full',
                'flex items-center justify-center leading-none',
                isTabActive(tab)
                  ? 'bg-gold text-white'
                  : 'bg-crimson text-white ring-2 ring-white'
              ]">
              {{ tab.badge }}
            </span>

            <!-- 选中态下划线（金色） -->
            <span
              v-if="isTabActive(tab)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gold rounded-full"></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="payment-main-content"
      role="main"
      aria-label="缴费中心主要内容"
      class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Wallet, Document } from '@element-plus/icons-vue'

// ============================================
// 导航配置
// ============================================
const tabs = [
  { label: '缴费首页', path: '/payment', base: '/payment', icon: '\u{1F3E0}', exact: true },
  { label: '学费缴纳', path: '/payment/tuition', base: '/payment/tuition', icon: '\u{1F4D3}', badge: '1' },
  { label: '住宿费', path: '/payment/dormitory-fee', base: '/payment/dormitory-fee', icon: '\u{1F3E0}' },
  { label: '缴费记录', path: '/payment/records', base: '/payment/records', icon: '\u{1F4CB}' },
  { label: '绿色通道', path: '/payment/green-channel', base: '/payment/green-channel', icon: '\u{1F33F}' },
]

// 判断标签是否激活
function isTabActive(tab: { base?: string; path: string; exact?: boolean }): boolean {
  if (tab.exact) {
    return window.location.pathname === tab.path
  }
  if (tab.base) {
    return window.location.pathname.startsWith(tab.base)
  }
  return window.location.pathname === tab.path
}
</script>

<style scoped>
/* 自定义滚动条隐藏 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 页面切换过渡 */
.page-fade-enter-active {
  transition: all 0.25s ease-out;
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

/* 响应式优化 */
@media (max-width: 639px) {
  header .flex.items-center.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* 触摸设备 */
@media (hover: none) and (pointer: coarse) {
  a[role="link"] {
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease-out;
    }
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .page-fade-enter-active,
  .page-fade-leave-active {
    transition-duration: 0.01ms !important;
  }

  nav[aria-label="缴费中心导航"] {
    will-change: auto;
  }
}
</style>
