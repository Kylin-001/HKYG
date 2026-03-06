import request from '@/utils/request'

export interface RecommendationLog {
  id: number
  userId: number
  productId: number
  recommendType: string
  recommendReason: string
  recommendScore: number
  position: number
  recommendTime: string
  isExposed: boolean
  exposedTime: string
  isClicked: boolean
  clickedTime: string
  isPurchased: boolean
  purchasedTime: string
  sessionId: string
  deviceType: string
}

export const recommendationTrackingApi = {
  logRecommendation: (data: {
    userId: number
    productId: number
    recommendType: string
    recommendReason: string
    recommendScore: number
    position: number
    sessionId: string
    deviceType: string
  }) => request.post('/api/analytics/recommendation/log', data),

  logExposure: (data: {
    userId: number
    productId: number
    sessionId: string
    deviceType: string
  }) => request.post('/api/analytics/recommendation/expose', data),

  logClick: (data: {
    userId: number
    productId: number
    sessionId: string
    deviceType: string
  }) => request.post('/api/analytics/recommendation/click', data),

  logPurchase: (data: {
    userId: number
    productId: number
    sessionId: string
    deviceType: string
  }) => request.post('/api/analytics/recommendation/purchase', data),

  getRecommendationStatistics: (params: {
    timeRange: 'day' | 'week' | 'month' = 'day'
    startDate?: string
    endDate?: string
  }) => request.get('/api/analytics/recommendation/statistics', params),

  getRecommendationRanking: (params: {
    timeRange: 'day' | 'week' | 'month' = 'day'
    startDate?: string
    endDate?: string
    limit?: number = 10
  }) => request.get('/api/analytics/recommendation/ranking', params),

  getRecommendationReason: (params: {
    userId: number
    productId: number
  }) => request.get('/api/analytics/recommendation/reason', params),

  getTopPerformingProducts: (params: {
    timeRange: 'day' | 'week' | 'month' = 'day'
    limit?: number = 10
  }) => request.get('/api/analytics/recommendation/top-performing', params),

  getRecommendationCTR: (params: {
    timeRange: 'day' | 'week' | 'month' = 'day'
    startDate?: string
    endDate?: string
  }) => request.get('/api/analytics/recommendation/ctr', params),

  getRecommendationCVR: (params: {
    timeRange: 'day' | 'week' | 'month' = 'day'
    startDate?: string
    endDate?: string
  }) => request.get('/api/analytics/recommendation/cvr', params),
}
