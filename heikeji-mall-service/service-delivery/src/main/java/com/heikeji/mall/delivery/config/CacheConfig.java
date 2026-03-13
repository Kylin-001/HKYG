package com.heikeji.mall.delivery.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
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

@Configuration
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {
    
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
    
    @Bean
    @ConditionalOnClass(RedisConnectionFactory.class)
    @ConditionalOnProperty(name = "spring.redis.enabled", havingValue = "true", matchIfMissing = false)
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
    
    public static final String CACHE_NAME_DELIVERY = "deliveryCache";
    public static final String CACHE_NAME_DELIVERYMAN = "deliverymanCache";
    public static final String CACHE_NAME_ROUTE = "routeCache";
    
    public static final int CACHE_EXPIRE_TIME_DELIVERY = 300;
    public static final int CACHE_EXPIRE_TIME_DELIVERYMAN = 3600;
    public static final int CACHE_EXPIRE_TIME_ROUTE = 60;
    public static final int CACHE_EXPIRE_TIME_STATISTICS = 300;
    
    public static final String CACHE_KEY_DELIVERY = "delivery::";
    public static final String CACHE_KEY_DELIVERYMAN = "deliveryman::";
    public static final String CACHE_KEY_ROUTE = "route::";
    public static final String CACHE_KEY_ORDER = "order::";
    public static final String CACHE_KEY_STATISTICS = "statistics::";
    public static final String CACHE_KEY_AVAILABLE = "available::";
}
