// 网络请求封装
const BASE_URL = 'http://localhost:8080/api/miniprogram';

// 请求拦截器
const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    // 显示loading
    if (options.loading !== false) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
    }

    const app = getApp();
    const token = app.globalData.token;

    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        ...options.header
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200) {
          if (res.data.code === 401) {
            // token过期，重新登录
            app.logout();
            wx.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            });
            reject({ code: 401, message: '登录已过期' });
          } else if (res.data.code === 200) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject({ code: res.statusCode, message: '网络请求失败' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

module.exports = {
  request,
  get: (url, data = {}, options = {}) => {
    return request({ url, method: 'GET', data, ...options });
  },
  post: (url, data = {}, options = {}) => {
    return request({ url, method: 'POST', data, ...options });
  },
  put: (url, data = {}, options = {}) => {
    return request({ url, method: 'PUT', data, ...options });
  },
  delete: (url, data = {}, options = {}) => {
    return request({ url, method: 'DELETE', data, ...options });
  }
};