<template>
  <!-- ============================================
       订单中心布局 - Design System v3.0
       品牌头部 + 状态标签导航 + 主内容区
       ============================================ -->
  <div class="min-h-screen">
    <!-- ====== 品牌头部区域 ====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-light">
      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span>&#x1F4E6;</span> 我的订单
          </h1>
          <p class="text-white/70 text-sm mt-1">
            管理您的所有订单 · 跟踪物流状态
          </p>
        </div>

        <!-- 右侧：购物车入口 -->
        <router-link
          to="/cart"
          :class="[
            'hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl',
            'bg-white/20 hover:bg-white/30 text-white text-sm font-medium',
            'backdrop-blur-sm border border-white/20',
            'transition-all duration-200 shadow-lg hover:shadow-xl',
            'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
          ]"
        >
          <el-icon><ShoppingCart /></el-icon>
          <span>去购物车</span>
        </router-link>
      </div>
    </header>

    <!-- ====== 状态标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="订单状态导航"
    >
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :aria-current="$route.path === tab.path ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-1.5 px-4 py-3.5',
              'text-sm font-medium whitespace-nowrap rounded-t-lg',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              $route.path === tab.path
                ? 'text-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]"
          >
            <span>{{ tab.label }}</span>

            <!-- 状态角标 -->
            <span
              v-if="tab.badge !== null && tab.badge > 0"
              :class="[
                'ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none',
                $route.path === tab.path
                  ? 'bg-primary-100 text-primary'
                  : 'bg-crimson/10 text-crimson'
              ]"
            >
              {{ tab.badge }}
            </span>

            <!-- 选中态下划线 -->
            <span
              v-if="$route.path === tab.path"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
            />
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="orders-main-content"
      role="main"
      aria-label="订单列表主要内容"
      class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6"
    >
      <RouterView v-slot="{ Component }">
        <Transition
          name="page-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart } from '@element-plus/icons-vue'

// ============================================
// 导航配置（订单状态）
// ============================================
const tabs = [
  { label: '全部订单', path: '/user/orders', badge: null },
  { label: '待付款', path: '/user/orders?status=pending_payment', badge: 1 },
  { label: '待发货', path: '/user/orders?status=pending_shipment', badge: 0 },
  { label: '待收货', path: '/user/orders?status=shipped', badge: 1 },
  { label: '已完成', path: '/user/orders?status=completed', badge: null },
]
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

  nav[aria-label="订单状态导航"] {
    will-change: auto;
  }
}
</style>
