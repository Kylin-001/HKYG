import request from '@/utils/request'
import config from '@/config/environment'

/**
 * 获取可用支付方式列表
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getAvailablePaymentMethods(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/methods/${orderId}`,
    method: 'get',
  })
}

/**
 * 创建支付订单
 * @param {Object} data - 支付订单数据
 * @param {string} data.orderId - 订单ID
 * @param {string} data.paymentMethod - 支付方式 (WECHAT_PAY, ALIPAY, BALANCE)
 * @param {number} data.amount - 支付金额
 * @param {string} [data.password] - 支付密码（余额支付时需要）
 * @returns {Promise}
 */
export function createPayment(data) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/create`,
    method: 'post',
    data: {
      orderId: data.orderId,
      paymentMethod: data.paymentMethod,
      amount: data.amount,
      password: data.password,
    },
  })
}

/**
 * 轮询支付结果
 * @param {string} orderId - 订单ID
 * @param {number} [interval=3000] - 轮询间隔（毫秒）
 * @param {number} [maxRetries=20] - 最大重试次数
 * @returns {Promise}
 */
export function pollPaymentResult(orderId, interval = 3000, maxRetries = 20) {
  let retryCount = 0

  return new Promise((resolve, reject) => {
    const checkPayment = () => {
      getPaymentStatus(orderId)
        .then(res => {
          if (res.data.status === 'SUCCESS') {
            resolve(res.data)
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

/**
 * 查询支付状态
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getPaymentStatus(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/status/${orderId}`,
    method: 'get',
  })
}

/**
 * 生成微信支付二维码
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function createWechatPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/wechat/create/${orderId}`,
    method: 'post',
  })
}

/**
 * 生成支付宝支付二维码
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function createAlipayPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/alipay/create/${orderId}`,
    method: 'post',
  })
}

/**
 * 余额支付
 * @param {string} orderId - 订单ID
 * @param {string} password - 支付密码
 * @returns {Promise}
 */
export function balancePayment(orderId, password) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/balance/${orderId}`,
    method: 'post',
    data: {
      password,
    },
  })
}

/**
 * 获取支付记录列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.startTime] - 开始时间
 * @param {string} [params.endTime] - 结束时间
 * @returns {Promise}
 */
export function getPaymentRecords(params) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/records`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      startTime: params.startTime,
      endTime: params.endTime,
    },
  })
}

/**
 * 获取支付记录详情
 * @param {string} recordId - 支付记录ID
 * @returns {Promise}
 */
export function getPaymentRecordDetail(recordId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/record/${recordId}`,
    method: 'get',
  })
}

/**
 * 处理支付回调
 * @param {Object} params - 回调参数
 * @returns {Promise}
 */
export function handlePaymentCallback(params) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/callback`,
    method: 'post',
    params,
  })
}

/**
 * 取消支付
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function cancelPayment(orderId) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/cancel/${orderId}`,
    method: 'post',
  })
}

/**
 * 验证支付密码
 * @param {string} password - 支付密码
 * @returns {Promise}
 */
export function verifyPaymentPassword(password) {
  return request({
    url: `${config.API_BASE_URL}/app/payment/verify-password`,
    method: 'post',
    data: {
      password,
    },
  })
}
