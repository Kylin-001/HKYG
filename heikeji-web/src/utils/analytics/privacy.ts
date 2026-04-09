/**
 * 隐私合规模块
 * GDPR/个人信息保护法合规处理
 * 包括：用户同意管理、数据脱敏、DNT检测等
 */

import { analyticsConfig } from '@/config/analytics.config'

/** 同意类型 */
export type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'all'

/** 用户同意状态 */
export interface ConsentState {
  necessary: boolean // 必要Cookie（始终为true）
  analytics: boolean // 分析追踪
  marketing: boolean // 营销追踪
  timestamp: number
  version: string
}

/** 敏感字段列表 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'credit_card',
  'card_number',
  'cvv',
  'ssn',
  'id_number',
  'bank_account'
]

class PrivacyManager {
  private consentState: ConsentState | null = null
  private readonly CONSENT_STORAGE_KEY = 'analytics_consent'
  private readonly CONSENT_VERSION = '1.0.0'

  constructor() {
    this.loadConsent()
  }

  /**
   * 检测浏览器Do Not Track设置
   */
  isDntEnabled(): boolean {
    if (!analyticsConfig.privacy.respectDNT) return false

    return (
      navigator.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes' ||
      (window as any).doNotTrack === true ||
      (navigator as any).msDoNotTrack === '1'
    )
  }

  /**
   * 检查是否允许追踪
   * 综合考虑DNT和用户同意
   */
  isTrackingAllowed(): boolean {
    if (this.isDntEnabled()) return false
    if (!this.hasConsent()) return false
    if (!this.consentState?.analytics) return false

    return true
  }

  /**
   * 是否已获取用户同意
   */
  hasConsent(): boolean {
    return this.consentState !== null
  }

  /**
   * 获取当前同意状态
   */
  getConsent(): ConsentState | null {
    return this.consentState
  }

  /**
   * 设置用户同意
   */
  setConsent(types: ConsentType[]): void {
    const now = Date.now()

    this.consentState = {
      necessary: true, // 必要Cookie始终允许
      analytics: types.includes('analytics') || types.includes('all'),
      marketing: types.includes('marketing') || types.includes('all'),
      timestamp: now,
      version: this.CONSENT_VERSION
    }

    this.saveConsent()

    // 触发同意变更事件
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: this.consentState
    }))
  }

  /**
   * 撤回所有非必要同意
   */
  revokeConsent(): void {
    this.setConsent(['necessary'])
  }

  /**
   * 仅允许必要Cookie
   */
  allowOnlyNecessary(): void {
    this.consentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
      version: this.CONSENT_VERSION
    }
    this.saveConsent()
  }

  /**
   * 允许所有追踪
   */
  allowAll(): void {
    this.setConsent(['all'])
  }

  /**
   * IP地址匿名化（去掉最后两段）
   */
  anonymizeIP(ip: string): string {
    if (!analyticsConfig.privacy.anonymizeIP) return ip

    try {
      const parts = ip.split('.')
      if (parts.length === 4) {
        // IPv4: 192.168.1.100 -> 192.168.0.0
        return `${parts[0]}.${parts[1]}.0.0`
      } else if (ip.includes(':')) {
        // IPv6: 简化处理，保留前半部分
        const ipv6Parts = ip.split(':')
        return `${ipv6Parts.slice(0, 4).join(':')}::`
      }
    } catch (error) {
      console.warn('[Privacy] IP匿名化失败:', error)
    }

    return ip
  }

  /**
   * 用户ID哈希处理
   */
  hashUserId(userId: string): string {
    if (!analyticsConfig.privacy.hashUserId) return userId

    try {
      // 使用简单的哈希算法（生产环境建议使用SHA-256）
      let hash = 0
      for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
      }
      return `user_${Math.abs(hash).toString(36)}`
    } catch (error) {
      console.warn('[Privacy] 用户ID哈希失败:', error)
      return 'user_anonymous'
    }
  }

  /**
   * 数据脱敏 - 移除敏感字段
   */
  maskSensitiveData(data: Record<string, any>): Record<string, any> {
    if (!analyticsConfig.privacy.maskSensitiveData) return data

    const masked = { ...data }

    for (const key of Object.keys(masked)) {
      const lowerKey = key.toLowerCase()

      // 检查是否是敏感字段
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
        masked[key] = '[REDACTED]'
      }

      // 特殊处理邮箱
      if (lowerKey === 'email' && typeof masked[key] === 'string') {
        masked[key] = this.maskEmail(masked[key])
      }

      // 特殊处理手机号
      if ((lowerKey === 'phone' || lowerKey === 'mobile' || lowerKey === 'tel') &&
          typeof masked[key] === 'string') {
        masked[key] = this.maskPhone(masked[key])
      }
    }

    return masked
  }

  /**
   * 邮箱脱敏
   */
  private maskEmail(email: string): string {
    try {
      const [username, domain] = email.split('@')
      if (!domain) return email

      const maskedUsername =
        username.length > 2
          ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
          : username[0] + '*'

      return `${maskedUsername}@${domain}`
    } catch {
      return email
    }
  }

  /**
   * 手机号脱敏
   */
  private maskPhone(phone: string): string {
    try {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length < 7) return phone

      return cleaned.slice(0, 3) + '****' + cleaned.slice(-4)
    } catch {
      return phone
    }
  }

  /**
   * 从localStorage加载同意状态
   */
  private loadConsent(): void {
    try {
      const stored = localStorage.getItem(this.CONSENT_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentState

        // 版本检查，如果版本不匹配则重新请求同意
        if (parsed.version === this.CONSENT_VERSION) {
          this.consentState = parsed
        } else {
          localStorage.removeItem(this.CONSENT_STORAGE_KEY)
          this.consentState = null
        }
      }
    } catch (error) {
      console.warn('[Privacy] 加载同意状态失败:', error)
      this.consentState = null
    }
  }

  /**
   * 保存同意状态到localStorage
   */
  private saveConsent(): void {
    try {
      if (this.consentState) {
        localStorage.setItem(
          this.CONSENT_STORAGE_KEY,
          JSON.stringify(this.consentState)
        )
      }
    } catch (error) {
      console.warn('[Privacy] 保存同意状态失败:', error)
    }
  }

  /**
   * 清除所有存储的同意信息
   */
  clearConsentData(): void {
    try {
      localStorage.removeItem(this.CONSENT_STORAGE_KEY)
      this.consentState = null
    } catch (error) {
      console.warn('[Privacy] 清除同意数据失败:', error)
    }
  }

  /**
   * 数据保留策略 - 检查是否应该删除旧数据
   * 原始数据90天后自动删除
   */
  shouldRetainData(timestamp: number): boolean {
    const RETENTION_DAYS = 90
    const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000
    const age = Date.now() - timestamp

    return age < retentionMs
  }
}

/** 全局隐私管理器实例 */
export const privacyManager = new PrivacyManager()

/**
 * 检查并显示Cookie同意弹窗（如果需要）
 * 返回true表示需要显示弹窗
 */
export function checkAndRequestConsent(): boolean {
  // 开发环境默认允许所有
  if (import.meta.env.DEV) {
    privacyManager.allowAll()
    return false
  }

  // 如果不需要同意或已有同意，则不需要显示弹窗
  if (!analyticsConfig.privacy.cookieConsentRequired) {
    privacyManager.allowAll()
    return false
  }

  if (privacyManager.hasConsent()) {
    return false
  }

  return true
}
