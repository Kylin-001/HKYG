/**
 * API速率限制模块
 * 用于防止API请求过于频繁
 */

interface RateLimitConfig {
  windowMs: number // 时间窗口（毫秒）
  maxRequests: number // 最大请求数
  skipSuccessfulRequests?: boolean // 是否跳过成功的请求
  skipFailedRequests?: boolean // 是否跳过失败的请求
}

interface RateLimitEntry {
  count: number
  resetTime: number
  lastRequestTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(config: RateLimitConfig) {
    this.config = config
    this.startCleanup()
  }

  /**
   * 检查请求是否被允许
   * @param key 限制键（通常是API路径或用户ID）
   * @returns 是否允许请求
   */
  isAllowed(key: string): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    // 如果没有记录，创建新记录
    if (!entry) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
        lastRequestTime: now,
      })
      return true
    }

    // 如果时间窗口已过，重置计数
    if (now > entry.resetTime) {
      entry.count = 1
      entry.resetTime = now + this.config.windowMs
      entry.lastRequestTime = now
      return true
    }

    // 检查是否超过限制
    if (entry.count >= this.config.maxRequests) {
      return false
    }

    // 增加计数
    entry.count++
    entry.lastRequestTime = now
    return true
  }

  /**
   * 获取剩余请求次数
   * @param key 限制键
   * @returns 剩余请求次数
   */
  getRemainingRequests(key: string): number {
    const entry = this.store.get(key)
    if (!entry) {
      return this.config.maxRequests
    }

    const now = Date.now()
    if (now > entry.resetTime) {
      return this.config.maxRequests
    }

    return Math.max(0, this.config.maxRequests - entry.count)
  }

  /**
   * 获取重置时间
   * @param key 限制键
   * @returns 重置时间（毫秒时间戳）
   */
  getResetTime(key: string): number {
    const entry = this.store.get(key)
    if (!entry) {
      return Date.now() + this.config.windowMs
    }

    return entry.resetTime
  }

  /**
   * 标记请求成功
   * @param key 限制键
   */
  markSuccess(key: string): void {
    if (this.config.skipSuccessfulRequests) {
      const entry = this.store.get(key)
      if (entry && entry.count > 0) {
        entry.count--
      }
    }
  }

  /**
   * 标记请求失败
   * @param key 限制键
   */
  markFailure(key: string): void {
    if (this.config.skipFailedRequests) {
      const entry = this.store.get(key)
      if (entry && entry.count > 0) {
        entry.count--
      }
    }
  }

  /**
   * 重置指定键的限制
   * @param key 限制键
   */
  reset(key: string): void {
    this.store.delete(key)
  }

  /**
   * 重置所有限制
   */
  resetAll(): void {
    this.store.clear()
  }

  /**
   * 清理过期的记录
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }

  /**
   * 启动定期清理
   */
  private startCleanup(): void {
    // 每分钟清理一次过期记录
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  /**
   * 停止定期清理
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 获取所有限制的状态
   * @returns 所有限制状态
   */
  getStatus(): Record<
    string,
    { count: number; remaining: number; resetTime: number; lastRequestTime: number }
  > {
    const status: Record<
      string,
      { count: number; remaining: number; resetTime: number; lastRequestTime: number }
    > = {}

    for (const [key, entry] of this.store.entries()) {
      status[key] = {
        count: entry.count,
        remaining: this.getRemainingRequests(key),
        resetTime: entry.resetTime,
        lastRequestTime: entry.lastRequestTime,
      }
    }

    return status
  }
}

// 创建默认的速率限制器实例
export const createRateLimiter = (config: RateLimitConfig): RateLimiter => {
  return new RateLimiter(config)
}

// 预定义的速率限制配置
export const RATE_LIMIT_CONFIGS = {
  // 通用API限制：每分钟60次请求
  general: {
    windowMs: parseInt(import.meta.env.VITE_APP_RATE_LIMIT_WINDOW || '60') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_RATE_LIMIT_MAX_REQUESTS || '60'),
  },

  // 登录API限制：每分钟5次请求
  login: {
    windowMs: parseInt(import.meta.env.VITE_APP_LOGIN_RATE_LIMIT_WINDOW || '60') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_LOGIN_RATE_LIMIT_MAX_REQUESTS || '5'),
  },

  // 注册API限制：每小时3次请求
  register: {
    windowMs: parseInt(import.meta.env.VITE_APP_REGISTER_RATE_LIMIT_WINDOW || '3600') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_REGISTER_RATE_LIMIT_MAX_REQUESTS || '3'),
  },

  // 敏感操作API限制：每分钟10次请求
  sensitive: {
    windowMs: parseInt(import.meta.env.VITE_APP_SENSITIVE_RATE_LIMIT_WINDOW || '60') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_SENSITIVE_RATE_LIMIT_MAX_REQUESTS || '10'),
  },

  // 文件上传API限制：每分钟5次请求
  upload: {
    windowMs: parseInt(import.meta.env.VITE_APP_UPLOAD_RATE_LIMIT_WINDOW || '60') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_UPLOAD_RATE_LIMIT_MAX_REQUESTS || '5'),
  },

  // 搜索API限制：每分钟30次请求
  search: {
    windowMs: parseInt(import.meta.env.VITE_APP_SEARCH_RATE_LIMIT_WINDOW || '60') * 1000,
    maxRequests: parseInt(import.meta.env.VITE_APP_SEARCH_RATE_LIMIT_MAX_REQUESTS || '30'),
  },
}

// 创建预定义的速率限制器
export const rateLimiters = {
  general: createRateLimiter(RATE_LIMIT_CONFIGS.general),
  login: createRateLimiter(RATE_LIMIT_CONFIGS.login),
  register: createRateLimiter(RATE_LIMIT_CONFIGS.register),
  sensitive: createRateLimiter(RATE_LIMIT_CONFIGS.sensitive),
  upload: createRateLimiter(RATE_LIMIT_CONFIGS.upload),
  search: createRateLimiter(RATE_LIMIT_CONFIGS.search),
}

export default RateLimiter
