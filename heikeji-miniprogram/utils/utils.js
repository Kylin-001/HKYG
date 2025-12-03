/**
 * 格式化时间戳或日期字符串
 * @param {string|number} time - 时间戳或日期字符串
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return '';
  
  const date = typeof time === 'string' || typeof time === 'number' ? new Date(time) : time;
  
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化金额
 * @param {number|string} amount - 金额
 * @param {number} decimals - 小数位数，默认2
 * @returns {string} 格式化后的金额字符串
 */
function formatAmount(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '0.00';
  
  const num = Number(amount);
  return num.toFixed(decimals);
}

/**
 * 获取订单状态文本
 * @param {string} status - 订单状态
 * @returns {string} 订单状态文本
 */
function getOrderStatusText(status) {
  const statusMap = {
    'PENDING_PAYMENT': '待支付',
    'PAID': '已支付',
    'PREPARING': '商家备货中',
    'DELIVERED': '已送达',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款'
  };
  
  return statusMap[status] || '未知状态';
}

/**
 * 获取订单类型文本
 * @param {string} type - 订单类型
 * @returns {string} 订单类型文本
 */
function getOrderTypeText(type) {
  const typeMap = {
    'takeout': '外卖订单',
    'product': '商品订单',
    'errand': '跑腿订单'
  };
  
  return typeMap[type] || '未知类型';
}

/**
 * 获取支付状态文本
 * @param {string} status - 支付状态
 * @returns {string} 支付状态文本
 */
function getPaymentStatusText(status) {
  const statusMap = {
    'WAITING': '待支付',
    'PAID': '支付成功',
    'REFUNDED': '已退款',
    'FAILED': '支付失败'
  };
  
  return statusMap[status] || '未知状态';
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func.apply(this, args);
  };
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 手机号脱敏
 * @param {string} phone - 手机号
 * @returns {string} 脱敏后的手机号
 */
function maskPhone(phone) {
  if (!phone || typeof phone !== 'string' || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 检查小程序环境
 * @returns {Object} 环境信息
 */
function getEnvironmentInfo() {
  const system = wx.getSystemInfoSync();
  return {
    platform: system.platform, // 'ios'、'android' 等
    version: system.version, // 操作系统版本
    SDKVersion: system.SDKVersion, // 微信SDK版本
    model: system.model // 手机型号
  };
}

module.exports = {
  formatTime,
  formatAmount,
  getOrderStatusText,
  getOrderTypeText,
  getPaymentStatusText,
  throttle,
  debounce,
  maskPhone,
  getEnvironmentInfo
};