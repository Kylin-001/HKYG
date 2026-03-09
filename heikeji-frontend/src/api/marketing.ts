import request from '@/utils/request'

export interface Coupon {
  id: number
  name: string
  couponCode: string
  type: number
  value: number
  discount: number
  minAmount: number
  maxAmount: number
  startTime: string
  endTime: string
  totalCount: number
  usedCount: number
  perUserLimit: number
  status: number
  description: string
}

export interface UserCoupon {
  id: number
  userId: number
  couponId: number
  status: number
  usedAt: string
  orderNo: string
  coupon: Coupon
}

export interface PointRecord {
  id: number
  userId: number
  points: number
  balance: number
  type: number
  source: string
  orderNo: string
  remark: string
  createTime: string
}

export interface PointProduct {
  id: number
  name: string
  image: string
  points: number
  stock: number
  soldCount: number
  description: string
  status: number
}

export interface MemberLevel {
  id: number
  name: string
  minPoints: number
  maxPoints: number
  discount: number
  description: string
  privileges: string[]
  status: number
  sort: number
}

export interface MarketingActivity {
  id: number
  name: string
  type: number
  startTime: string
  endTime: string
  status: number
  config: Record<string, unknown>
  description: string
}

interface CouponListParams {
  page?: number
  limit?: number
  status?: number
  type?: number
}

interface CouponUseParams {
  couponId: number
  orderNo?: string
}

interface BatchSendParams {
  couponIds: number[]
  userIds: number[]
  message?: string
}

interface PointRecordsParams {
  page?: number
  limit?: number
  type?: number
  startDate?: string
  endDate?: string
}

interface PointProductsParams {
  page?: number
  limit?: number
  status?: number
}

interface ExchangeParams {
  productId: number
  quantity?: number
}

interface ActivityListParams {
  page?: number
  limit?: number
  status?: number
  type?: number
}

interface JoinActivityParams {
  activityId: number
  remark?: string
}

export const marketingApi = {
  getCouponList: (params?: CouponListParams) =>
    request.get('/api/marketing/coupon/list', params),

  createCoupon: (data: Coupon) =>
    request.post('/api/marketing/coupon/create', data),

  updateCoupon: (data: Coupon) =>
    request.put('/api/marketing/coupon/update', data),

  deleteCoupon: (id: number) =>
    request.delete(`/api/marketing/coupon/${id}`),

  batchSendCoupon: (data: BatchSendParams) =>
    request.post('/api/marketing/coupon/batch-send', data),

  generateCouponCode: () =>
    request.post('/api/marketing/coupon/generate-code'),

  getUserCoupons: (params?: CouponListParams) =>
    request.get('/api/marketing/coupon/user/list', params),

  useCoupon: (data: CouponUseParams) =>
    request.post('/api/marketing/coupon/use', data),

  getUserPoints: () =>
    request.get('/api/marketing/points/balance'),

  getPointRecords: (params?: PointRecordsParams) =>
    request.get('/api/marketing/points/records', params),

  getPointProducts: (params?: PointProductsParams) =>
    request.get('/api/marketing/points/products', params),

  exchangeProduct: (data: ExchangeParams) =>
    request.post('/api/marketing/points/exchange', data),

  checkIn: () =>
    request.post('/api/marketing/points/check-in'),

  getPointRanking: (limit: number = 10) =>
    request.get('/api/marketing/points/ranking', { limit }),

  getUserLevel: () =>
    request.get('/api/marketing/level/user'),

  getAllLevels: () =>
    request.get('/api/marketing/level/list'),

  getLevelPrivileges: (levelId: number) =>
    request.get(`/api/marketing/level/${levelId}/privileges`),

  getActivities: (params?: ActivityListParams) =>
    request.get('/api/marketing/activity/list', params),

  getActivityDetail: (activityId: number) =>
    request.get(`/api/marketing/activity/${activityId}`),

  joinActivity: (data: JoinActivityParams) =>
    request.post('/api/marketing/activity/join', data),

  getActivityStats: (activityId: number) =>
    request.get(`/api/marketing/activity/${activityId}/stats`),
}
