// pages/index/index.js
Page({
  data: {
    banners: [],
    quickEntries: [
      { id: 1, type: 'takeout', name: '外卖订餐', icon: '/assets/images/takeout-icon.png' },
      { id: 2, type: 'errand', name: '校园跑腿', icon: '/assets/images/errand-icon.png' },
      { id: 3, type: 'product', name: '商品商城', icon: '/assets/images/mall-icon.png' },
      { id: 4, type: 'courier', name: '快递代取', icon: '/assets/images/courier-icon.png' },
      { id: 5, type: 'campus', name: '校园服务', icon: '/assets/images/campus-icon.png' },
      { id: 6, type: 'coupon', name: '优惠活动', icon: '/assets/images/coupon-icon.png' },
      { id: 7, type: 'wallet', name: '我的钱包', icon: '/assets/images/wallet-icon.png' },
      { id: 8, type: 'more', name: '更多', icon: '/assets/images/more-icon.png' }
    ],
    recommendedProducts: [],
    hotMerchants: [],
    announcements: []
  },

  onLoad: function (options) {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 加载首页数据
    this.loadHomePageData();
  },

  onShow: function () {
    // 每次显示时刷新数据
    this.loadHomePageData();
  },

  onPullDownRefresh: function () {
    this.loadHomePageData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus: function() {
    const app = getApp();
    if (!app.globalData.token) {
      // 如果没有token，跳转到登录页
      wx.navigateTo({
        url: '/pages/user/login'
      });
    }
  },

  /**
   * 加载首页数据
   */
  loadHomePageData: function() {
    return Promise.all([
      this.loadBanners(),
      this.loadRecommendedProducts(),
      this.loadHotMerchants(),
      this.loadAnnouncements()
    ]);
  },

  /**
   * 加载轮播图
   */
  loadBanners: function() {
    return new Promise((resolve) => {
      wx.request({
        url: getApp().globalData.baseUrl + '/miniprogram/banners',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            this.setData({ banners: res.data.data });
          }
          resolve();
        },
        fail: () => {
          // 默认轮播图
          this.setData({
            banners: [
              { id: 1, image: '/assets/images/banner1.jpg' },
              { id: 2, image: '/assets/images/banner2.jpg' },
              { id: 3, image: '/assets/images/banner3.jpg' }
            ]
          });
          resolve();
        }
      });
    });
  },

  /**
   * 加载推荐商品
   */
  loadRecommendedProducts: function() {
    const { request } = require('../../utils/request');
    
    return request({
      url: '/product/recommended',
      method: 'GET',
      loading: false
    }).then(res => {
      this.setData({ recommendedProducts: res.data || [] });
    }).catch(err => {
      console.log('加载推荐商品失败:', err);
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
   * 加载热门商家
   */
  loadHotMerchants: function() {
    const { request } = require('../../utils/request');
    
    return request({
      url: '/merchant/hot',
      method: 'GET',
      loading: false
    }).then(res => {
      this.setData({ hotMerchants: res.data || [] });
    }).catch(err => {
      console.log('加载热门商家失败:', err);
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
   * 加载校园公告
   */
  loadAnnouncements: function() {
    const { request } = require('../../utils/request');
    
    return request({
      url: '/announcement/list',
      method: 'GET',
      loading: false
    }).then(res => {
      this.setData({ announcements: res.data || [] });
    }).catch(err => {
      console.log('加载公告失败:', err);
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
          url: '/pages/takeout/takeout'
        });
        break;
      case 'errand':
        wx.navigateTo({
          url: '/pages/errand/errand'
        });
        break;
      case 'product':
        wx.switchTab({
          url: '/pages/product/product'
        });
        break;
      case 'courier':
        wx.navigateTo({
          url: '/pages/courier/courier'
        });
        break;
      case 'campus':
        wx.navigateTo({
          url: '/pages/campus/campus'
        });
        break;
      case 'coupon':
        wx.navigateTo({
          url: '/pages/coupon/coupon'
        });
        break;
      case 'wallet':
        wx.navigateTo({
          url: '/pages/wallet/wallet'
        });
        break;
      case 'more':
        wx.navigateTo({
          url: '/pages/more/more'
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
    wx.switchTab({
      url: '/pages/product/product'
    });
  },

  /**
   * 查看更多商家
   */
  viewMoreMerchants: function() {
    wx.navigateTo({
      url: '/pages/merchant/list'
    });
  },

  /**
   * 跳转到商品详情
   */
  goToProductDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },

  /**
   * 跳转到商家详情
   */
  goToMerchant: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/merchant/detail?id=${id}`
    });
  },

  /**
   * 查看公告详情
   */
  viewAnnouncement: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/announcement/detail?id=${id}`
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
    app.addToCart(product);
    
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success'
    });
  }
});