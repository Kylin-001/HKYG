package com.heikeji.mall.common.exception;

/**
 * 文件处理异常类
 * 用于处理文件上传、下载、解析等操作中的异常
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class FileProcessingException extends RuntimeException {

    /**
     * 错误码
     */
    private String errorCode;

    /**
     * 构造函数
     */
    public FileProcessingException() {
        super();
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     */
    public FileProcessingException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param errorCode 错误码
     */
    public FileProcessingException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 异常原因
     */
    public FileProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param errorCode 错误码
     * @param cause 异常原因
     */
    public FileProcessingException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * 构造函数
     *
     * @param cause 异常原因
     */
    public FileProcessingException(Throwable cause) {
        super(cause);
    }

    /**
     * 获取错误码
     *
     * @return 错误码
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * 设置错误码
     *
     * @param errorCode 错误码
     */
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}
