package com.heikeji.mall.user.exception;

/**
 * 密码强度异常类
 * 当密码不符合强度要求时抛出此异常
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class PasswordStrengthException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * 密码长度不足
     */
    public static final String ERROR_PASSWORD_LENGTH = "密码长度不足";

    /**
     * 缺少大写字母
     */
    public static final String ERROR_MISSING_UPPERCASE = "缺少大写字母";

    /**
     * 缺少小写字母
     */
    public static final String ERROR_MISSING_LOWERCASE = "缺少小写字母";

    /**
     * 缺少数字
     */
    public static final String ERROR_MISSING_NUMBER = "缺少数字";

    /**
     * 缺少特殊字符
     */
    public static final String ERROR_MISSING_SPECIAL = "缺少特殊字符";

    /**
     * 默认构造方法
     */
    public PasswordStrengthException() {
        super();
    }

    /**
     * 带消息的构造方法
     *
     * @param message 异常消息
     */
    public PasswordStrengthException(String message) {
        super(message);
    }

    /**
     * 带消息和原因的构造方法
     *
     * @param message 异常消息
     * @param cause 异常原因
     */
    public PasswordStrengthException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 带原因的构造方法
     *
     * @param cause 异常原因
     */
    public PasswordStrengthException(Throwable cause) {
        super(cause);
    }

    /**
     * 带消息、原因、是否可抑制和是否可写堆栈跟踪的构造方法
     *
     * @param message 异常消息
     * @param cause 异常原因
     * @param enableSuppression 是否可抑制
     * @param writableStackTrace 是否可写堆栈跟踪
     */
    protected PasswordStrengthException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
