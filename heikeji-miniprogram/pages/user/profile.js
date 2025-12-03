// pages/user/profile.js
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
      { id: 'orders', name: '我的订单', icon: 'orders', url: '/pages/order/list' },
      { id: 'address', name: '收货地址', icon: 'address', url: '/pages/user/address' },
      { id: 'coupons', name: '我的优惠券', icon: 'coupon', url: '/pages/coupon/list' },
      { id: 'wallet', name: '我的钱包', icon: 'wallet', url: '/pages/wallet/index' },
      { id: 'help', name: '帮助与反馈', icon: 'help', url: '/pages/help/index' },
      { id: 'settings', name: '设置', icon: 'settings', url: '/pages/settings/index' }
    ]
  },

  onLoad: function(options) {
    this.loadUserData();
  },

  onShow: function() {
    // 每次显示时刷新用户数据
    this.loadUserData();
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

    // 加载用户基本信息
    this.loadUserInfo();
    
    // 加载统计数据
    this.loadUserStats();
  },

  /**
   * 加载用户基本信息
   */
  loadUserInfo: function() {
    const app = getApp();
    const { request } = require('../../utils/request');
    
    request({
      url: '/user/profile',
      method: 'GET'
    }).then(res => {
      if (res.code === 200) {
        this.setData({ userInfo: res.data });
        
        // 更新全局用户信息
        app.globalData.userInfo = res.data;
        wx.setStorageSync('userInfo', res.data);
      }
    }).catch(err => {
      console.log('加载用户信息失败:', err);
    });
  },

  /**
   * 加载用户统计信息
   */
  loadUserStats: function() {
    const { request } = require('../../utils/request');
    
    request({
      url: '/user/stats',
      method: 'GET'
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
    
    if (id === 'orders') {
      wx.navigateTo({ url: '/pages/user/orders' });
    } else if (id === 'address') {
      wx.navigateTo({ url: '/pages/user/address' });
    } else if (id === 'wallet') {
      wx.navigateTo({ url: '/pages/wallet/index' });
    } else {
      wx.navigateTo({ url: url });
    }
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
          wx.clearStorageSync();
          wx.showToast({
            title: '清除成功',
            icon: 'success'
          });
          
          // 重新加载页面
          setTimeout(() => {
            this.onLoad();
          }, 1000);
        }
      }
    });
  }
});