package com.heikeji.mall.takeout.config;

import com.heikeji.common.core.cache.CacheManager;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;

import jakarta.annotation.Resource;

/**
 * 缓存配置类
 * 初始化CacheManager单例实例
 */
@Configuration
public class CacheConfig implements InitializingBean {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private RedisCacheManager redisCacheManager;

    @Override
    public void afterPropertiesSet() {
        // 获取单例实例并设置依赖项
        CacheManager cacheManager = CacheManager.getInstance();
        cacheManager.setRedisTemplate(redisTemplate);
        cacheManager.setRedisCacheManager(redisCacheManager);
    }
}