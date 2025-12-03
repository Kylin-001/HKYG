package com.heikeji.common.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 管理员权限验证注解
 * 用于标记需要管理员权限才能访问的接口
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresAdmin {
    /**
     * 是否必须验证管理员权限
     * @return 默认true
     */
    boolean required() default true;
    
    /**
     * 无权限时的提示消息
     * @return 提示消息
     */
    String message() default "您没有管理员权限";
}