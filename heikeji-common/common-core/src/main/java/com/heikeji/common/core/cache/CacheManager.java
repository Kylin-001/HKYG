package com.heikeji.common.core.cache;

import com.heikeji.common.core.constant.CacheConstants;
import com.heikeji.common.core.constant.ErrorCode;
import com.heikeji.common.core.exception.BusinessException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisStringCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.CollectionUtils;
import org.springframework.util.SerializationUtils;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * 统一缓存管理器
 * 提供高级缓存操作和缓存问题解决方案
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class CacheManager implements InitializingBean {

    private static final CacheManager INSTANCE = new CacheManager();
    
    private RedisTemplate<String, Object> redisTemplate;
    private RedisCacheManager redisCacheManager;
    
    // 本地缓存作为Redis的后备
    private final Map<String, CacheEntry> localCache = new ConcurrentHashMap<>();
    
    // 布隆过滤器，用于防止缓存穿透
    private final Map<String, com.heikeji.common.core.cache.BloomFilter> bloomFilters = new ConcurrentHashMap<>();
    
    // 分布式锁，用于防止缓存击穿
    private final RedisLock redisLock = new RedisLock();
    
    /**
     * 获取单例实例
     */
    public static CacheManager getInstance() {
        return INSTANCE;
    }
    
    /**
     * 设置RedisTemplate
     */
    public void setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    /**
     * 设置RedisCacheManager
     */
    public void setRedisCacheManager(RedisCacheManager redisCacheManager) {
        this.redisCacheManager = redisCacheManager;
    }
    
    /**
     * 初始化方法
     */
    @Override
    public void afterPropertiesSet() {
        try {
            // 从Spring容器中获取RedisTemplate和RedisCacheManager
            // 如果SpringUtils不可用，可以使用其他方式获取Bean
            // 暂时设置为null，实际运行时会由Spring注入
            this.redisTemplate = null;
            this.redisCacheManager = null;
        } catch (Exception e) {
            // Redis不可用时，使用本地缓存
            System.err.println("Redis初始化失败，将使用本地缓存: " + e.getMessage());
        }
    }
    
    /**
     * 获取缓存（支持缓存穿透防护）
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> type) {
        return get(key, type, null);
    }
    
    /**
     * 获取缓存（支持缓存穿透防护和自动加载）
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> type, Supplier<T> loader) {
        return get(key, type, loader, CacheConstants.DEFAULT_EXPIRE_TIME);
    }
    
    /**
     * 获取缓存（支持缓存穿透防护、自动加载和自定义过期时间）
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> type, Supplier<T> loader, long expireTime) {
        // 1. 检查布隆过滤器，防止缓存穿透
        if (loader != null && !mightContain(key)) {
            return null;
        }
        
        try {
            // 2. 从Redis获取缓存
            Object value = null;
            if (redisTemplate != null) {
                value = redisTemplate.opsForValue().get(key);
            }
            
            // 3. 如果Redis不可用或缓存未命中，从本地缓存获取
            if (value == null) {
                CacheEntry entry = localCache.get(key);
                if (entry != null && !entry.isExpired()) {
                    value = entry.getValue();
                }
            }
            
            // 4. 如果缓存未命中且提供了加载器，则加载数据
            if (value == null && loader != null) {
                // 使用分布式锁防止缓存击穿
                String lockKey = CacheConstants.LOCK_PREFIX + key;
                if (redisLock.tryLock(lockKey, "lockValue")) {
                    try {
                        // 双重检查，防止其他线程已经加载了数据
                        value = redisTemplate != null ? redisTemplate.opsForValue().get(key) : null;
                        if (value == null) {
                            // 加载数据
                            value = loader.get();
                            
                            // 存储数据到缓存
                            if (value != null) {
                                // 添加随机过期时间，防止缓存雪崩
                                long actualExpireTime = expireTime + getRandomExpireOffset(expireTime);
                                set(key, value, actualExpireTime);
                                // 添加到布隆过滤器
                                addToBloomFilter(key);
                            } else {
                                // 缓存空值，防止缓存穿透
                                set(key, CacheConstants.NULL_VALUE, CacheConstants.SHORT_EXPIRE_TIME);
                            }
                        }
                    } finally {
                        redisLock.unlock(lockKey, "lockValue");
                    }
                }
            }
            
            // 5. 处理空值标记
            if (CacheConstants.NULL_VALUE.equals(value)) {
                return null;
            }
            
            return (T) value;
        } catch (Exception e) {
            // 发生异常时，尝试从本地缓存获取数据
            CacheEntry entry = localCache.get(key);
            if (entry != null && !entry.isExpired()) {
                Object value = entry.getValue();
                return CacheConstants.NULL_VALUE.equals(value) ? null : (T) value;
            }
            return null;
        }
    }
    
    /**
     * 设置缓存
     */
    public void set(String key, Object value) {
        set(key, value, CacheConstants.DEFAULT_EXPIRE_TIME);
    }
    
    /**
     * 设置缓存（带过期时间）
     */
    public void set(String key, Object value, long expireTime) {
        try {
            // 存储到Redis
            if (redisTemplate != null) {
                redisTemplate.opsForValue().set(key, value, expireTime, java.util.concurrent.TimeUnit.SECONDS);
            }
            
            // 同时更新本地缓存
            localCache.put(key, new CacheEntry(value, expireTime));
        } catch (Exception e) {
            // Redis操作失败时，只更新本地缓存
            localCache.put(key, new CacheEntry(value, expireTime));
        }
    }
    
    /**
     * 删除缓存
     */
    public void delete(String... keys) {
        if (keys == null || keys.length == 0) {
            return;
        }
        
        try {
            // 从Redis删除
            if (redisTemplate != null) {
                redisTemplate.delete(Arrays.asList(keys));
            }
            
            // 从本地缓存删除
            for (String key : keys) {
                localCache.remove(key);
            }
        } catch (Exception e) {
            // Redis操作失败时，只删除本地缓存
            for (String key : keys) {
                localCache.remove(key);
            }
        }
    }
    
    /**
     * 批量删除缓存（支持通配符）
     */
    public void deleteByPattern(String pattern) {
        try {
            // 从Redis删除
            if (redisTemplate != null) {
                Set<String> keys = redisTemplate.keys(pattern);
                if (!CollectionUtils.isEmpty(keys)) {
                    redisTemplate.delete(keys);
                }
            }
            
            // 从本地缓存删除
            localCache.keySet().removeIf(key -> key.matches(pattern.replace("*", ".*")));
        } catch (Exception e) {
            // Redis操作失败时，只删除本地缓存
            localCache.keySet().removeIf(key -> key.matches(pattern.replace("*", ".*")));
        }
    }
    
    /**
     * 获取缓存剩余过期时间
     */
    public long getExpire(String key) {
        try {
            if (redisTemplate != null) {
                return redisTemplate.getExpire(key, java.util.concurrent.TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            // 忽略异常
        }
        return -1;
    }
    
    /**
     * 设置缓存过期时间
     */
    public boolean expire(String key, long expireTime) {
        try {
            if (redisTemplate != null) {
                return redisTemplate.expire(key, expireTime, java.util.concurrent.TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            // 忽略异常
        }
        return false;
    }
    
    /**
     * 缓存预热
     */
    public void warmup(String cacheName, Map<String, Object> data) {
        if (CollectionUtils.isEmpty(data)) {
            return;
        }
        
        try {
            // 使用默认过期时间，避免RedisCacheManager版本兼容性问题
            long expireTime = CacheConstants.DEFAULT_EXPIRE_TIME;
            
            // 批量设置缓存
            Map<String, Object> batchData = new HashMap<>();
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                String fullKey = cacheName + ":" + entry.getKey();
                batchData.put(fullKey, entry.getValue());
                // 添加到布隆过滤器
                addToBloomFilter(fullKey);
            }
            
            // 使用管道批量操作，提高性能
            if (redisTemplate != null) {
                redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
                    // 使用connection直接操作Redis
                    RedisStringCommands stringCommands = connection.stringCommands();
                    for (Map.Entry<String, Object> entry : batchData.entrySet()) {
                        byte[] keyBytes = entry.getKey().getBytes();
                        byte[] valueBytes = SerializationUtils.serialize(entry.getValue());
                        stringCommands.set(keyBytes, valueBytes);
                        // 设置过期时间
                        if (expireTime > 0) {
                            connection.expire(keyBytes, expireTime);
                        }
                    }
                    return null;
                });
            }
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "缓存预热失败: " + e.getMessage());
        }
    }
    
    /**
     * 添加到布隆过滤器
     */
    private void addToBloomFilter(Object key) {
        String filterKey = "bloom:" + key.getClass().getSimpleName();
        // 使用默认的BloomFilter构造函数
        com.heikeji.common.core.cache.BloomFilter filter = bloomFilters.computeIfAbsent(filterKey, 
            k -> new com.heikeji.common.core.cache.BloomFilter());
        // 将key转换为String并使用正确的add方法
        filter.add(filterKey, String.valueOf(key));
    }
    
    /**
     * 检查布隆过滤器
     */
    private boolean mightContain(Object key) {
        String filterKey = "bloom:" + key.getClass().getSimpleName();
        com.heikeji.common.core.cache.BloomFilter filter = bloomFilters.get(filterKey);
        // 将key转换为String并使用正确的mightContain方法
        return filter == null || filter.mightContain(filterKey, String.valueOf(key));
    }
    
    /**
     * 获取随机过期时间偏移量
     * 用于防止缓存雪崩，给过期时间添加一个随机值
     */
    private long getRandomExpireOffset(long baseExpireTime) {
        // 随机增加0-10%的过期时间
        long offset = (long) (baseExpireTime * 0.1 * Math.random());
        return offset;
    }
    
    /**
     * 本地缓存条目
     */
    private static class CacheEntry {
        private final Object value;
        private final long expireTime;
        private final long createTime;
        
        public CacheEntry(Object value, long expireTime) {
            this.value = value;
            this.expireTime = expireTime;
            this.createTime = System.currentTimeMillis();
        }
        
        public Object getValue() {
            return value;
        }
        
        public boolean isExpired() {
            return expireTime > 0 && System.currentTimeMillis() - createTime > expireTime * 1000;
        }
    }
    
    // 移除内部的DistributedLock和BloomFilter实现，使用外部实现
}