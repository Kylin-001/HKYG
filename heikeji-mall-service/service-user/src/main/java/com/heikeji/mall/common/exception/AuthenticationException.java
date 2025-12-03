package com.heikeji.mall.common.exception;

/**
 * 认证异常类
 * 用于处理用户认证相关的异常情况
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class AuthenticationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * 错误代码
     */
    private String errorCode;

    /**
     * 构造方法
     */
    public AuthenticationException() {
        super();
    }

    /**
     * 构造方法
     *
     * @param message 错误信息
     */
    public AuthenticationException(String message) {
        super(message);
    }

    /**
     * 构造方法
     *
     * @param message 错误信息
     * @param errorCode 错误代码
     */
    public AuthenticationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * 构造方法
     *
     * @param message 错误信息
     * @param cause 异常原因
     */
    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造方法
     *
     * @param message 错误信息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public AuthenticationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * 获取错误代码
     *
     * @return 错误代码
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * 设置错误代码
     *
     * @param errorCode 错误代码
     */
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}
