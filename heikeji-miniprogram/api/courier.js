// 快递代取相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取快递柜列表
 */
const getLockerList = (params = {}) => {
  return get('/courier/lockers', params);
};

/**
 * 获取快递柜详情
 */
const getLockerDetail = (id) => {
  return get(`/courier/lockers/${id}`);
};

/**
 * 发布快递代取任务
 */
const createCourierTask = (taskData) => {
  return post('/courier/tasks', taskData);
};

/**
 * 获取快递代取任务列表
 */
const getCourierTaskList = (params = {}) => {
  return get('/courier/tasks', params);
};

/**
 * 获取快递代取任务详情
 */
const getCourierTaskDetail = (id) => {
  return get(`/courier/tasks/${id}`);
};

/**
 * 取消快递代取任务
 */
const cancelCourierTask = (id) => {
  return put(`/courier/tasks/${id}/cancel`);
};

/**
 * 接单
 */
const claimCourierTask = (id) => {
  return put(`/courier/tasks/${id}/claim`);
};

/**
 * 放弃任务
 */
const abandonCourierTask = (id) => {
  return put(`/courier/tasks/${id}/abandon`);
};

/**
 * 完成任务
 */
const completeCourierTask = (id) => {
  return put(`/courier/tasks/${id}/complete`);
};

/**
 * 确认完成（发布者确认）
 */
const confirmCourierTask = (id) => {
  return put(`/courier/tasks/${id}/confirm`);
};

/**
 * 评价任务
 */
const rateCourierTask = (id, ratingData) => {
  return post(`/courier/tasks/${id}/rate`, ratingData);
};

/**
 * 获取我的发布任务
 */
const getMyPublishedCourierTasks = (params = {}) => {
  return get('/courier/my/published', params);
};

/**
 * 获取我的接单任务
 */
const getMyClaimedCourierTasks = (params = {}) => {
  return get('/courier/my/claimed', params);
};

/**
 * 获取快递信息（通过单号查询）
 */
const getExpressInfo = (trackingNumber, expressCompany) => {
  return get('/courier/express/info', { trackingNumber, expressCompany });
};

/**
 * 获取快递公司列表
 */
const getExpressCompanies = () => {
  return get('/courier/express/companies');
};

/**
 * 录入快递信息
 */
const inputExpressInfo = (expressData) => {
  return post('/courier/express/input', expressData);
};

/**
 * 获取快递录入记录
 */
const getExpressRecords = (params = {}) => {
  return get('/courier/express/records', params);
};

module.exports = {
  getLockerList,
  getLockerDetail,
  createCourierTask,
  getCourierTaskList,
  getCourierTaskDetail,
  cancelCourierTask,
  claimCourierTask,
  abandonCourierTask,
  completeCourierTask,
  confirmCourierTask,
  rateCourierTask,
  getMyPublishedCourierTasks,
  getMyClaimedCourierTasks,
  getExpressInfo,
  getExpressCompanies,
  inputExpressInfo,
  getExpressRecords
};