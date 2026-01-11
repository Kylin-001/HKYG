import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import notificationService from '@/utils/notification-service'
import { ElNotification } from 'element-plus'
import logger from '@/utils/logger'

// Mock dependencies
vi.mock('element-plus', () => ({
  ElNotification: vi.fn(),
}))

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('NotificationService', () => {
  // 保存原始localStorage
  const originalLocalStorage = global.localStorage

  beforeEach(() => {
    // 模拟localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock

    // 清空所有mock调用记录
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 恢复原始localStorage
    global.localStorage = originalLocalStorage
  })

  describe('初始化', () => {
    it('should initialize with default preferences', () => {
      expect(notificationService.userPreferences).toBeDefined()
      expect(notificationService.supportedChannels).toBeDefined()
    })

    it('should have correct supported channels', () => {
      expect(notificationService.supportedChannels).toEqual({
        IN_APP: 'inApp',
        SMS: 'sms',
        EMAIL: 'email',
        WECHAT: 'wechat',
      })
    })

    it('should load user preferences from localStorage', () => {
      const mockPreferences = {
        paymentSuccess: { inApp: true, sms: false, email: false, wechat: false },
        paymentFailed: { inApp: false, sms: true, email: true, wechat: false },
        refundApproved: { inApp: true, sms: true, email: false, wechat: false },
        refundRejected: { inApp: true, sms: true, email: true, wechat: false },
        paymentReminder: { inApp: true, sms: false, email: false, wechat: false },
        orderStatusChange: { inApp: true, sms: false, email: false, wechat: false },
      }

      // 模拟localStorage返回完整的偏好设置
      global.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockPreferences))

      // 直接测试loadUserPreferences方法
      const service = notificationService
      const loadedPrefs = service.loadUserPreferences()

      expect(loadedPrefs).toEqual(mockPreferences)
    })
  })

  describe('偏好设置管理', () => {
    it('should get default preferences correctly', () => {
      const defaultPrefs = notificationService.getDefaultPreferences()
      expect(defaultPrefs).toHaveProperty('paymentSuccess')
      expect(defaultPrefs).toHaveProperty('paymentFailed')
      expect(defaultPrefs).toHaveProperty('refundApproved')
      expect(defaultPrefs).toHaveProperty('refundRejected')
      expect(defaultPrefs).toHaveProperty('paymentReminder')
      expect(defaultPrefs).toHaveProperty('orderStatusChange')
    })

    it('should save user preferences correctly', () => {
      const mockPreferences = {
        paymentSuccess: { inApp: false, sms: true, email: true, wechat: true },
      }

      const result = notificationService.saveUserPreferences(mockPreferences)

      expect(result).toBe(true)
      expect(global.localStorage.setItem).toHaveBeenCalled()
      expect(notificationService.userPreferences.paymentSuccess).toEqual(
        mockPreferences.paymentSuccess
      )
    })

    it('should return false when save preferences fails', () => {
      // 模拟localStorage.setItem抛出错误
      global.localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('保存失败')
      })

      const result = notificationService.saveUserPreferences({})

      expect(result).toBe(false)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('应用内通知', () => {
    it('should show in-app notification correctly', () => {
      const result = notificationService.showInAppNotification('success', '测试标题', '测试内容', {
        duration: 3000,
        position: 'top-left',
      })

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalledWith({
        title: '测试标题',
        message: '测试内容',
        type: 'success',
        duration: 3000,
        showClose: true,
        position: 'top-left',
      })
    })

    it('should use default options when not provided', () => {
      notificationService.showInAppNotification('info', '测试标题', '测试内容')

      expect(ElNotification).toHaveBeenCalledWith({
        title: '测试标题',
        message: '测试内容',
        type: 'info',
        duration: 4500,
        showClose: true,
        position: 'top-right',
      })
    })

    it('should return false when show notification fails', () => {
      // 模拟ElNotification抛出错误
      ElNotification.mockImplementation(() => {
        throw new Error('显示失败')
      })

      const result = notificationService.showInAppNotification('error', '测试标题', '测试内容')

      expect(result).toBe(false)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('通知发送', () => {
    it('should send payment success notification', async () => {
      const mockData = {
        orderId: '123',
        amount: '99.99',
      }

      // 确保应用内通知偏好设置为true
      notificationService.userPreferences.paymentSuccess.inApp = true

      const result = await notificationService.sendPaymentSuccessNotification(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('success')
      expect(ElNotification.mock.calls[0][0].title).toBe('支付成功')
    })

    it('should send payment failed notification', async () => {
      const mockData = {
        orderId: '123',
      }

      const result = await notificationService.sendPaymentFailedNotification(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('error')
      expect(ElNotification.mock.calls[0][0].title).toBe('支付失败')
      expect(ElNotification.mock.calls[0][0].duration).toBe(6000)
    })

    it('should send refund approved notification', async () => {
      const mockData = {
        refundId: '456',
        amount: '50.00',
      }

      const result = await notificationService.sendRefundApprovedNotification(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('success')
      expect(ElNotification.mock.calls[0][0].title).toBe('退款成功')
    })

    it('should send refund rejected notification', async () => {
      const mockData = {
        refundId: '456',
        reason: '商品已使用',
      }

      const result = await notificationService.sendRefundRejectedNotification(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('warning')
      expect(ElNotification.mock.calls[0][0].title).toBe('退款失败')
      expect(ElNotification.mock.calls[0][0].duration).toBe(6000)
    })

    it('should send payment reminder notification', async () => {
      const mockData = {
        orderId: '123',
      }

      const result = await notificationService.sendPaymentReminder(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('warning')
      expect(ElNotification.mock.calls[0][0].title).toBe('支付提醒')
      expect(ElNotification.mock.calls[0][0].duration).toBe(5000)
    })

    it('should send order status change notification', async () => {
      const mockData = {
        orderId: '123',
        status: '已发货',
      }

      const result = await notificationService.sendOrderStatusChangeNotification(mockData)

      expect(result).toBe(true)
      expect(ElNotification).toHaveBeenCalled()
      expect(ElNotification.mock.calls[0][0].type).toBe('info')
      expect(ElNotification.mock.calls[0][0].title).toBe('订单状态更新')
      expect(ElNotification.mock.calls[0][0].duration).toBe(4000)
    })

    it('should send service contact notification', () => {
      const mockData = {
        userId: '789',
        message: '测试消息',
      }

      // 模拟showInAppNotification返回true
      const showInAppNotificationSpy = vi
        .spyOn(notificationService, 'showInAppNotification')
        .mockReturnValue(true)

      const result = notificationService.sendServiceContactNotification(mockData)

      expect(result).toBe(true)
      expect(logger.info).toHaveBeenCalled()
      expect(showInAppNotificationSpy).toHaveBeenCalled()
      expect(showInAppNotificationSpy).toHaveBeenCalledWith(
        'info',
        '客服服务',
        '正在为您连接客服，请稍候...',
        { duration: 3000 }
      );

      // 恢复原始方法
      showInAppNotificationSpy.mockRestore()
    })

    it('should handle unknown notification type', async () => {
      const result = await notificationService.sendNotification('unknownType', {})

      expect(result).toBe(false)
      expect(logger.warn).toHaveBeenCalled()
    })
  })
})
