// 消息推送相关API
const { request, get, post, put, delete: del } = require('../utils/request');

/**
 * 获取消息列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.type - 消息类型
 * @param {string} params.status - 消息状态
 * @returns {Promise} 消息列表
 */
const getMessageList = (params = {}) => {
  return get('/message/list', params);
};

/**
 * 获取消息详情
 * @param {string} id - 消息ID
 * @returns {Promise} 消息详情
 */
const getMessageDetail = (id) => {
  return get(`/message/detail/${id}`);
};

/**
 * 标记消息为已读
 * @param {string} id - 消息ID
 * @returns {Promise} 操作结果
 */
const markMessageAsRead = (id) => {
  return put(`/message/read/${id}`);
};

/**
 * 标记所有消息为已读
 * @returns {Promise} 操作结果
 */
const markAllMessagesAsRead = () => {
  return put('/message/read/all');
};

/**
 * 删除消息
 * @param {string} id - 消息ID
 * @returns {Promise} 操作结果
 */
const deleteMessage = (id) => {
  return del(`/message/delete/${id}`);
};

/**
 * 清空消息列表
 * @returns {Promise} 操作结果
 */
const clearMessages = () => {
  return del('/message/clear');
};

/**
 * 获取未读消息数量
 * @returns {Promise} 未读消息数量
 */
const getUnreadMessageCount = () => {
  return get('/message/unread-count');
};

/**
 * 订阅消息
 * @param {Array} tmplIds - 模板ID列表
 * @returns {Promise} 订阅结果
 */
const subscribeMessage = (tmplIds) => {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 发送自定义消息
 * @param {Object} messageData - 消息数据
 * @returns {Promise} 发送结果
 */
const sendCustomMessage = (messageData) => {
  return post('/message/send', messageData);
};

module.exports = {
  getMessageList,
  getMessageDetail,
  markMessageAsRead,
  markAllMessagesAsRead,
  deleteMessage,
  clearMessages,
  getUnreadMessageCount,
  subscribeMessage,
  sendCustomMessage
};
