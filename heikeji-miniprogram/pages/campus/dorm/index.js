// 宿舍服务页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 服务分类
    serviceCategories: {
      repair: '维修报修',
      complaint: '投诉建议',
      visit: '访客登记',
      laundry: '洗衣机',
      electricity: '电费查询',
      water: '水费查询',
      'dorm-info': '宿舍信息',
      rules: '宿舍规定'
    },
    // 最近报修
    recentRepairs: [],
    // 宿舍公告
    dormAnnouncements: [],
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

    // 同时加载最近报修和宿舍公告
    return Promise.all([
      this.loadRecentRepairs(),
      this.loadDormAnnouncements()
    ]).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 加载最近报修
   */
  loadRecentRepairs: function () {
    return campusApi.getDormRepairs({
      page: 1,
      pageSize: 5,
      cache: true
    }).then(res => {
      const repairs = res.data || [];
      // 处理报修状态
      const formattedRepairs = repairs.map(repair => {
        let statusText = '待处理';
        switch (repair.status) {
          case 'pending':
            statusText = '待处理';
            break;
          case 'processing':
            statusText = '处理中';
            break;
          case 'completed':
            statusText = '已完成';
            break;
          case 'cancelled':
            statusText = '已取消';
            break;
          default:
            statusText = '待处理';
        }
        return {
          ...repair,
          statusText: statusText
        };
      });

      this.setData({
        recentRepairs: formattedRepairs
      });
    }).catch(err => {
      console.error('加载最近报修失败:', err);
      // 使用模拟数据
      this.setData({
        recentRepairs: [
          {
            id: 1,
            title: '卫生间漏水',
            status: 'processing',
            statusText: '处理中',
            createTime: '2024-02-15 14:30'
          },
          {
            id: 2,
            title: '空调不制冷',
            status: 'completed',
            statusText: '已完成',
            createTime: '2024-02-10 10:20'
          },
          {
            id: 3,
            title: '灯泡损坏',
            status: 'pending',
            statusText: '待处理',
            createTime: '2024-02-08 16:45'
          }
        ]
      });
    });
  },

  /**
   * 加载宿舍公告
   */
  loadDormAnnouncements: function () {
    return campusApi.getDormAnnouncements({
      page: 1,
      pageSize: 5,
      cache: true
    }).then(res => {
      this.setData({
        dormAnnouncements: res.data || []
      });
    }).catch(err => {
      console.error('加载宿舍公告失败:', err);
      // 使用模拟数据
      this.setData({
        dormAnnouncements: [
          {
            id: 1,
            title: '关于宿舍卫生检查的通知',
            createTime: '2024-02-14'
          },
          {
            id: 2,
            title: '宿舍用电安全提醒',
            createTime: '2024-02-12'
          },
          {
            id: 3,
            title: '洗衣机维修通知',
            createTime: '2024-02-10'
          }
        ]
      });
    });
  },

  /**
   * 服务点击事件
   */
  onServiceClick: function (e) {
    const serviceType = e.currentTarget.dataset.type;
    
    switch (serviceType) {
      case 'repair':
        wx.navigateTo({
          url: '/pages/campus/dorm/repair'
        });
        break;
      case 'complaint':
        wx.navigateTo({
          url: '/pages/campus/dorm/complaint'
        });
        break;
      case 'visit':
        wx.navigateTo({
          url: '/pages/campus/dorm/visit'
        });
        break;
      case 'laundry':
        wx.navigateTo({
          url: '/pages/campus/dorm/laundry'
        });
        break;
      case 'electricity':
        wx.navigateTo({
          url: '/pages/campus/dorm/electricity'
        });
        break;
      case 'water':
        wx.navigateTo({
          url: '/pages/campus/dorm/water'
        });
        break;
      case 'dorm-info':
        wx.navigateTo({
          url: '/pages/campus/dorm/info'
        });
        break;
      case 'rules':
        wx.navigateTo({
          url: '/pages/campus/dorm/rules'
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
   * 导航到报修列表
   */
  navigateToRepairList: function () {
    wx.navigateTo({
      url: '/pages/campus/dorm/repair-list'
    });
  },

  /**
   * 导航到报修详情
   */
  navigateToRepairDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/dorm/repair-detail?id=${id}`
    });
  },

  /**
   * 导航到宿舍公告列表
   */
  navigateToDormAnnouncements: function () {
    wx.navigateTo({
      url: '/pages/campus/dorm/announcements'
    });
  },

  /**
   * 导航到公告详情
   */
  navigateToAnnouncementDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/dorm/announcement-detail?id=${id}`
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
              url: '/pages/campus/dorm/settings'
            });
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/campus/dorm/help'
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