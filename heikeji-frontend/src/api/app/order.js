import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.status] - 订单状态
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/list`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      status: params.status,
    },
  })
}

/**
 * 获取订单详情
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderDetail(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/detail/${orderId}`,
    method: 'get',
  })
}

/**
 * 取消订单
 * @param {number} orderId - 订单ID
 * @param {string} [reason] - 取消原因
 * @returns {Promise}
 */
export function cancelOrder(orderId, reason) {
  return request({
    url: `${config.API_BASE_URL}/app/order/cancel/${orderId}`,
    method: 'put',
    data: {
      reason,
    },
  })
}

/**
 * 确认收货
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function confirmReceipt(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/confirm/${orderId}`,
    method: 'put',
  })
}

/**
 * 提醒发货
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function remindShip(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/remind/${orderId}`,
    method: 'post',
  })
}

/**
 * 获取订单状态统计
 * @returns {Promise}
 */
export function getOrderStatusStats() {
  return request({
    url: `${config.API_BASE_URL}/app/order/status/stats`,
    method: 'get',
  })
}

/**
 * 立即购买
 * @param {Object} params - 购买参数
 * @param {number} params.productId - 商品ID
 * @param {number} [params.skuId] - SKU ID
 * @param {number} params.quantity - 数量
 * @param {number} params.addressId - 地址ID
 * @param {number} params.deliveryId - 配送方式ID
 * @param {number} [params.couponId] - 优惠券ID
 * @param {string} [params.remark] - 订单备注
 * @returns {Promise}
 */
export function buyNow(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/buy-now`,
    method: 'post',
    data: params,
  })
}

/**
 * 预创建订单（锁定库存）
 * @param {Object} params - 订单参数
 * @param {Array} params.items - 订单商品列表
 * @param {number} params.addressId - 地址ID
 * @param {number} params.deliveryId - 配送方式ID
 * @param {number} [params.couponId] - 优惠券ID
 * @param {string} [params.remark] - 订单备注
 * @returns {Promise}
 */
export function preCreateOrder(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/pre-create`,
    method: 'post',
    data: params,
  })
}

/**
 * 提交订单
 * @param {Object} params - 订单参数
 * @param {number} params.preOrderId - 预订单ID
 * @param {number} params.paymentMethodId - 支付方式ID
 * @returns {Promise}
 */
export function submitOrder(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/submit`,
    method: 'post',
    data: params,
  })
}

/**
 * 取消预订单（解锁库存）
 * @param {number} preOrderId - 预订单ID
 * @returns {Promise}
 */
export function cancelPreOrder(preOrderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/pre-cancel/${preOrderId}`,
    method: 'put',
  })
}

/**
 * 查询预订单状态
 * @param {number} preOrderId - 预订单ID
 * @returns {Promise}
 */
export function getPreOrderStatus(preOrderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/pre-status/${preOrderId}`,
    method: 'get',
  })
}

/**
 * 获取物流信息
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderLogistics(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/logistics/${orderId}`,
    method: 'get',
  })
}

/**
 * 删除订单
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function deleteOrder(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/delete/${orderId}`,
    method: 'delete',
  })
}

/**
 * 获取发票信息
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function getInvoiceInfo(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/invoice/${orderId}`,
    method: 'get',
  })
}

/**
 * 申请发票
 * @param {Object} params - 发票参数
 * @param {number} params.orderId - 订单ID
 * @param {string} params.type - 发票类型
 * @param {string} params.title - 发票抬头
 * @param {string} [params.taxNumber] - 税号
 * @param {string} [params.email] - 邮箱
 * @returns {Promise}
 */
export function applyInvoice(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/invoice/apply`,
    method: 'post',
    data: params,
  })
}

/**
 * 获取订单操作日志
 * @param {number} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderLogs(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/order/logs/${orderId}`,
    method: 'get',
  })
}

/**
 * 获取订单统计数据
 * @param {Object} params - 查询参数
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {string} [params.status] - 订单状态
 * @returns {Promise}
 */
export function getOrderStats(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/stats`,
    method: 'get',
    params,
  })
}

/**
 * 处理异常订单
 * @param {number} orderId - 订单ID
 * @param {string} type - 处理类型：cancel（取消）、refund（退款）、retry（重试）
 * @param {string} [reason] - 处理原因
 * @returns {Promise}
 */
export function handleExceptionOrder(orderId, type, reason) {
  return request({
    url: `${config.API_BASE_URL}/app/order/exception/handle`,
    method: 'post',
    data: {
      orderId,
      type,
      reason,
    },
  })
}

/**
 * 获取异常订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise}
 */
export function getExceptionOrders(params) {
  return request({
    url: `${config.API_BASE_URL}/app/order/exception/list`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    },
  })
}
