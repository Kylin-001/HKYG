// app.js
const config = require('./config/config');
const { request } = require('./utils/request');
App({
  globalData: {
    userInfo: null,
    token: null,
    isLogin: false,
    // 接口基础URL
    API_BASE_URL: config.baseUrl,
    // 小程序配置
    appConfig: {
      version: '1.4.0',
      schoolName: '黑龙江科技大学',
      schoolCode: 'USTH'
    },
    // 用户位置信息
    location: {
      latitude: null,
      longitude: null,
      address: ''
    },
    // 购物车数据
    cart: {
      takeout: [], // 外卖购物车
      product: []  // 商品购物车
    },
    // 跑腿员信息
    errandInfo: {
      isErrandPerson: false,
      personId: null
    }
  },

  onLaunch() {
    // 检查更新
    this.checkUpdate();
    
    // 获取用户token
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.globalData.isLogin = true;
      this.getUserInfo();
    }
    
    // 获取位置信息
    this.getLocation();
    
    // 初始化购物车数据
    this.initCartData();
  },

  onShow() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  onHide() {
  },

  onError(msg) {
    console.error('小程序错误:', msg);
    // 错误上报（可以连接到第三方错误监控平台）
    this.reportError(msg);
    // 显示友好的错误提示
    wx.showToast({
      title: '系统出现错误，请稍后重试',
      icon: 'none',
      duration: 2000
    });
  },
  
  /**
   * 错误上报
   */
  reportError(errorMsg) {
    // 这里可以将错误信息上报到第三方监控平台
    console.log('上报错误:', errorMsg);
    // 示例：将错误信息发送到服务器
    if (this.globalData.token) {
      wx.request({
        url: this.globalData.API_BASE_URL + '/error/report',
        method: 'POST',
        data: {
          errorMsg: errorMsg,
          userInfo: this.globalData.userInfo,
          version: this.globalData.appConfig.version
        },
        header: {
          'Authorization': 'Bearer ' + this.globalData.token
        },
        fail: (err) => {
          console.error('错误上报失败:', err);
        }
      });
    }
  },
  
  /**
   * 静默登录
   */
  silentLogin() {
    return new Promise((resolve, reject) => {
      // 获取登录凭证
      wx.login({
        success: (res) => {
          if (res.code) {
            // 调用登录接口
            this.login(res.code).then(resolve).catch(reject);
          } else {
            reject(new Error('获取登录凭证失败'));
          }
        },
        fail: reject
      });
    });
  },

  /**
   * 检查更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        // 检查更新结果，静默处理
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      });
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token && !this.globalData.isLogin) {
      // token存在但globalData中没有，尝试恢复用户信息
      this.globalData.token = token;
      this.globalData.isLogin = true;
      this.getUserInfo();
    }
  },

  /**
   * 用户登录
   */
  login(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.API_BASE_URL + '/auth/login',
        method: 'POST',
        data: { code: code },
        success: (res) => {
          if (res.data.code === 200) {
            const { token, userInfo } = res.data.data;
            this.globalData.token = token;
            this.globalData.userInfo = userInfo;
            this.globalData.isLogin = true;
            
            // 存储token
            wx.setStorageSync('token', token);
            wx.setStorageSync('userInfo', userInfo);
            
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: reject
      });
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    if (!this.globalData.token) return;
    
    wx.request({
      url: this.globalData.API_BASE_URL + '/user/profile',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + this.globalData.token
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.globalData.userInfo = res.data.data;
          wx.setStorageSync('userInfo', res.data.data);
        }
      }
    });
  },

  /**
   * 退出登录
   */
  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    this.globalData.isLogin = false;
    
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('cart');
    
    // 跳转到登录页
    wx.reLaunch({
      url: '/pages/user/login'
    });
  },

  /**
   * 获取位置信息
   */
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location.latitude = res.latitude;
        this.globalData.location.longitude = res.longitude;
        
        // 根据经纬度获取地址信息
        this.getAddressDetail(res.latitude, res.longitude);
      },
      fail: () => {
        // 使用学校默认位置
        this.globalData.location = {
          latitude: 45.7859,
          longitude: 126.6494,
          address: '黑龙江科技大学松北校区'
        };
      }
    });
  },

  /**
   * 获取地址详情
   */
  getAddressDetail(latitude, longitude) {
    // 这里可以调用地图API获取详细地址
    // 暂时使用固定地址
    this.globalData.location.address = '黑龙江科技大学松北校区';
  },

  /**
   * 初始化购物车数据
   */
  initCartData() {
    const cart = wx.getStorageSync('cart');
    if (cart) {
      this.globalData.cart = cart;
    }
  },

  /**
   * 保存购物车数据
   */
  saveCartData() {
    wx.setStorageSync('cart', this.globalData.cart);
  },

  /**
   * 添加到购物车
   */
  addToCart(type, item) {
    const cartKey = type === 'takeout' ? 'takeout' : 'product';
    const cart = this.globalData.cart[cartKey];
    
    const existingIndex = cart.findIndex(cartItem => 
      cartItem.productId === item.productId && 
      cartItem.specId === item.specId
    );
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push({
        ...item,
        id: Date.now() // 临时ID
      });
    }
    
    this.saveCartData();
    this.updateCartBadge();
  },

  /**
   * 从购物车移除
   */
  removeFromCart(type, itemId) {
    const cartKey = type === 'takeout' ? 'takeout' : 'product';
    const cart = this.globalData.cart[cartKey];
    
    const index = cart.findIndex(item => item.id === itemId);
    if (index > -1) {
      cart.splice(index, 1);
      this.saveCartData();
      this.updateCartBadge();
    }
  },

  /**
   * 更新购物车数量
   */
  updateCartQuantity(type, itemId, quantity) {
    const cartKey = type === 'takeout' ? 'takeout' : 'product';
    const cart = this.globalData.cart[cartKey];
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(type, itemId);
      } else {
        item.quantity = quantity;
        this.saveCartData();
        this.updateCartBadge();
      }
    }
  },

  /**
   * 获取购物车商品数量
   */
  getCartItemCount() {
    const takeoutCount = this.globalData.cart.takeout.reduce((sum, item) => sum + item.quantity, 0);
    const productCount = this.globalData.cart.product.reduce((sum, item) => sum + item.quantity, 0);
    return takeoutCount + productCount;
  },

  /**
   * 更新购物车角标
   */
  updateCartBadge() {
    const count = this.getCartItemCount();
    if (count > 0) {
      wx.setTabBarBadge({
        index: 0, // 首页
        text: count.toString()
      });
      wx.setTabBarBadge({
        index: 1, // 外卖页
        text: count.toString()
      });
    } else {
      wx.removeTabBarBadge({ index: 0 });
      wx.removeTabBarBadge({ index: 1 });
    }
  },

  /**
   * 网络请求封装（使用优化后的request工具）
   */
  request(options) {
    return request(options);
  }
});