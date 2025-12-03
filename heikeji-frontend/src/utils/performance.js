import logger from './logger'

// Vue组件性能优化工具

/**
 * 防抖函数 - 减少频繁触发
 */
export function debounce(fn, delay = 300) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数 - 控制执行频率
 */
export function throttle(fn, delay = 100) {
  let timer
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      fn.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timer)
      timer = setTimeout(
        () => {
          fn.apply(this, args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime)
      )
    }
  }
}

/**
 * 虚拟滚动优化 - 处理大列表
 */
export function virtualScroll(items, startIndex, endIndex, itemHeight) {
  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
  }
}

/**
 * 深拷贝 - 避免引用问题
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }

  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 缓存函数结果
 */
export function memoize(fn, getKey = (...args) => JSON.stringify(args)) {
  const cache = new Map()

  return function (...args) {
    const key = getKey(...args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

/**
 * 异步加载器
 */
export class AsyncLoader {
  constructor(options = {}) {
    this.cache = new Map()
    this.loader = options.loader || (() => Promise.resolve())
    this.getKey = options.getKey || ((...args) => JSON.stringify(args))
    this.maxCache = options.maxCache || 100
  }

  async load(...args) {
    const key = this.getKey(...args)

    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    try {
      const result = await this.loader(...args)

      // 缓存管理
      if (this.cache.size >= this.maxCache) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }

      this.cache.set(key, result)
      return result
    } catch (error) {
      logger.error('AsyncLoader error:', error)
      throw error
    }
  }

  clear() {
    this.cache.clear()
  }
}

/**
 * 组件卸载时清理定时器
 */
export function setupCleanupTimer(component, cleanupFn) {
  const cleanup = () => {
    if (cleanupFn) {
      cleanupFn()
    }
  }

  // 在组件销毁前清理
  if (component.$once) {
    component.$once('hook:beforeDestroy', cleanup)
  } else {
    // 兼容性处理
    const originalDestroy = component.beforeDestroy
    component.beforeDestroy = function () {
      cleanup()
      if (originalDestroy) {
        originalDestroy.call(this)
      }
    }
  }
}

/**
 * 性能监控装饰器
 */
export function performanceMonitor(target, propertyName, descriptor) {
  const method = descriptor.value

  descriptor.value = async function (...args) {
    const startTime = performance.now()
    const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0

    try {
      const result = await method.apply(this, args)
      const endTime = performance.now()
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0

      logger.info(`${propertyName} 执行时间: ${(endTime - startTime).toFixed(2)}ms`)
      if (performance.memory) {
        logger.info(
          `${propertyName} 内存变化: ${((endMemory - startMemory) / 1024 / 1024).toFixed(2)}MB`
        )
      }

      return result
    } catch (error) {
      logger.error(`${propertyName} 执行错误:`, error)
      throw error
    }
  }

  return descriptor
}
