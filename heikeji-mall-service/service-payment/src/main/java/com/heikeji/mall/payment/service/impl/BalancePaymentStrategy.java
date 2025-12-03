package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.constants.PaymentConstants;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.service.PaymentStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * 余额支付策略实现
 */
@Service
public class BalancePaymentStrategy implements PaymentStrategy {
    
    private static final Logger log = LoggerFactory.getLogger(BalancePaymentStrategy.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private PaymentMapper paymentMapper;
    
    /**
     * 初始化余额支付
     */
    @Override
    public Map<String, Object> initPayment(Payment payment) {
        log.info("初始化余额支付，支付ID: {}, 订单号: {}", payment.getId(), payment.getOrderNo());
        
        // 余额支付不需要生成外部支付参数，直接返回支付信息
        Map<String, Object> payParams = new HashMap<>();
        payParams.put("paymentId", payment.getId());
        payParams.put("orderNo", payment.getOrderNo());
        payParams.put("amount", payment.getAmount());
        payParams.put("paymentType", PaymentConstants.PAYMENT_TYPE.BALANCE_PAY);
        payParams.put("needPassword", true); // 余额支付需要密码
        
        log.info("余额支付参数生成成功");
        return payParams;
    }
    
    /**
     * 处理余额支付回调
     * 余额支付是内部支付，不需要外部回调
     */
    @Override
    public boolean processCallback(Map<String, String> notifyData) {
        log.info("余额支付内部回调处理: {}", notifyData);
        return true;
    }
    
    /**
     * 查询余额支付状态
     */
    @Override
    public Integer queryPaymentStatus(Long paymentId) {
        log.info("查询余额支付状态，支付ID: {}", paymentId);
        
        Payment payment = paymentMapper.selectById(paymentId);
        return payment != null ? payment.getStatus() : PaymentConstants.PAYMENT_STATUS.UNKNOWN;
    }
    
    /**
     * 申请余额退款
     */
    @Override
    public boolean refund(Long paymentId, BigDecimal refundAmount) {
        log.info("申请余额退款，支付ID: {}, 退款金额: {}", paymentId, refundAmount);
        
        try {
            Payment payment = paymentMapper.selectById(paymentId);
            if (payment == null) {
                log.error("支付记录不存在，支付ID: {}", paymentId);
                return false;
            }
            
            // 调用用户服务退还余额（使用充值接口实现退款）
            String userServiceUrl = "http://heikeji-mall-user/api/user/balance/recharge/" + payment.getUserId();
            Map<String, Object> refundParams = new HashMap<>();
            refundParams.put("amount", refundAmount);
            
            // 调用用户服务API
            ResponseEntity<Map> response = restTemplate.exchange(
                userServiceUrl,
                org.springframework.http.HttpMethod.PUT,
                new org.springframework.http.HttpEntity<>(refundParams),
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                boolean isSuccess = Boolean.TRUE.equals(result.get("data"));
                log.info("余额退款结果: {}, 用户ID: {}, 退款金额: {}", isSuccess, payment.getUserId(), refundAmount);
                return isSuccess;
            } else {
                String errorMsg = response.getBody() != null ? String.valueOf(response.getBody().get("message")) : "未知错误";
                log.error("余额退款失败，错误信息: {}", errorMsg);
                return false;
            }
        } catch (Exception e) {
            log.error("余额退款失败", e);
            return false;
        }
    }
    
    /**
     * 获取支付方式编码
     */
    @Override
    public Integer getPaymentType() {
        return PaymentConstants.PAYMENT_TYPE.BALANCE_PAY;
    }
    
    /**
     * 验证支付参数
     */
    @Override
    public boolean validateParams(Map<String, Object> params) {
        if (params == null) {
            return false;
        }
        
        // 余额支付需要验证密码
        return params.containsKey("paymentId") && 
               params.get("paymentId") != null && 
               params.containsKey("paymentPassword") && 
               params.get("paymentPassword") != null;
    }
    
    /**
     * 验证用户余额是否充足
     * @param userId 用户ID
     * @param amount 支付金额
     * @return 是否充足
     */
    public boolean checkBalance(Long userId, BigDecimal amount) {
        log.info("验证用户余额，用户ID: {}, 金额: {}", userId, amount);
        
        try {
            // 调用用户服务查询余额
            String userServiceUrl = "http://heikeji-mall-user/api/user/balance/check?userId=" + userId + "&amount=" + amount;
            
            // 调用用户服务API
            ResponseEntity<Map> response = restTemplate.getForEntity(userServiceUrl, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                boolean isSufficient = Boolean.TRUE.equals(result.get("data"));
                log.info("用户余额验证结果: {}, 用户ID: {}, 金额: {}", isSufficient, userId, amount);
                return isSufficient;
            } else {
                String errorMsg = response.getBody() != null ? String.valueOf(response.getBody().get("message")) : "未知错误";
                log.error("验证用户余额失败，错误信息: {}", errorMsg);
                return false;
            }
        } catch (Exception e) {
            log.error("验证用户余额失败", e);
            return false;
        }
    }
    
    /**
     * 扣除用户余额
     * @param userId 用户ID
     * @param amount 支付金额
     * @param paymentPassword 支付密码
     * @return 是否成功
     */
    public boolean deductBalance(Long userId, BigDecimal amount, String paymentPassword) {
        log.info("扣除用户余额，用户ID: {}, 金额: {}", userId, amount);
        
        try {
            // 调用用户服务扣除余额
            String userServiceUrl = "http://heikeji-mall-user/api/user/balance/deduct/" + userId;
            Map<String, Object> deductParams = new HashMap<>();
            deductParams.put("amount", amount);
            deductParams.put("paymentPassword", paymentPassword);
            
            // 调用用户服务API
            ResponseEntity<Map> response = restTemplate.exchange(
                userServiceUrl,
                org.springframework.http.HttpMethod.PUT,
                new org.springframework.http.HttpEntity<>(deductParams),
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                boolean isSuccess = Boolean.TRUE.equals(result.get("data"));
                log.info("用户余额扣除结果: {}, 用户ID: {}, 金额: {}", isSuccess, userId, amount);
                return isSuccess;
            } else {
                String errorMsg = response.getBody() != null ? String.valueOf(response.getBody().get("message")) : "未知错误";
                log.error("扣除用户余额失败，错误信息: {}", errorMsg);
                return false;
            }
        } catch (Exception e) {
            log.error("扣除用户余额失败", e);
            return false;
        }
    }
}