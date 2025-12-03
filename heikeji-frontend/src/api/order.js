import request from '@/utils/request'

// 订单管理相关API
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params,
  })
}

export function getOrderDetail(orderId) {
  return request({
    url: `/order/detail/${orderId}`,
    method: 'get',
  })
}

export function shipOrder(orderId, logisticsInfo) {
  return request({
    url: `/order/ship/${orderId}`,
    method: 'put',
    data: logisticsInfo,
  })
}

// 提醒付款
export function remindPay(orderId) {
  return request({
    url: `/order/remind/${orderId}`,
    method: 'post',
  })
}

// 获取物流详情
export function getLogisticsDetail(orderId) {
  return request({
    url: `/order/logistics/${orderId}`,
    method: 'get',
  })
}

// 确认收货
export function confirmReceive(orderId) {
  return request({
    url: `/order/confirm/${orderId}`,
    method: 'put',
  })
}

// 同意退款
export function agreeRefund(orderId, reason) {
  return request({
    url: `/order/refund/approve/${orderId}`,
    method: 'put',
    params: { reason },
  })
}

export function cancelOrder(orderId) {
  return request({
    url: `/order/cancel/${orderId}`,
    method: 'put',
  })
}

export function confirmOrder(orderId) {
  return request({
    url: `/order/confirm/${orderId}`,
    method: 'put',
  })
}

export function deleteOrder(orderId) {
  return request({
    url: `/order/delete/${orderId}`,
    method: 'delete',
  })
}

export function updateOrderRemark(orderId, remark) {
  return request({
    url: `/order/remark/${orderId}`,
    method: 'put',
    params: { remark },
  })
}

// 退款相关API
export function getRefundList(params) {
  return request({
    url: '/order/refund/list',
    method: 'get',
    params,
  })
}

export function getRefundDetail(refundId) {
  return request({
    url: `/order/refund/detail/${refundId}`,
    method: 'get',
  })
}

export function approveRefund(refundId, reason) {
  return request({
    url: `/order/refund/approve/${refundId}`,
    method: 'put',
    params: { reason },
  })
}

export function rejectRefund(refundId, reason) {
  return request({
    url: `/order/refund/reject/${refundId}`,
    method: 'put',
    params: { reason },
  })
}

export function exportOrderList(params) {
  return request({
    url: '/order/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

// 订单统计相关API
export function getOrderStatistics(timeRange) {
  return request({
    url: '/order/statistics',
    method: 'get',
    params: { timeRange },
  })
}

export function getOrderStatusCount() {
  return request({
    url: '/order/status/count',
    method: 'get',
  })
}

// 支付相关API
// 创建支付订单
export function createPayment(orderId, paymentMethod) {
  return request({
    url: `/order/pay/${orderId}`,
    method: 'post',
    data: { paymentMethod },
  })
}

// 处理支付回调
export function handlePaymentCallback(params) {
  return request({
    url: '/order/pay/callback',
    method: 'post',
    params,
  })
}

// 查询支付状态
export function getPaymentStatus(orderId) {
  return request({
    url: `/order/pay/status/${orderId}`,
    method: 'get',
  })
}

// 创建直接购买订单并支付
export function createOrderAndPay(params) {
  return request({
    url: '/order/createAndPay',
    method: 'post',
    data: params,
  })
}

// 创建外卖订单并支付
export function createTakeoutOrderAndPay(params) {
  return request({
    url: '/order/takeout/createAndPay',
    method: 'post',
    data: params,
  })
}

// 取消超时订单（前端触发的检查）
export function checkTimeoutOrders() {
  return request({
    url: '/order/checkTimeout',
    method: 'post',
  })
}
