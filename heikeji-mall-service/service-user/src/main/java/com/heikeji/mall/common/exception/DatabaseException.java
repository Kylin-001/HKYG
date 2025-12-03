package com.heikeji.mall.common.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 数据库异常类
 * 用于处理数据库操作相关的异常
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DatabaseException extends RuntimeException {

    /**
     * 错误代码
     */
    private String errorCode;

    /**
     * 构造方法
     *
     * @param message 错误消息
     */
    public DatabaseException(String message) {
        super(message);
    }

    /**
     * 构造方法
     *
     * @param message 错误消息
     * @param cause   异常原因
     */
    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造方法
     *
     * @param errorCode 错误代码
     * @param message   错误消息
     */
    public DatabaseException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * 构造方法
     *
     * @param errorCode 错误代码
     * @param message   错误消息
     * @param cause     异常原因
     */
    public DatabaseException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * 创建数据库异常实例
     *
     * @param message 错误消息
     * @return 数据库异常实例
     */
    public static DatabaseException of(String message) {
        return new DatabaseException(message);
    }

    /**
     * 创建数据库异常实例
     *
     * @param message 错误消息
     * @param cause   异常原因
     * @return 数据库异常实例
     */
    public static DatabaseException of(String message, Throwable cause) {
        return new DatabaseException(message, cause);
    }

    /**
     * 创建数据库异常实例
     *
     * @param errorCode 错误代码
     * @param message   错误消息
     * @return 数据库异常实例
     */
    public static DatabaseException of(String errorCode, String message) {
        return new DatabaseException(errorCode, message);
    }

    /**
     * 创建数据库异常实例
     *
     * @param errorCode 错误代码
     * @param message   错误消息
     * @param cause     异常原因
     * @return 数据库异常实例
     */
    public static DatabaseException of(String errorCode, String message, Throwable cause) {
        return new DatabaseException(errorCode, message, cause);
    }
}