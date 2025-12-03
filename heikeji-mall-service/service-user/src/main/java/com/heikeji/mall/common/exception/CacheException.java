package com.heikeji.mall.common.exception;

/**
 * 缓存异常类
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class CacheException extends BusinessException {

    private static final long serialVersionUID = 1L;

    /**
     * 默认构造函数
     */
    public CacheException() {
        super(500, "缓存操作失败");
    }

    /**
     * 带错误消息的构造函数
     * @param message 错误消息
     */
    public CacheException(String message) {
        super(500, message);
    }

    /**
     * 带错误消息和异常原因的构造函数
     * @param message 错误消息
     * @param cause 异常原因
     */
    public CacheException(String message, Throwable cause) {
        super(500, message, cause);
    }

    /**
     * 带错误代码和错误消息的构造函数
     * @param code 错误代码
     * @param message 错误消息
     */
    public CacheException(int code, String message) {
        super(code, message);
    }

    /**
     * 带错误代码、错误消息和异常原因的构造函数
     * @param code 错误代码
     * @param message 错误消息
     * @param cause 异常原因
     */
    public CacheException(int code, String message, Throwable cause) {
        super(code, message, cause);
    }
}
