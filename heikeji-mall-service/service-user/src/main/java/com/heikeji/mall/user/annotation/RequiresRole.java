package com.heikeji.mall.user.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 角色权限注解
 * 用于标记需要特定角色才能访问的方法或类
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRole {
    /**
     * 角色名称
     *
     * @return 角色名称
     */
    String value();

    /**
     * 是否需要所有角色
     * 默认：false（只需要其中一个角色）
     *
     * @return 是否需要所有角色
     */
    boolean requireAll() default false;
}