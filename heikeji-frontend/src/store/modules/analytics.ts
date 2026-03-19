import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as analyticsApi from '@/api/analytics'
import { ElMessage } from 'element-plus'
import type { UserBehaviorStats, SalesStats, RecommendationStats } from '@/api/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const userBehaviorStats = ref<UserBehaviorStats | null>(null)
  const salesStats = ref<SalesStats | null>(null)
  const conversionFunnel = ref<Array<{ stage: string; value: number; description: string }>>([])
  const recommendationStats = ref<RecommendationStats | null>(null)
  const userSegmentation = ref<Array<{ segment: string; count: number; percentage: number }>>([])
  const churnPrediction = ref<{ risk: string; probability: number } | null>(null)
  const purchaseIntentPrediction = ref<{ intent: string; probability: number } | null>(null)
  const loading = ref(false)
  const selectedTimeRange = ref<'day' | 'week' | 'month'>('day')

  async function fetchUserBehaviorStats(
    userId: number,
    timeRange: 'day' | 'week' | 'month' = 'day'
  ) {
    try {
      loading.value = true
      const res = await analyticsApi.getUserBehaviorStats(userId, timeRange)
      userBehaviorStats.value = res.data || null
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取用户行为统计失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchSalesStats(timeRange: 'day' | 'week' | 'month' = 'day') {
    try {
      loading.value = true
      const res = await analyticsApi.getSalesStats(timeRange)
      salesStats.value = res.data || null
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取销售统计失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCategorySales(
    categoryId: number,
    timeRange: 'day' | 'week' | 'month' = 'day'
  ) {
    try {
      loading.value = true
      const res = await analyticsApi.getCategorySales(categoryId, timeRange)
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取分类销售失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchProductSales(productId: number, timeRange: 'day' | 'week' | 'month' = 'day') {
    try {
      loading.value = true
      const res = await analyticsApi.getProductSales(productId, timeRange)
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取商品销售失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMerchantRanking(limit: number = 10) {
    try {
      loading.value = true
      const res = await analyticsApi.getMerchantRanking(limit)
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取商家排名失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPaymentMethodDistribution(timeRange: 'day' | 'week' | 'month' = 'day') {
    try {
      loading.value = true
      const res = await analyticsApi.getPaymentMethodDistribution(timeRange)
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取支付方式分布失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchConversionFunnel() {
    try {
      loading.value = true
      const res = await analyticsApi.getConversionFunnel()
      conversionFunnel.value = res.data || []
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取转化漏斗失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchRecommendationStats(timeRange: 'day' | 'week' | 'month' = 'day') {
    try {
      loading.value = true
      const res = await analyticsApi.getRecommendationStats(timeRange)
      recommendationStats.value = res.data || null
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取推荐统计失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logRecommendationExposure(data: {
    userId: number
    productId: number
    sessionId: string
  }) {
    try {
      await analyticsApi.logRecommendationExposure(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '记录推荐曝光失败'
      ElMessage.error(errorMessage)
      throw error
    }
  }

  async function logRecommendationClick(data: {
    userId: number
    productId: number
    sessionId: string
  }) {
    try {
      await analyticsApi.logRecommendationClick(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '记录推荐点击失败'
      ElMessage.error(errorMessage)
      throw error
    }
  }

  async function logRecommendationPurchase(data: {
    userId: number
    productId: number
    sessionId: string
  }) {
    try {
      await analyticsApi.logRecommendationPurchase(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '记录推荐购买失败'
      ElMessage.error(errorMessage)
      throw error
    }
  }

  async function fetchRecommendationReason(userId: number, productId: number) {
    try {
      const res = await analyticsApi.getRecommendationReason(userId, productId)
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取推荐理由失败'
      ElMessage.error(errorMessage)
      throw error
    }
  }

  async function fetchUserSegmentation() {
    try {
      loading.value = true
      const res = await analyticsApi.getUserSegmentation()
      userSegmentation.value = res.data || []
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取用户分群失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchChurnPrediction(userId: number) {
    try {
      loading.value = true
      const res = await analyticsApi.getChurnPrediction(userId)
      churnPrediction.value = res.data || null
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取流失预测失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPurchaseIntentPrediction(userId: number) {
    try {
      loading.value = true
      const res = await analyticsApi.getPurchaseIntentPrediction(userId)
      purchaseIntentPrediction.value = res.data || null
      return res
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取购买意向预测失败'
      ElMessage.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  function setTimeRange(timeRange: 'day' | 'week' | 'month') {
    selectedTimeRange.value = timeRange
  }

  function resetAnalyticsState() {
    userBehaviorStats.value = null
    salesStats.value = null
    conversionFunnel.value = []
    recommendationStats.value = null
    userSegmentation.value = []
    churnPrediction.value = null
    purchaseIntentPrediction.value = null
    selectedTimeRange.value = 'day'
  }

  return {
    userBehaviorStats,
    salesStats,
    conversionFunnel,
    recommendationStats,
    userSegmentation,
    churnPrediction,
    purchaseIntentPrediction,
    loading,
    selectedTimeRange,
    fetchUserBehaviorStats,
    fetchSalesStats,
    fetchCategorySales,
    fetchProductSales,
    fetchMerchantRanking,
    fetchPaymentMethodDistribution,
    fetchConversionFunnel,
    fetchRecommendationStats,
    logRecommendationExposure,
    logRecommendationClick,
    logRecommendationPurchase,
    fetchRecommendationReason,
    fetchUserSegmentation,
    fetchChurnPrediction,
    fetchPurchaseIntentPrediction,
    setTimeRange,
    resetAnalyticsState,
  }
})
