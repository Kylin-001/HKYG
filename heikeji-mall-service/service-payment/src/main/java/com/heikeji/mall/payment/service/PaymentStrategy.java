package com.heikeji.mall.payment.service;

import com.heikeji.mall.payment.entity.Payment;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 支付策略接口
 * 定义统一的支付操作方法，用于实现不同支付渠道的策略模式
 */
public interface PaymentStrategy {
    
    /**
     * 初始化支付
     * @param payment 支付订单
     * @return 支付参数，用于前端发起支付
     */
    Map<String, Object> initPayment(Payment payment);
    
    /**
     * 处理支付回调
     * @param notifyData 回调数据
     * @return 处理结果
     */
    boolean processCallback(Map<String, String> notifyData);
    
    /**
     * 查询支付状态
     * @param paymentId 支付ID
     * @return 支付状态
     */
    Integer queryPaymentStatus(Long paymentId);
    
    /**
     * 申请退款
     * @param paymentId 支付ID
     * @param refundAmount 退款金额
     * @return 退款结果
     */
    boolean refund(Long paymentId, BigDecimal refundAmount);
    
    /**
     * 获取支付方式编码
     * @return 支付方式编码
     */
    Integer getPaymentType();
    
    /**
     * 验证支付参数
     * @param params 支付参数
     * @return 是否验证通过
     */
    boolean validateParams(Map<String, Object> params);
}