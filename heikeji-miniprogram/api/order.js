// 订单相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 创建订单
 */
const createOrder = (orderData) => {
  return post('/order/create', orderData);
};

/**
 * 获取订单详情
 */
const getOrderDetail = (orderId) => {
  return get(`/order/detail/${orderId}`);
};

/**
 * 获取订单列表
 */
const getOrderList = (params = {}) => {
  return get('/order/list', params);
};

/**
 * 取消订单
 */
const cancelOrder = (orderId) => {
  return put(`/order/cancel/${orderId}`);
};

/**
 * 确认收货
 */
const confirmReceive = (orderId) => {
  return put(`/order/confirm/${orderId}`);
};

/**
 * 删除订单
 */
const deleteOrder = (orderId) => {
  return del(`/order/delete/${orderId}`);
};

/**
 * 获取订单物流信息
 */
const getOrderLogistics = (orderId) => {
  return get(`/order/logistics/${orderId}`);
};

/**
 * 申请退款
 */
const applyRefund = (orderId, refundData) => {
  return post(`/order/refund/apply/${orderId}`, refundData);
};

/**
 * 获取退款详情
 */
const getRefundDetail = (refundId) => {
  return get(`/order/refund/detail/${refundId}`);
};

module.exports = {
  createOrder,
  getOrderDetail,
  getOrderList,
  cancelOrder,
  confirmReceive,
  deleteOrder,
  getOrderLogistics,
  applyRefund,
  getRefundDetail
};