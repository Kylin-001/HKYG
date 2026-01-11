// 消息详情页面逻辑
const messageApi = require('../../api/message');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 消息ID
    messageId: '',
    // 消息详情数据
    messageDetail: null,
    // 加载状态
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取消息ID
    const messageId = options.id;
    if (messageId) {
      this.setData({
        messageId: messageId
      });
      // 加载消息详情
      this.getMessageDetail();
    } else {
      wx.showToast({
        title: '消息ID无效',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 如果有消息ID，重新加载消息详情
    if (this.data.messageId) {
      this.getMessageDetail();
    }
  },

  /**
   * 获取消息详情
   */
  getMessageDetail: function () {
    this.setData({ loading: true });
    
    messageApi.getMessageDetail(this.data.messageId)
      .then(res => {
        this.setData({
          messageDetail: res.data,
          loading: false
        });
        
        // 标记消息为已读
        if (res.data.status === 'unread') {
          messageApi.markMessageAsRead(this.data.messageId);
        }
      })
      .catch(err => {
        console.error('获取消息详情失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '获取消息详情失败',
          icon: 'none'
        });
      });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.messageDetail?.title || '黑科易购-消息详情',
      path: '/pages/message/detail?id=' + this.data.messageId
    };
  }
});
