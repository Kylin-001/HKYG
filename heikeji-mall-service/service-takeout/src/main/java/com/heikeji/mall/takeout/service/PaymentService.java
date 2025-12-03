package com.heikeji.mall.takeout.service;

import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.exception.TakeoutException;

import java.util.Map;

/**
 * 支付服务接口
 * 定义支付相关操作，支持对接不同的支付平台
 */
public interface PaymentService {

    /**
     * 创建支付订单
     * @param order 外卖订单
     * @param paymentMethod 支付方式 (1:微信支付, 2:支付宝, 3:银行卡)
     * @return 支付参数，包含调用支付平台所需的信息
     * @throws TakeoutException 支付创建失败时抛出异常
     */
    Map<String, Object> createPayment(TakeoutOrder order, Integer paymentMethod) throws TakeoutException;

    /**
     * 处理支付回调
     * @param callbackParams 支付平台回调参数
     * @return 支付结果，包含支付状态、支付流水号等信息
     * @throws TakeoutException 回调处理失败时抛出异常
     */
    Map<String, Object> handleCallback(Map<String, String> callbackParams) throws TakeoutException;

    /**
     * 查询支付状态
     * @param paymentNo 支付流水号
     * @return 支付状态 (0:未支付, 1:已支付, 2:支付失败, 3:已退款)
     * @throws TakeoutException 查询失败时抛出异常
     */
    Integer queryPaymentStatus(String paymentNo) throws TakeoutException;

    /**
     * 关闭支付订单
     * @param paymentNo 支付流水号
     * @return 是否关闭成功
     * @throws TakeoutException 关闭失败时抛出异常
     */
    boolean closePayment(String paymentNo) throws TakeoutException;

    /**
     * 申请退款
     * @param paymentNo 支付流水号
     * @param amount 退款金额
     * @param reason 退款原因
     * @return 退款结果，包含退款流水号等信息
     * @throws TakeoutException 退款申请失败时抛出异常
     */
    Map<String, Object> applyRefund(String paymentNo, Double amount, String reason) throws TakeoutException;
}