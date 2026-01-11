import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import logger from '@/utils/logger'

// 定义支付方式类型
export interface PaymentMethod {
  code: string
  name: string
  enabled: boolean
  icon?: string
  description?: string
}

// 定义支付状态类型
interface PaymentStatus {
  loading: boolean
  status: 'idle' | 'processing' | 'success' | 'failed'
  message?: string
}

// 定义安全信息类型
interface SecurityInfo {
  token: string
  secure: boolean
  warnings: string[]
}

// 定义风险评估结果类型
interface RiskAssessmentResult {
  level: 'LOW' | 'MEDIUM' | 'HIGH'
  factors?: string[]
  advice?: string
}

// 创建并导出payment store
export const usePaymentStore = defineStore('payment', () => {
  // 状态定义
  const paymentMethods = ref<PaymentMethod[]>([])
  const selectedMethod = ref<string>('')
  const paymentStatus = ref<PaymentStatus>({ loading: false, status: 'idle' })
  const security = ref<SecurityInfo>({ token: '', secure: true, warnings: [] })
  const riskLevel = ref<'LOW' | 'MEDIUM' | 'HIGH'>('LOW')
  const isPaymentLocked = ref(false)
  const lockReason = ref('')
  const userBalance = ref(0)

  // 计算属性
  const availablePaymentMethods = computed(() => {
    return (orderType: string, orderAmount: number) => {
      // 根据订单类型和金额过滤可用支付方式
      return paymentMethods.value.filter(method => {
        // 这里可以根据实际业务逻辑添加过滤条件
        return method.enabled
      })
    }
  })

  const isBalanceSufficient = computed(() => {
    return (amount: number) => {
      return userBalance.value >= amount
    }
  })

  const formattedBalance = computed(() => {
    return `¥${userBalance.value.toFixed(2)}`
  })

  const needPaymentPassword = computed(() => {
    // 根据业务规则判断是否需要支付密码
    return userBalance.value > 1000 || selectedMethod.value === 'BALANCE'
  })

  const riskAdvice = computed(() => {
    switch (riskLevel.value) {
      case 'HIGH':
        return '当前支付风险较高，建议验证支付密码后再继续'
      case 'MEDIUM':
        return '当前支付存在一定风险，建议谨慎操作'
      default:
        return ''
    }
  })

  const securityWarnings = computed(() => {
    return security.value.warnings
  })

  // 方法
  // 获取支付方式列表
  async function getPaymentMethods(orderType?: string) {
    try {
      // 模拟API调用，实际项目中应该调用真实API
      // const response = await getPaymentMethodsApi(orderType)
      // paymentMethods.value = response.data

      // 模拟数据
      paymentMethods.value = [
        {
          code: 'WECHAT_PAY',
          name: '微信支付',
          enabled: true,
          icon: 'wechat-icon',
          description: '微信安全支付',
        },
        {
          code: 'ALIPAY',
          name: '支付宝',
          enabled: true,
          icon: 'alipay-icon',
          description: '支付宝安全支付',
        },
        {
          code: 'BALANCE',
          name: '余额支付',
          enabled: true,
          icon: 'balance-icon',
          description: '使用账户余额支付',
        },
      ]

      // 默认选择第一个可用支付方式
      if (paymentMethods.value.length > 0 && !selectedMethod.value) {
        selectedMethod.value = paymentMethods.value[0].code
      }
    } catch (error) {
      logger.error('获取支付方式失败:', error)
      throw error
    }
  }

  // 设置选中的支付方式
  function setSelectedMethod(method: string) {
    selectedMethod.value = method
  }

  // 获取用户余额
  async function getUserBalance() {
    try {
      // 模拟API调用，实际项目中应该调用真实API
      // const response = await getUserBalanceApi()
      // userBalance.value = response.data.balance

      // 模拟数据
      userBalance.value = 1000
    } catch (error) {
      logger.error('获取用户余额失败:', error)
      throw error
    }
  }

  // 创建支付订单
  async function createPaymentOrder(params: any) {
    try {
      paymentStatus.value.loading = true
      paymentStatus.value.status = 'processing'

      // 模拟API调用，实际项目中应该调用真实API
      // const response = await createPaymentOrderApi(params)

      // 模拟成功响应
      const mockResponse = {
        success: true,
        paymentUrl: 'https://example.com/pay',
        orderId: params.orderId,
      }

      paymentStatus.value.status = 'success'
      return mockResponse
    } catch (error) {
      logger.error('创建支付订单失败:', error)
      paymentStatus.value.status = 'failed'
      paymentStatus.value.message = error instanceof Error ? error.message : '创建支付订单失败'
      throw error
    } finally {
      paymentStatus.value.loading = false
    }
  }

  // 执行余额支付
  async function executeBalancePayment(params: any) {
    try {
      paymentStatus.value.loading = true
      paymentStatus.value.status = 'processing'

      // 模拟API调用，实际项目中应该调用真实API
      // const response = await executeBalancePaymentApi(params)

      // 模拟成功响应
      const mockResponse = {
        success: true,
        message: '余额支付成功',
      }

      // 更新用户余额
      userBalance.value -= params.amount

      paymentStatus.value.status = 'success'
      return mockResponse
    } catch (error) {
      logger.error('余额支付失败:', error)
      paymentStatus.value.status = 'failed'
      paymentStatus.value.message = error instanceof Error ? error.message : '余额支付失败'
      throw error
    } finally {
      paymentStatus.value.loading = false
    }
  }

  // 开始支付轮询
  function startPaymentPolling(params: { orderId: string; callback: (result: any) => void }) {
    // 模拟轮询逻辑
    let attempts = 0
    const maxAttempts = 30
    const interval = 2000

    const pollingInterval = setInterval(async () => {
      attempts++

      if (attempts >= maxAttempts) {
        clearInterval(pollingInterval)
        params.callback({ success: false, timeout: true, message: '支付超时' })
        return
      }

      try {
        // 模拟API调用，实际项目中应该调用真实API
        // const response = await checkPaymentStatusApi(params.orderId)

        // 模拟随机成功
        const randomSuccess = Math.random() > 0.7
        if (randomSuccess) {
          clearInterval(pollingInterval)
          params.callback({ success: true, orderId: params.orderId })
        }
      } catch (error) {
        logger.error('轮询支付状态失败:', error)
      }
    }, interval)

    // 返回停止轮询的函数
    return () => {
      clearInterval(pollingInterval)
    }
  }

  // 重置支付状态
  function resetPaymentStatus() {
    paymentStatus.value = { loading: false, status: 'idle' }
  }

  // 清除支付缓存
  function clearPaymentCache(orderId: string) {
    // 清除与特定订单相关的支付缓存
    logger.info(`清除订单 ${orderId} 的支付缓存`)
  }

  // 获取支付剩余时间
  function getPaymentRemainingTime(orderInfo: any) {
    if (!orderInfo || !orderInfo.createTime) return 0

    const createTime = new Date(orderInfo.createTime).getTime()
    const now = Date.now()
    const paymentTimeout = 30 * 60 * 1000 // 30分钟支付超时
    const remainingTime = Math.max(0, Math.floor((createTime + paymentTimeout - now) / 1000))

    return remainingTime
  }

  // 记录安全检查结果
  function recordSecurityCheck(result: any) {
    security.value = {
      token: result.token || '',
      secure: result.secure || true,
      warnings: result.warnings || [],
    }
  }

  // 验证用户支付密码
  async function verifyUserPaymentPassword(params: { password: string; orderId: string }) {
    try {
      // 模拟API调用，实际项目中应该调用真实API
      // const response = await verifyPaymentPasswordApi(params)

      // 模拟成功响应
      const mockResponse = {
        success: true,
      }

      return mockResponse
    } catch (error) {
      logger.error('验证支付密码失败:', error)
      throw error
    }
  }

  // 执行支付风险评估
  async function performPaymentRiskAssessment(context: any) {
    try {
      // 模拟API调用，实际项目中应该调用真实API
      // const response = await performRiskAssessmentApi(context)

      // 模拟风险评估结果
      const mockResponse: RiskAssessmentResult = {
        level: 'LOW',
        advice: '当前支付风险较低，可以安全进行',
      }

      riskLevel.value = mockResponse.level
      return mockResponse
    } catch (error) {
      logger.error('执行风险评估失败:', error)
      throw error
    }
  }

  // 锁定支付
  function lockPayment(reason: string) {
    isPaymentLocked.value = true
    lockReason.value = reason
  }

  // 解锁支付
  function unlockPayment() {
    isPaymentLocked.value = false
    lockReason.value = ''
  }

  return {
    // 状态
    paymentMethods,
    selectedMethod,
    paymentStatus,
    security,
    riskLevel,
    isPaymentLocked,
    lockReason,
    userBalance,

    // 计算属性
    availablePaymentMethods,
    isBalanceSufficient,
    formattedBalance: computed(() => `¥${userBalance.value.toFixed(2)}`),
    needPaymentPassword,
    riskAdvice,
    securityWarnings,

    // 方法
    getPaymentMethods,
    setSelectedMethod,
    getUserBalance,
    createPaymentOrder,
    executeBalancePayment,
    startPaymentPolling,
    resetPaymentStatus,
    clearPaymentCache,
    getPaymentRemainingTime,
    recordSecurityCheck,
    verifyUserPaymentPassword,
    performPaymentRiskAssessment,
    lockPayment,
    unlockPayment,
  }
})
