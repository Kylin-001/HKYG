<template>
  <!-- ============================================
       用户中心布局 - Design System v3.0
       用户信息头部 + 标签导航 + 主内容区
       ============================================ -->
  <div class="min-h-screen bg-surface-secondary">

    <!-- ====== 用户信息头部区域 ====== -->
    <header class="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <!-- 装饰性背景元素 -->
      <div class="absolute top-0 right-1/4 w-40 h-40 bg-white/8 rounded-full -translate-y-1/4 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-1/3 w-28 h-28 bg-white/5 rounded-full translate-y-1/2"></div>

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
        <div class="flex items-center justify-between gap-4">
          <!-- 左侧：用户信息 -->
          <div class="flex items-center gap-4 min-w-0">
            <!-- 头像 -->
            <div class="relative shrink-0">
              <img
                :src="userStore.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=80'"
                :alt="`${displayName}的头像`"
                class="w-14 h-14 rounded-full object-cover ring-3 ring-white/30 shadow-lg transition-transform hover:scale-105" />
              <!-- 在线状态指示器 -->
              <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-pine rounded-full border-2 border-white"
                   aria-label="在线状态"></div>
            </div>

            <!-- 用户信息文字 -->
            <div class="min-w-0">
              <h1 class="text-lg font-bold text-white truncate">{{ displayName }}</h1>
              <p class="text-white/60 text-xs mt-0.5 truncate">黑龙江科技大学 · 在校生</p>
            </div>
          </div>

          <!-- 右侧：操作按钮 -->
          <router-link
            to="/user/settings"
            :class="[
              'hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl',
              'text-white/90 hover:text-white text-xs font-medium',
              'bg-white/12 hover:bg-white/22 backdrop-blur-sm',
              'border border-white/15 transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
            ]">
            <el-icon :size="14"><Setting /></el-icon>
            账户设置
          </router-link>
        </div>
      </div>
    </header>

    <!-- ====== 标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="用户中心导航菜单">
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :aria-current="isTabActive(item) ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-2 px-4 py-3.5',
              'text-sm font-medium whitespace-nowrap rounded-t-lg',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isTabActive(item)
                ? 'text-primary font-semibold bg-primary-50/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]">

            <!-- 图标/Emoji -->
            <span class="text-base">{{ item.icon }}</span>

            <!-- 文字标签 -->
            <span>{{ item.label }}</span>

            <!-- 未读角标 -->
            <span
              v-if="item.badge"
              :class="[
                'ml-1 min-w-[18px] h-[18px] px-1.5',
                'text-[10px] font-bold rounded-full',
                'flex items-center justify-center leading-none',
                isTabActive(item)
                  ? 'bg-primary text-white'
                  : 'bg-crimson text-white ring-2 ring-white'
              ]">
              {{ item.badge }}
            </span>

            <!-- 选中态下划线 -->
            <span
              v-if="isTabActive(item)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-primary rounded-full"></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="user-main-content"
      role="main"
      aria-label="用户中心主要内容"
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
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Setting } from '@element-plus/icons-vue'

// ============================================
// 状态管理
// ============================================
const userStore = useUserStore()

// 计算属性
const displayName = computed(() => userStore.user?.nickname || '用户中心')

// ============================================
// 导航配置
// ============================================
const navItems = [
  { label: '个人主页', path: '/user/profile', icon: '\u{1F464}', base: '/user/profile' },
  { label: '我的订单', path: '/user/orders', icon: '\u{1F4E6}', base: '/user/orders', badge: '7' },
  { label: '收藏夹', path: '/user/favorites', icon: '\u{2764}\u{FE0F}', base: '/user/favorites' },
  { label: '地址管理', path: '/user/addresses', icon: '\u{1F4CD}', base: '/user/addresses' },
  { label: '优惠券', path: '/user/coupons', icon: '\u{1F39F}', base: '/user/coupons', badge: '8' },
  { label: '设置', path: '/user/settings', icon: '\u2699\uFE0F', base: '/user/settings' },
]

// 判断标签是否激活
function isTabActive(item: { base?: string; path: string }): boolean {
  if (item.base) {
    return window.location.pathname.startsWith(item.base)
  }
  return window.location.pathname === item.path
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

  header > div > a {
    display: flex;
    width: 100%;
    justify-content: center;
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

  header nav {
    will-change: auto;
  }
}
</style>
