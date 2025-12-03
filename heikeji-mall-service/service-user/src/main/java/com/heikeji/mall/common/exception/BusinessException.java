package com.heikeji.mall.common.exception;

import com.heikeji.mall.common.Result;

/**
 * 业务异常类
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * 错误代码
     */
    private int code;

    /**
     * 错误消息
     */
    private String message;

    /**
     * 默认构造函数
     */
    public BusinessException() {
        super();
        this.code = Result.FAIL;
        this.message = "操作失败";
    }

    /**
     * 带错误消息的构造函数
     * @param message 错误消息
     */
    public BusinessException(String message) {
        super(message);
        this.code = Result.FAIL;
        this.message = message;
    }

    /**
     * 带错误消息和异常原因的构造函数
     * @param message 错误消息
     * @param cause 异常原因
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.code = Result.FAIL;
        this.message = message;
    }

    /**
     * 带错误代码和错误消息的构造函数
     * @param code 错误代码
     * @param message 错误消息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    /**
     * 带错误代码、错误消息和异常原因的构造函数
     * @param code 错误代码
     * @param message 错误消息
     * @param cause 异常原因
     */
    public BusinessException(int code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.message = message;
    }

    /**
     * 获取错误代码
     * @return 错误代码
     */
    public int getCode() {
        return code;
    }

    /**
     * 设置错误代码
     * @param code 错误代码
     */
    public void setCode(int code) {
        this.code = code;
    }

    /**
     * 获取错误消息
     * @return 错误消息
     */
    @Override
    public String getMessage() {
        return message;
    }

    /**
     * 设置错误消息
     * @param message 错误消息
     */
    public void setMessage(String message) {
        this.message = message;
    }
}
