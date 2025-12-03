package com.heikeji.common.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * SQL注入检查注解
 * 用于标记需要SQL注入检查的方法参数
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SqlInjectionCheck {
    
    /**
     * 检查类型
     */
    CheckType type() default CheckType.BASIC;
    
    /**
     * 自定义检查模式
     */
    String pattern() default "";
    
    /**
     * 检查类型枚举
     */
    enum CheckType {
        /**
         * 基础检查
         */
        BASIC,
        /**
         * 严格检查
         */
        STRICT,
        /**
         * 白名单检查
         */
        WHITELIST
    }
}