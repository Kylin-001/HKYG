import { get, post } from '@/utils/request'
import type { Announcement, Notification } from '@/types/announcement'

export function getAnnouncements(params?: {
  type?: string
  keyword?: string
  page?: number
  pageSize?: number
}): Promise<{ list: Announcement[]; total: number }> {
  return get('/announcements', { params })
}

export function getAnnouncementDetail(id: string): Promise<Announcement> {
  return get(`/announcements/${id}`)
}

export function markAnnouncementRead(id: string): Promise<void> {
  return post(`/announcements/${id}/read`)
}

export function toggleAnnouncementFavorite(id: string): Promise<void> {
  return post(`/announcements/${id}/favorite`)
}

// 通知中心
export function getNotifications(): Promise<Notification[]> {
  return get('/notifications')
}

export function markNotificationRead(id: string): Promise<void> {
  return post(`/notifications/${id}/read`)
}

export function markAllNotificationsRead(): Promise<void> {
  return post('/notifications/read-all')
}

export function getUnreadCount(): Promise<number> {
  return get('/notifications/unread-count')
}
