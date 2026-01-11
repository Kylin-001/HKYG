// 校园服务相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取校园公告列表
 */
const getAnnouncementList = (params = {}) => {
  return get('/campus/announcements', params);
};

/**
 * 获取校园公告详情
 */
const getAnnouncementDetail = (params) => {
  const { id } = params;
  return get(`/campus/announcements/${id}`);
};

/**
 * 获取空教室列表
 */
const getEmptyClassrooms = (params = {}) => {
  return get('/campus/classrooms/empty', params);
};

/**
 * 获取教室信息
 */
const getClassroomInfo = (params) => {
  const { id } = params;
  return get(`/campus/classrooms/${id}`);
};

/**
 * 获取教室详情（兼容getClassroomInfo）
 */
const getClassroomDetail = getClassroomInfo;

/**
 * 获取教室使用情况
 */
const getClassroomSchedule = (params = {}) => {
  return get('/campus/classrooms/schedule', params);
};

/**
 * 获取校园地图信息
 */
const getCampusMap = () => {
  return get('/campus/map');
};

/**
 * 获取校园服务列表
 */
const getCampusServices = () => {
  return get('/campus/services');
};

/**
 * 获取校园服务详情
 */
const getCampusServiceDetail = (id) => {
  return get(`/campus/services/${id}`);
};

/**
 * 获取校园活动列表
 */
const getCampusActivities = (params = {}) => {
  return get('/campus/activities', params);
};

/**
 * 获取校园活动详情
 */
const getCampusActivityDetail = (id) => {
  return get(`/campus/activities/${id}`);
};

/**
 * 获取宿舍报修列表
 */
const getDormRepairs = (params = {}) => {
  return get('/campus/dorm/repairs', params);
};

/**
 * 获取宿舍报修详情
 */
const getDormRepairDetail = (params) => {
  const { id } = params;
  return get(`/campus/dorm/repairs/${id}`);
};

/**
 * 提交宿舍报修
 */
const submitDormRepair = (data) => {
  return post('/campus/dorm/repairs', data);
};

/**
 * 获取宿舍公告列表
 */
const getDormAnnouncements = (params = {}) => {
  return get('/campus/dorm/announcements', params);
};

/**
 * 获取宿舍公告详情
 */
const getDormAnnouncementDetail = (params) => {
  const { id } = params;
  return get(`/campus/dorm/announcements/${id}`);
};

/**
 * 获取宿舍电费查询
 */
const getDormElectricityBill = (params = {}) => {
  return get('/campus/dorm/electricity', params);
};

/**
 * 获取宿舍水费查询
 */
const getDormWaterBill = (params = {}) => {
  return get('/campus/dorm/water', params);
};

/**
 * 获取洗衣机使用情况
 */
const getWashingMachineStatus = (params = {}) => {
  return get('/campus/dorm/washing-machines', params);
};

/**
 * 获取图书馆座位列表
 */
const getLibrarySeats = (params = {}) => {
  return get('/campus/library/seats', params);
};

/**
 * 获取图书馆座位统计
 */
const getSeatStats = () => {
  return get('/campus/library/seats/stats');
};

/**
 * 预约图书馆座位
 */
const reserveLibrarySeat = (data) => {
  return post('/campus/library/seats/reserve', data);
};

/**
 * 获取最近借阅记录
 */
const getRecentBorrows = (params = {}) => {
  return get('/campus/library/borrows/recent', params);
};

/**
 * 获取图书馆公告
 */
const getLibraryAnnouncements = (params = {}) => {
  return get('/campus-status/library/library/announcements', params);
};

/**
 * 搜索图书
 */
const searchBooks = (params = {}) => {
  return get('/campus-status/library/library/books/search', params);
};

/**
 * 获取图书详情
 */
const getBookDetail = (params) => {
  const { id } = params;
  return get(`/campus-status-status/library/books/${id}`);
};

module.exports = {
  getAnnouncementList,
  getAnnouncementDetail,
  getEmptyClassrooms,
  getClassroomInfo,
  getClassroomDetail,
  getClassroomSchedule,
  getCampusMap,
  getCampusServices,
  getCampusServiceDetail,
  getCampusActivities,
  getCampusActivityDetail,
  getDormRepairs,
  getDormRepairDetail,
  submitDormRepair,
  getDormAnnouncements,
  getDormAnnouncementDetail,
  getDormElectricityBill,
  getDormWaterBill,
  getWashingMachineStatus,
  getLibrarySeats,
  getSeatStats,
  reserveLibrarySeat,
  getRecentBorrows,
  getLibraryAnnouncements,
  searchBooks,
  getBookDetail
};
