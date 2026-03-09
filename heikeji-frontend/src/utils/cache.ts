/**
 * Redis缓存管理模块
 * 用于优化数据缓存，提高应用性能
 */

// 缓存配置
interface CacheConfig {
  host: string
  port: number
  password?: string
  db?: number
  keyPrefix: string
  ttl: number // 默认过期时间（秒）
  maxRetries: number
  retryDelayOnFailover: number
  lazyConnect: boolean
  keepAlive: number
  connectTimeout: number
  commandTimeout: number
}

// 缓存项
interface CacheItem<T = any> {
  key: string
  value: T
  ttl?: number
  tags?: string[]
  createdAt: number
  updatedAt: number
  hitCount: number
  lastAccessTime: number
}

// 缓存统计
interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  totalKeys: number
  memoryUsage: number
  expiredKeys: number
  evictedKeys: number
}

// 缓存策略
enum CacheStrategy {
  LRU = 'lru', // 最近最少使用
  LFU = 'lfu', // 最少使用频率
  TTL = 'ttl', // 基于时间
  RANDOM = 'random', // 随机
}

// 默认配置
const DEFAULT_CONFIG: CacheConfig = {
  host: import.meta.env.VITE_REDIS_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_REDIS_PORT || '6379'),
  password: import.meta.env.VITE_REDIS_PASSWORD,
  db: parseInt(import.meta.env.VITE_REDIS_DB || '0'),
  keyPrefix: import.meta.env.VITE_REDIS_KEY_PREFIX || 'heikeji:',
  ttl: parseInt(import.meta.env.VITE_REDIS_DEFAULT_TTL || '3600'), // 1小时
  maxRetries: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
}

// Redis缓存管理器
class RedisCacheManager {
  private config: CacheConfig
  private client: any // Redis客户端
  private isConnected: boolean = false
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }
  
  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }
  
  // 连接Redis
  async connect(): Promise<void> {
    try {
      // 动态导入Redis客户端
      const Redis = await import('ioredis')
      
      this.client = new Redis.default({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
        db: this.config.db,
        keyPrefix: this.config.keyPrefix,
        maxRetriesPerRequest: this.config.maxRetries,
        retryDelayOnFailover: this.config.retryDelayOnFailover,
        lazyConnect: this.config.lazyConnect,
        keepAlive: this.config.keepAlive,
        connectTimeout: this.config.connectTimeout,
        commandTimeout: this.config.commandTimeout,
      })
      
      // 监听连接事件
      this.client.on('connect', () => {
        console.log('Redis连接成功')
        this.isConnected = true
      })
      
      this.client.on('error', (error: Error) => {
        console.error('Redis连接错误:', error)
        this.isConnected = false
      })
      
      this.client.on('close', () => {
        console.log('Redis连接关闭')
        this.isConnected = false
      })
      
      // 测试连接
      await this.client.ping()
      
      // 更新统计信息
      await this.updateStats()
      
    } catch (error) {
      console.error('Redis连接失败:', error)
      this.isConnected = false
      throw error
    }
  }
  
  // 断开连接
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit()
      this.isConnected = false
    }
  }
  
  // 设置缓存
  async set<T>(key: string, value: T, ttl?: number, tags?: string[]): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      const cacheItem: CacheItem<T> = {
        key,
        value,
        ttl: ttl || this.config.ttl,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        hitCount: 0,
        lastAccessTime: Date.now(),
      }
      
      // 设置主数据
      await this.client.set(key, JSON.stringify(cacheItem), 'EX', ttl || this.config.ttl)
      
      // 设置标签索引
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          await this.client.sadd(`tag:${tag}`, key)
          await this.client.expire(`tag:${tag}`, ttl || this.config.ttl)
        }
      }
      
      // 更新统计
      this.stats.totalKeys++
      this.stats.memoryUsage += JSON.stringify(cacheItem).length
      
    } catch (error) {
      console.error('设置缓存失败:', error)
      throw error
    }
  }
  
  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      const cached = await this.client.get(key)
      
      if (cached) {
        const cacheItem: CacheItem<T> = JSON.parse(cached)
        
        // 更新访问信息
        cacheItem.hitCount++
        cacheItem.lastAccessTime = Date.now()
        
        // 更新缓存项
        await this.client.set(key, JSON.stringify(cacheItem), 'EX', cacheItem.ttl)
        
        // 更新统计
        this.stats.hits++
        this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses)
        
        return cacheItem.value
      } else {
        // 更新统计
        this.stats.misses++
        this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses)
        
        return null
      }
    } catch (error) {
      console.error('获取缓存失败:', error)
      throw error
    }
  }
  
  // 删除缓存
  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      // 获取缓存项信息
      const cached = await this.client.get(key)
      if (cached) {
        const cacheItem: CacheItem = JSON.parse(cached)
        
        // 删除标签索引
        if (cacheItem.tags) {
          for (const tag of cacheItem.tags) {
            await this.client.srem(`tag:${tag}`, key)
          }
        }
      }
      
      // 删除主数据
      await this.client.del(key)
      
      // 更新统计
      this.stats.totalKeys--
      
    } catch (error) {
      console.error('删除缓存失败:', error)
      throw error
    }
  }
  
  // 检查缓存是否存在
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      return await this.client.exists(key) === 1
    } catch (error) {
      console.error('检查缓存存在失败:', error)
      return false
    }
  }
  
  // 设置缓存过期时间
  async expire(key: string, ttl: number): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      await this.client.expire(key, ttl)
    } catch (error) {
      console.error('设置缓存过期时间失败:', error)
      throw error
    }
  }
  
  // 获取缓存剩余过期时间
  async ttl(key: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      return await this.client.ttl(key)
    } catch (error) {
      console.error('获取缓存过期时间失败:', error)
      return -1
    }
  }
  
  // 根据标签获取缓存键
  async getKeysByTag(tag: string): Promise<string[]> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      return await this.client.smembers(`tag:${tag}`)
    } catch (error) {
      console.error('根据标签获取缓存键失败:', error)
      return []
    }
  }
  
  // 根据标签删除缓存
  async delByTag(tag: string): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      const keys = await this.getKeysByTag(tag)
      
      if (keys.length > 0) {
        // 删除所有相关缓存
        await this.client.del(...keys)
        
        // 删除标签索引
        await this.client.del(`tag:${tag}`)
        
        // 更新统计
        this.stats.totalKeys -= keys.length
      }
    } catch (error) {
      console.error('根据标签删除缓存失败:', error)
      throw error
    }
  }
  
  // 模糊匹配获取缓存键
  async getKeysByPattern(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      return await this.client.keys(pattern)
    } catch (error) {
      console.error('模糊匹配获取缓存键失败:', error)
      return []
    }
  }
  
  // 清空所有缓存
  async flushall(): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      await this.client.flushall()
      
      // 重置统计
      this.stats = {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalKeys: 0,
        memoryUsage: 0,
        expiredKeys: 0,
        evictedKeys: 0,
      }
    } catch (error) {
      console.error('清空缓存失败:', error)
      throw error
    }
  }
  
  // 更新统计信息
  async updateStats(): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      // 获取Redis信息
      const info = await this.client.info('memory')
      const keyspace = await this.client.info('keyspace')
      
      // 解析内存使用
      const memoryMatch = info.match(/used_memory:(\d+)/)
      if (memoryMatch) {
        this.stats.memoryUsage = parseInt(memoryMatch[1])
      }
      
      // 解析键数量
      const keysMatch = keyspace.match(/db0:keys=(\d+)/)
      if (keysMatch) {
        this.stats.totalKeys = parseInt(keysMatch[1])
      }
    } catch (error) {
      console.error('更新统计信息失败:', error)
    }
  }
  
  // 获取统计信息
  getStats(): CacheStats {
    return {
      ...this.stats,
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? this.stats.hits / (this.stats.hits + this.stats.misses) 
        : 0,
    }
  }
  
  // 批量获取缓存
  async mget<T>(keys: string[]): Promise<Array<T | null>> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      const values = await this.client.mget(...keys)
      
      return values.map(value => {
        if (value) {
          const cacheItem: CacheItem<T> = JSON.parse(value)
          
          // 更新访问信息
          cacheItem.hitCount++
          cacheItem.lastAccessTime = Date.now()
          
          // 异步更新缓存项
          this.client.set(keys[values.indexOf(value)], JSON.stringify(cacheItem), 'EX', cacheItem.ttl).catch(err => {
            console.error('更新缓存项失败:', err)
          })
          
          // 更新统计
          this.stats.hits++
          
          return cacheItem.value
        } else {
          // 更新统计
          this.stats.misses++
          
          return null
        }
      })
    } catch (error) {
      console.error('批量获取缓存失败:', error)
      return keys.map(() => null)
    }
  }
  
  // 批量设置缓存
  async mset<T>(items: Array<{ key: string; value: T; ttl?: number; tags?: string[] }>): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      const pipeline = this.client.pipeline()
      
      for (const item of items) {
        const cacheItem: CacheItem<T> = {
          key: item.key,
          value: item.value,
          ttl: item.ttl || this.config.ttl,
          tags: item.tags,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hitCount: 0,
          lastAccessTime: Date.now(),
        }
        
        // 设置主数据
        pipeline.set(item.key, JSON.stringify(cacheItem), 'EX', item.ttl || this.config.ttl)
        
        // 设置标签索引
        if (item.tags && item.tags.length > 0) {
          for (const tag of item.tags) {
            pipeline.sadd(`tag:${tag}`, item.key)
            pipeline.expire(`tag:${tag}`, item.ttl || this.config.ttl)
          }
        }
      }
      
      await pipeline.exec()
      
      // 更新统计
      this.stats.totalKeys += items.length
      this.stats.memoryUsage += items.reduce((sum, item) => 
        sum + JSON.stringify(item).length, 0)
      
    } catch (error) {
      console.error('批量设置缓存失败:', error)
      throw error
    }
  }
  
  // 缓存预热
  async warmup<T>(items: Array<{ key: string; value: T; ttl?: number; tags?: string[] }>): Promise<void> {
    console.log(`开始缓存预热，共${items.length}项`)
    
    try {
      // 分批预热，避免阻塞
      const batchSize = 50
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        await this.mset(batch)
        
        console.log(`已预热 ${Math.min(i + batchSize, items.length)}/${items.length} 项`)
        
        // 短暂延迟，避免过载
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      console.log('缓存预热完成')
    } catch (error) {
      console.error('缓存预热失败:', error)
      throw error
    }
  }
  
  // 缓存清理
  async cleanup(): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    try {
      console.log('开始缓存清理')
      
      // 获取所有键
      const keys = await this.client.keys('*')
      let cleanedCount = 0
      
      for (const key of keys) {
        const ttl = await this.client.ttl(key)
        
        // 删除已过期的键
        if (ttl === -1) {
          await this.client.del(key)
          cleanedCount++
          this.stats.expiredKeys++
        }
      }
      
      // 更新统计
      this.stats.totalKeys -= cleanedCount
      
      console.log(`缓存清理完成，共清理${cleanedCount}项`)
    } catch (error) {
      console.error('缓存清理失败:', error)
      throw error
    }
  }
}

// 创建缓存管理器实例
export const createCacheManager = (config?: Partial<CacheConfig>): RedisCacheManager => {
  return new RedisCacheManager(config)
}

// 创建默认缓存管理器
export const defaultCacheManager = createCacheManager()

// 缓存装饰器
export function Cacheable(ttl?: number, tags?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      // 生成缓存键
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`
      
      // 尝试从缓存获取
      const cached = await defaultCacheManager.get(cacheKey)
      if (cached !== null) {
        return cached
      }
      
      // 执行原方法
      const result = await originalMethod.apply(this, args)
      
      // 设置缓存
      await defaultCacheManager.set(cacheKey, result, ttl, tags)
      
      return result
    }
    
    return descriptor
  }
}

export {
  RedisCacheManager,
  CacheItem,
  CacheStats,
  CacheStrategy,
}

export default RedisCacheManager