package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.service.RiskControlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 风控服务实现类
 */
@Service
public class RiskControlServiceImpl implements RiskControlService {
    private static final Logger log = LoggerFactory.getLogger(RiskControlServiceImpl.class);
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 支付金额阈值配置
    @Value("${payment.risk.high-amount-threshold:5000}")
    private BigDecimal HIGH_AMOUNT_THRESHOLD;
    
    @Value("${payment.risk.medium-amount-threshold:1000}")
    private BigDecimal MEDIUM_AMOUNT_THRESHOLD;
    
    // 频率限制配置
    @Value("${payment.risk.max-attempts-per-minute:3}")
    private int MAX_ATTEMPTS_PER_MINUTE;
    
    @Value("${payment.risk.max-attempts-per-hour:10}")
    private int MAX_ATTEMPTS_PER_HOUR;
    
    // 风险IP配置
    @Value("#{'${payment.risk.risk-ips:127.0.0.1,192.168.0.1}'.split(',')}")
    private String[] RISK_IPS;
    
    @Override
    public RiskAssessmentResult assessRisk(Long userId, Long orderId, BigDecimal amount, Integer paymentType, String ip, String deviceInfo) {
        log.info("开始风险评估: userId={}, orderId={}, amount={}, paymentType={}, ip={}", 
                 userId, orderId, amount, paymentType, ip);
        
        Map<String, String> riskDetails = new HashMap<>();
        
        // 1. 检查用户是否被风控
        if (isUserBlocked(userId)) {
            riskDetails.put("block_reason", "用户已被风控系统锁定");
            return new RiskAssessmentResult(RiskLevel.HIGH, "用户账户存在风险，请联系客服", true);
        }
        
        // 2. 金额风险评估
        RiskLevel amountRiskLevel = assessAmountRisk(amount);
        if (amountRiskLevel == RiskLevel.HIGH) {
            riskDetails.put("amount_risk", "支付金额过高");
        } else if (amountRiskLevel == RiskLevel.MEDIUM) {
            riskDetails.put("amount_risk", "支付金额较大");
        }
        
        // 3. 频率风险评估
        RiskLevel frequencyRiskLevel = assessFrequencyRisk(userId);
        if (frequencyRiskLevel == RiskLevel.HIGH) {
            riskDetails.put("frequency_risk", "短时间内支付频率过高");
            return new RiskAssessmentResult(RiskLevel.HIGH, "支付操作过于频繁，请稍后重试", true);
        } else if (frequencyRiskLevel == RiskLevel.MEDIUM) {
            riskDetails.put("frequency_risk", "支付频率较高");
        }
        
        // 4. IP风险评估
        RiskLevel ipRiskLevel = assessIpRisk(ip);
        if (ipRiskLevel == RiskLevel.HIGH) {
            riskDetails.put("ip_risk", "IP地址存在风险");
            return new RiskAssessmentResult(RiskLevel.HIGH, "当前网络环境存在风险，请更换网络重试", true);
        }
        
        // 5. 综合风险等级
        RiskLevel finalRiskLevel = getMaxRiskLevel(amountRiskLevel, frequencyRiskLevel, ipRiskLevel);
        
        // 6. 根据风险等级生成结果
        RiskAssessmentResult result;
        if (finalRiskLevel == RiskLevel.HIGH) {
            result = new RiskAssessmentResult(RiskLevel.HIGH, "支付存在高风险，请谨慎操作", true);
        } else if (finalRiskLevel == RiskLevel.MEDIUM) {
            result = new RiskAssessmentResult(RiskLevel.MEDIUM, "支付存在一定风险，建议验证支付密码", false);
        } else {
            result = new RiskAssessmentResult(RiskLevel.LOW, "支付风险正常", false);
        }
        
        result.setDetails(riskDetails);
        log.info("风险评估完成: userId={}, riskLevel={}, shouldBlock={}", userId, finalRiskLevel, result.shouldBlock());
        
        return result;
    }
    
    @Override
    public boolean checkAbnormalPaymentBehavior(Long userId, BigDecimal amount) {
        // 检查短时间内多次支付失败
        String failKey = "payment:fail:" + userId;
        Integer failCount = (Integer) redisTemplate.opsForValue().get(failKey);
        if (failCount != null && failCount >= 3) {
            log.warn("检测到异常支付行为: 用户短时间内多次支付失败 userId={}, failCount={}", userId, failCount);
            return true;
        }
        
        // 检查大额支付异常模式
        if (amount.compareTo(HIGH_AMOUNT_THRESHOLD) > 0) {
            // 检查用户历史支付金额是否通常较低
            String avgAmountKey = "payment:avg_amount:" + userId;
            Object avgAmountObj = redisTemplate.opsForValue().get(avgAmountKey);
            if (avgAmountObj != null) {
                BigDecimal avgAmount = new BigDecimal(avgAmountObj.toString());
                // 如果本次支付金额是平均金额的5倍以上，视为异常
                if (amount.compareTo(avgAmount.multiply(new BigDecimal(5))) > 0) {
                    log.warn("检测到异常支付行为: 支付金额远超用户平均水平 userId={}, amount={}, avgAmount={}", 
                             userId, amount, avgAmount);
                    return true;
                }
            }
        }
        
        return false;
    }
    
    @Override
    public void recordPaymentAttempt(Long userId, Long orderId, BigDecimal amount, Integer paymentType, String ip, boolean success) {
        String key = "payment:attempt:" + userId + ":" + System.currentTimeMillis() / 60000; // 按分钟统计
        redisTemplate.opsForValue().increment(key, 1);
        redisTemplate.expire(key, 24, TimeUnit.HOURS);
        
        // 记录小时级别的尝试次数
        String hourKey = "payment:attempt:hour:" + userId + ":" + System.currentTimeMillis() / 3600000;
        redisTemplate.opsForValue().increment(hourKey, 1);
        redisTemplate.expire(hourKey, 24, TimeUnit.HOURS);
        
        // 如果支付成功，更新用户的平均支付金额
        if (success) {
            String avgAmountKey = "payment:avg_amount:" + userId;
            Object avgAmountObj = redisTemplate.opsForValue().get(avgAmountKey);
            Object countObj = redisTemplate.opsForValue().get("payment:count:" + userId);
            
            int count = countObj != null ? Integer.parseInt(countObj.toString()) : 0;
            BigDecimal newAvg;
            
            if (avgAmountObj != null) {
                BigDecimal oldAvg = new BigDecimal(avgAmountObj.toString());
                newAvg = oldAvg.multiply(new BigDecimal(count)).add(amount)
                              .divide(new BigDecimal(count + 1), 2, BigDecimal.ROUND_HALF_UP);
            } else {
                newAvg = amount;
            }
            
            redisTemplate.opsForValue().set(avgAmountKey, newAvg.toString());
            redisTemplate.expire(avgAmountKey, 30, TimeUnit.DAYS);
            
            redisTemplate.opsForValue().set("payment:count:" + userId, count + 1);
            redisTemplate.expire("payment:count:" + userId, 30, TimeUnit.DAYS);
            
            // 清除失败计数
            redisTemplate.delete("payment:fail:" + userId);
        } else {
            // 记录失败次数
            String failKey = "payment:fail:" + userId;
            redisTemplate.opsForValue().increment(failKey, 1);
            redisTemplate.expire(failKey, 1, TimeUnit.HOURS);
        }
        
        log.info("记录支付尝试: userId={}, orderId={}, success={}", userId, orderId, success);
    }
    
    @Override
    public EnvironmentCheckResult checkEnvironmentSecurity(String ip, String deviceInfo, String browserInfo) {
        // 检查IP是否在风险列表中
        for (String riskIp : RISK_IPS) {
            if (riskIp.equals(ip)) {
                return new EnvironmentCheckResult(false, "IP地址存在安全风险");
            }
        }
        
        // 检查设备信息是否合理
        if (StringUtils.isEmpty(deviceInfo)) {
            return new EnvironmentCheckResult(false, "设备信息缺失");
        }
        
        // 检查浏览器信息
        if (StringUtils.isEmpty(browserInfo)) {
            return new EnvironmentCheckResult(false, "浏览器信息缺失");
        }
        
        // 检查是否是模拟器环境（示例逻辑）
        if (browserInfo.contains("Emulator") || browserInfo.contains("Simulator")) {
            return new EnvironmentCheckResult(false, "检测到模拟器环境，存在安全风险");
        }
        
        return new EnvironmentCheckResult(true, "环境安全");
    }
    
    /**
     * 评估金额风险
     */
    private RiskLevel assessAmountRisk(BigDecimal amount) {
        if (amount.compareTo(HIGH_AMOUNT_THRESHOLD) > 0) {
            return RiskLevel.HIGH;
        } else if (amount.compareTo(MEDIUM_AMOUNT_THRESHOLD) > 0) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }
    
    /**
     * 评估频率风险
     */
    private RiskLevel assessFrequencyRisk(Long userId) {
        // 检查每分钟的尝试次数
        String minuteKey = "payment:attempt:" + userId + ":" + System.currentTimeMillis() / 60000;
        Integer minuteCount = (Integer) redisTemplate.opsForValue().get(minuteKey);
        if (minuteCount != null && minuteCount >= MAX_ATTEMPTS_PER_MINUTE) {
            return RiskLevel.HIGH;
        }
        
        // 检查每小时的尝试次数
        String hourKey = "payment:attempt:hour:" + userId + ":" + System.currentTimeMillis() / 3600000;
        Integer hourCount = (Integer) redisTemplate.opsForValue().get(hourKey);
        if (hourCount != null && hourCount >= MAX_ATTEMPTS_PER_HOUR) {
            return RiskLevel.MEDIUM;
        }
        
        return RiskLevel.LOW;
    }
    
    /**
     * 评估IP风险
     */
    private RiskLevel assessIpRisk(String ip) {
        for (String riskIp : RISK_IPS) {
            if (riskIp.equals(ip)) {
                return RiskLevel.HIGH;
            }
        }
        
        // 检查IP的尝试次数
        String ipKey = "payment:ip:" + ip + ":" + System.currentTimeMillis() / 3600000;
        Integer ipCount = (Integer) redisTemplate.opsForValue().get(ipKey);
        if (ipCount != null && ipCount >= 20) { // 同一IP每小时超过20次支付尝试
            return RiskLevel.MEDIUM;
        }
        
        return RiskLevel.LOW;
    }
    
    /**
     * 获取最高风险等级
     */
    private RiskLevel getMaxRiskLevel(RiskLevel... levels) {
        RiskLevel maxLevel = RiskLevel.LOW;
        for (RiskLevel level : levels) {
            if (level.ordinal() > maxLevel.ordinal()) {
                maxLevel = level;
            }
        }
        return maxLevel;
    }
    
    /**
     * 检查用户是否被风控系统锁定
     */
    private boolean isUserBlocked(Long userId) {
        String blockKey = "payment:block:" + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(blockKey));
    }
    
    /**
     * 锁定风险用户
     */
    public void blockUser(Long userId, String reason, int hours) {
        String blockKey = "payment:block:" + userId;
        redisTemplate.opsForValue().set(blockKey, reason);
        redisTemplate.expire(blockKey, hours, TimeUnit.HOURS);
        log.warn("锁定风险用户: userId={}, reason={}, hours={}", userId, reason, hours);
    }
    
    /**
     * 解除用户锁定
     */
    public void unblockUser(Long userId) {
        String blockKey = "payment:block:" + userId;
        redisTemplate.delete(blockKey);
        log.info("解除用户锁定: userId={}", userId);
    }
}