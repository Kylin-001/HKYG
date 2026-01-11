// 校园活动相关API
import request from '../utils/request';

/**
 * 获取活动分类列表
 * @returns {Promise} 分类列表
 */
export function getActivityCategories() {
  return request({
    url: '/activity/categories',
    method: 'GET'
  });
}

/**
 * 获取活动列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {number} [params.categoryId] - 分类ID
 * @param {string} [params.status] - 活动状态 (upcoming, ongoing, ended)
 * @param {string} [params.sort] - 排序方式 (hot, time, participants)
 * @returns {Promise} 活动列表
 */
export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'GET',
    data: params
  });
}

/**
 * 获取活动详情
 * @param {string} id - 活动ID
 * @returns {Promise} 活动详情
 */
export function getActivityDetail(id) {
  return request({
    url: `/activity/detail/${id}`,
    method: 'GET'
  });
}

/**
 * 报名参加活动
 * @param {string} id - 活动ID
 * @param {Object} [data] - 报名信息
 * @returns {Promise} 报名结果
 */
export function joinActivity(id, data) {
  return request({
    url: `/activity/join/${id}`,
    method: 'POST',
    data: data || {}
  });
}

/**
 * 取消活动报名
 * @param {string} id - 活动ID
 * @returns {Promise} 取消结果
 */
export function cancelJoinActivity(id) {
  return request({
    url: `/activity/cancel/${id}`,
    method: 'POST'
  });
}

/**
 * 获取用户参与的活动列表
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 用户活动列表
 */
export function getUserActivities(userId, params) {
  return request({
    url: `/activity/user/${userId}`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取活动参与者列表
 * @param {string} id - 活动ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 参与者列表
 */
export function getActivityParticipants(id, params) {
  return request({
    url: `/activity/participants/${id}`,
    method: 'GET',
    data: params
  });
}

/**
 * 收藏/取消收藏活动
 * @param {string} id - 活动ID
 * @returns {Promise} 操作结果
 */
export function toggleActivityFavorite(id) {
  return request({
    url: `/activity/favorite/${id}`,
    method: 'POST'
  });
}

/**
 * 获取用户收藏的活动列表
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 用户收藏活动列表
 */
export function getUserFavoriteActivities(userId, params) {
  return request({
    url: `/activity/user/favorites/${userId}`,
    method: 'GET',
    data: params
  });
}

/**
 * 活动签到
 * @param {string} id - 活动ID
 * @param {Object} [data] - 签到信息
 * @returns {Promise} 签到结果
 */
export function signActivity(id, data) {
  return request({
    url: `/activity/sign/${id}`,
    method: 'POST',
    data: data || {}
  });
}

/**
 * 获取活动评论列表
 * @param {string} id - 活动ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 评论列表
 */
export function getActivityComments(id, params) {
  return request({
    url: `/activity/comments/${id}`,
    method: 'GET',
    data: params
  });
}

/**
 * 发布活动评论
 * @param {string} id - 活动ID
 * @param {Object} data - 评论数据
 * @param {string} data.content - 评论内容
 * @param {number} [data.rating] - 评分 (1-5)
 * @returns {Promise} 评论结果
 */
export function createActivityComment(id, data) {
  return request({
    url: `/activity/comments/${id}`,
    method: 'POST',
    data: data
  });
}

/**
 * 搜索活动
 * @param {string} keyword - 搜索关键词
 * @param {Object} params - 查询参数
 * @returns {Promise} 搜索结果
 */
export function searchActivities(keyword, params) {
  return request({
    url: `/activity/search?keyword=${encodeURIComponent(keyword)}`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取热门活动
 * @param {Object} params - 查询参数
 * @returns {Promise} 热门活动列表
 */
export function getHotActivities(params) {
  return request({
    url: '/activity/hot',
    method: 'GET',
    data: params
  });
}

/**
 * 获取活动统计数据
 * @param {string} id - 活动ID
 * @returns {Promise} 统计数据
 */
export function getActivityStatistics(id) {
  return request({
    url: `/activity/statistics/${id}`,
    method: 'GET'
  });
}

/**
 * 创建活动 (仅管理员)
 * @param {Object} data - 活动数据
 * @returns {Promise} 创建结果
 */
export function createActivity(data) {
  return request({
    url: '/activity/create',
    method: 'POST',
    data: data
  });
}

/**
 * 更新活动 (仅管理员)
 * @param {string} id - 活动ID
 * @param {Object} data - 活动数据
 * @returns {Promise} 更新结果
 */
export function updateActivity(id, data) {
  return request({
    url: `/activity/update/${id}`,
    method: 'PUT',
    data: data
  });
}

/**
 * 删除活动 (仅管理员)
 * @param {string} id - 活动ID
 * @returns {Promise} 删除结果
 */
export function deleteActivity(id) {
  return request({
    url: `/activity/delete/${id}`,
    method: 'DELETE'
  });
}
