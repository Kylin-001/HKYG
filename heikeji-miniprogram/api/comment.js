// 评价相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 创建评价
 * @param {Object} commentData - 评价数据
 * @param {string} commentData.orderId - 订单ID
 * @param {string} commentData.productId - 商品ID
 * @param {number} commentData.rating - 评分(1-5)
 * @param {string} commentData.content - 评价内容
 * @param {Array} commentData.images - 评价图片
 * @param {string} commentData.serviceRating - 服务评分(1-5)
 * @param {string} commentData.deliveryRating - 配送评分(1-5)
 * @returns {Promise} 评价结果
 */
const createComment = (commentData) => {
  return post('/comment/create', commentData);
};

/**
 * 获取评价列表
 * @param {Object} params - 查询参数
 * @param {string} params.orderId - 订单ID
 * @param {string} params.productId - 商品ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.rating - 评分(1-5)
 * @returns {Promise} 评价列表
 */
const getCommentList = (params = {}) => {
  return get('/comment/list', params);
};

/**
 * 获取评价详情
 * @param {string} id - 评价ID
 * @returns {Promise} 评价详情
 */
const getCommentDetail = (id) => {
  return get(`/comment/detail/${id}`);
};

/**
 * 回复评价
 * @param {string} id - 评价ID
 * @param {string} replyContent - 回复内容
 * @returns {Promise} 回复结果
 */
const replyComment = (id, replyContent) => {
  return put(`/comment/reply/${id}`, { replyContent });
};

/**
 * 删除评价
 * @param {string} id - 评价ID
 * @returns {Promise} 删除结果
 */
const deleteComment = (id) => {
  return del(`/comment/delete/${id}`);
};

/**
 * 获取商品评价
 * @param {string} productId - 商品ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.rating - 评分(1-5)
 * @returns {Promise} 商品评价列表
 */
const getProductComments = (productId, params = {}) => {
  return get(`/comment/product/${productId}`, params);
};

/**
 * 获取订单评价状态
 * @param {string} orderId - 订单ID
 * @returns {Promise} 评价状态
 */
const getOrderCommentStatus = (orderId) => {
  return get(`/comment/order/status/${orderId}`);
};

/**
 * 点赞/取消点赞评价
 * @param {string} id - 评价ID
 * @returns {Promise} 点赞结果
 */
const toggleCommentLike = (id) => {
  return post(`/comment/like/${id}`);
};

/**
 * 批量获取商品评价统计
 * @param {Array} productIds - 商品ID列表
 * @returns {Promise} 商品评价统计列表
 */
const getCommentStats = (productIds) => {
  return post('/comment/stats', { productIds });
};

module.exports = {
  createComment,
  getCommentList,
  getCommentDetail,
  replyComment,
  deleteComment,
  getProductComments,
  getOrderCommentStatus,
  toggleCommentLike,
  getCommentStats
};
