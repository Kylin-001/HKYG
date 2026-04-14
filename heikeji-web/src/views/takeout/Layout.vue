<template>
  <!-- ============================================
       外卖中心布局 - Design System v3.0
       品牌头部（品牌蓝+暖色调和）+ 功能标签导航 + 主内容区
       UI优化: 统一使用科大蓝主色系，保留暖色调点缀体现外卖活力
       ============================================ -->
  <div class="min-h-screen">
    <!-- ====== 品牌头部区域（蓝色+暖色调和）====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-[#002D6B] via-[#004080] to-[#0066CC]">
      <!-- 装饰性背景 -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span>&#x1F354;</span> 校园外卖
          </h1>
          <p class="text-white/70 text-sm mt-1">
            美味送达 · 足不出户
          </p>
        </div>

        <!-- 右侧：实时数据展示 -->
        <div class="hidden sm:flex items-center gap-3 text-white/80 text-xs">
          <span class="flex items-center gap-1">
            <el-icon :size="14"><Clock /></el-icon>
            配送中: 128单
          </span>
          <span class="w-px h-4 bg-white/20" />
          <span class="flex items-center gap-1">
            <el-icon :size="14"><Shop /></el-icon>
            入驻商家: 56家
          </span>
        </div>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-sm"
      :style="{ willChange: 'box-shadow' }"
      aria-label="外卖中心导航"
    >
      <div class="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :aria-current="route.path === tab.path ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-1.5 px-4 py-3.5',
              'text-sm font-medium whitespace-nowrap rounded-t-lg',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              route.path === tab.path
                ? 'text-primary font-semibold bg-primary/5'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]"
          >
            <!-- 图标 -->
            <span class="text-base">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>

            <!-- 选中态下划线（品牌蓝） -->
            <span
              v-if="route.path === tab.path"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
            />
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="takeout-main-content"
      role="main"
      aria-label="外卖中心主要内容"
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
import { Clock, Shop } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

// ============================================
// 路由
// ============================================
const route = useRoute()

// ============================================
// 导航配置
// ============================================
const tabs = [
  { label: '外卖首页', path: '/takeout', icon: '\u{1F3E0}' },
  { label: '全部商家', path: '/takeout', icon: '\u{1F37D}' },
  { label: '我的订单', path: '/user/orders?status=shipped', icon: '\u{1F4CB}' },
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

  nav[aria-label="外卖中心导航"] {
    will-change: auto;
  }
}
</style>
