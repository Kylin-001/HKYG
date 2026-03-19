import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createCacheService, Cacheable } from '@/utils/cache-service'
import { createCacheAdapter } from '@/utils/cache-adapter'
import { cacheStrategyManager } from '@/utils/cache-strategy'

// 模拟适配器
vi.mock('@/utils/cache-adapter', () => ({
  createCacheAdapter: vi.fn((type: string) => {
    if (type === 'memory') {
      return new MockMemoryAdapter()
    }
    if (type === 'redis') {
      return new MockRedisAdapter()
    }
    throw new Error(`不支持的缓存适配器: ${type}`)
  }),
  createDefaultMultiLayerCache: vi.fn(() => new MockMemoryAdapter()),
}))

// 模拟内存适配器
class MockMemoryAdapter {
  private cache = new Map<string, { value: any; expireTime: number }>()
  private stats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }

  async get(key: string) {
    const item = this.cache.get(key)
    if (item && item.expireTime > Date.now()) {
      this.stats.hits++
      this.updateHitRate()
      return item.value
    }

    this.stats.misses++
    this.updateHitRate()
    return null
  }

  async set(key: string, value: any, ttl: number = 3600) {
    this.cache.set(key, {
      value,
      expireTime: Date.now() + ttl * 1000,
    })

    this.stats.totalKeys = this.cache.size
    this.stats.memoryUsage += JSON.stringify(value).length
  }

  async delete(key: string) {
    this.cache.delete(key)
    this.stats.totalKeys = this.cache.size
  }

  async exists(key: string) {
    const item = this.cache.get(key)
    return item ? item.expireTime > Date.now() : false
  }

  async ttl(key: string) {
    const item = this.cache.get(key)
    if (!item) return -2

    const remainingTime = Math.floor((item.expireTime - Date.now()) / 1000)
    return Math.max(0, remainingTime)
  }

  async clear() {
    this.cache.clear()
    this.stats.totalKeys = 0
    this.stats.memoryUsage = 0
  }

  async getStats() {
    return { ...this.stats }
  }

  private updateHitRate() {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
}

// 模拟Redis适配器
class MockRedisAdapter {
  private cache = new Map<string, { value: any; expireTime: number }>()
  private stats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }

  async get(key: string) {
    const item = this.cache.get(key)
    if (item && item.expireTime > Date.now()) {
      this.stats.hits++
      this.updateHitRate()
      return item.value
    }

    this.stats.misses++
    this.updateHitRate()
    return null
  }

  async set(key: string, value: any, ttl: number = 3600) {
    this.cache.set(key, {
      value,
      expireTime: Date.now() + ttl * 1000,
    })

    this.stats.totalKeys = this.cache.size
    this.stats.memoryUsage += JSON.stringify(value).length
  }

  async delete(key: string) {
    this.cache.delete(key)
    this.stats.totalKeys = this.cache.size
  }

  async exists(key: string) {
    const item = this.cache.get(key)
    return item ? item.expireTime > Date.now() : false
  }

  async ttl(key: string) {
    const item = this.cache.get(key)
    if (!item) return -2

    const remainingTime = Math.floor((item.expireTime - Date.now()) / 1000)
    return Math.max(0, remainingTime)
  }

  async clear() {
    this.cache.clear()
    this.stats.totalKeys = 0
    this.stats.memoryUsage = 0
  }

  async getStats() {
    return { ...this.stats }
  }

  private updateHitRate() {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
}

describe('Cache Service', () => {
  let cacheService: any

  beforeEach(() => {
    vi.clearAllMocks()
    cacheService = createCacheService({
      adapter: 'memory',
      ttl: 1, // 1秒，便于测试
    })
  })

  afterEach(() => {
    cacheService.destroy()
  })

  describe('Basic Operations', () => {
    it('should set and get cache item', async () => {
      const key = 'test-key'
      const value = { data: 'test-value' }

      await cacheService.set(key, value)
      const result = await cacheService.get(key)

      expect(result).toEqual(value)
    })

    it('should return null for non-existent key', async () => {
      const key = 'non-existent-key'

      const result = await cacheService.get(key)

      expect(result).toBeNull()
    })

    it('should delete cache item', async () => {
      const key = 'test-key'
      const value = { data: 'test-value' }

      await cacheService.set(key, value)
      await cacheService.delete(key)
      const result = await cacheService.get(key)

      expect(result).toBeNull()
    })

    it('should check if key exists', async () => {
      const key = 'test-key'
      const value = { data: 'test-value' }

      await cacheService.set(key, value)
      const exists = await cacheService.exists(key)

      expect(exists).toBe(true)

      await cacheService.delete(key)
      const notExists = await cacheService.exists(key)

      expect(notExists).toBe(false)
    })

    it('should get TTL for key', async () => {
      const key = 'test-key'
      const value = { data: 'test-value' }

      await cacheService.set(key, value, { ttl: 2 })
      const ttl = await cacheService.ttl(key)

      expect(ttl).toBeGreaterThan(0)
      expect(ttl).toBeLessThanOrEqual(2)
    })

    it('should clear all cache', async () => {
      await cacheService.set('key1', 'value1')
      await cacheService.set('key2', 'value2')

      await cacheService.clear()

      const result1 = await cacheService.get('key1')
      const result2 = await cacheService.get('key2')

      expect(result1).toBeNull()
      expect(result2).toBeNull()
    })
  })

  describe('Batch Operations', () => {
    it('should get multiple keys', async () => {
      const keys = ['key1', 'key2', 'key3']
      const values = ['value1', 'value2', 'value3']

      await Promise.all(keys.map((key, index) => cacheService.set(key, values[index])))

      const results = await cacheService.mget(keys)

      expect(results).toEqual(values)
    })

    it('should set multiple keys', async () => {
      const items = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ]

      await cacheService.mset(items)

      const results = await cacheService.mget(items.map(item => item.key))

      expect(results).toEqual(['value1', 'value2', 'value3'])
    })
  })

  describe('Tag Operations', () => {
    it('should set and get keys by tag', async () => {
      const key1 = 'tagged-key1'
      const key2 = 'tagged-key2'
      const value1 = 'value1'
      const value2 = 'value2'
      const tags = ['tag1', 'tag2']

      await cacheService.set(key1, value1, { tags })
      await cacheService.set(key2, value2, { tags })

      const keys = await cacheService.getKeysByTag('tag1')

      expect(keys).toContain(key1)
      expect(keys).toContain(key2)
    })

    it('should delete keys by tag', async () => {
      const key1 = 'tagged-key1'
      const key2 = 'tagged-key2'
      const key3 = 'untagged-key'
      const value1 = 'value1'
      const value2 = 'value2'
      const value3 = 'value3'
      const tags = ['tag1', 'tag2']

      await cacheService.set(key1, value1, { tags })
      await cacheService.set(key2, value2, { tags })
      await cacheService.set(key3, value3)

      await cacheService.deleteByTag('tag1')

      const result1 = await cacheService.get(key1)
      const result2 = await cacheService.get(key2)
      const result3 = await cacheService.get(key3)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
      expect(result3).toEqual(value3)
    })
  })

  describe('Pattern Matching', () => {
    it('should get keys by pattern', async () => {
      const keys = ['user:1', 'user:2', 'product:1', 'product:2']
      const values = ['value1', 'value2', 'value3', 'value4']

      await Promise.all(keys.map((key, index) => cacheService.set(key, values[index])))

      const userKeys = await cacheService.getKeysByPattern('user:*')
      const productKeys = await cacheService.getKeysByPattern('product:*')

      expect(userKeys).toHaveLength(2)
      expect(userKeys).toContain('user:1')
      expect(userKeys).toContain('user:2')

      expect(productKeys).toHaveLength(2)
      expect(productKeys).toContain('product:1')
      expect(productKeys).toContain('product:2')
    })
  })

  describe('Cache Stats', () => {
    it('should track cache statistics', async () => {
      const key = 'test-key'
      const value = 'test-value'

      // 设置缓存
      await cacheService.set(key, value)

      // 命中
      await cacheService.get(key)
      await cacheService.get(key)

      // 未命中
      await cacheService.get('non-existent-key')

      const stats = await cacheService.getStats()

      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe(2 / 3)
    })
  })

  describe('Cache Cleanup', () => {
    it('should cleanup expired items', async () => {
      const key1 = 'expire-key1'
      const key2 = 'expire-key2'
      const value1 = 'value1'
      const value2 = 'value2'

      // 设置短期过期
      await cacheService.set(key1, value1, { ttl: 1 })
      await cacheService.set(key2, value2, { ttl: 2 })

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 1100))

      // 清理过期项
      const cleanedCount = await cacheService.cleanup()

      expect(cleanedCount).toBeGreaterThan(0)

      // 检查项是否已清理
      const result1 = await cacheService.get(key1)
      const result2 = await cacheService.get(key2)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
    })
  })

  describe('Cache Warmup', () => {
    it('should warmup cache with multiple items', async () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        key: `warmup-key-${i}`,
        value: `warmup-value-${i}`,
      }))

      await cacheService.warmup(items)

      // 检查所有项是否已设置
      const results = await cacheService.mget(items.map(item => item.key))

      expect(results).toHaveLength(100)
      expect(results.every((result: any) => result !== null)).toBe(true)
    })
  })

  describe('Cache Decorator', () => {
    it('should cache method results', async () => {
      class TestService {
        @Cacheable({ ttl: 10 })
        async expensiveOperation(input: string) {
          // 模拟耗时操作
          await new Promise(resolve => setTimeout(resolve, 100))
          return `processed-${input}`
        }
      }

      const service = new TestService()

      // 第一次调用，应该执行方法
      const startTime1 = Date.now()
      const result1 = await service.expensiveOperation('test')
      const duration1 = Date.now() - startTime1

      expect(result1).toBe('processed-test')
      expect(duration1).toBeGreaterThan(90)

      // 第二次调用，应该从缓存获取
      const startTime2 = Date.now()
      const result2 = await service.expensiveOperation('test')
      const duration2 = Date.now() - startTime2

      expect(result2).toBe('processed-test')
      expect(duration2).toBeLessThan(50)
    })
  })

  describe('Cache Strategy', () => {
    it('should switch cache strategy', () => {
      // 切换到LFU策略
      cacheStrategyManager.switchStrategy('lfu')

      const stats = cacheStrategyManager.getStats()

      expect(stats.strategy).toBe('lfu')
    })
  })

  describe('Error Handling', () => {
    it('should handle get errors gracefully', async () => {
      // 模拟适配器错误
      const mockAdapter = {
        get: vi.fn().mockRejectedValue(new Error('获取失败')),
        set: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
        exists: vi.fn().mockResolvedValue(false),
        ttl: vi.fn().mockResolvedValue(-1),
        clear: vi.fn().mockResolvedValue(undefined),
        getStats: vi.fn().mockResolvedValue({
          hits: 0,
          misses: 0,
          hitRate: 0,
          totalKeys: 0,
          memoryUsage: 0,
          expiredKeys: 0,
          evictedKeys: 0,
        }),
      }

      const { createCacheAdapter } = require('@/utils/cache-adapter')
      vi.mocked(createCacheAdapter).mockReturnValue(mockAdapter)

      const errorCacheService = createCacheService({ adapter: 'memory' })

      const result = await errorCacheService.get('test-key')

      expect(result).toBeNull()
      expect(mockAdapter.get).toHaveBeenCalledWith('test-key')
    })

    it('should handle set errors gracefully', async () => {
      // 模拟适配器错误
      const mockAdapter = {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockRejectedValue(new Error('设置失败')),
        delete: vi.fn().mockResolvedValue(undefined),
        exists: vi.fn().mockResolvedValue(false),
        ttl: vi.fn().mockResolvedValue(-1),
        clear: vi.fn().mockResolvedValue(undefined),
        getStats: vi.fn().mockResolvedValue({
          hits: 0,
          misses: 0,
          hitRate: 0,
          totalKeys: 0,
          memoryUsage: 0,
          expiredKeys: 0,
          evictedKeys: 0,
        }),
      }

      const { createCacheAdapter } = require('@/utils/cache-adapter')
      vi.mocked(createCacheAdapter).mockReturnValue(mockAdapter)

      const errorCacheService = createCacheService({ adapter: 'memory' })

      await expect(errorCacheService.set('test-key', 'test-value')).rejects.toThrow('设置失败')
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', 'test-value', 3600)
    })
  })
})
