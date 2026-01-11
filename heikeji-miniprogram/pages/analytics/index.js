// 数据分析页面JS
const analyticsApi = require('../../api/analytics');

Page({
  data: {
    // 消费统计数据
    consumptionStats: {},
    // 订单统计数据
    orderStats: {},
    // 用户偏好数据
    preferences: {},
    // 推荐商品
    recommendedProducts: [],
    // 加载状态
    isLoading: false
  },

  onLoad: function (options) {
    // 加载数据分析数据
    this.loadAnalyticsData();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.loadAnalyticsData();
  },

  onPullDownRefresh: function () {
    // 下拉刷新
    this.loadAnalyticsData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载数据分析数据
   */
  loadAnalyticsData: function () {
    if (this.data.isLoading) {
      return Promise.resolve();
    }

    this.setData({ isLoading: true });

    // 同时加载所有数据
    return Promise.all([
      this.loadConsumptionStats(),
      this.loadOrderStats(),
      this.loadUserPreferences(),
      this.loadRecommendedProducts()
    ]).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 加载消费统计数据
   */
  loadConsumptionStats: function () {
    return analyticsApi.getUserConsumptionStats()
      .then(res => {
        this.setData({
          consumptionStats: res.data || {}
        });
      })
      .catch(err => {
        console.error('加载消费统计数据失败:', err);
        // 使用模拟数据
        this.setData({
          consumptionStats: {
            totalAmount: '1234.56',
            monthlyAvg: '308.64',
            maxOrder: '256.78',
            favoriteMerchant: '美食餐厅'
          }
        });
      });
  },

  /**
   * 加载订单统计数据
   */
  loadOrderStats: function () {
    return analyticsApi.getUserOrderStats()
      .then(res => {
        this.setData({
          orderStats: res.data || {}
        });
      })
      .catch(err => {
        console.error('加载订单统计数据失败:', err);
        // 使用模拟数据
        this.setData({
          orderStats: {
            totalOrders: 45,
            completedOrders: 42,
            takeoutOrders: 28,
            productOrders: 10,
            errandOrders: 7
          }
        });
      });
  },

  /**
   * 加载用户偏好数据
   */
  loadUserPreferences: function () {
    return analyticsApi.getUserPreferences()
      .then(res => {
        this.setData({
          preferences: res.data || {}
        });
      })
      .catch(err => {
        console.error('加载用户偏好数据失败:', err);
        // 使用模拟数据
        this.setData({
          preferences: {
            categories: ['美食', '饮料', '零食', '日用品', '水果'],
            favoriteBrands: ['品牌A', '品牌B', '品牌C']
          }
        });
      });
  },

  /**
   * 加载推荐商品
   */
  loadRecommendedProducts: function () {
    return analyticsApi.getRecommendedProducts({
      page: 1,
      pageSize: 4
    }).then(res => {
      this.setData({
        recommendedProducts: res.data || []
      });
    }).catch(err => {
      console.error('加载推荐商品失败:', err);
      // 使用模拟数据
      this.setData({
        recommendedProducts: [
          { id: 1, name: '商品1', description: '商品描述1', price: '19.9', image: '/assets/images/product1.jpg' },
          { id: 2, name: '商品2', description: '商品描述2', price: '29.9', image: '/assets/images/product2.jpg' },
          { id: 3, name: '商品3', description: '商品描述3', price: '39.9', image: '/assets/images/product3.jpg' },
          { id: 4, name: '商品4', description: '商品描述4', price: '49.9', image: '/assets/images/product4.jpg' }
        ]
      });
    });
  },

  /**
   * 跳转到商品详情
   */
  goToProductDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail/index?id=${id}`
    });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
