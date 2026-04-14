<template>
  <div class="announcement-layout min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
    <!-- Hero Header Section -->
    <header class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl"></div>
        <!-- Grid Pattern Overlay -->
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Title Section -->
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">信息公告</h1>
              <p class="text-blue-100 text-sm mt-1">教学通知 · 学工公告 · 校园活动 · 招聘信息</p>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="flex items-center gap-3">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <el-icon class="text-white" :size="16"><Bell /></el-icon>
                </div>
                <div>
                  <p class="text-white/70 text-xs">未读公告</p>
                  <p class="text-white font-bold text-lg leading-none">5</p>
                </div>
              </div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <el-icon class="text-white" :size="16"><Document /></el-icon>
                </div>
                <div>
                  <p class="text-white/70 text-xs">今日新增</p>
                  <p class="text-white font-bold text-lg leading-none">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 48h1440V24c-240 16-480 24-720 24S240 40 0 24v24z" fill="rgb(248 250 252)"/>
        </svg>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-1 -mb-px overflow-x-auto scrollbar-hide">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :class="[
              'group relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300',
              isTabActive(tab)
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            <!-- Icon -->
            <span class="text-lg transition-transform duration-300 group-hover:scale-110">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>

            <!-- Badge -->
            <span
              v-if="tab.badge"
              :class="[
                'ml-1 min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full flex items-center justify-center',
                isTabActive(tab)
                  ? 'bg-blue-600 text-white'
                  : 'bg-red-500 text-white ring-2 ring-white'
              ]"
            >
              {{ tab.badge }}
            </span>

            <!-- Active Indicator -->
            <span
              v-if="isTabActive(tab)"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
            ></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <RouterView v-slot="{ Component }">
        <Transition name="page-slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Bell, Document } from '@element-plus/icons-vue'

const tabs = [
  { label: '公告列表', path: '/announcements', base: '/announcements', icon: '\u{1F4CB}', exact: true, badge: '5' },
  { label: '通知中心', path: '/announcements/notifications', base: '/announcements/notifications', icon: '\u{1F514}' },
]

function isTabActive(tab: { base?: string; path: string; exact?: boolean }): boolean {
  if (tab.exact) {
    return window.location.pathname === tab.path
  }
  if (tab.base) {
    return window.location.pathname.startsWith(tab.base)
  }
  return window.location.pathname === tab.path
}
</script>

<style scoped>
/* Scrollbar Hide */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Page Transition */
.page-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .page-slide-enter-active,
  .page-slide-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
