/**
 * 安全日志审计模块
 * 用于记录和监控安全相关的事件
 */

import { maskUtils } from './data-mask'

export type SecurityEventType =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'sensitive_operation'
  | 'permission_denied'
  | 'rate_limit_exceeded'
  | 'data_access'
  | 'data_modification'
  | 'api_request'
  | 'security_violation'

export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SecurityLogEntry {
  id: string
  timestamp: number
  eventType: SecurityEventType
  level: SecurityLevel
  userId?: string
  username?: string
  ip?: string
  userAgent?: string
  action: string
  resource?: string
  result: 'success' | 'failure' | 'blocked'
  details?: Record<string, any>
  riskScore?: number
}

export interface SecurityAuditConfig {
  enableConsoleLog: boolean
  enableRemoteLog: boolean
  remoteLogEndpoint?: string
  sensitiveFields: string[]
  maskSensitiveData: boolean
  maxLogAge: number
  maxLogCount: number
}

const DEFAULT_CONFIG: SecurityAuditConfig = {
  enableConsoleLog: process.env.NODE_ENV !== 'production',
  enableRemoteLog: true,
  remoteLogEndpoint: '/api/security/log',
  sensitiveFields: ['password', 'token', 'secret', 'apiKey', 'creditCard'],
  maskSensitiveData: true,
  maxLogAge: 30 * 24 * 60 * 60 * 1000,
  maxLogCount: 10000,
}

class SecurityLogger {
  private config: SecurityAuditConfig
  private logBuffer: SecurityLogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<SecurityAuditConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.startFlushInterval()
  }

  private generateId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  private getClientInfo(): { ip: string; userAgent: string } {
    if (typeof window === 'undefined') {
      return { ip: 'unknown', userAgent: 'server' }
    }
    return {
      ip: (window as any).clientIP || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
    }
  }

  private maskSensitiveData(data: Record<string, any>): Record<string, any> {
    if (!this.config.maskSensitiveData) return data

    const masked = { ...data }
    for (const field of this.config.sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***MASKED***'
      }
    }
    return masked
  }

  private shouldLog(entry: SecurityLogEntry): boolean {
    if (entry.level === 'critical' || entry.level === 'high') {
      return true
    }
    if (entry.eventType === 'login_failed') {
      return true
    }
    if (entry.eventType === 'security_violation') {
      return true
    }
    return false
  }

  private async sendToRemote(entry: SecurityLogEntry): Promise<void> {
    if (!this.config.enableRemoteLog || !this.config.remoteLogEndpoint) {
      return
    }

    try {
      await fetch(this.config.remoteLogEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error('Failed to send security log to remote:', error)
    }
  }

  private flushLogs(): void {
    if (this.logBuffer.length === 0) return

    const logsToSend = [...this.logBuffer]
    this.logBuffer = []

    logsToSend.forEach(entry => {
      if (this.config.enableRemoteLog) {
        this.sendToRemote(entry)
      }
    })
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushLogs()
    }, 5000)
  }

  private stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }

  private calculateRiskScore(entry: SecurityLogEntry): number {
    let score = 0

    switch (entry.level) {
      case 'critical':
        score += 100
        break
      case 'high':
        score += 50
        break
      case 'medium':
        score += 25
        break
      case 'low':
        score += 10
        break
    }

    if (entry.result === 'failure') {
      score += 20
    }
    if (entry.result === 'blocked') {
      score += 30
    }

    if (entry.eventType === 'login_failed') {
      score += 15
    }
    if (entry.eventType === 'security_violation') {
      score += 40
    }

    return Math.min(score, 100)
  }

  log(params: {
    eventType: SecurityEventType
    level: SecurityLevel
    action: string
    userId?: string
    username?: string
    resource?: string
    result: 'success' | 'failure' | 'blocked'
    details?: Record<string, any>
  }): string {
    const clientInfo = this.getClientInfo()

    const entry: SecurityLogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      eventType: params.eventType,
      level: params.level,
      userId: params.userId,
      username: params.username,
      ip: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      action: params.action,
      resource: params.resource,
      result: params.result,
      details: params.details ? this.maskSensitiveData(params.details) : undefined,
    }

    entry.riskScore = this.calculateRiskScore(entry)

    if (this.config.enableConsoleLog && this.shouldLog(entry)) {
      const levelColor = {
        low: '\x1b[32m',
        medium: '\x1b[33m',
        high: '\x1b[35m',
        critical: '\x1b[31m',
      }[entry.level]

      console.log(
        `${levelColor}[${entry.level.toUpperCase()}]\x1b[0m ` +
          `[${entry.eventType}] ${entry.action} ` +
          `(user: ${entry.username || 'anonymous'}, ` +
          `result: ${entry.result}) ` +
          `risk: ${entry.riskScore}`
      )
    }

    this.logBuffer.push(entry)

    if (this.logBuffer.length >= this.config.maxLogCount) {
      this.flushLogs()
    }

    return entry.id
  }

  logLogin(params: {
    userId?: string
    username: string
    result: 'success' | 'failure'
    reason?: string
  }): string {
    return this.log({
      eventType: params.result === 'success' ? 'login' : 'login_failed',
      level: params.result === 'success' ? 'low' : 'medium',
      action: '用户登录',
      userId: params.userId,
      username: params.username,
      result: params.result,
      details: params.reason ? { reason: params.reason } : undefined,
    })
  }

  logLogout(params: { userId: string; username: string }): string {
    return this.log({
      eventType: 'logout',
      level: 'low',
      action: '用户登出',
      userId: params.userId,
      username: params.username,
      result: 'success',
    })
  }

  logSensitiveOperation(params: {
    userId: string
    username: string
    action: string
    resource?: string
    result: 'success' | 'failure' | 'blocked'
    details?: Record<string, any>
  }): string {
    return this.log({
      eventType: 'sensitive_operation',
      level: 'high',
      action: params.action,
      userId: params.userId,
      username: params.username,
      resource: params.resource,
      result: params.result,
      details: params.details,
    })
  }

  logPermissionDenied(params: {
    userId?: string
    username?: string
    action: string
    resource: string
    requiredPermission?: string
  }): string {
    return this.log({
      eventType: 'permission_denied',
      level: 'medium',
      action: params.action,
      userId: params.userId,
      username: params.username,
      resource: params.resource,
      result: 'blocked',
      details: params.requiredPermission
        ? { requiredPermission: params.requiredPermission }
        : undefined,
    })
  }

  logRateLimitExceeded(params: {
    userId?: string
    username?: string
    ip: string
    endpoint: string
    limit: number
    window: string
  }): string {
    return this.log({
      eventType: 'rate_limit_exceeded',
      level: 'high',
      action: 'API速率限制触发',
      userId: params.userId,
      username: params.username,
      result: 'blocked',
      details: {
        ip: params.ip,
        endpoint: params.endpoint,
        limit: params.limit,
        window: params.window,
      },
    })
  }

  logSecurityViolation(params: {
    userId?: string
    username?: string
    type: string
    description: string
    details?: Record<string, any>
  }): string {
    return this.log({
      eventType: 'security_violation',
      level: 'critical',
      action: params.type,
      userId: params.userId,
      username: params.username,
      result: 'blocked',
      details: {
        description: params.description,
        ...params.details,
      },
    })
  }

  getRecentLogs(count: number = 100): SecurityLogEntry[] {
    return this.logBuffer.slice(-count)
  }

  getLogsByLevel(level: SecurityLevel): SecurityLogEntry[] {
    return this.logBuffer.filter(log => log.level === level)
  }

  getLogsByUser(userId: string): SecurityLogEntry[] {
    return this.logBuffer.filter(log => log.userId === userId)
  }

  getHighRiskLogs(minScore: number = 50): SecurityLogEntry[] {
    return this.logBuffer.filter(log => (log.riskScore || 0) >= minScore)
  }

  clearLogs(): void {
    this.logBuffer = []
  }

  updateConfig(config: Partial<SecurityAuditConfig>): void {
    this.config = { ...this.config, ...config }
  }

  destroy(): void {
    this.stopFlushInterval()
    this.flushLogs()
  }
}

export const securityLogger = new SecurityLogger()

export default securityLogger
