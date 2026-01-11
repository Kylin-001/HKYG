// 团长相关API
import request from '../utils/request';

/**
 * 获取团长列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainList(params) {
  return request({
    url: '/captain/list',
    method: 'GET',
    data: params
  });
}

/**
 * 获取团长详情
 * @param {string} id - 团长ID
 * @returns {Promise}
 */
export function getCaptainDetail(id) {
  return request({
    url: `/captain/detail/${id}`,
    method: 'GET'
  });
}

/**
 * 团长招募申请
 * @param {Object} data - 申请数据
 * @returns {Promise}
 */
export function applyCaptain(data) {
  return request({
    url: '/captain/apply',
    method: 'POST',
    data: data
  });
}

/**
 * 更新团长信息
 * @param {Object} data - 团长信息
 * @returns {Promise}
 */
export function updateCaptain(data) {
  return request({
    url: '/captain/update',
    method: 'POST',
    data: data
  });
}

/**
 * 审核团长招募申请
 * @param {Object} data - 审核数据
 * @returns {Promise}
 */
export function auditCaptain(data) {
  return request({
    url: '/captain/audit',
    method: 'POST',
    data: data
  });
}

/**
 * 获取团长申请状态
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function getCaptainApplyStatus(userId) {
  return request({
    url: `/captain/apply/status/${userId}`,
    method: 'GET'
  });
}

/**
 * 获取团长商品列表
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainProducts(captainId, params) {
  return request({
    url: `/captain/${captainId}/products`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取团长订单列表
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainOrders(captainId, params) {
  return request({
    url: `/captain/${captainId}/orders`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取团长统计数据
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainStatistics(captainId, params) {
  return request({
    url: `/captain/${captainId}/statistics`,
    method: 'GET',
    data: params
  });
}

/**
 * 团长登录
 * @param {Object} data - 登录数据
 * @returns {Promise}
 */
export function captainLogin(data) {
  return request({
    url: '/captain/login',
    method: 'POST',
    data: data
  });
}

/**
 * 团长退出登录
 * @returns {Promise}
 */
export function captainLogout() {
  return request({
    url: '/captain/logout',
    method: 'POST'
  });
}

/**
 * 获取团长佣金记录
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainCommissionRecords(captainId, params) {
  return request({
    url: `/captain/${captainId}/commissions`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取团长团队成员
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainTeamMembers(captainId, params) {
  return request({
    url: `/captain/${captainId}/team`,
    method: 'GET',
    data: params
  });
}

/**
 * 团长佣金提现申请
 * @param {Object} data - 提现数据
 * @returns {Promise}
 */
export function applyCommissionWithdrawal(data) {
  return request({
    url: '/captain/withdraw/apply',
    method: 'POST',
    data: data
  });
}

/**
 * 获取团长提现记录
 * @param {string} captainId - 团长ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCaptainWithdrawalRecords(captainId, params) {
  return request({
    url: `/captain/${captainId}/withdrawals`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取团长招募活动详情
 * @param {string} activityId - 活动ID
 * @returns {Promise}
 */
export function getRecruitmentActivityDetail(activityId) {
  return request({
    url: `/captain/recruitment/activity/${activityId}`,
    method: 'GET'
  });
}

/**
 * 获取团长招募活动列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getRecruitmentActivityList(params) {
  return request({
    url: '/captain/recruitment/activities',
    method: 'GET',
    data: params
  });
}
