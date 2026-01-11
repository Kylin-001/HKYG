package com.heikeji.mall.order.service;

import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.service.impl.OrderServiceImpl;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.mapper.OrderItemMapper;
import com.heikeji.mall.order.service.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 订单服务简单测试类
 * 测试核心功能，不依赖其他服务
 */
@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTestSimple {

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private OrderItemMapper orderItemMapper;

    @Mock
    private OrderItemService orderItemService;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        // 初始化测试订单
        testOrder = new Order();
        testOrder.setId(100L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setUserId(1L);
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
        testOrder.setTotalAmount(new BigDecimal(100));
        testOrder.setCreateTime(new Date());
    }

    /**
     * 测试订单号生成功能
     */
    @Test
    void testGenerateOrderNo() {
        try {
            // 使用反射调用私有方法
            java.lang.reflect.Method method = OrderServiceImpl.class.getDeclaredMethod(
                "generateOrderNo");
            method.setAccessible(true);
            String orderNo = (String) method.invoke(orderService);
            
            // 验证订单号生成
            assertNotNull(orderNo);
            assertFalse(orderNo.isEmpty());
            assertEquals(20, orderNo.length()); // 验证格式为20位数字(14位日期+6位随机数)
        } catch (Exception e) {
            fail("订单号生成测试失败: " + e.getMessage());
        }
    }

    /**
     * 测试订单取消功能
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
     * 测试获取订单详情功能
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
     * 测试更新订单状态功能
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
}