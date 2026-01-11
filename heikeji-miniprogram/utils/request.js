// 网络请求封装
const config = require('../config/config');
const BASE_URL = config.baseUrl;

// 请求缓存对象
const requestCache = new Map();

// 请求计数，用于控制全局loading
let requestCount = 0;

// 请求防抖对象，用于防止频繁请求
const debounceMap = new Map();

// 显示全局loading
const showGlobalLoading = () => {
  if (requestCount === 0) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  }
  requestCount++;
};

// 隐藏全局loading
const hideGlobalLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    wx.hideLoading();
  }
};

// 发送请求的核心函数
const sendRequest = (options, resolve, reject, retryCount = 0) => {
  const app = getApp();
  const token = app.globalData.token;

  // 请求配置
  const requestConfig = {
    url: BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: {
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ' + token : '',
      ...options.header
    },
    success: (res) => {
      // 隐藏loading
      if (options.loading !== false) {
        hideGlobalLoading();
      }
      
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
          // 缓存请求结果
          if (options.cache) {
            const cacheKey = `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`;
            requestCache.set(cacheKey, res.data);
            // 设置缓存过期时间（默认5分钟）
            setTimeout(() => {
              requestCache.delete(cacheKey);
            }, options.cacheExpire || 5 * 60 * 1000);
          }
          resolve(res.data);
        } else {
          // 非静默错误才显示提示
          if (options.silent !== true) {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
          }
          reject(res.data);
        }
      } else {
        // 请求失败，检查是否需要重试
        const maxRetry = options.maxRetry || 0;
        if (retryCount < maxRetry) {
          // 重试请求
          setTimeout(() => {
            sendRequest(options, resolve, reject, retryCount + 1);
          }, options.retryDelay || 1000);
        } else {
          // 达到最大重试次数
          // 非静默错误才显示提示
          if (options.silent !== true) {
            wx.showToast({
              title: `请求失败(${res.statusCode})`,
              icon: 'none'
            });
          }
          reject({ code: res.statusCode, message: '网络请求失败' });
        }
      }
    },
    fail: (err) => {
      // 隐藏loading
      if (options.loading !== false) {
        hideGlobalLoading();
      }
      
      // 请求失败，检查是否需要重试
      const maxRetry = options.maxRetry || 0;
      if (retryCount < maxRetry) {
        // 重试请求
        setTimeout(() => {
          sendRequest(options, resolve, reject, retryCount + 1);
        }, options.retryDelay || 1000);
      } else {
        // 达到最大重试次数
        // 非静默错误才显示提示
        if (options.silent !== true) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          });
        }
        reject(err);
      }
    },
    complete: () => {
      // 确保loading被隐藏
      if (options.loading !== false) {
        setTimeout(() => {
          hideGlobalLoading();
        }, 0);
      }
    }
  };

  // 发送请求
  wx.request(requestConfig);
};

// 请求拦截器
const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    // 生成缓存key
    const cacheKey = `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`;
    
    // 检查是否需要缓存且缓存存在
    if (options.cache && requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      resolve(cachedData);
      return;
    }

    // 检查是否需要防抖
    if (options.debounce) {
      const debounceKey = cacheKey;
      const debounceTime = options.debounceTime || 300;
      
      // 清除之前的防抖定时器
      if (debounceMap.has(debounceKey)) {
        clearTimeout(debounceMap.get(debounceKey));
      }
      
      // 创建新的防抖定时器
      const timer = setTimeout(() => {
        // 移除防抖记录
        debounceMap.delete(debounceKey);
        
        // 显示loading
        if (options.loading !== false) {
          showGlobalLoading();
        }
        
        // 发送请求
        sendRequest(options, resolve, reject);
      }, debounceTime);
      
      // 保存防抖定时器
      debounceMap.set(debounceKey, timer);
    } else {
      // 不需要防抖，直接发送请求
      // 显示loading
      if (options.loading !== false) {
        showGlobalLoading();
      }
      
      // 发送请求
      sendRequest(options, resolve, reject);
    }
  });
};

// 清除特定缓存
const clearCache = (url, method = 'GET', data = {}) => {
  const cacheKey = `${method}_${url}_${JSON.stringify(data)}`;
  requestCache.delete(cacheKey);
};

// 清除所有缓存
const clearAllCache = () => {
  requestCache.clear();
};

// 清除所有防抖定时器
const clearAllDebounce = () => {
  debounceMap.forEach(timer => clearTimeout(timer));
  debounceMap.clear();
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
  },
  clearCache,
  clearAllCache,
  clearAllDebounce
};
