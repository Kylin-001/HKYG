export interface Announcement {
  id: string
  title: string
  content: string
  type: 'teaching' | 'student' | 'activity' | 'recruitment' | 'emergency' | 'other'
  category: string
  author: string
  department: string
  isTop: boolean
  isRead: boolean
  viewCount: number
  attachments?: { name: string; url: string }[]
  publishedAt: string
  updatedAt?: string
}

export interface Notification {
  id: string
  type: 'course' | 'approval' | 'claim' | 'payment' | 'system' | 'announcement' | 'order' | 'promo' | 'community'
  title: string
  content: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
  // 扩展字段
  orderId?: string
  postId?: string
  senderId?: string
  senderName?: string
  senderAvatar?: string
}
