package com.heikeji.mall.user.config;

import com.heikeji.common.core.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 缓存配置类
 * 提供CacheManager的Spring Bean实例
 */
@Configuration
public class CacheConfig {

    private static final Logger logger = LoggerFactory.getLogger(CacheConfig.class);

    @Bean(name = "cacheManager")
    public CacheManager cacheManager(RedisTemplate<String, Object> redisTemplate, RedisCacheManager redisCacheManager) {
        logger.info("Creating CacheManager bean...");
        
        // 获取CacheManager的单例实例
        CacheManager cacheManager = CacheManager.getInstance();
        logger.info("Got CacheManager instance: {}", cacheManager);
        
        // 使用setter方法设置依赖
        cacheManager.setRedisTemplate(redisTemplate);
        cacheManager.setRedisCacheManager(redisCacheManager);
        
        logger.info("Set redisTemplate: {}", redisTemplate);
        logger.info("Set redisCacheManager: {}", redisCacheManager);
        logger.info("CacheManager bean created successfully");
        
        return cacheManager;
    }
}