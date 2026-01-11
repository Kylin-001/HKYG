// 积分相关API
const { request, get, post, put } = require('../utils/request');

/**
 * 获取用户积分余额
 * @returns {Promise} 积分余额
 */
const getPointBalance = () => {
  return get('/point/balance');
};

/**
 * 获取积分记录
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.type - 积分类型(income/outcome)
 * @param {string} params.source - 积分来源
 * @returns {Promise} 积分记录列表
 */
const getPointRecords = (params = {}) => {
  return get('/point/records', params);
};

/**
 * 使用积分
 * @param {Object} data - 使用积分数据
 * @param {number} data.amount - 使用积分数量
 * @param {string} data.orderId - 关联订单ID
 * @param {string} data.type - 使用类型
 * @returns {Promise} 使用结果
 */
const usePoints = (data) => {
  return post('/point/use', data);
};

/**
 * 获取积分规则
 * @returns {Promise} 积分规则
 */
const getPointRules = () => {
  return get('/point/rules');
};

/**
 * 获取积分来源列表
 * @returns {Promise} 积分来源列表
 */
const getPointSources = () => {
  return get('/point/sources');
};

/**
 * 获取积分商品列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise} 积分商品列表
 */
const getPointProducts = (params = {}) => {
  return get('/point/products', params);
};

/**
 * 兑换积分商品
 * @param {string} productId - 积分商品ID
 * @returns {Promise} 兑换结果
 */
const exchangePointProduct = (productId) => {
  return post('/point/exchange', { productId });
};

/**
 * 获取积分排行榜
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise} 积分排行榜
 */
const getPointRanking = (params = {}) => {
  return get('/point/ranking', params);
};

module.exports = {
  getPointBalance,
  getPointRecords,
  usePoints,
  getPointRules,
  getPointSources,
  getPointProducts,
  exchangePointProduct,
  getPointRanking
};
