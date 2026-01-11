// pages/index/index.js
const { request } = require('../../utils/request');
const analyticsApi = require('../../api/analytics');

Page({
  data: {
    banners: [],
    quickEntries: [
      { id: 1, type: 'takeout', name: '外卖订餐', icon: '/assets/icons/takeout.png' },
      { id: 2, type: 'errand', name: '校园跑腿', icon: '/assets/icons/errand.png' },
      { id: 3, type: 'product', name: '商品商城', icon: '/assets/icons/product.png' },
      { id: 4, type: 'courier', name: '快递代取', icon: '/assets/icons/courier.png' },
      { id: 5, type: 'campus', name: '校园服务', icon: '/assets/icons/campus.png' },
      { id: 6, type: 'coupon', name: '优惠活动', icon: '/assets/icons/coupon.png' },
      { id: 7, type: 'wallet', name: '我的钱包', icon: '/assets/icons/wallet.png' },
      { id: 8, type: 'more', name: '更多', icon: '/assets/icons/more.png' }
    ],
    recommendedProducts: [],
    personalizedProducts: [], // 个性化推荐商品
    hotMerchants: [],
    personalizedMerchants: [], // 个性化推荐商家
    announcements: [],
    isDataLoaded: false, // 数据加载标记，防止重复加载
    isLoading: true, // 页面加载状态
    needLogin: false // 是否需要登录
  },

  onLoad: function (options) {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 加载首页数据
    this.loadHomePageData();
  },

  onShow: function () {
    // 只有在数据未加载时才刷新，避免重复请求
    if (!this.data.isDataLoaded) {
      this.loadHomePageData();
    }
  },

  onPullDownRefresh: function () {
    this.loadHomePageData(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus: function() {
    const app = getApp();
    if (!app.globalData.token) {
      // 静默登录，不强制跳转
      app.silentLogin().then(() => {
        console.log('静默登录成功');
      }).catch(err => {
        console.log('静默登录失败:', err);
        // 静默登录失败后，在需要时再提示登录
        this.setData({ needLogin: true });
      });
    }
  },

  /**
   * 加载首页数据
   * @param {boolean} forceRefresh 是否强制刷新，不使用缓存
   */
  loadHomePageData: function(forceRefresh = false) {
    this.setData({ isLoading: true });
    // 优先加载核心数据
    return Promise.all([
      this.loadBanners(forceRefresh),
      this.loadRecommendedProducts(forceRefresh),
      this.loadHotMerchants(forceRefresh),
      this.loadAnnouncements(forceRefresh)
    ]).then(() => {
      this.setData({ 
        isDataLoaded: true,
        isLoading: false 
      });
      // 核心数据加载完成后，延迟加载个性化推荐数据，提高初始加载速度
      this.loadPersonalizedData(forceRefresh);
    }).catch(() => {
      this.setData({ 
        isLoading: false 
      });
    });
  },

  /**
   * 加载个性化推荐数据
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadPersonalizedData: function(forceRefresh = false) {
    // 使用setTimeout延迟加载，避免影响核心数据的渲染
    setTimeout(() => {
      Promise.all([
        this.loadPersonalizedProducts(forceRefresh),
        this.loadPersonalizedMerchants(forceRefresh)
      ]);
    }, 500);
  },

  /**
   * 加载轮播图
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadBanners: function(forceRefresh = false) {
    return request({
      url: '/miniprogram/banners',
      method: 'GET',
      cache: !forceRefresh,
      loading: false
    }).then(res => {
      this.setData({ banners: res.data || [] });
    }).catch(err => {
      this.setData({
        banners: [
          { id: 1, image: '/assets/images/banner1.jpg' },
          { id: 2, image: '/assets/images/banner2.jpg' },
          { id: 3, image: '/assets/images/banner3.jpg' }
        ]
      });
    });
  },

  /**
   * 加载推荐商品
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadRecommendedProducts: function(forceRefresh = false) {
    return request({
      url: '/product/recommended',
      method: 'GET',
      cache: !forceRefresh,
      loading: false
    }).then(res => {
      this.setData({ recommendedProducts: res.data || [] });
    }).catch(err => {
      this.setData({ 
        recommendedProducts: [
          { id: 1, name: '商品1', description: '商品描述', price: '19.9', image: '/assets/images/product1.jpg' },
          { id: 2, name: '商品2', description: '商品描述', price: '29.9', image: '/assets/images/product2.jpg' },
          { id: 3, name: '商品3', description: '商品描述', price: '39.9', image: '/assets/images/product3.jpg' },
          { id: 4, name: '商品4', description: '商品描述', price: '49.9', image: '/assets/images/product4.jpg' }
        ]
      });
    });
  },

  /**
   * 加载个性化推荐商品
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadPersonalizedProducts: function(forceRefresh = false) {
    return analyticsApi.getRecommendedProducts({
      page: 1,
      pageSize: 4,
      cache: !forceRefresh
    }).then(res => {
      this.setData({ personalizedProducts: res.data || [] });
    }).catch(err => {
      // 如果个性化推荐失败，不显示该模块
      this.setData({ personalizedProducts: [] });
    });
  },

  /**
   * 加载热门商家
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadHotMerchants: function(forceRefresh = false) {
    return request({
      url: '/merchant/hot',
      method: 'GET',
      cache: !forceRefresh,
      loading: false
    }).then(res => {
      this.setData({ hotMerchants: res.data || [] });
    }).catch(err => {
      this.setData({ 
        hotMerchants: [
          { id: 1, name: '商家1', rating: '4.5', monthlySales: 1000, logo: '/assets/images/merchant1.jpg' },
          { id: 2, name: '商家2', rating: '4.8', monthlySales: 2000, logo: '/assets/images/merchant2.jpg' },
          { id: 3, name: '商家3', rating: '4.6', monthlySales: 1500, logo: '/assets/images/merchant3.jpg' }
        ]
      });
    });
  },

  /**
   * 加载个性化推荐商家
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadPersonalizedMerchants: function(forceRefresh = false) {
    return analyticsApi.getRecommendedMerchants({
      page: 1,
      pageSize: 3,
      cache: !forceRefresh
    }).then(res => {
      this.setData({ personalizedMerchants: res.data || [] });
    }).catch(err => {
      console.log('加载个性化推荐商家失败:', err);
      // 如果个性化推荐失败，不显示该模块
      this.setData({ personalizedMerchants: [] });
    });
  },

  /**
   * 加载校园公告
   * @param {boolean} forceRefresh 是否强制刷新
   */
  loadAnnouncements: function(forceRefresh = false) {
    return request({
      url: '/announcement/list',
      method: 'GET',
      cache: !forceRefresh,
      loading: false
    }).then(res => {
      this.setData({ announcements: res.data || [] });
    }).catch(err => {
      this.setData({ 
        announcements: [
          { id: 1, title: '校园通知1', createTime: '2024-01-01' },
          { id: 2, title: '校园通知2', createTime: '2024-01-02' },
          { id: 3, title: '校园通知3', createTime: '2024-01-03' }
        ]
      });
    });
  },

  /**
   * 导航到快捷入口
   */
  navigateToEntry: function(e) {
    const type = e.currentTarget.dataset.type;
    
    switch(type) {
      case 'takeout':
        wx.switchTab({
          url: '/pages/takeout/index'
        });
        break;
      case 'errand':
        wx.switchTab({
          url: '/pages/errand/index'
        });
        break;
      case 'product':
        wx.navigateTo({
          url: '/pages/product/list/index'
        });
        break;
      case 'courier':
        wx.navigateTo({
          url: '/pages/courier/index'
        });
        break;
      case 'campus':
        wx.navigateTo({
          url: '/pages/campus/index'
        });
        break;
      case 'coupon':
        wx.navigateTo({
          url: '/pages/coupon/list/index'
        });
        break;
      case 'wallet':
        wx.navigateTo({
          url: '/pages/user/profile'
        });
        break;
      case 'more':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
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
   * 查看更多商品
   */
  viewMoreProducts: function() {
    wx.navigateTo({
      url: '/pages/product/list/index'
    });
  },

  /**
   * 查看更多商家
   */
  viewMoreMerchants: function() {
    wx.navigateTo({
      url: '/pages/merchant/list/index'
    });
  },

  /**
   * 跳转到商品详情
   */
  goToProductDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail/index?id=${id}`
    });
  },

  /**
   * 跳转到商家详情
   */
  goToMerchant: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/merchant/detail/index?id=${id}`
    });
  },

  /**
   * 查看公告详情
   */
  viewAnnouncement: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/announcement/detail/index?id=${id}`
    });
  },

  /**
   * 添加到购物车
   */
  addToCart: function(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const product = e.currentTarget.dataset.product;
    const app = getApp();
    
    // 添加到全局购物车
    app.addToCart('product', {
      productId: product.id,
      specId: product.specId || 1,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.image
    });
    
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 1000
    });
  }
});