import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ForumPost, Board, Comment, LostFoundItem,
  CampusActivity, NotificationItem
} from '@/types/community'
import * as communityApi from '@/api/community'

interface FavoriteItem {
  id: string
  type: string
  title: string
  [key: string]: unknown
}

interface CouponItem {
  id: string
  code: string
  type: string
  value: number
  status: string
  [key: string]: unknown
}

export const useCommunityStore = defineStore('community', () => {
  const boards = ref<Board[]>([])
  const posts = ref<ForumPost[]>([])
  const currentPost = ref<(ForumPost & { comments: Comment[] }) | null>(null)
  const lostFoundList = ref<LostFoundItem[]>([])
  const activities = ref<CampusActivity[]>([])
  const currentActivity = ref<CampusActivity | null>(null)
  const notifications = ref<NotificationItem[]>([])
  const favorites = ref<FavoriteItem[]>([])
  const coupons = ref<CouponItem[]>([])
  const unreadCount = ref(0)
  const totalPosts = ref(0)
  const totalLF = ref(0)
  const totalActivities = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBoards() {
    try {
      const res = await communityApi.getBoards()
      boards.value = res || []
      return boards.value
    } catch (err) {
      console.error('获取板块失败:', err)
      return []
    }
  }

  async function fetchPosts(params?: {
    boardId?: string
    page?: number
    pageSize?: number
    sort?: 'hot' | 'new' | 'essence'
  }) {
    try {
      loading.value = true
      error.value = null
      const res = await communityApi.getPosts(params)
      posts.value = res.list || []
      totalPosts.value = res.total || 0
      return posts.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取帖子失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPostDetail(postId: string) {
    try {
      loading.value = true
      const res = await communityApi.getPostDetail(postId)
      currentPost.value = res
      return currentPost.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取帖子详情失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: {
    boardId: string
    title: string
    content: string
    images?: string[]
  }) {
    const res = await communityApi.createPost(data)
    return res
  }

  async function toggleLikePost(postId: string, isLiked: boolean) {
    if (isLiked) {
      await communityApi.unlikePost(postId)
    } else {
      await communityApi.likePost(postId)
    }
  }

  async function addComment(postId: string, content: string, parentId?: string) {
    const res = await communityApi.addComment(postId, content, parentId)
    return res
  }

  async function fetchLostFound(params?: {
    type?: 'lost' | 'found'
    category?: string
    status?: string
    page?: number
  }) {
    try {
      loading.value = true
      const res = await communityApi.getLostFoundList(params)
      lostFoundList.value = res.list || []
      totalLF.value = res.total || 0
      return lostFoundList.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取失物招领失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function publishLF(data: {
    type: 'lost' | 'found'
    title: string
    description: string
    images: string[]
    category: string
    location: string
    contactMethod: string
  }) {
    const res = await communityApi.publishLostFound(data)
    return res
  }

  async function fetchActivities(params?: {
    category?: string
    status?: string
    page?: number
  }) {
    try {
      const res = await communityApi.getActivities(params)
      activities.value = res.list || []
      totalActivities.value = res.total || 0
      return activities.value
    } catch (err) {
      console.error('获取活动失败:', err)
      return []
    }
  }

  async function fetchActivityDetail(activityId: string) {
    try {
      const res = await communityApi.getActivityDetail(activityId)
      currentActivity.value = res
      return currentActivity.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取活动详情失败'
      error.value = message
      throw err
    }
  }

  async function joinActivity(activityId: string) {
    await communityApi.joinActivity(activityId)
    if (currentActivity.value?.id === activityId) {
      currentActivity.value.currentParticipants++
    }
  }

  async function leaveActivity(activityId: string) {
    await communityApi.leaveActivity(activityId)
    if (currentActivity.value?.id === activityId && currentActivity.value.currentParticipants > 0) {
      currentActivity.value.currentParticipants--
    }
  }

  async function createActivity(data: Partial<CampusActivity>) {
    const res = await communityApi.publishActivity(data)
    await fetchActivities()
    return res
  }

  async function fetchNotifications(page?: number) {
    try {
      const res = await communityApi.getNotifications(page)
      notifications.value = res.list || []
      unreadCount.value = res.unreadCount || 0
      return notifications.value
    } catch (err) {
      console.error('获取通知失败:', err)
      return []
    }
  }

  async function markRead(id?: string) {
    if (id) {
      await communityApi.markNotificationRead(id)
      const notif = notifications.value.find(n => n.id === id)
      if (notif) notif.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } else {
      await communityApi.markAllNotificationsRead()
      notifications.value.forEach(n => n.read = true)
      unreadCount.value = 0
    }
  }

  async function fetchFavorites(type?: string, page?: number) {
    try {
      const res = await communityApi.getFavorites(type, page)
      favorites.value = res.list || []
      return favorites.value
    } catch (err) {
      console.error('获取收藏失败:', err)
      return []
    }
  }

  async function removeFavorite(id: string) {
    await communityApi.removeFavorite(id)
    favorites.value = favorites.value.filter(f => f.id !== id)
  }

  async function fetchCoupons(status?: string) {
    try {
      const res = await communityApi.getCoupons(status ? { status: status as 'available' | 'used' | 'expired' } : undefined)
      coupons.value = res.list || []
      return coupons.value
    } catch (err) {
      console.error('获取优惠券失败:', err)
      return []
    }
  }

  async function claimCoupon(couponId: string) {
    await communityApi.claimCoupon(couponId)
    await fetchCoupons()
  }

  return {
    boards,
    posts,
    currentPost,
    lostFoundList,
    activities,
    currentActivity,
    notifications,
    favorites,
    coupons,
    unreadCount,
    totalPosts,
    totalLF,
    totalActivities,
    loading,
    error,
    fetchBoards,
    fetchPosts,
    fetchPostDetail,
    createPost,
    toggleLikePost,
    addComment,
    fetchLostFound,
    publishLF,
    fetchActivities,
    fetchActivityDetail,
    joinActivity,
    leaveActivity,
    createActivity,
    fetchNotifications,
    markRead,
    fetchFavorites,
    removeFavorite,
    fetchCoupons,
    claimCoupon,
  }
})
