package com.heikeji.mall.payment.exception;

/**
 * 支付模块自定义异常类
 * 用于处理支付过程中的各种异常情况
 */
public class PaymentException extends RuntimeException {
    
    /**
     * 错误码
     */
    private String errorCode;
    
    /**
     * 构造方法
     * @param message 错误信息
     */
    public PaymentException(String message) {
        super(message);
    }
    
    /**
     * 构造方法
     * @param message 错误信息
     * @param cause 原始异常
     */
    public PaymentException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * 构造方法
     * @param errorCode 错误码
     * @param message 错误信息
     */
    public PaymentException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    /**
     * 构造方法
     * @param errorCode 错误码
     * @param message 错误信息
     * @param cause 原始异常
     */
    public PaymentException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    /**
     * 获取错误码
     * @return 错误码
     */
    public String getErrorCode() {
        return errorCode;
    }
    
    /**
     * 设置错误码
     * @param errorCode 错误码
     */
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}