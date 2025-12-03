package com.heikeji.mall.payment.messaging;

/**
 * 消息类型枚举
 * 定义支付相关消息的类型
 */
public enum MessageType {
    
    /**
     * 支付成功消息
     */
    PAYMENT_SUCCESS,
    
    /**
     * 支付失败消息
     */
    PAYMENT_FAILED,
    
    /**
     * 退款成功消息
     */
    REFUND_SUCCESS,
    
    /**
     * 退款失败消息
     */
    REFUND_FAILED,
    
    /**
     * 支付超时消息
     */
    PAYMENT_TIMEOUT
}