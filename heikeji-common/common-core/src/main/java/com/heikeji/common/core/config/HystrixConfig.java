package com.heikeji.common.core.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.core.registry.EntryAddedEvent;
import io.github.resilience4j.core.registry.EntryRemovedEvent;
import io.github.resilience4j.core.registry.EntryReplacedEvent;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * 熔断器配置类
 * 基于Resilience4j实现，包含熔断、限流和重试功能
 */
@Configuration
public class HystrixConfig {

    private static final Logger logger = LoggerFactory.getLogger(HystrixConfig.class);

    /**
     * 商品服务熔断配置
     */
    @Bean
    public CircuitBreakerConfig productCircuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50) // 失败率阈值，超过50%则熔断
                .waitDurationInOpenState(Duration.ofSeconds(60)) // 熔断后等待60秒尝试恢复
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED) // 基于数量的滑动窗口
                .slidingWindowSize(100) // 滑动窗口大小为100个请求
                .minimumNumberOfCalls(10) // 最少需要10个请求才开始计算失败率
                .permittedNumberOfCallsInHalfOpenState(5) // 半开状态下允许5个请求
                .recordExceptions(Exception.class) // 记录所有异常
                .build();
    }

    /**
     * 订单服务熔断配置
     */
    @Bean
    public CircuitBreakerConfig orderCircuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(40) // 失败率阈值，超过40%则熔断
                .waitDurationInOpenState(Duration.ofSeconds(90)) // 熔断后等待90秒尝试恢复
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                .slidingWindowSize(100)
                .minimumNumberOfCalls(10)
                .permittedNumberOfCallsInHalfOpenState(5)
                .recordExceptions(Exception.class)
                .build();
    }

    /**
     * 支付服务熔断配置
     */
    @Bean
    public CircuitBreakerConfig paymentCircuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(30) // 失败率阈值，超过30%则熔断
                .waitDurationInOpenState(Duration.ofSeconds(120)) // 熔断后等待120秒尝试恢复
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                .slidingWindowSize(100)
                .minimumNumberOfCalls(10)
                .permittedNumberOfCallsInHalfOpenState(5)
                .recordExceptions(Exception.class)
                .build();
    }

    /**
     * 通用重试配置
     */
    @Bean
    public RetryConfig retryConfig() {
        return RetryConfig.custom()
                .maxAttempts(3) // 最大重试次数3次
                .waitDuration(Duration.ofMillis(500)) // 重试间隔500毫秒
                .retryExceptions(Exception.class)
                .build();
    }

    /**
     * 商品服务限流配置
     */
    @Bean
    public RateLimiterConfig productRateLimiterConfig() {
        return RateLimiterConfig.custom()
                .limitRefreshPeriod(Duration.ofSeconds(1)) // 每秒刷新一次限流
                .limitForPeriod(30) // 每秒允许30个请求
                .timeoutDuration(Duration.ofMillis(100)) // 超时等待时间100毫秒
                .build();
    }

    /**
     * 订单服务限流配置
     */
    @Bean
    public RateLimiterConfig orderRateLimiterConfig() {
        return RateLimiterConfig.custom()
                .limitRefreshPeriod(Duration.ofSeconds(1))
                .limitForPeriod(20) // 每秒允许20个请求
                .timeoutDuration(Duration.ofMillis(100))
                .build();
    }

    /**
     * 支付服务限流配置
     */
    @Bean
    public RateLimiterConfig paymentRateLimiterConfig() {
        return RateLimiterConfig.custom()
                .limitRefreshPeriod(Duration.ofSeconds(1))
                .limitForPeriod(15) // 每秒允许15个请求
                .timeoutDuration(Duration.ofMillis(100))
                .build();
    }

    /**
     * 配置熔断器注册中心
     */
    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry(CircuitBreakerConfig productCircuitBreakerConfig, 
                                                         CircuitBreakerConfig orderCircuitBreakerConfig, 
                                                         CircuitBreakerConfig paymentCircuitBreakerConfig) {
        CircuitBreakerRegistry registry = CircuitBreakerRegistry.ofDefaults();
        
        // 注册商品服务熔断器
        registry.addConfiguration("productService", productCircuitBreakerConfig);
        registry.circuitBreaker("productService");
        
        // 注册订单服务熔断器
        registry.addConfiguration("orderService", orderCircuitBreakerConfig);
        registry.circuitBreaker("orderService");
        
        // 注册支付服务熔断器
        registry.addConfiguration("paymentService", paymentCircuitBreakerConfig);
        registry.circuitBreaker("paymentService");
        
        return registry;
    }

    /**
     * 配置重试注册中心
     */
    @Bean
    public RetryRegistry retryRegistry(RetryConfig retryConfig) {
        RetryRegistry registry = RetryRegistry.ofDefaults();
        registry.addConfiguration("defaultRetryConfig", retryConfig);
        return registry;
    }

    /**
     * 配置限流注册中心
     */
    @Bean
    public RateLimiterRegistry rateLimiterRegistry(RateLimiterConfig productRateLimiterConfig, 
                                                   RateLimiterConfig orderRateLimiterConfig, 
                                                   RateLimiterConfig paymentRateLimiterConfig) {
        RateLimiterRegistry registry = RateLimiterRegistry.ofDefaults();
        
        // 注册商品服务限流
        registry.addConfiguration("productRateLimiter", productRateLimiterConfig);
        registry.rateLimiter("productRateLimiter");
        
        // 注册订单服务限流
        registry.addConfiguration("orderRateLimiter", orderRateLimiterConfig);
        registry.rateLimiter("orderRateLimiter");
        
        // 注册支付服务限流
        registry.addConfiguration("paymentRateLimiter", paymentRateLimiterConfig);
        registry.rateLimiter("paymentRateLimiter");
        
        return registry;
    }

    /**
     * 服务配置信息
     * 保存各服务的默认超时和并发配置，供后续集成熔断器使用
     */
    public static class ServiceConfig {
        // 商品服务配置
        public static final int PRODUCT_TIMEOUT_MS = 3000;
        public static final int PRODUCT_MAX_CONCURRENT = 30;
        
        // 订单服务配置
        public static final int ORDER_TIMEOUT_MS = 6000;
        public static final int ORDER_MAX_CONCURRENT = 20;
        
        // 支付服务配置
        public static final int PAYMENT_TIMEOUT_MS = 4000;
        public static final int PAYMENT_MAX_CONCURRENT = 15;
        public static final int PAYMENT_ERROR_THRESHOLD = 30;
    }
}
