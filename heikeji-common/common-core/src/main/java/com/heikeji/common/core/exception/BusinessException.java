package com.heikeji.common.core.exception;

import com.heikeji.common.core.constant.ErrorCode;

/**
 * 业务异常类
 * 用于在业务逻辑中抛出特定的业务错误
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class BusinessException extends RuntimeException {

    private final Integer code;
    private final String message;
    
    /**
     * 获取错误码
     */
    public Integer getCode() {
        return code;
    }
    
    /**
     * 获取错误消息
     */
    @Override
    public String getMessage() {
        return message;
    }

    /**
     * 构造函数
     * @param message 错误消息
     */
    public BusinessException(String message) {
        super(message);
        this.code = 500;
        this.message = message;
    }

    /**
     * 构造函数
     * @param code 错误码
     * @param message 错误消息
     */
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    /**
     * 根据错误码枚举构造异常
     * @param errorCode 错误码枚举
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    /**
     * 根据错误码枚举构造异常（可自定义消息）
     * @param errorCode 错误码枚举
     * @param customMessage 自定义错误消息
     */
    public BusinessException(ErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.code = errorCode.getCode();
        this.message = customMessage;
    }

    /**
     * 构造函数
     * @param message 错误消息
     * @param cause 异常原因
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.code = 500;
        this.message = message;
    }

    /**
     * 构造函数
     * @param code 错误码
     * @param message 错误消息
     * @param cause 异常原因
     */
    public BusinessException(Integer code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.message = message;
    }

    /**
     * 根据错误码枚举构造异常
     * @param errorCode 错误码枚举
     * @param cause 异常原因
     */
    public BusinessException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    /**
     * 静态方法：创建参数错误异常
     * @param message 错误消息
     * @return 业务异常
     */
    public static BusinessException paramError(String message) {
        return new BusinessException(ErrorCode.PARAM_ERROR, message);
    }

    /**
     * 静态方法：创建未授权异常
     * @return 业务异常
     */
    public static BusinessException unauthorized() {
        return new BusinessException(ErrorCode.UNAUTHORIZED);
    }

    /**
     * 静态方法：创建权限不足异常
     * @return 业务异常
     */
    public static BusinessException forbidden() {
        return new BusinessException(ErrorCode.PERMISSION_DENIED);
    }

    /**
     * 静态方法：创建资源不存在异常
     * @return 业务异常
     */
    public static BusinessException notFound() {
        return new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
    }

    /**
     * 静态方法：创建用户不存在异常
     * @return 业务异常
     */
    public static BusinessException userNotFound() {
        return new BusinessException(ErrorCode.USER_NOT_FOUND);
    }

    /**
     * 静态方法：创建操作失败异常
     * @param message 错误消息
     * @return 业务异常
     */
    public static BusinessException operationFailed(String message) {
        return new BusinessException(ErrorCode.OPERATION_FAILED, message);
    }
}