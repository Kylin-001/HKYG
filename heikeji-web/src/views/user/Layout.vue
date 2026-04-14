<template>
  <!-- ============================================
       用户中心布局 - Redesign v2.0
       只保留标签导航（全局头部已在App.vue中）
       ============================================ -->
  <div style="min-height: 100vh; background-color: #f5f7fa;">

    <!-- ====== 标签导航栏（用户中心专属）====== -->
    <nav style="background: white; border-bottom: 1px solid #e5e7eb; position: sticky; top: 64px; z-index: 30;" aria-label="用户中心导航菜单">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 16px;">
        <div style="display: flex; align-items: center; gap: 4px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            :aria-current="isTabActive(item) ? 'page' : undefined"
            :style="{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 16px',
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: isTabActive(item) ? '#0056b3' : '#6b7280',
              transition: 'all 0.2s'
            }"
            class="nav-link">
            <!-- 图标 -->
            <span style="font-size: 16px;">{{ item.icon }}</span>
            <!-- 文字 -->
            <span>{{ item.label }}</span>
            <!-- 未读角标 -->
            <span
              v-if="item.badge"
              style="margin-left: 2px; min-width: 16px; height: 16px; padding: 0 4px; font-size: 10px; font-weight: 700; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #ef4444; color: white;">
              {{ item.badge }}
            </span>
            <!-- 选中态下划线 -->
            <span
              v-if="isTabActive(item)"
              style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 2px; background: #0056b3; border-radius: 1px;"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- ====== 主内容区 ====== -->
    <main
      id="user-main-content"
      role="main"
      aria-label="用户中心主要内容"
      style="max-width: 1280px; margin: 0 auto; padding: 16px;">
      <RouterView v-slot="{ Component, route: childRoute }">
        <component :is="Component" :key="childRoute.fullPath" />
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// ============================================
// 状态管理
// ============================================
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 计算属性
const displayName = computed(() => userStore.user?.nickname || '用户中心')

// ============================================
// 导航配置 - 精简为核心功能
// ============================================
const navItems = [
  { label: '个人主页', path: '/user/profile', icon: '\u{1F464}', base: '/user/profile' },
  { label: '我的订单', path: '/user/orders', icon: '\u{1F4E6}', base: '/user/orders', badge: '7' },
  { label: '消息中心', path: '/user/notifications', icon: '\u{1F514}', base: '/user/notifications', badge: '5' },
  { label: '收藏夹', path: '/user/favorites', icon: '\u{2764}\u{FE0F}', base: '/user/favorites' },
  { label: '地址管理', path: '/user/addresses', icon: '\u{1F4CD}', base: '/user/addresses' },
  { label: '优惠券', path: '/user/coupons', icon: '\u{1F39F}', base: '/user/coupons', badge: '3' },
  { label: '设置', path: '/user/settings', icon: '\u2699\uFE0F', base: '/user/settings' },
]

// 判断标签是否激活 - 使用响应式的 route.path
function isTabActive(item: { base?: string; path: string }): boolean {
  if (item.base) {
    return route.path.startsWith(item.base)
  }
  return route.path === item.path
}

// 导航跳转
async function navigateTo(path: string) {
  console.log('Navigating to:', path)
  try {
    await router.push(path)
    console.log('Navigation successful to:', path)
  } catch (err: any) {
    console.error('Navigation failed:', err)
    // 如果是取消导航（如导航守卫阻止），不显示错误
    if (err.name !== 'NavigationCancelled' && err.message !== 'Navigation cancelled') {
      console.error('Navigation error:', err.message)
    }
  }
}
</script>

<style scoped>
/* 隐藏滚动条 */
nav div::-webkit-scrollbar {
  display: none;
}

/* 导航链接悬停效果 */
.nav-link:hover {
  color: #374151 !important;
  background: #f9fafb !important;
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
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button {
    -webkit-tap-highlight-color: transparent;
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
