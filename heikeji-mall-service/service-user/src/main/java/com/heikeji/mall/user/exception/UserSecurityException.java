package com.heikeji.mall.user.exception;

import com.heikeji.mall.common.exception.BusinessException;

/**
 * 用户安全异常类
 * 处理与用户安全相关的业务异常
 */
public class UserSecurityException extends BusinessException {

    /**
     * 构造方法
     *
     * @param message 错误信息
     */
    public UserSecurityException(String message) {
        super(message);
    }

    /**
     * 构造方法
     *
     * @param message 错误信息
     * @param cause   异常原因
     */
    public UserSecurityException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造方法
     *
     * @param cause 异常原因
     */
    public UserSecurityException(Throwable cause) {
        super("用户安全异常", cause);
    }
}