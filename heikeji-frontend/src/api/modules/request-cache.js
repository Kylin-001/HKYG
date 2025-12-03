/**
 * 请求缓存管理模块
 * 负责缓存GET请求的响应数据
 */

import logger from '../../utils/logger'

export function createRequestCache() {
  const cache = new Map()
  const defaultCacheTime = 5 * 60 * 1000 // 默认缓存5分钟

  function generateKey(config) {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  function shouldCache(config) {
    // 只有GET请求才缓存，并且没有明确设置不缓存
    return config.method === 'get' && config.cache !== false
  }

  function get(config) {
    if (!shouldCache(config)) {
      return null
    }

    const key = generateKey(config)
    const cached = cache.get(key)

    if (cached) {
      // 检查缓存是否过期
      const cacheTime = config.cacheTime || defaultCacheTime
      if (Date.now() - cached.timestamp < cacheTime) {
        logger.debug('🔄 使用缓存响应:', config.url)
        return cached.data
      } else {
        // 缓存过期，删除缓存
        cache.delete(key)
      }
    }

    return null
  }

  function set(config, response) {
    if (!shouldCache(config)) {
      return
    }

    const key = generateKey(config)
    cache.set(key, {
      data: response,
      timestamp: Date.now(),
    })

    // 限制缓存大小，防止内存泄漏
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
  }

  function clear() {
    cache.clear()
  }

  function remove(config) {
    const key = generateKey(config)
    cache.delete(key)
  }

  function getCacheInfo() {
    const entries = Array.from(cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      data: value.data,
    }))

    return {
      size: cache.size,
      entries: entries.slice(0, 10), // 只返回前10条记录
    }
  }

  return {
    get,
    set,
    clear,
    remove,
    getCacheInfo,
  }
}
