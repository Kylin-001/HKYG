package com.heikeji.mall.common.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 商家权限校验注解
 * 用于标注需要商家身份才能访问的方法或类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresMerchant {

    /**
     * 是否忽略商家权限校验，默认为false
     */
    boolean ignore() default false;

    /**
     * 商家权限校验失败时的错误信息
     */
    String message() default "您需要商家身份才能访问该资源";

    /**
     * 是否需要已认证的商家，默认为true
     */
    boolean requireAuthenticated() default true;

    /**
     * 是否需要已审核通过的商家，默认为true
     */
    boolean requireApproved() default true;
}
