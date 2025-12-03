package com.heikeji.common.core.annotation;

import java.lang.annotation.*;

/**
 * 接口限流注解
 * 用于标记需要限流的接口方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimiter {
    /**
     * 限流时间窗口（秒）
     */
    int timeWindow() default 1;
    
    /**
     * 时间窗口内允许的最大请求数
     */
    int maxCount() default 10;
    
    /**
     * 限流提示信息
     */
    String message() default "请求过于频繁，请稍后再试";
    
    /**
     * 限流类型，ip、user、method
     */
    String limitType() default "ip";
}
