<template>
  <!-- ============================================
       商品中心布局 - Modern Design v4.0
       现代化电商风格，渐变背景 + 玻璃拟态
       ============================================ -->
  <div class="min-h-screen bg-slate-50">

    <!-- ====== 品牌头部区域 - 动态渐变背景 ====== -->
    <header class="relative overflow-hidden">
      <!-- 渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500"></div>
      
      <!-- 装饰性光晕 -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
      
      <!-- 网格纹理 -->
      <div class="absolute inset-0 opacity-10" 
           style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);">
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <!-- 顶部导航栏 -->
        <div class="flex items-center justify-between mb-8">
          <!-- 左侧：品牌标识 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <IconSet name="shopping-cart" size="lg" color="white" />
            </div>
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                商品中心
              </h1>
              <p class="text-blue-100 text-sm mt-0.5">精选好物 · 品质保证 · 极速配送</p>
            </div>
          </div>

          <!-- 右侧：购物车入口 -->
          <router-link
            to="/cart"
            class="ripple-effect group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-xl"
          >
            <div class="relative">
              <IconSet name="shopping-cart" size="md" color="white" />
              <span v-if="cartCount > 0"
                    class="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {{ cartCount > 99 ? '99+' : cartCount }}
              </span>
            </div>
            <span class="hidden sm:inline">购物车</span>
          </router-link>
        </div>

        <!-- 服务承诺快捷展示 -->
        <div class="flex flex-wrap items-center gap-4 lg:gap-8 text-white/80 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <IconSet name="check-circle" size="sm" color="#6ee7b7" />
            </div>
            <span>正品保证</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <IconSet name="truck" size="sm" color="#fcd34d" />
            </div>
            <span>极速发货</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <IconSet name="arrow-path" size="sm" color="#67e8f9" />
            </div>
            <span>无忧退换</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <IconSet name="headphones" size="sm" color="#c4b5fd" />
            </div>
            <span>专属客服</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ====== 分类标签导航栏 - 胶囊式设计 ====== -->
    <nav
      class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
      aria-label="商品分类导航"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          <router-link
            v-for="(tab, index) in tabs"
            :key="tab.path"
            :to="tab.path"
            :aria-current="isTabActive(tab) ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
              isTabActive(tab)
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]"
            :style="isTabActive(tab) ? { animationDelay: `${index * 50}ms` } : {}"
          >
            <IconSet :name="tab.icon" size="sm" :color="isTabActive(tab) ? 'white' : 'currentColor'" />
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.badge"
              class="ml-1 min-w-[18px] h-[18px] px-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full leading-none"
            >
              {{ tab.badge }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="products-main-content"
      role="main"
      aria-label="商品列表主要内容"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
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
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import IconSet from '@/components/icons/IconSet.vue'

// ============================================
// 状态管理
// ============================================
const cartStore = useCartStore()
const route = useRoute()
const cartCount = computed(() => cartStore.items.reduce((sum, item) => sum + (item.quantity || 1), 0))

// ============================================
// 导航配置 - 使用SVG图标
// ============================================
const tabs = [
  { label: '全部商品', path: '/products', icon: 'store' },
  { label: '数码电子', path: '/products?category=electronics', icon: 'device-phone' },
  { label: '图书文具', path: '/products?category=books', icon: 'book-open' },
  { label: '生活日用', path: '/products?category=daily', icon: 'home' },
  { label: '食品零食', path: '/products?category=food', icon: 'cake' },
]

// 判断标签是否激活
function isTabActive(tab: { path: string }): boolean {
  const currentPath = route.path
  const currentQuery = route.query.category as string | undefined
  
  if (tab.path === '/products') {
    return currentPath === '/products' && !currentQuery
  }
  
  const tabCategory = new URLSearchParams(tab.path.split('?')[1]).get('category')
  return currentQuery === tabCategory
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

/* 页面切换过渡 - 更流畅的动画 */
.page-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* 响应式优化 */
@media (max-width: 639px) {
  header .flex.items-center.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  a[role="link"] {
    -webkit-tap-highlight-color: transparent;
  }
  
  a[role="link"]:active {
    transform: scale(0.97);
    transition: transform 0.1s ease-out;
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
}
</style>
