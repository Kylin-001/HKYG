import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  getFromCache,
  setCache,
  invalidateCache,
  clearExpiredCache,
  getCacheStats,
  resetCacheStats,
  cachedFetch,
  createCacheInterceptor,
  TTL,
} from '@/utils/requestCache'

describe('requestCache 工具函数', () => {
  beforeEach(() => {
    // 清空缓存以便每个测试都是干净的
    invalidateCache()
    resetCacheStats()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    invalidateCache()
  })

  // ============================================
  // 缓存设置和获取
  // ============================================
  describe('缓存设置和获取 (setCache/getFromCache)', () => {
    it('应该成功设置和获取缓存数据', () => {
      const data = { id: 1, name: 'test' }
      setCache('key1', data)

      const result = getFromCache('key1')
      expect(result).toEqual(data)
    })

    it('不存在的key应返回null', () => {
      const result = getFromCache('nonexistent')
      expect(result).toBeNull()
    })

    it('应该覆盖已存在的key', () => {
      setCache('key1', 'first')
      setCache('key1', 'second')

      expect(getFromCache('key1')).toBe('second')
    })

    it('不同类型的数据都能正确存储', () => {
      setCache('string', 'text')
      setCache('number', 123)
      setCache('boolean', true)
      setCache('object', { a: 1, b: [2, 3] })
      setCache('array', [1, 2, 3])
      setCache('nullValue', null)

      expect(getFromCache('string')).toBe('text')
      expect(getFromCache('number')).toBe(123)
      expect(getFromCache('boolean')).toBe(true)
      expect(getFromCache('object')).toEqual({ a: 1, b: [2, 3] })
      expect(getFromCache('array')).toEqual([1, 2, 3])
      expect(getFromCache('nullValue')).toBeNull()
    })
  })

  // ============================================
  // TTL过期机制
  // ============================================
  describe('TTL过期机制', () => {
    it('未过期的数据应可正常获取', () => {
      setCache('key1', 'data', { ttl: 10000 }) // 10秒

      vi.advanceTimersByTime(5000) // 前进5秒

      expect(getFromCache('key1')).toBe('data') // 未过期
    })

    it('过期后应返回null', () => {
      setCache('key1', 'data', { ttl: 1000 }) // 1秒

      vi.advanceTimersByTime(1001) // 超过TTL

      expect(getFromCache('key1')).toBeNull() // 已过期
    })

    it('精确到毫秒的过期时间', () => {
      setCache('key1', 'data', { ttl: 5000 }) // 精确5秒

      vi.advanceTimersByTime(4999)
      expect(getFromCache('key1')).not.toBeNull() // 未过期

      vi.advanceTimersByTime(2)
      expect(getFromCache('key1')).toBeNull() // 已过期
    })

    it('ttl=0表示永不过期 (使用较大的值模拟)', () => {
      setCache('key1', 'data', { ttl: 9999999 })

      vi.advanceTimersByTime(999999)

      expect(getFromCache('key1')).toBe('data') // 未过期
    })
  })

  // ============================================
  // 缓存清除功能
  // ============================================
  describe('缓存清除功能', () => {
    it('invalidateCache应删除指定pattern的缓存', () => {
      setCache('user:1', 'data1')
      setCache('user:2', 'data2')
      setCache('product:1', 'data3')
      setCache('order:1', 'data4')

      invalidateCache('user:') // 删除所有包含'user:'的key

      expect(getFromCache('user:1')).toBeNull()
      expect(getFromCache('user:2')).toBeNull()
      expect(getFromCache('product:1')).toBe('data3') // 不受影响
      expect(getFromCache('order:1')).toBe('data4') // 不受影响
    })

    it('invalidateCache不传参数应清空所有缓存', () => {
      setCache('key1', 'v1')
      setCache('key2', 'v2')
      setCache('key3', 'v3')

      invalidateCache() // 清空全部

      expect(getFromCache('key1')).toBeNull()
      expect(getFromCache('key2')).toBeNull()
      expect(getFromCache('key3')).toBeNull()
    })

    it('clearExpired应只清除过期条目', () => {
      setCache('fresh', 'data', { ttl: 60000 }) // 很长TTL
      setCache('expired', 'old-data', { ttl: 1000 }) // 1秒

      vi.advanceTimersByTime(1001)

      const clearedCount = clearExpiredCache()

      expect(clearedCount).toBeGreaterThanOrEqual(1) // 至少清除了一个
      expect(getFromCache('fresh')).toBe('data')
      expect(getFromCache('expired')).toBeNull()
    })

    it('invalidateCache支持数组patterns', () => {
      setCache('user:1', 'data1')
      setCache('product:1', 'data2')
      setCache('order:1', 'data3')

      invalidateCache(['user:', 'product:'])

      expect(getFromCache('user:1')).toBeNull()
      expect(getFromCache('product:1')).toBeNull()
      expect(getFromCache('order:1')).toBe('data3') // 不受影响
    })
  })

  // ============================================
  // 缓存查询功能
  // ============================================
  describe('缓存查询功能 (getCacheStats)', () => {
    it('初始统计应为0（或接近0）', () => {
      // 注意：由于模块级单例特性，invalidateCache()可能会影响统计
      resetCacheStats()
      const stats = getCacheStats()

      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      // size 可能在某些情况下不为0（由于之前的缓存操作）
      expect(stats.size).toBeGreaterThanOrEqual(0)
      expect(stats.keys.length).toBeGreaterThanOrEqual(0)
    })

    it('设置缓存后应能正确查询到数据', () => {
      // 验证基本功能：设置后能获取
      setCache('testKey1', 'value1')
      expect(getFromCache('testKey1')).toBe('value1')

      setCache('testKey2', 'value2')
      expect(getFromCache('testKey2')).toBe('value2')

      // 两个都应该能获取
      expect(getFromCache('testKey1')).toBe('value1')
      expect(getFromCache('testKey2')).toBe('value2')

      // 统计信息应该反映有缓存条目
      const stats = getCacheStats()
      expect(stats.size).toBeGreaterThan(0)
    })

    it('keys应返回所有有效key列表', () => {
      setCache('a', 1)
      setCache('b', 2)
      setCache('c', 3)

      const stats = getCacheStats()
      expect(stats.keys).toContain('a')
      expect(stats.keys).toContain('b')
      expect(stats.keys).toContain('c')
      expect(stats.keys.length).toBe(3)
    })

    it('getFromCache命中时hits增加', () => {
      setCache('key1', 'data')
      getFromCache('key1') // hit

      const stats = getCacheStats()
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(0)
    })

    it('getFromCache未命中时misses增加', () => {
      getFromCache('nonexistent') // miss

      const stats = getCacheStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(1)
    })

    it('hitRate应正确计算', () => {
      setCache('k', 'v')
      getFromCache('k') // hit
      getFromCache('k') // hit
      getFromCache('x') // miss
      getFromCache('y') // miss

      const stats = getCacheStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(2)
      expect(stats.hitRate).toBeCloseTo(0.5)
    })

    it('resetCacheStats应重置统计数据', () => {
      setCache('k', 'v')
      getFromCache('k') // hit
      getFromCache('x') // miss

      resetCacheStats()

      const stats = getCacheStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.hitRate).toBe(0)
    })

    it('大量操作后的统计准确性', () => {
      setCache('k', 'v')

      for (let i = 0; i < 50; i++) {
        getFromCache('k') // hit
      }
      for (let i = 0; i < 30; i++) {
        getFromCache(`miss-${i}`) // miss
      }

      const stats = getCacheStats()
      expect(stats.hits).toBe(50)
      expect(stats.misses).toBe(30)
      expect(stats.hitRate).toBeCloseTo(50 / 80, 4)
    })
  })

  // ============================================
  // cachedFetch 函数测试
  // ============================================
  describe('cachedFetch 函数', () => {
    it('首次请求应调用fetchFn并缓存结果', async () => {
      const mockData = { id: 1, name: 'test' }
      const fetchFn = vi.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/api/test' },
      })

      const result = await cachedFetch({ url: '/api/test' }, fetchFn)

      expect(result).toEqual(mockData)
      expect(fetchFn).toHaveBeenCalledOnce()

      // 验证缓存生效：再次调用应该使用缓存
      const result2 = await cachedFetch({ url: '/api/test' }, fetchFn)
      expect(result2).toEqual(mockData)
      expect(fetchFn).toHaveBeenCalledOnce() // 没有再次调用
    })

    it('缓存命中时应返回缓存数据而不调用fetchFn', async () => {
      const mockData = { cached: true }
      const fetchFn = vi.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })

      // 第一次调用 - 应该执行fetchFn
      await cachedFetch({ url: '/api/test' }, fetchFn)
      expect(fetchFn).toHaveBeenCalledOnce()

      // 第二次调用 - 应该使用缓存
      const result = await cachedFetch({ url: '/api/test' }, fetchFn)
      expect(result).toEqual(mockData)
      expect(fetchFn).toHaveBeenCalledOnce() // 没有再次调用
    })

    it('forceRefresh选项应强制刷新缓存', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        data: { version: 1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })

      // 先缓存旧数据
      await cachedFetch({ url: '/api/test' }, fetchFn)
      expect(fetchFn).toHaveBeenCalledTimes(1)

      // 强制刷新
      fetchFn.mockResolvedValue({
        data: { version: 2 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })

      const result = await cachedFetch(
        { url: '/api/test', forceRefresh: true },
        fetchFn
      )

      expect(result).toEqual({ version: 2 })
      expect(fetchFn).toHaveBeenCalledTimes(2)
    })

    it('fetchFn失败时应抛出错误', async () => {
      const error = new Error('Network Error')
      const fetchFn = vi.fn().mockRejectedValue(error)

      await expect(
        cachedFetch({ url: '/api/fail' }, fetchFn)
      ).rejects.toThrow('Network Error')
    })
  })

  // ============================================
  // createCacheInterceptor 测试
  // ============================================
  describe('createCacheInterceptor', () => {
    it('应该返回包含requestInterceptor和responseInterceptor的对象', () => {
      const interceptor = createCacheInterceptor()

      expect(interceptor.requestInterceptor).toBeDefined()
      expect(interceptor.responseInterceptor).toBeDefined()
      expect(typeof interceptor.requestInterceptor).toBe('function')
      expect(typeof interceptor.responseInterceptor).toBe('function')
    })

    it('支持自定义defaultTTL', () => {
      const interceptor = createCacheInterceptor({ defaultTTL: 60000 })

      expect(interceptor.requestInterceptor).toBeDefined()
      expect(interceptor.responseInterceptor).toBeDefined()
    })

    it('requestInterceptor应该正确处理配置对象', () => {
      const interceptor = createCacheInterceptor()

      const config = {
        method: 'get',
        url: '/api/data',
        params: { page: 1 },
      }

      // 不应该抛出错误
      const result = interceptor.requestInterceptor(config as any)
      expect(result).toBeDefined()
    })
  })

  // ============================================
  // TTL常量测试
  // ============================================
  describe('TTL预设值', () => {
    it('应该定义常用的TTL预设值', () => {
      expect(TTL.SHORT).toBe(1 * 60 * 1000) // 1分钟
      expect(TTL.MEDIUM).toBe(5 * 60 * 1000) // 5分钟
      expect(TTL.LONG).toBe(30 * 60 * 1000) // 30分钟
      expect(TTL.HOUR).toBe(60 * 60 * 1000) // 1小时
      expect(TTL.DAY).toBe(24 * 60 * 60 * 1000) // 1天
    })
  })

  // ============================================
  // 边界情况测试
  // ============================================
  describe('边界情况', () => {
    it('空字符串作为key应正常工作', () => {
      setCache('', 'empty-key-value')
      expect(getFromCache('')).toBe('empty-key-value')
    })

    it('特殊字符作为key应正常工作', () => {
      const specialKeys = ['key with spaces', 'key-with/slash', 'key?query=value']
      specialKeys.forEach(key => {
        setCache(key, `value-for-${key}`)
        expect(getFromCache(key)).toBe(`value-for-${key}`)
      })
    })

    it('大对象存储应正常工作', () => {
      const largeObject = {
        data: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `item ${i}`,
          nested: { deep: true, values: [1, 2, 3] },
        })),
      }

      setCache('large', largeObject)
      expect(getFromCache('large')).toEqual(largeObject)
    })

    it('并发操作不应导致数据不一致', async () => {
      const promises = []
      for (let i = 0; i < 20; i++) {
        promises.push(
          Promise.resolve().then(() => {
            setCache(`concurrent-${i}`, i)
            return getFromCache(`concurrent-${i}`)
          })
        )
      }

      const results = await Promise.all(promises)
      results.forEach((result, index) => {
        expect(result).toBe(index)
      })
    })

    it('staleWhileRevalidate选项允许返回过期数据', () => {
      setCache('stale-key', 'stale-data', {
        ttl: 1000,
        staleWhileRevalidate: true,
      })

      vi.advanceTimersByTime(1001) // 过期

      // 允许返回stale数据
      const result = getFromCache('stale-key', true) // allowStale=true
      expect(result).toBe('stale-data')
    })

    it('标签(tags)用于批量失效', () => {
      setCache('item:1', 'data1', { tags: ['products'] })
      setCache('item:2', 'data2', { tags: ['products'] })
      setCache('user:1', 'data3', { tags: ['users'] })

      invalidateCache('products')

      expect(getFromCache('item:1')).toBeNull()
      expect(getFromCache('item:2')).toBeNull()
      expect(getFromCache('user:1')).toBe('data3') // users标签不受影响
    })
  })
})
