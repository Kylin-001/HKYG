// 校园跑腿相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取跑腿任务列表
 */
const getTaskList = (params = {}) => {
  return get('/errand/tasks', params);
};

/**
 * 获取跑腿任务详情
 */
const getTaskDetail = (id) => {
  return get(`/errand/tasks/${id}`);
};

/**
 * 发布跑腿任务
 */
const createTask = (taskData) => {
  return post('/errand/tasks', taskData);
};

/**
 * 取消跑腿任务
 */
const cancelTask = (id) => {
  return put(`/errand/tasks/${id}/cancel`);
};

/**
 * 接单
 */
const claimTask = (id) => {
  return put(`/errand/tasks/${id}/claim`);
};

/**
 * 放弃任务
 */
const abandonTask = (id) => {
  return put(`/errand/tasks/${id}/abandon`);
};

/**
 * 完成任务
 */
const completeTask = (id) => {
  return put(`/errand/tasks/${id}/complete`);
};

/**
 * 确认完成（发布者确认）
 */
const confirmComplete = (id) => {
  return put(`/errand/tasks/${id}/confirm`);
};

/**
 * 评价任务
 */
const rateTask = (id, ratingData) => {
  return post(`/errand/tasks/${id}/rate`, ratingData);
};

/**
 * 获取我的发布任务
 */
const getMyPublishedTasks = (params = {}) => {
  return get('/errand/my/published', params);
};

/**
 * 获取我的接单任务
 */
const getMyClaimedTasks = (params = {}) => {
  return get('/errand/my/claimed', params);
};

/**
 * 成为跑腿员
 */
const becomeRunner = (runnerData) => {
  return post('/errand/runner/apply', runnerData);
};

/**
 * 获取跑腿员信息
 */
const getRunnerInfo = () => {
  return get('/errand/runner/info');
};

/**
 * 获取跑腿员任务列表（抢单模式）
 */
const getRunnerTaskList = (params = {}) => {
  return get('/errand/runner/tasks', params);
};

module.exports = {
  getTaskList,
  getTaskDetail,
  createTask,
  cancelTask,
  claimTask,
  abandonTask,
  completeTask,
  confirmComplete,
  rateTask,
  getMyPublishedTasks,
  getMyClaimedTasks,
  becomeRunner,
  getRunnerInfo,
  getRunnerTaskList
};