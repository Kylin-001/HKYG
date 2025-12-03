package com.heikeji.common.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 登录验证注解
 * 用于标记需要登录才能访问的接口
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresLogin {
    /**
     * 是否必须验证登录状态
     * @return 默认true
     */
    boolean required() default true;
    
    /**
     * 未登录时的提示消息
     * @return 提示消息
     */
    String message() default "用户未登录";
}