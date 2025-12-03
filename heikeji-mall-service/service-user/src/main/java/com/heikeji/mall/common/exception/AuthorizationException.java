package com.heikeji.mall.common.exception;

import com.heikeji.mall.common.Result;

/**
 * 授权异常类
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class AuthorizationException extends BusinessException {

    private static final long serialVersionUID = 1L;

    /**
     * 默认构造函数
     */
    public AuthorizationException() {
        super(Result.FORBIDDEN, "未授权访问");
    }

    /**
     * 带错误消息的构造函数
     * @param message 错误消息
     */
    public AuthorizationException(String message) {
        super(Result.FORBIDDEN, message);
    }

    /**
     * 带错误消息和异常原因的构造函数
     * @param message 错误消息
     * @param cause 异常原因
     */
    public AuthorizationException(String message, Throwable cause) {
        super(Result.FORBIDDEN, message, cause);
    }

    /**
     * 带错误代码和错误消息的构造函数
     * @param code 错误代码
     * @param message 错误消息
     */
    public AuthorizationException(int code, String message) {
        super(code, message);
    }

    /**
     * 带错误代码、错误消息和异常原因的构造函数
     * @param code 错误代码
     * @param message 错误消息
     * @param cause 异常原因
     */
    public AuthorizationException(int code, String message, Throwable cause) {
        super(code, message, cause);
    }
}
