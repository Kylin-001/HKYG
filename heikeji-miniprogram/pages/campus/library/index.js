// 图书馆首页JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 最近借阅
    recentBorrows: [],
    // 座位统计
    totalSeats: 500,
    occupiedSeats: 350,
    availableSeats: 150,
    // 图书馆公告
    libraryAnnouncements: [],
    // 加载状态
    isLoading: false
  },

  onLoad: function (options) {
    // 加载页面数据
    this.loadPageData();
  },

  onShow: function () {
    // 页面显示时刷新数据
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

    // 同时加载最近借阅和图书馆公告
    return Promise.all([
      this.loadRecentBorrows(),
      this.loadLibraryAnnouncements(),
      this.loadSeatStats()
    ]).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 加载最近借阅
   */
  loadRecentBorrows: function () {
    return campusApi.getRecentBorrows({
      page: 1,
      pageSize: 3,
      cache: true
    }).then(res => {
      this.setData({ recentBorrows: res.data || [] });
    }).catch(err => {
      console.error('加载最近借阅失败:', err);
      // 使用模拟数据
      this.setData({
        recentBorrows: [
          {
            id: 1,
            bookTitle: 'JavaScript高级程序设计',
            borrowTime: '2024-02-10',
            returnTime: '2024-03-10'
          },
          {
            id: 2,
            bookTitle: '数据结构与算法分析',
            borrowTime: '2024-02-05',
            returnTime: '2024-03-05'
          }
        ]
      });
    });
  },

  /**
   * 加载座位统计
   */
  loadSeatStats: function () {
    return campusApi.getSeatStats()
      .then(res => {
        this.setData({
          totalSeats: res.data.totalSeats || 500,
          occupiedSeats: res.data.occupiedSeats || 350,
          availableSeats: res.data.availableSeats || 150
        });
      })
      .catch(err => {
        console.error('加载座位统计失败:', err);
        // 使用默认数据
        this.setData({
          totalSeats: 500,
          occupiedSeats: 350,
          availableSeats: 150
        });
      });
  },

  /**
   * 加载图书馆公告
   */
  loadLibraryAnnouncements: function () {
    return campusApi.getLibraryAnnouncements({
      page: 1,
      pageSize: 5,
      cache: true
    }).then(res => {
      this.setData({ libraryAnnouncements: res.data || [] });
    }).catch(err => {
      console.error('加载图书馆公告失败:', err);
      // 使用模拟数据
      this.setData({
        libraryAnnouncements: [
          {
            id: 1,
            title: '图书馆新馆开放通知',
            createTime: '2024-02-15'
          },
          {
            id: 2,
            title: '关于延长借阅期限的通知',
            createTime: '2024-02-10'
          },
          {
            id: 3,
            title: '图书馆座位预约系统升级通知',
            createTime: '2024-02-05'
          }
        ]
      });
    });
  },

  /**
   * 导航到具体服务
   */
  navigateToService: function (e) {
    const type = e.currentTarget.dataset.type;
    
    switch (type) {
      case 'book_borrow':
        wx.navigateTo({
          url: '/pages/campus/library/book-borrow'
        });
        break;
      case 'seat_reservation':
        wx.navigateTo({
          url: '/pages/campus/library/seat-reservation'
        });
        break;
      case 'book_search':
        wx.navigateTo({
          url: '/pages/campus/library/book-search'
        });
        break;
      case 'library_info':
        wx.navigateTo({
          url: '/pages/campus/library/info'
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
   * 导航到座位预约
   */
  navigateToSeatReservation: function () {
    wx.navigateTo({
      url: '/pages/campus/library/seat-reservation'
    });
  },

  /**
   * 导航到借阅列表
   */
  navigateToBorrowList: function () {
    wx.navigateTo({
      url: '/pages/campus/library/borrow-list'
    });
  },

  /**
   * 导航到图书馆公告列表
   */
  navigateToLibraryAnnouncements: function () {
    wx.navigateTo({
      url: '/pages/campus/library/announcements'
    });
  },

  /**
   * 导航到公告详情
   */
  navigateToAnnouncementDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/library/announcement-detail?id=${id}`
    });
  },

  /**
   * 更多操作
   */
  onMore: function () {
    wx.showActionSheet({
      itemList: ['刷新', '设置', '帮助'],
      success: res => {
        switch (res.tapIndex) {
          case 0:
            this.loadPageData();
            break;
          case 1:
            wx.navigateTo({
              url: '/pages/campus/library/settings'
            });
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/campus/library/help'
            });
            break;
        }
      }
    });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});