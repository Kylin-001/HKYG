/**
 * 缓存服务
 * 整合所有缓存功能，提供统一的缓存接口
 */

import { defaultCacheManager } from './cache'
import { cacheStrategyManager, cacheWarmupManager, cacheMonitor } from './cache-strategy'
import { createCacheAdapter, createDefaultMultiLayerCache } from './cache-adapter'
import type { ICacheAdapter } from './cache-adapter'

// 缓存服务配置
interface CacheServiceConfig {
  adapter: string // 缓存适配器类型
  strategy: string // 缓存策略
  ttl: number // 默认过期时间
  maxSize: number // 最大缓存项数
  maxMemory: number // 最大内存使用
  enableStats: boolean // 是否启用统计
  enableWarmup: boolean // 是否启用预热
  enableCleanup: boolean // 是否启用清理
  cleanupInterval: number // 清理间隔
}

// 缓存项元数据
interface CacheMetadata {
  key: string
  tags: string[]
  createdAt: number
  updatedAt: number
  accessCount: number
  lastAccessTime: number
  size: number
  ttl: number
}

// 缓存服务实现
class CacheService {
  private config: CacheServiceConfig
  private adapter: ICacheAdapter
  private metadata = new Map<string, CacheMetadata>()
  private statsInterval: any = null
  
  constructor(config?: Partial<CacheServiceConfig>) {
    // 默认配置
    this.config = {
      adapter: 'memory',
      strategy: 'lru',
      ttl: 3600, // 1小时
      maxSize: 1000,
      maxMemory: 10 * 1024 * 1024, // 10MB
      enableStats: true,
      enableWarmup: true,
      enableCleanup: true,
      cleanupInterval: 60000, // 1分钟
      ...config,
    }
    
    // 创建缓存适配器
    this.adapter = this.createAdapter()
    
    // 启动统计和清理
    if (this.config.enableStats) {
      this.startStatsCollection()
    }
    
    if (this.config.enableCleanup) {
      this.startCleanup()
    }
  }
  
  // 创建缓存适配器
  private createAdapter(): ICacheAdapter {
    switch (this.config.adapter) {
      case 'memory':
        return createCacheAdapter('memory', {
          maxSize: this.config.maxSize,
          maxMemory: this.config.maxMemory,
        })
      
      case 'localStorage':
        return createCacheAdapter('localStorage', {
          prefix: 'heikeji:',
        })
      
      case 'indexedDB':
        return createCacheAdapter('indexedDB', {
          dbName: 'HeikeJiCache',
          storeName: 'cache',
        })
      
      case 'redis':
        return defaultCacheManager
      
      case 'multi':
        return createDefaultMultiLayerCache()
      
      default:
        throw new Error(`不支持的缓存适配器: ${this.config.adapter}`)
    }
  }
  
  // 获取缓存项
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.adapter.get<T>(key)
      
      if (value !== null) {
        // 更新元数据
        this.updateMetadata(key, { accessCount: 1, lastAccessTime: Date.now() })
        
        // 记录命中
        if (this.config.enableStats) {
          cacheMonitor.recordHit()
        }
      } else {
        // 记录未命中
        if (this.config.enableStats) {
          cacheMonitor.recordMiss()
        }
      }
      
      return value
    } catch (error) {
      console.error('获取缓存失败:', error)
      return null
    }
  }
  
  // 设置缓存项
  async set<T>(key: string, value: T, options?: {
    ttl?: number
    tags?: string[]
    priority?: number
  }): Promise<void> {
    try {
      const ttl = options?.ttl || this.config.ttl
      const tags = options?.tags || []
      
      // 设置缓存
      await this.adapter.set(key, value, ttl)
      
      // 更新元数据
      this.updateMetadata(key, {
        tags,
        updatedAt: Date.now(),
        size: JSON.stringify(value).length,
        ttl,
      })
      
      // 记录设置
      if (this.config.enableStats) {
        cacheMonitor.recordSet()
      }
    } catch (error) {
      console.error('设置缓存失败:', error)
      throw error
    }
  }
  
  // 删除缓存项
  async delete(key: string): Promise<void> {
    try {
      await this.adapter.delete(key)
      
      // 删除元数据
      this.metadata.delete(key)
      
      // 记录删除
      if (this.config.enableStats) {
        cacheMonitor.recordDelete()
      }
    } catch (error) {
      console.error('删除缓存失败:', error)
      throw error
    }
  }
  
  // 检查缓存是否存在
  async exists(key: string): Promise<boolean> {
    try {
      return await this.adapter.exists(key)
    } catch (error) {
      console.error('检查缓存存在失败:', error)
      return false
    }
  }
  
  // 获取缓存TTL
  async ttl(key: string): Promise<number> {
    try {
      return await this.adapter.ttl(key)
    } catch (error) {
      console.error('获取缓存TTL失败:', error)
      return -1
    }
  }
  
  // 设置缓存TTL
  async expire(key: string, ttl: number): Promise<void> {
    try {
      // 获取当前值
      const value = await this.get(key)
      if (value !== null) {
        await this.set(key, value, { ttl })
      }
    } catch (error) {
      console.error('设置缓存TTL失败:', error)
      throw error
    }
  }
  
  // 根据标签获取缓存键
  async getKeysByTag(tag: string): Promise<string[]> {
    try {
      // 如果适配器支持标签功能
      if ('getKeysByTag' in this.adapter) {
        return await (this.adapter as any).getKeysByTag(tag)
      }
      
      // 否则从元数据中查找
      const keys: string[] = []
      for (const [key, metadata] of this.metadata.entries()) {
        if (metadata.tags.includes(tag)) {
          keys.push(key)
        }
      }
      
      return keys
    } catch (error) {
      console.error('根据标签获取缓存键失败:', error)
      return []
    }
  }
  
  // 根据标签删除缓存
  async deleteByTag(tag: string): Promise<void> {
    try {
      // 如果适配器支持标签功能
      if ('delByTag' in this.adapter) {
        await (this.adapter as any).delByTag(tag)
        
        // 清理元数据
        for (const [key, metadata] of this.metadata.entries()) {
          if (metadata.tags.includes(tag)) {
            this.metadata.delete(key)
          }
        }
        
        return
      }
      
      // 否则从元数据中查找并删除
      const keysToDelete: string[] = []
      for (const [key, metadata] of this.metadata.entries()) {
        if (metadata.tags.includes(tag)) {
          keysToDelete.push(key)
        }
      }
      
      await Promise.all(keysToDelete.map(key => this.delete(key)))
    } catch (error) {
      console.error('根据标签删除缓存失败:', error)
      throw error
    }
  }
  
  // 模糊匹配获取缓存键
  async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      // 如果适配器支持模式匹配
      if ('getKeysByPattern' in this.adapter) {
        return await (this.adapter as any).getKeysByPattern(pattern)
      }
      
      // 否则从元数据中查找
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      const keys: string[] = []
      
      for (const key of this.metadata.keys()) {
        if (regex.test(key)) {
          keys.push(key)
        }
      }
      
      return keys
    } catch (error) {
      console.error('模糊匹配获取缓存键失败:', error)
      return []
    }
  }
  
  // 批量获取缓存
  async mget<T>(keys: string[]): Promise<Array<T | null>> {
    try {
      // 如果适配器支持批量操作
      if ('mget' in this.adapter) {
        const values = await (this.adapter as any).mget<T>(keys)
        
        // 更新元数据
        keys.forEach((key, index) => {
          if (values[index] !== null) {
            this.updateMetadata(key, { accessCount: 1, lastAccessTime: Date.now() })
          }
        })
        
        return values
      }
      
      // 否则逐个获取
      return Promise.all(keys.map(key => this.get<T>(key)))
    } catch (error) {
      console.error('批量获取缓存失败:', error)
      return keys.map(() => null)
    }
  }
  
  // 批量设置缓存
  async mset<T>(items: Array<{
    key: string
    value: T
    ttl?: number
    tags?: string[]
  }>): Promise<void> {
    try {
      // 如果适配器支持批量操作
      if ('mset' in this.adapter) {
        const processedItems = items.map(item => ({
          key: item.key,
          value: item.value,
          ttl: item.ttl || this.config.ttl,
        }))
        
        await (this.adapter as any).mset(processedItems)
        
        // 更新元数据
        items.forEach(item => {
          this.updateMetadata(item.key, {
            tags: item.tags || [],
            updatedAt: Date.now(),
            size: JSON.stringify(item.value).length,
            ttl: item.ttl || this.config.ttl,
          })
        })
        
        return
      }
      
      // 否则逐个设置
      await Promise.all(items.map(item => 
        this.set(item.key, item.value, {
          ttl: item.ttl,
          tags: item.tags,
        })
      ))
    } catch (error) {
      console.error('批量设置缓存失败:', error)
      throw error
    }
  }
  
  // 清空所有缓存
  async clear(): Promise<void> {
    try {
      await this.adapter.clear()
      
      // 清空元数据
      this.metadata.clear()
    } catch (error) {
      console.error('清空缓存失败:', error)
      throw error
    }
  }
  
  // 缓存预热
  async warmup<T>(items: Array<{
    key: string
    value: T
    ttl?: number
    tags?: string[]
  }>): Promise<void> {
    if (!this.config.enableWarmup) {
      console.log('缓存预热已禁用')
      return
    }
    
    try {
      console.log(`开始缓存预热，共${items.length}项`)
      
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
  async cleanup(): Promise<number> {
    if (!this.config.enableCleanup) {
      console.log('缓存清理已禁用')
      return 0
    }
    
    try {
      console.log('开始缓存清理')
      
      // 如果适配器支持清理功能
      if ('cleanup' in this.adapter) {
        const cleanedCount = await (this.adapter as any).cleanup()
        
        // 清理元数据
        for (const [key, metadata] of this.metadata.entries()) {
          const ttl = await this.ttl(key)
          if (ttl === 0) {
            this.metadata.delete(key)
          }
        }
        
        console.log(`缓存清理完成，共清理${cleanedCount}项`)
        
        // 记录清理
        if (this.config.enableStats) {
          cacheMonitor.recordCleanup(cleanedCount)
        }
        
        return cleanedCount
      }
      
      // 否则手动清理过期项
      let cleanedCount = 0
      const keysToDelete: string[] = []
      
      for (const [key, metadata] of this.metadata.entries()) {
        const ttl = await this.ttl(key)
        if (ttl === 0) {
          keysToDelete.push(key)
        }
      }
      
      await Promise.all(keysToDelete.map(key => this.delete(key)))
      
      console.log(`缓存清理完成，共清理${keysToDelete.length}项`)
      
      // 记录清理
      if (this.config.enableStats) {
        cacheMonitor.recordCleanup(keysToDelete.length)
      }
      
      return keysToDelete.length
    } catch (error) {
      console.error('缓存清理失败:', error)
      throw error
    }
  }
  
  // 获取缓存统计
  async getStats(): Promise<any> {
    try {
      const adapterStats = await this.adapter.getStats()
      
      return {
        adapter: this.config.adapter,
        strategy: this.config.strategy,
        ...adapterStats,
        metadataCount: this.metadata.size,
        config: this.config,
      }
    } catch (error) {
      console.error('获取缓存统计失败:', error)
      return null
    }
  }
  
  // 更新元数据
  private updateMetadata(key: string, updates: Partial<CacheMetadata>): void {
    const existing = this.metadata.get(key) || {
      key,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      accessCount: 0,
      lastAccessTime: Date.now(),
      size: 0,
      ttl: this.config.ttl,
    }
    
    this.metadata.set(key, { ...existing, ...updates })
  }
  
  // 启动统计收集
  private startStatsCollection(): void {
    this.statsInterval = setInterval(async () => {
      const stats = await this.getStats()
      console.log('缓存统计:', stats)
    }, 60000) // 每分钟记录一次
  }
  
  // 启动定期清理
  private startCleanup(): void {
    setInterval(async () => {
      await this.cleanup()
    }, this.config.cleanupInterval)
  }
  
  // 销毁缓存服务
  destroy(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval)
      this.statsInterval = null
    }
    
    this.metadata.clear()
  }
}

// 创建缓存服务实例
export const createCacheService = (config?: Partial<CacheServiceConfig>): CacheService => {
  return new CacheService(config)
}

// 创建默认缓存服务
export const defaultCacheService = createCacheService({
  adapter: 'memory',
  strategy: 'lru',
  ttl: 3600, // 1小时
  maxSize: 1000,
  maxMemory: 10 * 1024 * 1024, // 10MB
  enableStats: true,
  enableWarmup: true,
  enableCleanup: true,
  cleanupInterval: 60000, // 1分钟
})

// 缓存装饰器
export function Cacheable(options?: {
  ttl?: number
  tags?: string[]
  key?: string
}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      // 生成缓存键
      const cacheKey = options?.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`
      
      // 尝试从缓存获取
      const cached = await defaultCacheService.get(cacheKey)
      if (cached !== null) {
        return cached
      }
      
      // 执行原方法
      const result = await originalMethod.apply(this, args)
      
      // 设置缓存
      await defaultCacheService.set(cacheKey, result, {
        ttl: options?.ttl,
        tags: options?.tags,
      })
      
      return result
    }
    
    return descriptor
  }
}

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
  
  // 计算缓存大小
  calculateSize: (value: any): number => {
    return JSON.stringify(value).length * 2 // 简单估算
  },
  
  // 格式化大小
  formatSize: (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`
  },
}

export {
  CacheService,
  CacheMetadata,
  CacheServiceConfig,
}

export default defaultCacheService