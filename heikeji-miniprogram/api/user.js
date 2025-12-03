// 用户相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 微信登录
 */
const wxLogin = (code) => {
  return post('/auth/wx-login', { code });
};

/**
 * 绑定学号
 */
const bindStudentId = (studentId) => {
  return post('/user/bind-student', { studentId });
};

/**
 * 获取用户信息
 */
const getUserInfo = () => {
  return get('/user/profile');
};

/**
 * 更新用户信息
 */
const updateUserInfo = (userInfo) => {
  return put('/user/profile', userInfo);
};

/**
 * 获取用户地址列表
 */
const getAddressList = () => {
  return get('/user/address');
};

/**
 * 添加用户地址
 */
const addAddress = (address) => {
  return post('/user/address', address);
};

/**
 * 更新用户地址
 */
const updateAddress = (id, address) => {
  return put(`/user/address/${id}`, address);
};

/**
 * 删除用户地址
 */
const deleteAddress = (id) => {
  return del(`/user/address/${id}`);
};

/**
 * 设置默认地址
 */
const setDefaultAddress = (id) => {
  return put(`/user/address/${id}/default`);
};

/**
 * 获取用户订单列表
 */
const getUserOrders = (params) => {
  return get('/user/orders', params);
};

/**
 * 获取用户钱包信息
 */
const getUserWallet = () => {
  return get('/user/wallet');
};

/**
 * 钱包充值
 */
const walletRecharge = (amount) => {
  return post('/user/wallet/recharge', { amount });
};

/**
 * 获取用户钱包交易记录
 */
const getWalletRecords = (params) => {
  return get('/user/wallet/records', params);
};

/**
 * 获取用户收藏
 */
const getUserFavorites = (params) => {
  return get('/user/favorites', params);
};

/**
 * 取消收藏
 */
const removeFavorite = (id) => {
  return del(`/user/favorites/${id}`);
};

/**
 * 添加收藏
 */
const addFavorite = (type, targetId) => {
  return post('/user/favorites', { type, targetId });
};

/**
 * 获取用户积分信息
 */
const getUserPoints = () => {
  return get('/user/points');
};

/**
 * 获取用户积分记录
 */
const getPointsRecords = (params) => {
  return get('/user/points/records', params);
};

/**
 * 意见反馈
 */
const submitFeedback = (feedback) => {
  return post('/user/feedback', feedback);
};

module.exports = {
  wxLogin,
  bindStudentId,
  getUserInfo,
  updateUserInfo,
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserOrders,
  getUserWallet,
  walletRecharge,
  getWalletRecords,
  getUserFavorites,
  removeFavorite,
  addFavorite,
  getUserPoints,
  getPointsRecords,
  submitFeedback
};