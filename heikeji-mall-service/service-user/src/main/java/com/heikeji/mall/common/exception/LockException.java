package com.heikeji.mall.common.exception;

/**
 * 锁定异常类
 * 用于处理资源锁定相关的异常
 */
public class LockException extends RuntimeException {

    /**
     * 错误码
     */
    private int code;

    /**
     * 默认构造方法
     */
    public LockException() {
        super();
    }

    /**
     * 构造方法
     *
     * @param message 错误消息
     */
    public LockException(String message) {
        super(message);
        this.code = 423; // RESOURCE_LOCKED
    }

    /**
     * 构造方法
     *
     * @param code 错误码
     * @param message 错误消息
     */
    public LockException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 构造方法
     *
     * @param message 错误消息
     * @param cause 异常原因
     */
    public LockException(String message, Throwable cause) {
        super(message, cause);
        this.code = 423; // RESOURCE_LOCKED
    }

    /**
     * 构造方法
     *
     * @param code 错误码
     * @param message 错误消息
     * @param cause 异常原因
     */
    public LockException(int code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    /**
     * 获取错误码
     *
     * @return 错误码
     */
    public int getCode() {
        return code;
    }

    /**
     * 设置错误码
     *
     * @param code 错误码
     */
    public void setCode(int code) {
        this.code = code;
    }
}