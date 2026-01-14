package com.heikeji.common.core.validation.validator;

import com.heikeji.common.core.validation.annotation.Phone;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * 手机号校验器
 * 实现Phone注解的具体校验逻辑
 * 支持中国大陆手机号格式验证
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class PhoneValidator implements ConstraintValidator<Phone, String> {

    /**
     * 中国手机号正则表达式
     * 支持最新的手机号段（13x-19x）
     * 格式：1开头，第二位为3-9，后9位为数字
     */
    private static final String PHONE_REGEX = "^1[3-9]\\d{9}$";
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);

    private boolean allowEmpty;

    /**
     * 初始化方法，获取注解的属性值
     * @param constraintAnnotation Phone注解实例
     */
    @Override
    public void initialize(Phone constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }

    /**
     * 校验方法
     * @param value 被校验的值（手机号字符串）
     * @param context 校验上下文
     * @return 是否校验通过
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // 使用isBlank()同时处理null、空字符串和空白字符
        if (allowEmpty && (value == null || value.isBlank())) {
            return true;
        }

        // 如果值不为空，则进行格式校验
        if (value != null && !value.isBlank()) {
            return PHONE_PATTERN.matcher(value).matches();
        }

        // 不允许为空且值为空，则校验失败
        return false;
    }
}