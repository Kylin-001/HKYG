# Redis缓存架构优化文档

## 概述

本文档描述了黑科易购校园服务平台前端项目的Redis缓存架构优化措施，旨在将缓存命中率提升至80%以上。

## 缓存架构设计

### 1. 多层缓存架构

```
┌─────────────────────────────────────────────────────────┐
│                前端应用                        │
├─────────────────────────────────────────────────────────┤
│  内存缓存 (LRU)  │  IndexedDB  │  Redis     │
│  (最快访问)      │  (中等访问)  │  (持久存储)  │
└─────────────────────────────────────────────────────────┘
```

### 2. 缓存策略

- **LRU (Least Recently Used)**: 最近最少使用策略，适合大多数场景
- **LFU (Least Frequently Used)**: 最少使用频率策略，适合热点数据
- **TTL (Time To Live)**: 基于时间的策略，适合有过期需求的数据
- **RANDOM**: 随机策略，适合均匀分布的数据

### 3. 缓存分类

| 缓存类型 | TTL | 策略 | 说明 |
|---------|-----|------|------|
| 用户资料 | 30分钟 | LRU | 用户基本信息和设置 |
| 商品列表 | 10分钟 | LRU | 商品列表和搜索结果 |
| 商品详情 | 30分钟 | LFU | 热门商品详情 |
| 购物车 | 5分钟 | LRU | 购物车商品 |
| 订单列表 | 15分钟 | LRU | 用户订单历史 |
| 搜索结果 | 10分钟 | LRU | 搜索关键词和结果 |
| 分类列表 | 60分钟 | LRU | 商品分类信息 |

## 缓存实现

### 1. 缓存服务

```typescript
import { createCacheService } from '@/utils/cache-service'

// 创建缓存服务实例
const cacheService = createCacheService({
  adapter: 'multi', // 多层缓存
  strategy: 'lru', // LRU策略
  ttl: 3600, // 默认1小时
  maxSize: 1000, // 最大1000项
  maxMemory: 10 * 1024 * 1024, // 最大10MB
  enableStats: true, // 启用统计
  enableWarmup: true, // 启用预热
  enableCleanup: true, // 启用清理
})

// 基本操作
await cacheService.set('user:123', userData, { ttl: 1800, tags: ['user'] })
const userData = await cacheService.get('user:123')
await cacheService.delete('user:123')

// 批量操作
await cacheService.mset([
  { key: 'product:1', value: product1 },
  { key: 'product:2', value: product2 },
])

// 标签操作
const userKeys = await cacheService.getKeysByTag('user')
await cacheService.deleteByTag('user')
```

### 2. 缓存装饰器

```typescript
import { Cacheable } from '@/utils/cache-service'

class UserService {
  @Cacheable({ ttl: 1800, tags: ['user'] })
  async getUserProfile(id: string) {
    // 方法结果会被自动缓存
    return await api.getUserProfile(id)
  }
  
  @Cacheable({ ttl: 600, tags: ['search'] })
  async searchProducts(keyword: string) {
    // 搜索结果会被缓存10分钟
    return await api.searchProducts(keyword)
  }
}
```

### 3. 缓存预热

```typescript
import { cacheWarmupManager } from '@/utils/cache-strategy'

// 注册预热任务
cacheWarmupManager.registerWarmupTask('popular-products', async () => {
  const products = await api.getPopularProducts()
  const cacheItems = products.map(product => ({
    key: `product:${product.id}`,
    value: product,
    ttl: 1800, // 30分钟
    tags: ['product', 'popular'],
  }))
  
  await cacheService.mset(cacheItems)
})

// 执行预热
await cacheWarmupManager.warmup()
```

## 缓存监控

### 1. 性能监控

```typescript
import { cacheMonitor } from '@/utils/cache-monitor'

// 开始监控
cacheMonitor.startMonitoring(60000) // 每分钟监控一次

// 获取当前指标
const metrics = cacheMonitor.getCurrentMetrics()
console.log(`命中率: ${metrics.hitRate}`)
console.log(`内存使用: ${metrics.memoryUsage} bytes`)

// 获取历史指标
const history = cacheMonitor.getMetricsHistory(24) // 最近24次记录
```

### 2. 性能分析

```typescript
import { cacheAnalyzer } from '@/utils/cache-monitor'

// 分析日性能
const dailyAnalysis = cacheAnalyzer.analyzePerformance('day')
console.log(`日平均命中率: ${dailyAnalysis.metrics.hitRate}`)
console.log(`日平均内存使用: ${dailyAnalysis.metrics.memoryUsage}`)

// 生成性能报告
cacheReportGenerator.downloadReport(dailyAnalysis)
```

### 3. 告警系统

```typescript
// 自动告警配置
const alertConfig = {
  hitRateThreshold: 0.7, // 命中率低于70%告警
  memoryUsageThreshold: 0.9, // 内存使用超过90%告警
  keyCountThreshold: 100, // 键数量少于100告警
}

// 告警处理
cacheMonitor.on('alert', (type, data) => {
  switch (type) {
    case 'low_hit_rate':
      console.warn(`缓存命中率过低: ${data.current}`)
      // 发送告警通知
      notificationService.warn('缓存命中率过低', data)
      break
      
    case 'high_memory_usage':
      console.warn(`内存使用过高: ${data.usageRate}`)
      // 发送告警通知
      notificationService.warn('内存使用过高', data)
      break
  }
})
```

## 缓存优化策略

### 1. 数据结构优化

```typescript
// 优化缓存数据结构
interface OptimizedCacheItem {
  // 使用短字段名
  id: string
  nm: string // 代替 name
  val: any // 代替 value
  ttl: number // 代替 expireTime
  ts: number // 代替 timestamp
}

// 压缩数据
const compressedData = compress(JSON.stringify(data))
const cacheItem = {
  key: 'compressed-data',
  value: compressedData,
  ttl: 3600,
}
```

### 2. 键设计优化

```typescript
// 使用分层键设计
const keyPatterns = {
  user: 'u:{userId}', // u:123
  userProfile: 'up:{userId}', // up:123
  userSettings: 'us:{userId}', // us:123
  
  product: 'p:{productId}', // p:456
  productList: 'pl:{page}:{sort}', // pl:1:price
  productDetail: 'pd:{productId}', // pd:456
  
  search: 's:{keyword}:{page}', // s:手机:1
  searchResults: 'sr:{searchId}', // sr:abc123
}

// 生成键
const userKey = cacheUtils.generateKey('user', userId)
const searchKey = cacheUtils.generateKey('search', keyword, page)
```

### 3. 批量操作优化

```typescript
// 使用管道批量操作
const pipeline = redis.pipeline()
const operations = []

for (const item of items) {
  pipeline.set(item.key, item.value, 'EX', item.ttl)
  operations.push(pipeline.exec())
}

await Promise.all(operations)

// 使用mget/mset批量操作
const keys = items.map(item => item.key)
const values = items.map(item => item.value)

await redis.mset(...keys.flatMap((key, index) => [key, values[index]]))
const results = await redis.mget(...keys)
```

## 缓存配置

### 1. 环境变量配置

```bash
# .env.cache
# Redis连接配置
VITE_REDIS_HOST=localhost
VITE_REDIS_PORT=6379
VITE_REDIS_PASSWORD=
VITE_REDIS_DB=0
VITE_REDIS_KEY_PREFIX=heikeji:

# 缓存策略配置
VITE_CACHE_STRATEGY=lru
VITE_CACHE_ADAPTER=multi
VITE_CACHE_DEFAULT_TTL=3600
VITE_CACHE_MAX_SIZE=1000
VITE_CACHE_MAX_MEMORY=10485760

# 缓存功能开关
VITE_ENABLE_CACHE=true
VITE_ENABLE_CACHE_STATS=true
VITE_ENABLE_CACHE_WARMUP=true
VITE_ENABLE_CACHE_CLEANUP=true
VITE_CACHE_CLEANUP_INTERVAL=60000

# 缓存监控配置
VITE_CACHE_MONITOR_ENABLED=true
VITE_CACHE_MONITOR_INTERVAL=60000
VITE_CACHE_ALERT_HIT_RATE_BELOW=0.7
VITE_CACHE_ALERT_MEMORY_USAGE_ABOVE=0.9
```

### 2. 动态配置

```typescript
// 根据环境动态调整配置
const getCacheConfig = () => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD
  
  if (isDevelopment) {
    return {
      ttl: 300, // 开发环境短TTL
      maxSize: 500,
      enableStats: true,
      enableCleanup: false, // 开发环境不自动清理
    }
  }
  
  if (isProduction) {
    return {
      ttl: 3600, // 生产环境长TTL
      maxSize: 2000,
      enableStats: true,
      enableCleanup: true,
      cleanupInterval: 30000, // 生产环境更频繁清理
    }
  }
  
  return defaultConfig
}

const cacheService = createCacheService(getCacheConfig())
```

## 缓存测试

### 1. 单元测试

```bash
# 运行缓存测试
npm run test:cache

# 运行缓存覆盖率测试
npm run test:cache:coverage
```

### 2. 性能测试

```bash
# 运行缓存性能测试
npm run test:cache:performance

# 生成缓存性能报告
npm run report:cache
```

### 3. 集成测试

```bash
# 运行缓存集成测试
npm run test:cache:integration

# 运行缓存E2E测试
npm run test:cache:e2e
```

## 部署配置

### 1. Redis集群配置

```yaml
# docker-compose.yml
version: '3.8'
services:
  redis-master:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    
  redis-slave1:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    depends_on:
      - redis-master
    command: redis-server --slaveof redis-master 6379
    
  redis-slave2:
    image: redis:7-alpine
    ports:
      - "6381:6379"
    depends_on:
      - redis-master
    command: redis-server --slaveof redis-master 6379
```

### 2. Nginx配置

```nginx
# nginx.conf
upstream redis_backend {
    server redis1:6379;
    server redis2:6379;
    server redis3:6379;
}

server {
    listen 80;
    
    location /api/cache {
        set $redis_key $arg_key;
        set $redis_ttl $arg_ttl;
        
        redis_pass redis_backend;
        
        default_type text/plain;
        redis_query GET $redis_key;
        
        if ($redis_value) {
            add_header X-Cache-Status HIT;
            add_header X-Cache-TTL $redis_ttl;
            add_header Content-Type application/json;
            echo $redis_value;
        }
        
        add_header X-Cache-Status MISS;
        return 404;
    }
}
```

## 最佳实践

### 1. 缓存设计原则

- **单一职责**: 每个缓存项只负责一种数据类型
- **合理TTL**: 根据数据更新频率设置合适的过期时间
- **键设计**: 使用有意义的命名规范，避免冲突
- **数据压缩**: 对大数据进行压缩存储
- **版本控制**: 使用版本号处理缓存更新

### 2. 性能优化原则

- **批量操作**: 尽可能使用批量操作减少网络开销
- **管道操作**: 使用Redis管道提高执行效率
- **连接池**: 复用连接减少连接开销
- **异步操作**: 避免阻塞主线程
- **内存管理**: 及时清理过期数据，控制内存使用

### 3. 监控原则

- **实时监控**: 监控命中率和内存使用情况
- **趋势分析**: 分析历史数据发现性能问题
- **告警机制**: 设置合理的告警阈值
- **定期报告**: 生成定期性能报告
- **容量规划**: 根据业务增长规划缓存容量

## 常见问题与解决方案

### 1. 缓存穿透

**问题**: 大量请求不存在的数据，导致请求直接到达数据库

**解决方案**:
- 使用布隆过滤器过滤不存在的键
- 对空结果进行短期缓存
- 设置互斥锁防止并发请求

```typescript
// 布隆过滤器实现
class BloomFilter {
  private filter: Uint8Array
  private size: number
  
  constructor(size: number) {
    this.size = size
    this.filter = new Uint8Array(size)
  }
  
  add(key: string): void {
    const hash = this.hash(key)
    const index = hash % this.size
    this.filter[index] |= (1 << (hash / this.size))
  }
  
  mightContain(key: string): boolean {
    const hash = this.hash(key)
    const index = hash % this.size
    return (this.filter[index] & (1 << (hash / this.size))) !== 0
  }
  
  private hash(key: string): number {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i)
      hash = hash & hash
      hash = hash | (hash >>> 2)
    }
    return Math.abs(hash)
  }
}
```

### 2. 缓存雪崩

**问题**: 大量缓存同时过期，导致大量请求同时到达数据库

**解决方案**:
- 设置随机过期时间，避免同时过期
- 使用互斥锁，只允许一个请求更新缓存
- 设置缓存标记，标识正在更新中

```typescript
// 互斥锁实现
class CacheLock {
  async acquire(key: string, ttl: number = 10): Promise<boolean> {
    const lockKey = `lock:${key}`
    const lockValue = Date.now().toString()
    
    // 尝试获取锁
    const result = await redis.set(lockKey, lockValue, 'PX', ttl * 1000, 'NX')
    return result === 'OK'
  }
  
  async release(key: string): Promise<void> {
    const lockKey = `lock:${key}`
    await redis.del(lockKey)
  }
}
```

### 3. 缓存击穿

**问题**: 热点数据过期，大量请求同时到达数据库

**解决方案**:
- 设置永不过期的热点数据
- 使用本地缓存作为第一道防线
- 使用队列化处理，避免并发更新

```typescript
// 热点数据保护
class HotDataProtector {
  private localCache = new Map<string, any>()
  private updateQueue = new Map<string, Promise<any>>()
  
  async get(key: string): Promise<any> {
    // 先检查本地缓存
    if (this.localCache.has(key)) {
      return this.localCache.get(key)
    }
    
    // 检查是否正在更新
    if (this.updateQueue.has(key)) {
      return await this.updateQueue.get(key)
    }
    
    // 从缓存获取
    const value = await redis.get(key)
    if (value) {
      this.localCache.set(key, value)
    }
    
    return value
  }
  
  async set(key: string, value: any, ttl: number): Promise<void> {
    // 设置本地缓存
    this.localCache.set(key, value)
    
    // 设置Redis缓存
    await redis.set(key, value, 'EX', ttl)
  }
}
```

## 缓存优化清单

### 配置优化
- [ ] 根据业务特点选择合适的缓存策略
- [ ] 设置合理的TTL，平衡性能和数据新鲜度
- [ ] 配置适当的缓存大小，避免内存浪费
- [ ] 启用缓存统计和监控
- [ ] 配置告警阈值，及时发现问题

### 性能优化
- [ ] 使用批量操作减少网络开销
- [ ] 使用管道操作提高执行效率
- [ ] 实现缓存预热，提高命中率
- [ ] 定期清理过期数据，控制内存使用
- [ ] 压缩大数据，减少内存占用

### 监控优化
- [ ] 实现实时性能监控
- [ ] 设置合理的告警阈值
- [ ] 定期生成性能报告
- [ ] 分析历史数据，发现性能趋势
- [ ] 建立容量规划，应对业务增长

### 测试优化
- [ ] 编写全面的单元测试
- [ ] 进行性能基准测试
- [ ] 实施集成测试
- [ ] 进行压力测试
- [ ] 测试故障恢复机制

---

**注意**: 缓存优化是一个持续的过程，需要根据实际业务情况不断调整和优化。本文档会随着项目发展而更新，请定期查看最新版本。