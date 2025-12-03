// pages/user/login.js
Page({
  data: {
    loading: false,
    studentId: '',
    phone: ''
  },

  onLoad: function(options) {
    // 检查是否已经登录
    const app = getApp();
    if (app.globalData.token) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 微信授权登录
   */
  onWechatLogin: function() {
    const that = this;
    
    this.setData({ loading: true });
    
    // 获取微信登录code
    wx.login({
      success: function(res) {
        if (res.code) {
          // 调用后端登录接口
          that.loginWithCode(res.code);
        } else {
          that.setData({ loading: false });
          wx.showToast({
            title: '获取登录凭证失败',
            icon: 'none'
          });
        }
      },
      fail: function() {
        that.setData({ loading: false });
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 绑定学号和手机号
   */
  onBindStudent: function(e) {
    const { studentId, phone } = e.detail.value;
    
    // 表单验证
    if (!this.validateStudentInfo(studentId, phone)) {
      return;
    }
    
    this.setData({ loading: true });
    
    const app = getApp();
    wx.request({
      url: app.globalData.API_BASE_URL + '/user/bindStudent',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        studentId: studentId,
        phone: phone
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          });
          
          // 返回首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '绑定失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  /**
   * 表单验证
   */
  validateStudentInfo: function(studentId, phone) {
    if (!studentId || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return false;
    }
    
    // 验证学号格式
    const studentIdRegex = /^20\d{7}$/;
    if (!studentIdRegex.test(studentId)) {
      wx.showToast({
        title: '请输入正确的学号格式',
        icon: 'none'
      });
      return false;
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 调用后端登录
   */
  loginWithCode: function(code) {
    const app = getApp();
    
    wx.request({
      url: app.globalData.API_BASE_URL + '/auth/login',
      method: 'POST',
      data: { code: code },
      success: (res) => {
        if (res.data.code === 200) {
          const { token, userInfo } = res.data.data;
          
          // 保存token和用户信息
          app.globalData.token = token;
          app.globalData.userInfo = userInfo;
          app.globalData.isLogin = true;
          
          wx.setStorageSync('token', token);
          wx.setStorageSync('userInfo', userInfo);
          
          // 检查是否需要绑定学号
          if (!userInfo.studentId) {
            wx.showToast({
              title: '请绑定学号信息',
              icon: 'none'
            });
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        } else {
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  /**
   * 隐私政策
   */
  onPrivacyPolicy: function() {
    wx.showModal({
      title: '隐私政策',
      content: '我们承诺保护您的个人信息安全，仅用于为您提供更好的服务。',
      showCancel: false
    });
  },

  /**
   * 用户协议
   */
  onUserAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '使用本服务即表示您同意我们的服务条款和用户协议。',
      showCancel: false
    });
  }
});