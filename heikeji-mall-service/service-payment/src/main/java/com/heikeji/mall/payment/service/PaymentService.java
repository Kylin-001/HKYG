package com.heikeji.mall.payment.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.payment.entity.Payment;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 支付服务接口
 */
public interface PaymentService extends IService<Payment> {
    
    /**
     * 创建支付订单
     * @param orderId 订单ID
     * @param orderNo 订单号
     * @param amount 支付金额
     * @param paymentType 支付方式
     * @return 支付订单
     */
    Payment createPayment(Long orderId, String orderNo, BigDecimal amount, Integer paymentType);
    
    /**
     * 生成微信支付参数
     * @param paymentId 支付订单ID
     * @return 微信支付参数
     */
    Map<String, Object> generateWechatPayParams(Long paymentId);
    
    /**
     * 处理微信支付回调
     * @param notifyData 回调数据
     * @return 处理结果
     */
    boolean processWechatPayNotify(Map<String, String> notifyData);
    
    /**
     * 处理支付宝支付回调
     * @param notifyData 回调数据
     * @return 处理结果
     */
    boolean processAlipayNotify(Map<String, String> notifyData);
    
    /**
     * 统一处理支付回调
     * @param paymentType 支付方式
     * @param notifyData 回调数据
     * @return 处理结果
     */
    boolean processPaymentCallback(Integer paymentType, Map<String, String> notifyData);
    
    /**
     * 查询支付状态
     * @param orderNo 订单号
     * @return 支付状态
     */
    Integer queryPaymentStatus(String orderNo);
    
    /**
     * 退款
     * @param orderNo 订单号
     * @param refundAmount 退款金额
     * @return 是否成功
     */
    boolean refund(String orderNo, BigDecimal refundAmount);
    
    /**
     * 根据订单号查询支付记录
     * @param orderNo 订单号
     * @return 支付记录
     */
    Payment getByOrderNo(String orderNo);
    
    /**
     * 余额支付
     * @param paymentId 支付ID
     * @return 是否支付成功
     */
    boolean balancePay(Long paymentId);
    
    /**
     * 充值
     * @param amount 充值金额
     * @param paymentType 支付方式
     * @return 支付订单
     */
    Payment recharge(BigDecimal amount, Integer paymentType);
    
    /**
     * 获取支付记录列表
     * @param page 页码
     * @param size 每页大小
     * @return 支付记录列表
     */
    Map<String, Object> getPaymentList(Integer page, Integer size);
}