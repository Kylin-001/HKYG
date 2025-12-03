package com.heikeji.mall.payment.service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 风控服务接口
 * 负责支付风险评估和异常交易检测
 */
public interface RiskControlService {
    
    /**
     * 风险等级枚举
     */
    enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH
    }
    
    /**
     * 评估支付风险
     * @param userId 用户ID
     * @param orderId 订单ID
     * @param amount 支付金额
     * @param paymentType 支付类型
     * @param ip 用户IP地址
     * @param deviceInfo 设备信息
     * @return 风险评估结果
     */
    RiskAssessmentResult assessRisk(Long userId, Long orderId, BigDecimal amount, Integer paymentType, String ip, String deviceInfo);
    
    /**
     * 检查异常支付行为
     * @param userId 用户ID
     * @param amount 支付金额
     * @return 是否存在异常行为
     */
    boolean checkAbnormalPaymentBehavior(Long userId, BigDecimal amount);
    
    /**
     * 记录支付尝试
     * @param userId 用户ID
     * @param orderId 订单ID
     * @param amount 支付金额
     * @param paymentType 支付类型
     * @param ip IP地址
     * @param success 是否成功
     */
    void recordPaymentAttempt(Long userId, Long orderId, BigDecimal amount, Integer paymentType, String ip, boolean success);
    
    /**
     * 验证支付环境安全性
     * @param ip IP地址
     * @param deviceInfo 设备信息
     * @param browserInfo 浏览器信息
     * @return 环境安全检查结果
     */
    EnvironmentCheckResult checkEnvironmentSecurity(String ip, String deviceInfo, String browserInfo);
    
    /**
     * 风险评估结果
     */
    class RiskAssessmentResult {
        private RiskLevel level;
        private String message;
        private boolean shouldBlock;
        private Map<String, String> details;
        
        // 构造方法、getter和setter
        public RiskAssessmentResult() {}
        
        public RiskAssessmentResult(RiskLevel level, String message, boolean shouldBlock) {
            this.level = level;
            this.message = message;
            this.shouldBlock = shouldBlock;
        }
        
        public RiskLevel getLevel() {
            return level;
        }
        
        public void setLevel(RiskLevel level) {
            this.level = level;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public boolean shouldBlock() {
            return shouldBlock;
        }
        
        public void setShouldBlock(boolean shouldBlock) {
            this.shouldBlock = shouldBlock;
        }
        
        public Map<String, String> getDetails() {
            return details;
        }
        
        public void setDetails(Map<String, String> details) {
            this.details = details;
        }
    }
    
    /**
     * 环境安全检查结果
     */
    class EnvironmentCheckResult {
        private boolean secure;
        private String reason;
        
        // 构造方法、getter和setter
        public EnvironmentCheckResult() {}
        
        public EnvironmentCheckResult(boolean secure, String reason) {
            this.secure = secure;
            this.reason = reason;
        }
        
        public boolean isSecure() {
            return secure;
        }
        
        public void setSecure(boolean secure) {
            this.secure = secure;
        }
        
        public String getReason() {
            return reason;
        }
        
        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}