// 商家相关API
import request from '../utils/request';

/**
 * 获取商家列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getMerchantList(params) {
  return request({
    url: '/merchant/list',
    method: 'GET',
    data: params
  });
}

/**
 * 获取商家详情
 * @param {string} id - 商家ID
 * @returns {Promise}
 */
export function getMerchantDetail(id) {
  return request({
    url: `/merchant/detail/${id}`,
    method: 'GET'
  });
}

/**
 * 商家入驻申请
 * @param {Object} data - 申请数据
 * @returns {Promise}
 */
export function applyMerchant(data) {
  return request({
    url: '/merchant/apply',
    method: 'POST',
    data: data
  });
}

/**
 * 更新商家信息
 * @param {Object} data - 商家信息
 * @returns {Promise}
 */
export function updateMerchant(data) {
  return request({
    url: '/merchant/update',
    method: 'POST',
    data: data
  });
}

/**
 * 审核商家入驻申请
 * @param {Object} data - 审核数据
 * @returns {Promise}
 */
export function auditMerchant(data) {
  return request({
    url: '/merchant/audit',
    method: 'POST',
    data: data
  });
}

/**
 * 获取商家申请状态
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function getMerchantApplyStatus(userId) {
  return request({
    url: `/merchant/apply/status/${userId}`,
    method: 'GET'
  });
}

/**
 * 获取商家商品列表
 * @param {string} merchantId - 商家ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getMerchantProducts(merchantId, params) {
  return request({
    url: `/merchant/${merchantId}/products`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取商家订单列表
 * @param {string} merchantId - 商家ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getMerchantOrders(merchantId, params) {
  return request({
    url: `/merchant/${merchantId}/orders`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取商家统计数据
 * @param {string} merchantId - 商家ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getMerchantStatistics(merchantId, params) {
  return request({
    url: `/merchant/${merchantId}/statistics`,
    method: 'GET',
    data: params
  });
}

/**
 * 商家登录
 * @param {Object} data - 登录数据
 * @returns {Promise}
 */
export function merchantLogin(data) {
  return request({
    url: '/merchant/login',
    method: 'POST',
    data: data
  });
}

/**
 * 商家退出登录
 * @returns {Promise}
 */
export function merchantLogout() {
  return request({
    url: '/merchant/logout',
    method: 'POST'
  });
}

/**
 * 获取商家认证信息
 * @returns {Promise}
 */
export function getMerchantAuthInfo() {
  return request({
    url: '/merchant/auth/info',
    method: 'GET'
  });
}

/**
 * 提交商家认证信息
 * @param {Object} data - 认证信息
 * @returns {Promise}
 */
export function submitMerchantAuth(data) {
  return request({
    url: '/merchant/auth/submit',
    method: 'POST',
    data: data
  });
}
