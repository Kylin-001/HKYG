package com.heikeji.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

/**
 * 请求限流配置类
 * 提供基于用户、IP等多种限流策略
 */
@Configuration
public class RequestRateLimiterConfig {

    /**
     * 基于用户的限流策略
     * 从请求头或查询参数中获取用户标识
     */
    @Bean("userKeyResolver")
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // 从请求头获取用户标识
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            if (userId != null) {
                return Mono.just(userId);
            }
            // 尝试从查询参数获取用户标识
            String userParam = exchange.getRequest().getQueryParams().getFirst("userId");
            if (userParam != null) {
                return Mono.just(userParam);
            }
            // 默认使用匿名用户标识
            return Mono.just("anonymous_user");
        };
    }

    /**
     * 基于IP的限流策略
     * 使用请求的远程地址作为限流键
     */
    @Bean("ipKeyResolver")
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getRemoteAddress() != null ? 
                exchange.getRequest().getRemoteAddress().getHostName() : "unknown_ip"
        );
    }

    /**
     * 基于路径的限流策略
     * 使用请求路径作为限流键
     */
    @Bean("pathKeyResolver")
    public KeyResolver pathKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getPath().value()
        );
    }
}