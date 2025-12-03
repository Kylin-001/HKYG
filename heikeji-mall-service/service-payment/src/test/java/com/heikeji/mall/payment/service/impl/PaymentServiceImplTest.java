package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.service.PaymentMessageProducer;
import com.heikeji.mall.payment.service.PaymentStrategyFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * PaymentServiceImpl单元测试
 */
@ExtendWith(MockitoExtension.class)
public class PaymentServiceImplTest {

    @Mock
    private PaymentMapper paymentMapper;

    @Mock
    private PaymentStrategyFactory paymentStrategyFactory;

    @Mock
    private PaymentMessageProducer paymentMessageProducer;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Payment payment;
    private Map<String, String> wechatNotifyData;
    private Map<String, String> alipayNotifyData;

    @BeforeEach
    public void setup() {
        // 初始化测试数据
        payment = new Payment();
        payment.setId(1L);
        payment.setOrderNo("ORDER123");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setStatus(0); // 待支付
        payment.setVersion(0);
        payment.setCreateTime(new Date());

        // 微信支付回调数据
        wechatNotifyData = new HashMap<>();
        wechatNotifyData.put("out_trade_no", "ORDER123");
        wechatNotifyData.put("transaction_id", "WX123456");
        wechatNotifyData.put("result_code", "SUCCESS");

        // 支付宝支付回调数据
        alipayNotifyData = new HashMap<>();
        alipayNotifyData.put("out_trade_no", "ORDER123");
        alipayNotifyData.put("trade_no", "ALIPAY123456");
        alipayNotifyData.put("trade_status", "TRADE_SUCCESS");
    }

    @Test
    public void testProcessWechatPayNotify_Success() {
        // 模拟策略处理回调成功
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(true);
        // 模拟查询到订单
        when(paymentMapper.selectByOrderNo(eq("ORDER123"))).thenReturn(payment);
        // 模拟更新成功
        when(paymentMapper.updateById(any(Payment.class))).thenReturn(1);

        // 执行测试
        boolean result = paymentService.processWechatPayNotify(wechatNotifyData);

        // 验证结果
        assertTrue(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper).selectByOrderNo(eq("ORDER123"));
        verify(paymentMapper).updateById(any(Payment.class));
        verify(paymentMessageProducer).sendPaymentSuccessMessage(eq(payment));
    }

    @Test
    public void testProcessAlipayNotify_Success() {
        // 模拟策略处理回调成功
        when(paymentStrategyFactory.processCallback(eq(2), anyMap())).thenReturn(true);
        // 模拟查询到订单
        when(paymentMapper.selectByOrderNo(eq("ORDER123"))).thenReturn(payment);
        // 模拟更新成功
        when(paymentMapper.updateById(any(Payment.class))).thenReturn(1);

        // 执行测试
        boolean result = paymentService.processAlipayNotify(alipayNotifyData);

        // 验证结果
        assertTrue(result);
        verify(paymentStrategyFactory).processCallback(eq(2), anyMap());
        verify(paymentMapper).selectByOrderNo(eq("ORDER123"));
        verify(paymentMapper).updateById(any(Payment.class));
        verify(paymentMessageProducer).sendPaymentSuccessMessage(eq(payment));
    }

    @Test
    public void testProcessPaymentCallback_StrategyFailed() {
        // 模拟Redis分布式锁获取成功
        when(redisTemplate.opsForValue().setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS))).thenReturn(true);
        // 模拟策略处理回调失败
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(false);
        // 模拟删除锁
        when(redisTemplate.delete(eq("payment:callback:ORDER123"))).thenReturn(true);

        // 执行测试
        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        // 验证结果
        assertFalse(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper, never()).selectByOrderNo(anyString());
        verify(redisTemplate.opsForValue()).setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS));
        verify(redisTemplate).delete(eq("payment:callback:ORDER123"));
    }

    @Test
    public void testProcessPaymentCallback_OrderNotFound() {
        // 模拟Redis分布式锁获取成功
        when(redisTemplate.opsForValue().setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS))).thenReturn(true);
        // 模拟策略处理回调成功
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(true);
        // 模拟查询不到订单
        when(paymentMapper.selectByOrderNo(eq("ORDER123"))).thenReturn(null);
        // 模拟删除锁
        when(redisTemplate.delete(eq("payment:callback:ORDER123"))).thenReturn(true);

        // 执行测试
        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        // 验证结果
        assertFalse(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper).selectByOrderNo(eq("ORDER123"));
        verify(paymentMapper, never()).updateById(any(Payment.class));
        verify(redisTemplate.opsForValue()).setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS));
        verify(redisTemplate).delete(eq("payment:callback:ORDER123"));
    }

    @Test
    public void testProcessPaymentCallback_OrderAlreadyPaid() {
        // 模拟Redis分布式锁获取成功
        when(redisTemplate.opsForValue().setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS))).thenReturn(true);
        // 模拟订单已支付
        payment.setStatus(1);
        // 模拟策略处理回调成功
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(true);
        // 模拟查询到订单
        when(paymentMapper.selectByOrderNo(eq("ORDER123"))).thenReturn(payment);
        // 模拟删除锁
        when(redisTemplate.delete(eq("payment:callback:ORDER123"))).thenReturn(true);

        // 执行测试
        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        // 验证结果
        assertTrue(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper).selectByOrderNo(eq("ORDER123"));
        verify(paymentMapper, never()).updateById(any(Payment.class));
        verify(paymentMessageProducer, never()).sendPaymentSuccessMessage(any(Payment.class));
        verify(redisTemplate.opsForValue()).setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS));
        verify(redisTemplate).delete(eq("payment:callback:ORDER123"));
    }

    @Test
    public void testProcessPaymentCallback_UpdateFailed() {
        // 模拟Redis分布式锁获取成功
        when(redisTemplate.opsForValue().setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS))).thenReturn(true);
        // 模拟策略处理回调成功
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(true);
        // 模拟查询到订单
        when(paymentMapper.selectByOrderNo(eq("ORDER123"))).thenReturn(payment);
        // 模拟更新失败
        when(paymentMapper.updateById(any(Payment.class))).thenReturn(0);
        // 模拟删除锁
        when(redisTemplate.delete(eq("payment:callback:ORDER123"))).thenReturn(true);

        // 执行测试
        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        // 验证结果
        assertFalse(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper).selectByOrderNo(eq("ORDER123"));
        verify(paymentMapper).updateById(any(Payment.class));
        verify(paymentMessageProducer, never()).sendPaymentSuccessMessage(any(Payment.class));
        verify(redisTemplate.opsForValue()).setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS));
        verify(redisTemplate).delete(eq("payment:callback:ORDER123"));
    }

    @Test
    public void testProcessPaymentCallback_Exception() {
        // 模拟Redis分布式锁获取成功
        when(redisTemplate.opsForValue().setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS))).thenReturn(true);
        // 模拟策略处理回调时抛出异常
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenThrow(new RuntimeException("测试异常"));
        // 模拟删除锁
        when(redisTemplate.delete(eq("payment:callback:ORDER123"))).thenReturn(true);

        // 执行测试
        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        // 验证结果
        assertFalse(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
        verify(paymentMapper, never()).selectByOrderNo(anyString());
        verify(redisTemplate.opsForValue()).setIfAbsent(eq("payment:callback:ORDER123"), eq("locked"), eq(5L), eq(TimeUnit.SECONDS));
        verify(redisTemplate).delete(eq("payment:callback:ORDER123"));
    }
}