// 商家管理页面逻辑
const merchantApi = require('../../../api/merchant');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商家信息
    merchantInfo: null,
    // 统计数据
    statistics: {
      totalOrders: 0,
      totalProducts: 0,
      totalRevenue: 0,
      todayOrders: 0,
      todayRevenue: 0
    },
    // 订单列表
    orders: [],
    // 加载状态
    loading: true,
    // 分页信息
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载商家信息和统计数据
    this.loadMerchantInfo();
    this.loadStatistics();
    this.loadOrders();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新数据
    this.loadMerchantInfo();
    this.loadStatistics();
    this.loadOrders();
  },

  /**
   * 加载商家信息
   */
  loadMerchantInfo: function () {
    // 模拟加载商家信息
    setTimeout(() => {
      const mockMerchant = {
        id: 'm1',
        name: '黑科餐饮',
        type: 'restaurant',
        status: 'approved',
        logo: 'https://via.placeholder.com/100x100?text=Logo',
        coverImage: 'https://via.placeholder.com/800x400?text=Cover',
        description: '提供各种美食，欢迎品尝！',
        phone: '13800138000',
        email: 'merchant@example.com',
        address: '黑龙江省哈尔滨市松北区学院路',
        createTime: '2024-12-01'
      };
      
      this.setData({
        merchantInfo: mockMerchant
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
        totalOrders: 1258,
        totalProducts: 56,
        totalRevenue: 89562.50,
        todayOrders: 23,
        todayRevenue: 1856.00
      };
      
      this.setData({
        statistics: mockStatistics
      });
    }, 500);
  },

  /**
   * 加载订单列表
   */
  loadOrders: function () {
    this.setData({ loading: true });
    
    // 模拟加载订单列表
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'o1',
          orderNo: 'HEIKE20241215001',
          totalAmount: 88.50,
          status: 'completed',
          createTime: '2024-12-15 14:30:00',
          productCount: 3
        },
        {
          id: 'o2',
          orderNo: 'HEIKE20241215002',
          totalAmount: 45.00,
          status: 'processing',
          createTime: '2024-12-15 13:20:00',
          productCount: 2
        },
        {
          id: 'o3',
          orderNo: 'HEIKE20241215003',
          totalAmount: 68.80,
          status: 'pending',
          createTime: '2024-12-15 12:15:00',
          productCount: 4
        }
      ];
      
      this.setData({
        orders: mockOrders,
        loading: false,
        'pagination.total': 1258
      });
    }, 1000);
  },

  /**
   * 查看所有订单
   */
  viewAllOrders: function () {
    wx.showToast({
      title: '订单列表功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看订单详情
   */
  viewOrderDetail: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `查看订单${orderId}详情`,
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
   * 编辑商家信息
   */
  editMerchantInfo: function () {
    wx.showToast({
      title: '编辑商家信息功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看销售报表
   */
  viewSalesReport: function () {
    wx.showToast({
      title: '销售报表功能开发中',
      icon: 'none'
    });
  },

  /**
   * 联系客服
   */
  contactService: function () {
    wx.showToast({
      title: '联系客服功能开发中',
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
    this.loadMerchantInfo();
    this.loadStatistics();
    this.loadOrders();
    
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    // 加载更多订单
    if (this.data.pagination.page * this.data.pagination.pageSize < this.data.pagination.total) {
      this.setData({
        'pagination.page': this.data.pagination.page + 1
      });
      this.loadOrders();
    }
  }
});
