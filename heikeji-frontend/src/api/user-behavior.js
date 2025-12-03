import request from '@/utils/request'

// 用户行为分析相关API

/**
 * 记录用户行为
 * @param {Object} data - 用户行为数据
 * @param {number} data.userId - 用户ID
 * @param {string} data.behaviorType - 行为类型 (browse, purchase, favorite, comment)
 * @param {string} data.behaviorContent - 行为内容 (如商品ID、订单金额等)
 * @returns {Promise<boolean>} - 是否记录成功
 */
export function recordUserBehavior(data) {
  return request({
    url: '/api/user/behavior/record',
    method: 'post',
    data,
  })
}

/**
 * 获取用户统计信息
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @returns {Promise<Object>} - 用户统计信息
 */
export function getUserStatistics(params) {
  return request({
    url: '/api/user/statistics',
    method: 'get',
    params,
  })
}

/**
 * 获取用户行为趋势
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @param {string} params.behaviorType - 行为类型 (可选)
 * @param {number} params.days - 统计天数
 * @returns {Promise<Array>} - 行为趋势数据
 */
export function getUserBehaviorTrend(params) {
  return request({
    url: '/api/user/behavior/trend',
    method: 'get',
    params,
  })
}

/**
 * 获取用户热门商品
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @param {number} params.limit - 返回数量限制
 * @returns {Promise<Array>} - 热门商品列表
 */
export function getUserHotProducts(params) {
  return request({
    url: '/api/user/behavior/hot-products',
    method: 'get',
    params,
  })
}

/**
 * 获取用户活跃度
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @param {number} params.days - 统计天数
 * @returns {Promise<number>} - 活跃度得分 (0-100)
 */
export function getUserActivity(params) {
  return request({
    url: '/api/user/behavior/activity',
    method: 'get',
    params,
  })
}

/**
 * 获取用户偏好
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @returns {Promise<Object>} - 用户偏好信息
 */
export function getUserPreferences(params) {
  return request({
    url: '/api/user/behavior/preferences',
    method: 'get',
    params,
  })
}

/**
 * 获取用户流失风险
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @returns {Promise<Object>} - 流失风险评估
 */
export function getUserChurnRisk(params) {
  return request({
    url: '/api/user/behavior/churn-risk',
    method: 'get',
    params,
  })
}

/**
 * 获取用户群体行为分析
 * @param {Object} params - 查询参数
 * @param {string} params.userGroup - 用户群体标识
 * @param {string} params.behaviorType - 行为类型 (可选)
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @returns {Promise<Object>} - 群体行为分析结果
 */
export function getUserGroupBehaviorAnalysis(params) {
  return request({
    url: '/api/user/behavior/group-analysis',
    method: 'get',
    params,
  })
}

/**
 * 预测用户购买意向
 * @param {Object} params - 查询参数
 * @param {number} params.userId - 用户ID
 * @returns {Promise<Object>} - 购买意向预测结果
 */
export function predictPurchaseIntent(params) {
  return request({
    url: '/api/user/behavior/purchase-intent',
    method: 'get',
    params,
  })
}
