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
  config: any
  description: string
}

export const marketingApi = {
  getCouponList: (params: any) => 
    request.get('/api/marketing/coupon/list', params),

  createCoupon: (data: Coupon) => 
    request.post('/api/marketing/coupon/create', data),

  updateCoupon: (data: Coupon) => 
    request.put('/api/marketing/coupon/update', data),

  deleteCoupon: (id: number) => 
    request.delete(`/api/marketing/coupon/${id}`),

  batchSendCoupon: (data: any) => 
    request.post('/api/marketing/coupon/batch-send', data),

  generateCouponCode: () => 
    request.post('/api/marketing/coupon/generate-code'),

  getUserCoupons: (params: any) => 
    request.get('/api/marketing/coupon/user/list', params),

  useCoupon: (data: any) => 
    request.post('/api/marketing/coupon/use', data),

  getUserPoints: () => 
    request.get('/api/marketing/points/balance'),

  getPointRecords: (params: any) => 
    request.get('/api/marketing/points/records', params),

  getPointProducts: (params: any) => 
    request.get('/api/marketing/points/products', params),

  exchangeProduct: (data: any) => 
    request.post('/api/marketing/points/exchange', data),

  checkIn: () => 
    request.post('/api/marketing/points/check-in'),

  getPointRanking: (limit: number) => 
    request.get('/api/marketing/points/ranking', { limit }),

  getUserLevel: () => 
    request.get('/api/marketing/level/user'),

  getAllLevels: () => 
    request.get('/api/marketing/level/list'),

  getLevelPrivileges: (levelId: number) => 
    request.get(`/api/marketing/level/${levelId}/privileges`),

  getActivities: (params: any) => 
    request.get('/api/marketing/activity/list', params),

  getActivityDetail: (activityId: number) => 
    request.get(`/api/marketing/activity/${activityId}`),

  joinActivity: (data: any) => 
    request.post('/api/marketing/activity/join', data),

  getActivityStats: (activityId: number) => 
    request.get(`/api/marketing/activity/${activityId}/stats`),
}
