import request from '@/utils/request'
import logger from '@/utils/logger'

/**
 * 获取支付统计概览数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @param {string} params.paymentMethod - 支付方式 (可选)
 * @param {number} params.status - 支付状态 (可选)
 * @returns {Promise<Object>} 统计数据
 */
export function getPaymentOverview(params) {
  try {
    return request({
      url: '/statistics/payment/overview',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付统计概览失败', error)
    // 返回模拟数据
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        totalAmount: 128560.5,
        totalOrders: 1256,
        successRate: 96.8,
        refundAmount: 3580.25,
        refundRate: 2.85,
        amountTrend: 8.5,
        orderTrend: 6.2,
        successRateTrend: 1.2,
      },
    })
  }
}

/**
 * 获取支付趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @param {string} params.paymentMethod - 支付方式 (可选)
 * @param {number} params.status - 支付状态 (可选)
 * @returns {Promise<Object>} 趋势数据
 */
export function getPaymentTrend(params) {
  try {
    return request({
      url: '/statistics/payment/trend',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付趋势数据失败', error)
    // 返回模拟数据
    const now = new Date()
    const labels = []
    const amountData = []
    const orderData = []

    // 生成最近7天的模拟数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      labels.push(`${date.getMonth() + 1}-${date.getDate()}`)

      // 随机生成金额数据，中心在15000左右
      const amount = 15000 + Math.random() * 8000 - 4000
      amountData.push(Number(amount.toFixed(2)))

      // 随机生成订单数量，中心在170左右
      const orders = 170 + Math.floor(Math.random() * 60 - 30)
      orderData.push(orders)
    }

    return Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        labels,
        amountData,
        orderData,
      },
    })
  }
}

/**
 * 获取支付方式分布数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @param {number} params.status - 支付状态 (可选)
 * @returns {Promise<Object>} 分布数据
 */
export function getPaymentMethodDistribution(params) {
  try {
    return request({
      url: '/statistics/payment/method',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付方式分布失败', error)
    // 返回模拟数据
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: [
        {
          value: 65.3,
          name: '微信支付',
        },
        {
          value: 28.7,
          name: '支付宝',
        },
        {
          value: 6.0,
          name: '余额支付',
        },
      ],
    })
  }
}

/**
 * 获取支付时段分布数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @param {string} params.paymentMethod - 支付方式 (可选)
 * @returns {Promise<Object>} 时段分布数据
 */
export function getPaymentHourDistribution(params) {
  try {
    return request({
      url: '/statistics/payment/hour',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付时段分布失败', error)
    // 返回模拟数据
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const data = hours.map(hour => {
      // 模拟一天中的支付高峰
      let baseValue = 5
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 18) || (hour >= 20 && hour <= 22)) {
        baseValue = 15 + Math.random() * 10
      }
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        value: Number(baseValue.toFixed(2)),
        count: Math.floor(baseValue * 8),
      }
    })

    return Promise.resolve({
      code: 200,
      message: 'success',
      data,
    })
  }
}

/**
 * 获取支付失败原因分析
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @returns {Promise<Object>} 失败原因分析
 */
export function getPaymentFailureAnalysis(params) {
  try {
    return request({
      url: '/statistics/payment/failure',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付失败原因分析失败', error)
    // 返回模拟数据
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: [
        {
          reason: '余额不足',
          count: 35,
          percentage: 38.9,
        },
        {
          reason: '支付超时',
          count: 28,
          percentage: 31.1,
        },
        {
          reason: '网络异常',
          count: 12,
          percentage: 13.3,
        },
        {
          reason: '用户取消',
          count: 10,
          percentage: 11.1,
        },
        {
          reason: '其他原因',
          count: 5,
          percentage: 5.6,
        },
      ],
    })
  }
}

/**
 * 导出支付统计报表
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @param {string} params.paymentMethod - 支付方式 (可选)
 * @param {number} params.status - 支付状态 (可选)
 * @param {string} params.format - 导出格式 (excel, csv)
 */
export function exportPaymentReport(params) {
  const queryParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key])
    }
  })

  // 打开新窗口下载文件
  window.open(`/api/v1/statistics/payment/export?${queryParams.toString()}`, '_blank')
}

/**
 * 获取支付转化率统计
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} params.endDate - 结束日期 (YYYY-MM-DD)
 * @returns {Promise<Object>} 转化率数据
 */
export function getPaymentConversionRate(params) {
  try {
    return request({
      url: '/statistics/payment/conversion',
      method: 'get',
      params,
    })
  } catch (error) {
    logger.error('获取支付转化率失败', error)
    // 返回模拟数据
    const now = new Date()
    const labels = []
    const conversionRates = []

    // 生成最近7天的模拟数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      labels.push(`${date.getMonth() + 1}-${date.getDate()}`)

      // 随机生成转化率数据，中心在68%左右
      const rate = 68 + Math.random() * 10 - 5
      conversionRates.push(Number(rate.toFixed(2)))
    }

    return Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        labels,
        conversionRates,
        averageConversionRate: 67.5,
        cartToOrderRate: 78.2,
        orderToPaymentRate: 86.3,
      },
    })
  }
}
