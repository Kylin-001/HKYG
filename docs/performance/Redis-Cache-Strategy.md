# Redis缓存策略优化方案

## 概述

本方案旨在通过优化Redis缓存策略，提升HKYG系统的响应速度和并发处理能力，目标是将系统性能提升30%以上。

## 缓存架构设计

### 1. 多级缓存架构

```
┌─────────────────────────────────────────────────────────┐
│                     应用层                            │
├─────────────────────────────────────────────────────────┤
│                   本地缓存                           │
│              (Caffeine/Guava)                        │
├─────────────────────────────────────────────────────────┤
│                   Redis缓存                           │
│              (分布式缓存)                              │
├─────────────────────────────────────────────────────────┤
│                   数据库                              │
│                (MySQL)                               │
└─────────────────────────────────────────────────────────┘
```

### 2. 缓存分层策略

| 层级 | 缓存类型 | 过期时间 | 用途 |
|------|----------|----------|------|
| L1 | 本地缓存 | 5-30分钟 | 热点数据，减少Redis访问 |
| L2 | Redis缓存 | 30分钟-24小时 | 共享数据，分布式访问 |
| L3 | 数据库 | 持久化 | 数据持久化存储 |

## 缓存策略详细设计

### 1. 用户相关缓存

#### 用户基本信息缓存
```redis
# 缓存键: user:basic:{userId}
# 过期时间: 30分钟
# 数据结构: Hash
HSET user:basic:1001 id 1001 name "张三" phone "13800138000" avatar "http://..."
EXPIRE user:basic:1001 1800

# 批量获取用户基本信息
PIPELINE
HGETALL user:basic:1001
HGETALL user:basic:1002
HGETALL user:basic:1003
EXEC
```

#### 用户权限缓存
```redis
# 缓存键: user:permissions:{userId}
# 过期时间: 15分钟
# 数据结构: Set
SADD user:permissions:1001 "user:view" "user:edit" "product:view"
EXPIRE user:permissions:1001 900

# 检查用户权限
SISMEMBER user:permissions:1001 "user:edit"
```

#### 用户地址缓存
```redis
# 缓存键: user:addresses:{userId}
# 过期时间: 1小时
# 数据结构: List (JSON)
LPUSH user:addresses:1001 '{"id":1,"address":"...","isDefault":true}'
EXPIRE user:addresses:1001 3600
```

### 2. 商品相关缓存

#### 商品基本信息缓存
```redis
# 缓存键: product:basic:{productId}
# 过期时间: 2小时
# 数据结构: Hash
HSET product:basic:1001 id 1001 name "商品名称" price 99.99 stock 100
EXPIRE product:basic:1001 7200

# 批量获取商品信息
MGET product:basic:1001 product:basic:1002 product:basic:1003
```

#### 商品列表缓存
```redis
# 缓存键: product:list:{categoryId}:{page}:{sort}
# 过期时间: 10分钟
# 数据结构: List (JSON)
LPUSH product:list:1:1:sales '[{"id":1001,"name":"..."},...]'
EXPIRE product:list:1:1:sales 600
```

#### 商品搜索缓存
```redis
# 缓存键: product:search:{keywordHash}:{page}
# 过期时间: 5分钟
# 数据结构: List (JSON)
LPUSH product:search:abc123:1 '[{"id":1001,"name":"..."},...]'
EXPIRE product:search:abc123:1 300
```

#### 热门商品缓存
```redis
# 缓存键: product:hot
# 过期时间: 1小时
# 数据结构: Sorted Set (按销量排序)
ZADD product:hot 100 1001 80 1002 60 1003
EXPIRE product:hot 3600

# 获取热门商品
ZREVRANGE product:hot 0 9 WITHSCORES
```

#### 新品缓存
```redis
# 缓存键: product:new
# 过期时间: 1小时
# 数据结构: Sorted Set (按创建时间排序)
ZADD product:new 1672531200 1001 1672617600 1002
EXPIRE product:new 3600
```

### 3. 订单相关缓存

#### 订单详情缓存
```redis
# 缓存键: order:detail:{orderNo}
# 过期时间: 24小时
# 数据结构: Hash
HSET order:detail:ORD20230101001 id 1 orderNo "ORD20230101001" status 1
EXPIRE order:detail:ORD20230101001 86400
```

#### 用户订单列表缓存
```redis
# 缓存键: user:orders:{userId}:{status}:{page}
# 过期时间: 5分钟
# 数据结构: List (JSON)
LPUSH user:orders:1001:1:1 '[{"id":1,"orderNo":"..."},...]'
EXPIRE user:orders:1001:1:1 300
```

#### 订单统计缓存
```redis
# 缓存键: order:stats:daily:{date}
# 过期时间: 25小时
# 数据结构: Hash
HSET order:stats:daily:20230101 total 100 amount 9999.99
EXPIRE order:stats:daily:20230101 90000
```

### 4. 购物车相关缓存

#### 购物车缓存
```redis
# 缓存键: cart:{userId}
# 过期时间: 7天
# 数据结构: Hash
HSET cart:1001 product:1001 '{"quantity":2,"price":99.99}'
HSET cart:1001 product:1002 '{"quantity":1,"price":199.99}'
EXPIRE cart:1001 604800
```

### 5. 分类相关缓存

#### 分类树缓存
```redis
# 缓存键: category:tree
# 过期时间: 6小时
# 数据结构: List (JSON)
LPUSH category:tree '[{"id":1,"name":"...","children":[...]},...]'
EXPIRE category:tree 21600
```

#### 分类商品数量缓存
```redis
# 缓存键: category:product:count:{categoryId}
# 过期时间: 30分钟
# 数据结构: String
SET category:product:count:1 150
EXPIRE category:product:count:1 1800
```

### 6. 营销相关缓存

#### 优惠券缓存
```redis
# 缓存键: coupon:available:{userId}
# 过期时间: 1小时
# 数据结构: List (JSON)
LPUSH coupon:available:1001 '[{"id":1,"name":"..."},...]'
EXPIRE coupon:available:1001 3600
```

#### 会员等级缓存
```redis
# 缓存键: member:levels
# 过期时间: 12小时
# 数据结构: List (JSON)
LPUSH member:levels '[{"id":1,"name":"..."},...]'
EXPIRE member:levels 43200
```

## 缓存更新策略

### 1. 写入时更新（Write-Through）

```java
// 更新用户信息时同时更新缓存
@Transactional
public void updateUser(User user) {
    // 1. 更新数据库
    userMapper.update(user);
    
    // 2. 更新Redis缓存
    redisTemplate.opsForHash().putAll("user:basic:" + user.getId(), convertToHash(user));
    redisTemplate.expire("user:basic:" + user.getId(), 30, TimeUnit.MINUTES);
}
```

### 2. 延迟双删（Cache-Aside + Delayed Delete）

```java
// 更新数据时删除缓存
public void updateProduct(Product product) {
    // 1. 删除缓存
    redisTemplate.delete("product:basic:" + product.getId());
    
    // 2. 更新数据库
    productMapper.update(product);
    
    // 3. 延迟删除缓存（防止脏读）
    scheduledExecutor.schedule(() -> {
        redisTemplate.delete("product:basic:" + product.getId());
    }, 500, TimeUnit.MILLISECONDS);
}
```

### 3. 定时刷新（Scheduled Refresh）

```java
// 定时刷新热点数据
@Scheduled(fixedRate = 30 * 60 * 1000) // 30分钟
public void refreshHotProducts() {
    List<Product> hotProducts = productMapper.getHotProducts();
    redisTemplate.delete("product:hot");
    
    ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
    hotProducts.forEach(product -> {
        zSetOps.add("product:hot", product.getId(), product.getSales());
    });
    redisTemplate.expire("product:hot", 1, TimeUnit.HOURS);
}
```

## 缓存穿透解决方案

### 1. 布隆过滤器

```java
// 使用布隆过滤器防止缓存穿透
@Component
public class BloomFilterService {
    private BloomFilter<String> productBloomFilter;
    
    @PostConstruct
    public void init() {
        // 初始化布隆过滤器
        productBloomFilter = BloomFilter.create(
            Funnels.stringFunnel(Charset.defaultCharset()),
            1000000, // 预期插入数量
            0.01 // 误判率
        );
        
        // 加载所有商品ID到布隆过滤器
        List<String> productIds = productMapper.getAllProductIds();
        productIds.forEach(productBloomFilter::put);
    }
    
    public boolean mightContain(String productId) {
        return productBloomFilter.mightContain(productId);
    }
}
```

### 2. 空值缓存

```java
// 缓存空值防止穿透
public Product getProduct(String productId) {
    // 1. 检查布隆过滤器
    if (!bloomFilterService.mightContain(productId)) {
        return null;
    }
    
    // 2. 从Redis获取
    Product product = redisTemplate.opsForHash().entries("product:basic:" + productId);
    
    // 3. 检查是否为空值
    if (product != null && product.isEmpty()) {
        return null;
    }
    
    // 4. 从数据库获取
    if (product == null) {
        product = productMapper.getById(productId);
        
        // 5. 缓存结果（包括空值）
        if (product != null) {
            redisTemplate.opsForHash().putAll("product:basic:" + productId, convertToHash(product));
            redisTemplate.expire("product:basic:" + productId, 2, TimeUnit.HOURS);
        } else {
            // 缓存空值，短过期时间
            redisTemplate.opsForHash().put("product:basic:" + productId, "empty", "true");
            redisTemplate.expire("product:basic:" + productId, 5, TimeUnit.MINUTES);
        }
    }
    
    return product;
}
```

## 缓存雪崩解决方案

### 1. 缓存过期时间随机化

```java
// 随机化过期时间防止雪崩
public void cacheProduct(Product product) {
    int baseExpireSeconds = 2 * 60 * 60; // 2小时
    int randomExpireSeconds = baseExpireSeconds + new Random().nextInt(600); // 随机0-10分钟
    
    redisTemplate.opsForHash().putAll("product:basic:" + product.getId(), convertToHash(product));
    redisTemplate.expire("product:basic:" + product.getId(), randomExpireSeconds, TimeUnit.SECONDS);
}
```

### 2. 多级缓存

```java
// 使用本地缓存作为一级缓存
@Component
public class ProductService {
    private Cache<String, Product> localCache = Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build();
    
    public Product getProduct(String productId) {
        // 1. 从本地缓存获取
        Product product = localCache.getIfPresent(productId);
        if (product != null) {
            return product;
        }
        
        // 2. 从Redis获取
        product = redisTemplate.opsForHash().entries("product:basic:" + productId);
        if (product != null) {
            localCache.put(productId, product);
            return product;
        }
        
        // 3. 从数据库获取
        product = productMapper.getById(productId);
        if (product != null) {
            // 4. 更新多级缓存
            localCache.put(productId, product);
            redisTemplate.opsForHash().putAll("product:basic:" + productId, convertToHash(product));
            redisTemplate.expire("product:basic:" + productId, 2, TimeUnit.HOURS);
        }
        
        return product;
    }
}
```

### 3. 缓存预热

```java
// 系统启动时预热热点数据
@Component
public class CacheWarmupService {
    
    @EventListener(ApplicationReadyEvent.class)
    public void warmupCache() {
        // 预热热门商品
        List<Product> hotProducts = productMapper.getHotProducts();
        ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
        hotProducts.forEach(product -> {
            zSetOps.add("product:hot", product.getId(), product.getSales());
        });
        redisTemplate.expire("product:hot", 1, TimeUnit.HOURS);
        
        // 预热分类树
        List<Category> categories = categoryMapper.getCategoryTree();
        redisTemplate.opsForList().rightPushAll("category:tree", 
            categories.stream().map(JSON::toJSONString).collect(Collectors.toList()));
        redisTemplate.expire("category:tree", 6, TimeUnit.HOURS);
        
        // 预热会员等级
        List<MemberLevel> levels = memberLevelMapper.getAllLevels();
        redisTemplate.opsForList().rightPushAll("member:levels", 
            levels.stream().map(JSON::toJSONString).collect(Collectors.toList()));
        redisTemplate.expire("member:levels", 12, TimeUnit.HOURS);
    }
}
```

## 缓存监控与告警

### 1. 缓存命中率监控

```java
@Component
public class CacheMetrics {
    private AtomicLong cacheHits = new AtomicLong(0);
    private AtomicLong cacheMisses = new AtomicLong(0);
    
    public void recordHit() {
        cacheHits.incrementAndGet();
    }
    
    public void recordMiss() {
        cacheMisses.incrementAndGet();
    }
    
    public double getHitRate() {
        long hits = cacheHits.get();
        long misses = cacheMisses.get();
        long total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }
}
```

### 2. 缓存容量监控

```java
@Component
public class RedisMonitor {
    
    @Scheduled(fixedRate = 60 * 1000) // 每分钟
    public void monitorRedis() {
        RedisTemplate<String, Object> redisTemplate = getRedisTemplate();
        
        // 获取Redis信息
        Properties info = redisTemplate.getConnectionFactory().getConnection().info();
        
        // 获取内存使用情况
        long usedMemory = Long.parseLong(info.getProperty("used_memory", "0"));
        long maxMemory = Long.parseLong(info.getProperty("maxmemory", "0"));
        double memoryUsagePercent = maxMemory == 0 ? 0.0 : (double) usedMemory / maxMemory;
        
        // 内存使用率超过80%时告警
        if (memoryUsagePercent > 0.8) {
            alertService.sendAlert("Redis内存使用率过高: " + (memoryUsagePercent * 100) + "%");
        }
        
        // 获取键空间统计
        long dbSize = Long.parseLong(info.getProperty("db0", "0").split(",")[0].split("=")[1]);
        
        // 记录监控指标
        metrics.recordGauge("redis.memory.used", usedMemory);
        metrics.recordGauge("redis.memory.max", maxMemory);
        metrics.recordGauge("redis.memory.usage_percent", memoryUsagePercent);
        metrics.recordGauge("redis.db.size", dbSize);
    }
}
```

## Redis配置优化

### 1. 内存优化配置

```conf
# redis.conf
# 最大内存限制
maxmemory 2gb

# 内存使用策略
maxmemory-policy allkeys-lru

# 持久化配置
save 900 1
save 300 10
save 60 10000

# AOF持久化
appendonly yes
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 客户端连接配置
maxclients 10000
timeout 300

# 网络配置
tcp-keepalive 300
tcp-backlog 511

# 慢查询日志
slowlog-log-slower-than 10000
slowlog-max-len 128
```

### 2. 集群配置

```conf
# 集群启用
cluster-enabled yes
cluster-config-file nodes-6379.conf
cluster-node-timeout 15000
cluster-announce-ip 192.168.1.100
cluster-announce-port 6379
cluster-announce-bus-port 16379
```

## 缓存使用最佳实践

### 1. 键命名规范

```
格式: {业务}:{对象}:{标识}:{属性}
示例: 
- user:basic:1001
- product:detail:1001
- order:list:1001:1
- cart:1001
```

### 2. 数据结构选择

| 场景 | 推荐结构 | 说明 |
|------|----------|------|
| 简单键值 | String | 配置信息、状态标记 |
| 对象属性 | Hash | 用户信息、商品信息 |
| 列表数据 | List | 商品列表、订单列表 |
| 排序集合 | Sorted Set | 排行榜、热门商品 |
| 去重集合 | Set | 标签、权限 |

### 3. 过期时间策略

| 数据类型 | 过期时间 | 说明 |
|------|----------|------|
| 用户基本信息 | 30分钟 | 用户信息变更较频繁 |
| 商品信息 | 2小时 | 商品信息相对稳定 |
| 分类信息 | 6小时 | 分类信息很少变更 |
| 订单信息 | 24小时 | 订单信息基本不变 |
| 购物车 | 7天 | 购物车需要持久化 |
| 热点数据 | 1小时 | 热点数据定期刷新 |

### 4. 批量操作优化

```java
// 使用Pipeline减少网络往返
public List<Product> getProducts(List<String> productIds) {
    List<Object> results = redisTemplate.executePipelined(new SessionCallback<Object>() {
        @Override
        public Object execute(RedisOperations operations) throws DataAccessException {
            for (String productId : productIds) {
                operations.opsForHash().entries("product:basic:" + productId);
            }
            return null;
        }
    });
    
    // 处理结果
    return results.stream()
        .map(result -> (Map<String, Object>) result)
        .map(this::convertToProduct)
        .collect(Collectors.toList());
}
```

## 性能评估指标

### 1. 缓存命中率

- 目标: 85%以上
- 计算公式: 命中次数 / (命中次数 + 未命中次数)

### 2. 平均响应时间

- 目标: 降低30%
- 监控API接口平均响应时间

### 3. 系统吞吐量

- 目标: 提升30%
- 监控系统QPS（每秒请求数）

### 4. 数据库负载

- 目标: 降低30%
- 监控数据库连接数、查询次数

## 实施计划

### 第一阶段：基础缓存实现（1周）

1. 实现用户信息缓存
2. 实现商品信息缓存
3. 实现分类信息缓存
4. 实现购物车缓存

### 第二阶段：高级缓存策略（1周）

1. 实现缓存穿透防护
2. 实现缓存雪崩防护
3. 实现缓存预热
4. 实现多级缓存

### 第三阶段：监控与优化（1周）

1. 实现缓存监控
2. 实现性能指标收集
3. 优化缓存策略
4. 性能测试与调优

## 总结

通过实施本Redis缓存策略优化方案，预期可以实现以下目标：

1. 系统响应时间降低30%以上
2. 数据库负载降低30%以上
3. 系统吞吐量提升30%以上
4. 缓存命中率达到85%以上

同时，通过多级缓存架构和防护机制，确保系统的高可用性和稳定性。