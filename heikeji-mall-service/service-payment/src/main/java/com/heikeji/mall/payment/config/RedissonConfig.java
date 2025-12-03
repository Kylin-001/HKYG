package com.heikeji.mall.payment.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Redisson配置类
 * 提供分布式锁、分布式集合等高级Redis功能
 */
@Configuration
public class RedissonConfig {

    @Value("${spring.redis.host:localhost}")
    private String host;

    @Value("${spring.redis.port:6379}")
    private int port;

    @Value("${spring.redis.password:}")
    private String password;

    @Value("${spring.redis.database:0}")
    private int database;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        
        // 单节点模式配置
        StringBuilder redisUrl = new StringBuilder("redis://");
        redisUrl.append(host).append(":").append(port);
        
        config.useSingleServer()
                .setAddress(redisUrl.toString())
                .setDatabase(database)
                .setConnectionMinimumIdleSize(5) // 最小空闲连接数
                .setConnectionPoolSize(64) // 连接池最大容量
                .setIdleConnectionTimeout(60000) // 空闲连接超时时间，单位：毫秒
                .setConnectTimeout(10000) // 连接超时时间，单位：毫秒
                .setTimeout(3000) // 命令等待超时时间，单位：毫秒
                .setRetryAttempts(3) // 命令重试次数
                .setRetryInterval(1500); // 命令重试间隔，单位：毫秒
                
        // 如果有密码，设置密码
        if (password != null && !password.isEmpty()) {
            config.useSingleServer().setPassword(password);
        }

        // 创建Redisson实例
        return Redisson.create(config);
    }

}