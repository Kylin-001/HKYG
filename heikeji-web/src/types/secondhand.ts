// ============================================
// 二手市场类型定义
// ============================================

export interface SecondhandItem {
  id: string | number
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  coverImage: string
  category: SecondhandCategory
  subCategory?: string
  condition: ItemCondition
  sellerId: string
  sellerName: string
  sellerAvatar: string
  location: string
  views: number
  likes: number
  comments: number
  status: ItemStatus
  tags: string[]
  isNegotiable: boolean
  publishedAt: string
  updatedAt: string
  // ====== 新增字段 ======
  isTop?: boolean // 是否置顶
  isPromoted?: boolean // 是否推广
  promoteExpireAt?: string // 推广过期时间
  auditStatus?: AuditStatus // 审核状态
  auditReason?: string // 审核不通过原因
  sellerVerified?: boolean // 卖家是否实名认证
  tradeSafetyLevel?: 'low' | 'medium' | 'high' // 交易安全等级
}

export type SecondhandCategory = 'electronics' | 'books' | 'daily' | 'clothing' | 'sports' | 'beauty' | 'furniture' | 'other'

export type ItemCondition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'poor'

export type ItemStatus = 'on_sale' | 'reserved' | 'sold' | 'removed' | 'auditing'

// ====== 新增：审核状态类型 ======
export type AuditStatus = 'pending' | 'approved' | 'rejected'

export interface SecondhandListParams {
  keyword?: string
  category?: SecondhandCategory
  condition?: ItemCondition
  status?: ItemStatus
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
  sort?: 'default' | 'price_asc' | 'price_desc' | 'time_desc' | 'popularity'
}

export interface SecondhandDetail extends SecondhandItem {
  sellerContact: string
  wechat?: string
  qq?: string
  deliveryMethod: DeliveryMethod
  tradeLocation: string
  publishTime: string
  favoriteCount: number
}

export type DeliveryMethod = 'face_to_face' | 'campus_delivery' | 'shipping'

// ====== 新增：聊天/私信系统 ======
export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'system'
  imageUrl?: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: Array<{
    userId: string
    userName: string
    userAvatar: string
  }>
  lastMessage: ChatMessage
  unreadCount: number
  itemId?: string // 关联的商品ID
  itemTitle?: string // 商品标题（方便显示）
  updatedAt: string
  createdAt: string
}

// ====== 新增：举报系统 ======
export interface ReportReason {
  value: string
  label: string
  description?: string
}

export const REPORT_REASONS: ReportReason[] = [
  { value: 'fraud', label: '疑似诈骗', description: '商品信息与实际严重不符，可能涉及诈骗' },
  { value: 'fake_goods', label: '假冒伪劣', description: '商品为假货或仿冒品' },
  { value: 'prohibited', label: '违禁物品', description: '属于法律法规禁止交易的物品' },
  { value: 'inappropriate', label: '不当内容', description: '包含色情、暴力、政治敏感等不当内容' },
  { value: 'spam', label: '垃圾信息', description: '重复发布、广告刷屏等行为' },
  { value: 'other', label: '其他原因', description: '其他违规情况' }
]

export interface ReportRequest {
  itemId: string | number
  reason: string
  detail?: string
  evidenceImages?: string[]
}

export interface ReportRecord {
  id: number
  reporterId: string
  itemId: string
  itemTitle: string
  reason: string
  status: 'pending' | 'processing' | 'resolved' | 'dismissed'
  createdAt: string
  resolvedAt?: string
  result?: string
}

// ====== 新增：置顶/推广功能 ======
export interface PromoteOption {
  type: 'top' | 'recommend' | 'home_banner'
  duration: number // 天数
  price: number // 价格(积分或现金)
  benefits: string[] // 权益说明
}

export const PROMOTE_OPTIONS: PromoteOption[] = [
  {
    type: 'top',
    duration: 3,
    price: 100,
    benefits: ['列表置顶展示', '增加曝光率300%']
  },
  {
    type: 'recommend',
    duration: 7,
    price: 200,
    benefits: ['首页推荐位展示', '增加曝光率500%']
  },
  {
    type: 'home_banner',
    duration: 1,
    price: 500,
    benefits: ['首页Banner轮播', '全站曝光']
  }
]

// ====== 新增：交易安全保障 ======
export interface SafetyVerification {
  isVerified: boolean
  verifiedAt?: string
  verifyMethod?: 'student_id' | 'phone' | 'id_card'
  safetyScore: number // 0-100
  tips: string[] // 安全提示
}
