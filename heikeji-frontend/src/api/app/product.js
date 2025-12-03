import request from '@/utils/request'
import { apiBaseUrl } from '@/config'

/**
 * 获取商品详情
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function getProductById(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/detail/${productId}`,
    method: 'get',
  })
}

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {number} [params.categoryId] - 分类ID
 * @param {string} [params.keyword] - 搜索关键词
 * @param {string} [params.sortBy] - 排序字段
 * @param {string} [params.order] - 排序方式（asc/desc）
 * @returns {Promise}
 */
export function getProductList(params) {
  return request({
    url: `${apiBaseUrl}/app/product/list`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      categoryId: params.categoryId,
      keyword: params.keyword,
      sortBy: params.sortBy,
      order: params.order,
    },
  })
}

/**
 * 获取热门商品
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 返回数量
 * @returns {Promise}
 */
export function getHotProducts(params) {
  return request({
    url: `${apiBaseUrl}/app/product/hot`,
    method: 'get',
    params: {
      limit: params.limit || 10,
    },
  })
}

/**
 * 获取推荐商品
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 返回数量
 * @param {number} [params.productId] - 当前商品ID（用于排除当前商品）
 * @returns {Promise}
 */
export function getRecommendedProducts(params) {
  return request({
    url: `${apiBaseUrl}/app/product/recommended`,
    method: 'get',
    params: {
      limit: params.limit || 10,
      productId: params.productId,
    },
  })
}

/**
 * 批量获取商品信息
 * @param {Array} productIds - 商品ID数组
 * @returns {Promise}
 */
export function getProductsByIds(productIds) {
  return request({
    url: `${apiBaseUrl}/app/product/batch`,
    method: 'post',
    data: {
      productIds,
    },
  })
}

/**
 * 搜索商品
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {Object} [params.filters] - 筛选条件
 * @param {Object} [params.sort] - 排序条件
 * @returns {Promise}
 */
export function searchProducts(params) {
  return request({
    url: `${apiBaseUrl}/app/product/search`,
    method: 'get',
    params: {
      keyword: params.keyword,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      ...params.filters,
      ...params.sort,
    },
  })
}

/**
 * 获取商品评价列表
 * @param {Object} params - 查询参数
 * @param {number} params.productId - 商品ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.type] - 评价类型（all/good/medium/bad）
 * @returns {Promise}
 */
export function getProductReviews(params) {
  return request({
    url: `${apiBaseUrl}/app/product/${params.productId}/reviews`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      type: params.type || 'all',
    },
  })
}

/**
 * 获取商品评价统计
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function getProductReviewStats(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/${productId}/review-stats`,
    method: 'get',
  })
}

/**
 * 收藏商品
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function favoriteProduct(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/favorite`,
    method: 'post',
    data: {
      productId,
    },
  })
}

/**
 * 取消收藏商品
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function unfavoriteProduct(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/favorite`,
    method: 'delete',
    params: {
      productId,
    },
  })
}

/**
 * 检查商品是否已收藏
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function checkFavoriteStatus(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/favorite/status`,
    method: 'get',
    params: {
      productId,
    },
  })
}

/**
 * 获取商品库存信息
 * @param {number} productId - 商品ID
 * @param {string} [skuIds] - SKU ID列表，逗号分隔
 * @returns {Promise}
 */
export function getProductStock(productId, skuIds) {
  return request({
    url: `${apiBaseUrl}/app/product/stock`,
    method: 'get',
    params: {
      productId,
      skuIds,
    },
  })
}

/**
 * 记录商品浏览历史
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function recordProductView(productId) {
  return request({
    url: `${apiBaseUrl}/app/product/view`,
    method: 'post',
    data: {
      productId,
    },
  })
}

/**
 * 获取热门搜索词
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 返回数量
 * @returns {Promise}
 */
export function getHotSearchWords(params) {
  return request({
    url: `${apiBaseUrl}/app/product/hotWords`,
    method: 'get',
    params: {
      limit: params.limit || 10,
    },
  })
}

/**
 * 获取搜索建议
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.limit - 返回数量
 * @returns {Promise}
 */
export function getSearchSuggestions(params) {
  return request({
    url: `${apiBaseUrl}/app/product/searchSuggestions`,
    method: 'get',
    params: {
      keyword: params.keyword,
      limit: params.limit || 5,
    },
  })
}
