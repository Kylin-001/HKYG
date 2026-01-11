package com.heikeji.common.core.validation.validator;

import com.heikeji.common.core.validation.annotation.StudentNo;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * 学号校验器
 * 实现StudentNo注解的具体校验逻辑
 * 支持常见的学号格式，如：
 * - 纯数字格式（如：2021001001）
 * - 包含字母前缀的格式（如：USTH2021001）
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class StudentNoValidator implements ConstraintValidator<StudentNo, String> {

    /**
     * 学号正则表达式
     * 支持：
     * 1. 纯数字格式（6-20位数字）
     * 2. 字母+数字格式（字母开头，字母数字组合，总长度6-20位）
     */
    private static final String STUDENT_NO_REGEX = "^(([A-Za-z]{1,5}[0-9]{5,15})|([0-9]{6,20}))$";
    private static final Pattern STUDENT_NO_PATTERN = Pattern.compile(STUDENT_NO_REGEX);

    private boolean allowEmpty;

    /**
     * 初始化方法，获取注解的属性值
     */
    @Override
    public void initialize(StudentNo constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }

    /**
     * 校验方法
     * @param value 被校验的值
     * @param context 校验上下文
     * @return 是否校验通过
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // 如果允许为空，且值为空，则校验通过
        if (allowEmpty && (value == null || value.isEmpty())) {
            return true;
        }

        // 如果值不为空，则进行格式校验
        if (value != null && !value.isEmpty()) {
            return STUDENT_NO_PATTERN.matcher(value).matches();
        }

        // 不允许为空且值为空，则校验失败
        return false;
    }
}