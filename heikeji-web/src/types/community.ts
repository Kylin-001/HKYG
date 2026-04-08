// ============================================
// 社区论坛类型定义
// ============================================

export interface ForumPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  boardId: string
  boardName: string
  title: string
  content: string
  images?: string[]
  views: number
  likes: number
  commentCount: number
  isTop: boolean
  isEssence: boolean
  status: PostStatus
  createdAt: string
  updatedAt: string
  lastReplyAt?: string
}

export type PostStatus = 'normal' | 'hidden' | 'deleted' | 'auditing'

export interface Board {
  id: string
  name: string
  icon: string
  description: string
  postCount: number
  todayPosts: number
  sortOrder: number
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  images?: string[]
  likes: number
  parentId?: string
  replies?: Comment[]
  createdAt: string
}

export interface LostFoundItem {
  id: string
  type: 'lost' | 'found'
  publisherId: string
  publisherName: string
  publisherAvatar: string
  title: string
  description: string
  images: string[]
  category: LostFoundCategory
  location: string
  lostTime?: string
  foundTime?: string
  contactMethod: string
  status: LFStatus
  views: number
  createdAt: string
  resolvedAt?: string
}

export type LostFoundCategory = 'id_card' | 'phone' | 'wallet' | 'keys' | 'book' | 'umbrella' | 'card' | 'clothing' | 'electronic' | 'bag' | 'other'

export type LFStatus = 'open' | 'resolved' | 'closed' | 'expired'

export interface CampusActivity {
  id: string
  title: string
  coverImage: string
  description: string
  category: ActivityCategory
  organizer: string
  location: string
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  status: ActivityStatus
  fee?: number
  tags: string[]
  registrants: ActivityRegistrant[]
  createdAt: string
}

export type ActivityCategory = 'art' | 'sports' | 'academic' | 'social' | 'volunteer' | 'tech' | 'career' | 'other'

export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended' | 'cancelled'

export interface ActivityRegistrant {
  userId: string
  userName: string
  userAvatar: string
  registeredAt: string
}

export interface NotificationItem {
  id: string
  type: 'order' | 'system' | 'promo' | 'community' | 'comment' | 'like'
  title: string
  content: string
  read: boolean
  link?: string
  data?: Record<string, any>
  createdAt: string
}
