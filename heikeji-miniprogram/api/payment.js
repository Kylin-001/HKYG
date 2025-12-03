// 支付相关API
const { request, post, get } = require('../utils/request');

/**
 * 创建支付订单
 * @param {Object} orderData - 订单数据
 * @param {string} orderData.orderType - 订单类型(takeout/product/errand)
 * @param {number} orderData.orderId - 订单ID
 * @param {number} orderData.amount - 支付金额
 * @param {string} orderData.paymentMethod - 支付方式(wechat/alipay/balance)
 * @returns {Promise} 支付参数
 */
const createPayment = (orderData) => {
  return post('/payment/create', orderData);
};

/**
 * 处理支付回调
 * @param {Object} paymentResult - 支付结果
 * @param {string} paymentResult.orderId - 订单ID
 * @param {string} paymentResult.transactionId - 交易ID
 * @param {string} paymentResult.paymentTime - 支付时间
 * @param {string} paymentResult.status - 支付状态
 * @returns {Promise} 处理结果
 */
const handlePaymentCallback = (paymentResult) => {
  return post('/payment/callback', paymentResult);
};

/**
 * 查询支付状态
 * @param {string} orderId - 订单ID
 * @returns {Promise} 支付状态信息
 */
const getPaymentStatus = (orderId) => {
  return get(`/payment/status/${orderId}`);
};

/**
 * 获取支付方式列表
 * @returns {Promise} 支付方式列表
 */
const getPaymentMethods = () => {
  return get('/payment/methods');
};

/**
 * 申请退款
 * @param {Object} refundData - 退款数据
 * @param {string} refundData.orderId - 订单ID
 * @param {number} refundData.amount - 退款金额
 * @param {string} refundData.reason - 退款原因
 * @returns {Promise} 退款结果
 */
const applyRefund = (refundData) => {
  return post('/payment/refund', refundData);
};

/**
 * 查询退款状态
 * @param {string} refundId - 退款ID
 * @returns {Promise} 退款状态信息
 */
const getRefundStatus = (refundId) => {
  return get(`/payment/refund/status/${refundId}`);
};

/**
 * 小程序微信支付接口封装
 * @param {Object} payParams - 支付参数(从服务端获取)
 * @returns {Promise} 支付结果
 */
const wechatPay = (payParams) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType || 'MD5',
      paySign: payParams.paySign,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

module.exports = {
  createPayment,
  handlePaymentCallback,
  getPaymentStatus,
  getPaymentMethods,
  applyRefund,
  getRefundStatus,
  wechatPay
};