import request from '@/utils/request'
import logger from '@/utils/logger'
import config from '@/config/environment'

// 支付方式相关API
// 获取支持的支付方式列表
export function getPaymentMethods(orderType) {
  return request({
    url: `${config.API_BASE_URL}/payment/methods`,
    method: 'get',
    params: orderType ? { orderType } : {},
  })
}

// 查询指定订单可用的支付方式
export function getAvailablePaymentMethods(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/order/${orderId}/methods`,
    method: 'get',
  })
}

// 支付配置相关API
// 获取支付配置信息
export function getPaymentConfig() {
  return request({
    url: `${config.API_BASE_URL}/payment/config`,
    method: 'get',
  })
}

// 微信支付相关API
// 生成微信支付参数
export function createWechatPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/wechat/create/${orderId}`,
    method: 'post',
  })
}

// 微信支付查询
export function queryWechatPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/wechat/query/${orderId}`,
    method: 'get',
  })
}

// 支付宝支付相关API
// 生成支付宝支付参数
export function createAlipayPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/alipay/create/${orderId}`,
    method: 'post',
  })
}

// 支付宝支付查询
export function queryAlipayPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/alipay/query/${orderId}`,
    method: 'get',
  })
}

// 余额支付相关API
// 余额支付
export function balancePayment(orderId, password) {
  return request({
    url: `${config.API_BASE_URL}/payment/balance/${orderId}`,
    method: 'post',
    data: { password },
  })
}

// 验证余额支付密码
export function verifyBalancePassword(password) {
  return request({
    url: `${config.API_BASE_URL}/payment/balance/verify`,
    method: 'post',
    data: { password },
  })
}

// 支付记录相关API
// 获取支付记录列表
export function getPaymentRecords(params) {
  return request({
    url: `${config.API_BASE_URL}/payment/records`,
    method: 'get',
    params,
  })
}

// 获取支付记录详情
export function getPaymentDetail(paymentId) {
  return request({
    url: `${config.API_BASE_URL}/payment/detail/${paymentId}`,
    method: 'get',
  })
}

// 支付退款相关API
// 申请退款
export function applyRefund(orderId, params) {
  return request({
    url: `${config.API_BASE_URL}/payment/refund/apply/${orderId}`,
    method: 'post',
    data: params,
  })
}

// 查询退款状态
export function queryRefundStatus(refundId) {
  return request({
    url: `${config.API_BASE_URL}/payment/refund/status/${refundId}`,
    method: 'get',
  })
}

// 批量查询支付状态
export function batchQueryPaymentStatus(orderIds) {
  return request({
    url: `${config.API_BASE_URL}/payment/batch/status`,
    method: 'post',
    data: { orderIds },
  })
}

// 支付超时检查
export function checkPaymentTimeout(orderId) {
  return request({
    url: `${config.API_BASE_URL}/payment/checkTimeout/${orderId}`,
    method: 'get',
  })
}

// 获取支付二维码（用于扫码支付）
export function getPaymentQrcode(orderId, paymentMethod) {
  return request({
    url: `${config.API_BASE_URL}/payment/qrcode/${orderId}`,
    method: 'get',
    params: { paymentMethod },
  })
}

// 轮询支付结果
export function pollPaymentResult(orderId, interval = 3000, maxRetries = 20) {
  let retryCount = 0

  return new Promise((resolve, reject) => {
    const checkPayment = () => {
      getPaymentStatus(orderId)
        .then(res => {
          if (res.status === 'SUCCESS') {
            resolve(res)
          } else if (retryCount >= maxRetries) {
            reject(new Error('支付超时，请检查订单状态'))
          } else {
            retryCount++
            setTimeout(checkPayment, interval)
          }
        })
        .catch(error => {
          if (retryCount >= maxRetries) {
            reject(error)
          } else {
            retryCount++
            setTimeout(checkPayment, interval)
          }
        })
    }

    checkPayment()
  })
}

// 通用支付API
/**
 * 创建支付订单
 * @param {Object} data - 支付订单数据
 * @param {string} data.orderId - 订单ID
 * @param {string} data.paymentMethod - 支付方式 (WECHAT_PAY, ALIPAY, BALANCE)
 * @param {number} data.amount - 支付金额
 * @returns {Promise<Object>} 支付信息
 */
export const createPayment = async data => {
  try {
    let response

    // 根据支付方式调用不同的API
    if (data.paymentMethod === 'WECHAT_PAY') {
      response = await createWechatPayment(data.orderId)
    } else if (data.paymentMethod === 'ALIPAY') {
      response = await createAlipayPayment(data.orderId)
    } else if (data.paymentMethod === 'BALANCE') {
      response = await balancePayment(data.orderId, data.password)
    } else {
      // 通用支付创建接口（如果后端支持）
      response = await request({
        url: `${config.API_BASE_URL}/payment/create`,
        method: 'post',
        data,
      })
    }

    return response.data || response
  } catch (error) {
    logger.error('创建支付订单失败', error)
    throw error
  }
}

/**
 * 查询支付状态
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 支付状态信息
 */
export const getPaymentStatus = async orderId => {
  try {
    // 尝试通用支付状态查询接口
    try {
      const response = await request({
        url: `${config.API_BASE_URL}/payment/status/${orderId}`,
        method: 'get',
      })
      return response.data || response
    } catch (e) {
      // 如果通用接口失败，回退到订单模块的支付状态查询
      const { getPaymentStatus: orderPaymentStatus } = await import('./order')
      return orderPaymentStatus(orderId)
    }
  } catch (error) {
    logger.error('查询支付状态失败', error)
    throw error
  }
}

/**
 * 余额支付
 * @param {Object} data - 余额支付数据
 * @param {string} data.orderId - 订单ID
 * @param {number} data.amount - 支付金额
 * @param {string} [data.password] - 支付密码（可选）
 * @returns {Promise<Object>} 支付结果
 */
export const balancePay = async data => {
  try {
    const response = await balancePayment(data.orderId, data.password)
    return response.data || response
  } catch (error) {
    logger.error('余额支付失败', error)
    throw error
  }
}
