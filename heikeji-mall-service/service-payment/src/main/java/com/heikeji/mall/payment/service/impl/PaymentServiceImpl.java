package com.heikeji.mall.payment.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.entity.vo.PaymentVO;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.messaging.PaymentMessageProducer;
import com.heikeji.mall.payment.service.PaymentService;
import com.heikeji.mall.payment.service.RiskControlService;
import com.heikeji.mall.payment.service.impl.PaymentStrategyFactory;
import org.springframework.beans.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;

import com.heikeji.mall.payment.constants.PaymentConstants;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * 支付服务实现类
 */
@Service
public class PaymentServiceImpl extends ServiceImpl<PaymentMapper, Payment> implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Autowired
    private PaymentMapper paymentMapper;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private WxPayService wxPayService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private PaymentMessageProducer paymentMessageProducer;
    
    @Autowired
    private PaymentStrategyFactory paymentStrategyFactory;
    
    @Autowired
    private RedissonClient redissonClient;
    
    @Autowired
    private RiskControlService riskControlService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 生成支付订单号
     */
    @Override
    @CacheEvict(value = {"paymentCache"}, allEntries = true)
    public Payment createPayment(Long orderId, String orderNo, BigDecimal amount, Integer paymentType) {
        // 1. 检查是否支持该支付类型
        if (!paymentStrategyFactory.supportsPaymentType(paymentType)) {
            throw new IllegalArgumentException("不支持的支付方式: " + paymentType);
        }
        
        // 2. 先查询是否已存在支付记录（减少锁竞争）
        Payment existingPayment = paymentMapper.selectByOrderNo(orderNo);
        if (existingPayment != null) {
            log.info("订单已存在支付记录: orderNo={}", orderNo);
            return existingPayment;
        }
        
        // 3. 使用分布式锁防止重复创建支付订单
        RLock lock = redissonClient.getLock("payment:create:" + orderNo);
        try {
            // 尝试获取锁，3秒超时，10秒自动过期
            if (lock.tryLock(3, 10, TimeUnit.SECONDS)) {
                try {
                    // 双重检查，防止并发情况下的重复创建
                    existingPayment = paymentMapper.selectByOrderNo(orderNo);
                    if (existingPayment != null) {
                        log.info("订单已存在支付记录: orderNo={}", orderNo);
                        return existingPayment;
                    }
                    
                    // 4. 生成支付订单号
                    String paymentNo = generatePaymentNo();
                    
                    Payment payment = new Payment();
                    payment.setOrderId(orderId);
                    payment.setOrderNo(orderNo);
                    payment.setPaymentNo(paymentNo);
                    payment.setPaymentType(paymentType);
                    payment.setAmount(amount);
                    payment.setStatus(0); // 待支付
                    payment.setCreateTime(new Date());
                    payment.setUpdateTime(new Date());
                    
                    // 5. 保存支付记录（事务内操作）
                    this.savePayment(payment);
                    return payment;
                } finally {
                    if (lock.isHeldByCurrentThread()) {
                        lock.unlock();
                    }
                }
            } else {
                log.error("创建支付订单获取锁失败: orderNo={}", orderNo);
                throw new RuntimeException("系统繁忙，请稍后重试");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("创建支付订单中断: orderNo={}", orderNo, e);
            throw new RuntimeException("创建支付订单失败");
        } catch (Exception e) {
            log.error("创建支付订单异常: orderNo={}", orderNo, e);
            throw new RuntimeException("创建支付订单失败");
        }
    }
    
    /**
     * 保存支付记录（事务内操作）
     */
    @Transactional(rollbackFor = Exception.class)
    public void savePayment(Payment payment) {
        this.save(payment);
    }

    /**
     * 生成微信支付参数
     */
    @Override
    public Map<String, Object> generateWechatPayParams(Long paymentId) {
        Payment payment = this.getById(paymentId);
        if (payment == null) {
            throw new RuntimeException("支付订单不存在");
        }
        
        // 使用策略模式获取支付参数
        return paymentStrategyFactory.getPaymentStrategy(payment.getPaymentType()).initPayment(payment);
    }

    /**
     * 处理微信支付回调
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean processWechatPayNotify(Map<String, String> notifyData) {
        return processPaymentCallback(PaymentConstants.PAYMENT_TYPE.WECHAT_PAY, notifyData);
    }
    
    /**
     * 处理支付宝支付回调
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean processAlipayNotify(Map<String, String> notifyData) {
        return processPaymentCallback(PaymentConstants.PAYMENT_TYPE.ALIPAY, notifyData);
    }
    
    /**
     * 统一处理支付回调
     */
    @Override
    public boolean processPaymentCallback(Integer paymentType, Map<String, String> notifyData) {
        log.info("开始处理支付回调，支付类型: {}, 回调数据: {}", paymentType, notifyData);
        try {
            // 1. 从回调数据中获取订单号（不同支付方式的字段名可能不同）
            String orderNo = notifyData.get("out_trade_no");
            if (orderNo == null) {
                log.error("支付回调中未找到订单号: paymentType={}, 回调数据: {}", paymentType, notifyData);
                return false;
            }
            
            // 2. 获取分布式锁，防止重复处理回调
            String lockKey = "payment:callback:" + orderNo;
            boolean isLocked = false;
            try {
                // 获取锁，设置5秒过期时间
                isLocked = redisTemplate.opsForValue().setIfAbsent(lockKey, "locked", 5, TimeUnit.SECONDS);
                if (!isLocked) {
                    log.info("支付回调已被其他线程处理，订单号：{}", orderNo);
                    return true; // 已被其他线程处理，返回成功
                }
                
                // 3. 使用策略模式处理回调，包含签名验证
                boolean callbackProcessed = paymentStrategyFactory.processCallback(paymentType, notifyData);
                
                if (!callbackProcessed) {
                    log.error("支付回调处理失败: paymentType={}, 回调数据: {}", paymentType, notifyData);
                    return false;
                }
                
                // 4. 从回调数据中获取交易ID
                String transactionId = notifyData.get("transaction_id");
                if (transactionId == null && PaymentConstants.PAYMENT_TYPE.ALIPAY.equals(paymentType)) {
                    // 支付宝回调中的交易ID字段名是trade_no
                    transactionId = notifyData.get("trade_no");
                }
                
                // 5. 查询支付记录
                Payment payment = paymentMapper.selectByOrderNo(orderNo);
                if (payment == null) {
                    log.error("支付回调中订单号不存在: orderNo={}", orderNo);
                    return false;
                }
                
                // 6. 检查订单是否已处理过
                if (payment.getStatus() != 0) {
                    log.info("订单已处理过，订单号: {}, 当前状态: {}", orderNo, payment.getStatus());
                    return true; // 订单已处理过，返回成功
                }
                
                // 7. 事务内更新支付状态
                boolean updateResult = this.updatePaymentStatusForCallback(payment, transactionId);
                if (!updateResult) {
                    log.error("更新支付状态失败，订单号：{}", orderNo);
                    return false;
                }
                
                log.info("支付回调处理成功，订单号：{}", orderNo);
                return true;
            } finally {
                // 释放分布式锁
                if (isLocked) {
                    redisTemplate.delete(lockKey);
                }
            }
        } catch (Exception e) {
            log.error("支付回调处理发生异常，支付类型: {}, 回调数据: {}", paymentType, notifyData, e);
            return false;
        }
    }
    
    /**
     * 更新支付状态（用于回调处理，事务内操作）
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePaymentStatusForCallback(Payment payment, String transactionId) {
        try {
            // 使用乐观锁更新支付状态
            Integer currentVersion = payment.getVersion() != null ? payment.getVersion() : 0;
            
            // 构建更新条件，包含版本号
            QueryWrapper<Payment> updateWrapper = new QueryWrapper<>();
            updateWrapper.eq("id", payment.getId())
                       .eq("version", currentVersion)
                       .eq("status", 0); // 再次检查支付状态，确保是待支付状态
            
            // 构建更新对象
            Payment updatePayment = new Payment();
            updatePayment.setStatus(1); // 已支付
            updatePayment.setPayTime(new Date());
            if (transactionId != null) {
                updatePayment.setTransactionId(transactionId);
            }
            updatePayment.setUpdateTime(new Date());
            updatePayment.setVersion(currentVersion + 1);
            
            // 执行更新操作
            boolean result = this.update(updatePayment, updateWrapper);
            
            if (!result) {
                // 更新失败，可能存在并发冲突
                log.error("更新支付状态失败，可能存在并发冲突，订单号：{}，当前版本：{}", payment.getOrderNo(), currentVersion);
                return false;
            }
            
            // 如果支付成功，发送成功消息
            log.info("更新支付状态成功，订单号：{}，发送支付成功消息", payment.getOrderNo());
            paymentMessageProducer.sendPaymentSuccessMessage(payment);
            
            return true;
        } catch (Exception e) {
            log.error("更新支付状态异常，订单号：{}", payment.getOrderNo(), e);
            // 事务会自动回滚
            return false;
        }
    }

    /**
     * 查询支付状态
     */
    @Override
    @Cacheable(value = "paymentCache", key = "'payment_status_' + #orderNo", unless = "#result == null")
    public Integer queryPaymentStatus(String orderNo) {
        Payment payment = paymentMapper.selectByOrderNo(orderNo);
        if (payment == null) {
            return null;
        }
        
        // 如果本地状态已是已支付，则直接返回
        if (payment.getStatus() == PaymentConstants.PAYMENT_STATUS.PAID) {
            return payment.getStatus();
        }
        
        // 使用策略模式查询最新支付状态
        try {
            Integer latestStatus = paymentStrategyFactory.getPaymentStrategy(payment.getPaymentType())
                .queryPaymentStatus(payment.getId());
            
            // 如果状态更新了，同步到本地数据库
            if (latestStatus != null && latestStatus != payment.getStatus()) {
                // 事务内更新支付状态
                this.updatePaymentStatus(payment, latestStatus);
            }
            
            return latestStatus != null ? latestStatus : payment.getStatus();
        } catch (Exception e) {
            log.error("查询支付状态异常，订单号: {}", orderNo, e);
            // 发生异常时返回本地状态
            return payment.getStatus();
        }
    }
    
    /**
     * 更新支付状态（事务内操作）
     */
    @Transactional(rollbackFor = Exception.class)
    public void updatePaymentStatus(Payment payment, Integer status) {
        payment.setStatus(status);
        if (status == PaymentConstants.PAYMENT_STATUS.PAID) {
            payment.setPayTime(new Date());
        }
        payment.setUpdateTime(new Date());
        this.updateById(payment);
        
        // 如果支付成功，发送成功消息
        if (status == PaymentConstants.PAYMENT_STATUS.PAID) {
            paymentMessageProducer.sendPaymentSuccessMessage(payment);
        }
    }

    /**
     * 退款
     */
    @Override
    @CacheEvict(value = {"paymentCache"}, allEntries = true)
    public boolean refund(String orderNo, BigDecimal refundAmount) {
        // 1. 非事务性查询订单
        Payment payment = paymentMapper.selectByOrderNo(orderNo);
        if (payment == null || payment.getStatus() != 1) {
            throw new RuntimeException("订单未支付或支付记录不存在");
        }
        
        // 2. 生成退款单号（非事务性操作）
        String refundNo = generateRefundNo();
        
        // 3. 调用第三方退款接口（非事务性操作）
        try {
            boolean refundSuccess = paymentStrategyFactory.getPaymentStrategy(payment.getPaymentType())
                .refund(payment.getId(), refundAmount);
            
            if (!refundSuccess) {
                log.error("退款失败，订单号: " + orderNo + ", 退款单号: " + refundNo + ", 退款金额: " + refundAmount);
                return false;
            }
        } catch (Exception e) {
            log.error("退款异常，订单号: " + orderNo, e);
            return false;
        }
        
        // 4. 事务内更新支付记录
        boolean updateSuccess = this.updatePaymentForRefund(payment, refundAmount, refundNo);
        
        if (updateSuccess) {
            // 5. 发送退款成功消息（事务外）
            paymentMessageProducer.sendRefundSuccessMessage(payment, refundAmount, refundNo);
        }
        
        return updateSuccess;
    }
    
    /**
     * 更新支付记录为退款状态（事务内操作）
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePaymentForRefund(Payment payment, BigDecimal refundAmount, String refundNo) {
        try {
            // 使用乐观锁更新
            payment.setRefundAmount(refundAmount);
            payment.setRefundNo(refundNo);
            payment.setStatus(2); // 已退款状态
            payment.setUpdateTime(new Date());
            
            boolean updateResult = this.updateById(payment);
            
            if (updateResult) {
                log.info("退款成功，订单号: " + payment.getOrderNo() + ", 退款单号: " + refundNo + ", 退款金额: " + refundAmount);
            } else {
                log.error("更新支付记录失败，订单号: " + payment.getOrderNo());
            }
            
            return updateResult;
        } catch (Exception e) {
            log.error("更新支付记录异常，订单号: " + payment.getOrderNo(), e);
            return false;
        }
    }

    /**
     * 根据订单号查询支付记录
     */
    @Override
    @Cacheable(value = "paymentCache", key = "'payment_' + #orderNo", unless = "#result == null")
    public Payment getByOrderNo(String orderNo) {
        return paymentMapper.selectByOrderNo(orderNo);
    }
    
    /**
     * 余额支付
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"paymentCache"}, allEntries = true)
    public boolean balancePay(Long paymentId) {
        // 1. 验证支付记录
        Payment payment = this.getById(paymentId);
        if (payment == null || payment.getStatus() != 0) {
            log.error("支付记录无效或已支付: paymentId={}", paymentId);
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "支付记录无效或已支付");
            return false;
        }
        
        // 2. 从订单信息中获取用户ID
        // 注意：实际应用中应当调用订单服务获取用户ID
        Long userId = getUserIdFromOrder(payment.getOrderNo());
        
        // 3. 风险评估
        if (userId != null) {
            // 模拟获取IP地址和设备信息（实际应用中应从请求上下文获取）
            String ip = "127.0.0.1";
            String deviceInfo = "unknown";
            
            // 进行风险评估
            RiskControlService.RiskAssessmentResult riskResult = riskControlService.assessRisk(
                userId, payment.getOrderId(), payment.getAmount(), payment.getPaymentType(), ip, deviceInfo);
            
            if (riskResult.shouldBlock()) {
                log.error("支付存在风险，已拒绝: userId={}, orderNo={}, riskLevel={}, message={}", 
                    userId, payment.getOrderNo(), riskResult.getLevel(), riskResult.getMessage());
                
                // 发送支付失败消息
                paymentMessageProducer.sendPaymentFailedMessage(payment, "支付存在风险，已拒绝: " + riskResult.getMessage());
                return false;
            }
        }
        if (userId == null) {
            log.error("无法获取订单对应的用户ID: orderNo={}", payment.getOrderNo());
            return false;
        }
        boolean hasEnoughBalance = false;
        try {
            // 调用用户服务API检查余额
            String checkBalanceUrl = "http://service-user/api/user/balance/check?userId=" + userId + "&amount=" + payment.getAmount();
            ResponseEntity<Map> response = restTemplate.getForEntity(checkBalanceUrl, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // 用户服务返回的是R对象，需要从data字段获取布尔值
                hasEnoughBalance = Boolean.TRUE.equals(response.getBody().get("data"));
            }
        } catch (Exception e) {
            log.error("调用用户服务检查余额失败: userId={}, amount={}", userId, payment.getAmount(), e);
            return false;
        }
        
        if (!hasEnoughBalance) {
            log.error("用户余额不足: userId={}, required={}", userId, payment.getAmount());
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "用户余额不足");
            return false;
        }
        
        // 3. 调用用户服务扣除余额
        try {
            // 调用用户服务API扣除余额
            String deductUrl = "http://service-user/api/user/balance/deduct/" + userId;
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("amount", payment.getAmount());
            // 使用exchange方法替代putForEntity，更兼容
            ResponseEntity<Map> response = restTemplate.exchange(
                deductUrl,
                org.springframework.http.HttpMethod.PUT,
                new org.springframework.http.HttpEntity<>(requestBody),
                Map.class
            );
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("调用用户服务扣除余额失败: userId={}, amount={}", userId, payment.getAmount());
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "调用用户服务扣除余额失败");
            return false;
            }
            
            // 检查用户服务返回的data字段是否为true，表示扣除成功
            Boolean success = Boolean.TRUE.equals(response.getBody().get("data"));
            if (!success) {
                String msg = (String) response.getBody().get("msg");
                log.error("用户服务返回扣除余额失败: userId={}, amount={}, msg={}", userId, payment.getAmount(), msg);
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "用户服务返回扣除余额失败: " + msg);
            return false;
            }
        } catch (Exception e) {
            log.error("调用用户服务扣除余额异常: userId={}, amount={}", userId, payment.getAmount(), e);
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "调用用户服务扣除余额异常");
            return false;
        }
        
        // 4. 更新支付状态为已支付
        payment.setStatus(1);
        payment.setPayTime(new Date());
        payment.setUpdateTime(new Date());
        
        boolean updateResult = this.updateById(payment);
        
        if (updateResult) {
            log.info("余额支付成功: paymentId={}, amount={}", paymentId, payment.getAmount());
            
            // 发送支付成功消息
            paymentMessageProducer.sendPaymentSuccessMessage(payment);
        } else {
            log.error("更新支付状态失败: paymentId={}", paymentId);
            
            // 发送支付失败消息
            paymentMessageProducer.sendPaymentFailedMessage(payment, "更新支付状态失败");
        }
        
        return updateResult;
    }
    
    /**
     * 从订单号获取用户ID
     * 实际应用中应调用订单服务获取
     */
    private Long getUserIdFromOrder(String orderNo) {
        try {
            // 实际应用中应调用订单服务API获取用户ID
            // 这里简化处理，假设可以通过订单服务获取用户ID
            String getUserUrl = "http://service-order/api/order/getUserIdByOrderNo?orderNo=" + orderNo;
            ResponseEntity<Map> response = restTemplate.getForEntity(getUserUrl, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // 订单服务返回的是R对象，需要从data字段获取用户ID
                Map data = (Map) response.getBody().get("data");
                if (data != null && data.get("userId") != null) {
                    return Long.valueOf(data.get("userId").toString());
                }
            }
        } catch (Exception e) {
            log.error("调用订单服务获取用户ID失败: orderNo={}", orderNo, e);
        }
        // 降级处理：如果无法获取用户ID，返回null
        return null;
    }
    
    /**
     * 充值
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Payment recharge(BigDecimal amount, Integer paymentType) {
        // 生成充值订单号
        String rechargeNo = generateRechargeNo();
        
        Payment payment = new Payment();
        payment.setOrderId(0L); // 充值订单ID为0
        payment.setOrderNo(rechargeNo);
        payment.setPaymentNo(generatePaymentNo());
        payment.setPaymentType(paymentType);
        payment.setAmount(amount);
        payment.setStatus(0); // 待支付
        payment.setCreateTime(new Date());
        payment.setUpdateTime(new Date());
        
        this.save(payment);
        return payment;
    }
    
    /**
     * 获取支付记录列表
     */
    @Override
    public Map<String, Object> getPaymentList(Integer page, Integer size) {
        // 简化实现，实际需要根据用户ID查询用户的订单
        Page<Payment> paymentPage = new Page<>(page, size);
        
        // 这里简化处理，实际应该根据用户ID查询用户相关的支付记录
        QueryWrapper<Payment> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        
        Page<Payment> result = this.page(paymentPage, queryWrapper);
        
        // 将Payment实体列表转换为PaymentVO列表
        List<PaymentVO> paymentVOList = new ArrayList<>();
        for (Payment payment : result.getRecords()) {
            PaymentVO paymentVO = new PaymentVO();
            BeanUtils.copyProperties(payment, paymentVO);
            paymentVOList.add(paymentVO);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("records", paymentVOList);
        response.put("total", result.getTotal());
        response.put("pages", result.getPages());
        response.put("current", result.getCurrent());
        response.put("size", result.getSize());
        
        return response;
    }
    
    /**
     * 生成充值订单号
     */
    private String generateRechargeNo() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String dateStr = sdf.format(new Date());
        String randomStr = String.format("%06d", new Random().nextInt(1000000));
        return "RCG" + dateStr + randomStr;
    }

    /**
     * 生成支付流水号
     */
    private String generatePaymentNo() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String dateStr = sdf.format(new Date());
        String randomStr = String.format("%06d", new Random().nextInt(1000000));
        return "PAY" + dateStr + randomStr;
    }

    /**
     * 生成随机字符串
     */
    private String generateNonceStr() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 32; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * 生成退款单号
     */
    private String generateRefundNo() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String dateStr = sdf.format(new Date());
        StringBuilder sb = new StringBuilder(dateStr);
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(random.nextInt(10));
        }
        return "REF" + sb.toString();
    }
    
    /**
     * 生成签名（模拟实现）
     * 实际项目中需要根据微信支付的签名规则实现
     */
    private String generateSign(Map<String, Object> params) {
        // TODO: 实现真实的微信支付签名算法
        log.info("生成签名，参数: {}", params);
        return "simulated_signature"; // 模拟签名
    }
    

}