package com.heikeji.common.core.validation;

import com.heikeji.common.core.exception.BusinessException;
import com.heikeji.common.core.constant.ErrorCode;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 参数校验工具类
 * 提供通用的参数校验方法
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class ValidationUtils {

    private static final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    /**
     * 校验对象的所有属性
     * 如果校验失败，抛出业务异常
     *
     * @param obj 要校验的对象
     * @param <T> 对象类型
     */
    public static <T> void validate(T obj) {
        Set<ConstraintViolation<T>> violations = validator.validate(obj);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new BusinessException(ErrorCode.PARAM_ERROR, errorMessage);
        }
    }

    /**
     * 校验对象的指定属性
     * 如果校验失败，抛出业务异常
     *
     * @param obj 要校验的对象
     * @param propertyNames 要校验的属性名
     * @param <T> 对象类型
     */
    @SafeVarargs
    public static <T> void validateProperty(T obj, String... propertyNames) {
        for (String propertyName : propertyNames) {
            Set<ConstraintViolation<T>> violations = validator.validateProperty(obj, propertyName);
            if (!violations.isEmpty()) {
                String errorMessage = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.joining(", "));
                throw new BusinessException(ErrorCode.PARAM_ERROR, errorMessage);
            }
        }
    }

    /**
     * 校验对象的指定属性组
     * 如果校验失败，抛出业务异常
     *
     * @param obj 要校验的对象
     * @param groups 校验分组
     * @param <T> 对象类型
     */
    public static <T> void validateWithGroups(T obj, Class<?>... groups) {
        Set<ConstraintViolation<T>> violations = validator.validate(obj, groups);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new BusinessException(ErrorCode.PARAM_ERROR, errorMessage);
        }
    }

    /**
     * 校验对象的指定属性和分组
     * 如果校验失败，抛出业务异常
     *
     * @param obj 要校验的对象
     * @param propertyName 要校验的属性名
     * @param groups 校验分组
     * @param <T> 对象类型
     */
    public static <T> void validatePropertyWithGroups(T obj, String propertyName, Class<?>... groups) {
        Set<ConstraintViolation<T>> violations = validator.validateProperty(obj, propertyName, groups);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new BusinessException(ErrorCode.PARAM_ERROR, errorMessage);
        }
    }

    /**
     * 检查字符串是否为空
     * 如果为空，抛出业务异常
     *
     * @param str 字符串
     * @param fieldName 字段名
     */
    public static void checkNotNull(String str, String fieldName) {
        if (str == null || str.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "不能为空");
        }
    }

    /**
     * 检查对象是否为空
     * 如果为空，抛出业务异常
     *
     * @param obj 对象
     * @param fieldName 字段名
     */
    public static void checkNotNull(Object obj, String fieldName) {
        if (obj == null) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "不能为空");
        }
    }

    /**
     * 检查数值是否大于等于最小值
     * 如果小于最小值，抛出业务异常
     *
     * @param value 数值
     * @param min 最小值
     * @param fieldName 字段名
     */
    public static void checkMin(int value, int min, String fieldName) {
        if (value < min) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "不能小于" + min);
        }
    }

    /**
     * 检查数值是否小于等于最大值
     * 如果大于最大值，抛出业务异常
     *
     * @param value 数值
     * @param max 最大值
     * @param fieldName 字段名
     */
    public static void checkMax(int value, int max, String fieldName) {
        if (value > max) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "不能大于" + max);
        }
    }

    /**
     * 检查数值是否在指定范围内
     * 如果不在范围内，抛出业务异常
     *
     * @param value 数值
     * @param min 最小值
     * @param max 最大值
     * @param fieldName 字段名
     */
    public static void checkRange(int value, int min, int max, String fieldName) {
        if (value < min || value > max) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "必须在" + min + "到" + max + "之间");
        }
    }

    /**
     * 检查字符串长度是否在指定范围内
     * 如果不在范围内，抛出业务异常
     *
     * @param str 字符串
     * @param min 最小长度
     * @param max 最大长度
     * @param fieldName 字段名
     */
    public static void checkLength(String str, int min, int max, String fieldName) {
        if (str == null || str.length() < min || str.length() > max) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, fieldName + "长度必须在" + min + "到" + max + "之间");
        }
    }
}