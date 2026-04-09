import { get, post, put } from '@/utils/request'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  User,
  LoginHistoryItem,
  SecuritySettings,
  Message,
  MessageStats,
  PointsProduct,
  Coupon,
  PointsTransaction,
  InvitationCode,
  InviteRecord,
  InvitationReward,
  PersonalStatistics,
} from '@/types/user'

/**
 * 用户登录
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  return post('/auth/login', data)
}

/**
 * 用户注册
 */
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post('/auth/register', data)
}

/**
 * 退出登录
 */
export function logout(): Promise<void> {
  return post('/auth/logout')
}

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<User> {
  return get<User>('/user/info')
}

/**
 * 更新用户资料
 */
export function updateProfile(data: UpdateProfileRequest): Promise<User> {
  return put<User>('/user/profile', data)
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('avatar', file)
  return post<{ url: string }>('/user/avatar', formData)
}

/**
 * 修改密码
 */
export function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  return post('/user/password', { oldPassword, newPassword })
}

/**
 * 发送验证码（手机/邮箱）
 */
export function sendCode(target: string, type: 'login' | 'register' | 'reset' | 'bind'): Promise<void> {
  return post('/auth/send-code', { target, type })
}

/**
 * 验证验证码
 */
export function verifyCode(target: string, code: string): Promise<{ verified: boolean }> {
  return post('/auth/verify-code', { target, code })
}

/**
 * 刷新 Token
 */
export function refreshToken(): Promise<{ token: string }> {
  return post('/auth/refresh-token')
}

// ====== 新增：账户安全功能 ======

/**
 * 获取登录历史记录
 */
export function getLoginHistory(params?: PaginationParams): Promise<{ list: LoginHistoryItem[]; total: number }> {
  return get('/user/security/login-history', { params })
}

/**
 * 获取安全设置
 */
export function getSecuritySettings(): Promise<SecuritySettings> {
  return get('/user/security/settings')
}

/**
 * 更新安全设置
 */
export function updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
  return put('/user/security/settings', settings)
}

/**
 * 绑定手机号
 */
export function bindPhone(phone: string, code: string): Promise<void> {
  return post('/user/security/bind-phone', { phone, code })
}

/**
 * 绑定邮箱
 */
export function bindEmail(email: string, code: string): Promise<void> {
  return post('/user/security/bind-email', { email, code })
}

/**
 * 启用/关闭双因素认证
 */
export function toggleTwoFactor(enable: boolean, code?: string): Promise<void> {
  return post('/user/security/two-factor', { enable, code })
}

// ====== 新增：消息中心功能 ======

/**
 * 获取消息列表（支持分类筛选）
 */
export function getMessages(params?: PaginationParams & { type?: string; isRead?: boolean }): Promise<{ list: Message[]; total: number }> {
  return get('/messages', { params })
}

/**
 * 获取消息统计（未读数等）
 */
export function getMessageStats(): Promise<MessageStats> {
  return get('/messages/stats')
}

/**
 * 标记消息为已读
 */
export function markMessageRead(messageId: number): Promise<void> {
  return post(`/messages/${messageId}/read`)
}

/**
 * 批量标记已读
 */
export function markAllMessagesRead(type?: string): Promise<void> {
  return post('/messages/read-all', { type })
}

/**
 * 删除消息
 */
export function deleteMessage(messageId: number): Promise<void> {
  return post(`/messages/${messageId}/delete`)
}

// ====== 新增：积分商城功能 ======

/**
 * 获取积分商品列表
 */
export function getPointsProducts(params?: PaginationParams & { category?: string }): Promise<{ list: PointsProduct[]; total: number }> {
  return get('/points/products', { params })
}

/**
 * 获取积分商品详情
 */
export function getPointsProductDetail(productId: number): Promise<PointsProduct> {
  return get(`/points/products/${productId}`)
}

/**
 * 兑换积分商品
 */
export function exchangePointsProduct(productId: number): Promise<{ orderId: number; message: string }> {
  return post(`/points/products/${productId}/exchange`)
}

/**
 * 获取用户的优惠券列表
 */
export function getCoupons(params?: PaginationParams & { status?: string }): Promise<{ list: Coupon[]; total: number }> {
  return get('/coupons', { params })
}

/**
 * 获取可用的优惠券（下单时）
 */
export function getAvailableCoupons(orderAmount: number): Promise<Coupon[]> {
  return get('/coupons/available', { params: { orderAmount } })
}

/**
 * 获取积分流水
 */
export function getPointsTransactions(params?: PaginationParams & { type?: 'earn' | 'spend' }): Promise<{ list: PointsTransaction[]; total: number }> {
  return get('/points/transactions', { params })
}

/**
 * 每日签到获取积分
 */
export function dailyCheckIn(): Promise<{ pointsEarned: number; consecutiveDays: number }> {
  return post('/points/check-in')
}

/**
 * 获取签到状态
 */
export function getCheckInStatus(): Promise<{ checkedIn: boolean; consecutiveDays: number; canCheckIn: boolean }> {
  return get('/points/check-in/status')
}

// ====== 新增：邀请好友功能 ======

/**
 * 获取邀请码和邀请信息
 */
export function getInvitationInfo(): Promise<InvitationCode> {
  return get('/invitation/info')
}

/**
 * 获取邀请记录列表
 */
export function getInviteRecords(params?: PaginationParams): Promise<{ list: InviteRecord[]; total: number }> {
  return get('/invitation/records', { params })
}

/**
 * 使用邀请码注册时绑定邀请关系
 */
export function bindInvitation(code: string): Promise<void> {
  return post('/invitation/bind', { code })
}

/**
 * 获取奖励规则
 */
export function getInvitationRewards(): Promise<InvitationReward[]> {
  return get('/invitation/rewards')
}

// ====== 新增：个人数据统计 ======

/**
 * 获取个人详细统计数据
 */
export function getPersonalStatistics(): Promise<PersonalStatistics> {
  return get('/user/statistics')
}

/**
 * 获取最近活动动态
 */
export function getRecentActivity(limit?: number): Promise<ActivityRecord[]> {
  return get('/user/activity', { params: { limit: limit || 20 } })
}
