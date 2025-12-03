package com.heikeji.mall.payment.messaging;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 支付消息实体类
 * 用于支付状态变更消息的传递
 */
public class PaymentMessage {
    
    /**
     * 支付ID
     */
    private Long paymentId;
    
    /**
     * 订单号
     */
    private String orderNo;
    
    /**
     * 支付流水号
     */
    private String paymentNo;
    
    /**
     * 支付金额
     */
    private BigDecimal amount;
    
    /**
     * 退款金额
     */
    private BigDecimal refundAmount;
    
    /**
     * 退款单号
     */
    private String refundNo;
    
    /**
     * 支付方式：1-微信支付，2-支付宝，3-余额支付
     */
    private Integer paymentType;
    
    /**
     * 第三方交易号
     */
    private String transactionId;
    
    /**
     * 支付时间
     */
    private Date payTime;
    
    /**
     * 支付状态：0-待支付，1-已支付，2-已退款
     */
    private Integer status;
    
    /**
     * 失败原因
     */
    private String reason;
    
    /**
     * 消息类型
     */
    private MessageType messageType;
    
    /**
     * 消息创建时间
     */
    private Date createTime = new Date();

    // getter和setter方法
    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getPaymentNo() {
        return paymentNo;
    }

    public void setPaymentNo(String paymentNo) {
        this.paymentNo = paymentNo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getRefundNo() {
        return refundNo;
    }

    public void setRefundNo(String refundNo) {
        this.refundNo = refundNo;
    }

    public Integer getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(Integer paymentType) {
        this.paymentType = paymentType;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Date getPayTime() {
        return payTime;
    }

    public void setPayTime(Date payTime) {
        this.payTime = payTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}