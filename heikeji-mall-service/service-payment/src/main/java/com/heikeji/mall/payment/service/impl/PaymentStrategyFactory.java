package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.constants.PaymentConstants;
import com.heikeji.mall.payment.service.PaymentStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 支付策略工厂
 * 用于根据支付类型获取对应的支付策略实现
 */
@Component
public class PaymentStrategyFactory {
    
    // 存储所有支付策略实现的映射表
    private final Map<Integer, PaymentStrategy> paymentStrategyMap = new HashMap<>();
    
    /**
     * 构造函数，自动注入所有支付策略实现
     * @param paymentStrategies 支付策略列表
     */
    @Autowired
    public PaymentStrategyFactory(List<PaymentStrategy> paymentStrategies) {
        // 初始化支付策略映射表
        for (PaymentStrategy strategy : paymentStrategies) {
            paymentStrategyMap.put(strategy.getPaymentType(), strategy);
        }
    }
    
    /**
     * 根据支付类型获取对应的支付策略实现
     * @param paymentType 支付类型
     * @return 支付策略实现
     * @throws IllegalArgumentException 当支付类型不支持时抛出异常
     */
    public PaymentStrategy getPaymentStrategy(Integer paymentType) {
        PaymentStrategy strategy = paymentStrategyMap.get(paymentType);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式: " + paymentType);
        }
        return strategy;
    }
    
    /**
     * 检查是否支持指定的支付类型
     * @param paymentType 支付类型
     * @return 是否支持
     */
    public boolean supportsPaymentType(Integer paymentType) {
        return paymentStrategyMap.containsKey(paymentType);
    }
    
    /**
     * 使用指定支付类型的策略处理支付回调
     * @param paymentType 支付类型
     * @param notifyData 回调数据
     * @return 处理结果
     */
    public boolean processCallback(Integer paymentType, Map<String, String> notifyData) {
        PaymentStrategy strategy = getPaymentStrategy(paymentType);
        return strategy.processCallback(notifyData);
    }
    
    /**
     * 获取所有支持的支付类型
     * @return 支持的支付类型列表
     */
    public Map<Integer, String> getSupportedPaymentTypes() {
        Map<Integer, String> supportedTypes = new HashMap<>();
        
        // 添加微信支付
        if (supportsPaymentType(PaymentConstants.PAYMENT_TYPE.WECHAT_PAY)) {
            supportedTypes.put(PaymentConstants.PAYMENT_TYPE.WECHAT_PAY, "微信支付");
        }
        
        // 添加支付宝支付
        if (supportsPaymentType(PaymentConstants.PAYMENT_TYPE.ALIPAY)) {
            supportedTypes.put(PaymentConstants.PAYMENT_TYPE.ALIPAY, "支付宝支付");
        }
        
        // 添加余额支付
        if (supportsPaymentType(PaymentConstants.PAYMENT_TYPE.BALANCE_PAY)) {
            supportedTypes.put(PaymentConstants.PAYMENT_TYPE.BALANCE_PAY, "余额支付");
        }
        
        // 添加校园卡支付
        if (supportsPaymentType(PaymentConstants.PAYMENT_TYPE.CAMPUS_CARD_PAY)) {
            supportedTypes.put(PaymentConstants.PAYMENT_TYPE.CAMPUS_CARD_PAY, "校园卡支付");
        }
        
        return supportedTypes;
    }
}