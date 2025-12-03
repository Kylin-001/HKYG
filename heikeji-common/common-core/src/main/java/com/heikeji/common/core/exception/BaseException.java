package com.heikeji.common.core.exception;

import com.heikeji.common.core.constant.Constants;

/**
 * 基础异常类
 */
public class BaseException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private Object[] args;

    /**
     * 创建一个没有详细信息的BaseException
     */
    public BaseException() {
        this.code = Constants.FAIL;
        this.message = "未知错误";
    }

    /**
     * 使用指定的错误消息构建BaseException
     */
    public BaseException(String message) {
        super(message);
        this.code = Constants.FAIL;
        this.message = message;
    }

    /**
     * 使用指定的错误码和消息构建BaseException
     */
    public BaseException(String message, Integer code) {
        super(message);
        this.code = code;
        this.message = message;
    }

    /**
     * 使用指定的错误消息和原因构建BaseException
     */
    public BaseException(String message, Throwable cause) {
        super(message, cause);
        this.code = Constants.FAIL;
        this.message = message;
    }

    /**
     * 使用指定的错误码、消息和原因构建BaseException
     */
    public BaseException(String message, Integer code, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.message = message;
    }

    /**
     * 使用指定的原因构建BaseException
     */
    public BaseException(Throwable cause) {
        super(cause);
        this.code = Constants.FAIL;
        this.message = cause.getMessage();
    }

    /**
     * 创建一个带格式化消息的BaseException
     */
    public BaseException(String message, Object... args) {
        super(String.format(message, args));
        this.code = Constants.FAIL;
        this.message = String.format(message, args);
        this.args = args;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public Integer getCode() {
        return code;
    }

    public Object[] getArgs() {
        return args;
    }

    /**
     * 链式调用设置错误码
     */
    public BaseException setCode(Integer code) {
        this.code = code;
        return this;
    }

    /**
     * 链式调用设置错误消息
     */
    public BaseException setMessage(String message) {
        this.message = message;
        return this;
    }
}



