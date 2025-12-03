package com.heikeji.mall.common.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 角色权限注解
 * 用于标记需要特定角色才能访问的接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRole {

    /**
     * 需要的角色名称数组
     *
     * @return 角色名称数组
     */
    String[] value() default {};

    /**
     * 是否需要所有角色（true：需要所有角色；false：需要其中一个角色）
     *
     * @return 是否需要所有角色
     */
    boolean requireAll() default false;
}
