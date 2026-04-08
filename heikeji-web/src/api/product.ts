import { get, post, del } from '@/utils/request'
import type { Product, ProductListParams, ProductListResponse, ProductDetail, ProductCompareItem, ShareLink, CreateReviewRequest, ReviewStats, BrowsingHistoryItem, RecommendedProduct, ProductReview } from '@/types/product'

export function getProductList(params?: ProductListParams): Promise<ProductListResponse> {
  return get('/products', { params })
}

export function getProductDetail(id: string | number): Promise<ProductDetail> {
  return get(`/products/${id}`)
}

export function getHotProducts(): Promise<Product[]> {
  return get('/products/hot')
}

export function searchProducts(keyword: string, params?: ProductListParams): Promise<ProductListResponse> {
  return get('/products/search', { params: { keyword, ...params } })
}

export function getProductCategories(): Promise<{ id: string; name: string; count: number }[]> {
  return get('/products/categories')
}

// ====== 新增：商品对比功能 ======
/**
 * 获取商品对比数据（支持2-4个商品）
 */
export function compareProducts(productIds: number[]): Promise<ProductCompareItem[]> {
  if (productIds.length < 2 || productIds.length > 4) {
    throw new Error('商品数量必须在2-4个之间')
  }
  return get('/products/compare', { params: { ids: productIds.join(',') } })
}

// ====== 新增：商品分享功能 ======
/**
 * 生成商品分享链接
 */
export function generateShareLink(productId: string | number): Promise<ShareLink> {
  return post(`/products/${productId}/share`)
}

// ====== 新增：商品评价系统 ======
/**
 * 获取商品评价列表
 */
export function getProductReviews(productId: string | number, params?: PaginationParams): Promise<{ list: ProductReview[]; total: number }> {
  return get(`/products/${productId}/reviews`, { params })
}

/**
 * 获取商品评价统计
 */
export function getReviewStats(productId: string | number): Promise<ReviewStats> {
  return get(`/products/${productId}/review-stats`)
}

/**
 * 提交商品评价
 */
export function createReview(data: CreateReviewRequest): Promise<void> {
  return post('/products/reviews', data)
}

/**
 * 标记评价为有用
 */
export function markReviewHelpful(reviewId: number): Promise<void> {
  return post(`/products/reviews/${reviewId}/helpful`)
}

// ====== 新增：浏览历史（本地存储 + 同步） ======

const BROWSE_HISTORY_KEY = 'heikeji_browse_history'
const MAX_BROWSE_HISTORY = 100

/**
 * 添加到浏览历史（本地存储）
 */
export function addToBrowsingHistory(product: Pick<Product, 'id' | 'name' | 'images' | 'price'>): void {
  try {
    const history = getBrowsingHistory()
    
    // 移除已存在的记录（避免重复）
    const filtered = history.filter(item => item.productId !== product.id)
    
    // 添加新记录到开头
    const newItem: BrowsingHistoryItem = {
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0] || '',
      price: product.price,
      viewedAt: new Date().toISOString(),
    }
    
    filtered.unshift(newItem)
    
    // 限制历史记录数量
    if (filtered.length > MAX_BROWSE_HISTORY) {
      filtered.length = MAX_BROWSE_HISTORY
    }
    
    localStorage.setItem(BROWSE_HISTORY_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('保存浏览历史失败:', error)
  }
}

/**
 * 获取浏览历史
 */
export function getBrowsingHistory(): BrowsingHistoryItem[] {
  try {
    const data = localStorage.getItem(BROWSE_HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('读取浏览历史失败:', error)
    return []
  }
}

/**
 * 清空浏览历史
 */
export function clearBrowsingHistory(): void {
  localStorage.removeItem(BROWSE_HISTORY_KEY)
}

/**
 * 删除单条浏览历史
 */
export function removeBrowsingHistoryItem(productId: number): void {
  const history = getBrowsingHistory()
  const filtered = history.filter(item => item.productId !== productId)
  localStorage.setItem(BROWSE_HISTORY_KEY, JSON.stringify(filtered))
}

// ====== 新增：推荐系统 ======
/**
 * 获取相关商品推荐
 */
export function getRecommendedProducts(productId: string | number, limit?: number): Promise<RecommendedProduct[]> {
  return get(`/products/${productId}/recommendations`, { params: { limit: limit || 10 } })
}

/**
 * 获取个性化推荐（基于用户行为）
 */
export function getPersonalizedRecommendations(limit?: number): Promise<RecommendedProduct[]> {
  return get('/products/personalized-recommendations', { params: { limit: limit || 20 } })
}
