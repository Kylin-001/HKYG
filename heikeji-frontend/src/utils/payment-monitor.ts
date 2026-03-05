import logger from './logger'

interface PaymentMetric {
  orderId: string
  paymentMethod: string
  startTime: number
  endTime: number
  duration: number
  status: 'processing' | 'success' | 'failed'
  attempts: number
}

interface PaymentStats {
  total: number
  success: number
  failed: number
  timeout: number
  successRate: number
  failureRate: number
  timeoutRate: number
  averageDuration: number
  paymentMethodStats: Record<string, any>
}

interface PaymentAlert {
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  data: any
}

interface AlertThresholds {
  failureRate: number
  averageDuration: number
  timeoutRate: number
}

export class PaymentMonitor {
  private static instance: PaymentMonitor
  private paymentMetrics: Map<string, PaymentMetric> = new Map()
  private alertThresholds: AlertThresholds = {
    failureRate: 0.05,
    averageDuration: 30000,
    timeoutRate: 0.02
  }
  private reportingInterval: number | null = null
  private static REPORTING_INTERVAL = 5 * 60 * 1000

  private constructor() {
    this.startPeriodicReporting()
  }

  static getInstance(): PaymentMonitor {
    if (!PaymentMonitor.instance) {
      PaymentMonitor.instance = new PaymentMonitor()
    }
    return PaymentMonitor.instance
  }

  recordPaymentStart(orderId: string, paymentMethod: string): void {
    this.paymentMetrics.set(orderId, {
      orderId,
      paymentMethod,
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      status: 'processing',
      attempts: 1
    })

    logger.info(`记录支付开始: ${orderId}, 方式: ${paymentMethod}`)
  }

  recordPaymentComplete(orderId: string, success: boolean): void {
    const metric = this.paymentMetrics.get(orderId)
    if (!metric) {
      logger.warn(`未找到支付记录: ${orderId}`)
      return
    }

    metric.endTime = Date.now()
    metric.duration = metric.endTime - metric.startTime
    metric.status = success ? 'success' : 'failed'

    logger.info(`记录支付完成: ${orderId}, 状态: ${metric.status}, 耗时: ${metric.duration}ms`)

    this.checkAlerts(metric)
  }

  recordPaymentRetry(orderId: string): void {
    const metric = this.paymentMetrics.get(orderId)
    if (!metric) return

    metric.attempts++
    logger.info(`记录支付重试: ${orderId}, 次数: ${metric.attempts}`)
  }

  getPaymentStats(timeRange: 'hour' | 'day' | 'week' = 'hour'): PaymentStats {
    const now = Date.now()
    const timeRanges = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }

    const startTime = now - timeRanges[timeRange]
    const metrics = Array.from(this.paymentMetrics.values())
      .filter(m => m.startTime >= startTime)

    const total = metrics.length
    const success = metrics.filter(m => m.status === 'success').length
    const failed = metrics.filter(m => m.status === 'failed').length
    const timeout = metrics.filter(m => m.duration > 30000).length

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0)

    const stats: PaymentStats = {
      total,
      success,
      failed,
      timeout,
      successRate: total > 0 ? success / total : 0,
      failureRate: total > 0 ? failed / total : 0,
      timeoutRate: total > 0 ? timeout / total : 0,
      averageDuration: total > 0 ? totalDuration / total : 0,
      paymentMethodStats: this.getPaymentMethodStats(metrics)
    }

    logger.info(`获取支付统计 [${timeRange}]:`, stats)
    return stats
  }

  private checkAlerts(metric: PaymentMetric): void {
    const stats = this.getPaymentStats('hour')

    if (stats.failureRate > this.alertThresholds.failureRate) {
      this.sendAlert({
        type: 'high_failure_rate',
        severity: 'critical',
        message: `支付失败率过高: ${(stats.failureRate * 100).toFixed(2)}%`,
        data: stats
      })
    }

    if (stats.timeoutRate > this.alertThresholds.timeoutRate) {
      this.sendAlert({
        type: 'high_timeout_rate',
        severity: 'warning',
        message: `支付超时率过高: ${(stats.timeoutRate * 100).toFixed(2)}%`,
        data: stats
      })
    }

    if (stats.averageDuration > this.alertThresholds.averageDuration) {
      this.sendAlert({
        type: 'slow_payment',
        severity: 'warning',
        message: `平均支付时长过长: ${(stats.averageDuration / 1000).toFixed(2)}秒`,
        data: stats
      })
    }
  }

  private sendAlert(alert: PaymentAlert): void {
    logger.warn('支付告警:', alert)

    fetch('/api/monitoring/alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alert)
    }).catch(error => {
      logger.error('发送告警失败:', error)
    })
  }

  private startPeriodicReporting(): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval)
    }

    this.reportingInterval = setInterval(() => {
      const stats = this.getPaymentStats('hour')
      this.reportStats(stats)
    }, this.REPORTING_INTERVAL)

    logger.info('启动定期上报，间隔: 5分钟')
  }

  private reportStats(stats: PaymentStats): void {
    fetch('/api/monitoring/payment-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stats)
    }).then(() => {
      logger.info('上报统计数据成功')
    }).catch(error => {
      logger.error('上报统计数据失败:', error)
    })
  }

  clearOldMetrics(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    const cutoffTime = now - maxAge

    for (const [orderId, metric] of this.paymentMetrics.entries()) {
      if (metric.startTime < cutoffTime) {
        this.paymentMetrics.delete(orderId)
      }
    }

    logger.info(`清理${maxAge / (60 * 60 * 1000)}小时前的支付记录`)
  }

  getMetric(orderId: string): PaymentMetric | null {
    return this.paymentMetrics.get(orderId) || null
  }

  getAllMetrics(): PaymentMetric[] {
    return Array.from(this.paymentMetrics.values())
  }

  destroy(): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval)
      this.reportingInterval = null
    }
    this.paymentMetrics.clear()
    logger.info('销毁支付监控实例')
  }
}

export default PaymentMonitor
