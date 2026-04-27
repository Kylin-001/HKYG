<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAnnouncementStore } from '@/stores/announcement'
import {
  Document, CircleCheckFilled, Search, Money,
  Setting, Bell, Promotion, Notification as NotifIcon,
  Check, Delete as Trash, Filter, CircleCheck, Clock, MoreFilled
} from '@element-plus/icons-vue'

const store = useAnnouncementStore()

const notificationTypeMap: Record<string, { icon: any; label: string; gradient: string; bgColor: string; color: string; lightColor: string }> = {
  course: { 
    icon: Document, 
    label: '课程通知', 
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    color: 'text-blue-600',
    lightColor: 'bg-blue-500/10'
  },
  approval: { 
    icon: CircleCheckFilled, 
    label: '审批通知', 
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    color: 'text-amber-600',
    lightColor: 'bg-amber-500/10'
  },
  claim: { 
    icon: Search, 
    label: '认领通知', 
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    color: 'text-emerald-600',
    lightColor: 'bg-emerald-500/10'
  },
  payment: { 
    icon: Money, 
    label: '缴费通知', 
    gradient: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    color: 'text-rose-600',
    lightColor: 'bg-rose-500/10'
  },
  system: { 
    icon: Setting, 
    label: '系统通知', 
    gradient: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    color: 'text-slate-600',
    lightColor: 'bg-slate-500/10'
  },
  announcement: { 
    icon: Promotion, 
    label: '公告推送', 
    gradient: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    color: 'text-violet-600',
    lightColor: 'bg-violet-500/10'
  },
}

const unreadCount = computed(() => store.notifications.filter(n => !n.isRead).length)

onMounted(() => {
  store.fetchNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-5xl mx-auto space-y-6">
      
      <!-- Header Card -->
      <div class="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <!-- Decorative Background Elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div class="relative p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <!-- Title & Stats -->
            <div class="flex items-center gap-5">
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
                  <el-icon :size="28" class="text-white"><Bell /></el-icon>
                </div>
                <!-- Notification Badge -->
                <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                  <span class="text-[10px] font-bold text-white">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
                </div>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  我的通知
                </h1>
                <p class="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <span>共 {{ store.notifications.length }} 条通知</span>
                  <span v-if="unreadCount > 0" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 text-xs font-semibold border border-rose-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    {{ unreadCount }} 条未读
                  </span>
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <button
                v-if="unreadCount > 0"
                @click="store.markAllRead()"
                class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <el-icon :size="16" class="relative"><CircleCheck /></el-icon>
                <span class="relative">全部已读</span>
              </button>
              <button
                class="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 hover:shadow-md transition-all duration-300"
              >
                <el-icon :size="16" class="group-hover:rotate-90 transition-transform duration-300"><Filter /></el-icon>
                筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification List -->
      <div v-if="store.notifications.length > 0" class="space-y-4">
        <div
          v-for="(notif, index) in store.notifications"
          :key="notif.id"
          @click="store.markAsRead(notif.id)"
          :class="[
            'group relative bg-white rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all duration-500 ease-out',
            notif.isRead 
              ? 'border-slate-100 opacity-75 hover:opacity-100' 
              : 'border-transparent shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1'
          ]"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Unread Left Indicator -->
          <div 
            v-if="!notif.isRead" 
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-r-full shadow-lg shadow-blue-500/30"
          ></div>
          
          <!-- Subtle Gradient Background for Unread -->
          <div 
            v-if="!notif.isRead"
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <div class="relative flex items-start gap-4 sm:gap-5">
            <!-- Icon Container -->
            <div 
              :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                notif.isRead 
                  ? 'bg-slate-100' 
                  : `bg-gradient-to-br ${notificationTypeMap[notif.type]?.gradient || 'from-slate-500 to-slate-600'} shadow-lg shadow-blue-500/20`
              ]"
            >
              <el-icon 
                :size="24" 
                :class="notif.isRead ? 'text-slate-400' : 'text-white'"
              >
                <component :is="notificationTypeMap[notif.type]?.icon || NotifIcon" />
              </el-icon>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Header Row -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <!-- Type Badge -->
                  <span 
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors duration-300',
                      notif.isRead 
                        ? 'bg-slate-100 text-slate-500' 
                        : `${notificationTypeMap[notif.type]?.lightColor} ${notificationTypeMap[notif.type]?.color}`
                    ]"
                  >
                    {{ notificationTypeMap[notif.type]?.label || '通知' }}
                  </span>
                  
                  <!-- Title -->
                  <h3 
                    :class="[
                      'text-base font-semibold transition-colors duration-300',
                      notif.isRead ? 'text-slate-500' : 'text-slate-800 group-hover:text-blue-600'
                    ]"
                  >
                    {{ notif.title }}
                  </h3>
                  
                  <!-- Unread Dot -->
                  <span 
                    v-if="!notif.isRead" 
                    class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"
                  ></span>
                </div>
                
                <!-- Time -->
                <div class="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                  <el-icon :size="12"><Clock /></el-icon>
                  <span>{{ notif.createdAt }}</span>
                </div>
              </div>

              <!-- Body Text -->
              <p 
                :class="[
                  'text-sm leading-relaxed line-clamp-2 transition-colors duration-300',
                  notif.isRead ? 'text-slate-400' : 'text-slate-600'
                ]"
              >
                {{ notif.content }}
              </p>
            </div>

            <!-- Actions -->
            <div class="shrink-0 flex flex-col items-end gap-2">
              <!-- Mark Read Button -->
              <button
                v-if="!notif.isRead"
                @click.stop="store.markAsRead(notif.id)"
                class="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110"
                title="标记为已读"
              >
                <el-icon :size="16"><Check /></el-icon>
              </button>
              
              <!-- More Options (visible on hover) -->
              <button
                class="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="更多选项"
              >
                <el-icon :size="16"><MoreFilled /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="relative">
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-12 sm:p-16 text-center overflow-hidden">
          <!-- Decorative Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/50"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          
          <div class="relative">
            <!-- Icon -->
            <div class="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 flex items-center justify-center shadow-xl shadow-emerald-500/10">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <el-icon :size="36" class="text-white"><CircleCheckFilled /></el-icon>
              </div>
            </div>
            
            <!-- Text -->
            <h3 class="text-xl font-bold text-slate-800 mb-2">暂无新通知</h3>
            <p class="text-slate-500 max-w-sm mx-auto">所有消息已阅读完毕，您可以稍后再来查看新的通知</p>
            
            <!-- Refresh Button -->
            <button 
              @click="store.fetchNotifications()"
              class="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 hover:shadow-md transition-all duration-300"
            >
              <el-icon :size="16" class="hover:rotate-180 transition-transform duration-500"><Clock /></el-icon>
              刷新通知
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Info -->
      <div v-if="store.notifications.length > 0" class="text-center">
        <p class="text-xs text-slate-400">
          显示全部 {{ store.notifications.length }} 条通知 · 最后更新于刚刚
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth fade-in animation for list items */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > div {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
