// 项目配置文件
const config = {
  // 基础URL配置
  baseUrl: 'http://localhost:8080/api/miniprogram',
  
  // 开发模式配置
  isDebug: true,
  
  // 用户信息配置
  campusInfo: {
    name: '黑龙江科技大学',
    shortName: '黑科大',
    location: '哈尔滨'
  },
  
  // 功能模块配置
  modules: {
    // 外卖配置
    takeout: {
      defaultDeliveryFee: 3.00,
      freeDeliveryThreshold: 20.00,
      deliveryTime: '30-60分钟'
    },
    
    // 跑腿配置
    errand: {
      basePrice: 3.00,
      pricePerKm: 1.50
    },
    
    // 快递配置
    courier: {
      expressFee: 5.00,
      lockerFee: 2.00
    }
  },
  
  // 用户相关配置
  user: {
    maxAddressCount: 10,
    defaultPageSize: 10
  },
  
  // 商品相关配置
  product: {
    defaultPageSize: 10,
    maxImageSize: 1024 * 1024 * 5, // 5MB
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif']
  },
  
  // 图片配置
  images: {
    placeholder: '/assets/images/placeholder.png',
    defaultAvatar: '/assets/images/default-avatar.png',
    defaultProduct: '/assets/images/default-product.png',
    defaultMerchant: '/assets/images/default-merchant.png'
  },
  
  // 缓存配置
  cache: {
    userInfo: 'heikeji_user_info',
    token: 'heikeji_token',
    cart: 'heikeji_cart',
    addresses: 'heikeji_addresses'
  },
  
  // 事件配置
  events: {
    cartUpdate: 'CART_UPDATE',
    userLogin: 'USER_LOGIN',
    userLogout: 'USER_LOGOUT'
  },
  
  // 正则表达式配置
  regex: {
    studentId: /^20\d{7}$/, // 学号格式：20xxxxxx
    phone: /^1[3-9]\d{9}$/, // 手机号
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 邮箱
  }
};

module.exports = config;