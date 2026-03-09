/**
 * 缓存适配器
 * 用于统一不同缓存实现的接口
 */

// 缓存接口
interface ICacheAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
  ttl(key: string): Promise<number>
  clear(): Promise<void>
  getStats(): Promise<CacheStats>
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

// 内存缓存实现
class MemoryCacheAdapter implements ICacheAdapter {
  private cache = new Map<string, { value: any; expireTime: number }>()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }
  
  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)
    
    if (item && item.expireTime > Date.now()) {
      this.stats.hits++
      this.updateHitRate()
      return item.value as T
    }
    
    this.stats.misses++
    this.updateHitRate()
    return null
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const size = JSON.stringify(value).length
    const expireTime = Date.now() + ttl * 1000
    
    this.cache.set(key, { value, expireTime })
    this.stats.totalKeys = this.cache.size
    this.stats.memoryUsage += size
  }
  
  async delete(key: string): Promise<void> {
    this.cache.delete(key)
    this.stats.totalKeys = this.cache.size
  }
  
  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key)
    return item ? item.expireTime > Date.now() : false
  }
  
  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key)
    if (!item) return -2
    
    const remainingTime = Math.floor((item.expireTime - Date.now()) / 1000)
    return Math.max(0, remainingTime)
  }
  
  async clear(): Promise<void> {
    this.cache.clear()
    this.stats.totalKeys = 0
    this.stats.memoryUsage = 0
  }
  
  async getStats(): Promise<CacheStats> {
    return { ...this.stats }
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
  
  // 清理过期项
  cleanup(): number {
    let cleanedCount = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expireTime <= now) {
        this.cache.delete(key)
        cleanedCount++
        this.stats.expiredKeys++
      }
    }
    
    this.stats.totalKeys = this.cache.size
    return cleanedCount
  }
}

// 本地存储缓存实现
class LocalStorageAdapter implements ICacheAdapter {
  private prefix: string
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }
  
  constructor(prefix = 'cache:') {
    this.prefix = prefix
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key)
      
      if (item) {
        const parsed = JSON.parse(item)
        
        if (parsed.expireTime > Date.now()) {
          this.stats.hits++
          this.updateHitRate()
          return parsed.value as T
        } else {
          // 清理过期项
          localStorage.removeItem(this.prefix + key)
          this.stats.expiredKeys++
        }
      }
      
      this.stats.misses++
      this.updateHitRate()
      return null
    } catch (error) {
      console.error('LocalStorage获取失败:', error)
      this.stats.misses++
      this.updateHitRate()
      return null
    }
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      const item = {
        value,
        expireTime: Date.now() + ttl * 1000,
      }
      
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
      
      const size = JSON.stringify(item).length
      this.stats.memoryUsage += size
      this.updateTotalKeys()
    } catch (error) {
      console.error('LocalStorage设置失败:', error)
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key)
      this.updateTotalKeys()
    } catch (error) {
      console.error('LocalStorage删除失败:', error)
    }
  }
  
  async exists(key: string): Promise<boolean> {
    try {
      const item = localStorage.getItem(this.prefix + key)
      
      if (!item) return false
      
      const parsed = JSON.parse(item)
      return parsed.expireTime > Date.now()
    } catch (error) {
      console.error('LocalStorage检查存在失败:', error)
      return false
    }
  }
  
  async ttl(key: string): Promise<number> {
    try {
      const item = localStorage.getItem(this.prefix + key)
      
      if (!item) return -2
      
      const parsed = JSON.parse(item)
      const remainingTime = Math.floor((parsed.expireTime - Date.now()) / 1000)
      return Math.max(0, remainingTime)
    } catch (error) {
      console.error('LocalStorage获取TTL失败:', error)
      return -1
    }
  }
  
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      
      keys.forEach(key => {
        localStorage.removeItem(key)
      })
      
      this.stats.totalKeys = 0
      this.stats.memoryUsage = 0
    } catch (error) {
      console.error('LocalStorage清空失败:', error)
    }
  }
  
  async getStats(): Promise<CacheStats> {
    this.updateTotalKeys()
    return { ...this.stats }
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
  
  private updateTotalKeys(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
    this.stats.totalKeys = keys.length
  }
}

// IndexedDB缓存实现
class IndexedDBAdapter implements ICacheAdapter {
  private dbName: string
  private storeName: string
  private db: IDBDatabase | null = null
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }
  
  constructor(dbName = 'CacheDB', storeName = 'cache') {
    this.dbName = dbName
    this.storeName = storeName
  }
  
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.get(key)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const result = request.result
          
          if (result && result.expireTime > Date.now()) {
            this.stats.hits++
            this.updateHitRate()
            resolve(result.value as T)
          } else {
            if (result) {
              // 清理过期项
              this.delete(key)
              this.stats.expiredKeys++
            }
            
            this.stats.misses++
            this.updateHitRate()
            resolve(null)
          }
        }
      })
    } catch (error) {
      console.error('IndexedDB获取失败:', error)
      this.stats.misses++
      this.updateHitRate()
      return null
    }
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        
        const item = {
          key,
          value,
          expireTime: Date.now() + ttl * 1000,
          size: JSON.stringify(value).length,
        }
        
        const request = store.put(item)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          this.stats.memoryUsage += item.size
          this.updateTotalKeys()
          resolve()
        }
      })
    } catch (error) {
      console.error('IndexedDB设置失败:', error)
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        
        const request = store.delete(key)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          this.updateTotalKeys()
          resolve()
        }
      })
    } catch (error) {
      console.error('IndexedDB删除失败:', error)
    }
  }
  
  async exists(key: string): Promise<boolean> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        
        const request = store.get(key)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const result = request.result
          resolve(result ? result.expireTime > Date.now() : false)
        }
      })
    } catch (error) {
      console.error('IndexedDB检查存在失败:', error)
      return false
    }
  }
  
  async ttl(key: string): Promise<number> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        
        const request = store.get(key)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const result = request.result
          
          if (!result) {
            resolve(-2)
          } else {
            const remainingTime = Math.floor((result.expireTime - Date.now()) / 1000)
            resolve(Math.max(0, remainingTime))
          }
        }
      })
    } catch (error) {
      console.error('IndexedDB获取TTL失败:', error)
      return -1
    }
  }
  
  async clear(): Promise<void> {
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)
        
        const request = store.clear()
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          this.stats.totalKeys = 0
          this.stats.memoryUsage = 0
          resolve()
        }
      })
    } catch (error) {
      console.error('IndexedDB清空失败:', error)
    }
  }
  
  async getStats(): Promise<CacheStats> {
    this.updateTotalKeys()
    return { ...this.stats }
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
  
  private updateTotalKeys(): void {
    if (!this.db) return
    
    const db = this.db
    const transaction = db.transaction([this.storeName], 'readonly')
    const store = transaction.objectStore(this.storeName)
    
    const request = store.count()
    
    request.onsuccess = () => {
      this.stats.totalKeys = request.result
    }
  }
}

// 缓存适配器工厂
class CacheAdapterFactory {
  private static adapters = new Map<string, ICacheAdapter>()
  
  // 注册适配器
  static register(name: string, adapter: ICacheAdapter): void {
    this.adapters.set(name, adapter)
  }
  
  // 创建适配器
  static create(type: string, options?: any): ICacheAdapter {
    const AdapterClass = this.adapters.get(type)
    if (!AdapterClass) {
      throw new Error(`未知的缓存类型: ${type}`)
    }
    
    return new AdapterClass(options)
  }
  
  // 获取可用适配器
  static getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys())
  }
}

// 注册默认适配器
CacheAdapterFactory.register('memory', MemoryCacheAdapter)
CacheAdapterFactory.register('localStorage', LocalStorageAdapter)
CacheAdapterFactory.register('indexedDB', IndexedDBAdapter)

// 多层缓存
class MultiLayerCache implements ICacheAdapter {
  private layers: ICacheAdapter[]
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    expiredKeys: 0,
    evictedKeys: 0,
  }
  
  constructor(layers: ICacheAdapter[]) {
    this.layers = layers
  }
  
  async get<T>(key: string): Promise<T | null> {
    // 从第一层开始查找
    for (let i = 0; i < this.layers.length; i++) {
      const value = await this.layers[i].get<T>(key)
      
      if (value !== null) {
        // 如果不是第一层，回填到上层缓存
        if (i > 0) {
          for (let j = 0; j < i; j++) {
            await this.layers[j].set(key, value)
          }
        }
        
        this.stats.hits++
        this.updateHitRate()
        return value
      }
    }
    
    this.stats.misses++
    this.updateHitRate()
    return null
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // 设置到所有层
    await Promise.all(this.layers.map(layer => layer.set(key, value, ttl)))
  }
  
  async delete(key: string): Promise<void> {
    // 从所有层删除
    await Promise.all(this.layers.map(layer => layer.delete(key)))
  }
  
  async exists(key: string): Promise<boolean> {
    // 检查第一层
    return await this.layers[0].exists(key)
  }
  
  async ttl(key: string): Promise<number> {
    // 获取第一层的TTL
    return await this.layers[0].ttl(key)
  }
  
  async clear(): Promise<void> {
    // 清空所有层
    await Promise.all(this.layers.map(layer => layer.clear()))
  }
  
  async getStats(): Promise<CacheStats> {
    // 获取第一层的统计
    return await this.layers[0].getStats()
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }
}

// 创建缓存适配器
export const createCacheAdapter = (type: string, options?: any): ICacheAdapter => {
  return CacheAdapterFactory.create(type, options)
}

// 创建多层缓存
export const createMultiLayerCache = (layers: string[]): ICacheAdapter => {
  const adapters = layers.map(type => CacheAdapterFactory.create(type))
  return new MultiLayerCache(adapters)
}

// 创建默认多层缓存（内存 -> IndexedDB -> Redis）
export const createDefaultMultiLayerCache = (): ICacheAdapter => {
  return createMultiLayerCache(['memory', 'indexedDB', 'redis'])
}

export {
  ICacheAdapter,
  CacheStats,
  MemoryCacheAdapter,
  LocalStorageAdapter,
  IndexedDBAdapter,
  CacheAdapterFactory,
  MultiLayerCache,
}

export default CacheAdapterFactory