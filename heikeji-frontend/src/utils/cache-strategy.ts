/**
 * 缓存策略管理模块
 * 用于实现不同的缓存策略和优化算法
 */

import { defaultCacheManager, CacheStrategy } from './cache'

// 缓存策略配置
interface StrategyConfig {
  name: string
  maxSize: number // 最大缓存项数
  maxMemory: number // 最大内存使用（字节）
  ttl: number // 默认过期时间（秒）
  cleanupInterval: number // 清理间隔（毫秒）
  strategy: CacheStrategy // 缓存策略
}

// LRU缓存项
interface LRUCacheItem {
  key: string
  value: any
  accessTime: number
  expireTime: number
  size: number
}

// LRU缓存实现
class LRUCache {
  private cache = new Map<string, LRUCacheItem>()
  private accessOrder: string[] = []
  private maxSize: number
  private maxMemory: number
  private currentMemory: number = 0
  
  constructor(maxSize: number, maxMemory: number) {
    this.maxSize = maxSize
    this.maxMemory = maxMemory
  }
  
  // 获取缓存项
  get(key: string): any {
    const item = this.cache.get(key)
    
    if (item && item.expireTime > Date.now()) {
      // 更新访问时间
      item.accessTime = Date.now()
      
      // 更新访问顺序
      this.moveToEnd(key)
      
      return item.value
    }
    
    return null
  }
  
  // 设置缓存项
  set(key: string, value: any, ttl: number): void {
    const size = this.calculateSize(value)
    const now = Date.now()
    const expireTime = now + ttl * 1000
    
    // 检查是否需要清理空间
    while (this.shouldEvict(size)) {
      this.evict()
    }
    
    // 添加新项
    this.cache.set(key, {
      key,
      value,
      accessTime: now,
      expireTime,
      size,
    })
    
    this.accessOrder.push(key)
    this.currentMemory += size
  }
  
  // 删除缓存项
  delete(key: string): void {
    const item = this.cache.get(key)
    if (item) {
      this.cache.delete(key)
      this.removeFromAccessOrder(key)
      this.currentMemory -= item.size
    }
  }
  
  // 清理过期项
  cleanup(): number {
    let cleanedCount = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expireTime <= now) {
        this.cache.delete(key)
        this.removeFromAccessOrder(key)
        this.currentMemory -= item.size
        cleanedCount++
      }
    }
    
    return cleanedCount
  }
  
  // 移动到访问顺序末尾
  private moveToEnd(key: string): void {
    this.removeFromAccessOrder(key)
    this.accessOrder.push(key)
  }
  
  // 从访问顺序中移除
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }
  
  // 检查是否需要清理
  private shouldEvict(newItemSize: number): boolean {
    return (
      this.cache.size >= this.maxSize ||
      this.currentMemory + newItemSize > this.maxMemory
    )
  }
  
  // 清理最少使用的项
  private evict(): void {
    if (this.accessOrder.length === 0) return
    
    // 找到最少使用的项
    let lruKey = this.accessOrder[0]
    let lruTime = this.cache.get(lruKey)?.accessTime || 0
    
    for (let i = 1; i < this.accessOrder.length; i++) {
      const key = this.accessOrder[i]
      const item = this.cache.get(key)
      
      if (item && item.accessTime < lruTime) {
        lruKey = key
        lruTime = item.accessTime
      }
    }
    
    // 删除最少使用的项
    const item = this.cache.get(lruKey)
    if (item) {
      this.cache.delete(lruKey)
      this.removeFromAccessOrder(lruKey)
      this.currentMemory -= item.size
    }
  }
  
  // 计算项大小
  private calculateSize(value: any): number {
    return JSON.stringify(value).length * 2 // 简单估算
  }
  
  // 获取统计信息
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemory,
      maxMemory: this.maxMemory,
      hitRate: 0, // 需要外部跟踪
    }
  }
}

// LFU缓存项
interface LFUCacheItem {
  key: string
  value: any
  frequency: number
  expireTime: number
  size: number
}

// LFU缓存实现
class LFUCache {
  private cache = new Map<string, LFUCacheItem>()
  private frequencyMap = new Map<string, number>()
  private maxSize: number
  private maxMemory: number
  private currentMemory: number = 0
  
  constructor(maxSize: number, maxMemory: number) {
    this.maxSize = maxSize
    this.maxMemory = maxMemory
  }
  
  // 获取缓存项
  get(key: string): any {
    const item = this.cache.get(key)
    
    if (item && item.expireTime > Date.now()) {
      // 增加访问频率
      item.frequency++
      this.frequencyMap.set(key, item.frequency)
      
      return item.value
    }
    
    return null
  }
  
  // 设置缓存项
  set(key: string, value: any, ttl: number): void {
    const size = this.calculateSize(value)
    const now = Date.now()
    const expireTime = now + ttl * 1000
    
    // 检查是否需要清理空间
    while (this.shouldEvict(size)) {
      this.evict()
    }
    
    // 添加新项
    this.cache.set(key, {
      key,
      value,
      frequency: 1,
      expireTime,
      size,
    })
    
    this.frequencyMap.set(key, 1)
    this.currentMemory += size
  }
  
  // 删除缓存项
  delete(key: string): void {
    const item = this.cache.get(key)
    if (item) {
      this.cache.delete(key)
      this.frequencyMap.delete(key)
      this.currentMemory -= item.size
    }
  }
  
  // 清理过期项
  cleanup(): number {
    let cleanedCount = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expireTime <= now) {
        this.cache.delete(key)
        this.frequencyMap.delete(key)
        this.currentMemory -= item.size
        cleanedCount++
      }
    }
    
    return cleanedCount
  }
  
  // 检查是否需要清理
  private shouldEvict(newItemSize: number): boolean {
    return (
      this.cache.size >= this.maxSize ||
      this.currentMemory + newItemSize > this.maxMemory
    )
  }
  
  // 清理最少使用的项
  private evict(): void {
    if (this.cache.size === 0) return
    
    // 找到最少使用的项
    let lfuKey = ''
    let minFrequency = Infinity
    
    for (const [key, frequency] of this.frequencyMap.entries()) {
      if (frequency < minFrequency) {
        lfuKey = key
        minFrequency = frequency
      }
    }
    
    // 删除最少使用的项
    const item = this.cache.get(lfuKey)
    if (item) {
      this.cache.delete(lfuKey)
      this.frequencyMap.delete(lfuKey)
      this.currentMemory -= item.size
    }
  }
  
  // 计算项大小
  private calculateSize(value: any): number {
    return JSON.stringify(value).length * 2 // 简单估算
  }
  
  // 获取统计信息
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemory,
      maxMemory: this.maxMemory,
      hitRate: 0, // 需要外部跟踪
    }
  }
}

// 缓存策略管理器
class CacheStrategyManager {
  private strategies = new Map<string, any>()
  private currentStrategy: string = 'lru'
  private cleanupInterval: any = null
  
  constructor() {
    // 注册默认策略
    this.registerStrategy('lru', new LRUCache(1000, 10 * 1024 * 1024)) // 1000项，10MB
    this.registerStrategy('lfu', new LFUCache(1000, 10 * 1024 * 1024)) // 1000项，10MB
    
    // 启动定期清理
    this.startCleanup()
  }
  
  // 注册缓存策略
  registerStrategy(name: string, strategy: any): void {
    this.strategies.set(name, strategy)
  }
  
  // 切换缓存策略
  switchStrategy(name: string): void {
    if (this.strategies.has(name)) {
      this.currentStrategy = name
      console.log(`切换到缓存策略: ${name}`)
    } else {
      console.error(`未知的缓存策略: ${name}`)
    }
  }
  
  // 获取当前策略
  getCurrentStrategy(): any {
    return this.strategies.get(this.currentStrategy)
  }
  
  // 获取缓存项
  get(key: string): any {
    const strategy = this.getCurrentStrategy()
    return strategy.get(key)
  }
  
  // 设置缓存项
  set(key: string, value: any, ttl: number): void {
    const strategy = this.getCurrentStrategy()
    strategy.set(key, value, ttl)
  }
  
  // 删除缓存项
  delete(key: string): void {
    const strategy = this.getCurrentStrategy()
    strategy.delete(key)
  }
  
  // 清理过期项
  cleanup(): number {
    const strategy = this.getCurrentStrategy()
    return strategy.cleanup()
  }
  
  // 获取统计信息
  getStats() {
    const strategy = this.getCurrentStrategy()
    return {
      ...strategy.getStats(),
      strategy: this.currentStrategy,
    }
  }
  
  // 启动定期清理
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const cleanedCount = this.cleanup()
      if (cleanedCount > 0) {
        console.log(`清理了${cleanedCount}个过期缓存项`)
      }
    }, 60000) // 每分钟清理一次
  }
  
  // 停止定期清理
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// 缓存预热管理器
class CacheWarmupManager {
  private warmupTasks = new Map<string, () => Promise<any>>()
  private isWarmingUp = false
  
  // 注册预热任务
  registerWarmupTask(name: string, task: () => Promise<any>): void {
    this.warmupTasks.set(name, task)
  }
  
  // 执行预热
  async warmup(): Promise<void> {
    if (this.isWarmingUp) {
      console.log('缓存预热正在进行中，跳过')
      return
    }
    
    this.isWarmingUp = true
    console.log('开始缓存预热')
    
    try {
      const tasks = Array.from(this.warmupTasks.entries())
      
      // 并行执行预热任务
      const promises = tasks.map(async ([name, task]) => {
        try {
          console.log(`执行预热任务: ${name}`)
          const startTime = Date.now()
          await task()
          const duration = Date.now() - startTime
          console.log(`预热任务完成: ${name}，耗时: ${duration}ms`)
        } catch (error) {
          console.error(`预热任务失败: ${name}`, error)
        }
      })
      
      await Promise.all(promises)
      
      console.log('缓存预热完成')
    } catch (error) {
      console.error('缓存预热失败:', error)
    } finally {
      this.isWarmingUp = false
    }
  }
  
  // 检查是否正在预热
  isWarmingUpInProgress(): boolean {
    return this.isWarmingUp
  }
}

// 缓存监控器
class CacheMonitor {
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    cleanups: 0,
  }
  
  // 记录命中
  recordHit(): void {
    this.stats.hits++
  }
  
  // 记录未命中
  recordMiss(): void {
    this.stats.misses++
  }
  
  // 记录设置
  recordSet(): void {
    this.stats.sets++
  }
  
  // 记录删除
  recordDelete(): void {
    this.stats.deletes++
  }
  
  // 记录清理
  recordCleanup(cleanedCount: number): void {
    this.stats.cleanups++
  }
  
  // 获取命中率
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? this.stats.hits / total : 0
  }
  
  // 获取统计信息
  getStats() {
    return {
      ...this.stats,
      hitRate: this.getHitRate(),
    }
  }
  
  // 重置统计
  reset(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      cleanups: 0,
    }
  }
}

// 创建全局实例
export const cacheStrategyManager = new CacheStrategyManager()
export const cacheWarmupManager = new CacheWarmupManager()
export const cacheMonitor = new CacheMonitor()

// 缓存工具函数
export const cacheUtils = {
  // 生成缓存键
  generateKey: (namespace: string, ...parts: string[]): string => {
    return `${namespace}:${parts.join(':')}`
  },
  
  // 解析缓存键
  parseKey: (key: string): { namespace: string; parts: string[] } => {
    const [namespace, ...parts] = key.split(':')
    return { namespace, parts }
  },
  
  // 检查键是否匹配模式
  matchPattern: (key: string, pattern: string): boolean => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return regex.test(key)
  },
  
  // 批量操作
  batch: {
    // 批量获取
    get: async (keys: string[]): Promise<Array<any>> => {
      return Promise.all(keys.map(key => {
        const value = cacheStrategyManager.get(key)
        if (value !== null) {
          cacheMonitor.recordHit()
        } else {
          cacheMonitor.recordMiss()
        }
        return value
      }))
    },
    
    // 批量设置
    set: async (items: Array<{ key: string; value: any; ttl: number }>): Promise<void> => {
      await Promise.all(items.map(item => {
        cacheStrategyManager.set(item.key, item.value, item.ttl)
        cacheMonitor.recordSet()
      }))
    },
    
    // 批量删除
    delete: async (keys: string[]): Promise<void> => {
      await Promise.all(keys.map(key => {
        cacheStrategyManager.delete(key)
        cacheMonitor.recordDelete()
      }))
    },
  },
}

export {
  LRUCache,
  LFUCache,
  CacheStrategyManager,
  CacheWarmupManager,
  CacheMonitor,
}

export default cacheStrategyManager