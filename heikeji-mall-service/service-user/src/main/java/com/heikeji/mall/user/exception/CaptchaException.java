package com.heikeji.mall.user.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 验证码异常类
 * 用于处理验证码相关的业务异常
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CaptchaException extends RuntimeException {

    private Integer errorCode;

    /**
     * 构造方法
     *
     * @param message 异常消息
     */
    public CaptchaException(String message) {
        super(message);
        this.errorCode = 40001; // 默认验证码错误码
    }

    /**
     * 构造方法
     *
     * @param message 异常消息
     * @param errorCode 错误码
     */
    public CaptchaException(String message, Integer errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * 构造方法
     *
     * @param message 异常消息
     * @param cause 异常原因
     */
    public CaptchaException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = 40001;
    }

    /**
     * 构造方法
     *
     * @param message 异常消息
     * @param errorCode 错误码
     * @param cause 异常原因
     */
    public CaptchaException(String message, Integer errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * 验证码过期异常
     *
     * @return CaptchaException
     */
    public static CaptchaException expired() {
        return new CaptchaException("验证码已过期", 40002);
    }

    /**
     * 验证码错误异常
     *
     * @return CaptchaException
     */
    public static CaptchaException invalid() {
        return new CaptchaException("验证码错误", 40001);
    }

    /**
     * 验证码为空异常
     *
     * @return CaptchaException
     */
    public static CaptchaException empty() {
        return new CaptchaException("验证码不能为空", 40003);
    }

    /**
     * 验证码生成失败异常
     *
     * @return CaptchaException
     */
    public static CaptchaException generateFailed() {
        return new CaptchaException("验证码生成失败", 40004);
    }
}
