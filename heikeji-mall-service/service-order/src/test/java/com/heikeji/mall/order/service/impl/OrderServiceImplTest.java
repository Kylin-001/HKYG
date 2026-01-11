package com.heikeji.mall.order.service.impl;

import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private OrderMapper orderMapper;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        // 初始化测试订单数据
        testOrder = new Order();
        testOrder.setOrderNo("TEST123456");
        testOrder.setUserId(1L);
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
        testOrder.setCreateTime(new Date());
        testOrder.setTotalAmount(new BigDecimal(0));
    }

    /**
     * 测试通过订单号获取订单
     */
    @Test
    void testGetByOrderNo() {
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        
        // 调用获取订单详情方法
        Order result = orderService.getByOrderNo("TEST123456");
        
        // 验证结果
        assertNotNull(result);
        assertEquals("TEST123456", result.getOrderNo());
        verify(orderMapper, times(1)).selectOne(any());
    }

    /**
     * 测试更新订单状态
     */
    @Test
    void testUpdateOrderStatus() {
        // 模拟订单更新
        when(orderMapper.update(any(Order.class), any())).thenReturn(1);
        
        // 调用更新订单状态方法
        boolean result = orderService.updateOrderStatus("TEST123456", OrderConstant.ORDER_STATUS_PAID);
        
        // 验证结果
        assertTrue(result);
        verify(orderMapper, times(1)).update(any(Order.class), any());
    }

    /**
     * 测试支付订单功能
     */
    @Test
    void testPayOrder() {
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用支付方法
        boolean result = orderService.payOrder("TEST123456", OrderConstant.PAY_TYPE_WECHAT);
        
        // 验证支付结果
        assertTrue(result);
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }

    /**
     * 测试取消订单功能
     */
    @Test
    void testCancelOrder() {
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用取消订单方法
        boolean result = orderService.cancelOrder("TEST123456");
        
        // 验证结果
        assertTrue(result);
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }

    /**
     * 测试创建外卖订单
     */
    @Test
    void testCreateTakeoutOrder() {
        // 模拟创建外卖订单的参数
        CreateTakeoutOrderDTO dto = new CreateTakeoutOrderDTO();
        
        // 模拟订单插入，设置ID为100L
        doAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(100L); // 设置ID
            return 1;
        }).when(orderMapper).insert(any(Order.class));
        
        // 调用创建订单方法
        Long orderId = orderService.createTakeoutOrder(1L, "TEST_TAKEOUT", dto);
        
        // 验证订单是否创建成功
        assertNotNull(orderId, "订单ID不应该为null");
        assertEquals(100L, orderId, "订单ID应该为100L");
        verify(orderMapper, times(1)).insert(any(Order.class));
    }

    /**
     * 测试处理支付回调
     */
    @Test
    void testHandlePaymentCallback() {
        // 调用支付回调处理方法
        boolean result = orderService.handlePaymentCallback("TEST123456", OrderConstant.PAY_STATUS_PAID, "TXN123456", new Date());
        
        // 验证回调处理结果
        assertTrue(result);
    }

    /**
     * 测试申请退款
     */
    @Test
    void testApplyRefund() {
        // 设置订单为已支付状态
        testOrder.setId(1L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PAID);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_PAID);
        testOrder.setTotalAmount(new BigDecimal(99.99));
        testOrder.setPayAmount(new BigDecimal(99.99));
        
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用退款申请方法
        boolean result = orderService.applyRefund("TEST123456", 1L, "商品质量问题", new BigDecimal(99.99));
        
        // 验证退款申请结果
        assertTrue(result);
        assertEquals(OrderConstant.ORDER_STATUS_REFUNDING, testOrder.getRefundStatus());
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }

    /**
     * 测试处理退款功能（同意退款）
     */
    @Test
    void testProcessRefund_Agree() {
        // 设置订单为退款中状态
        testOrder.setId(1L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PAID);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_PAID);
        testOrder.setRefundStatus(OrderConstant.ORDER_STATUS_REFUNDING);
        testOrder.setTotalAmount(new BigDecimal(99.99));
        testOrder.setRefundAmount(new BigDecimal(99.99));
        testOrder.setRefundReason("商品质量问题");
        
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用处理退款方法（同意退款）
        boolean result = orderService.processRefund("TEST123456", OrderConstant.ORDER_STATUS_REFUNDED, "admin");
        
        // 验证处理结果
        assertTrue(result);
        assertEquals(OrderConstant.ORDER_STATUS_REFUNDED, testOrder.getRefundStatus());
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }

    /**
     * 测试处理退款功能（拒绝退款）
     */
    @Test
    void testProcessRefund_Reject() {
        // 设置订单为退款中状态
        testOrder.setId(1L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PAID);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_PAID);
        testOrder.setRefundStatus(OrderConstant.ORDER_STATUS_REFUNDING);
        testOrder.setRefundReason("商品质量问题");
        
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用处理退款方法（拒绝退款）
        boolean result = orderService.processRefund("TEST123456", OrderConstant.ORDER_STATUS_CANCELLED, "admin");
        
        // 验证处理结果
        assertTrue(result);
        assertEquals(OrderConstant.ORDER_STATUS_CANCELLED, testOrder.getRefundStatus());
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }
}