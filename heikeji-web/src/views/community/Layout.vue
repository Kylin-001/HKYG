<template>
  <!-- ============================================
       社区论坛布局 - Design System v3.0
       品牌头部 + 功能标签导航 + 主内容区
       ============================================ -->
  <div class="min-h-screen">

    <!-- ====== 品牌头部区域（金色主题）====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold-pale">
      <!-- 装饰性背景 -->
      <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>&#x1F4AC;</span> 社区论坛
        </h1>
        <p class="text-white/70 text-sm mt-1">分享生活 · 交流思想 · 结识同窗</p>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="社区论坛导航">
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
            <span class="text-base">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>

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
      id="community-main-content"
      role="main"
      aria-label="社区论坛主要内容"
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
// ============================================
// 导航配置
// ============================================
const tabs = [
  { label: '论坛首页', path: '/community/forum', base: '/community/forum', icon: '\u{1F4AC}' },
  { label: '失物招领', path: '/community/lostfound', base: '/community/lostfound', icon: '\u{1F50D}' },
  { label: '活动中心', path: '/community/activities', base: '/community/activities', icon: '\u{1F3AF}' },
]

// 判断标签是否激活
function isTabActive(tab: { base?: string; path: string }): boolean {
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

  nav[aria-label="社区论坛导航"] {
    will-change: auto;
  }
}
</style>
