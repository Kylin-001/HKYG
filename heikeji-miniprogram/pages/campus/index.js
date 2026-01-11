// 校园服务首页JS
const campusApi = require('../../api/campus');

Page({
  data: {
    announcements: [], // 最新公告
    currentEmptyClassrooms: [], // 当前空教室
    isLoading: false
  },

  onLoad: function (options) {
    // 加载页面数据
    this.loadPageData();
  },

  onShow: function () {
    // 页面显示时，可以选择刷新数据
    this.loadPageData();
  },

  onPullDownRefresh: function () {
    // 下拉刷新
    this.loadPageData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载页面数据
   */
  loadPageData: function () {
    if (this.data.isLoading) {
      return Promise.resolve();
    }

    this.setData({ isLoading: true });

    // 同时加载最新公告和当前空教室
    return Promise.all([
      this.loadLatestAnnouncements(),
      this.loadCurrentEmptyClassrooms()
    ]).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 加载最新公告
   */
  loadLatestAnnouncements: function () {
    return campusApi.getAnnouncementList({
      page: 1,
      pageSize: 5,
      cache: true
    }).then(res => {
      this.setData({
        announcements: res.data || []
      });
    }).catch(err => {
      console.error('加载最新公告失败:', err);
      // 使用模拟数据
      this.setData({
        announcements: [
          { id: 1, title: '关于2024年春季学期开学通知', createTime: '2024-02-15' },
          { id: 2, title: '校园网络维护通知', createTime: '2024-02-10' },
          { id: 3, title: '图书馆新馆开放公告', createTime: '2024-02-05' }
        ]
      });
    });
  },

  /**
   * 加载当前空教室
   */
  loadCurrentEmptyClassrooms: function () {
    // 获取当前时间
    const now = new Date();
    const currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    const currentWeekday = now.getDay() || 7; // 将周日转换为7

    return campusApi.getEmptyClassrooms({
      weekday: currentWeekday,
      time: currentTime,
      page: 1,
      pageSize: 5,
      cache: true
    }).then(res => {
      this.setData({
        currentEmptyClassrooms: res.data || []
      });
    }).catch(err => {
      console.error('加载当前空教室失败:', err);
      // 使用模拟数据
      this.setData({
        currentEmptyClassrooms: [
          { id: 1, name: 'A101', building: '第一教学楼', floor: 1, capacity: 50 },
          { id: 2, name: 'B203', building: '第二教学楼', floor: 2, capacity: 40 },
          { id: 3, name: 'C305', building: '第三教学楼', floor: 3, capacity: 60 }
        ]
      });
    });
  },

  /**
   * 搜索功能
   */
  onSearch: function () {
    wx.navigateTo({
      url: '/pages/campus/search/index'
    });
  },

  /**
   * 导航到具体服务
   */
  navigateToService: function (e) {
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'empty_classroom':
        wx.navigateTo({
          url: '/pages/campus/classroom/empty'
        });
        break;
      case 'announcement':
        wx.navigateTo({
          url: '/pages/campus/announcement/list'
        });
        break;
      case 'campus_map':
        wx.navigateTo({
          url: '/pages/campus/map/index'
        });
        break;
      case 'campus_activity':
        wx.navigateTo({
          url: '/pages/campus/activity/list'
        });
        break;
      case 'dorm_service':
        wx.navigateTo({
          url: '/pages/campus/dorm/index'
        });
        break;
      case 'library':
        wx.navigateTo({
          url: '/pages/campus/library/index'
        });
        break;
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  },

  /**
   * 导航到公告列表
   */
  navigateToAnnouncementList: function () {
    wx.navigateTo({
      url: '/pages/campus/announcement/list'
    });
  },

  /**
   * 导航到公告详情
   */
  navigateToAnnouncementDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/announcement/detail?id=${id}`
    });
  },

  /**
   * 导航到空教室查询
   */
  navigateToEmptyClassroom: function () {
    wx.navigateTo({
      url: '/pages/campus/classroom/empty'
    });
  },

  /**
   * 导航到教室详情
   */
  navigateToClassroomDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/classroom/detail?id=${id}`
    });
  }
});
