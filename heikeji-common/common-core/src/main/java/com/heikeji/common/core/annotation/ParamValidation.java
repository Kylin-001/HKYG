package com.heikeji.common.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 参数校验注解
 * 标记需要参数校验的方法
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ParamValidation {
    
    /**
     * 是否启用校验
     * @return 是否启用
     */
    boolean enabled() default true;
    
    /**
     * 校验失败时的错误消息
     * @return 错误消息
     */
    String message() default "参数校验失败";
    
    /**
     * 校验模式
     * @return 校验模式
     */
    ValidationMode mode() default ValidationMode.DEFAULT;
    
    /**
     * 校验分组
     * @return 校验分组
     */
    String[] groups() default {};
    
    /**
     * 校验模式枚举
     */
    enum ValidationMode {
        /**
         * 默认模式
         */
        DEFAULT,
        /**
         * 严格模式
         */
        STRICT,
        /**
         * 自定义模式
         */
        CUSTOM
    }
}