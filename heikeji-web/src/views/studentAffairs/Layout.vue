<template>
  <!-- ============================================
       学工办理布局 - Modern Design v5.0
       现代化政务风格，专业优雅
       ============================================ -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">

    <!-- ====== 品牌头部区域 - 现代化渐变设计 ====== -->
    <header class="relative overflow-hidden">
      <!-- 渐变背景 - 使用蓝紫色调体现专业性 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600"></div>
      
      <!-- 动态光晕效果 -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
      
      <!-- 几何装饰网格 -->
      <div class="absolute inset-0 opacity-5">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="white"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <!-- 顶部导航栏 -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- 左侧：品牌标识 -->
          <div class="flex items-center gap-5">
            <div class="relative">
              <div class="absolute inset-0 bg-white/30 rounded-2xl blur-xl animate-pulse"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <IconSet name="clipboard-document" size="xl" color="white" />
              </div>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  学工办理
                </h1>
                <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white/90 text-xs font-medium backdrop-blur-sm">
                  v2.0
                </span>
              </div>
              <p class="text-blue-100 text-sm">一站式学生事务服务平台 · 高效便捷</p>
            </div>
          </div>

          <!-- 右侧：状态卡片组 -->
          <div class="flex items-center gap-3 flex-wrap">
            <!-- 待办事项卡片 -->
            <div class="group ripple-effect flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <div class="relative">
                <div class="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                  <IconSet name="bell" size="md" color="#fcd34d" />
                </div>
                <span v-if="pendingCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {{ pendingCount > 9 ? '9+' : pendingCount }}
                </span>
              </div>
              <div>
                <p class="text-blue-100 text-xs">待办事项</p>
                <p class="text-white font-bold text-lg">{{ pendingCount }} <span class="text-sm font-normal text-blue-200">项</span></p>
              </div>
            </div>
            
            <!-- 校园卡状态卡片 -->
            <div class="group ripple-effect flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <IconSet name="credit-card" size="md" color="#6ee7b7" />
              </div>
              <div>
                <p class="text-blue-100 text-xs">校园卡</p>
                <p class="text-white font-bold text-lg flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  正常
                </p>
              </div>
            </div>

            <!-- 本月完成卡片 -->
            <div class="group ripple-effect flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <div class="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <IconSet name="check-circle" size="md" color="#60a5fa" />
              </div>
              <div>
                <p class="text-blue-100 text-xs">本月完成</p>
                <p class="text-white font-bold text-lg">12 <span class="text-sm font-normal text-blue-200">项</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- 服务快捷入口标签 -->
        <div class="flex flex-wrap items-center gap-3 mt-8">
          <router-link 
            v-for="(tag, index) in quickTags" 
            :key="tag.path"
            :to="tag.path"
            class="group px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/10 flex items-center gap-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <IconSet :name="tag.icon" size="xs" color="white" class="group-hover:rotate-12 transition-transform" />
            {{ tag.label }}
            <span v-if="tag.badge" class="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {{ tag.badge }}
            </span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 - 胶囊式设计 ====== -->
    <nav
      class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
      aria-label="学工办理导航"
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
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]"
          >
            <IconSet :name="tab.icon" size="sm" :color="isTabActive(tab) ? 'white' : 'currentColor'" />
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.badge"
              :class="[
                'ml-1 min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center',
                isTabActive(tab) ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
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
      id="student-affairs-main-content"
      role="main"
      aria-label="学工办理主要内容"
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import IconSet from '@/components/icons/IconSet.vue'

// ============================================
// 路由和状态管理
// ============================================
const route = useRoute()
const store = useStudentAffairsStore()

// 待办数量
const pendingCount = ref(2)

// 初始化数据
onMounted(async () => {
  await store.fetchPendingTasks()
  pendingCount.value = store.pendingTasks.length || 2
})

// ============================================
// 快捷标签配置
// ============================================
const quickTags = [
  { label: '请假申请', path: '/student-affairs/leave', icon: 'document-text', badge: '1' },
  { label: '助学金', path: '/student-affairs/aid', icon: 'currency-dollar' },
  { label: '军训服装', path: '/student-affairs/military', icon: 'shield-check' },
  { label: '校园卡', path: '/student-affairs/campus-card', icon: 'credit-card' },
  { label: '资助政策', path: '/student-affairs/policy', icon: 'book-open-2' },
]

// ============================================
// 导航配置
// ============================================
const tabs = [
  { label: '学工首页', path: '/student-affairs', base: '/student-affairs', icon: 'building-library', exact: true },
  { label: '请假申请', path: '/student-affairs/leave', base: '/student-affairs/leave', icon: 'document-text', badge: '1' },
  { label: '助学金', path: '/student-affairs/aid', base: '/student-affairs/aid', icon: 'currency-dollar' },
  { label: '军训服装', path: '/student-affairs/military', base: '/student-affairs/military', icon: 'shield-check' },
  { label: '校园卡', path: '/student-affairs/campus-card', base: '/student-affairs/campus-card', icon: 'credit-card' },
  { label: '资助政策', path: '/student-affairs/policy', base: '/student-affairs/policy', icon: 'book-open-2' },
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
