package com.heikeji.mall.order.config;

import com.heikeji.common.core.cache.CacheManager;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 缓存配置类
 * 提供CacheManager的Spring Bean实例
 */
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager(RedisTemplate<String, Object> redisTemplate) throws Exception {
        // 获取CacheManager的单例实例
        CacheManager cacheManager = CacheManager.getInstance();
        
        // 使用反射设置redisTemplate，因为CacheManager没有提供公共的setter方法
        java.lang.reflect.Field redisTemplateField = CacheManager.class.getDeclaredField("redisTemplate");
        redisTemplateField.setAccessible(true);
        redisTemplateField.set(cacheManager, redisTemplate);
        
        // 调用afterPropertiesSet方法完成初始化
        if (cacheManager instanceof InitializingBean) {
            ((InitializingBean) cacheManager).afterPropertiesSet();
        }
        
        return cacheManager;
    }
}