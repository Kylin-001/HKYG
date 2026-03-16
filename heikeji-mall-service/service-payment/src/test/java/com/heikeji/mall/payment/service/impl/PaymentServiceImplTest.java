package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.messaging.PaymentMessageProducer;
import com.heikeji.mall.payment.service.impl.PaymentStrategyFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @BeforeEach
    public void setup() {
        payment = new Payment();
        payment.setId(1L);
        payment.setOrderNo("ORDER123");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setStatus(0);
        payment.setVersion(0);
        payment.setCreateTime(new Date());

        wechatNotifyData = new HashMap<>();
        wechatNotifyData.put("out_trade_no", "ORDER123");
        wechatNotifyData.put("transaction_id", "WX123456");
        wechatNotifyData.put("result_code", "SUCCESS");
    }

    @Test
    public void testProcessPaymentCallback_Success() {
        when(redisTemplate.opsForValue().setIfAbsent(anyString(), any(), anyLong(), any(TimeUnit.class))).thenReturn(true);
        when(paymentStrategyFactory.processCallback(eq(1), anyMap())).thenReturn(true);
        when(paymentMapper.selectByOrderNo(anyString())).thenReturn(payment);
        when(paymentMapper.updateById(any(Payment.class))).thenReturn(1);
        when(redisTemplate.delete(anyString())).thenReturn(true);

        boolean result = paymentService.processPaymentCallback(1, wechatNotifyData);

        assertTrue(result);
        verify(paymentStrategyFactory).processCallback(eq(1), anyMap());
    }
}
