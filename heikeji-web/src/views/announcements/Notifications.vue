<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnnouncementStore } from '@/stores/announcement'
import {
  Document, CircleCheckFilled, Search, Money,
  Setting, Bell, Promotion, Notification as NotifIcon
} from '@element-plus/icons-vue'

const store = useAnnouncementStore()

const notificationTypeMap: Record<string, { icon: any; color: string }> = {
  course: { icon: Document, color: 'bg-primary-50 border-primary-200' },
  approval: { icon: CircleCheckFilled, color: 'bg-gold/10 border-gold/30' },
  claim: { icon: Search, color: 'bg-pine/10 border-pine/30' },
  payment: { icon: Money, color: 'bg-crimson/10 border-crimson/30' },
  system: { icon: Setting, color: 'bg-gray-100 border-gray-200' },
  announcement: { icon: Promotion, color: 'bg-info/10 border-info/30' },
}

onMounted(() => {
  store.fetchNotifications()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-5">
    <!-- 操作栏 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
        <el-icon :size="20" class="text-gold"><Bell /></el-icon> 我的通知
      </h2>
      <button v-if="store.unreadCount > 0" @click="store.markAllRead()"
        class="text-xs text-primary hover:text-primary-dark transition-colors">
        全部标为已读 ({{ store.unreadCount }}条未读)
      </button>
    </div>

    <!-- 通知列表 -->
    <section v-if="store.notifications.length > 0" class="space-y-2">
      <div v-for="notif in store.notifications" :key="notif.id"
        @click="store.markAsRead(notif.id)"
        :class="['flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all',
          notif.isRead ? 'bg-white/60 border-transparent opacity-70' : `bg-white border ${notificationTypeMap[notif.type]?.color || 'border-gray-200'} hover:shadow-md`]">
        <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', notif.isRead ? 'bg-gray-100' : notificationTypeMap[notif.type]?.color?.split(' ')[0] || 'bg-gray-100']">
          <el-icon :size="17" :class="notif.isRead ? 'text-text-quaternary' : ''"><component :is="notificationTypeMap[notif.type]?.icon || NotifIcon" /></el-icon>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium" :class="notif.isRead ? 'text-text-secondary' : 'text-text-primary'">{{ notif.title }}</p>
            <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
          </div>
          <p class="text-xs text-text-tertiary mt-1 line-clamp-1">{{ notif.content }}</p>
          <p class="text-[11px] text-text-quaternary mt-1.5">{{ notif.createdAt }}</p>
        </div>
      </div>
    </section>

    <div v-else class="text-center py-16">
      <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-pine/10 flex items-center justify-center">
        <el-icon :size="28" class="text-pine/40"><CircleCheckFilled /></el-icon>
      </div>
      <p class="text-pine text-sm font-medium">暂无新通知</p>
      <p class="text-text-quaternary text-xs mt-1">所有消息已阅读完毕</p>
    </div>
  </div>
</template>
