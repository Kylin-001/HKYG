// 消息列表页面逻辑
const messageApi = require('../../api/message');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 消息分类列表
    categories: [
      { id: 'all', name: '全部' },
      { id: 'system', name: '系统通知' },
      { id: 'order', name: '订单消息' },
      { id: 'service', name: '服务消息' },
      { id: 'activity', name: '活动消息' }
    ],
    // 当前选中的分类
    currentCategory: 'all',
    // 消息列表数据
    messageList: [],
    // 加载状态
    loading: false,
    // 是否还有更多数据
    hasMore: true,
    // 当前页码
    page: 1,
    // 每页条数
    pageSize: 10,
    // 空状态显示
    isEmpty: false,
    // 是否显示清空确认弹窗
    showClearConfirm: false,
    // 未读消息数量
    unreadCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化消息列表
    this.initMessageList();
    // 获取未读消息数量
    this.getUnreadCount();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新消息列表
    this.initMessageList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏时保存当前状态
  },

  /**
   * 初始化消息列表
   */
  initMessageList: function () {
    this.setData({
      messageList: [],
      page: 1,
      hasMore: true,
      loading: true,
      isEmpty: false
    });
    this.getMessageList();
  },

  /**
   * 获取消息列表
   */
  getMessageList: function () {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      type: this.data.currentCategory === 'all' ? '' : this.data.currentCategory
    };

    messageApi.getMessageList(params)
      .then(res => {
        const newList = res.data || [];
        const messageList = [...this.data.messageList, ...newList];
        
        this.setData({
          messageList: messageList,
          hasMore: newList.length === this.data.pageSize,
          page: this.data.page + 1,
          loading: false,
          isEmpty: messageList.length === 0
        });
      })
      .catch(err => {
        console.error('获取消息列表失败:', err);
        this.setData({
          loading: false,
          isEmpty: true
        });
        wx.showToast({
          title: '获取消息失败',
          icon: 'none'
        });
      });
  },

  /**
   * 获取未读消息数量
   */
  getUnreadCount: function () {
    messageApi.getUnreadMessageCount()
      .then(res => {
        this.setData({
          unreadCount: res.data || 0
        });
      })
      .catch(err => {
        console.error('获取未读消息数量失败:', err);
      });
  },

  /**
   * 切换消息分类
   */
  onCategoryChange: function (e) {
    const categoryId = e.currentTarget.dataset.id;
    if (categoryId === this.data.currentCategory) return;

    this.setData({
      currentCategory: categoryId
    });
    this.initMessageList();
  },

  /**
   * 查看消息详情
   */
  viewMessageDetail: function (e) {
    const messageId = e.currentTarget.dataset.id;
    // 跳转到消息详情页
    wx.navigateTo({
      url: `/pages/message/detail?id=${messageId}`
    });
    
    // 标记消息为已读
    this.markMessageAsRead(messageId);
  },

  /**
   * 标记消息为已读
   */
  markMessageAsRead: function (messageId) {
    messageApi.markMessageAsRead(messageId)
      .then(() => {
        // 更新本地消息状态
        const messageList = this.data.messageList.map(item => {
          if (item.id === messageId) {
            return { ...item, status: 'read' };
          }
          return item;
        });
        this.setData({
          messageList: messageList
        });
        // 更新未读消息数量
        this.getUnreadCount();
      })
      .catch(err => {
        console.error('标记消息已读失败:', err);
      });
  },

  /**
   * 标记全部消息为已读
   */
  markAllAsRead: function () {
    wx.showLoading({
      title: '处理中...'
    });
    
    messageApi.markAllMessagesAsRead()
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '全部消息已标记为已读'
        });
        // 更新本地消息状态
        const messageList = this.data.messageList.map(item => ({
          ...item,
          status: 'read'
        }));
        this.setData({
          messageList: messageList
        });
        // 更新未读消息数量
        this.getUnreadCount();
      })
      .catch(err => {
        wx.hideLoading();
        console.error('标记全部消息已读失败:', err);
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
  },

  /**
   * 显示清空确认弹窗
   */
  showClearConfirm: function () {
    this.setData({
      showClearConfirm: true
    });
  },

  /**
   * 关闭清空确认弹窗
   */
  closeClearConfirm: function () {
    this.setData({
      showClearConfirm: false
    });
  },

  /**
   * 确认清空消息
   */
  confirmClearMessages: function () {
    wx.showLoading({
      title: '处理中...'
    });
    
    messageApi.clearMessages()
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '消息已清空'
        });
        // 关闭弹窗
        this.closeClearConfirm();
        // 重新初始化消息列表
        this.initMessageList();
        // 更新未读消息数量
        this.getUnreadCount();
      })
      .catch(err => {
        wx.hideLoading();
        console.error('清空消息失败:', err);
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
  },

  /**
   * 删除单条消息
   */
  deleteMessage: function (e) {
    const messageId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这条消息吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中...'
          });
          
          messageApi.deleteMessage(messageId)
            .then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '消息已删除'
              });
              // 更新消息列表
              const messageList = this.data.messageList.filter(item => item.id !== messageId);
              this.setData({
                messageList: messageList,
                isEmpty: messageList.length === 0
              });
              // 更新未读消息数量
              this.getUnreadCount();
            })
            .catch(err => {
              wx.hideLoading();
              console.error('删除消息失败:', err);
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              });
            });
        }
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMessageList();
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    // 重新初始化消息列表
    this.initMessageList();
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '黑科易购-消息中心',
      path: '/pages/message/index'
    };
  }
});
