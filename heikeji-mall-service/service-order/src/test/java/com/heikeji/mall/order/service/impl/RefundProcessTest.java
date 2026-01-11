package com.heikeji.mall.order.service.impl;

import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 退款流程测试类
 * 专门测试优化后的退款流程功能
 */
public class RefundProcessTest {

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private OrderMapper orderMapper;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // 初始化测试订单数据
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setUserId(1L);
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PAID);
        testOrder.setPayStatus(OrderConstant.PAY_STATUS_PAID);
        testOrder.setCreateTime(new Date());
        testOrder.setTotalAmount(new BigDecimal(100));
        testOrder.setPayAmount(new BigDecimal(100));
        testOrder.setFreightAmount(new BigDecimal(10));
        testOrder.setDeliveryFee(new BigDecimal(0));
        testOrder.setRefundReason("商品质量问题");
    }

    /**
     * 测试申请退款功能
     */
    @Test
    void testApplyRefund() {
        // 模拟订单查询
        when(orderMapper.selectOne(any())).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // 调用退款申请方法
        boolean result = orderService.applyRefund("TEST123456", 1L, "商品质量问题", new BigDecimal(100));
        
        // 验证退款申请结果
        assertTrue(result, "退款申请应该成功");
        verify(orderMapper, times(1)).updateById(any(Order.class));
    }
}