/**
 * 支付安全相关工具函数
 * 包含加密、签名、验证、风险检测等功能
 */
import CryptoJS from 'crypto-js'
import logger from './logger'

/**
 * 加密工具类
 */
const encryption = {
  /**
   * AES加密
   * @param {string} data - 要加密的数据
   * @param {string} key - 加密密钥
   * @returns {string} 加密后的字符串
   */
  encryptAES(data, key) {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, key)
      return encrypted.toString()
    } catch (error) {
      logger.error('AES加密失败', error)
      throw new Error('加密失败')
    }
  },

  /**
   * AES解密
   * @param {string} encryptedData - 加密数据
   * @param {string} key - 解密密钥
   * @returns {string} 解密后的字符串
   */
  decryptAES(encryptedData, key) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key)
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      logger.error('AES解密失败', error)
      throw new Error('解密失败')
    }
  },

  /**
   * MD5哈希
   * @param {string} data - 要哈希的数据
   * @returns {string} MD5哈希值
   */
  md5(data) {
    return CryptoJS.MD5(data).toString()
  },

  /**
   * SHA256哈希
   * @param {string} data - 要哈希的数据
   * @returns {string} SHA256哈希值
   */
  sha256(data) {
    return CryptoJS.SHA256(data).toString()
  },
}

/**
 * 签名验证工具
 */
const signature = {
  /**
   * 生成支付请求签名
   * @param {Object} params - 请求参数
   * @param {string} appKey - 应用密钥
   * @returns {string} 签名结果
   */
  generateSign(params, appKey) {
    try {
      // 1. 按字母顺序排序参数
      const sortedKeys = Object.keys(params).sort()

      // 2. 拼接参数字符串
      let signStr = ''
      sortedKeys.forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          signStr += `${key}=${params[key]}&`
        }
      })

      // 3. 添加应用密钥
      signStr += `key=${appKey}`

      // 4. MD5加密
      return encryption.md5(signStr).toUpperCase()
    } catch (error) {
      logger.error('生成签名失败', error)
      throw new Error('签名生成失败')
    }
  },

  /**
   * 验证支付回调签名
   * @param {Object} params - 回调参数
   * @param {string} appKey - 应用密钥
   * @param {string} sign - 收到的签名
   * @returns {boolean} 验证结果
   */
  verifySign(params, appKey, sign) {
    try {
      const { sign: receivedSign, ...otherParams } = params
      const generatedSign = this.generateSign(otherParams, appKey)
      return generatedSign === sign
    } catch (error) {
      logger.error('验证签名失败', error)
      return false
    }
  },
}

/**
 * 安全存储工具
 */
const secureStorage = {
  /**
   * 安全存储支付令牌
   * @param {string} token - 支付令牌
   * @param {string} orderId - 订单ID
   */
  storePaymentToken(token, orderId) {
    try {
      // 生成临时存储键
      const storageKey = `payment_token_${orderId}_${Date.now()}`

      // 存储令牌和过期时间（5分钟）
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          token,
          expiresAt: Date.now() + 5 * 60 * 1000,
        })
      )

      return storageKey
    } catch (error) {
      logger.error('存储支付令牌失败', error)
      throw new Error('存储失败')
    }
  },

  /**
   * 获取支付令牌
   * @param {string} storageKey - 存储键
   * @returns {string|null} 令牌或null
   */
  getPaymentToken(storageKey) {
    try {
      const stored = localStorage.getItem(storageKey)
      if (!stored) return null

      const { token, expiresAt } = JSON.parse(stored)

      // 检查是否过期
      if (Date.now() > expiresAt) {
        localStorage.removeItem(storageKey)
        return null
      }

      return token
    } catch (error) {
      logger.error('获取支付令牌失败', error)
      return null
    }
  },

  /**
   * 清除支付令牌
   * @param {string} storageKey - 存储键
   */
  clearPaymentToken(storageKey) {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      logger.error('清除支付令牌失败', error)
    }
  },

  /**
   * 安全存储临时数据
   * @param {string} key - 存储键
   * @param {*} data - 要存储的数据
   * @param {number} expiresIn - 过期时间（毫秒）
   */
  secureStore(key, data, expiresIn = 5 * 60 * 1000) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiresIn,
      }
      localStorage.setItem(`secure_${key}`, JSON.stringify(item))
    } catch (error) {
      logger.error('安全存储失败', error)
    }
  },

  /**
   * 获取安全存储的数据
   * @param {string} key - 存储键
   * @returns {*} 存储的数据或null
   */
  secureGet(key) {
    try {
      const itemStr = localStorage.getItem(`secure_${key}`)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)
      const now = Date.now()

      if (now - item.timestamp > item.expiresIn) {
        localStorage.removeItem(`secure_${key}`)
        return null
      }

      return item.data
    } catch (error) {
      logger.error('获取安全存储数据失败', error)
      return null
    }
  },
}

/**
 * 风险控制工具
 */
const riskControl = {
  /**
   * 检测异常支付行为
   * @param {Object} paymentInfo - 支付信息
   * @returns {Object} 风险检测结果
   */
  detectRiskyPayment(paymentInfo) {
    const { orderAmount, paymentMethod, userInfo } = paymentInfo
    const risks = []

    // 金额异常检测
    if (orderAmount > 10000) {
      risks.push({
        level: 'high',
        type: 'abnormal_amount',
        message: '单笔交易金额过高',
      })
    } else if (orderAmount > 5000) {
      risks.push({
        level: 'medium',
        type: 'large_amount',
        message: '交易金额较大，请注意确认',
      })
    }

    // 短时间内多次支付检测
    const recentPayments = this.getRecentPaymentAttempts()
    if (recentPayments.length >= 3) {
      risks.push({
        level: 'medium',
        type: 'frequent_payments',
        message: '短时间内支付次数过多',
      })
    }

    // 支付方式风险检测
    if (paymentMethod === 'BALANCE' && orderAmount > (userInfo?.balance || 0) * 0.8) {
      risks.push({
        level: 'low',
        type: 'balance_almost_empty',
        message: '余额即将用尽',
      })
    }

    // 记录本次支付尝试
    this.recordPaymentAttempt(paymentInfo)

    return {
      hasRisk: risks.length > 0,
      risks,
      highestRiskLevel:
        risks.length > 0
          ? risks.reduce(
              (max, risk) => (risk.level === 'high' ? 'high' : max),
              risks[0]?.level || 'low'
            )
          : 'low',
    }
  },

  /**
   * 记录支付尝试
   * @param {Object} paymentInfo - 支付信息
   */
  recordPaymentAttempt(paymentInfo) {
    const attemptsKey = 'recent_payment_attempts'
    const attempts = secureStorage.secureGet(attemptsKey) || []

    // 添加本次尝试，保留最近10分钟内的记录
    const now = Date.now()
    const recentAttempts = [{ ...paymentInfo, timestamp: now }, ...attempts].filter(
      attempt => now - attempt.timestamp < 10 * 60 * 1000
    ) // 10分钟

    secureStorage.secureStore(attemptsKey, recentAttempts, 10 * 60 * 1000)
  },

  /**
   * 获取最近的支付尝试
   * @returns {Array} 支付尝试记录数组
   */
  getRecentPaymentAttempts() {
    return secureStorage.secureGet('recent_payment_attempts') || []
  },

  /**
   * 检测支付环境安全性
   * @returns {Object} 环境检测结果
   */
  detectEnvironmentSecurity() {
    const issues = []

    // 检测HTTPS
    if (window.location.protocol !== 'https:') {
      issues.push({
        type: 'insecure_protocol',
        severity: 'critical',
        message: '当前环境使用非安全连接，请检查网络环境',
      })
    }

    // 检测是否在iframe中
    if (window.self !== window.top) {
      issues.push({
        type: 'iframe_environment',
        severity: 'high',
        message: '当前支付页面在iframe中加载，存在安全风险',
      })
    }

    // 检测浏览器安全设置
    if (!window.localStorage) {
      issues.push({
        type: 'local_storage_disabled',
        severity: 'medium',
        message: '浏览器存储功能被禁用，可能影响支付安全',
      })
    }

    return {
      isSecure: issues.length === 0,
      issues,
      highestSeverity:
        issues.length > 0
          ? issues.reduce(
              (max, issue) =>
                ['critical', 'high', 'medium', 'low'].indexOf(issue.severity) <
                ['critical', 'high', 'medium', 'low'].indexOf(max)
                  ? issue.severity
                  : max,
              issues[0]?.severity || 'low'
            )
          : 'low',
    }
  },
}

/**
 * 支付密码安全处理
 */
const paymentPassword = {
  /**
   * 对支付密码进行哈希处理
   * @param {string} password - 原始支付密码
   * @param {string} salt - 盐值（如用户名或用户ID）
   * @returns {string} 哈希后的密码
   */
  hashPaymentPassword(password, salt) {
    try {
      // 使用SHA256哈希，加盐两次
      const firstHash = encryption.sha256(password + salt)
      const secondHash = encryption.sha256(firstHash + salt)
      return secondHash
    } catch (error) {
      logger.error('密码哈希失败', error)
      throw new Error('密码处理失败')
    }
  },

  /**
   * 验证支付密码格式
   * @param {string} password - 支付密码
   * @returns {Object} 验证结果
   */
  validatePasswordFormat(password) {
    if (!password) {
      return { valid: false, message: '请输入支付密码' }
    }

    if (password.length !== 6) {
      return { valid: false, message: '支付密码必须为6位数字' }
    }

    if (!/^\d{6}$/.test(password)) {
      return { valid: false, message: '支付密码只能包含数字' }
    }

    // 检查简单密码
    const simplePatterns = [
      '123456',
      '000000',
      '111111',
      '123123',
      '12345678',
      '654321',
      '123321',
      '112233',
    ]

    if (simplePatterns.includes(password)) {
      return { valid: false, message: '支付密码过于简单，请更换' }
    }

    return { valid: true }
  },

  /**
   * 记录密码错误次数
   * @param {string} userId - 用户ID
   */
  recordPasswordError(userId) {
    const key = `password_errors_${userId}`
    const errors = secureStorage.secureGet(key) || {
      count: 0,
      lastErrorTime: null,
    }

    // 重置错误计数（如果上次错误时间超过30分钟）
    if (errors.lastErrorTime && Date.now() - errors.lastErrorTime > 30 * 60 * 1000) {
      errors.count = 0
    }

    errors.count++
    errors.lastErrorTime = Date.now()

    secureStorage.secureStore(key, errors, 24 * 60 * 60 * 1000) // 24小时

    return errors.count
  },

  /**
   * 检查是否需要锁定支付
   * @param {string} userId - 用户ID
   * @returns {Object} 锁定检查结果
   */
  checkPaymentLock(userId) {
    const key = `password_errors_${userId}`
    const errors = secureStorage.secureGet(key) || { count: 0 }

    // 连续3次错误锁定30分钟
    if (errors.count >= 3) {
      return {
        locked: true,
        lockTime: 30 * 60 * 1000,
        remainingTime: Math.max(0, 30 * 60 * 1000 - (Date.now() - errors.lastErrorTime)),
        message: `密码错误次数过多，请30分钟后再试`,
      }
    }

    return { locked: false }
  },
}

/**
 * XSS防护工具
 */
const xssProtection = {
  /**
   * 转义HTML特殊字符
   * @param {string} str - 输入字符串
   * @returns {string} 转义后的字符串
   */
  escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  },

  /**
   * 过滤支付相关的危险字符
   * @param {string} str - 输入字符串
   * @returns {string} 过滤后的字符串
   */
  filterPaymentInput(str) {
    if (!str) return ''

    // 移除可能的脚本标签和事件处理器
    let filtered = str.replace(/<script[^>]*>.*?<\/script>/gi, '')
    filtered = filtered.replace(/on\w+\s*=\s*['"].*?['"]/gi, '')

    // 移除危险的URL协议
    filtered = filtered.replace(/javascript:/gi, '')
    filtered = filtered.replace(/data:/gi, '')

    return filtered
  },
}

export default {
  encryption,
  signature,
  secureStorage,
  riskControl,
  paymentPassword,
  xssProtection,
}
