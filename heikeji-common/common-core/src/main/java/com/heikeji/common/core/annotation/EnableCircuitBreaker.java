package com.heikeji.common.core.annotation;

import java.lang.annotation.*;

/**
 * 自定义熔断降级注解
 * 用于标记需要进行熔断降级的方法
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface EnableCircuitBreaker {

    /**
     * 断路器名称
     */
    String name() default "default";

    /**
     * 失败率阈值（0-100）
     */
    int failureRateThreshold() default 50;

    /**
     * 最大重试次数
     */
    int maxRetryAttempts() default 3;

    /**
     * 重试等待时间（毫秒）
     */
    long retryWaitTime() default 1000;

    /**
     * 是否启用限流
     */
    boolean enableRateLimit() default false;

    /**
     * 限流阈值（每秒请求数）
     */
    int rateLimitThreshold() default 100;

    /**
     * 熔断后多久尝试半开状态（秒）
     */
    int waitDurationInOpenState() default 60;

    /**
     * 降级方法名
     */
    String fallbackMethod() default "";
}