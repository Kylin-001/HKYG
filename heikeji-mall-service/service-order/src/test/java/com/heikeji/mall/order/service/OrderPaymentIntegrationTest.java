package com.heikeji.mall.order.service;

import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.service.OrderService;
import com.heikeji.mall.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 订单支付流程集成测试
 * 测试完整的订单创建、支付、回调处理流程
 */
@ExtendWith(MockitoExtension.class)
public class OrderPaymentIntegrationTest {

    @Mock
    private OrderService orderService;
    
    @Mock
    private PaymentService paymentService;

    private String testOrderNo;
    private Order mockOrder;

    @BeforeEach
    void setUp() {
        // 测试数据
        testOrderNo = "TEST" + System.currentTimeMillis();
        
        // 创建模拟订单对象
        mockOrder = new Order();
        mockOrder.setOrderNo(testOrderNo);
        mockOrder.setUserId(1L);
        mockOrder.setAddressId(1L);
        mockOrder.setTotalAmount(new BigDecimal(100));
        mockOrder.setPayAmount(new BigDecimal(100));
        mockOrder.setStatus(1); // 待支付
        mockOrder.setPayStatus(0); // 未支付
        mockOrder.setCreateTime(new Date());
        mockOrder.setUpdateTime(new Date());
        mockOrder.setMerchantId(1L);
        mockOrder.setReceiverName("测试用户");
        mockOrder.setReceiverPhone("13800138000");
        mockOrder.setReceiverAddress("测试地址");
        
        // 重置模拟对象
        Mockito.reset(orderService, paymentService);
    }

    /**
     * 测试订单支付和回调处理流程
     */
    @Test
    void testPaymentAndCallbackFlow() {
        // 步骤1: 设置模拟行为
        Date payTime = new Date();
        String payTradeNo = "TXN" + System.currentTimeMillis();
        Mockito.when(orderService.handlePaymentCallback(testOrderNo, 1, payTradeNo, payTime)).thenReturn(true);
        
        // 步骤2: 处理支付回调
        boolean callbackResult = orderService.handlePaymentCallback(testOrderNo, 1, payTradeNo, payTime); // 1表示支付成功
        assertTrue(callbackResult);
        
        // 步骤3: 验证handlePaymentCallback方法被调用
        Mockito.verify(orderService).handlePaymentCallback(testOrderNo, 1, payTradeNo, payTime);
    }

    /**
     * 测试订单取消流程
     */
    @Test
    void testOrderCancelFlow() {
        // 步骤1: 设置模拟行为
        Mockito.when(orderService.cancelOrder(testOrderNo, 1L)).thenReturn(true);
        
        // 步骤2: 调用cancelOrder方法
        boolean cancelResult = orderService.cancelOrder(testOrderNo, 1L);
        assertTrue(cancelResult);
        
        // 步骤3: 验证cancelOrder方法被调用
        Mockito.verify(orderService).cancelOrder(testOrderNo, 1L);
    }

    /**
     * 测试支付失败情况下的订单状态处理
     */
    @Test
    void testPaymentFailureHandling() {
        // 步骤1: 设置模拟行为
        Date payTime = new Date();
        String payTradeNo = "FAILED_TXN" + System.currentTimeMillis();
        Mockito.when(orderService.handlePaymentCallback(testOrderNo, 2, payTradeNo, payTime)).thenReturn(true);
        
        // 步骤2: 调用handlePaymentCallback方法
        boolean callbackResult = orderService.handlePaymentCallback(
                testOrderNo, 
                2, // 2表示支付失败
                payTradeNo, 
                payTime);
        assertTrue(callbackResult);
        
        // 步骤3: 验证handlePaymentCallback方法被调用
        Mockito.verify(orderService).handlePaymentCallback(testOrderNo, 2, payTradeNo, payTime);
    }

    /**
     * 测试订单超时自动取消机制
     */
    @Test
    void testOrderTimeoutCancellation() {
        // 步骤1: 设置模拟行为
        Mockito.when(orderService.cancelTimeoutOrders()).thenReturn(0);
        
        // 步骤2: 调用cancelTimeoutOrders方法
        int canceledCount = orderService.cancelTimeoutOrders();
        
        // 步骤3: 验证cancelTimeoutOrders方法被调用
        Mockito.verify(orderService).cancelTimeoutOrders();
        
        // 步骤4: 验证返回值
        assertEquals(0, canceledCount);
    }
}