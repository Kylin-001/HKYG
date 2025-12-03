// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    isLogin: false,
    // 接口基础URL
    API_BASE_URL: 'http://localhost:8080/api/miniprogram',
    // 小程序配置
    appConfig: {
      version: '1.0.0',
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
    console.log('黑科易购小程序启动');
    
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
    console.log('小程序显示');
    // 检查登录状态
    this.checkLoginStatus();
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(msg) {
    console.error('小程序错误:', msg);
  },

  /**
   * 检查更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果:', res.hasUpdate);
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
        console.log('获取位置失败');
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
   * 网络请求封装
   */
  request(options) {
    const token = this.globalData.token;
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.API_BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': token ? 'Bearer ' + token : ''
        },
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 401) {
              // token过期，重新登录
              this.logout();
              reject({ code: 401, message: '登录已过期' });
            } else {
              resolve(res.data);
            }
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
});