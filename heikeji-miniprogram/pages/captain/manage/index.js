// 团长管理页面逻辑
const captainApi = require('../../../api/captain');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 团长信息
    captainInfo: null,
    // 统计数据
    statistics: {
      totalOrders: 0,
      totalTeamMembers: 0,
      totalCommission: 0,
      todayOrders: 0,
      todayCommission: 0
    },
    // 佣金记录
    commissionRecords: [],
    // 团队成员
    teamMembers: [],
    // 加载状态
    loading: true,
    // 分页信息
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    // 当前选中的标签
    activeTab: 'dashboard'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载团长信息和统计数据
    this.loadCaptainInfo();
    this.loadStatistics();
    this.loadCommissionRecords();
    this.loadTeamMembers();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新数据
    this.loadCaptainInfo();
    this.loadStatistics();
    this.loadCommissionRecords();
    this.loadTeamMembers();
  },

  /**
   * 加载团长信息
   */
  loadCaptainInfo: function () {
    // 模拟加载团长信息
    setTimeout(() => {
      const mockCaptain = {
        id: 'c1',
        name: '张三',
        phone: '13800138000',
        email: 'captain@example.com',
        studentId: '2021010101',
        school: '黑龙江科技大学',
        major: '计算机科学与技术',
        grade: '大三',
        teamName: '黑科先锋团队',
        teamSize: 15,
        status: 'active',
        joinTime: '2024-10-01',
        commissionBalance: 1258.50
      };
      
      this.setData({
        captainInfo: mockCaptain
      });
    }, 500);
  },

  /**
   * 加载统计数据
   */
  loadStatistics: function () {
    // 模拟加载统计数据
    setTimeout(() => {
      const mockStatistics = {
        totalOrders: 856,
        totalTeamMembers: 125,
        totalCommission: 5689.20,
        todayOrders: 15,
        todayCommission: 128.50
      };
      
      this.setData({
        statistics: mockStatistics
      });
    }, 500);
  },

  /**
   * 加载佣金记录
   */
  loadCommissionRecords: function () {
    this.setData({ loading: true });
    
    // 模拟加载佣金记录
    setTimeout(() => {
      const mockCommissions = [
        {
          id: 'com1',
          orderNo: 'HEIKE20241215001',
          amount: 25.50,
          type: 'order',
          status: 'completed',
          createTime: '2024-12-15 14:30:00',
          description: '订单HEIKE20241215001佣金'
        },
        {
          id: 'com2',
          orderNo: 'HEIKE20241215002',
          amount: 18.00,
          type: 'order',
          status: 'completed',
          createTime: '2024-12-15 13:20:00',
          description: '订单HEIKE20241215002佣金'
        },
        {
          id: 'com3',
          orderNo: 'HEIKE20241215003',
          amount: 32.80,
          type: 'order',
          status: 'completed',
          createTime: '2024-12-15 12:15:00',
          description: '订单HEIKE20241215003佣金'
        }
      ];
      
      this.setData({
        commissionRecords: mockCommissions,
        loading: false,
        'pagination.total': 125
      });
    }, 1000);
  },

  /**
   * 加载团队成员
   */
  loadTeamMembers: function () {
    // 模拟加载团队成员
    setTimeout(() => {
      const mockTeamMembers = [
        {
          id: 'tm1',
          name: '李四',
          phone: '13900139000',
          studentId: '2021010102',
          joinTime: '2024-10-15',
          status: 'active',
          role: 'member'
        },
        {
          id: 'tm2',
          name: '王五',
          phone: '13700137000',
          studentId: '2021010103',
          joinTime: '2024-11-01',
          status: 'active',
          role: 'member'
        },
        {
          id: 'tm3',
          name: '赵六',
          phone: '13600136000',
          studentId: '2021010104',
          joinTime: '2024-11-15',
          status: 'active',
          role: 'member'
        }
      ];
      
      this.setData({
        teamMembers: mockTeamMembers
      });
    }, 1000);
  },

  /**
   * 切换标签页
   */
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  /**
   * 查看全部佣金记录
   */
  viewAllCommissionRecords: function () {
    wx.showToast({
      title: '佣金记录列表功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看全部团队成员
   */
  viewAllTeamMembers: function () {
    wx.showToast({
      title: '团队成员列表功能开发中',
      icon: 'none'
    });
  },

  /**
   * 佣金提现
   */
  withdrawCommission: function () {
    wx.showToast({
      title: '佣金提现功能开发中',
      icon: 'none'
    });
  },

  /**
   * 管理商品
   */
  manageProducts: function () {
    wx.showToast({
      title: '商品管理功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看团队成员详情
   */
  viewTeamMemberDetail: function (e) {
    const memberId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `查看成员${memberId}详情`,
      icon: 'none'
    });
  },

  /**
   * 编辑团长信息
   */
  editCaptainInfo: function () {
    wx.showToast({
      title: '编辑团长信息功能开发中',
      icon: 'none'
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    // 重新加载数据
    this.setData({
      'pagination.page': 1
    });
    this.loadCaptainInfo();
    this.loadStatistics();
    this.loadCommissionRecords();
    this.loadTeamMembers();
    
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    // 加载更多数据
    if (this.data.pagination.page * this.data.pagination.pageSize < this.data.pagination.total) {
      this.setData({
        'pagination.page': this.data.pagination.page + 1
      });
      this.loadCommissionRecords();
    }
  }
});
