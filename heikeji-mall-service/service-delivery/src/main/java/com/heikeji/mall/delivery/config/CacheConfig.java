package com.heikeji.mall.delivery.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.lang.reflect.Method;

/**
 * 配送服务缓存配置类，统一管理缓存策略
 */
@Configuration
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {
    
    /**
     * 自定义缓存键生成器，生成统一格式的缓存键
     * 格式：methodName::param1::param2::...::paramN
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                StringBuilder sb = new StringBuilder();
                sb.append(method.getName());
                sb.append("::");
                for (Object param : params) {
                    if (param != null) {
                        sb.append(param.toString());
                        sb.append("::");
                    }
                }
                return sb.toString();
            }
        };
    }
    
    /**
     * RedisTemplate配置
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
    
    /**
     * 缓存名称常量定义
     */
    public static final String CACHE_NAME_DELIVERY = "deliveryCache";
    public static final String CACHE_NAME_DELIVERYMAN = "deliverymanCache";
    public static final String CACHE_NAME_ROUTE = "routeCache";
    
    /**
     * 缓存过期时间常量定义
     */
    public static final int CACHE_EXPIRE_TIME_DELIVERY = 300; // 配送信息缓存5分钟
    public static final int CACHE_EXPIRE_TIME_DELIVERYMAN = 3600; // 配送员信息缓存1小时
    public static final int CACHE_EXPIRE_TIME_ROUTE = 60; // 路线规划缓存1分钟
    public static final int CACHE_EXPIRE_TIME_STATISTICS = 300; // 统计数据缓存5分钟
    
    /**
     * 缓存键前缀常量定义
     */
    public static final String CACHE_KEY_DELIVERY = "delivery::";
    public static final String CACHE_KEY_DELIVERYMAN = "deliveryman::";
    public static final String CACHE_KEY_ROUTE = "route::";
    public static final String CACHE_KEY_ORDER = "order::";
    public static final String CACHE_KEY_STATISTICS = "statistics::";
    public static final String CACHE_KEY_AVAILABLE = "available::";
}