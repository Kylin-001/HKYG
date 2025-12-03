package com.heikeji.mall.common.enums;

import lombok.Getter;

/**
 * 登录状态枚举
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Getter
public enum LoginStatus {

    /**
     * 登录成功
     */
    SUCCESS(1, "登录成功"),

    /**
     * 登录失败
     */
    FAIL(2, "登录失败"),

    /**
     * 账号不存在
     */
    USER_NOT_EXIST(3, "账号不存在"),

    /**
     * 密码错误
     */
    PASSWORD_ERROR(4, "密码错误"),

    /**
     * 账号已禁用
     */
    ACCOUNT_DISABLED(5, "账号已禁用"),

    /**
     * 账号已锁定
     */
    ACCOUNT_LOCKED(6, "账号已锁定"),

    /**
     * 验证码错误
     */
    CAPTCHA_ERROR(7, "验证码错误"),

    /**
     * 验证码过期
     */
    CAPTCHA_EXPIRED(8, "验证码过期"),

    /**
     * 登录次数超限
     */
    LOGIN_LIMIT_EXCEEDED(9, "登录次数超限"),

    /**
     * 登录超时
     */
    LOGIN_TIMEOUT(10, "登录超时");

    private final Integer code;
    private final String message;

    LoginStatus(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    /**
     * 根据code获取枚举
     */
    public static LoginStatus getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (LoginStatus status : LoginStatus.values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
