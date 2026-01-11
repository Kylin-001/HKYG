// 校园公告列表页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    announcements: [], // 公告列表
    page: 1, // 当前页码
    pageSize: 10, // 每页条数
    hasMore: true, // 是否有更多数据
    isLoading: false, // 加载状态
    searchKeyword: '' // 搜索关键词
  },

  onLoad: function (options) {
    // 加载公告列表
    this.loadAnnouncements();
  },

  onShow: function () {
    // 页面显示时，如果数据为空则加载
    if (this.data.announcements.length === 0) {
      this.loadAnnouncements();
    }
  },

  onPullDownRefresh: function () {
    // 下拉刷新，重新加载第一页数据
    this.setData({ page: 1, announcements: [], hasMore: true });
    this.loadAnnouncements().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom: function () {
    // 上拉加载更多
    this.loadMore();
  },

  /**
   * 加载公告列表
   */
  loadAnnouncements: function () {
    if (this.data.isLoading || !this.data.hasMore) {
      return Promise.resolve();
    }

    this.setData({ isLoading: true });

    return campusApi.getAnnouncementList({
      page: this.data.page,
      pageSize: this.data.pageSize,
      keyword: this.data.searchKeyword,
      cache: this.data.page === 1
    }).then(res => {
      const newAnnouncements = res.data || [];
      const allAnnouncements = this.data.page === 1 ? newAnnouncements : [...this.data.announcements, ...newAnnouncements];
      
      this.setData({
        announcements: allAnnouncements,
        hasMore: newAnnouncements.length === this.data.pageSize,
        isLoading: false
      });
    }).catch(err => {
      console.error('加载公告列表失败:', err);
      // 使用模拟数据
      this.setData({
        announcements: [
          {
            id: 1,
            title: '关于2024年春季学期开学通知',
            summary: '根据学校安排，2024年春季学期将于2月20日正式开学，现将相关事宜通知如下...',
            source: '校长办公室',
            createTime: '2024-02-15'
          },
          {
            id: 2,
            title: '校园网络维护通知',
            summary: '为了提供更好的网络服务，学校将于2月18日凌晨2:00-6:00进行网络维护...',
            source: '信息技术中心',
            createTime: '2024-02-10'
          },
          {
            id: 3,
            title: '图书馆新馆开放公告',
            summary: '经过一年的建设，学校图书馆新馆将于2月25日正式开放，欢迎广大师生前往使用...',
            source: '图书馆',
            createTime: '2024-02-05'
          }
        ],
        hasMore: false,
        isLoading: false
      });
    });
  },

  /**
   * 加载更多公告
   */
  loadMore: function () {
    if (this.data.isLoading || !this.data.hasMore) {
      return;
    }

    this.setData({ page: this.data.page + 1 });
    this.loadAnnouncements();
  },

  /**
   * 搜索公告
   */
  onSearch: function () {
    wx.navigateTo({
      url: '/pages/campus/search/index?type=announcement'
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
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
