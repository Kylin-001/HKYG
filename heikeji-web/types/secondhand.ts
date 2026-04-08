// ============================================
// 二手市场类型定义
// ============================================

export interface SecondhandItem {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar: string
  title: string
  description: string
  images: string[]
  price: number
  originalPrice?: number
  category: SecondhandCategory
  condition: ItemCondition
  location: string
  contactMethod: 'chat' | 'phone' | 'in_person'
  contactInfo?: string
  views: number
  likes: number
  status: ItemStatus
  isNegotiable: boolean
  tags: string[]
  publishedAt: string
  updatedAt: string
}

export type SecondhandCategory =
  | 'electronics'
  | 'books'
  | 'daily'
  | 'sports'
  | 'fashion'
  | 'furniture'
  | 'tickets'
  | 'other'

export type ItemCondition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'poor'

export type ItemStatus = 'on_sale' | 'reserved' | 'sold' | 'removed' | 'expired'

export const CONDITION_LABELS: Record<ItemCondition, string> = {
  brand_new: '全新',
  like_new: '几乎全新',
  good: '良好',
  fair: '一般',
  poor: '较差',
}

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  on_sale: '在售',
  reserved: '已预留',
  sold: '已售出',
  removed: '已下架',
  expired: '已过期',
}

export interface PublishSecondhandRequest {
  title: string
  description: string
  images: string[]
  price: number
  originalPrice?: number
  category: SecondhandCategory
  condition: ItemCondition
  location: string
  contactMethod: 'chat' | 'phone' | 'in_person'
  isNegotiable: boolean
  tags: string[]
}

export interface SecondhandListParams {
  keyword?: string
  category?: SecondhandCategory
  condition?: ItemCondition
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'hot'
  page?: number
  pageSize?: number
}
