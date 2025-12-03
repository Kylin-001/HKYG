package com.heikeji.mall.order.service;

import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.service.OrderService;
// import com.heikeji.mall.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 订单支付流程集成测试
 * 测试完整的订单创建、支付、回调处理流程
 */
@ExtendWith(MockitoExtension.class)
@SpringBootTest
@Transactional  // 使用事务确保测试数据不会污染数据库
public class OrderPaymentIntegrationTest {

    @Autowired
    private OrderService orderService;

    // @Autowired
    // private PaymentService paymentService;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        // 创建测试订单
        testOrder = new Order();
        testOrder.setUserId(1000L);
        testOrder.setOrderType(OrderConstant.ORDER_TYPE_NORMAL);
        testOrder.setReceiverName("测试用户");
        testOrder.setReceiverPhone("13800138000");
        testOrder.setReceiverAddress("测试地址");
    }

    /**
     * 测试完整的订单创建和支付流程
     */
    @Test
    void testCompleteOrderPaymentFlow() {
        // 步骤1: 创建订单
        Order createdOrder = orderService.createOrder(testOrder);
        assertNotNull(createdOrder);
        assertNotNull(createdOrder.getOrderId());
        assertEquals(OrderConstant.ORDER_STATUS_PENDING_PAYMENT, createdOrder.getOrderStatus());
        assertEquals(OrderConstant.PAY_STATUS_UNPAID, createdOrder.getPayStatus());
        assertTrue(createdOrder.getTotalAmount().compareTo(BigDecimal.ZERO) > 0);
        
        String orderId = createdOrder.getOrderId();
        
        // 步骤2: 发起支付
        Boolean paymentResult = orderService.payOrder(orderId, OrderConstant.PAY_METHOD_WECHAT);
        assertTrue(paymentResult);
        
        // 步骤3: 处理支付回调
        Date payTime = new Date();
        String transactionId = "TXN" + System.currentTimeMillis();
        boolean callbackResult = orderService.handlePaymentCallback(orderId, OrderConstant.PAY_STATUS_PAID, transactionId, payTime);
        assertTrue(callbackResult);
        
        // 步骤4: 验证订单状态已更新
        Order updatedOrder = orderService.getOrderByOrderId(orderId);
        assertEquals(OrderConstant.ORDER_STATUS_PAID, updatedOrder.getOrderStatus());
        assertEquals(OrderConstant.PAY_STATUS_PAID, updatedOrder.getPayStatus());
        assertEquals(transactionId, updatedOrder.getTransactionId());
        assertNotNull(updatedOrder.getPayTime());
    }

    /**
     * 测试订单取消和退款流程
     */
    @Test
    void testOrderCancelAndRefundFlow() {
        // 创建并支付订单
        Order createdOrder = orderService.createOrder(testOrder);
        String orderId = createdOrder.getOrderId();
        Boolean paymentResult = orderService.payOrder(orderId, OrderConstant.PAY_METHOD_WECHAT);
        assertTrue(paymentResult);
        orderService.handlePaymentCallback(orderId, OrderConstant.PAY_STATUS_PAID, "TXN_REFUND_TEST", new Date());
        
        // 验证订单已支付
        Order paidOrder = orderService.getOrderByOrderId(orderId);
        assertEquals(OrderConstant.ORDER_STATUS_PAID, paidOrder.getOrderStatus());
        
        // 取消订单（应该触发退款）
        boolean cancelResult = orderService.cancelOrder(orderId, "测试取消退款", 1000L);
        assertTrue(cancelResult);
        
        // 验证订单已取消
        Order cancelledOrder = orderService.getOrderByOrderId(orderId);
        assertEquals(OrderConstant.ORDER_STATUS_CANCELLED, cancelledOrder.getOrderStatus());
        // 注意：实际退款状态需要通过PaymentService查询
    }

    /**
     * 测试外卖订单的创建和支付流程
     */
    @Test
    void testTakeoutOrderPaymentFlow() {
        // 创建外卖订单
        testOrder.setOrderType(OrderConstant.ORDER_TYPE_TAKEOUT);
        Order takeoutOrder = orderService.createTakeoutOrder(testOrder);
        assertNotNull(takeoutOrder);
        assertEquals(OrderConstant.ORDER_TYPE_TAKEOUT, takeoutOrder.getOrderType());
        
        // 验证外卖订单金额（应该包含配送费）
        BigDecimal totalAmount = takeoutOrder.getTotalAmount();
        assertTrue(totalAmount.compareTo(BigDecimal.ZERO) > 0);
        
        // 支付外卖订单
        Boolean paymentResult = orderService.payOrder(takeoutOrder.getOrderId(), OrderConstant.PAY_METHOD_ALIPAY);
        assertTrue(paymentResult);
        
        // 处理支付回调
        boolean callbackResult = orderService.handlePaymentCallback(
                takeoutOrder.getOrderId(), 
                OrderConstant.PAY_STATUS_PAID, 
                "TAKEOUT_TXN" + System.currentTimeMillis(), 
                new Date());
        assertTrue(callbackResult);
        
        // 验证外卖订单状态（支付成功后应该是待接单状态）
        Order paidTakeoutOrder = orderService.getOrderByOrderId(takeoutOrder.getOrderId());
        assertEquals(OrderConstant.ORDER_STATUS_TAKEOUT_WAITING, paidTakeoutOrder.getOrderStatus());
    }

    /**
     * 测试支付失败情况下的订单状态处理
     */
    @Test
    void testPaymentFailureHandling() {
        // 创建订单
        Order createdOrder = orderService.createOrder(testOrder);
        String orderId = createdOrder.getOrderId();
        
        // 处理支付失败回调
        boolean callbackResult = orderService.handlePaymentCallback(
                orderId, 
                OrderConstant.PAY_STATUS_FAILED, 
                "FAILED_TXN" + System.currentTimeMillis(), 
                new Date());
        assertTrue(callbackResult);
        
        // 验证订单状态（应该保持待付款状态，但支付状态为失败）
        Order failedPaymentOrder = orderService.getOrderByOrderId(orderId);
        assertEquals(OrderConstant.ORDER_STATUS_PENDING_PAYMENT, failedPaymentOrder.getOrderStatus());
        assertEquals(OrderConstant.PAY_STATUS_FAILED, failedPaymentOrder.getPayStatus());
    }

    /**
     * 测试订单超时自动取消机制
     */
    @Test
    void testOrderTimeoutCancellation() {
        // 创建订单（模拟31分钟前创建的订单，触发超时）
        Order timeoutOrder = new Order();
        timeoutOrder.setUserId(1001L);
        timeoutOrder.setOrderType(OrderConstant.ORDER_TYPE_NORMAL);
        timeoutOrder.setReceiverName("超时测试用户");
        timeoutOrder.setReceiverPhone("13900139000");
        timeoutOrder.setReceiverAddress("超时测试地址");
        
        Order createdTimeoutOrder = orderService.createOrder(timeoutOrder);
        
        // 使用反射修改创建时间为31分钟前
        try {
            java.lang.reflect.Field createTimeField = Order.class.getDeclaredField("createTime");
            createTimeField.setAccessible(true);
            Date timeoutDate = new Date(System.currentTimeMillis() - (31 * 60 * 1000));
            createTimeField.set(createdTimeoutOrder, timeoutDate);
            
            // 更新到数据库
            orderService.updateById(createdTimeoutOrder);
        } catch (Exception e) {
            fail("设置超时时间失败: " + e.getMessage());
        }
        
        // 调用取消超时订单方法
        int canceledCount = orderService.cancelTimeoutOrders();
        assertTrue(canceledCount >= 1);
        
        // 验证订单已取消
        Order cancelledOrder = orderService.getOrderByOrderId(createdTimeoutOrder.getOrderId());
        assertEquals(OrderConstant.ORDER_STATUS_CANCELLED, cancelledOrder.getOrderStatus());
    }
}