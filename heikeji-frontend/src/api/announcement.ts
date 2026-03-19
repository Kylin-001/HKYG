/**
 * 消息推送API
 */

import request from '@/utils/request'

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'system' | 'activity' | 'notice' | 'emergency'
  importance: 'low' | 'normal' | 'high' | 'urgent'
  publishTime: string
  publisher: string
  targetRoles: string[]
  targetUsers: string[]
  attachmentUrl?: string
  attachmentName?: string
  validFrom: string
  validUntil: string
  readCount: number
  status: 'draft' | 'published' | 'archived'
}

export interface AnnouncementQuery {
  type?: string
  importance?: string
  keyword?: string
  startDate?: string
  endDate?: string
  status?: string
  page?: number
  size?: number
}

export interface PushMessage {
  id: string
  title: string
  content: string
  type: 'system' | 'order' | 'coupon' | 'activity'
  targetType: 'all' | 'user' | 'role' | 'segment'
  targetValue: string[]
  sendTime: string
  expireTime?: string
  status: 'pending' | 'sent' | 'failed'
}

export interface MessageQuery {
  type?: string
  isRead?: boolean
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

/**
 * 获取公告列表
 */
export function getAnnouncements(params?: AnnouncementQuery) {
  return request({
    url: '/api/announcement/list',
    method: 'get',
    params,
  })
}

/**
 * 获取公告详情
 */
export function getAnnouncementDetail(id: string) {
  return request({
    url: `/api/announcement/${id}`,
    method: 'get',
  })
}

/**
 * 发布公告
 */
export function publishAnnouncement(data: Partial<Announcement>) {
  return request({
    url: '/api/announcement/publish',
    method: 'post',
    data,
  })
}

/**
 * 更新公告
 */
export function updateAnnouncement(id: string, data: Partial<Announcement>) {
  return request({
    url: `/api/announcement/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除公告
 */
export function deleteAnnouncement(id: string) {
  return request({
    url: `/api/announcement/${id}`,
    method: 'delete',
  })
}

/**
 * 获取我的公告列表
 */
export function getMyAnnouncements(params?: MessageQuery) {
  return request({
    url: '/api/announcement/my',
    method: 'get',
    params,
  })
}

/**
 * 标记公告为已读
 */
export function markAnnouncementRead(id: string) {
  return request({
    url: `/api/announcement/${id}/read`,
    method: 'post',
  })
}

/**
 * 获取未读公告数量
 */
export function getUnreadCount() {
  return request({
    url: '/api/announcement/unread-count',
    method: 'get',
  })
}

/**
 * 获取推送消息列表
 */
export function getPushMessages(params?: MessageQuery) {
  return request({
    url: '/api/push/list',
    method: 'get',
    params,
  })
}

/**
 * 发送推送消息
 */
export function sendPushMessage(data: Partial<PushMessage>) {
  return request({
    url: '/api/push/send',
    method: 'post',
    data,
  })
}

/**
 * 取消推送消息
 */
export function cancelPushMessage(id: string) {
  return request({
    url: `/api/push/${id}/cancel`,
    method: 'post',
  })
}

/**
 * 获取系统通知列表
 */
export function getSystemNotifications(params?: MessageQuery) {
  return request({
    url: '/api/notification/list',
    method: 'get',
    params,
  })
}

/**
 * 标记通知为已读
 */
export function markNotificationRead(id: string) {
  return request({
    url: `/api/notification/${id}/read`,
    method: 'post',
  })
}

/**
 * 标记所有通知为已读
 */
export function markAllNotificationsRead() {
  return request({
    url: '/api/notification/read-all',
    method: 'post',
  })
}

/**
 * 删除通知
 */
export function deleteNotification(id: string) {
  return request({
    url: `/api/notification/${id}`,
    method: 'delete',
  })
}

/**
 * 获取通知设置
 */
export function getNotificationSettings() {
  return request({
    url: '/api/notification/settings',
    method: 'get',
  })
}

/**
 * 更新通知设置
 */
export function updateNotificationSettings(data: {
  enablePush: boolean
  enableEmail: boolean
  enableSms: boolean
  types: string[]
}) {
  return request({
    url: '/api/notification/settings',
    method: 'put',
    data,
  })
}
