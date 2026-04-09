import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductListParams, ProductListResponse, ProductDetail, ProductCompareItem, ReviewStats, RecommendedProduct, BrowsingHistoryItem, CreateReviewRequest } from '@/types/product'
import * as productApi from '@/api/product'

export const useProductStore = defineStore('product', () => {
  const list = ref<Product[]>([])
  const detail = ref<ProductDetail | null>(null)
  const hotProducts = ref<Product[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)

  // 用于跟踪并发请求数
  let loadingCount = 0

  // ====== 新增状态 ======

  // 商品对比
  const compareList = ref<ProductCompareItem[]>([])
  const isComparing = ref(false)

  // 推荐商品
  const recommendedProducts = ref<RecommendedProduct[]>([])
  const personalizedRecommendations = ref<RecommendedProduct[]>([])

  // 浏览历史
  const browsingHistory = ref<BrowsingHistoryItem[]>([])

  // 评价相关
  const reviewStats = ref<ReviewStats | null>(null)

  // ====== 基础功能（保持原有） ======

  async function fetchList(params?: ProductListParams) {
    try {
      loadingCount++
      loading.value = true
      error.value = null
      const res = await productApi.getProductList(params)
      list.value = res.list || []
      total.value = res.total || 0
      currentPage.value = params?.page || 1
      return list.value
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      error.value = errorObj.message || '获取商品列表失败'
      throw err
    } finally {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
    }
  }

  async function fetchDetail(id: string | number) {
    try {
      loadingCount++
      loading.value = true
      error.value = null
      const res = await productApi.getProductDetail(id)
      detail.value = res

      // 自动添加到浏览历史
      if (res) {
        addToHistory({
          id: res.id,
          name: res.name,
          images: res.images,
          price: res.price,
        })

        // 加载推荐商品
        loadRecommendedProducts(id)
      }

      return detail.value
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      error.value = errorObj.message || '获取商品详情失败'
      throw err
    } finally {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
    }
  }

  async function fetchHotProducts() {
    try {
      const res = await productApi.getHotProducts()
      hotProducts.value = res || []
      return hotProducts.value
    } catch (err) {
      console.error('获取热门商品失败:', err)
      return []
    }
  }

  async function search(keyword: string, params?: ProductListParams) {
    try {
      loadingCount++
      loading.value = true
      error.value = null
      const res = await productApi.searchProducts(keyword, params)
      list.value = res.list || []
      total.value = res.total || 0
      return list.value
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      error.value = errorObj.message || '搜索失败'
      throw err
    } finally {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
    }
  }

  function clearDetail() {
    detail.value = null
    recommendedProducts.value = []
  }

  // ====== 新增：商品对比功能 ======

  /**
   * 添加商品到对比列表（最多4个）
   */
  function addToCompare(product: ProductCompareItem): boolean {
    if (compareList.value.length >= 4) {
      return false // 已满
    }

    // 检查是否已存在
    if (compareList.value.some(item => item.id === product.id)) {
      return false // 已存在
    }

    compareList.value.push(product)
    return true
  }

  /**
   * 从对比列表移除商品
   */
  function removeFromCompare(productId: number): void {
    compareList.value = compareList.value.filter(item => item.id !== productId)
  }

  /**
   * 清空对比列表
   */
  function clearCompare(): void {
    compareList.value = []
  }

  /**
   * 开始对比（加载完整数据）
   */
  async function startComparison(): Promise<ProductCompareItem[]> {
    if (compareList.value.length < 2) {
      throw new Error('请至少选择2个商品进行对比')
    }

    isComparing.value = true
    try {
      const ids = compareList.value.map(item => item.id)
      const data = await productApi.compareProducts(ids)
      compareList.value = data
      return data
    } finally {
      isComparing.value = false
    }
  }

  /**
   * 是否可以添加到对比
   */
  const canAddToCompare = computed(() => compareList.value.length < 4)

  /**
   * 是否在对比列表中
   */
  function isInCompare(productId: number): boolean {
    return compareList.value.some(item => item.id === productId)
  }

  // ====== 新增：浏览历史管理 ======

  /**
   * 加载浏览历史（从本地存储）
   */
  function loadBrowsingHistory(): void {
    browsingHistory.value = productApi.getBrowsingHistory()
  }

  /**
   * 添加到浏览历史
   */
  function addToHistory(product: Pick<Product, 'id' | 'name' | 'images' | 'price'>): void {
    productApi.addToBrowsingHistory(product)
    loadBrowsingHistory() // 刷新内存中的数据
  }

  /**
   * 清空浏览历史
   */
  function clearHistory(): void {
    productApi.clearBrowsingHistory()
    browsingHistory.value = []
  }

  /**
   * 移除单条历史记录
   */
  function removeFromHistory(productId: number): void {
    productApi.removeBrowsingHistoryItem(productId)
    browsingHistory.value = browsingHistory.value.filter(item => item.productId !== productId)
  }

  // ====== 新增：推荐系统 ======

  /**
   * 加载相关商品推荐
   */
  async function loadRecommendedProducts(productId: string | number, limit?: number): Promise<RecommendedProduct[]> {
    try {
      const data = await productApi.getRecommendedProducts(productId, limit)
      recommendedProducts.value = data
      return data
    } catch (err) {
      console.error('获取推荐商品失败:', err)
      return []
    }
  }

  /**
   * 加载个性化推荐
   */
  async function loadPersonalizedRecommendations(limit?: number): Promise<RecommendedProduct[]> {
    try {
      const data = await productApi.getPersonalizedRecommendations(limit)
      personalizedRecommendations.value = data
      return data
    } catch (err) {
      console.error('获取个性化推荐失败:', err)
      return []
    }
  }

  // ====== 新增：评价系统 ======

  /**
   * 获取评价统计
   */
  async function fetchReviewStats(productId: string | number): Promise<ReviewStats> {
    try {
      const stats = await productApi.getReviewStats(productId)
      reviewStats.value = stats
      return stats
    } catch (err) {
      console.error('获取评价统计失败:', err)
      throw err
    }
  }

  /**
   * 提交评价
   */
  async function submitReview(data: CreateReviewRequest): Promise<void> {
    await productApi.createReview(data)
  }

  /**
   * 标记评价为有用
   */
  async function markHelpful(reviewId: number): Promise<void> {
    await productApi.markReviewHelpful(reviewId)
  }

  // ====== 新增：分享功能 ======

  /**
   * 生成分享链接
   */
  async function generateShareLink(productId: string | number): Promise<{ url: string; qrCode?: string }> {
    return productApi.generateShareLink(productId)
  }

  return {
    // 原有状态和方法
    list,
    detail,
    hotProducts,
    total,
    loading,
    error,
    currentPage,
    fetchList,
    fetchDetail,
    fetchHotProducts,
    search,
    clearDetail,

    // 商品对比
    compareList,
    isComparing,
    canAddToCompare,
    addToCompare,
    removeFromCompare,
    clearCompare,
    startComparison,
    isInCompare,

    // 浏览历史
    browsingHistory,
    loadBrowsingHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,

    // 推荐系统
    recommendedProducts,
    personalizedRecommendations,
    loadRecommendedProducts,
    loadPersonalizedRecommendations,

    // 评价系统
    reviewStats,
    fetchReviewStats,
    submitReview,
    markHelpful,

    // 分享功能
    generateShareLink,
  }
})
