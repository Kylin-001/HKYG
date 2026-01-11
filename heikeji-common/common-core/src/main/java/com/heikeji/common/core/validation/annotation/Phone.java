package com.heikeji.common.core.validation.annotation;

import com.heikeji.common.core.validation.validator.PhoneValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * 手机号校验注解
 * 用于验证字符串是否为有效的手机号码格式
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface Phone {

    /**
     * 错误消息
     */
    String message() default "手机号格式不正确";

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
        Phone[] value();
    }
}