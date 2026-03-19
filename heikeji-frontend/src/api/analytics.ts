import request from '@/utils/request'

export interface UserBehaviorStats {
  userId: number
  totalViews: number
  totalPurchases: number
  totalFavorites: number
  totalComments: number
  activeDays: number
  activityLevel: string
  avgSessionDuration: number
  lastActiveTime: string
  churnRisk: string
  purchaseIntent: string
}

export interface SalesStats {
  totalSales: number
  totalOrders: number
  totalAmount: number
  avgOrderValue: number
  conversionRate: number
  returnRate: number
  refundRate: number
  salesTrend: Array<{ date: string; amount: number }>
  categoryDistribution: Array<{ category: string; amount: number }>
  merchantRanking: Array<{ merchantId: number; merchantName: string; sales: number }>
  paymentMethodDistribution: Array<{ method: string; amount: number }>
}

export interface RecommendationStats {
  totalRecommendations: number
  totalExposures: number
  totalClicks: number
  totalPurchases: number
  ctr: number
  cvr: number
  avgPosition: number
  topPerformingProducts: Array<{ productId: number; productName: string; ctr: number; cvr: number }>
}

export const analyticsApi = {
  getUserBehaviorStats: (userId: number, timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/user-behavior', { userId, timeRange }),

  getSalesStats: (timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/sales', { timeRange }),

  getCategorySales: (categoryId: number, timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/category-sales', { categoryId, timeRange }),

  getProductSales: (productId: number, timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/product-sales', { productId, timeRange }),

  getMerchantRanking: (limit: number = 10) =>
    request.get('/api/analytics/merchant-ranking', { limit }),

  getPaymentMethodDistribution: (timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/payment-methods', { timeRange }),

  getConversionFunnel: () => request.get('/api/analytics/conversion-funnel'),

  getRecommendationStats: (timeRange: 'day' | 'week' | 'month' = 'day') =>
    request.get('/api/analytics/recommendation-stats', { timeRange }),

  logRecommendationExposure: (data: { userId: number; productId: number; sessionId: string }) =>
    request.post('/api/analytics/recommendation/expose', data),

  logRecommendationClick: (data: { userId: number; productId: number; sessionId: string }) =>
    request.post('/api/analytics/recommendation/click', data),

  logRecommendationPurchase: (data: { userId: number; productId: number; sessionId: string }) =>
    request.post('/api/analytics/recommendation/purchase', data),

  getRecommendationReason: (userId: number, productId: number) =>
    request.get('/api/analytics/recommendation/reason', { userId, productId }),

  getUserSegmentation: () => request.get('/api/analytics/user-segmentation'),

  getChurnPrediction: (userId: number) =>
    request.get('/api/analytics/churn-prediction', { userId }),

  getPurchaseIntentPrediction: (userId: number) =>
    request.get('/api/analytics/purchase-intent', { userId }),
}
