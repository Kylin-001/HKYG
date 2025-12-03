import { getPaymentMethods, createPayment, getPaymentStatus, balancePay } from '@/api/payment'
import logger from '@/utils/logger'
import paymentSecurity from '@/utils/payment-security'

const payment = {
  namespaced: true,
  state: {
    // 支付方式列表
    paymentMethods: [],
    // 当前选中的支付方式
    selectedMethod: 'WECHAT_PAY',
    // 用户余额信息
    userBalance: 0,
    // 支付状态
    paymentStatus: {
      loading: false,
      success: false,
      error: null,
      orderId: null,
    },
    // 支付历史记录
    paymentHistory: [],
    // 支付超时配置
    paymentTimeoutConfig: {
      normal: 30, // 普通订单30分钟超时
      takeout: 15, // 外卖订单15分钟超时
    },
    // 支付状态轮询配置
    pollingConfig: {
      interval: 3000, // 3秒轮询一次
      maxRetries: 30, // 最多轮询30次（90秒）
    },
    // 支付结果缓存
    paymentResults: {},
    // 安全相关状态
    security: {
      // 风控状态
      riskLevel: 'LOW', // LOW, MEDIUM, HIGH
      // 风控建议
      riskAdvice: [],
      // 支付锁定状态
      paymentLocked: false,
      // 锁定原因
      lockReason: null,
      // 安全环境检测结果
      environmentSecure: true,
      // 安全警告
      securityWarnings: [],
      // 登录设备信息
      deviceInfo: null,
      // 支付密码验证状态
      paymentPasswordVerified: false,
    },
  },

  mutations: {
    // 设置支付方式列表
    SET_PAYMENT_METHODS(state, methods) {
      state.paymentMethods = methods
    },

    // 设置选中的支付方式
    SET_SELECTED_METHOD(state, method) {
      state.selectedMethod = method
    },

    // 设置用户余额
    SET_USER_BALANCE(state, balance) {
      state.userBalance = balance
    },

    // 设置支付状态
    SET_PAYMENT_STATUS(state, status) {
      state.paymentStatus = { ...state.paymentStatus, ...status }
    },

    // 设置支付历史记录
    SET_PAYMENT_HISTORY(state, history) {
      state.paymentHistory = history
    },

    // 添加支付历史记录
    ADD_PAYMENT_HISTORY(state, record) {
      state.paymentHistory.unshift(record)
    },

    // 缓存支付结果
    CACHE_PAYMENT_RESULT(state, { orderId, result }) {
      state.paymentResults[orderId] = {
        result,
        cachedAt: new Date().getTime(),
      }
    },

    // 清除缓存的支付结果
    CLEAR_PAYMENT_CACHE(state, orderId) {
      if (orderId) {
        delete state.paymentResults[orderId]
      } else {
        state.paymentResults = {}
      }
    },

    // 重置支付状态
    RESET_PAYMENT_STATUS(state) {
      state.paymentStatus = {
        loading: false,
        success: false,
        error: null,
        orderId: null,
      }
    },

    // 设置风控等级
    SET_RISK_LEVEL(state, level) {
      state.security.riskLevel = level
    },

    // 设置风控建议
    SET_RISK_ADVICE(state, advice) {
      state.security.riskAdvice = advice
    },

    // 设置支付锁定状态
    SET_PAYMENT_LOCK(state, { locked, reason }) {
      state.security.paymentLocked = locked
      state.security.lockReason = reason
    },

    // 设置环境安全状态
    SET_ENVIRONMENT_SECURITY(state, secure) {
      state.security.environmentSecure = secure
    },

    // 添加安全警告
    ADD_SECURITY_WARNING(state, warning) {
      if (!state.security.securityWarnings.includes(warning)) {
        state.security.securityWarnings.push(warning)
      }
    },

    // 清除安全警告
    CLEAR_SECURITY_WARNINGS(state) {
      state.security.securityWarnings = []
    },

    // 设置设备信息
    SET_DEVICE_INFO(state, info) {
      state.security.deviceInfo = info
    },

    // 设置支付密码验证状态
    SET_PAYMENT_PASSWORD_VERIFIED(state, verified) {
      state.security.paymentPasswordVerified = verified
    },

    // 重置安全状态
    RESET_SECURITY_STATE(state) {
      state.security = {
        riskLevel: 'LOW',
        riskAdvice: [],
        paymentLocked: false,
        lockReason: null,
        environmentSecure: true,
        securityWarnings: [],
        deviceInfo: null,
        paymentPasswordVerified: false,
      }
    },
  },

  actions: {
    // 获取支付方式列表
    async getPaymentMethods({ commit }, orderType) {
      try {
        const methods = await getPaymentMethods(orderType)
        commit('SET_PAYMENT_METHODS', methods)
        return methods
      } catch (error) {
        logger.error('获取支付方式失败', error)
        throw error
      }
    },

    // 设置选中的支付方式
    setSelectedMethod({ commit }, method) {
      commit('SET_SELECTED_METHOD', method)
    },

    // 获取用户余额
    async getUserBalance({ commit }) {
      try {
        // 这里假设通过用户模块获取余额信息
        // 实际项目中可能需要单独的余额查询接口
        const userInfo = await this.dispatch('user/getUserInfo')
        const balance = userInfo?.balance || 0
        commit('SET_USER_BALANCE', balance)
        return balance
      } catch (error) {
        logger.error('获取用户余额失败', error)
        throw error
      }
    },

    // 创建支付订单
    async createPaymentOrder({ commit, state }, paymentData) {
      commit('SET_PAYMENT_STATUS', {
        loading: true,
        success: false,
        error: null,
        orderId: paymentData.orderId,
      })

      try {
        const result = await createPayment({
          ...paymentData,
          paymentMethod: paymentData.paymentMethod || state.selectedMethod,
        })

        commit('SET_PAYMENT_STATUS', {
          loading: false,
          success: true,
        })

        // 缓存支付结果
        commit('CACHE_PAYMENT_RESULT', {
          orderId: paymentData.orderId,
          result,
        })

        // 添加到支付历史
        commit('ADD_PAYMENT_HISTORY', {
          orderId: paymentData.orderId,
          paymentMethod: paymentData.paymentMethod || state.selectedMethod,
          amount: paymentData.amount,
          createTime: new Date().toISOString(),
          status: 'PROCESSING',
        })

        return result
      } catch (error) {
        logger.error('创建支付订单失败', error)
        commit('SET_PAYMENT_STATUS', {
          loading: false,
          error: error.message || '支付处理失败',
        })
        throw error
      }
    },

    // 查询支付状态
    async queryPaymentStatus({ commit, state }, orderId) {
      try {
        // 先检查缓存
        const cachedResult = state.paymentResults[orderId]
        const now = new Date().getTime()

        // 如果缓存存在且在5秒内，则使用缓存
        if (cachedResult && now - cachedResult.cachedAt < 5000) {
          return cachedResult.result
        }

        const status = await getPaymentStatus(orderId)

        // 更新缓存
        commit('CACHE_PAYMENT_RESULT', {
          orderId,
          result: status,
        })

        // 如果支付成功，更新支付状态
        if (status.paid || status.status === 'SUCCESS') {
          commit('SET_PAYMENT_STATUS', {
            success: true,
            orderId,
          })

          // 更新支付历史状态
          const historyIndex = state.paymentHistory.findIndex(
            record => record.orderId === orderId && record.status === 'PROCESSING'
          )

          if (historyIndex !== -1) {
            const updatedHistory = [...state.paymentHistory]
            updatedHistory[historyIndex].status = 'SUCCESS'
            updatedHistory[historyIndex].completeTime = new Date().toISOString()
            commit('SET_PAYMENT_HISTORY', updatedHistory)
          }
        } else if (status.failed || status.status === 'FAILED') {
          commit('SET_PAYMENT_STATUS', {
            success: false,
            error: status.message || '支付失败',
            orderId,
          })

          // 更新支付历史状态
          const historyIndex = state.paymentHistory.findIndex(
            record => record.orderId === orderId && record.status === 'PROCESSING'
          )

          if (historyIndex !== -1) {
            const updatedHistory = [...state.paymentHistory]
            updatedHistory[historyIndex].status = 'FAILED'
            updatedHistory[historyIndex].errorMessage = status.message
            updatedHistory[historyIndex].completeTime = new Date().toISOString()
            commit('SET_PAYMENT_HISTORY', updatedHistory)
          }
        }

        return status
      } catch (error) {
        logger.error('查询支付状态失败', error)
        throw error
      }
    },

    // 执行余额支付
    async executeBalancePayment({ commit, state }, paymentData) {
      commit('SET_PAYMENT_STATUS', {
        loading: true,
        success: false,
        error: null,
        orderId: paymentData.orderId,
      })

      try {
        const result = await balancePay(paymentData)

        if (result.success) {
          commit('SET_PAYMENT_STATUS', {
            loading: false,
            success: true,
          })

          // 更新用户余额
          const currentBalance = state.userBalance
          const newBalance = currentBalance - paymentData.amount
          commit('SET_USER_BALANCE', newBalance)

          // 缓存支付结果
          commit('CACHE_PAYMENT_RESULT', {
            orderId: paymentData.orderId,
            result,
          })

          // 添加到支付历史
          commit('ADD_PAYMENT_HISTORY', {
            orderId: paymentData.orderId,
            paymentMethod: 'BALANCE',
            amount: paymentData.amount,
            createTime: new Date().toISOString(),
            completeTime: new Date().toISOString(),
            status: 'SUCCESS',
          })
        } else {
          commit('SET_PAYMENT_STATUS', {
            loading: false,
            error: result.message || '余额支付失败',
          })
          throw new Error(result.message || '余额支付失败')
        }

        return result
      } catch (error) {
        logger.error('余额支付失败', error)
        commit('SET_PAYMENT_STATUS', {
          loading: false,
          error: error.message || '余额支付失败',
        })
        throw error
      }
    },

    // 开始支付轮询
    startPaymentPolling({ state, dispatch }, { orderId, callback }) {
      let retryCount = 0
      const { interval, maxRetries } = state.pollingConfig

      const poll = async () => {
        retryCount++

        if (retryCount > maxRetries) {
          callback({ timeout: true, message: '支付超时，请检查订单状态' })
          return
        }

        try {
          const status = await dispatch('queryPaymentStatus', orderId)

          if (status.paid || status.status === 'SUCCESS') {
            callback({ success: true, status })
          } else if (status.failed || status.status === 'FAILED') {
            callback({ success: false, error: status.message || '支付失败' })
          } else {
            // 继续轮询
            setTimeout(poll, interval)
          }
        } catch (error) {
          logger.error('轮询支付状态失败', error)
          // 继续轮询，不中断
          setTimeout(poll, interval)
        }
      }

      // 开始第一次轮询
      setTimeout(poll, interval)

      // 返回取消轮询的函数
      return () => {
        retryCount = maxRetries + 1 // 停止轮询
      }
    },

    // 重置支付状态
    resetPaymentStatus({ commit }) {
      commit('RESET_PAYMENT_STATUS')
    },

    // 清除支付缓存
    clearPaymentCache({ commit }, orderId) {
      commit('CLEAR_PAYMENT_CACHE', orderId)
    },

    // 获取订单支付剩余时间（秒）
    getPaymentRemainingTime(_, orderInfo) {
      if (!orderInfo || orderInfo.orderStatus !== 1) {
        return 0
      }

      const createTime = new Date(orderInfo.createTime).getTime()
      const now = new Date().getTime()
      const elapsed = Math.floor((now - createTime) / 1000)
      const timeoutConfig = 30 * 60 // 默认30分钟

      const remaining = timeoutConfig - elapsed
      return remaining > 0 ? remaining : 0
    },

    // 执行安全环境检测
    async checkEnvironmentSecurity({ commit, dispatch }) {
      try {
        // 检查环境安全
        const isSecure = paymentSecurity.checkEnvironment()
        commit('SET_ENVIRONMENT_SECURITY', isSecure)

        // 收集设备信息
        const deviceInfo = paymentSecurity.collectDeviceInfo()
        commit('SET_DEVICE_INFO', deviceInfo)

        // 加密设备信息用于后续验证
        const encryptedDeviceInfo = paymentSecurity.encryptDeviceInfo(deviceInfo)

        return {
          isSecure,
          deviceInfo,
          encryptedDeviceInfo,
        }
      } catch (error) {
        logger.error('环境安全检测失败', error)
        commit('ADD_SECURITY_WARNING', '环境安全检测失败，建议使用安全浏览器')
        commit('SET_ENVIRONMENT_SECURITY', false)
        return {
          isSecure: false,
          error: error.message,
        }
      }
    },

    // 执行风险控制检查
    async performRiskAssessment({ commit, dispatch, state }, paymentData) {
      try {
        // 首先检查环境安全
        if (!state.security.environmentSecure) {
          commit('SET_RISK_LEVEL', 'HIGH')
          commit('SET_PAYMENT_LOCK', {
            locked: true,
            reason: '环境不安全，暂时无法进行支付',
          })
          return {
            riskLevel: 'HIGH',
            locked: true,
            reason: '环境不安全',
          }
        }

        // 执行风险评估
        const riskResult = paymentSecurity.performRiskAssessment(paymentData)

        commit('SET_RISK_LEVEL', riskResult.level)
        commit('SET_RISK_ADVICE', riskResult.advice)

        // 根据风险等级决定是否锁定支付
        if (riskResult.level === 'HIGH') {
          commit('SET_PAYMENT_LOCK', {
            locked: true,
            reason: riskResult.message || '当前支付存在高风险',
          })
        }

        return riskResult
      } catch (error) {
        logger.error('风险控制检查失败', error)
        // 出错时保守处理，设置为中风险
        commit('SET_RISK_LEVEL', 'MEDIUM')
        commit('ADD_SECURITY_WARNING', '风险控制检查异常，请谨慎操作')
        return {
          riskLevel: 'MEDIUM',
          error: error.message,
        }
      }
    },

    // 验证支付密码
    async verifyPaymentPassword({ commit }, { password, orderId }) {
      try {
        // 对密码进行加密
        const encryptedPassword = paymentSecurity.encryptPassword(password)

        // 生成签名
        const signature = paymentSecurity.generateSignature({
          orderId,
          timestamp: Date.now(),
        })

        // 这里应该调用后端API验证密码
        // 为了示例，我们假设验证成功
        const verificationResult = true

        if (verificationResult) {
          commit('SET_PAYMENT_PASSWORD_VERIFIED', true)
          return true
        } else {
          commit('SET_PAYMENT_PASSWORD_VERIFIED', false)
          return false
        }
      } catch (error) {
        logger.error('支付密码验证失败', error)
        commit('SET_PAYMENT_PASSWORD_VERIFIED', false)
        throw error
      }
    },

    // 检查支付锁定状态
    checkPaymentLockStatus({ commit, state }) {
      return {
        locked: state.security.paymentLocked,
        reason: state.security.lockReason,
      }
    },

    // 重置安全状态
    resetSecurityState({ commit }) {
      commit('RESET_SECURITY_STATE')
    },

    // 安全地执行支付
    async securePayment({ commit, dispatch, state }, paymentData) {
      try {
        // 1. 检查支付锁定状态
        const lockStatus = await dispatch('checkPaymentLockStatus')
        if (lockStatus.locked) {
          throw new Error(lockStatus.reason || '支付已被锁定')
        }

        // 2. 执行风险控制检查
        const riskResult = await dispatch('performRiskAssessment', paymentData)
        if (riskResult.locked) {
          throw new Error(riskResult.reason || '当前支付存在风险')
        }

        // 3. 对于高风险支付，要求支付密码验证
        if (riskResult.level === 'MEDIUM' && paymentData.amount > 1000) {
          if (!state.security.paymentPasswordVerified) {
            throw new Error('高金额支付需要验证支付密码')
          }
        }

        // 4. 加密支付数据
        const securePaymentData = paymentSecurity.securePaymentData(paymentData)

        // 5. 根据支付方式执行支付
        let paymentResult
        if (securePaymentData.paymentMethod === 'BALANCE') {
          paymentResult = await dispatch('executeBalancePayment', securePaymentData)
        } else {
          paymentResult = await dispatch('createPaymentOrder', securePaymentData)
        }

        return paymentResult
      } catch (error) {
        logger.error('安全支付执行失败', error)
        commit('ADD_SECURITY_WARNING', error.message)
        throw error
      }
    },
  },

  getters: {
    // 获取可用的支付方式
    availablePaymentMethods: (state, getters, rootState) => (orderType, amount) => {
      let methods = [...state.paymentMethods]

      // 根据订单类型过滤支付方式
      if (orderType) {
        methods = methods.filter(
          method => !method.supportedOrderTypes || method.supportedOrderTypes.includes(orderType)
        )
      }

      // 过滤余额支付（如果余额不足）
      if (amount && state.userBalance < amount) {
        methods = methods.filter(method => method.code !== 'BALANCE')
      }

      return methods
    },

    // 检查余额是否足够
    isBalanceSufficient: state => amount => {
      return state.userBalance >= amount
    },

    // 获取支付状态
    paymentStatus: state => state.paymentStatus,

    // 获取选中的支付方式详情
    selectedPaymentMethod: state => {
      return state.paymentMethods.find(method => method.code === state.selectedMethod)
    },

    // 格式化余额显示
    formattedBalance: state => {
      return state.userBalance.toFixed(2)
    },

    // 检查是否需要支付密码
    needPaymentPassword: (state, getters, rootState) => {
      // 这里可以根据用户设置和支付金额决定是否需要支付密码
      const userSetting = rootState.user.userInfo?.securitySetting
      return userSetting?.enablePaymentPassword !== false
    },

    // 获取最近的支付记录
    recentPaymentHistory: state => limit => {
      return state.paymentHistory.slice(0, limit || 10)
    },

    // 获取风控等级
    riskLevel: state => state.security.riskLevel,

    // 获取风控建议
    riskAdvice: state => state.security.riskAdvice,

    // 支付是否被锁定
    isPaymentLocked: state => state.security.paymentLocked,

    // 获取锁定原因
    lockReason: state => state.security.lockReason,

    // 环境是否安全
    isEnvironmentSecure: state => state.security.environmentSecure,

    // 获取安全警告
    securityWarnings: state => state.security.securityWarnings,

    // 是否显示安全提示
    shouldShowSecurityAlert: (state, getters) => {
      return getters.riskLevel === 'HIGH' || getters.securityWarnings.length > 0
    },

    // 获取支付安全状态摘要
    securitySummary: (state, getters) => {
      return {
        riskLevel: getters.riskLevel,
        locked: getters.isPaymentLocked,
        secure: getters.isEnvironmentSecure,
        warnings: getters.securityWarnings,
        advice: getters.riskAdvice,
      }
    },

    // 支付密码是否已验证
    isPaymentPasswordVerified: state => state.security.paymentPasswordVerified,
  },
}

export default payment
