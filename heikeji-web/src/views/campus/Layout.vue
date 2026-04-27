<template>
  <!-- ============================================
       校园服务布局 - Design System v3.0
       品牌头部（蓝绿色调和）+ 功能标签导航 + 主内容区
       UI优化: 统一使用科大蓝主色系，融入绿色体现生态校园特色
       ============================================ -->
  <div class="min-h-screen">
    <!-- ====== 品牌头部区域（蓝绿调和）====== -->
    <header class="relative overflow-hidden bg-gradient-to-r from-[#003366] via-[#006699] to-[#0088BB]">
      <!-- 装饰性背景 -->
      <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div class="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

      <div class="relative z-10 max-w-screen-xl mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1
            class="text-2xl font-bold text-white flex items-center gap-2"
            style="text-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;"
          >
            <span>&#x1F3DB;</span> {{ t('nav.campus') }}
          </h1>
          <p
            class="text-white text-sm mt-2 font-semibold tracking-wider"
            style="text-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;"
          >
            {{ t('campus.servicesList') }}
          </p>
        </div>

        <!-- 右侧：实时数据展示 -->
        <div
          class="hidden sm:flex items-center gap-3 text-white text-sm font-medium"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.3); -webkit-font-smoothing: antialiased;"
        >
          <span class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <el-icon :size="16"><Calendar /></el-icon>
            {{ t('campus.todayClasses') }}: 4
          </span>
          <span class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <el-icon :size="16"><Reading /></el-icon>
            {{ t('campus.libraryOpen') }}
          </span>
        </div>
      </div>
    </header>

    <!-- ====== 功能标签导航栏 ====== -->
    <nav
      class="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-border-subtle shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      :style="{ willChange: 'box-shadow' }"
      aria-label="校园服务导航"
    >
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
                ? 'text-primary font-bold bg-gradient-to-b from-primary/10 to-primary/5 shadow-[inset_0_-2px_0_0_var(--el-color-primary)]'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50/50'
            ]"
          >
            <!-- 图标 -->
            <span :class="['text-base transition-transform duration-200', isTabActive(tab) ? 'scale-110' : '']">
              {{ tab.icon }}
            </span>
            <span>{{ tab.label }}</span>

            <!-- 选中态下划线（品牌蓝）- 增强版 -->
            <span
              v-if="isTabActive(tab)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-primary-light rounded-full shadow-sm"
            />
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="campus-main-content"
      role="main"
      aria-label="校园服务主要内容"
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
import { Calendar, Reading } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

// ============================================
// 路由
// ============================================
const route = useRoute()
const { t } = useI18n()

// ============================================
// 导航配置
// ============================================
const tabs = computed(() => [
  { label: t('campus.schedule'), path: '/campus/schedule', base: '/campus/schedule', icon: '\u{1F4C5}' },
  { label: t('campus.library'), path: '/campus/library', base: '/campus/library', icon: '\u{1F4DA}' },
  { label: t('campus.map'), path: '/campus/map', base: '/campus/map', icon: '\u{1F5FA}' },
  { label: t('campus.grades'), path: '/campus/grades', base: '/campus/grades', icon: '\u{1F3C6}' },
  { label: t('campus.classroom'), path: '/campus/classroom', base: '/campus/classroom', icon: '\u{1F3EB}' },
  { label: t('campus.dormitory'), path: '/campus/dormitory', base: '/campus/dormitory', icon: '\u{1F3E0}' },
  { label: t('campus.canteen'), path: '/campus/canteen', base: '/campus/canteen', icon: '\u{1F35C}' },
  { label: t('campus.aiCourses'), path: '/campus/ai-courses', base: '/campus/ai-courses', icon: '\u{1F916}' },
  { label: t('campus.aiTeaching'), path: '/campus/ai-teaching', base: '/campus/ai-teaching', icon: '\u{1F4BB}' },
])

// 判断标签是否激活
function isTabActive(tab: { base?: string; path: string }): boolean {
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
    gap: 0.75rem;
  }

  header h1 {
    font-size: 1.25rem;
  }

  header p {
    font-size: 0.75rem;
    letter-spacing: 0.025em;
  }

  nav[aria-label="校园服务导航"] {
    top: 3.5rem;
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

  nav[aria-label="校园服务导航"] {
    will-change: auto;
  }
}
</style>
