// 优惠券相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.status - 优惠券状态(available/used/expired)
 * @param {string} params.type - 优惠券类型(discount/cashback)
 * @returns {Promise} 优惠券列表
 */
const getCouponList = (params = {}) => {
  return get('/coupon/list', params);
};

/**
 * 获取优惠券详情
 * @param {string} id - 优惠券ID
 * @returns {Promise} 优惠券详情
 */
const getCouponDetail = (id) => {
  return get(`/coupon/detail/${id}`);
};

/**
 * 领取优惠券
 * @param {string} id - 优惠券ID
 * @returns {Promise} 领取结果
 */
const receiveCoupon = (id) => {
  return post(`/coupon/receive/${id}`);
};

/**
 * 使用优惠券
 * @param {Object} data - 使用数据
 * @param {string} data.couponId - 优惠券ID
 * @param {string} data.orderId - 订单ID
 * @returns {Promise} 使用结果
 */
const useCoupon = (data) => {
  return post('/coupon/use', data);
};

/**
 * 获取用户可用优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} params.amount - 订单金额
 * @param {string} params.orderType - 订单类型
 * @returns {Promise} 用户可用优惠券列表
 */
const getAvailableCoupons = (params = {}) => {
  return get('/coupon/available', params);
};

/**
 * 获取用户优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.status - 优惠券状态(available/used/expired)
 * @returns {Promise} 用户优惠券列表
 */
const getUserCoupons = (params = {}) => {
  return get('/coupon/user-list', params);
};

/**
 * 获取优惠券使用规则
 * @param {string} id - 优惠券ID
 * @returns {Promise} 优惠券使用规则
 */
const getCouponRules = (id) => {
  return get(`/coupon/rules/${id}`);
};

/**
 * 获取优惠券过期提醒
 * @returns {Promise} 即将过期的优惠券列表
 */
const getExpiringCoupons = () => {
  return get('/coupon/expiring');
};

/**
 * 获取可领取的优惠券
 * @returns {Promise} 可领取的优惠券列表
 */
const getReceivableCoupons = () => {
  return get('/coupon/receivable');
};

module.exports = {
  getCouponList,
  getCouponDetail,
  receiveCoupon,
  useCoupon,
  getAvailableCoupons,
  getUserCoupons,
  getCouponRules,
  getExpiringCoupons,
  getReceivableCoupons
};
