package com.heikeji.common.core.annotation;

import java.lang.annotation.*;

/**
 * 权限校验注解
 * 用于标记需要权限校验的接口方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequiresPermission {
    /**
     * 权限编码
     * 格式：模块:操作:对象，例如：user:add:admin
     */
    String[] value() default {};
    
    /**
     * 权限类型
     * - single: 需要满足其中任何一个权限
     * - all: 需要满足所有权限
     */
    String type() default "single";
    
    /**
     * 验证失败提示信息
     */
    String message() default "无权限访问此资源";
}
