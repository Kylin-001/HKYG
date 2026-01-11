// pages/user/profile.js
const { request, clearAllCache } = require('../../utils/request');

Page({
  data: {
    userInfo: {},
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      walletBalance: 0
    },
    menuItems: [
      { id: 'orders', name: '我的订单', icon: 'orders', url: '/pages/user/orders' },
      { id: 'address', name: '收货地址', icon: 'address', url: '/pages/user/address' },
      { id: 'coupons', name: '我的优惠券', icon: 'coupon', url: '/pages/coupon/list/index' },
      { id: 'wallet', name: '我的钱包', icon: 'wallet', url: '/pages/wallet/index' },
      { id: 'help', name: '帮助与反馈', icon: 'help', url: '/pages/help/index' },
      { id: 'settings', name: '设置', icon: 'settings', url: '/pages/settings/index' }
    ],
    isLoading: false,
    lastLoadTime: 0 // 上次加载时间，用于控制刷新频率
  },

  onLoad: function(options) {
    this.loadUserData();
  },

  onShow: function() {
    // 控制刷新频率，防止频繁请求
    const now = Date.now();
    if (now - this.data.lastLoadTime > 5000) { // 5秒内不重复刷新
      this.loadUserData();
      this.setData({ lastLoadTime: now });
    }
  },

  /**
   * 加载用户数据
   */
  loadUserData: function() {
    const app = getApp();
    
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/user/login'
      });
      return;
    }

    // 防止重复加载
    if (this.data.isLoading) {
      return;
    }

    this.setData({ isLoading: true });

    // 加载用户基本信息和统计数据
    Promise.all([
      this.loadUserInfo(),
      this.loadUserStats()
    ]).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 加载用户基本信息
   */
  loadUserInfo: function() {
    const app = getApp();
    
    return request({
      url: '/user/profile',
      method: 'GET',
      cache: true,
      cacheExpire: 300000 // 5分钟缓存
    }).then(res => {
      if (res.code === 200) {
        this.setData({ userInfo: res.data });
        
        // 更新全局用户信息
        app.globalData.userInfo = res.data;
        wx.setStorageSync('userInfo', res.data);
      }
    }).catch(err => {
      console.log('加载用户信息失败:', err);
      // 使用本地缓存数据作为备选
      const cachedUserInfo = wx.getStorageSync('userInfo');
      if (cachedUserInfo) {
        this.setData({ userInfo: cachedUserInfo });
      }
    });
  },

  /**
   * 加载用户统计信息
   */
  loadUserStats: function() {
    return request({
      url: '/user/stats',
      method: 'GET',
      cache: true,
      cacheExpire: 60000 // 1分钟缓存
    }).then(res => {
      if (res.code === 200) {
        this.setData({ stats: res.data });
      }
    }).catch(err => {
      console.log('加载统计数据失败:', err);
      // 设置默认数据
      this.setData({
        stats: {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          walletBalance: 0
        }
      });
    });
  },

  /**
   * 菜单项点击
   */
  onMenuItemTap: function(e) {
    const { id, url } = e.currentTarget.dataset;
    
    wx.navigateTo({ url: url });
  },

  /**
   * 编辑个人信息
   */
  onEditProfile: function() {
    wx.navigateTo({
      url: '/pages/user/edit'
    });
  },

  /**
   * 跳转订单列表
   */
  onViewOrders: function(e) {
    const type = e.currentTarget.dataset.type || 'all';
    wx.navigateTo({
      url: `/pages/order/list?type=${type}`
    });
  },

  /**
   * 退出登录
   */
  onLogout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.logout();
        }
      }
    });
  },

  /**
   * 清除缓存
   */
  onClearCache: function() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.clearStorageSync();
          // 清除请求缓存
          clearAllCache();
          
          wx.showToast({
            title: '清除成功',
            icon: 'success'
          });
          
          // 重新加载页面
          setTimeout(() => {
            this.loadUserData();
          }, 1000);
        }
      }
    });
  }
});