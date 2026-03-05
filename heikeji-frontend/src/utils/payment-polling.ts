import logger from './logger'

interface PollingParams {
  orderId: string
  callback: (result: any) => void
  maxAttempts?: number
  baseInterval?: number
  maxInterval?: number
}

interface PollingConfig {
  orderId: string
  attempts: number
  currentInterval: number
  intervalId: number | null
  isActive: boolean
}

export class EnhancedPaymentPolling {
  private static pollingConfigs: Map<string, PollingConfig> = new Map()
  private static DEFAULT_MAX_ATTEMPTS = 30
  private static DEFAULT_BASE_INTERVAL = 2000
  private static DEFAULT_MAX_INTERVAL = 10000
  private static INTERVAL_MULTIPLIER = 1.5

  static startSmartPolling(params: PollingParams): () => void {
    const {
      orderId,
      callback,
      maxAttempts = this.DEFAULT_MAX_ATTEMPTS,
      baseInterval = this.DEFAULT_BASE_INTERVAL,
      maxInterval = this.DEFAULT_MAX_INTERVAL
    } = params

    const config: PollingConfig = {
      orderId,
      attempts: 0,
      currentInterval: baseInterval,
      intervalId: null,
      isActive: true
    }

    this.pollingConfigs.set(orderId, config)

    const poll = async () => {
      if (!config.isActive) return

      config.attempts++

      try {
        const result = await this.checkPaymentStatus(orderId)

        if (result.success) {
          this.stopPolling(orderId)
          callback(result)
          return
        }

        if (config.attempts >= maxAttempts) {
          this.stopPolling(orderId)
          callback({ success: false, timeout: true, message: '支付超时' })
          return
        }

        config.currentInterval = Math.min(
          config.currentInterval * this.INTERVAL_MULTIPLIER,
          maxInterval
        )

        logger.info(`轮询支付状态 [${config.attempts}/${maxAttempts}]，间隔: ${config.currentInterval}ms`)

        const intervalId = setTimeout(poll, config.currentInterval)
        config.intervalId = intervalId as unknown as number
        this.pollingConfigs.set(orderId, config)

      } catch (error) {
        logger.error('轮询支付状态失败:', error)

        if (config.attempts < maxAttempts) {
          const intervalId = setTimeout(poll, config.currentInterval)
          config.intervalId = intervalId as unknown as number
          this.pollingConfigs.set(orderId, config)
        } else {
          this.stopPolling(orderId)
          callback({ success: false, error: error.message || '轮询失败' })
        }
      }
    }

    const intervalId = setTimeout(poll, baseInterval)
    config.intervalId = intervalId as unknown as number
    this.pollingConfigs.set(orderId, config)

    return () => this.stopPolling(orderId)
  }

  static stopPolling(orderId: string): void {
    const config = this.pollingConfigs.get(orderId)
    if (!config) return

    config.isActive = false

    if (config.intervalId) {
      clearTimeout(config.intervalId)
      logger.info(`停止轮询订单: ${orderId}`)
    }

    this.pollingConfigs.delete(orderId)
  }

  static stopAllPolling(): void {
    for (const [orderId, config] of this.pollingConfigs.entries()) {
      if (config.intervalId) {
        clearTimeout(config.intervalId)
      }
      config.isActive = false
    }
    this.pollingConfigs.clear()
    logger.info('停止所有轮询任务')
  }

  static getPollingStatus(orderId: string): {
    isPolling: boolean
    attempts: number
    currentInterval: number
  } | null {
    const config = this.pollingConfigs.get(orderId)
    if (!config) return null

    return {
      isPolling: config.isActive,
      attempts: config.attempts,
      currentInterval: config.currentInterval
    }
  }

  private static async checkPaymentStatus(orderId: string): Promise<any> {
    try {
      const response = await fetch(`/api/payment/status/${orderId}`)
      const result = await response.json()
      return result
    } catch (error) {
      logger.error(`检查支付状态失败 [${orderId}]:`, error)
      throw error
    }
  }
}

export default EnhancedPaymentPolling
