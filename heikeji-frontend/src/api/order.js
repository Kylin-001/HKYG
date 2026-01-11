import request from '@/utils/request'
import config from '@/config/environment'

// 订单管理相关API
export function getOrderList(params) {
  return request({
    url: `${config.API_BASE_URL}/order/list`,
    method: 'get',
    params,
  })
}

export function getOrderDetail(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/detail/${orderId}`,
    method: 'get',
  })
}

export function shipOrder(orderId, logisticsInfo) {
  return request({
    url: `${config.API_BASE_URL}/order/ship/${orderId}`,
    method: 'put',
    data: logisticsInfo,
  })
}

// 提醒付款
export function remindPay(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/remind/${orderId}`,
    method: 'post',
  })
}

// 获取物流详情
export function getLogisticsDetail(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/logistics/${orderId}`,
    method: 'get',
  })
}

// 确认收货
export function confirmReceive(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/confirm/${orderId}`,
    method: 'put',
  })
}

// 同意退款
export function agreeRefund(orderId, reason) {
  return request({
    url: `${config.API_BASE_URL}/order/refund/approve/${orderId}`,
    method: 'put',
    params: { reason },
  })
}

export function cancelOrder(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/cancel/${orderId}`,
    method: 'put',
  })
}

export function confirmOrder(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/confirm/${orderId}`,
    method: 'put',
  })
}

export function deleteOrder(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/delete/${orderId}`,
    method: 'delete',
  })
}

export function updateOrderRemark(orderId, remark) {
  return request({
    url: `${config.API_BASE_URL}/order/remark/${orderId}`,
    method: 'put',
    params: { remark },
  })
}

// 退款相关API
export function getRefundList(params) {
  return request({
    url: `${config.API_BASE_URL}/order/refund/list`,
    method: 'get',
    params,
  })
}

export function getRefundDetail(refundId) {
  return request({
    url: `${config.API_BASE_URL}/order/refund/detail/${refundId}`,
    method: 'get',
  })
}

export function approveRefund(refundId, reason) {
  return request({
    url: `${config.API_BASE_URL}/order/refund/approve/${refundId}`,
    method: 'put',
    params: { reason },
  })
}

export function rejectRefund(refundId, reason) {
  return request({
    url: `${config.API_BASE_URL}/order/refund/reject/${refundId}`,
    method: 'put',
    params: { reason },
  })
}

export function exportOrderList(params) {
  return request({
    url: `${config.API_BASE_URL}/order/export`,
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 订单统计相关API
export function getOrderStatistics(timeRange) {
  return request({
    url: `${config.API_BASE_URL}/order/statistics`,
    method: 'get',
    params: { timeRange },
  })
}

export function getOrderStatusCount() {
  return request({
    url: `${config.API_BASE_URL}/order/status/count`,
    method: 'get',
  })
}

// 支付相关API
// 创建支付订单
export function createPayment(orderId, paymentMethod) {
  return request({
    url: `${config.API_BASE_URL}/order/pay/${orderId}`,
    method: 'post',
    data: { paymentMethod },
  })
}

// 处理支付回调
export function handlePaymentCallback(params) {
  return request({
    url: `${config.API_BASE_URL}/order/pay/callback`,
    method: 'post',
    params,
  })
}

// 查询支付状态
export function getPaymentStatus(orderId) {
  return request({
    url: `${config.API_BASE_URL}/order/pay/status/${orderId}`,
    method: 'get',
  })
}

// 创建直接购买订单并支付
export function createOrderAndPay(params) {
  return request({
    url: `${config.API_BASE_URL}/order/createAndPay`,
    method: 'post',
    data: params,
  })
}

// 创建外卖订单并支付
export function createTakeoutOrderAndPay(params) {
  return request({
    url: `${config.API_BASE_URL}/order/takeout/createAndPay`,
    method: 'post',
    data: params,
  })
}

// 取消超时订单（前端触发的检查）
export function checkTimeoutOrders() {
  return request({
    url: `${config.API_BASE_URL}/order/checkTimeout`,
    method: 'post',
  })
}
