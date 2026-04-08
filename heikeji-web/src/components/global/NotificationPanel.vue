<template>
  <Teleport to="body">
    <Transition name="notification-panel">
      <div v-if="visible" class="fixed inset-0 z-[var(--z-notification-panel)]" @click.self="close">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="close"></div>
        <div class="absolute top-16 md:top-18 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-primary-50 overflow-hidden animate-slide-down">
          <div class="flex items-center justify-between px-5 py-4 border-b border-primary-50 bg-gradient-to-r from-primary-50 to-white">
            <h3 class="font-bold text-text-primary flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>消息通知
              <span class="px-1.5 py-0.5 rounded-full bg-crimson/10 text-crimson text-[10px] font-bold">{{ unreadCount }}</span>
            </h3>
            <div class="flex items-center gap-2">
              <button @click="markAllRead" class="text-xs text-text-tertiary hover:text-primary transition-colors">全部已读</button>
              <button @click="close" class="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <el-icon :size="14" class="text-text-tertiary"><Close /></el-icon>
              </button>
            </div>
          </div>

          <div class="max-h-[400px] overflow-y-auto divide-y divide-primary-50/50">
            <div v-for="notif in notifications" :key="notif.id"
              @click="handleClick(notif)"
              :class="['flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-primary-50/40 transition-colors group',
                notif.read ? 'opacity-60' : '']">
              <div :class="['w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-base mt-0.5',
                notif.type === 'order' ? 'bg-primary-50' :
                notif.type === 'system' ? 'bg-gold/10' :
                notif.type === 'promo' ? 'bg-crimson/8' : 'bg-pine/10']">
                {{ notif.icon }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <p class="text-sm font-medium text-text-primary line-clamp-1">{{ notif.title }}</p>
                  <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                </div>
                <p class="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{{ notif.content }}</p>
                <p class="text-[11px] text-text-quaternary mt-1.5">{{ notif.time }}</p>
              </div>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-primary-50 bg-surface-secondary/50">
            <button class="w-full py-2 text-sm text-center text-primary hover:text-primary-dark font-medium transition-colors">
              查看全部消息 →
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Close } from '@element-plus/icons-vue'

const visible = defineModel<boolean>({ default: false })

const notifications = ref([
  { id: 1, type: 'order', icon: '📦', title: '订单已发货', content: '您的订单 HK20260328005 已发货，预计3天内送达。物流单号：SF1234567890', time: '10分钟前', read: false },
  { id: 2, type: 'promo', icon: '🎉', title: '新用户专享福利', content: '恭喜！您的新人优惠券已到账，满99减20、满299减50，快去使用吧~', time: '30分钟前', read: false },
  { id: 3, type: 'system', icon: '🔒', title: '账户安全提醒', content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码。', time: '2小时前', read: false },
  { id: 4, type: 'order', icon: '✅', title: '订单已完成', content: '您的订单 HK20260322012 已完成，感谢您的购买！欢迎评价。', time: '昨天 14:32', read: true },
  { id: 5, type: 'community', icon: '💬', title: '有人回复了你的帖子', content: '在「分享一个超好用的学习APP」下，用户@代码侠 回复了你的评论', time: '昨天 09:15', read: true },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function close() { visible.value = false }
function markAllRead() { notifications.value.forEach(n => n.read = true) }

function handleClick(notif: any) {
  if (!notif.read) notif.read = true
}
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.notification-panel-enter-active .notification-panel-overlay,
.notification-panel-leave-active .notification-panel-overlay { transition: opacity 0.2s ease; }
.notification-panel-enter-from .notification-panel-overlay,
.notification-panel-leave-to .notification-panel-overlay { opacity: 0; }

.notification-panel-enter-active > div:last-child,
.notification-panel-leave-active > div:last-child { transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
.notification-panel-enter-from > div:last-child { opacity: 0; transform: translateY(-16px) scale(0.95); }
.notification-panel-leave-to > div:last-child { opacity: 0; transform: translateY(-16px) scale(0.95); }
</style>
