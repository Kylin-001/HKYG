import { get, post, put, del } from '@/utils/request'
import type {
  ForumPost, Board, Comment, LostFoundItem,
  CampusActivity, NotificationItem
} from '@/types/community'

export function getBoards(): Promise<Board[]> {
  return get('/community/boards')
}

export function getPosts(params?: {
  boardId?: string
  page?: number
  pageSize?: number
  sort?: 'hot' | 'new' | 'essence'
}): Promise<{ list: ForumPost[]; total: number }> {
  return get('/community/posts', { params })
}

export function getPostDetail(postId: string): Promise<ForumPost & { comments: Comment[] }> {
  return get(`/community/posts/${postId}`)
}

export function createPost(data: {
  boardId: string
  title: string
  content: string
  images?: string[]
}): Promise<ForumPost> {
  return post('/community/posts', data)
}

export function likePost(postId: string): Promise<void> {
  return post(`/community/posts/${postId}/like`)
}

export function unlikePost(postId: string): Promise<void> {
  return del(`/community/posts/${postId}/like`)
}

export function collectPost(postId: string): Promise<void> {
  return post(`/community/posts/${postId}/collect`)
}

export function uncollectPost(postId: string): Promise<void> {
  return del(`/community/posts/${postId}/collect`)
}

export function addComment(postId: string, content: string, parentId?: string): Promise<Comment> {
  return post(`/community/posts/${postId}/comments`, { content, parentId })
}

export function deleteComment(commentId: string): Promise<void> {
  return del(`/community/comments/${commentId}`)
}

export function likeComment(commentId: string): Promise<void> {
  return post(`/community/comments/${commentId}/like`)
}

export function getLostFoundList(params?: {
  type?: 'lost' | 'found'
  category?: string
  status?: string
  page?: number
}): Promise<{ list: LostFoundItem[]; total: number }> {
  return get('/community/lost-found', { params })
}

export function publishLostFound(data: {
  type: 'lost' | 'found'
  title: string
  description: string
  images: string[]
  category: string
  location: string
  contactMethod: string
}): Promise<LostFoundItem> {
  return post('/community/lost-found', data)
}

export function resolveLostFound(id: string): Promise<void> {
  return post(`/community/lost-found/${id}/resolve`)
}

export function getActivities(params?: {
  category?: string
  status?: string
  page?: number
}): Promise<{ list: CampusActivity[]; total: number }> {
  return get('/community/activities', { params })
}

export function getActivityDetail(activityId: string): Promise<CampusActivity> {
  return get(`/community/activities/${activityId}`)
}

export function joinActivity(activityId: string): Promise<void> {
  return post(`/community/activities/${activityId}/join`)
}

export function leaveActivity(activityId: string): Promise<void> {
  return post(`/community/activities/${activityId}/leave`)
}

export function publishActivity(data: Partial<CampusActivity>): Promise<CampusActivity> {
  return post('/community/activities', data)
}

export function getNotifications(page?: number, pageSize?: number): Promise<{
  list: NotificationItem[]
  total: number
  unreadCount: number
}> {
  return get('/notifications', { params: { page, pageSize } })
}

export function markNotificationRead(id: string): Promise<void> {
  return put(`/notifications/${id}/read`)
}

export function markAllNotificationsRead(): Promise<void> {
  return put('/notifications/read-all')
}

export interface FavoriteItem {
  id: string
  type: string
  title: string
  image?: string
  createdAt: string
}

export function getFavorites(type?: string, page?: number): Promise<{
  list: FavoriteItem[]
  total: number
}> {
  return get('/favorites', { params: { type, page } })
}

export function removeFavorite(id: string): Promise<void> {
  return del(`/favorites/${id}`)
}

export interface CouponItem {
  id: string
  code: string
  name: string
  type: 'amount' | 'percent'
  value: number
  minOrderAmount?: number
  status: 'available' | 'used' | 'expired'
  validFrom: string
  validTo: string
}

export function getCoupons(params?: { status?: 'available' | 'used' | 'expired'; page?: number }): Promise<{
  list: CouponItem[]
  total: number
}> {
  return get('/coupons', { params })
}

export function claimCoupon(couponId: string): Promise<void> {
  return post(`/coupons/${couponId}/claim`)
}
