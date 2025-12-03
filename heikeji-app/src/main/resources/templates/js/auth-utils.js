/**
 * 认证工具类
 * 统一处理用户登录、token管理和请求头添加
 */
const authUtils = {
    // 存储键名常量
    KEYS: {
        TOKEN: 'token',
        USER_ID: 'userId',
        USERNAME: 'username',
        REFRESH_TOKEN: 'refreshToken',
        USER_INFO: 'userInfo'
    },
    
    /**
     * 获取当前登录用户的token
     */
    getToken: function() {
        return localStorage.getItem(this.KEYS.TOKEN);
    },
    
    /**
     * 获取当前登录用户ID
     */
    getUserId: function() {
        return localStorage.getItem(this.KEYS.USER_ID) || '1'; // 默认使用用户ID 1作为测试
    },
    
    /**
     * 获取当前登录用户名
     */
    getUsername: function() {
        return localStorage.getItem(this.KEYS.USERNAME);
    },
    
    /**
     * 获取用户信息对象
     */
    getUserInfo: function() {
        try {
            const userInfoStr = localStorage.getItem(this.KEYS.USER_INFO);
            return userInfoStr ? JSON.parse(userInfoStr) : {
                userId: this.getUserId(),
                username: this.getUsername()
            };
        } catch (e) {
            console.error('获取用户信息失败:', e);
            return {
                userId: this.getUserId(),
                username: this.getUsername()
            };
        }
    },
    
    /**
     * 保存用户信息对象
     */
    saveUserInfo: function(userInfo) {
        try {
            localStorage.setItem(this.KEYS.USER_INFO, JSON.stringify(userInfo));
            // 同时更新单独的字段，保持兼容性
            if (userInfo.userId) {
                localStorage.setItem(this.KEYS.USER_ID, userInfo.userId);
            }
            if (userInfo.username) {
                localStorage.setItem(this.KEYS.USERNAME, userInfo.username);
            }
        } catch (e) {
            console.error('保存用户信息失败:', e);
        }
    },
    
    /**
     * 检查用户是否已登录
     */
    isLoggedIn: function() {
        return !!this.getToken();
    },
    
    /**
     * 用户登录
     * @param {String} token - JWT token
     * @param {String} userId - 用户ID
     * @param {String} username - 用户名
     * @param {Object} userInfo - 用户信息对象（可选）
     */
    login: function(token, userId, username, userInfo = {}) {
        localStorage.setItem(this.KEYS.TOKEN, token);
        localStorage.setItem(this.KEYS.USER_ID, userId);
        localStorage.setItem(this.KEYS.USERNAME, username);
        
        // 保存完整的用户信息对象
        const fullUserInfo = {
            ...userInfo,
            userId: userId,
            username: username
        };
        this.saveUserInfo(fullUserInfo);
    },
    
    /**
     * 用户登出
     */
    logout: function() {
        localStorage.removeItem(this.KEYS.TOKEN);
        localStorage.removeItem(this.KEYS.USER_ID);
        localStorage.removeItem(this.KEYS.USERNAME);
        localStorage.removeItem(this.KEYS.REFRESH_TOKEN);
        localStorage.removeItem(this.KEYS.USER_INFO);
    },
    
    /**
     * 跳转到登录页面
     * @param {String} redirectUrl - 登录后跳转的URL
     */
    redirectToLogin: function(redirectUrl) {
        const currentUrl = redirectUrl || window.location.href;
        window.location.href = '/app/auth/login?redirect=' + encodeURIComponent(currentUrl);
    },
    
    /**
     * 检查登录状态，如果未登录则跳转
     * @param {Boolean} forceRedirect - 是否强制跳转
     * @returns {Boolean} 是否已登录
     */
    checkLogin: function(forceRedirect = true) {
        if (!this.isLoggedIn() && forceRedirect) {
            this.redirectToLogin();
            return false;
        }
        return this.isLoggedIn();
    },
    
    /**
     * 获取带认证信息的请求头
     * @param {Object} headers - 额外的请求头
     */
    getAuthHeaders: function(headers = {}) {
        const authHeaders = {
            ...headers
        };
        
        // 添加X-User-Id头
        authHeaders['X-User-Id'] = this.getUserId();
        
        // 如果有token，添加Authorization头
        const token = this.getToken();
        if (token) {
            authHeaders['Authorization'] = 'Bearer ' + token;
        }
        
        return authHeaders;
    },
    
    /**
     * 包装jQuery的ajax请求，自动添加认证头
     * @param {Object} options - ajax选项
     */
    ajax: function(options) {
        const ajaxOptions = {
            ...options,
            headers: this.getAuthHeaders(options.headers || {})
        };
        
        // 添加错误处理，处理未授权情况
        const originalError = ajaxOptions.error;
        ajaxOptions.error = function(xhr, status, error) {
            // 如果是401未授权，跳转到登录页面
            if (xhr.status === 401) {
                alert('登录已过期，请重新登录');
                authUtils.logout();
                authUtils.redirectToLogin();
            } else if (originalError && typeof originalError === 'function') {
                // 调用原始的错误处理
                originalError(xhr, status, error);
            } else {
                // 默认错误处理
                console.error('请求失败:', error);
                alert('请求失败，请稍后重试');
            }
        };
        
        return $.ajax(ajaxOptions);
    },
    
    /**
     * 刷新Token
     */
    refreshToken: function() {
        // 实现token刷新逻辑
        return new Promise((resolve, reject) => {
            const refreshToken = localStorage.getItem(this.KEYS.REFRESH_TOKEN);
            if (!refreshToken) {
                reject(new Error('No refresh token'));
                return;
            }
            
            $.ajax({
                url: '/app/auth/refresh',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ refreshToken: refreshToken }),
                success: function(data) {
                    if (data.code === 200 && data.data && data.data.token) {
                        authUtils.login(data.data.token, authUtils.getUserId(), authUtils.getUsername());
                        if (data.data.refreshToken) {
                            localStorage.setItem(authUtils.KEYS.REFRESH_TOKEN, data.data.refreshToken);
                        }
                        resolve(data.data);
                    } else {
                        reject(new Error(data.msg || 'Failed to refresh token'));
                    }
                },
                error: function() {
                    reject(new Error('Network error'));
                }
            });
        });
    }
};

// 导出authUtils对象
window.authUtils = authUtils;

// 扩展jQuery，添加authAjax方法
$.authAjax = function(options) {
    return authUtils.ajax(options);
};

/**
 * 工具函数集合
 */
const utils = {
    /**
     * 获取URL参数
     * @param {String} name - 参数名
     * @returns {String|null} 参数值
     */
    getUrlParam: function(name) {
        const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)');
        const result = window.location.search.match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    
    /**
     * 格式化日期时间
     * @param {Date|String} date - 日期对象或日期字符串
     * @returns {String} 格式化后的日期时间字符串
     */
    formatDateTime: function(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    
    /**
     * 格式化日期
     * @param {Date|String} date - 日期对象或日期字符串
     * @returns {String} 格式化后的日期字符串
     */
    formatDate: function(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    /**
     * 格式化金额
     * @param {Number|String} amount - 金额
     * @returns {String} 格式化后的金额字符串
     */
    formatAmount: function(amount) {
        return parseFloat(amount).toFixed(2);
    },
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {Number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖处理后的函数
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {Number} limit - 限制时间（毫秒）
     * @returns {Function} 节流处理后的函数
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * 显示提示消息
     * @param {String} message - 消息内容
     * @param {String} type - 消息类型（success, danger, warning, info）
     */
    showMessage: function(message, type = 'info') {
        // 创建消息元素
        const messageEl = $('<div>', {
            class: `alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3 w-75`,
            role: 'alert',
            html: `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `
        });
        
        // 添加到页面
        $('body').append(messageEl);
        
        // 自动关闭
        setTimeout(() => {
            messageEl.alert('close');
        }, 3000);
    },
    
    /**
     * 阻止事件冒泡
     * @param {Event} event - 事件对象
     */
    stopPropagation: function(event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    },
    
    /**
     * 阻止默认行为
     * @param {Event} event - 事件对象
     */
    preventDefault: function(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        } else if (window.event) {
            window.event.returnValue = false;
        }
    },
    
    /**
     * 深拷贝对象
     * @param {Any} obj - 要拷贝的对象
     * @returns {Any} 拷贝后的对象
     */
    deepClone: function(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        if (obj instanceof Array) {
            const cloneArr = [];
            for (let i = 0; i < obj.length; i++) {
                cloneArr[i] = this.deepClone(obj[i]);
            }
            return cloneArr;
        }
        if (typeof obj === 'object') {
            const cloneObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloneObj[key] = this.deepClone(obj[key]);
                }
            }
            return cloneObj;
        }
    }
};

// 导出utils对象
window.utils = utils;

/**
 * 验证工具函数
 */
const validators = {
    /**
     * 验证邮箱格式
     * @param {String} email - 邮箱地址
     * @returns {Boolean} 是否有效
     */
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * 验证手机号格式（中国大陆）
     * @param {String} phone - 手机号
     * @returns {Boolean} 是否有效
     */
    isValidPhone: function(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    },
    
    /**
     * 验证密码强度（至少包含字母和数字，长度至少8位）
     * @param {String} password - 密码
     * @returns {Boolean} 是否有效
     */
    isStrongPassword: function(password) {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    },
    
    /**
     * 验证非空
     * @param {Any} value - 要验证的值
     * @returns {Boolean} 是否非空
     */
    isNotEmpty: function(value) {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return true;
    }
};

// 导出validators对象
window.validators = validators;

/**
 * 业务相关工具函数
 */
const businessUtils = {
    /**
     * 获取订单状态文本
     * @param {String} status - 订单状态码
     * @returns {String} 状态文本
     */
    getOrderStatusText: function(status) {
        const statusMap = {
            'PENDING_PAYMENT': '待付款',
            'PAID': '已付款',
            'SHIPPING': '配送中',
            'DELIVERED': '已送达',
            'COMPLETED': '已完成',
            'CANCELLED': '已取消',
            'REFUNDED': '已退款'
        };
        return statusMap[status] || '未知状态';
    },
    
    /**
     * 获取外卖订单状态文本
     * @param {String} status - 订单状态码
     * @returns {String} 状态文本
     */
    getTakeoutOrderStatusText: function(status) {
        const statusMap = {
            'PENDING_PAYMENT': '待付款',
            'PAID': '已付款',
            'ACCEPTED': '餐厅已接单',
            'PREPARING': '备餐中',
            'DELIVERING': '配送中',
            'DELIVERED': '已送达',
            'COMPLETED': '已完成',
            'CANCELLED': '已取消',
            'REFUNDED': '已退款'
        };
        return statusMap[status] || '未知状态';
    },
    
    /**
     * 获取跑腿需求状态文本
     * @param {String} status - 需求状态码
     * @returns {String} 状态文本
     */
    getDeliveryRequestStatusText: function(status) {
        const statusMap = {
            'PENDING': '待接单',
            'ACCEPTED': '已接单',
            'IN_PROGRESS': '进行中',
            'COMPLETED': '已完成',
            'CANCELLED': '已取消'
        };
        return statusMap[status] || '未知状态';
    },
    
    /**
     * 获取需求类型文本
     * @param {String|Number} type - 需求类型码
     * @returns {String} 类型文本
     */
    getRequestTypeText: function(type) {
        const typeMap = {
            '1': '取快递',
            '2': '代购',
            '3': '代办'
        };
        return typeMap[String(type)] || '未知类型';
    },
    
    /**
     * 获取配送方式文本
     * @param {String} method - 配送方式码
     * @returns {String} 方式文本
     */
    getDeliveryMethodText: function(method) {
        const methodMap = {
            'LOCKER': '外卖柜自取',
            'SPECIAL': '指定地点配送',
            'DORM': '寝室配送'
        };
        return methodMap[method] || '未知方式';
    }
};

// 导出businessUtils对象
window.businessUtils = businessUtils;

/**
 * 页面加载完成时检查登录状态的便捷方法
 * @param {String} redirectTo - 重定向地址
 * @returns {Boolean} 是否已登录
 */
function checkLoginStatus(redirectTo = '/app/auth/login') {
    if (!authUtils.isLoggedIn()) {
        alert('请先登录');
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// 全局快捷方法
window.getUrlParam = utils.getUrlParam;
window.formatDateTime = utils.formatDateTime;
window.formatDate = utils.formatDate;
window.formatAmount = utils.formatAmount;
window.debounce = utils.debounce;
window.throttle = utils.throttle;
window.showMessage = utils.showMessage;
window.showSuccessMessage = function(message) { utils.showMessage(message, 'success'); };
window.showErrorMessage = function(message) { utils.showMessage(message, 'danger'); };
window.showWarningMessage = function(message) { utils.showMessage(message, 'warning'); };
window.showInfoMessage = function(message) { utils.showMessage(message, 'info'); };
window.stopPropagation = utils.stopPropagation;
window.preventDefault = utils.preventDefault;
window.deepClone = utils.deepClone;
window.isValidEmail = validators.isValidEmail;
window.isValidPhone = validators.isValidPhone;
window.isStrongPassword = validators.isStrongPassword;
window.isNotEmpty = validators.isNotEmpty;
window.getOrderStatusText = businessUtils.getOrderStatusText;
window.getTakeoutOrderStatusText = businessUtils.getTakeoutOrderStatusText;
window.getDeliveryRequestStatusText = businessUtils.getDeliveryRequestStatusText;
window.getRequestTypeText = businessUtils.getRequestTypeText;
window.getDeliveryMethodText = businessUtils.getDeliveryMethodText;