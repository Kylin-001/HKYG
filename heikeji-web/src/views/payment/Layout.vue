<template>
  <!-- ============================================
       缴费中心布局 - Modern Financial Design v5.0
       深蓝+金色财务专业风格，体现权威与信任
       ============================================ -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">

    <!-- ====== 品牌头部区域 - 深蓝金渐变体现财务属性 ====== -->
    <header class="relative overflow-hidden">
      <!-- 主渐变背景 - 深蓝到金色渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-amber-600"></div>
      
      <!-- 动态光晕效果 -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 animate-pulse-soft"></div>
      <div class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] translate-y-1/3"></div>
      <div class="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[60px] -translate-x-1/4"></div>
      
      <!-- 装饰性金币图案 -->
      <div class="absolute inset-0 opacity-[0.03]">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="coin-pattern" width="15" height="15" patternUnits="userSpaceOnUse">
              <circle cx="7.5" cy="7.5" r="2.5" fill="white"/>
              <text x="7.5" y="8.5" text-anchor="middle" font-size="3" fill="white" opacity="0.5">¥</text>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#coin-pattern)"/>
        </svg>
      </div>

      <!-- 顶部装饰线 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <!-- 顶部导航栏 -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- 左侧：品牌标识 -->
          <div class="flex items-center gap-5">
            <div class="relative">
              <div class="absolute inset-0 bg-amber-400/30 rounded-2xl blur-lg animate-pulse-soft"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/20">
                <IconSet name="currency-dollar" size="2xl" color="#fbbf24" />
              </div>
            </div>
            <div>
              <h1 class="text-2xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                缴费中心
              </h1>
              <p class="text-blue-200/80 text-sm mt-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                学费 · 住宿费 · 缴费记录 · 绿色通道
              </p>
            </div>
          </div>

          <!-- 右侧：缴费统计卡片 -->
          <div class="flex items-center gap-4">
            <!-- 待缴费卡片 -->
            <div class="group relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20">
              <div class="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center border border-amber-400/30">
                <IconSet name="bell" size="lg" color="#fbbf24" />
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-900 animate-bounce"></div>
              </div>
              <div class="relative">
                <p class="text-blue-200/70 text-xs font-medium uppercase tracking-wider">待缴费</p>
                <p class="text-white font-bold text-xl">2 <span class="text-sm font-normal text-blue-200/60">项</span></p>
              </div>
            </div>
            
            <!-- 已缴清卡片 -->
            <div class="group relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center border border-emerald-400/30">
                <IconSet name="check-circle" size="lg" color="#34d399" />
              </div>
              <div class="relative">
                <p class="text-blue-200/70 text-xs font-medium uppercase tracking-wider">已缴清</p>
                <p class="text-white font-bold text-xl">3 <span class="text-sm font-normal text-blue-200/60">项</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 - 现代化胶囊式设计 ====== -->
    <nav
      class="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm shadow-slate-200/50"
      aria-label="缴费中心导航"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          <router-link
            v-for="(tab, index) in tabs"
            :key="tab.path"
            :to="tab.path"
            :aria-current="isTabActive(tab) ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300',
              isTabActive(tab)
                ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            ]"
          >
            <span :class="['transition-transform duration-300', isTabActive(tab) ? 'scale-110' : 'group-hover:scale-105']">
              <IconSet :name="tab.icon" size="sm" :color="isTabActive(tab) ? 'white' : 'currentColor'" />
            </span>
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.badge"
              :class="[
                'ml-1 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce-in',
                isTabActive(tab) ? 'bg-amber-400 text-blue-900' : 'bg-rose-500 text-white'
              ]"
            >
              {{ tab.badge }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="payment-main-content"
      role="main"
      aria-label="缴费中心主要内容"
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
import { useRoute } from 'vue-router'
import IconSet from '@/components/icons/IconSet.vue'

// ============================================
// 路由
// ============================================
const route = useRoute()

// ============================================
// 导航配置 - 使用SVG图标
// ============================================
const tabs = [
  { label: '缴费首页', path: '/payment', base: '/payment', icon: 'building-library', exact: true },
  { label: '学费缴纳', path: '/payment/tuition', base: '/payment/tuition', icon: 'academic-cap', badge: '1' },
  { label: '住宿费', path: '/payment/dormitory-fee', base: '/payment/dormitory-fee', icon: 'home' },
  { label: '缴费记录', path: '/payment/records', base: '/payment/records', icon: 'clipboard-document' },
  { label: '绿色通道', path: '/payment/green-channel', base: '/payment/green-channel', icon: 'shield-check' },
]

// 判断标签是否激活
function isTabActive(tab: { base?: string; path: string; exact?: boolean }): boolean {
  if (tab.exact) {
    return route.path === tab.path
  }
  if (tab.base) {
    return route.path.startsWith(tab.base)
  }
  return route.path === tab.path
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
