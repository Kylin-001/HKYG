package com.heikeji.common.core.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

/**
 * Resilience4j 熔断降级配置类
 * 配置断路器、限流器、重试机制等
 */
// @Configuration
// @Slf4j
public class Resilience4jConfig {

    /**
     * 配置断路器注册中心
     */
    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        // 配置断路器
        CircuitBreakerConfig circuitBreakerConfig = CircuitBreakerConfig.custom()
                // 失败率阈值，超过此值断路器打开
                .failureRateThreshold(50)
                // 最小请求数，断路器计算失败率的最小请求数
                .minimumNumberOfCalls(10)
                // 滑动窗口大小
                .slidingWindowSize(20)
                // 滑动窗口类型：COUNT_BASED基于请求数量，TIME_BASED基于时间
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                // 半开状态下的允许请求数
                .permittedNumberOfCallsInHalfOpenState(5)
                // 从打开状态到半开状态的等待时间
                .waitDurationInOpenState(Duration.ofSeconds(60))
                // 自动从打开状态转换为半开状态
                .automaticTransitionFromOpenToHalfOpenEnabled(true)
                // 记录异常，哪些异常算作失败
                .recordExceptions(
                        Exception.class,
                        java.util.concurrent.TimeoutException.class
                )
                // 忽略异常，哪些异常不算作失败
                .ignoreExceptions(
                        IllegalArgumentException.class,
                        UnsupportedOperationException.class
                )
                .build();

        // 创建断路器注册中心
        CircuitBreakerRegistry registry = CircuitBreakerRegistry.of(circuitBreakerConfig);

        // 注册全局事件监听器
        // 新版Resilience4j不支持Registry级别的onSuccess和onError事件监听
        registry.getEventPublisher()
                .onEntryAdded(event -> {
                    // 为每个断路器实例注册事件监听器
                    event.getAddedEntry().getEventPublisher()
                            .onStateTransition(stateEvent -> System.out.println("[Resilience4j] 断路器状态转换: 从 " + 
                                    stateEvent.getStateTransition().getFromState() + " 到 " + 
                                    stateEvent.getStateTransition().getToState()));
                });

        return registry;
    }

    /**
     * 创建商品服务的断路器
     */
    @Bean
    public CircuitBreaker productServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        CircuitBreakerConfig productConfig = CircuitBreakerConfig.custom()
                .failureRateThreshold(40)
                .minimumNumberOfCalls(8)
                .slidingWindowSize(16)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .build();

        return registry.circuitBreaker("productService", productConfig);
    }

    /**
     * 创建订单服务的断路器
     */
    @Bean
    public CircuitBreaker orderServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        CircuitBreakerConfig orderConfig = CircuitBreakerConfig.custom()
                .failureRateThreshold(60)
                .minimumNumberOfCalls(12)
                .slidingWindowSize(24)
                .waitDurationInOpenState(Duration.ofSeconds(45))
                .build();

        return registry.circuitBreaker("orderService", orderConfig);
    }

    /**
     * 配置限流器注册中心
     */
    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        RateLimiterConfig rateLimiterConfig = RateLimiterConfig.custom()
                // 每秒允许的请求数
                .limitRefreshPeriod(Duration.ofSeconds(1))
                // 令牌桶容量
                .limitForPeriod(100)
                // 超时等待时间
                .timeoutDuration(Duration.ofMillis(500))
                .build();

        RateLimiterRegistry registry = RateLimiterRegistry.of(rateLimiterConfig);

        // 注册全局事件监听器
        // 新版Resilience4j不支持Registry级别的onSuccess和onFailure事件监听
        registry.getEventPublisher()
                .onEntryAdded(event -> System.out.println("[Resilience4j] 限流器创建: " + event.getAddedEntry().getName()));

        return registry;
    }

    /**
     * 创建API接口限流器
     */
    @Bean
    public RateLimiter apiRateLimiter(RateLimiterRegistry registry) {
        RateLimiterConfig apiConfig = RateLimiterConfig.custom()
                .limitRefreshPeriod(Duration.ofSeconds(1))
                .limitForPeriod(100)
                .timeoutDuration(Duration.ofMillis(300))
                .build();

        return registry.rateLimiter("apiRateLimiter", apiConfig);
    }

    /**
     * 配置重试机制注册中心
     */
    @Bean
    public RetryRegistry retryRegistry() {
        RetryConfig retryConfig = RetryConfig.custom()
                // 最大重试次数
                .maxAttempts(3)
                // 重试等待间隔
                .waitDuration(Duration.ofMillis(500))
                // 指数退避策略
                .retryExceptions(Exception.class)
                .build();

        RetryRegistry registry = RetryRegistry.of(retryConfig);

        return registry;
    }

    /**
     * 创建服务调用重试器
     */
    @Bean
    public Retry serviceCallRetry(RetryRegistry registry) {
        RetryConfig serviceConfig = RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofSeconds(1))
                .retryExceptions(
                        java.net.SocketTimeoutException.class,
                        java.net.ConnectException.class,
                        java.util.concurrent.TimeoutException.class
                )
                .build();

        return registry.retry("serviceCallRetry", serviceConfig);
    }
}