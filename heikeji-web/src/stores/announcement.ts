import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Announcement, Notification } from '@/types/announcement'
import * as api from '@/api/announcement'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref<Announcement[]>([])
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAnnouncements(params?: { type?: string; keyword?: string; page?: number; pageSize?: number }) {
    try {
      loading.value = true
      const res = await api.getAnnouncements(params)
      announcements.value = res.list || []
      total.value = res.total || 0
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取公告失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchNotifications() {
    try {
      notifications.value = await api.getNotifications()
      unreadCount.value = notifications.value.filter(n => !n.isRead).length
    } catch (err) {
      console.error('获取通知失败:', err)
    }
  }

  async function fetchUnreadCount() {
    try {
      unreadCount.value = await api.getUnreadCount()
    } catch (err) {
      console.error('获取未读数失败:', err)
    }
  }

  async function markAsRead(id: string) {
    await api.markNotificationRead(id)
    notifications.value = notifications.value.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    )
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  async function markAllRead() {
    await api.markAllNotificationsRead()
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    unreadCount.value = 0
  }

  return { announcements, notifications, unreadCount, total, loading, error, fetchAnnouncements, fetchNotifications, fetchUnreadCount, markAsRead, markAllRead }
})
