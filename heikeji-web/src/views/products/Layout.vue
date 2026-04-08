<template>
  <!-- ============================================
       商品中心布局 - Design System v3.0
       品牌头部 + 分类标签导航 + 主内容区
       ============================================ -->
  <div class="min-h-screen">

    <!-- ====== 品牌头部区域 ====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-light">
      <!-- 装饰性背景 -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span>&#x1F6D2;</span> 商品中心
          </h1>
          <p class="text-white/70 text-sm mt-1">精选好物 · 品质保证</p>
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
          ]">
          <el-icon><ShoppingCart /></el-icon>
          <span>购物车</span>
          <span v-if="cartCount > 0"
                class="ml-1 min-w-[18px] h-[18px] px-1.5 bg-crimson text-white text-[10px] font-bold rounded-full leading-none">
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </router-link>
      </div>
    </header>

    <!-- ====== 分类标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="商品分类导航">
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
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isTabActive(tab)
                ? 'text-primary font-semibold bg-primary-50/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]">

            <!-- 图标 -->
            <span class="text-base">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>

            <!-- 角标（如果有） -->
            <span
              v-if="tab.badge"
              class="ml-1 min-w-[18px] h-[18px] px-1.5 bg-crimson text-white text-[10px] font-bold rounded-full leading-none ring-2 ring-white">
              {{ tab.badge }}
            </span>

            <!-- 选中态下划线 -->
            <span
              v-if="isTabActive(tab)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="products-main-content"
      role="main"
      aria-label="商品列表主要内容"
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
import { useCartStore } from '@/stores/cart'
import { ShoppingCart } from '@element-plus/icons-vue'

// ============================================
// 状态管理
// ============================================
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.items.reduce((sum, item) => sum + (item.quantity || 1), 0))

// ============================================
// 导航配置
// ============================================
const tabs = [
  { label: '全部商品', path: '/products', icon: '\u{1F3EA}' },
  { label: '数码电子', path: '/products?category=electronics', icon: '\u{1F4F1}' },
  { label: '图书文具', path: '/products?category=books', icon: '\u{1F4DA}' },
  { label: '生活日用', path: '/products?category=daily', icon: '\u{1F3E0}' },
  { label: '食品零食', path: '/products?category=food', icon: '\u{1F35C}' },
]

// 判断标签是否激活
function isTabActive(tab: { path: string }): boolean {
  return window.location.pathname === tab.path ||
         (window.location.pathname === '/products' && tab.path === '/products')
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

  nav[aria-label="商品分类导航"] {
    will-change: auto;
  }
}
</style>
