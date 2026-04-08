import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  expiresAt: number
  /** 是否为stale数据 (过期但仍可用) */
  stale?: boolean
  /** 缓存标签 (用于批量失效) */
  tags?: string[]
  /** 访问次数（用于LRU） */
  accessCount?: number
  /** 最后访问时间 */
  lastAccessed?: number
}

interface CacheOptions {
  ttl?: number
  key?: string
  forceRefresh?: boolean
  staleWhileRevalidate?: boolean
  /** 缓存标签 */
  tags?: string[]
  /** 是否持久化到localStorage */
  persist?: boolean
  /** 缓存优先级（用于空间不足时淘汰） */
  priority?: 'high' | 'medium' | 'low'
}

// ====== 缓存统计 ======

interface CacheStats {
  hits: number
  misses: number
  staleHits: number
  errors: number
  evictions: number
  size: number
  memoryUsage: number
  hitRate: number
  avgResponseTime: number
}

const stats: CacheStats = {
  hits: 0,
  misses: 0,
  staleHits: 0,
  errors: 0,
  evictions: 0,
  size: 0,
  memoryUsage: 0,
  hitRate: 0,
  avgResponseTime: 0,
}

let totalResponseTime = 0
let responseCount = 0

/**
 * 更新缓存统计数据
 */
function updateStats(type: 'hit' | 'miss' | 'staleHit' | 'error', responseTime?: number): void {
  switch (type) {
    case 'hit':
      stats.hits++
      break
    case 'miss':
      stats.misses++
      break
    case 'staleHit':
      stats.staleHits++
      break
    case 'error':
      stats.errors++
      break
  }

  if (responseTime) {
    totalResponseTime += responseTime
    responseCount++
    stats.avgResponseTime = totalResponseTime / responseCount
  }

  // 更新命中率
  const totalAccesses = stats.hits + stats.misses + stats.staleHits
  stats.hitRate = totalAccesses > 0 ? (stats.hits + stats.staleHits) / totalAccesses : 0

  // 更新大小和内存使用
  stats.size = cache.size
  stats.memoryUsage = calculateMemoryUsage()
}

function calculateMemoryUsage(): number {
  let totalSize = 0
  for (const [, entry] of cache.entries()) {
    try {
      totalSize += JSON.stringify(entry.data).length * 2 // 粗略估算字节
    } catch (e) {}
  }
  return totalSize
}

// ====== 核心缓存实现 ======

const cache = new Map<string, CacheEntry>()
const DEFAULT_TTL = 5 * 60 * 1000

// TTL预设值 (毫秒)
export const TTL = {
  SHORT: 1 * 60 * 1000,      // 1分钟 - 实时性数据
  MEDIUM: 5 * 60 * 1000,     // 5分钟 - 一般数据 (默认)
  LONG: 30 * 60 * 1000,      // 30分钟 - 较少变化的数据
  HOUR: 60 * 60 * 1000,       // 1小时 - 静态数据
  DAY: 24 * 60 * 60 * 1000,   // 1天 - 基本不变的数据
} as const

/** 最大缓存条目数 */
const MAX_CACHE_SIZE = 200

/** 最大内存使用量(字节) - 默认10MB */
const MAX_MEMORY_USAGE = 10 * 1024 * 1024

function generateCacheKey(config: InternalAxiosRequestConfig): string {
  const { url, params, method, data } = config

  if ((config as CacheOptions).cacheKey) {
    return (config as CacheOptions).cacheKey!
  }

  const keyParts = [
    method?.toUpperCase() || 'GET',
    url || '',
    params ? JSON.stringify(params) : '',
    data && method !== 'get' ? JSON.stringify(data) : '',
  ]

  return keyParts.filter(Boolean).join(':')
}

/**
 * LRU淘汰策略：当缓存满时移除最少使用的条目
 */
function evictLRU(): void {
  if (cache.size < MAX_CACHE_SIZE && stats.memoryUsage < MAX_MEMORY_USAGE) return

  // 找出最久未访问的条目
  let oldestKey: string | null = null
  let oldestTime = Infinity

  for (const [key, entry] of cache.entries()) {
    const lastAccessed = entry.lastAccessed || entry.timestamp
    const priority = (entry as any).priority === 'high' ? Infinity : 1

    if (lastAccessed / priority < oldestTime) {
      oldestTime = lastAccessed / priority
      oldestKey = key
    }
  }

  if (oldestKey) {
    cache.delete(oldestKey)
    stats.evictions++

    // 同时清除持久化存储
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cache:${oldestKey}`)
    }
  }
}

/**
 * 从缓存获取数据
 * @param key 缓存key
 * @param allowStale 是否允许返回过期数据
 */
export function getFromCache<T = unknown>(key: string, allowStale = false): T | null {
  const startTime = performance.now()

  const entry = cache.get(key)

  if (!entry) {
    updateStats('miss', performance.now() - startTime)
    return null
  }

  const now = Date.now()

  if (now > entry.expiresAt) {
    if (allowStale || entry.stale) {
      // 更新访问信息
      entry.accessCount = (entry.accessCount || 0) + 1
      entry.lastAccessed = now

      updateStats('staleHit', performance.now() - startTime)
      return entry.data as T
    }

    cache.delete(key)
    updateStats('miss', performance.now() - startTime)
    return null
  }

  // 更新访问信息
  entry.accessCount = (entry.accessCount || 0) + 1
  entry.lastAccessed = now

  updateStats('hit', performance.now() - startTime)
  return entry.data as T
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param data 数据
 * @param options 缓存选项
 */
export function setCache<T = unknown>(key: string, data: T, options: CacheOptions = {}): void {
  const ttl = options.ttl || DEFAULT_TTL
  const now = Date.now()

  // 检查是否需要淘汰
  evictLRU()

  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + ttl,
    stale: options.staleWhileRevalidate || false,
    tags: options.tags,
    accessCount: 1,
    lastAccessed: now,
  }

  // 设置优先级
  if (options.priority) {
    ;(entry as any).priority = options.priority
  }

  cache.set(key, entry)

  // 持久化存储
  if (options.persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify({
        data,
        expiresAt: entry.expiresAt,
        tags: entry.tags,
        priority: options.priority,
      }))
    } catch (e) {
      console.warn('[Cache] Failed to persist to localStorage:', e)

      // 如果localStorage满了，尝试清理一些旧的持久化缓存
      clearOldestPersisted()
    }
  }
}

/**
 * 清理最旧的持久化缓存
 */
function clearOldestPersisted(): void {
  if (typeof window === 'undefined') return

  const keysToRemove: { key: string; time: number }[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith('cache:')) continue

    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        keysToRemove.push({ key, time: parsed.expiresAt || 0 })
      }
    } catch (e) {}
  }

  // 按过期时间排序，删除最旧的20%
  keysToRemove.sort((a, b) => a.time - b.time)
  const removeCount = Math.max(1, Math.floor(keysToRemove.length * 0.2))

  keysToRemove.slice(0, removeCount).forEach(({ key }) => {
    localStorage.removeItem(key)
  })
}

/**
 * 失效缓存
 * @param pattern 匹配模式 (支持标签和key模糊匹配)
 */
export function invalidateCache(pattern?: string | string[]): void {
  if (!pattern) {
    const sizeBefore = cache.size
    cache.clear()

    // 清除所有持久化缓存
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('cache:')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }

    stats.evictions += sizeBefore
    return
  }

  const patterns = Array.isArray(pattern) ? pattern : [pattern]

  for (const pattern of patterns) {
    for (const [key, entry] of cache.entries()) {
      if (
        key.includes(pattern) ||
        entry.tags?.some(tag => tag.includes(pattern))
      ) {
        cache.delete(key)
        stats.evictions++

        // 清除持久化缓存
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`cache:${key}`)
        }
      }
    }
  }
}

/**
 * 清理过期缓存
 * @returns 清理的数量
 */
export function clearExpiredCache(): number {
  let clearedCount = 0
  const now = Date.now()

  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt && !entry.stale) {
      cache.delete(key)
      clearedCount++
      stats.evictions++

      // 清除持久化缓存
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`cache:${key}`)
      }
    }
  }

  return clearedCount
}

/**
 * 获取缓存统计信息（包含命中率）
 */
export function getCacheStats(): CacheStats & {
  keys: string[]
  topHitKeys: Array<{ key: string; count: number }>
} {
  // 找出访问次数最多的前10个key
  const topKeys = Array.from(cache.entries())
    .sort((a, b) => (b[1].accessCount || 0) - (a[1].accessCount || 0))
    .slice(0, 10)
    .map(([key, entry]) => ({
      key,
      count: entry.accessCount || 0,
    }))

  return {
    ...stats,
    keys: Array.from(cache.keys()),
    topHitKeys: topKeys,
  }
}

/**
 * 重置缓存统计
 */
export function resetCacheStats(): void {
  stats.hits = 0
  stats.misses = 0
  stats.staleHits = 0
  stats.errors = 0
  stats.evictions = 0
  stats.hitRate = 0
  stats.avgResponseTime = 0
  totalResponseTime = 0
  responseCount = 0
}

/**
 * 带缓存的fetch请求 (支持Stale-While-Revalidate)
 */
export async function cachedFetch<T = unknown>(
  config: AxiosRequestConfig & CacheOptions,
  fetchFn: () => Promise<AxiosResponse<T>>
): Promise<T> {
  const startTime = performance.now()
  const cacheKey = generateCacheKey(config as InternalAxiosRequestConfig)

  if (!config.forceRefresh) {
    const cachedData = getFromCache<T>(cacheKey, true)

    if (cachedData !== null) {
      if (config.staleWhileRevalidate) {
        // 后台静默更新缓存
        fetchFn()
          .then((response) => {
            setCache(cacheKey, response.data, config)
          })
          .catch(() => {})
      }

      return Promise.resolve(cachedData)
    }
  }

  try {
    const response = await fetchFn()
    setCache(cacheKey, response.data, config)

    updateStats('hit', performance.now() - startTime)
    return response.data
  } catch (error) {
    updateStats('error')

    const cachedData = getFromCache<T>(cacheKey, true)

    if (cachedData !== null) {
      console.warn('[Cache] Request failed, returning stale cache')
      return cachedData
    }

    throw error
  }
}

/**
 * 创建缓存拦截器
 */
export function createCacheInterceptor(options?: {
  defaultTTL?: number
  enablePersist?: boolean
}) {
  const defaultTTL = options?.defaultTTL || DEFAULT_TTL

  return {
    requestInterceptor: (config: InternalAxiosRequestConfig) => {
      // 只缓存GET请求
      if (config.method?.toLowerCase() !== 'get' || config.cache === false) {
        return config
      }

      const cacheKey = generateCacheKey(config)
      const cachedData = getFromCache(cacheKey)

      if (cachedData !== null) {
        // 返回缓存数据，跳过实际请求
        config.adapter = () =>
          Promise.resolve({
            data: cachedData,
            status: 200,
            statusText: 'OK (cached)',
            headers: {},
            config,
          } as AxiosResponse)
      }

      return config
    },

    responseInterceptor: (response: AxiosResponse) => {
      const config = response.config

      // 只缓存成功的GET请求
      if (
        config.method?.toLowerCase() === 'get' &&
        response.status >= 200 &&
        response.status < 300 &&
        config.cache !== false
      ) {
        const cacheKey = generateCacheKey(config)
        const ttl = (config as CacheOptions).ttl || defaultTTL

        setCache(cacheKey, response.data, {
          ttl,
          persist: options?.enablePersist,
          tags: (config as CacheOptions).tags,
          priority: (config as CacheOptions).priority,
        })
      }

      return response
    },
  }
}

/**
 * 从localStorage恢复持久化缓存
 */
export function restorePersistedCache(): number {
  if (typeof window === 'undefined') return 0

  let restoredCount = 0
  const now = Date.now()

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith('cache:')) continue

    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue

      const { data, expiresAt, tags, priority } = JSON.parse(raw)

      if (expiresAt > now) {
        const cacheKey = key.replace('cache:', '')
        cache.set(cacheKey, {
          data,
          timestamp: 0,
          expiresAt,
          tags,
          accessCount: 0,
          lastAccessed: 0,
        })

        // 设置优先级
        if (priority) {
          const entry = cache.get(cacheKey)
          if (entry) {
            ;(entry as any).priority = priority
          }
        }

        restoredCount++
      } else {
        localStorage.removeItem(key)
      }
    } catch (e) {
      console.warn('[Cache] Failed to restore persisted cache:', e)
    }
  }

  return restoredCount
}

/**
 * 预热缓存（批量预加载常用数据）
 */
export async function warmupCache(
  entries: Array<{
    key: string
    fetcher: () => Promise<any>
    options?: CacheOptions
  }>
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  // 并发限制为3个
  const concurrencyLimit = 3
  const batches = []

  for (let i = 0; i < entries.length; i += concurrencyLimit) {
    batches.push(entries.slice(i, i + concurrencyLimit))
  }

  for (const batch of batches) {
    await Promise.allSettled(
      batch.map(async ({ key, fetcher, options }) => {
        try {
          const data = await fetcher()
          setCache(key, data, options)
          success++
        } catch (e) {
          console.warn(`[Cache] Warmup failed for ${key}:`, e)
          failed++
        }
      })
    )
  }

  return { success, failed }
}

// ====== 自动清理定时器 ======
if (typeof window !== 'undefined') {
  setInterval(() => {
    clearExpiredCache()
  }, 60 * 1000)

  // 页面加载时恢复持久化缓存
  window.addEventListener('load', () => {
    restorePersistedCache()
  })
}

export default {
  getFromCache,
  setCache,
  invalidateCache,
  clearExpiredCache,
  getCacheStats,
  resetCacheStats,
  cachedFetch,
  createCacheInterceptor,
  restorePersistedCache,
  warmupCache,
  TTL,
}
