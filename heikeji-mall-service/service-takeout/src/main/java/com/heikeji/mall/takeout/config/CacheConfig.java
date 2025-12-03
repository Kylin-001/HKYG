package com.heikeji.mall.takeout.config;

import com.heikeji.common.core.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 缓存配置类
 * 提供CacheManager的Spring Bean实例
 */
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager heikejiCacheManager(RedisTemplate<String, Object> redisTemplate, RedisCacheManager redisCacheManager) {
        // 获取单例实例
        CacheManager cacheManager = CacheManager.getInstance();
        
        // 设置依赖项
        cacheManager.setRedisTemplate(redisTemplate);
        cacheManager.setRedisCacheManager(redisCacheManager);
        
        return cacheManager;
    }
}