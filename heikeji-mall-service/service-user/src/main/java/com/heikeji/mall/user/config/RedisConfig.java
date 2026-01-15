package com.heikeji.mall.user.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis配置类
 * 当Redis不可用时，提供一个空的RedisTemplate bean，避免其他组件因无法注入RedisTemplate而导致启动失败
 */
@Configuration
public class RedisConfig {

    /**
     * 当RedisTemplate bean不存在时，提供一个自定义的RedisTemplate，避免依赖RedisConnectionFactory
     * @return 自定义的RedisTemplate实例
     */
    @Bean
    @ConditionalOnMissingBean
    public RedisTemplate<String, Object> redisTemplate() {
        // 创建一个自定义的RedisTemplate实例，重写afterPropertiesSet方法
        return new RedisTemplate<>() {
            @Override
            public void afterPropertiesSet() {
                // 重写afterPropertiesSet方法，不调用getRequiredConnectionFactory()
                // 只初始化序列化器
                if (getKeySerializer() == null) {
                    setKeySerializer(new StringRedisSerializer());
                }
                if (getValueSerializer() == null) {
                    setValueSerializer(new StringRedisSerializer());
                }
                if (getHashKeySerializer() == null) {
                    setHashKeySerializer(new StringRedisSerializer());
                }
                if (getHashValueSerializer() == null) {
                    setHashValueSerializer(new StringRedisSerializer());
                }
                // 不调用父类的afterPropertiesSet()，避免检查RedisConnectionFactory
            }
        };
    }
}
