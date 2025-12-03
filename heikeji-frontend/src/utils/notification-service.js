import logger from '@/utils/logger'
import { ElNotification } from 'element-plus'

/**
 * 通知服务类 - 处理各种类型的系统通知，特别是支付相关通知
 */
class NotificationService {
  constructor() {
    this.supportedChannels = {
      IN_APP: 'inApp', // 应用内通知
      SMS: 'sms', // 短信通知
      EMAIL: 'email', // 邮件通知
      WECHAT: 'wechat', // 微信通知
    }

    // 存储用户通知偏好设置
    this.userPreferences = this.loadUserPreferences()
  }

  /**
   * 加载用户通知偏好设置
   * @returns {Object} 用户通知偏好
   */
  loadUserPreferences() {
    try {
      const preferences = localStorage.getItem('notificationPreferences')
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences()
    } catch (error) {
      logger.error('加载通知偏好设置失败', error)
      return this.getDefaultPreferences()
    }
  }

  /**
   * 获取默认通知偏好
   * @returns {Object} 默认偏好设置
   */
  getDefaultPreferences() {
    return {
      paymentSuccess: { inApp: true, sms: true, email: false, wechat: false },
      paymentFailed: { inApp: true, sms: true, email: true, wechat: false },
      refundApproved: { inApp: true, sms: true, email: false, wechat: false },
      refundRejected: { inApp: true, sms: true, email: true, wechat: false },
      paymentReminder: { inApp: true, sms: false, email: false, wechat: false },
      orderStatusChange: { inApp: true, sms: false, email: false, wechat: false },
    }
  }

  /**
   * 保存用户通知偏好
   * @param {Object} preferences - 用户偏好设置
   */
  saveUserPreferences(preferences) {
    try {
      this.userPreferences = { ...this.userPreferences, ...preferences }
      localStorage.setItem('notificationPreferences', JSON.stringify(this.userPreferences))
      return true
    } catch (error) {
      logger.error('保存通知偏好设置失败', error)
      return false
    }
  }

  /**
   * 显示应用内通知
   * @param {string} type - 通知类型 (success, warning, info, error)
   * @param {string} title - 通知标题
   * @param {string} message - 通知内容
   * @param {Object} options - 额外选项
   */
  showInAppNotification(type, title, message, options = {}) {
    try {
      ElNotification({
        title,
        message,
        type,
        duration: options.duration || 4500,
        showClose: options.showClose !== false,
        position: options.position || 'top-right',
        ...options,
      })
      return true
    } catch (error) {
      logger.error('显示应用内通知失败', error)
      return false
    }
  }

  /**
   * 发送通知到指定渠道
   * @param {string} notificationType - 通知类型
   * @param {Object} data - 通知数据
   */
  async sendNotification(notificationType, data) {
    const preferences = this.userPreferences[notificationType]
    if (!preferences) {
      logger.warn(`未知的通知类型: ${notificationType}`)
      return false
    }

    try {
      // 发送应用内通知
      if (preferences.inApp) {
        await this.sendInAppNotification(notificationType, data)
      }

      // 发送其他渠道通知 (这里只是模拟，实际应该调用对应的后端API)
      const otherChannels = []
      if (preferences.sms) otherChannels.push(this.supportedChannels.SMS)
      if (preferences.email) otherChannels.push(this.supportedChannels.EMAIL)
      if (preferences.wechat) otherChannels.push(this.supportedChannels.WECHAT)

      if (otherChannels.length > 0) {
        await this.sendExternalNotifications(notificationType, data, otherChannels)
      }

      return true
    } catch (error) {
      logger.error(`发送通知失败 [${notificationType}]`, error)
      return false
    }
  }

  /**
   * 发送应用内通知
   * @param {string} notificationType - 通知类型
   * @param {Object} data - 通知数据
   */
  async sendInAppNotification(notificationType, data) {
    switch (notificationType) {
      case 'paymentSuccess':
        return this.showInAppNotification(
          'success',
          '支付成功',
          `您的订单 ${data.orderId || '#'} 已支付成功，金额 ${data.amount || '0.00'}元`
        )
      case 'paymentFailed':
        return this.showInAppNotification(
          'error',
          '支付失败',
          `您的订单 ${data.orderId || '#'} 支付失败，请重试或联系客服`,
          { duration: 6000 }
        )
      case 'refundApproved':
        return this.showInAppNotification(
          'success',
          '退款成功',
          `您的退款申请 ${data.refundId || '#'} 已通过，退款金额 ${data.amount || '0.00'}元将在1-3个工作日内到账`
        )
      case 'refundRejected':
        return this.showInAppNotification(
          'warning',
          '退款失败',
          `您的退款申请 ${data.refundId || '#'} 未通过，原因：${data.reason || '请联系客服咨询详情'}`,
          { duration: 6000 }
        )
      case 'paymentReminder':
        return this.showInAppNotification(
          'warning',
          '支付提醒',
          `您的订单 ${data.orderId || '#'} 即将超时，请尽快完成支付`,
          { duration: 5000 }
        )
      case 'orderStatusChange':
        return this.showInAppNotification(
          'info',
          '订单状态更新',
          `您的订单 ${data.orderId || '#'} 状态已更新为：${data.status || '未知状态'}`,
          { duration: 4000 }
        )
      default:
        return this.showInAppNotification('info', '系统通知', data.message || '您有一条新消息', {
          duration: 3500,
        })
    }
  }

  /**
   * 发送外部通知 (模拟调用后端API)
   * @param {string} notificationType - 通知类型
   * @param {Object} data - 通知数据
   * @param {Array} channels - 通知渠道列表
   */
  async sendExternalNotifications(notificationType, data, channels) {
    // 这里只是模拟，实际应该调用后端API发送短信、邮件等
    try {
      // 记录日志，实际项目中应该调用对应的API
      logger.info(`发送外部通知 ${notificationType} 到渠道 ${channels.join(', ')}`, data)

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 100))

      return true
    } catch (error) {
      logger.error('发送外部通知失败', error)
      return false
    }
  }

  // 支付相关通知方法

  /**
   * 发送支付成功通知
   * @param {Object} data - 支付成功数据
   */
  sendPaymentSuccessNotification(data) {
    return this.sendNotification('paymentSuccess', data)
  }

  /**
   * 发送支付失败通知
   * @param {Object} data - 支付失败数据
   */
  sendPaymentFailedNotification(data) {
    return this.sendNotification('paymentFailed', data)
  }

  /**
   * 发送退款成功通知
   * @param {Object} data - 退款成功数据
   */
  sendRefundApprovedNotification(data) {
    return this.sendNotification('refundApproved', data)
  }

  /**
   * 发送退款拒绝通知
   * @param {Object} data - 退款拒绝数据
   */
  sendRefundRejectedNotification(data) {
    return this.sendNotification('refundRejected', data)
  }

  /**
   * 发送支付提醒通知
   * @param {Object} data - 支付提醒数据
   */
  sendPaymentReminder(data) {
    return this.sendNotification('paymentReminder', data)
  }

  /**
   * 发送订单状态变更通知
   * @param {Object} data - 订单状态变更数据
   */
  sendOrderStatusChangeNotification(data) {
    return this.sendNotification('orderStatusChange', data)
  }

  /**
   * 发送客服联系通知
   * @param {Object} data - 客服联系数据
   */
  sendServiceContactNotification(data) {
    try {
      // 记录客服联系事件
      logger.info('用户联系客服', data)

      // 显示应用内通知
      return this.showInAppNotification('info', '客服服务', '正在为您连接客服，请稍候...', {
        duration: 3000,
      })
    } catch (error) {
      logger.error('发送客服联系通知失败', error)
      return false
    }
  }
}

// 创建单例实例
const notificationService = new NotificationService()

export default notificationService
