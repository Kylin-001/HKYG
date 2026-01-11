// 外卖相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取商家列表
 */
const getMerchantList = (params = {}) => {
  return get('/takeout/merchants', params, { 
    cache: params.cache !== false, 
    cacheExpire: params.cacheExpire || 10 * 60 * 1000 // 默认缓存10分钟
  });
};

/**
 * 获取商家详情
 */
const getMerchantDetail = (id) => {
  return get(`/takeout/merchants/${id}`, {}, { 
    cache: true, 
    cacheExpire: 5 * 60 * 1000 // 默认缓存5分钟
  });
};

/**
 * 获取商家菜品分类
 */
const getMerchantCategories = (merchantId) => {
  return get(`/takeout/merchants/${merchantId}/categories`, {}, { 
    cache: true, 
    cacheExpire: 10 * 60 * 1000 // 默认缓存10分钟
  });
};

/**
 * 获取商家菜品列表
 */
const getMerchantDishes = (merchantId, categoryId = null) => {
  const params = categoryId ? { categoryId } : {};
  return get(`/takeout/merchants/${merchantId}/dishes`, params, { 
    cache: true, 
    cacheExpire: 10 * 60 * 1000 // 默认缓存10分钟
  });
};

/**
 * 获取菜品详情
 */
const getDishDetail = (id) => {
  return get(`/takeout/dishes/${id}`);
};

/**
 * 获取商家评价列表
 */
const getMerchantComments = (merchantId, params = {}) => {
  return get(`/takeout/merchants/${merchantId}/comments`, params);
};

/**
 * 创建外卖订单
 */
const createTakeoutOrder = (orderData) => {
  return post('/takeout/orders', orderData);
};

/**
 * 获取外卖订单列表
 */
const getTakeoutOrderList = (params = {}) => {
  return get('/takeout/orders', params);
};

/**
 * 获取外卖订单详情
 */
const getTakeoutOrderDetail = (id) => {
  return get(`/takeout/orders/${id}`);
};

/**
 * 取消外卖订单
 */
const cancelTakeoutOrder = (id) => {
  return put(`/takeout/orders/${id}/cancel`);
};

/**
 * 确认收货
 */
const confirmTakeoutOrder = (id) => {
  return put(`/takeout/orders/${id}/confirm`);
};

/**
 * 评价外卖订单
 */
const commentTakeoutOrder = (id, commentData) => {
  return post(`/takeout/orders/${id}/comment`, commentData);
};

module.exports = {
  getMerchantList,
  getMerchantDetail,
  getMerchantCategories,
  getMerchantDishes,
  getDishDetail,
  getMerchantComments,
  createTakeoutOrder,
  getTakeoutOrderList,
  getTakeoutOrderDetail,
  cancelTakeoutOrder,
  confirmTakeoutOrder,
  commentTakeoutOrder
};