// 商品相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取商品分类列表
 */
const getCategoryList = () => {
  return get('/product/categories', {}, { 
    cache: true, 
    cacheExpire: 30 * 60 * 1000 // 默认缓存30分钟
  });
};

/**
 * 获取商品列表
 */
const getProductList = (params = {}) => {
  return get('/product/list', params, { 
    cache: params.cache !== false, 
    cacheExpire: params.cacheExpire || 5 * 60 * 1000 // 默认缓存5分钟
  });
};

/**
 * 获取商品详情
 */
const getProductDetail = (id) => {
  return get(`/product/detail/${id}`, {}, { 
    cache: true, 
    cacheExpire: 10 * 60 * 1000 // 默认缓存10分钟
  });
};

/**
 * 添加到购物车
 */
const addToCart = (cartData) => {
  return post('/cart/add', cartData);
};

/**
 * 获取购物车列表
 */
const getCartList = () => {
  return get('/cart/list');
};

/**
 * 更新购物车商品数量
 */
const updateCartItem = (cartId, data) => {
  return put(`/cart/item/${cartId}`, data);
};

/**
 * 删除购物车商品
 */
const deleteCartItem = (cartId) => {
  return del(`/cart/item/${cartId}`);
};

/**
 * 清空购物车
 */
const clearCart = () => {
  return del('/cart/clear');
};

/**
 * 检查收藏状态
 */
const checkCollectStatus = (productId) => {
  return get(`/collect/check/${productId}`);
};

/**
 * 添加收藏
 */
const addCollect = (productId) => {
  return post('/collect/add', { productId });
};

/**
 * 取消收藏
 */
const cancelCollect = (productId) => {
  return del(`/collect/cancel/${productId}`);
};

/**
 * 获取收藏列表
 */
const getCollectList = (params = {}) => {
  return get('/collect/list', params);
};

/**
 * 获取商品评价列表
 */
const getProductReviews = (productId, params = {}) => {
  return get(`/product/reviews/${productId}`, params, { 
    cache: params.cache !== false, 
    cacheExpire: params.cacheExpire || 10 * 60 * 1000 // 默认缓存10分钟
  });
};

/**
 * 添加商品评价
 */
const addProductReview = (productId, reviewData) => {
  return post(`/product/reviews/${productId}`, reviewData);
};

module.exports = {
  getCategoryList,
  getProductList,
  getProductDetail,
  addToCart,
  getCartList,
  updateCartItem,
  deleteCartItem,
  clearCart,
  checkCollectStatus,
  addCollect,
  cancelCollect,
  getCollectList,
  getProductReviews,
  addProductReview
};
