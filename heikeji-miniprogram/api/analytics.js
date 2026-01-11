// 数据分析相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取用户行为数据
 */
const getUserBehaviorData = (params = {}) => {
  return get('/analytics/behavior', params);
};

/**
 * 获取用户偏好数据
 */
const getUserPreferences = () => {
  return get('/analytics/preferences');
};

/**
 * 获取商品推荐列表
 */
const getRecommendedProducts = (params = {}) => {
  return get('/analytics/recommendations/products', params);
};

/**
 * 获取商家推荐列表
 */
const getRecommendedMerchants = (params = {}) => {
  return get('/analytics/recommendations/merchants', params);
};

/**
 * 获取校园活动推荐
 */
const getRecommendedActivities = (params = {}) => {
  return get('/analytics/recommendations/activities', params);
};

/**
 * 记录用户行为
 */
const trackUserBehavior = (behaviorData) => {
  return post('/analytics/track', behaviorData);
};

/**
 * 获取用户消费统计
 */
const getUserConsumptionStats = (params = {}) => {
  return get('/analytics/consumption', params);
};

/**
 * 获取用户订单统计
 */
const getUserOrderStats = (params = {}) => {
  return get('/analytics/orders', params);
};

/**
 * 获取热门商品
 */
const getHotProducts = (params = {}) => {
  return get('/analytics/hot/products', params);
};

/**
 * 获取热门商家
 */
const getHotMerchants = (params = {}) => {
  return get('/analytics/hot/merchants', params);
};

/**
 * 获取热门活动
 */
const getHotActivities = (params = {}) => {
  return get('/analytics/hot/activities', params);
};

module.exports = {
  getUserBehaviorData,
  getUserPreferences,
  getRecommendedProducts,
  getRecommendedMerchants,
  getRecommendedActivities,
  trackUserBehavior,
  getUserConsumptionStats,
  getUserOrderStats,
  getHotProducts,
  getHotMerchants,
  getHotActivities
};
