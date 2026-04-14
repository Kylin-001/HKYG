export interface User {
  id: number
  username: string
  email: string
  phone: string
  avatar?: string
  nickname?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  studentId?: string
  school?: string
  major?: string
  grade?: string
  role: UserRole
  status: 'active' | 'banned' | 'inactive'
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest'

export interface UserProfile extends User {
  bio?: string
  location?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences: UserPreferences
  statistics: UserStatistics
}

export interface UserPreferences {
  language: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationPreferences
  privacy: PrivacySettings
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  promotions: boolean
  systemMessages: boolean
}

export interface PrivacySettings {
  profileVisible: boolean
  showEmail: boolean
  showPhone: boolean
  showActivity: boolean
  allowMessages: boolean
}

export interface UserStatistics {
  orderCount: number
  reviewCount: number
  favoriteCount: number
  followerCount: number
  followingCount: number
  points: number
  level: number
  joinDays: number
}

export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  captcha: string
  studentId?: string
  agreeTerms: boolean
}

// ====== 新增：账户安全相关类型 ======

export interface LoginHistoryItem {
  id: number
  loginTime: string
  logoutTime?: string
  ip: string
  location: string
  device: string
  browser: string
  os: string
  status: 'success' | 'failed'
  failReason?: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotification: boolean
  unusualLoginAlert: boolean
  passwordChangedAt?: string
  lastLoginAt?: string
  boundPhone?: string
  boundEmail?: string
}

// ====== 新增：消息中心相关类型 ======

export type MessageType = 'system' | 'activity' | 'order' | 'promotion' | 'social'

export interface Message {
  id: number
  type: MessageType
  title: string
  content: string
  isRead: boolean
  relatedId?: number // 关联的订单/活动等ID
  relatedType?: string // 关联类型
  actionUrl?: string // 可点击跳转的链接
  createdAt: string
  readAt?: string
}

export interface MessageStats {
  total: number
  unread: number
  byType: Record<MessageType, number>
}

// ====== 新增：积分商城相关类型 ======

export interface PointsProduct {
  id: number
  name: string
  description: string
  image: string
  pointsCost: number
  originalPrice?: number // 原价（显示优惠）
  stock: number
  category: string
  status: 'available' | 'out_of_stock' | 'expired'
  exchangeCount: number // 已兑换数量
  maxPerUser: number // 每人限兑数量
  validUntil?: string
}

export interface Coupon {
  id: number
  name: string
  code: string
  type: 'fixed' | 'percent' // 固定金额或百分比折扣
  value: number
  minOrderAmount: number // 最低使用金额
  validFrom: string
  validUntil: string
  status: 'unused' | 'used' | 'expired'
  usedAt?: string
  orderId?: number
}

export interface PointsTransaction {
  id: number
  type: 'earn' | 'spend'
  amount: number
  balance: number // 变动后余额
  description: string
  source: string // 来源（签到、订单、兑换等）
  relatedId?: number
  createdAt: string
}

// ====== 新增：邀请好友相关类型 ======

export interface InvitationCode {
  code: string
  inviteUrl: string
  qrCode?: string // Base64 二维码
  totalInvites: number
  successfulInvites: number
  totalRewards: number // 累计奖励积分
}

export interface InviteRecord {
  id: number
  inviterId: number
  inviteeId: number
  inviteeUsername: string
  inviteeAvatar?: string
  status: 'registered' | 'first_order' | 'completed'
  rewardPoints: number
  rewardedAt?: string
  createdAt: string
}

export interface InvitationReward {
  type: 'register' | 'first_order' | 'invite_milestone'
  points: number
  description: string
  condition?: string
}

// ====== 新增：个人数据统计 ======

export interface PersonalStatistics extends UserStatistics {
  totalSpent: number // 总消费金额
  averageOrderValue: number // 平均订单金额
  favoriteCategories: Array<{ category: string; count: number }> // 喜欢的商品分类
  recentActivity: ActivityRecord[] // 最近动态
  // 社区相关统计
  postCount: number // 发布帖子数
  likeCount: number // 收到点赞数
  commentCount: number // 收到评论数
  creditScore: number // 信用评分（0-5）
}

export interface ActivityRecord {
  id: number
  type: 'order' | 'review' | 'favorite' | 'share' | 'login'
  description: string
  targetId?: number
  targetType?: string
  createdAt: string
}

// 更新用户资料请求
export interface UpdateProfileRequest {
  nickname?: string
  email?: string
  phone?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  avatar?: string
  bio?: string
  location?: string
  school?: string
  major?: string
  grade?: string
}
