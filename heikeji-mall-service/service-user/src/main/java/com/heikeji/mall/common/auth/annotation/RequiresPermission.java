package com.heikeji.mall.common.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限校验注解
 * 用于标注需要特定权限才能访问的方法或类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresPermission {

    /**
     * 需要的权限标识
     */
    String[] value() default {};

    /**
     * 逻辑关系：and - 所有权限都需要，or - 至少需要一个权限
     */
    String logical() default "and";

    /**
     * 是否忽略权限校验，默认为false
     */
    boolean ignore() default false;

    /**
     * 权限校验失败时的错误信息
     */
    String message() default "您没有权限访问该资源";
}
