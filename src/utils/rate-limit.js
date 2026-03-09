/**
 * API速率限制中间件
 * 用于防止API滥用和DDoS攻击
 */

const Redis = require('ioredis')
const crypto = require('crypto')

/**
 * 速率限制器类
 */
class RateLimiter {
  constructor(options = {}) {
    this.options = {
      // Redis配置
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB || 0
      },
      // 默认限制规则
      rules: [
        {
          name: 'default',
          windowMs: 60 * 1000, // 1分钟
          max: 100, // 每分钟最多100次请求
          message: '请求过于频繁，请稍后再试'
        },
        {
          name: 'strict',
          windowMs: 60 * 1000, // 1分钟
          max: 10, // 每分钟最多10次请求
          message: '请求过于频繁，请稍后再试'
        },
        {
          name: 'auth',
          windowMs: 15 * 60 * 1000, // 15分钟
          max: 5, // 每15分钟最多5次登录尝试
          message: '登录尝试过于频繁，请15分钟后再试'
        }
      ],
      // 自定义规则获取函数
      ruleGetter: null,
      // 键前缀
      keyPrefix: 'rate_limit:',
      // 是否跳过成功请求
      skipSuccessfulRequests: false,
      // 是否跳过失败请求
      skipFailedRequests: false,
      ...options
    }
    
    this.redis = new Redis(this.options.redis)
    this.rulesMap = new Map()
    
    // 初始化规则映射
    this.options.rules.forEach(rule => {
      this.rulesMap.set(rule.name, rule)
    })
  }
  
  /**
   * 获取客户端标识
   */
  getClientIdentifier(req) {
    // 优先使用用户ID
    if (req.user && req.user.id) {
      return `user:${req.user.id}`
    }
    
    // 其次使用IP地址
    const ip = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               req.headers['x-forwarded-for'] ||
               req.headers['x-real-ip'] ||
               'unknown'
    
    return `ip:${ip}`
  }
  
  /**
   * 获取请求标识
   */
  getRequestIdentifier(req) {
    const clientId = this.getClientIdentifier(req)
    const path = req.path || req.originalUrl || req.url || 'unknown'
    const method = req.method || 'GET'
    
    // 生成基于路径和方法的哈希
    const pathHash = crypto.createHash('md5')
      .update(`${method}:${path}`)
      .digest('hex')
    
    return `${clientId}:${pathHash}`
  }
  
  /**
   * 获取速率限制键
   */
  getRateLimitKey(identifier, ruleName) {
    const timestamp = Date.now()
    const windowMs = this.rulesMap.get(ruleName).windowMs
    const windowStart = Math.floor(timestamp / windowMs) * windowMs
    
    return `${this.options.keyPrefix}${identifier}:${ruleName}:${windowStart}`
  }
  
  /**
   * 检查速率限制
   */
  async checkRateLimit(req, ruleName = 'default') {
    const rule = this.rulesMap.get(ruleName)
    if (!rule) {
      throw new Error(`未找到速率限制规则: ${ruleName}`)
    }
    
    const identifier = this.getRequestIdentifier(req)
    const key = this.getRateLimitKey(identifier, ruleName)
    
    try {
      // 获取当前计数
      const current = await this.redis.incr(key)
      
      // 设置过期时间
      if (current === 1) {
        await this.redis.expire(key, Math.ceil(rule.windowMs / 1000))
      }
      
      // 检查是否超过限制
      const isExceeded = current > rule.max
      
      return {
        isExceeded,
        current,
        max: rule.max,
        remaining: Math.max(0, rule.max - current),
        resetTime: Date.now() + rule.windowMs,
        rule
      }
    } catch (error) {
      console.error('速率限制检查失败:', error)
      // Redis失败时允许请求通过
      return {
        isExceeded: false,
        current: 0,
        max: rule.max,
        remaining: rule.max,
        resetTime: Date.now() + rule.windowMs,
        rule
      }
    }
  }
  
  /**
   * 获取自定义规则
   */
  getCustomRule(req) {
    if (!this.options.ruleGetter || typeof this.options.ruleGetter !== 'function') {
      return 'default'
    }
    
    try {
      const ruleName = this.options.ruleGetter(req)
      return this.rulesMap.has(ruleName) ? ruleName : 'default'
    } catch (error) {
      console.error('获取自定义规则失败:', error)
      return 'default'
    }
  }
  
  /**
   * 清除速率限制计数
   */
  async clearRateLimit(req, ruleName = 'default') {
    const identifier = this.getRequestIdentifier(req)
    const key = this.getRateLimitKey(identifier, ruleName)
    
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('清除速率限制失败:', error)
      return false
    }
  }
  
  /**
   * 获取速率限制状态
   */
  async getRateLimitStatus(req, ruleName = 'default') {
    const rule = this.rulesMap.get(ruleName)
    if (!rule) {
      throw new Error(`未找到速率限制规则: ${ruleName}`)
    }
    
    const identifier = this.getRequestIdentifier(req)
    const key = this.getRateLimitKey(identifier, ruleName)
    
    try {
      const current = await this.redis.get(key) || 0
      const ttl = await this.redis.ttl(key)
      
      return {
        current: parseInt(current),
        max: rule.max,
        remaining: Math.max(0, rule.max - parseInt(current)),
        resetTime: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + rule.windowMs,
        rule
      }
    } catch (error) {
      console.error('获取速率限制状态失败:', error)
      return {
        current: 0,
        max: rule.max,
        remaining: rule.max,
        resetTime: Date.now() + rule.windowMs,
        rule
      }
    }
  }
}

/**
 * Express中间件
 */
function rateLimitMiddleware(options = {}) {
  const limiter = new RateLimiter(options)
  
  return async (req, res, next) => {
    try {
      // 获取规则名称
      const ruleName = limiter.getCustomRule(req)
      
      // 检查速率限制
      const result = await limiter.checkRateLimit(req, ruleName)
      
      // 设置响应头
      res.set({
        'X-RateLimit-Limit': result.max,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toUTCString()
      })
      
      // 如果超过限制，返回错误
      if (result.isExceeded) {
        return res.status(429).json({
          code: 'RATE_LIMIT_EXCEEDED',
          message: result.rule.message,
          data: {
            limit: result.max,
            remaining: result.remaining,
            resetTime: result.resetTime,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          }
        })
      }
      
      // 将速率限制结果附加到请求对象
      req.rateLimit = result
      
      next()
    } catch (error) {
      console.error('速率限制中间件错误:', error)
      // 发生错误时允许请求通过
      next()
    }
  }
}

/**
 * Koa中间件
 */
function koaRateLimitMiddleware(options = {}) {
  const limiter = new RateLimiter(options)
  
  return async (ctx, next) => {
    try {
      // 获取规则名称
      const ruleName = limiter.getCustomRule(ctx.request)
      
      // 检查速率限制
      const result = await limiter.checkRateLimit(ctx.request, ruleName)
      
      // 设置响应头
      ctx.set({
        'X-RateLimit-Limit': result.max,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toUTCString()
      })
      
      // 如果超过限制，返回错误
      if (result.isExceeded) {
        ctx.status = 429
        ctx.body = {
          code: 'RATE_LIMIT_EXCEEDED',
          message: result.rule.message,
          data: {
            limit: result.max,
            remaining: result.remaining,
            resetTime: result.resetTime,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          }
        }
        return
      }
      
      // 将速率限制结果附加到上下文
      ctx.rateLimit = result
      
      await next()
    } catch (error) {
      console.error('速率限制中间件错误:', error)
      // 发生错误时允许请求通过
      await next()
    }
  }
}

/**
 * Vue路由守卫
 */
function createVueRateLimitGuard(router, options = {}) {
  const limiter = new RateLimiter(options)
  
  return async (to, from, next) => {
    try {
      // 模拟请求对象
      const req = {
        path: to.path,
        method: 'GET',
        user: to.meta.user || null,
        ip: to.meta.ip || 'unknown'
      }
      
      // 获取规则名称
      const ruleName = limiter.getCustomRule(req)
      
      // 检查速率限制
      const result = await limiter.checkRateLimit(req, ruleName)
      
      // 如果超过限制，阻止导航
      if (result.isExceeded) {
        // 可以跳转到错误页面或显示提示
        next({
          path: '/error/rate-limit',
          query: {
            message: result.rule.message,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          }
        })
        return
      }
      
      // 将速率限制结果附加到路由元信息
      to.meta.rateLimit = result
      
      next()
    } catch (error) {
      console.error('速率限制守卫错误:', error)
      // 发生错误时允许导航
      next()
    }
  }
}

/**
 * 自定义速率限制规则示例
 */
const customRuleGetters = {
  // 基于用户角色的规则
  byUserRole: (req) => {
    if (!req.user) return 'default'
    
    switch (req.user.role) {
      case 'admin':
        return 'admin' // 管理员有更宽松的限制
      case 'vip':
        return 'vip' // VIP用户有中等限制
      default:
        return 'default' // 普通用户有默认限制
    }
  },
  
  // 基于API路径的规则
  byApiPath: (req) => {
    const path = req.path || ''
    
    if (path.includes('/auth/login')) {
      return 'auth' // 登录接口有特殊限制
    } else if (path.includes('/api/')) {
      return 'api' // API接口有通用限制
    } else {
      return 'default' // 其他请求使用默认限制
    }
  },
  
  // 基于IP的规则
  byIp: (req) => {
    const ip = req.ip || 'unknown'
    
    // 检查IP是否在黑名单中
    if (isIpInBlacklist(ip)) {
      return 'blacklist' // 黑名单IP有严格限制
    }
    
    return 'default'
  }
}

/**
 * 检查IP是否在黑名单中
 */
function isIpInBlacklist(ip) {
  // 这里应该从数据库或配置文件中获取黑名单
  const blacklist = [
    '192.168.1.100',
    '10.0.0.50'
  ]
  
  return blacklist.includes(ip)
}

// 导出
module.exports = {
  RateLimiter,
  rateLimitMiddleware,
  koaRateLimitMiddleware,
  createVueRateLimitGuard,
  customRuleGetters
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  const { RateLimiter } = require('./rate-limit')
  
  console.log('=== 速率限制器示例 ===')
  
  // 创建速率限制器
  const limiter = new RateLimiter({
    rules: [
      {
        name: 'test',
        windowMs: 10 * 1000, // 10秒
        max: 5, // 每10秒最多5次请求
        message: '测试速率限制：每10秒最多5次请求'
      }
    ]
  })
  
  // 模拟请求对象
  const mockRequest = {
    ip: '127.0.0.1',
    path: '/api/test',
    method: 'GET'
  }
  
  // 测试速率限制
  async function testRateLimit() {
    console.log('开始测试速率限制...')
    
    for (let i = 1; i <= 7; i++) {
      const result = await limiter.checkRateLimit(mockRequest, 'test')
      console.log(`请求 ${i}: ${result.isExceeded ? '被限制' : '通过'} (当前: ${result.current}/${result.max})`)
      
      if (result.isExceeded) {
        console.log(`限制信息: ${result.rule.message}`)
        console.log(`重试时间: ${new Date(result.resetTime).toLocaleString()}`)
        break
      }
      
      // 模拟请求间隔
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  testRateLimit().catch(console.error)
}