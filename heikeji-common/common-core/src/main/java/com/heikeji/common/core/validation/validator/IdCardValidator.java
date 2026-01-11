package com.heikeji.common.core.validation.validator;

import com.heikeji.common.core.validation.annotation.IdCard;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * 身份证号校验器
 * 实现IdCard注解的具体校验逻辑，包括格式校验和校验码验证
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class IdCardValidator implements ConstraintValidator<IdCard, String> {

    /**
     * 身份证号正则表达式（18位）
     */
    private static final String ID_CARD_REGEX = "^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$";
    private static final Pattern ID_CARD_PATTERN = Pattern.compile(ID_CARD_REGEX);

    /**
     * 身份证号权重系数
     */
    private static final int[] WEIGHT_FACTOR = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};

    /**
     * 校验码映射表
     */
    private static final char[] CHECK_CODES = {'1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'};

    private boolean allowEmpty;

    /**
     * 初始化方法，获取注解的属性值
     */
    @Override
    public void initialize(IdCard constraintAnnotation) {
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

        // 如果值不为空，则进行格式校验和校验码验证
        if (value != null && !value.isEmpty()) {
            // 首先进行格式校验
            if (!ID_CARD_PATTERN.matcher(value).matches()) {
                return false;
            }

            // 然后进行校验码验证
            return validateCheckCode(value);
        }

        // 不允许为空且值为空，则校验失败
        return false;
    }

    /**
     * 验证身份证号的校验码
     * @param idCard 身份证号
     * @return 是否校验通过
     */
    private boolean validateCheckCode(String idCard) {
        // 计算校验码
        int sum = 0;
        for (int i = 0; i < 17; i++) {
            int digit = Character.getNumericValue(idCard.charAt(i));
            sum += digit * WEIGHT_FACTOR[i];
        }

        // 计算校验码索引
        int checkIndex = sum % 11;
        // 获取校验码
        char expectedCheckCode = CHECK_CODES[checkIndex];
        // 获取身份证号最后一位
        char actualCheckCode = Character.toUpperCase(idCard.charAt(17));

        // 比较校验码
        return expectedCheckCode == actualCheckCode;
    }
}