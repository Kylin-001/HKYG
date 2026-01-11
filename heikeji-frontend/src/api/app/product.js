import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取商品详情
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function getProductDetail(productId) {
  return request({
    url: `${config.API_BASE_URL}/app/product/detail/${productId}`,
    method: 'get',
  })
}

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {number} [params.categoryId] - 分类ID
 * @param {number} [params.brandId] - 品牌ID
 * @param {string} [params.keyword] - 关键词
 * @param {string} [params.sortBy] - 排序字段
 * @param {string} [params.sortOrder] - 排序方向
 * @returns {Promise}
 */
export function getProductList(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/list`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      categoryId: params.categoryId,
      brandId: params.brandId,
      keyword: params.keyword,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  })
}

/**
 * 获取热门商品
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 数量限制
 * @returns {Promise}
 */
export function getHotProducts(params = {}) {
  return request({
    url: `${config.API_BASE_URL}/app/product/hot`,
    method: 'get',
    params: {
      limit: params.limit || 10,
    },
  })
}

/**
 * 获取推荐商品
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 数量限制
 * @returns {Promise}
 */
export function getRecommendedProducts(params = {}) {
  return request({
    url: `${config.API_BASE_URL}/app/product/recommended`,
    method: 'get',
    params: {
      limit: params.limit || 10,
    },
  })
}

/**
 * 批量获取商品信息
 * @param {Object} params - 查询参数
 * @param {Array<number>} params.productIds - 商品ID列表
 * @returns {Promise}
 */
export function getBatchProducts(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/batch`,
    method: 'post',
    data: {
      productIds: params.productIds,
    },
  })
}

/**
 * 搜索商品
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 关键词
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @returns {Promise}
 */
export function searchProducts(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/search`,
    method: 'get',
    params: {
      keyword: params.keyword,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    },
  })
}

/**
 * 获取商品评论列表
 * @param {Object} params - 查询参数
 * @param {number} params.productId - 商品ID
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @returns {Promise}
 */
export function getProductReviews(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/${params.productId}/reviews`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    },
  })
}

/**
 * 获取商品评论统计
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function getProductReviewStats(productId) {
  return request({
    url: `${config.API_BASE_URL}/app/product/${productId}/review-stats`,
    method: 'get',
  })
}

/**
 * 收藏商品
 * @param {Object} params - 收藏参数
 * @param {number} params.productId - 商品ID
 * @returns {Promise}
 */
export function favoriteProduct(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/favorite`,
    method: 'post',
    data: {
      productId: params.productId,
    },
  })
}

/**
 * 取消收藏商品
 * @param {Object} params - 取消收藏参数
 * @param {number} params.productId - 商品ID
 * @returns {Promise}
 */
export function unfavoriteProduct(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/favorite`,
    method: 'delete',
    data: {
      productId: params.productId,
    },
  })
}

/**
 * 获取商品收藏状态
 * @param {Object} params - 查询参数
 * @param {number} params.productId - 商品ID
 * @returns {Promise}
 */
export function getProductFavoriteStatus(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/favorite/status`,
    method: 'get',
    params: {
      productId: params.productId,
    },
  })
}

/**
 * 检查商品库存
 * @param {Object} params - 检查参数
 * @param {number} params.productId - 商品ID
 * @param {number} [params.skuId] - SKU ID
 * @param {number} params.quantity - 数量
 * @returns {Promise}
 */
export function checkProductStock(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/stock`,
    method: 'post',
    data: {
      productId: params.productId,
      skuId: params.skuId,
      quantity: params.quantity,
    },
  })
}

/**
 * 记录商品浏览
 * @param {Object} params - 浏览参数
 * @param {number} params.productId - 商品ID
 * @returns {Promise}
 */
export function recordProductView(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/view`,
    method: 'post',
    data: {
      productId: params.productId,
    },
  })
}

/**
 * 获取热门搜索词
 * @returns {Promise}
 */
export function getHotSearchWords() {
  return request({
    url: `${config.API_BASE_URL}/app/product/hotWords`,
    method: 'get',
  })
}

/**
 * 获取搜索建议
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词
 * @returns {Promise}
 */
export function getSearchSuggestions(params) {
  return request({
    url: `${config.API_BASE_URL}/app/product/searchSuggestions`,
    method: 'get',
    params: {
      keyword: params.keyword,
    },
  })
}
