package com.heikeji.common.core.validation.annotation;

import com.heikeji.common.core.validation.validator.StudentNoValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * 学号校验注解
 * 用于验证字符串是否为有效的学号格式
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Documented
@Constraint(validatedBy = StudentNoValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface StudentNo {

    /**
     * 错误消息
     */
    String message() default "学号格式不正确";

    /**
     * 是否允许空值
     */
    boolean allowEmpty() default false;

    /**
     * 校验分组
     */
    Class<?>[] groups() default {};

    /**
     * 负载信息
     */
    Class<? extends Payload>[] payload() default {};

    /**
     * 为了支持在同一个元素上使用多个相同类型的注解
     */
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @interface List {
        StudentNo[] value();
    }
}