<template>
  <!-- ============================================
       管理后台布局 - Design System v3.0
       侧边栏 + 顶栏 + 主内容区
       支持折叠/展开 + 响应式 + 可访问性
       ============================================ -->
  <div class="min-h-screen bg-surface-secondary flex" :class="{ 'overflow-hidden': isMobileSidebarOpen }">

    <!-- ====== 侧边栏（桌面端固定 + 移动端抽屉）====== -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40',
        'bg-white border-r border-border-subtle flex flex-col',
        'transition-all duration-300 ease-in-out',
        // 桌面端宽度
        isCollapsed ? 'w-16' : 'w-64',
        // 移动端显示/隐藏
        'lg:translate-x-0',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      :style="{ willChange: 'transform, width' }"
      role="navigation"
      aria-label="管理后台侧边栏菜单">

      <!-- Logo 区域 -->
      <div class="flex items-center gap-3 h-16 px-4 border-b border-border-subtle shrink-0 overflow-hidden">
        <USTHLogo size="sm" class="shrink-0" />
        <Transition name="fade-text">
          <span v-if="!isCollapsed"
                class="font-bold text-sm text-text-primary whitespace-nowrap">
            管理后台
          </span>
        </Transition>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide"
           aria-label="主菜单">

        <!-- 分组标题 -->
        <Transition name="fade-text">
          <p v-if="!isCollapsed"
             class="px-4 pt-4 pb-2 text-[11px] font-semibold text-text-quaternary uppercase tracking-wider">
            主要功能
          </p>
        </Transition>

        <!-- 菜单项 -->
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          :title="isCollapsed ? item.label : undefined"
          :class="[
            'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
            // 内边距根据折叠状态调整
            isCollapsed ? 'justify-center px-0 py-3 w-10 mx-auto' : 'px-4 py-3',
            // 激活状态
            isActive(item.path)
              ? 'bg-primary-50 text-primary font-semibold'
              : 'text-text-secondary hover:bg-primary-50/60 hover:text-primary'
          ]">

          <!-- 图标 -->
          <el-icon
            :size="20"
            :class="[
              'shrink-0 transition-colors duration-200',
              isActive(item.path) ? '' : 'group-hover:text-primary'
            ]">
            <component :is="item.icon" />
          </el-icon>

          <!-- 文字 -->
          <Transition name="fade-text">
            <span v-if="!isCollapsed"
                  class="text-sm whitespace-nowrap">
              {{ item.label }}
            </span>
          </Transition>

          <!-- 选中态左侧指示条 -->
          <span
            v-if="isActive(item.path)"
            :class="[
              'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full',
              'transition-all duration-300 ease-out'
            ]">
          </span>
        </router-link>
      </nav>

      <!-- 底部操作区 -->
      <div class="p-4 border-t border-border-subtle shrink-0">
        <router-link
          to="/"
          :class="[
            'flex items-center gap-3 rounded-xl text-xs transition-colors duration-200',
            isCollapsed
              ? 'justify-center py-3 w-10 mx-auto text-text-tertiary hover:text-primary hover:bg-primary-50/60'
              : 'px-4 py-2.5 text-text-tertiary hover:text-primary hover:bg-gray-50'
          ]"
          title="返回前台">
          <el-icon :size="16"><Back /></el-icon>
          <Transition name="fade-text">
            <span v-if="!isCollapsed">返回前台</span>
          </Transition>
        </router-link>
      </div>
    </aside>

    <!-- ====== 主内容区域 ====== -->
    <div :class="['flex-1 flex flex-col min-w-0 transition-all duration-300', isCollapsed ? 'lg:ml-16' : 'lg:ml-64']">

      <!-- 顶部工具栏 -->
      <header
        :class="[
          'sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-transparent',
          'transition-all duration-300',
          'h-16 flex items-center justify-between px-6 shrink-0',
          isScrolledHeader ? 'shadow-md shadow-black/5 border-border-subtle' : ''
        ]"
        :style="{ willChange: 'box-shadow' }">

        <!-- 左侧：折叠按钮 + 页面标题 -->
        <div class="flex items-center gap-3">
          <!-- 折叠/展开按钮（桌面端） -->
          <button
            @click="toggleCollapse"
            :aria-label="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
            :aria-expanded="!isCollapsed"
            :class="[
              'hidden lg:flex w-9 h-9 rounded-xl items-center justify-center',
              'text-text-tertiary hover:text-primary hover:bg-primary-50/80',
              'transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            ]">
            <el-icon :size="18">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileSidebar"
            :aria-expanded="isMobileSidebarOpen"
            aria-label="打开侧边栏菜单"
            :class="[
              'lg:hidden w-9 h-9 rounded-xl flex items-center justify-center',
              'text-text-secondary hover:text-primary hover:bg-primary-50/80',
              'transition-all duration-200'
            ]">
            <el-icon :size="20"><Menu /></el-icon>
          </button>

          <!-- 面包屑 / 页面标题 -->
          <div class="flex items-center gap-2">
            <h1 class="text-base font-semibold text-text-primary">{{ pageTitle }}</h1>
          </div>
        </div>

        <!-- 右侧：操作按钮组 -->
        <div class="flex items-center gap-2">
          <!-- 通知铃铛 -->
          <button
            :aria-label="`通知${notificationCount > 0 ? `，${notificationCount}条未读` : ''}`"
            :class="[
              'relative w-9 h-9 rounded-xl flex items-center justify-center',
              'text-text-tertiary hover:text-gold hover:bg-gold/10',
              'transition-all duration-200'
            ]">
            <el-icon :size="18"><Bell /></el-icon>
            <span v-if="notificationCount > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white">
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>

          <!-- 用户头像 -->
          <div class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-primary-50/80 transition-colors cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold ring-2 ring-primary-100">
              管
            </div>
            <span class="text-sm font-medium text-text-primary hidden sm:block">管理员</span>
          </div>
        </div>
      </header>

      <!-- 主内容区 -->
      <main
        id="admin-main-content"
        class="flex-1 p-6 overflow-y-auto"
        role="main"
        aria-label="管理后台主要内容">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- ====== 移动端遮罩层 ====== -->
    <Transition name="overlay-fade">
      <div
        v-if="isMobileSidebarOpen"
        @click="closeMobileSidebar"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        aria-hidden="true">
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  DataAnalysis, Goods, User, Document, Setting, Bell,
  Back, Fold, Expand, Monitor, Menu
} from '@element-plus/icons-vue'
import USTHLogo from '@/components/global/USTHLogo.vue'

// ============================================
// 响应式状态
// ============================================
const route = useRoute()
const isCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isScrolledHeader = ref(false)
const notificationCount = ref(3)

// ============================================
// 菜单配置
// ============================================
const menuItems = [
  { path: '/admin/dashboard', label: '数据看板', icon: DataAnalysis },
  { path: '/admin/products', label: '商品管理', icon: Goods },
  { path: '/admin/users', label: '用户管理', icon: User },
  { path: '/admin/orders', label: '订单管理', icon: Document },
  { path: '/admin/system', label: '系统设置', icon: Setting },
]

// ============================================
// 计算属性
// ============================================

// 当前页面标题
const pageTitle = computed(() => {
  const matched = route.matched[route.matched.length - 1]
  return (matched?.meta?.title as string) || '管理后台'
})

// 判断菜单项是否激活
function isActive(path: string): boolean {
  return route.path.startsWith(path)
}

// ============================================
// 交互方法
// ============================================

// 切换侧边栏折叠状态
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// 切换移动端侧边栏
function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  if (isMobileSidebarOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 关闭移动端侧边栏
function closeMobileSidebar() {
  isMobileSidebarOpen.value = false
  document.body.style.overflow = ''
}

// ============================================
// 滚动监听
// ============================================
function handleScroll() {
  const mainContent = document.getElementById('admin-main-content')
  if (mainContent) {
    isScrolledHeader.value = mainContent.scrollTop > 20
  }
}

// ============================================
// 生命周期
// ============================================
onMounted(() => {
  const mainContent = document.getElementById('admin-main-content')
  if (mainContent) {
    mainContent.addEventListener('scroll', handleScroll, { passive: true })
  }

  // ESC 键关闭移动端侧边栏
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileSidebarOpen.value) {
      closeMobileSidebar()
    }
  }
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.body.style.overflow = '' // 清理滚动锁定
})
</script>

<style scoped>
/* ============================================
   样式系统 - Design System v3.0
   ============================================ */

/* 自定义滚动条隐藏 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 文字淡入淡出（用于折叠动画） */
.fade-text-enter-active,
.fade-text-leave-active {
  transition: all 0.2s ease-out;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
  transform: translateX(-8px);
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

/* 遮罩层过渡 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* ============================================
   响应式优化
   ============================================ */

/* 平板设备 */
@media (max-width: 1023px) and (min-width: 768px) {
  aside:not(.lg\:translate-x-0) {
    width: 240px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button {
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.97);
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
  .page-fade-leave-active,
  .fade-text-enter-active,
  .fade-text-leave-active,
  .overlay-fade-enter-active,
  .overlay-fade-leave-active {
    transition-duration: 0.01ms !important;
  }

  aside,
  header {
    will-change: auto;
  }
}
</style>
